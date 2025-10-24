from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from config import Config

from routes.file_routes import file_bp
from routes.ai_routes import ai_bp

def create_app():
    app = Flask(__name__)
    
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
    
    CORS(app, origins=Config.CORS_ORIGINS)
    
    logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
    
    
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
