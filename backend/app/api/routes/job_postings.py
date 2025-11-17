"""
Job Posting Routes
"""
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core import get_db
from app.api.dependencies import get_current_user
from app.models import User, JobPosting
from app.schemas import JobPostingResponse
from app.services import OpenAIService
import PyPDF2
import io

router = APIRouter(prefix="/job-postings", tags=["Job Postings"])


@router.post("", response_model=JobPostingResponse, status_code=status.HTTP_201_CREATED)
async def create_job_posting(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and analyze job posting PDF
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    # Extract text from PDF
    try:
        pdf_content = await file.read()
        pdf_file = io.BytesIO(pdf_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from PDF"
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process PDF: {str(e)}"
        )
    
    # Analyze with AI
    ai_analysis = await OpenAIService.analyze_job_posting(text)
    
    # Create job posting
    job_posting = JobPosting(
        user_id=current_user.id,
        title=file.filename.replace('.pdf', ''),
        original_text=text,
        ai_analysis=ai_analysis
    )
    
    db.add(job_posting)
    db.commit()
    db.refresh(job_posting)
    
    return job_posting


@router.get("", response_model=List[JobPostingResponse])
async def list_job_postings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all job postings for current user
    """
    job_postings = db.query(JobPosting).filter(
        JobPosting.user_id == current_user.id
    ).order_by(JobPosting.created_at.desc()).all()
    
    return job_postings


@router.get("/{posting_id}", response_model=JobPostingResponse)
async def get_job_posting(
    posting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get job posting by ID
    """
    job_posting = db.query(JobPosting).filter(
        JobPosting.id == posting_id,
        JobPosting.user_id == current_user.id
    ).first()
    
    if not job_posting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found"
        )
    
    return job_posting


@router.delete("/{posting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_posting(
    posting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete job posting
    """
    job_posting = db.query(JobPosting).filter(
        JobPosting.id == posting_id,
        JobPosting.user_id == current_user.id
    ).first()
    
    if not job_posting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found"
        )
    
    db.delete(job_posting)
    db.commit()

