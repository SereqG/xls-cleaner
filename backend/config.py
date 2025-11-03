import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER')
    PROCESSED_FOLDER = os.environ.get('PROCESSED_FOLDER')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS').split(',')
    DEBUG = os.environ.get('FLASK_DEBUG')
    HOST = os.environ.get('HOST')
    PORT = int(os.environ.get('PORT'))
    LOG_LEVEL = os.environ.get('LOG_LEVEL')
    
    # Database configuration
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # OpenAI configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')