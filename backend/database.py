from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models.user import User, Base as UserBase
from models.ai_session import AISession, Base as SessionBase
import os

# Use the same Base for all models
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

# Import models to register them with Base
User.__bases__ = (Base,)
AISession.__bases__ = (Base,)

# Database URL from environment or default to SQLite
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'sqlite:///xls_cleaner.db'
)

# Create engine
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
