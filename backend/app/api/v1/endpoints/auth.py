"""
Authentication endpoints for FinClick.AI
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import Token, UserResponse, PasswordChange, PasswordReset, PasswordResetConfirm
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    auth_service = AuthService(db)
    return auth_service.login(form_data)

@router.post("/refresh", response_model=Token)
async def refresh_access_token(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Refresh access token
    """
    auth_service = AuthService(db)
    # In a real implementation, you would get the current token from the request
    # For now, we'll return a new token
    return auth_service.refresh_token("")

@router.post("/logout")
async def logout(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Logout user
    """
    auth_service = AuthService(db)
    # In a real implementation, you would get the current token from the request
    success = auth_service.logout("")
    if success:
        return {"message": "Successfully logged out"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Change user password
    """
    auth_service = AuthService(db)
    success = auth_service.change_password(
        current_user.id,
        password_data.current_password,
        password_data.new_password
    )
    
    if success:
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password change failed"
        )

@router.post("/reset-password-request")
async def request_password_reset(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
) -> Any:
    """
    Request password reset
    """
    auth_service = AuthService(db)
    success = auth_service.reset_password_request(reset_data.email)
    
    if success:
        return {"message": "Password reset email sent"}
    else:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a reset link has been sent"}

@router.post("/reset-password-confirm")
async def confirm_password_reset(
    confirm_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
) -> Any:
    """
    Confirm password reset with token
    """
    auth_service = AuthService(db)
    success = auth_service.reset_password_confirm(
        confirm_data.token,
        confirm_data.new_password
    )
    
    if success:
        return {"message": "Password reset successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset failed"
        )

@router.post("/verify-email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Verify user email with token
    """
    auth_service = AuthService(db)
    success = auth_service.verify_email(token)
    
    if success:
        return {"message": "Email verified successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email verification failed"
        )

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: UserResponse = Depends(get_current_user)
) -> Any:
    """
    Get current user information
    """
    return current_user

@router.get("/permissions")
async def get_user_permissions(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get current user permissions
    """
    auth_service = AuthService(db)
    permissions = auth_service.get_user_permissions(current_user.id)
    return permissions
