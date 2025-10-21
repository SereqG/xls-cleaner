from flask import Flask, jsonify
from flask_cors import CORS
import logging

from config import Config

def create_app():
    app = Flask(__name__)
    
    CORS(app, origins=Config.CORS_ORIGINS)
    
    logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
    
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
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
