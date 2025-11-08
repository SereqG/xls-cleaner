from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timezone
from .base import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(255), primary_key=True)  # Clerk user ID
    email = Column(String(255), nullable=False)
    daily_tokens = Column(Integer, default=10)  # Daily token limit
    tokens_used_today = Column(Integer, default=0)
    last_token_reset = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def get_remaining_tokens(self, session=None):
        """Get the number of tokens remaining for today"""
        if session:
            self._reset_tokens_if_needed(session)
        return self.daily_tokens - self.tokens_used_today
    
    def _reset_tokens_if_needed(self, session):
        """
        Reset token counter if it's a new day.
        This method must be called within a transaction and passed a SQLAlchemy session.
        Uses row-level locking to prevent race conditions.
        """
        # Lock the user row for update
        user_locked = session.query(User).filter_by(id=self.id).with_for_update().one()
        now = datetime.now(timezone.utc)
        if user_locked.last_token_reset.date() < now.date():
            user_locked.tokens_used_today = 0
            user_locked.last_token_reset = now
        # Update self to reflect changes
        self.tokens_used_today = user_locked.tokens_used_today
        self.last_token_reset = user_locked.last_token_reset
    
    def can_use_token(self, session=None):
        """Check if user has tokens available"""
        return self.get_remaining_tokens(session) > 0
    
    def use_token(self, session):
        """
        Deduct one token from user's daily allowance.
        This method must be called within a transaction and passed a SQLAlchemy session.
        Uses row-level locking to prevent race conditions.
        """
        self._reset_tokens_if_needed(session)
        # Lock the user row for update
        user_locked = session.query(User).filter_by(id=self.id).with_for_update().one()
        if user_locked.daily_tokens - user_locked.tokens_used_today > 0:
            user_locked.tokens_used_today += 1
            # Update self to reflect changes
            self.tokens_used_today = user_locked.tokens_used_today
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
