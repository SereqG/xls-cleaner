from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

from config import Config
from controllers.file_controller import FileController

def create_app():
    app = Flask(__name__)
    
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
    
    CORS(app, origins=Config.CORS_ORIGINS)
    
    logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
    
    file_controller = FileController()
    
    @app.route('/')
    def hello_world():
        return jsonify({
            'message': 'Hello World!',
            'service': 'Excel Cleaner API',
            'status': 'ready'
        })
    
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'Excel Cleaner API'
        })
    
    @app.route('/api/analyze-spreadsheet', methods=['POST'])
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
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
