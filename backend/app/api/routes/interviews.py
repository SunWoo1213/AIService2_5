"""
Interview Routes
"""
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core import get_db
from app.api.dependencies import get_current_user
from app.models import User, InterviewSession, InterviewTurn, CoverLetter, JobPosting
from app.schemas import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewResultResponse
)
from app.services import OpenAIService, s3_service

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("/start", response_model=dict, status_code=status.HTTP_201_CREATED)
async def start_interview(
    session_data: InterviewSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start new interview session
    """
    # Validate cover letter
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == session_data.cover_letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    # Create session
    session = InterviewSession(
        user_id=current_user.id,
        cover_letter_id=cover_letter.id,
        status="in_progress"
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Generate first question
    job_posting = cover_letter.job_posting
    context = f"{job_posting.ai_analysis.get('keywords', [])[0] if job_posting and job_posting.ai_analysis else '해당 분야'} 전문가이자 면접관"
    
    question_text = await OpenAIService.generate_interview_question(
        context=context,
        turn_number=1
    )
    
    # Generate TTS
    audio_content = await OpenAIService.generate_tts(question_text)
    
    # Upload to S3
    file_key = s3_service.generate_file_key(
        prefix=f"interviews/{session.id}/questions",
        filename=f"question_1.mp3"
    )
    question_audio_url = s3_service.upload_file(
        file_content=audio_content,
        file_key=file_key,
        content_type="audio/mpeg"
    )
    
    # Create first turn
    turn = InterviewTurn(
        session_id=session.id,
        turn_number=1,
        question_text=question_text,
        question_audio_url=question_audio_url
    )
    
    db.add(turn)
    db.commit()
    db.refresh(turn)
    
    return {
        "session_id": session.id,
        "status": session.status,
        "current_turn": {
            "turn_number": turn.turn_number,
            "question_text": turn.question_text,
            "question_audio_url": turn.question_audio_url
        }
    }


@router.post("/{session_id}/answer", response_model=dict)
async def submit_answer(
    session_id: int,
    turn_number: int = Form(...),
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit answer for current turn and get next question
    """
    # Validate session
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    # Get current turn
    turn = db.query(InterviewTurn).filter(
        InterviewTurn.session_id == session_id,
        InterviewTurn.turn_number == turn_number
    ).first()
    
    if not turn:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview turn not found"
        )
    
    # Upload answer audio to S3
    audio_content = await audio.read()
    answer_file_key = s3_service.generate_file_key(
        prefix=f"interviews/{session_id}/answers",
        filename=f"answer_{turn_number}.{audio.filename.split('.')[-1]}"
    )
    answer_audio_url = s3_service.upload_file(
        file_content=audio_content,
        file_key=answer_file_key,
        content_type=audio.content_type
    )
    
    # Transcribe with Whisper
    audio.file.seek(0)  # Reset file pointer
    answer_stt_text = await OpenAIService.transcribe_audio(audio.file)
    
    # Update turn
    turn.answer_audio_url = answer_audio_url
    turn.answer_stt_text = answer_stt_text
    db.commit()
    
    # Check if interview is complete (5 turns)
    if turn_number >= 5:
        session.status = "completed"
        session.completed_at = datetime.utcnow()
        db.commit()
        
        # Generate feedback asynchronously (in real app, use background tasks)
        await generate_feedback_for_session(session_id, db)
        
        return {
            "turn_number": turn_number,
            "answer_audio_url": answer_audio_url,
            "answer_stt_text": answer_stt_text,
            "interview_completed": True,
            "message": "면접이 종료되었습니다. 피드백을 생성 중입니다."
        }
    
    # Generate next question
    previous_turns = db.query(InterviewTurn).filter(
        InterviewTurn.session_id == session_id
    ).order_by(InterviewTurn.turn_number).all()
    
    previous_qa = [
        {
            "question": t.question_text,
            "answer": t.answer_stt_text
        }
        for t in previous_turns if t.answer_stt_text
    ]
    
    cover_letter = session.cover_letter
    job_posting = cover_letter.job_posting
    context = f"{job_posting.ai_analysis.get('keywords', [])[0] if job_posting and job_posting.ai_analysis else '해당 분야'} 전문가이자 면접관"
    
    next_question_text = await OpenAIService.generate_interview_question(
        context=context,
        turn_number=turn_number + 1,
        previous_qa=previous_qa
    )
    
    # Generate TTS for next question
    next_audio_content = await OpenAIService.generate_tts(next_question_text)
    
    next_file_key = s3_service.generate_file_key(
        prefix=f"interviews/{session_id}/questions",
        filename=f"question_{turn_number + 1}.mp3"
    )
    next_question_audio_url = s3_service.upload_file(
        file_content=next_audio_content,
        file_key=next_file_key,
        content_type="audio/mpeg"
    )
    
    # Create next turn
    next_turn = InterviewTurn(
        session_id=session_id,
        turn_number=turn_number + 1,
        question_text=next_question_text,
        question_audio_url=next_question_audio_url
    )
    
    db.add(next_turn)
    db.commit()
    db.refresh(next_turn)
    
    return {
        "turn_number": turn_number,
        "answer_audio_url": answer_audio_url,
        "answer_stt_text": answer_stt_text,
        "next_turn": {
            "turn_number": next_turn.turn_number,
            "question_text": next_turn.question_text,
            "question_audio_url": next_turn.question_audio_url
        }
    }


async def generate_feedback_for_session(session_id: int, db: Session):
    """
    Generate feedback for completed interview session
    """
    turns = db.query(InterviewTurn).filter(
        InterviewTurn.session_id == session_id
    ).order_by(InterviewTurn.turn_number).all()
    
    turns_data = [
        {
            "turn_number": t.turn_number,
            "question": t.question_text,
            "answer": t.answer_stt_text
        }
        for t in turns
    ]
    
    feedback_result = await OpenAIService.generate_interview_feedback(turns_data)
    
    # Update session with total feedback
    session = db.query(InterviewSession).get(session_id)
    session.total_feedback = feedback_result.get("total_feedback")
    
    # Update each turn with individual feedback
    turn_feedbacks = feedback_result.get("turn_feedbacks", [])
    for i, turn in enumerate(turns):
        if i < len(turn_feedbacks):
            turn.turn_feedback = turn_feedbacks[i]
    
    db.commit()


@router.get("/{session_id}/result", response_model=InterviewResultResponse)
async def get_interview_result(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get interview result with feedback
    """
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found"
        )
    
    # Get all turns
    turns = db.query(InterviewTurn).filter(
        InterviewTurn.session_id == session_id
    ).order_by(InterviewTurn.turn_number).all()
    
    return {
        **session.__dict__,
        "turns": turns
    }


@router.get("/history", response_model=List[InterviewSessionResponse])
async def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get interview history for current user
    """
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).all()
    
    return sessions

