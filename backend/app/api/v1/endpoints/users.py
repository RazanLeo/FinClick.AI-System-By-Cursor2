"""
User management endpoints for FinClick.AI
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new user
    """
    user_service = UserService(db)
    user = user_service.create_user(user_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    return user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve users (admin only)
    """
    user_service = UserService(db)
    users = user_service.get_all_users(skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get user by ID (users can only see their own profile, admins can see all)
    """
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update user (users can only update their own profile, admins can update all)
    """
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user_service = UserService(db)
    user = user_service.update_user(user_id, user_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete user (admin only)
    """
    user_service = UserService(db)
    success = user_service.deactivate_user(user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deactivated successfully"}

@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Activate user (admin only)
    """
    user_service = UserService(db)
    success = user_service.activate_user(user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User activated successfully"}

@router.get("/role/{role}", response_model=List[UserResponse])
async def get_users_by_role(
    role: str,
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get users by role (admin only)
    """
    user_service = UserService(db)
    users = user_service.get_users_by_role(role)
    return users

@router.get("/active/list", response_model=List[UserResponse])
async def get_active_users(
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all active users (admin only)
    """
    user_service = UserService(db)
    users = user_service.get_active_users()
    return users

@router.get("/expired-subscriptions/list", response_model=List[UserResponse])
async def get_expired_subscriptions(
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get users with expired subscriptions (admin only)
    """
    user_service = UserService(db)
    users = user_service.get_expired_subscriptions()
    return users

@router.post("/setup/admin")
async def setup_admin_user(
    username: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Setup initial admin user (no authentication required for initial setup)
    """
    user_service = UserService(db)
    user = user_service.create_admin_user(username, email, password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user already exists or creation failed"
        )
    
    return {"message": "Admin user created successfully", "username": username}

@router.post("/setup/guest")
async def setup_guest_user(
    username: str,
    password: str,
    current_user: UserResponse = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Setup guest user account (admin only)
    """
    user_service = UserService(db)
    user = user_service.create_guest_user(username, password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guest user creation failed"
        )
    
    return {"message": "Guest user created successfully", "username": username}
