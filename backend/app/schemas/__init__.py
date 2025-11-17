"""
Pydantic Schemas
"""
from .user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    Token,
    TokenData,
)
from .job_posting import (
    JobPostingBase,
    JobPostingCreate,
    JobPostingResponse,
    AIAnalysis,
)
from .cover_letter import (
    CoverLetterBase,
    CoverLetterCreate,
    CoverLetterUpdate,
    CoverLetterResponse,
)
from .interview import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewTurnCreate,
    InterviewTurnResponse,
    InterviewResultResponse,
)

__all__ = [
    # User
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "Token",
    "TokenData",
    # Job Posting
    "JobPostingBase",
    "JobPostingCreate",
    "JobPostingResponse",
    "AIAnalysis",
    # Cover Letter
    "CoverLetterBase",
    "CoverLetterCreate",
    "CoverLetterUpdate",
    "CoverLetterResponse",
    # Interview
    "InterviewSessionCreate",
    "InterviewSessionResponse",
    "InterviewTurnCreate",
    "InterviewTurnResponse",
    "InterviewResultResponse",
]

