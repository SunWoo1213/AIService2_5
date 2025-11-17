"""
Job Posting Schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AIAnalysis(BaseModel):
    """AI analysis result"""
    keywords: List[str]
    requirements: List[str]


class JobPostingBase(BaseModel):
    """Base job posting schema"""
    title: Optional[str] = None


class JobPostingCreate(JobPostingBase):
    """Job posting creation schema"""
    original_text: str


class JobPostingResponse(JobPostingBase):
    """Job posting response schema"""
    id: int
    user_id: int
    original_text: str
    ai_analysis: Optional[AIAnalysis] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

