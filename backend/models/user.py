from sqlalchemy import Column, String, Integer, DateTime, Boolean
from datetime import datetime, timezone
from .base import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(255), primary_key=True)  # Clerk user ID
    email = Column(String(255), unique=True, nullable=False)
    daily_tokens = Column(Integer, default=50)  # Daily token limit
    tokens_used_today = Column(Integer, default=0)
    last_token_reset = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def get_remaining_tokens(self):
        """Get the number of tokens remaining for today"""
        self._reset_tokens_if_needed()
        return self.daily_tokens - self.tokens_used_today
    
    def _reset_tokens_if_needed(self):
        """Reset token counter if it's a new day"""
        now = datetime.now(timezone.utc)
        if self.last_token_reset.date() < now.date():
            self.tokens_used_today = 0
            self.last_token_reset = now
    
    def can_use_token(self):
        """Check if user has tokens available"""
        return self.get_remaining_tokens() > 0
    
    def use_token(self):
        """Deduct one token from user's daily allowance"""
        self._reset_tokens_if_needed()
        if self.can_use_token():
            self.tokens_used_today += 1
            return True
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'daily_tokens': self.daily_tokens,
            'tokens_remaining': self.get_remaining_tokens(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
