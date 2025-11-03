from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from config import Config

from routes.file_routes import file_bp
from routes.ai_routes import ai_bp
from database import init_db

def create_app():
    app = Flask(__name__)
    
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20MB for AI mode
    
    CORS(app, origins=Config.CORS_ORIGINS)
    
    logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
    
    # Initialize database
    init_db()
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint to verify the API is running"""
        return jsonify({
            'status': 'healthy',
            'message': 'XLS Cleaner API is running',
            'version': '1.0.0'
        }), 200
    
    app.register_blueprint(file_bp)
    app.register_blueprint(ai_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
