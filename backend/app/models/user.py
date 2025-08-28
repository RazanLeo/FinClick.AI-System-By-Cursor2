"""
User model for FinClick.AI
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from .base import Base

class UserRole(str, enum.Enum):
    """User roles"""
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class SubscriptionType(str, enum.Enum):
    """Subscription types"""
    MONTHLY = "monthly"
    YEARLY = "yearly"
    TRIAL = "trial"

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    company_name = Column(String(255))
    phone = Column(String(20))
    country = Column(String(100), default="Saudi Arabia")
    city = Column(String(100))
    
    # Subscription
    subscription_type = Column(Enum(SubscriptionType), default=SubscriptionType.TRIAL)
    subscription_start = Column(DateTime(timezone=True))
    subscription_end = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Role and permissions
    role = Column(Enum(UserRole), default=UserRole.USER)
    permissions = Column(Text)  # JSON string of permissions
    
    # Preferences
    language = Column(String(10), default="ar")  # ar, en
    timezone = Column(String(50), default="Asia/Riyadh")
    currency = Column(String(10), default="SAR")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    analyses = relationship("FinancialAnalysis", back_populates="user")
    files = relationship("UploadedFile", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

class UserSession(Base):
    """User session tracking"""
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    session_token = Column(String(255), unique=True, index=True)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<UserSession(id={self.id}, user_id={self.user_id})>"

class Subscription(Base):
    """Subscription details"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    subscription_type = Column(Enum(SubscriptionType), nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in SAR
    currency = Column(String(10), default="SAR")
    payment_method = Column(String(50))
    payment_status = Column(String(50))
    transaction_id = Column(String(255))
    
    # Dates
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Subscription(id={self.id}, user_id={self.user_id}, type={self.subscription_type})>"
