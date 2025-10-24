from flask import Blueprint
from controllers import FileController

file_bp = Blueprint('file', __name__, url_prefix='/api')

file_controller = FileController()

@file_bp.route('/analyze-spreadsheet', methods=['POST'])
def analyze_spreadsheet():
    """
    Analyze uploaded XLSX file and return spreadsheet information.
    
    Accepts:
    - Multipart form data with 'file' field containing XLSX file
    - JSON body with 'file_path' field containing path to XLSX file
    
    Returns:
    JSON array with spreadsheet data for all sheets
    """
    return file_controller.analyze_spreadsheet()