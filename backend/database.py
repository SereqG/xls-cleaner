from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import os

# Import the shared Base and models
from models.base import Base
from models.user import User
from models.ai_session import AISession

# Database URL from environment or default to SQLite
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'sqlite:///xls_cleaner.db'
)

# Create engine
if DATABASE_URL.startswith("sqlite"):
    from sqlalchemy.pool import NullPool
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Set to True for SQL query logging
        connect_args={"check_same_thread": False},
        poolclass=NullPool,
        future=True
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Set to True for SQL query logging
        pool_pre_ping=True,  # Verify connections before using
        future=True
    )

# Create session factory
SessionLocal = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_session():
    """Get database session (non-generator version)"""
    return SessionLocal()
