"""
Interview Schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InterviewTurnBase(BaseModel):
    """Base interview turn schema"""
    turn_number: int
    question_text: str


class InterviewTurnCreate(BaseModel):
    """Interview turn creation (for answer submission)"""
    turn_number: int


class InterviewTurnResponse(InterviewTurnBase):
    """Interview turn response schema"""
    id: int
    session_id: int
    question_audio_url: Optional[str] = None
    answer_audio_url: Optional[str] = None
    answer_stt_text: Optional[str] = None
    turn_feedback: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class InterviewSessionCreate(BaseModel):
    """Interview session creation schema"""
    cover_letter_id: int


class InterviewSessionResponse(BaseModel):
    """Interview session response schema"""
    id: int
    user_id: int
    cover_letter_id: int
    status: str
    total_feedback: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class InterviewResultResponse(InterviewSessionResponse):
    """Interview result with turns"""
    turns: List[InterviewTurnResponse]
    
    class Config:
        from_attributes = True

