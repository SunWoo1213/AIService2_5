"""
Cover Letter Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CoverLetterBase(BaseModel):
    """Base cover letter schema"""
    content: str


class CoverLetterCreate(CoverLetterBase):
    """Cover letter creation schema"""
    job_posting_id: Optional[int] = None


class CoverLetterUpdate(BaseModel):
    """Cover letter update schema"""
    content: Optional[str] = None


class CoverLetterResponse(CoverLetterBase):
    """Cover letter response schema"""
    id: int
    user_id: int
    job_posting_id: Optional[int] = None
    ai_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

