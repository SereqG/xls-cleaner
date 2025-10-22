from flask import request, jsonify
from werkzeug.datastructures import FileStorage
from services.file_service import FileService
from models.spreadsheet_info import SpreadsheetData
from typing import List

class FileController:
    
    def __init__(self):
        self.file_service = FileService()
    
    def analyze_spreadsheet(self):
        """
        Analyze uploaded XLSX file and return spreadsheet information.
        
        Expected request:
        - Multipart form data with 'file' field containing XLSX file
        OR
        - JSON body with 'file_path' field containing path to XLSX file
        
        Returns:
        JSON response with spreadsheet data for all sheets
        """
        try:
            if 'file' in request.files:
                uploaded_file = request.files['file']
                
                if uploaded_file.filename == '':
                    return jsonify({'error': 'No file selected'}), 400
                
                if not uploaded_file.filename.lower().endswith(('.xlsx', '.xls')):
                    return jsonify({'error': 'Invalid file type. Only XLSX and XLS files are supported'}), 400
                
                spreadsheet_data = self.file_service.analyze_xlsx_file(uploaded_file)
                
            else:
                return jsonify({'error': 'No file provided. Send file via form data or provide file_path in JSON body'}), 400
            
            response_data = [sheet_data.to_dict() for sheet_data in spreadsheet_data]
            
            return jsonify(response_data), 200
            
        except Exception as e:
            return jsonify({'error': f'Error analyzing spreadsheet: {str(e)}'}), 500