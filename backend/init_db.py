"""
Database Initialization Script
"""
from app.core.database import Base, engine
from app.models import User, JobPosting, CoverLetter, InterviewSession, InterviewTurn


def init_db():
    """
    Initialize database tables
    """
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")


if __name__ == "__main__":
    init_db()

