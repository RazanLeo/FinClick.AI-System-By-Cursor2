"""
User schemas for FinClick.AI
"""

from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User roles"""
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class SubscriptionType(str, Enum):
    """Subscription types"""
    MONTHLY = "monthly"
    YEARLY = "yearly"
    TRIAL = "trial"

class Language(str, Enum):
    """Supported languages"""
    AR = "ar"
    EN = "en"

class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    country: str = "Saudi Arabia"
    city: Optional[str] = None
    language: Language = Language.AR
    timezone: str = "Asia/Riyadh"
    currency: str = "SAR"

class UserCreate(UserBase):
    """User creation schema"""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    """User login schema"""
    username: str
    password: str

class UserUpdate(BaseModel):
    """User update schema"""
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    language: Optional[Language] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None

class UserResponse(UserBase):
    """User response schema"""
    id: int
    role: UserRole
    subscription_type: SubscriptionType
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserSession(BaseModel):
    """User session schema"""
    id: int
    user_id: int
    session_token: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

class Token(BaseModel):
    """Authentication token schema"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    """Token data schema"""
    username: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[UserRole] = None

class PasswordChange(BaseModel):
    """Password change schema"""
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v

class PasswordReset(BaseModel):
    """Password reset schema"""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema"""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v
