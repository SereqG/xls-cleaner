from models.ai_session import AISession
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import uuid

class AISessionRepository:
    """Repository for AI session operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def create(
        self, 
        user_id: str, 
        file_name: str, 
        file_path: str,
        selected_sheet: str = None
    ) -> AISession:
        """Create a new AI session"""
        session = AISession(
            id=str(uuid.uuid4()),
            user_id=user_id,
            file_name=file_name,
            file_path=file_path,
            selected_sheet=selected_sheet,
            conversation_history=[]
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session
    
    def get_by_id(self, session_id: str) -> AISession:
        """Get session by ID"""
        return self.db.query(AISession).filter(AISession.id == session_id).first()
    
    def get_user_sessions(self, user_id: str, limit: int = 10):
        """Get user's recent sessions"""
        return self.db.query(AISession)\
            .filter(AISession.user_id == user_id)\
            .order_by(AISession.updated_at.desc())\
            .limit(limit)\
            .all()
    
    def add_message(
        self, 
        session_id: str, 
        role: str, 
        content: str, 
        metadata: dict = None
    ) -> AISession:
        """Add a message to session conversation"""
        session = self.get_by_id(session_id)
        if session:
            session.add_message(role, content, metadata)
            self.db.commit()
            self.db.refresh(session)
        return session
    
    def update_sheet(self, session_id: str, sheet_name: str) -> AISession:
        """Update selected sheet for session"""
        session = self.get_by_id(session_id)
        if session:
            session.selected_sheet = sheet_name
            session.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(session)
        return session
    
    def delete(self, session_id: str) -> bool:
        """Delete a session"""
        session = self.get_by_id(session_id)
        if session:
            self.db.delete(session)
            self.db.commit()
            return True
        return False
