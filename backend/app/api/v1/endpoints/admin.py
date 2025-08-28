"""
Admin endpoints for FinClick.AI
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
import logging

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.schemas.user import UserResponse
from app.services.admin_service import AdminService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get admin dashboard statistics
    """
    try:
        admin_service = AdminService(db)
        dashboard_data = admin_service.get_dashboard_data()
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Error getting admin dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/users/stats")
async def get_users_statistics(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get user statistics
    """
    try:
        admin_service = AdminService(db)
        stats = admin_service.get_users_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"Error getting user statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/analyses/stats")
async def get_analyses_statistics(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get analysis statistics
    """
    try:
        admin_service = AdminService(db)
        stats = admin_service.get_analyses_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"Error getting analysis statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/system/health")
async def get_system_health(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get system health status
    """
    try:
        admin_service = AdminService(db)
        health_status = admin_service.get_system_health()
        return health_status
        
    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/users/{user_id}/suspend")
async def suspend_user(
    user_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Suspend user account
    """
    try:
        admin_service = AdminService(db)
        success = admin_service.suspend_user(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "User suspended successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error suspending user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Activate suspended user account
    """
    try:
        admin_service = AdminService(db)
        success = admin_service.activate_user(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "User activated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error activating user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/users/{user_id}/change-role")
async def change_user_role(
    user_id: int,
    new_role: str,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Change user role
    """
    try:
        admin_service = AdminService(db)
        success = admin_service.change_user_role(user_id, new_role)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to change user role"
            )
        
        return {"message": "User role changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing user role {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/users/{user_id}/extend-subscription")
async def extend_user_subscription(
    user_id: int,
    days: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Extend user subscription
    """
    try:
        admin_service = AdminService(db)
        success = admin_service.extend_user_subscription(user_id, days)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to extend subscription"
            )
        
        return {"message": "Subscription extended successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extending subscription for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/logs/system")
async def get_system_logs(
    level: str = "INFO",
    limit: int = 100,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get system logs
    """
    try:
        admin_service = AdminService(db)
        logs = admin_service.get_system_logs(level, limit)
        return logs
        
    except Exception as e:
        logger.error(f"Error getting system logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/logs/access")
async def get_access_logs(
    user_id: int = None,
    limit: int = 100,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get access logs
    """
    try:
        admin_service = AdminService(db)
        logs = admin_service.get_access_logs(user_id, limit)
        return logs
        
    except Exception as e:
        logger.error(f"Error getting access logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/maintenance/backup")
async def create_system_backup(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Create system backup
    """
    try:
        admin_service = AdminService(db)
        backup_info = admin_service.create_system_backup()
        return backup_info
        
    except Exception as e:
        logger.error(f"Error creating system backup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/maintenance/cleanup")
async def cleanup_system(
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Clean up system (old files, expired sessions, etc.)
    """
    try:
        admin_service = AdminService(db)
        cleanup_result = admin_service.cleanup_system()
        return cleanup_result
        
    except Exception as e:
        logger.error(f"Error cleaning up system: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
