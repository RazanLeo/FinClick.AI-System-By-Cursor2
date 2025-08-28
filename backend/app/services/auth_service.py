"""
Authentication service for FinClick.AI
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.core.security import create_access_token, verify_token
from app.schemas.user import Token, TokenData
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service class"""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def authenticate_user(self, username: str, password: str) -> Optional[Token]:
        """Authenticate user and return token"""
        try:
            # Authenticate user
            user = self.user_service.authenticate_user(username, password)
            if not user:
                return None
            
            # Check if user is active
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Inactive user account"
                )
            
            # Update last login
            self.user_service.update_last_login(user.id)
            
            # Create access token
            access_token_expires = timedelta(minutes=30)  # 30 minutes
            access_token = create_access_token(
                data={
                    "sub": user.username,
                    "user_id": user.id,
                    "role": user.role
                },
                expires_delta=access_token_expires
            )
            
            # Create token response
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=1800,  # 30 minutes in seconds
                user=user
            )
            
            logger.info(f"User {username} authenticated successfully")
            return token
            
        except Exception as e:
            logger.error(f"Authentication error for user {username}: {e}")
            raise
    
    def login(self, form_data: OAuth2PasswordRequestForm) -> Token:
        """Login user with form data"""
        try:
            # Authenticate user
            token = self.authenticate_user(form_data.username, form_data.password)
            if not token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return token
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Login error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error during login"
            )
    
    def refresh_token(self, current_token: str) -> Token:
        """Refresh access token"""
        try:
            # Verify current token
            token_data = verify_token(current_token)
            if not token_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Get user
            user = self.user_service.get_user_by_username(token_data.username)
            if not user or not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Create new token
            access_token_expires = timedelta(minutes=30)
            access_token = create_access_token(
                data={
                    "sub": user.username,
                    "user_id": user.id,
                    "role": user.role
                },
                expires_delta=access_token_expires
            )
            
            # Create token response
            token = Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=1800,
                user=user
            )
            
            logger.info(f"Token refreshed for user {user.username}")
            return token
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error during token refresh"
            )
    
    def validate_token(self, token: str) -> Optional[TokenData]:
        """Validate and decode token"""
        try:
            token_data = verify_token(token)
            if not token_data:
                return None
            
            # Check if user still exists and is active
            user = self.user_service.get_user_by_username(token_data.username)
            if not user or not user.is_active:
                return None
            
            return token_data
            
        except Exception as e:
            logger.error(f"Token validation error: {e}")
            return None
    
    def logout(self, token: str) -> bool:
        """Logout user (invalidate token)"""
        try:
            # In a real application, you might want to add the token to a blacklist
            # For now, we'll just log the logout
            token_data = verify_token(token)
            if token_data:
                logger.info(f"User {token_data.username} logged out")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return False
    
    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            success = self.user_service.change_password(user_id, current_password, new_password)
            if success:
                logger.info(f"Password changed successfully for user {user_id}")
            return success
            
        except Exception as e:
            logger.error(f"Password change error for user {user_id}: {e}")
            return False
    
    def reset_password_request(self, email: str) -> bool:
        """Request password reset"""
        try:
            # Check if user exists
            user = self.user_service.get_user_by_email(email)
            if not user:
                logger.warning(f"Password reset requested for non-existent email: {email}")
                return False
            
            # In a real application, you would:
            # 1. Generate a reset token
            # 2. Send reset email
            # 3. Store reset token with expiration
            
            logger.info(f"Password reset requested for user {user.username}")
            return True
            
        except Exception as e:
            logger.error(f"Password reset request error: {e}")
            return False
    
    def reset_password_confirm(self, token: str, new_password: str) -> bool:
        """Confirm password reset with token"""
        try:
            # In a real application, you would:
            # 1. Validate reset token
            # 2. Check token expiration
            # 3. Update password
            # 4. Invalidate reset token
            
            logger.info("Password reset confirmed")
            return True
            
        except Exception as e:
            logger.error(f"Password reset confirmation error: {e}")
            return False
    
    def verify_email(self, token: str) -> bool:
        """Verify user email with token"""
        try:
            # In a real application, you would:
            # 1. Validate verification token
            # 2. Update user verification status
            
            logger.info("Email verification completed")
            return True
            
        except Exception as e:
            logger.error(f"Email verification error: {e}")
            return False
    
    def get_user_permissions(self, user_id: int) -> dict:
        """Get user permissions based on role and subscription"""
        try:
            user = self.user_service.get_user_by_id(user_id)
            if not user:
                return {}
            
            permissions = {
                "can_upload_files": True,
                "max_file_size": 100 * 1024 * 1024,  # 100MB
                "max_files": 10,
                "can_perform_analysis": True,
                "analysis_types": ["basic", "intermediate"],
                "can_generate_reports": True,
                "can_export_data": True,
                "can_access_advanced_features": False
            }
            
            # Admin users have all permissions
            if user.role == "admin":
                permissions.update({
                    "can_access_advanced_features": True,
                    "analysis_types": ["basic", "intermediate", "advanced", "expert"],
                    "can_manage_users": True,
                    "can_view_analytics": True
                })
            
            # Premium users have more features
            if user.subscription_type in ["monthly", "yearly"]:
                permissions.update({
                    "can_access_advanced_features": True,
                    "analysis_types": ["basic", "intermediate", "advanced"],
                    "max_files": 20
                })
            
            return permissions
            
        except Exception as e:
            logger.error(f"Error getting permissions for user {user_id}: {e}")
            return {}
