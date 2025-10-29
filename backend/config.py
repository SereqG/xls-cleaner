import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    PROCESSED_FOLDER = os.environ.get('PROCESSED_FOLDER', 'processed')
    CORS_ORIGINS = [origin.strip() for origin in os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')]
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

def test_config_loading():
    """Test function to verify environment variables are loaded correctly"""
    print("=== CONFIG LOADING TEST ===")
    print(f"✓ .env file exists: {os.path.exists('.env')}")
    print(f"✓ FLASK_DEBUG from env: {os.environ.get('FLASK_DEBUG', 'NOT SET')}")
    print(f"✓ CORS_ORIGINS from env: {os.environ.get('CORS_ORIGINS', 'NOT SET')}")
    print(f"✓ OPENAI_API_KEY from env: {'SET' if os.environ.get('OPENAI_API_KEY') else 'NOT SET'}")
    print(f"✓ REDIS_HOST from env: {os.environ.get('REDIS_HOST', 'NOT SET')}")
    print(f"✓ CLERK_SECRET_KEY from env: {'SET' if os.environ.get('CLERK_SECRET_KEY') else 'NOT SET'}")
    
    print("\n=== PARSED CONFIG VALUES ===")
    config = Config()
    print(f"✓ Config.DEBUG: {config.DEBUG}")
    print(f"✓ Config.CORS_ORIGINS: {config.CORS_ORIGINS}")
    print(f"✓ Config.HOST: {config.HOST}")
    print(f"✓ Config.PORT: {config.PORT}")
    print(f"✓ Config.REDIS_HOST: {config.REDIS_HOST}")
    print(f"✓ Config.REDIS_PORT: {config.REDIS_PORT}")
    print(f"✓ Config.DAILY_TOKEN_LIMIT: {config.DAILY_TOKEN_LIMIT}")

if __name__ == "__main__":
    test_config_loading()