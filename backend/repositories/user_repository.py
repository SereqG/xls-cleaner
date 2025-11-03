from models.user import User
from sqlalchemy.orm import Session
from datetime import datetime, timezone

class UserRepository:
    """Repository for user operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def get_by_id(self, user_id: str) -> User:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> User:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def create(self, user_id: str, email: str) -> User:
        """Create a new user"""
        user = User(
            id=user_id,
            email=email,
            daily_tokens=10,
            tokens_used_today=0,
            last_token_reset=datetime.now(timezone.utc)
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_or_create(self, user_id: str, email: str) -> User:
        """Get existing user or create new one"""
        user = self.get_by_id(user_id)
        if not user:
            user = self.create(user_id, email)
        return user
    
    def update_tokens(self, user_id: str) -> bool:
        """Update user's token count after usage"""
        user = self.get_by_id(user_id)
        if user and user.use_token(self.db):
            self.db.commit()
            return True
        return False
    
    def get_remaining_tokens(self, user_id: str) -> int:
        """Get remaining tokens for user"""
        user = self.get_by_id(user_id)
        if user:
            return user.get_remaining_tokens(self.db)
        return 0
