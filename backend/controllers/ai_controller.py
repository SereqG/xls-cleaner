from flask import request, jsonify
from werkzeug.utils import secure_filename
from repositories.user_repository import UserRepository
from repositories.ai_session_repository import AISessionRepository
from services.ai_service import AIExcelService
from services.file_service import FileService
from database import get_db_session
import os
import uuid
import logging
from config import Config

logger = logging.getLogger(__name__)

class AIController:
    """Controller for AI-powered Excel operations"""
    
    def __init__(self):
        self._ai_service = None
        self.file_service = FileService()
        self.upload_folder = Config.UPLOAD_FOLDER
        
        # Ensure upload folder exists
        os.makedirs(self.upload_folder, exist_ok=True)
    
    @property
    def ai_service(self):
        """Lazy-load AI service to avoid initialization errors if OpenAI key is missing"""
        if self._ai_service is None:
            self._ai_service = AIExcelService()
        return self._ai_service
    
    def upload_file(self):
        """
        Upload an Excel file and create an AI session
        
        Required:
        - file: Excel file (multipart)
        - user_id: Clerk user ID
        - email: User email
        
        Returns:
        Session ID and sheet list
        """
        try:
            # Check authentication
            user_id = request.form.get('user_id')
            email = request.form.get('email')
            
            if not user_id or not email:
                return jsonify({'error': 'user_id and email are required'}), 401
            
            # Check file
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not file.filename.lower().endswith(('.xlsx', '.xls')):
                return jsonify({'error': 'Invalid file type. Only XLSX and XLS files are supported'}), 400
            
            # Check file size (20MB limit)
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size > 20 * 1024 * 1024:  # 20MB
                return jsonify({'error': 'File size exceeds 20MB limit'}), 400
            
            # Get or create user
            db = get_db_session()
            try:
                user_repo = UserRepository(db)
                user = user_repo.get_or_create(user_id, email)
                
                # Check if user has tokens
                if not user.can_use_token(db):
                    return jsonify({
                        'error': 'No tokens remaining',
                        'tokens_remaining': 0
                    }), 403
                
                # Save file
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                file_path = os.path.join(self.upload_folder, unique_filename)
                file.save(file_path)
                
                # Analyze spreadsheet to get sheets
                file.seek(0)
                spreadsheet_data = self.file_service.analyze_xlsx_file(file)
                
                sheet_names = [sheet.spreadsheet_name for sheet in spreadsheet_data]
                
                # Create AI session
                session_repo = AISessionRepository(db)
                session = session_repo.create(
                    user_id=user_id,
                    file_name=filename,
                    file_path=file_path,
                    selected_sheet=sheet_names[0] if sheet_names else None
                )
                
                return jsonify({
                    'session_id': session.id,
                    'file_name': filename,
                    'sheets': sheet_names,
                    'selected_sheet': session.selected_sheet,
                    'tokens_remaining': user.get_remaining_tokens(db)
                }), 201
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error uploading file: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to upload file. Please try again.'}), 500
    
    def send_message(self):
        """
        Send a message to the AI assistant
        
        Required (JSON body):
        - session_id: AI session ID
        - message: User's message
        - user_id: User ID for authentication
        
        Returns:
        AI response with operation results or error
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No JSON body provided'}), 400
            
            session_id = data.get('session_id')
            user_message = data.get('message')
            user_id = data.get('user_id')
            
            if not session_id or not user_message or not user_id:
                return jsonify({'error': 'session_id, message, and user_id are required'}), 400
            
            db = get_db_session()
            try:
                # Get session
                session_repo = AISessionRepository(db)
                session = session_repo.get_by_id(session_id)
                
                if not session:
                    return jsonify({'error': 'Session not found'}), 404
                
                # Verify user owns this session
                if session.user_id != user_id:
                    return jsonify({'error': 'Unauthorized'}), 403
                
                # Check if user has tokens
                user_repo = UserRepository(db)
                user = user_repo.get_by_id(user_id)
                
                if not user or not user.can_use_token(db):
                    return jsonify({
                        'error': 'No tokens remaining',
                        'tokens_remaining': 0
                    }), 403
                
                # Add user message to conversation
                session_repo.add_message(session_id, 'user', user_message)
                
                # Get sheet info for context
                sheet_info = None
                if session.selected_sheet and os.path.exists(session.file_path):
                    try:
                        sheet_info = self.ai_service.get_sheet_info(
                            session.file_path, 
                            session.selected_sheet
                        )
                    except Exception:
                        pass
                
                # Parse user request with AI
                conversation_history = session.get_conversation_context()
                ai_response = self.ai_service.parse_user_request(
                    user_message, 
                    conversation_history,
                    sheet_info
                )
                
                # If it's an error response, don't execute or deduct tokens
                if ai_response['type'] == 'error':
                    # Add AI response to conversation
                    response_text = ai_response['message']
                    if ai_response.get('suggestion'):
                        response_text += f"\n\nSuggestion: {ai_response['suggestion']}"
                    
                    session_repo.add_message(session_id, 'assistant', response_text)
                    
                    return jsonify({
                        'type': 'error',
                        'message': ai_response['message'],
                        'suggestion': ai_response.get('suggestion'),
                        'tokens_remaining': user.get_remaining_tokens(db)
                    }), 200
                
                # Execute the operation
                operation = ai_response['operation']
                params = ai_response['params']
                explanation = ai_response.get('explanation', '')
                
                result = self.ai_service.execute_operation(
                    session.file_path,
                    session.selected_sheet,
                    operation,
                    params
                )
                
                if not result['success']:
                    # Operation failed, don't deduct tokens
                    error_message = f"Operation failed: {result.get('error', 'Unknown error')}"
                    session_repo.add_message(session_id, 'assistant', error_message)
                    
                    return jsonify({
                        'type': 'error',
                        'message': error_message,
                        'tokens_remaining': user.get_remaining_tokens(db)
                    }), 200
                
                # Operation succeeded - deduct token
                user_repo.update_tokens(user_id)
                
                # Prepare response
                operation_result = result['result']
                preview = result['preview']
                stats = result['stats']
                
                response_text = f"{explanation}\n\n{operation_result['summary']}"
                
                # Add AI response to conversation with metadata
                session_repo.add_message(
                    session_id, 
                    'assistant', 
                    response_text,
                    metadata={
                        'operation': operation,
                        'params': params,
                        'stats': stats
                    }
                )
                
                return jsonify({
                    'type': 'success',
                    'message': response_text,
                    'operation': operation,
                    'summary': operation_result['summary'],
                    'preview': preview,
                    'stats': stats,
                    'tokens_remaining': user.get_remaining_tokens(db)
                }), 200
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error processing message: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to process message. Please try again.'}), 500
    
    def get_session(self):
        """
        Get session details
        
        URL param: session_id
        Query param: user_id
        """
        try:
            session_id = request.view_args.get('session_id')
            user_id = request.args.get('user_id')
            
            if not session_id or not user_id:
                return jsonify({'error': 'session_id and user_id are required'}), 400
            
            db = get_db_session()
            try:
                session_repo = AISessionRepository(db)
                session = session_repo.get_by_id(session_id)
                
                if not session:
                    return jsonify({'error': 'Session not found'}), 404
                
                if session.user_id != user_id:
                    return jsonify({'error': 'Unauthorized'}), 403
                
                return jsonify(session.to_dict()), 200
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error getting session: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to retrieve session.'}), 500
    
    def get_preview(self):
        """
        Get sheet preview
        
        URL param: session_id
        Query param: user_id
        """
        try:
            session_id = request.view_args.get('session_id')
            user_id = request.args.get('user_id')
            
            if not session_id or not user_id:
                return jsonify({'error': 'session_id and user_id are required'}), 400
            
            db = get_db_session()
            try:
                session_repo = AISessionRepository(db)
                session = session_repo.get_by_id(session_id)
                
                if not session:
                    return jsonify({'error': 'Session not found'}), 404
                
                if session.user_id != user_id:
                    return jsonify({'error': 'Unauthorized'}), 403
                
                if not session.selected_sheet:
                    return jsonify({'error': 'No sheet selected'}), 400
                
                preview = self.ai_service.get_sheet_preview(
                    session.file_path,
                    session.selected_sheet,
                    n_rows=5
                )
                
                stats = self.ai_service.get_sheet_info(
                    session.file_path,
                    session.selected_sheet
                )
                
                return jsonify({
                    'preview': preview,
                    'stats': stats,
                    'sheet_name': session.selected_sheet
                }), 200
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error getting preview: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to retrieve preview.'}), 500
    
    def download_file(self):
        """
        Download the cleaned Excel file
        
        URL param: session_id
        Query param: user_id
        """
        try:
            session_id = request.view_args.get('session_id')
            user_id = request.args.get('user_id')
            
            if not session_id or not user_id:
                return jsonify({'error': 'session_id and user_id are required'}), 400
            
            db = get_db_session()
            try:
                session_repo = AISessionRepository(db)
                session = session_repo.get_by_id(session_id)
                
                if not session:
                    return jsonify({'error': 'Session not found'}), 404
                
                if session.user_id != user_id:
                    return jsonify({'error': 'Unauthorized'}), 403
                
                if not os.path.exists(session.file_path):
                    return jsonify({'error': 'File not found'}), 404
                
                from flask import send_file
                return send_file(
                    session.file_path,
                    as_attachment=True,
                    download_name=f"cleaned_{session.file_name}"
                )
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error downloading file: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to download file.'}), 500
    
    def get_user_tokens(self):
        """
        Get user's remaining tokens
        
        Query param: user_id
        """
        try:
            user_id = request.args.get('user_id')
            
            if not user_id:
                return jsonify({'error': 'user_id is required'}), 400
            
            db = get_db_session()
            try:
                user_repo = UserRepository(db)
                user = user_repo.get_by_id(user_id)
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                return jsonify({
                    'tokens_remaining': user.get_remaining_tokens(db),
                    'daily_limit': user.daily_tokens,
                    'tokens_used_today': user.tokens_used_today
                }), 200
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error getting tokens: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to retrieve token information.'}), 500
    
    def update_selected_sheet(self):
        """
        Update the selected sheet for a session
        
        Required (JSON body):
        - session_id: Session ID
        - sheet_name: Name of sheet to select
        - user_id: User ID
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No JSON body provided'}), 400
            
            session_id = data.get('session_id')
            sheet_name = data.get('sheet_name')
            user_id = data.get('user_id')
            
            if not session_id or not sheet_name or not user_id:
                return jsonify({'error': 'session_id, sheet_name, and user_id are required'}), 400
            
            db = get_db_session()
            try:
                session_repo = AISessionRepository(db)
                session = session_repo.get_by_id(session_id)
                
                if not session:
                    return jsonify({'error': 'Session not found'}), 404
                
                if session.user_id != user_id:
                    return jsonify({'error': 'Unauthorized'}), 403
                
                # Update selected sheet
                session = session_repo.update_sheet(session_id, sheet_name)
                
                return jsonify({
                    'success': True,
                    'selected_sheet': session.selected_sheet
                }), 200
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f'Error updating sheet: {str(e)}', exc_info=True)
            return jsonify({'error': 'Failed to update selected sheet.'}), 500
