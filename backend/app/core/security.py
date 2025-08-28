"""
Security and authentication utilities for FinClick.AI
"""

from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
import secrets

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload

def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Get current active user"""
    if not current_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def get_current_user_id(current_user: dict = Depends(get_current_user)) -> str:
    """Get current user ID"""
    return current_user.get("sub")

def check_permissions(required_permissions: list, current_user: dict = Depends(get_current_user)) -> bool:
    """Check if user has required permissions"""
    user_permissions = current_user.get("permissions", [])
    
    for permission in required_permissions:
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission} required"
            )
    
    return True

def check_subscription_status(current_user: dict = Depends(get_current_user)) -> bool:
    """Check if user has active subscription"""
    subscription_status = current_user.get("subscription_status", "inactive")
    
    if subscription_status != "active":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Active subscription required"
        )
    
    return True

def check_usage_limits(current_user: dict = Depends(get_current_user), 
                       analysis_type: str = None) -> bool:
    """Check if user has exceeded usage limits"""
    subscription_plan = current_user.get("subscription_plan", "free")
    plan_limits = settings.SUBSCRIPTION_PLANS.get(subscription_plan, {}).get("limits", {})
    
    # Check analysis limits
    analyses_per_month = plan_limits.get("analyses_per_month", 0)
    if analyses_per_month != -1:  # Not unlimited
        # This would typically check against actual usage in database
        # For now, we'll assume it's within limits
        pass
    
    return True

# Security utilities
def generate_secure_token(length: int = 32) -> str:
    """Generate secure random token"""
    return secrets.token_urlsafe(length)

def generate_api_key() -> str:
    """Generate API key for external integrations"""
    return f"fc_{secrets.token_urlsafe(24)}"

def sanitize_input(input_string: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    # Remove potentially dangerous characters
    dangerous_chars = ["<", ">", '"', "'", "&", ";", "(", ")", "{", "}", "[", "]"]
    sanitized = input_string
    
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, "")
    
    return sanitized.strip()

def validate_email(email: str) -> bool:
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password: str) -> dict:
    """Validate password strength"""
    result = {
        "valid": True,
        "score": 0,
        "feedback": []
    }
    
    # Check length
    if len(password) < 8:
        result["valid"] = False
        result["feedback"].append("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    else:
        result["score"] += 1
    
    # Check for uppercase
    if any(c.isupper() for c in password):
        result["score"] += 1
    else:
        result["feedback"].append("يجب أن تحتوي على حرف كبير")
    
    # Check for lowercase
    if any(c.islower() for c in password):
        result["score"] += 1
    else:
        result["feedback"].append("يجب أن تحتوي على حرف صغير")
    
    # Check for numbers
    if any(c.isdigit() for c in password):
        result["score"] += 1
    else:
        result["feedback"].append("يجب أن تحتوي على رقم")
    
    # Check for special characters
    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if any(c in special_chars for c in password):
        result["score"] += 1
    else:
        result["feedback"].append("يجب أن تحتوي على رمز خاص")
    
    # Final validation
    if result["score"] < 3:
        result["valid"] = False
    
    return result

# Rate limiting
class RateLimiter:
    """Simple rate limiter for API endpoints"""
    
    def __init__(self):
        self.requests = {}
    
    def is_allowed(self, user_id: str, endpoint: str, max_requests: int = 100, window_seconds: int = 3600) -> bool:
        """Check if user is allowed to make request"""
        current_time = datetime.utcnow()
        key = f"{user_id}:{endpoint}"
        
        if key not in self.requests:
            self.requests[key] = []
        
        # Remove old requests outside the window
        self.requests[key] = [
            req_time for req_time in self.requests[key] 
            if (current_time - req_time).seconds < window_seconds
        ]
        
        # Check if limit exceeded
        if len(self.requests[key]) >= max_requests:
            return False
        
        # Add current request
        self.requests[key].append(current_time)
        return True

# Initialize rate limiter
rate_limiter = RateLimiter()

def check_rate_limit(user_id: str, endpoint: str, max_requests: int = 100) -> bool:
    """Check rate limit for user and endpoint"""
    return rate_limiter.is_allowed(user_id, endpoint, max_requests)
