from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from services.ai_service import ai_service
from services.token_service import token_service
import os
import tempfile
import shutil
from config import Config


class AIController:
    """Controller for AI-assisted Excel cleaning operations."""
    
    def __init__(self):
        self.temp_sessions = {}
    
    def _get_user_from_request(self):
        """Extract and verify user from request."""
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            user_id = token_service.verify_clerk_token(token)
            return user_id
        return None
    
    def _save_uploaded_file(self, file) -> str:
        """Save uploaded file to temporary location."""
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, filename)
        file.save(file_path)
        return file_path
    
    def start_session(self):
        """
        Start a new AI cleaning session.
        Expects: file (multipart), sheet_name (form field)
        Returns: session_id, token usage info
        """
        try:
            # Get user ID
            user_id = self._get_user_from_request()
            if not user_id:
                return jsonify({"error": "Unauthorized"}), 401
            
            # Check token availability
            if not token_service.can_use_token(user_id):
                remaining = token_service.get_remaining_tokens(user_id)
                return jsonify({
                    "error": "Daily token limit reached",
                    "remaining_tokens": remaining,
                    "daily_limit": Config.DAILY_TOKEN_LIMIT
                }), 429
            
            # Get file and sheet name
            if 'file' not in request.files:
                return jsonify({"error": "No file provided"}), 400
            
            file = request.files['file']
            sheet_name = request.form.get('sheet_name')
            
            if not sheet_name:
                return jsonify({"error": "No sheet_name provided"}), 400
            
            # Save file temporarily
            file_path = self._save_uploaded_file(file)
            
            # Generate session ID
            import uuid
            session_id = str(uuid.uuid4())
            
            # Store session info
            self.temp_sessions[session_id] = {
                'user_id': user_id,
                'file_path': file_path,
                'sheet_name': sheet_name,
                'original_filename': file.filename
            }
            
            # Create AI agent
            ai_service.create_agent(session_id, file_path, sheet_name)
            
            # Use one token
            token_service.use_token(user_id)
            
            return jsonify({
                "session_id": session_id,
                "remaining_tokens": token_service.get_remaining_tokens(user_id),
                "daily_limit": Config.DAILY_TOKEN_LIMIT
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def chat(self):
        """
        Send a message to the AI agent.
        Expects: session_id, message
        Returns: response from AI
        """
        try:
            data = request.json
            session_id = data.get('session_id')
            message = data.get('message')
            
            if not session_id or not message:
                return jsonify({"error": "session_id and message required"}), 400
            
            # Verify session exists
            if session_id not in self.temp_sessions:
                return jsonify({"error": "Invalid session"}), 404
            
            # Get user ID and check token
            session = self.temp_sessions[session_id]
            user_id = session['user_id']
            
            # Check token availability
            if not token_service.can_use_token(user_id):
                remaining = token_service.get_remaining_tokens(user_id)
                return jsonify({
                    "error": "Daily token limit reached",
                    "remaining_tokens": remaining,
                    "daily_limit": Config.DAILY_TOKEN_LIMIT
                }), 429
            
            # Use one token
            token_service.use_token(user_id)
            
            # Get AI response
            response = ai_service.chat(session_id, message)
            
            return jsonify({
                "response": response,
                "remaining_tokens": token_service.get_remaining_tokens(user_id)
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_preview(self):
        """
        Get preview of current data state.
        Expects: session_id
        Returns: preview data
        """
        try:
            session_id = request.args.get('session_id')
            
            if not session_id:
                return jsonify({"error": "session_id required"}), 400
            
            # Verify session exists
            if session_id not in self.temp_sessions:
                return jsonify({"error": "Invalid session"}), 404
            
            # Get preview
            preview = ai_service.get_preview(session_id, num_rows=10)
            
            return jsonify({
                "preview": preview
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def download_modified_file(self):
        """
        Download the modified Excel file.
        Expects: session_id
        Returns: Excel file
        """
        try:
            session_id = request.args.get('session_id')
            
            if not session_id:
                return jsonify({"error": "session_id required"}), 400
            
            # Verify session exists
            if session_id not in self.temp_sessions:
                return jsonify({"error": "Invalid session"}), 404
            
            session = self.temp_sessions[session_id]
            original_filename = session['original_filename']
            
            # Create output file path
            output_dir = tempfile.mkdtemp()
            output_filename = f"cleaned_{original_filename}"
            output_path = os.path.join(output_dir, output_filename)
            
            # Save modified file
            success = ai_service.save_modified_file(session_id, output_path)
            
            if not success:
                return jsonify({"error": "Failed to save modified file"}), 500
            
            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def end_session(self):
        """
        End AI session and cleanup resources.
        Expects: session_id
        """
        try:
            data = request.json
            session_id = data.get('session_id')
            
            if not session_id:
                return jsonify({"error": "session_id required"}), 400
            
            if session_id in self.temp_sessions:
                # Cleanup files
                session = self.temp_sessions[session_id]
                file_path = session['file_path']
                if os.path.exists(file_path):
                    # Remove temp directory
                    temp_dir = os.path.dirname(file_path)
                    shutil.rmtree(temp_dir, ignore_errors=True)
                
                # Cleanup agent
                ai_service.cleanup_session(session_id)
                
                # Remove session
                del self.temp_sessions[session_id]
            
            return jsonify({"message": "Session ended"}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_token_status(self):
        """
        Get current token usage status.
        Returns: token usage info
        """
        try:
            # Get user ID
            user_id = self._get_user_from_request()
            if not user_id:
                return jsonify({"error": "Unauthorized"}), 401
            
            used = token_service.get_token_usage(user_id)
            remaining = token_service.get_remaining_tokens(user_id)
            
            return jsonify({
                "used_tokens": used,
                "remaining_tokens": remaining,
                "daily_limit": Config.DAILY_TOKEN_LIMIT
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
