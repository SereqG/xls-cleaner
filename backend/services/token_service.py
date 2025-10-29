import redis
import jwt
from datetime import datetime, timedelta
from typing import Optional
from config import Config


class TokenTrackingService:
    """Service for tracking daily token usage per user using Redis."""
    
    def __init__(self):
        self.redis_client = redis.Redis(
            host=Config.REDIS_HOST,
            port=Config.REDIS_PORT,
            db=Config.REDIS_DB,
            password=Config.REDIS_PASSWORD,
            decode_responses=True
        )
        self.daily_limit = Config.DAILY_TOKEN_LIMIT
    
    def _get_user_key(self, user_id: str) -> str:
        """Generate Redis key for user's daily token count."""
        today = datetime.utcnow().strftime('%Y-%m-%d')
        return f"tokens:{user_id}:{today}"
    
    def get_token_usage(self, user_id: str) -> int:
        """Get current token usage for the user today."""
        key = self._get_user_key(user_id)
        usage = self.redis_client.get(key)
        return int(usage) if usage else 0
    
    def get_remaining_tokens(self, user_id: str) -> int:
        """Get remaining tokens for the user today."""
        used = self.get_token_usage(user_id)
        return max(0, self.daily_limit - used)
    
    def can_use_token(self, user_id: str) -> bool:
        """Check if user has tokens available."""
        return self.get_remaining_tokens(user_id) > 0
    
    def use_token(self, user_id: str) -> bool:
        """
        Use one token for the user.
        Returns True if successful, False if no tokens available.
        """
        if not self.can_use_token(user_id):
            return False
        
        key = self._get_user_key(user_id)
        
        # Increment token count
        self.redis_client.incr(key)
        
        # Set expiration to end of day (so it resets daily)
        now = datetime.utcnow()
        end_of_day = datetime.combine(now.date() + timedelta(days=1), datetime.min.time())
        seconds_until_reset = int((end_of_day - now).total_seconds())
        self.redis_client.expire(key, seconds_until_reset)
        
        return True
    
    def verify_clerk_token(self, token: str) -> Optional[str]:
        """
        Verify Clerk JWT token and extract user ID.
        Returns user_id if valid, None otherwise.
        """
        if not Config.CLERK_SECRET_KEY:
            # In development, allow requests without verification
            return "dev_user"
        
        try:
            # Decode JWT token
            payload = jwt.decode(
                token,
                Config.CLERK_SECRET_KEY,
                algorithms=["RS256"],
                options={"verify_signature": True}
            )
            
            # Extract user ID from payload
            user_id = payload.get("sub")
            return user_id
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        except Exception:
            return None
    
    def reset_user_tokens(self, user_id: str):
        """Reset token count for a user (admin function)."""
        key = self._get_user_key(user_id)
        self.redis_client.delete(key)
    
    def health_check(self) -> bool:
        """Check if Redis connection is healthy."""
        try:
            self.redis_client.ping()
            return True
        except Exception:
            return False


# Global service instance
token_service = TokenTrackingService()
