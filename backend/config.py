import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    PROCESSED_FOLDER = os.environ.get('PROCESSED_FOLDER', 'processed')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3001').split(',')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # AI Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    
    # Redis Configuration
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
    REDIS_DB = int(os.environ.get('REDIS_DB', 0))
    REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)
    
    # Token Limits
    DAILY_TOKEN_LIMIT = int(os.environ.get('DAILY_TOKEN_LIMIT', 15))
    
    # Clerk Configuration
    CLERK_SECRET_KEY = os.environ.get('CLERK_SECRET_KEY', '')

    # File validation
    ALLOWED_EXTENSIONS = {'xlsx', 'xls'}
    ALLOWED_MIME_TYPES = {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    }