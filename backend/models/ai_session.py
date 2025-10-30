from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from datetime import datetime, timezone
import json
from .base import Base

class AISession(Base):
    __tablename__ = 'ai_sessions'
    
    id = Column(String(36), primary_key=True)  # UUID
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)  # Path to stored file
    selected_sheet = Column(String(255), nullable=True)  # Currently selected sheet
    conversation_history = Column(JSON, default=list)  # List of messages
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def add_message(self, role, content, metadata=None):
        """Add a message to the conversation history"""
        if self.conversation_history is None:
            self.conversation_history = []
        
        message = {
            'role': role,  # 'user' or 'assistant'
            'content': content,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        if metadata:
            message['metadata'] = metadata
        
        self.conversation_history.append(message)
        self.updated_at = datetime.now(timezone.utc)
    
    def get_conversation_context(self, max_messages=10):
        """Get recent conversation history for AI context"""
        if not self.conversation_history:
            return []
        
        # Return last N messages
        return self.conversation_history[-max_messages:]
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'file_name': self.file_name,
            'selected_sheet': self.selected_sheet,
            'conversation_history': self.conversation_history or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
