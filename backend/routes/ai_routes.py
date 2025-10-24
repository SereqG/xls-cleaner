from flask import Blueprint
from controllers import AIController

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

ai_controller = AIController()

@ai_bp.route('/start-session', methods=['POST'])
def start_session():
    """
    Start a new AI cleaning session.
    
    Accepts:
    - Multipart form data with 'file' field containing XLSX file
    - 'sheet_name' form field with the name of the sheet to work with
    
    Returns:
    JSON with session_id and token usage info
    """
    return ai_controller.start_session()

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """
    Send a message to the AI agent.
    
    Accepts:
    JSON body with:
    - session_id: str
    - message: str
    
    Returns:
    JSON with AI response and remaining tokens
    """
    return ai_controller.chat()

@ai_bp.route('/preview', methods=['GET'])
def get_preview():
    """
    Get preview of current data state.
    
    Query params:
    - session_id: str
    
    Returns:
    JSON with preview data
    """
    return ai_controller.get_preview()

@ai_bp.route('/download', methods=['GET'])
def download_modified_file():
    """
    Download the modified Excel file.
    
    Query params:
    - session_id: str
    
    Returns:
    Excel file as attachment
    """
    return ai_controller.download_modified_file()

@ai_bp.route('/end-session', methods=['POST'])
def end_session():
    """
    End AI session and cleanup resources.
    
    Accepts:
    JSON body with:
    - session_id: str
    
    Returns:
    JSON with success message
    """
    return ai_controller.end_session()

@ai_bp.route('/token-status', methods=['GET'])
def get_token_status():
    """
    Get current token usage status for the authenticated user.
    
    Returns:
    JSON with used_tokens, remaining_tokens, and daily_limit
    """
    return ai_controller.get_token_status()
