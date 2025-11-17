"""
Cover Letter Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core import get_db
from app.api.dependencies import get_current_user
from app.models import User, CoverLetter, JobPosting
from app.schemas import CoverLetterCreate, CoverLetterUpdate, CoverLetterResponse
from app.services import OpenAIService

router = APIRouter(prefix="/cover-letters", tags=["Cover Letters"])


@router.post("", response_model=CoverLetterResponse, status_code=status.HTTP_201_CREATED)
async def create_cover_letter(
    cover_letter_data: CoverLetterCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create cover letter and generate AI feedback
    """
    # Validate job posting if provided
    if cover_letter_data.job_posting_id:
        job_posting = db.query(JobPosting).filter(
            JobPosting.id == cover_letter_data.job_posting_id,
            JobPosting.user_id == current_user.id
        ).first()
        
        if not job_posting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
    
    # Create cover letter
    cover_letter = CoverLetter(
        user_id=current_user.id,
        job_posting_id=cover_letter_data.job_posting_id,
        content=cover_letter_data.content
    )
    
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    
    # Generate AI feedback
    if cover_letter_data.job_posting_id:
        user_spec = f"""
        이름: {current_user.name}
        나이: {current_user.age}
        성별: {current_user.gender}
        경력: {current_user.career_summary}
        자격증: {current_user.certifications}
        """
        
        feedback = await OpenAIService.generate_cover_letter_feedback(
            user_spec=user_spec,
            job_analysis=job_posting.ai_analysis,
            cover_letter=cover_letter_data.content
        )
        
        cover_letter.ai_feedback = feedback
        db.commit()
        db.refresh(cover_letter)
    
    return cover_letter


@router.get("", response_model=List[CoverLetterResponse])
async def list_cover_letters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all cover letters for current user
    """
    cover_letters = db.query(CoverLetter).filter(
        CoverLetter.user_id == current_user.id
    ).order_by(CoverLetter.created_at.desc()).all()
    
    return cover_letters


@router.get("/{letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get cover letter by ID
    """
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    return cover_letter


@router.patch("/{letter_id}", response_model=CoverLetterResponse)
async def update_cover_letter(
    letter_id: int,
    update_data: CoverLetterUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update cover letter
    """
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    # Update fields
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(cover_letter, field, value)
    
    db.commit()
    db.refresh(cover_letter)
    
    return cover_letter


@router.delete("/{letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter(
    letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete cover letter
    """
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    db.delete(cover_letter)
    db.commit()

