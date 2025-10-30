from flask import Blueprint
from controllers.ai_controller import AIController

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

ai_controller = AIController()

@ai_bp.route('/upload', methods=['POST'])
def upload_file():
    """
    Upload an Excel file and create an AI session.
    
    Form data:
    - file: Excel file (max 20MB)
    - user_id: Clerk user ID
    - email: User email
    
    Returns:
    - session_id: Unique session identifier
    - file_name: Name of uploaded file
    - sheets: List of available sheets
    - selected_sheet: Currently selected sheet
    - tokens_remaining: User's remaining tokens
    """
    return ai_controller.upload_file()

@ai_bp.route('/chat', methods=['POST'])
def send_message():
    """
    Send a message to the AI assistant.
    
    JSON body:
    - session_id: AI session ID
    - message: User's message
    - user_id: User ID for authentication
    
    Returns:
    - type: 'success' or 'error'
    - message: AI response text
    - operation: Operation that was performed (if success)
    - summary: Summary of changes (if success)
    - preview: First 5 rows of updated sheet (if success)
    - stats: Sheet statistics (if success)
    - tokens_remaining: User's remaining tokens
    """
    return ai_controller.send_message()

@ai_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """
    Get session details.
    
    URL param:
    - session_id: Session ID
    
    Query param:
    - user_id: User ID for authentication
    
    Returns:
    Session details including conversation history
    """
    return ai_controller.get_session()

@ai_bp.route('/preview/<session_id>', methods=['GET'])
def get_preview(session_id):
    """
    Get sheet preview.
    
    URL param:
    - session_id: Session ID
    
    Query param:
    - user_id: User ID for authentication
    
    Returns:
    - preview: First 5 rows of sheet
    - stats: Sheet statistics
    - sheet_name: Name of current sheet
    """
    return ai_controller.get_preview()

@ai_bp.route('/download/<session_id>', methods=['GET'])
def download_file(session_id):
    """
    Download the cleaned Excel file.
    
    URL param:
    - session_id: Session ID
    
    Query param:
    - user_id: User ID for authentication
    
    Returns:
    Excel file download
    """
    return ai_controller.download_file()

@ai_bp.route('/tokens', methods=['GET'])
def get_user_tokens():
    """
    Get user's remaining tokens.
    
    Query param:
    - user_id: User ID
    
    Returns:
    - tokens_remaining: Tokens remaining today
    - daily_limit: Daily token limit
    - tokens_used_today: Tokens used today
    """
    return ai_controller.get_user_tokens()

@ai_bp.route('/select-sheet', methods=['POST'])
def update_selected_sheet():
    """
    Update the selected sheet for a session.
    
    JSON body:
    - session_id: Session ID
    - sheet_name: Name of sheet to select
    - user_id: User ID
    
    Returns:
    - success: Boolean
    - selected_sheet: Name of selected sheet
    """
    return ai_controller.update_selected_sheet()
