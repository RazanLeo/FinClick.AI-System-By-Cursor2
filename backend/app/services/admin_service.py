"""
Admin service for FinClick.AI
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging
import json

from app.models.user import User, UserRole, SubscriptionType
from app.models.financial import FinancialAnalysis, UploadedFile
from app.core.database import get_mongodb

logger = logging.getLogger(__name__)

class AdminService:
    """Admin service class"""
    
    def __init__(self, db: Session):
        self.db = db
        self.mongodb = get_mongodb()
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get admin dashboard statistics"""
        try:
            # User statistics
            total_users = self.db.query(func.count(User.id)).scalar()
            active_users = self.db.query(func.count(User.id)).filter(User.is_active == True).scalar()
            new_users_today = self.db.query(func.count(User.id)).filter(
                User.created_at >= datetime.utcnow().date()
            ).scalar()
            
            # Subscription statistics
            monthly_subscribers = self.db.query(func.count(User.id)).filter(
                User.subscription_type == SubscriptionType.MONTHLY
            ).scalar()
            yearly_subscribers = self.db.query(func.count(User.id)).filter(
                User.subscription_type == SubscriptionType.YEARLY
            ).scalar()
            trial_users = self.db.query(func.count(User.id)).filter(
                User.subscription_type == SubscriptionType.TRIAL
            ).scalar()
            
            # Analysis statistics
            total_analyses = self.db.query(func.count(FinancialAnalysis.id)).scalar()
            completed_analyses = self.db.query(func.count(FinancialAnalysis.id)).filter(
                FinancialAnalysis.status == "completed"
            ).scalar()
            pending_analyses = self.db.query(func.count(FinancialAnalysis.id)).filter(
                FinancialAnalysis.status == "pending"
            ).scalar()
            
            # File statistics
            total_files = self.db.query(func.count(UploadedFile.id)).scalar()
            processed_files = self.db.query(func.count(UploadedFile.id)).filter(
                UploadedFile.is_processed == True
            ).scalar()
            
            # Recent activity
            recent_users = self.db.query(User).order_by(desc(User.created_at)).limit(5).all()
            recent_analyses = self.db.query(FinancialAnalysis).order_by(desc(FinancialAnalysis.created_at)).limit(5).all()
            
            dashboard_data = {
                "users": {
                    "total": total_users,
                    "active": active_users,
                    "new_today": new_users_today,
                    "subscriptions": {
                        "monthly": monthly_subscribers,
                        "yearly": yearly_subscribers,
                        "trial": trial_users
                    }
                },
                "analyses": {
                    "total": total_analyses,
                    "completed": completed_analyses,
                    "pending": pending_analyses,
                    "completion_rate": (completed_analyses / total_analyses * 100) if total_analyses > 0 else 0
                },
                "files": {
                    "total": total_files,
                    "processed": processed_files,
                    "processing_rate": (processed_files / total_files * 100) if total_files > 0 else 0
                },
                "recent_activity": {
                    "users": [
                        {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "created_at": user.created_at.isoformat()
                        }
                        for user in recent_users
                    ],
                    "analyses": [
                        {
                            "id": analysis.id,
                            "company_name": analysis.company_name,
                            "type": analysis.analysis_type.value,
                            "status": analysis.status,
                            "created_at": analysis.created_at.isoformat()
                        }
                        for analysis in recent_analyses
                    ]
                }
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error getting dashboard data: {e}")
            return {}
    
    def get_users_statistics(self) -> Dict[str, Any]:
        """Get detailed user statistics"""
        try:
            # User growth over time
            user_growth = self.db.query(
                func.date(User.created_at).label('date'),
                func.count(User.id).label('count')
            ).group_by(func.date(User.created_at)).order_by(func.date(User.created_at)).all()
            
            # Users by role
            users_by_role = self.db.query(
                User.role,
                func.count(User.id).label('count')
            ).group_by(User.role).all()
            
            # Users by subscription type
            users_by_subscription = self.db.query(
                User.subscription_type,
                func.count(User.id).label('count')
            ).group_by(User.subscription_type).all()
            
            # Users by country
            users_by_country = self.db.query(
                User.country,
                func.count(User.id).label('count')
            ).group_by(User.country).order_by(desc(func.count(User.id))).limit(10).all()
            
            # Users by language
            users_by_language = self.db.query(
                User.language,
                func.count(User.id).label('count')
            ).group_by(User.language).all()
            
            stats = {
                "user_growth": [
                    {"date": str(item.date), "count": item.count}
                    for item in user_growth
                ],
                "users_by_role": [
                    {"role": item.role.value, "count": item.count}
                    for item in users_by_role
                ],
                "users_by_subscription": [
                    {"subscription": item.subscription_type.value, "count": item.count}
                    for item in users_by_subscription
                ],
                "users_by_country": [
                    {"country": item.country, "count": item.count}
                    for item in users_by_country
                ],
                "users_by_language": [
                    {"language": item.language, "count": item.count}
                    for item in users_by_language
                ]
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting user statistics: {e}")
            return {}
    
    def get_analyses_statistics(self) -> Dict[str, Any]:
        """Get detailed analysis statistics"""
        try:
            # Analysis growth over time
            analysis_growth = self.db.query(
                func.date(FinancialAnalysis.created_at).label('date'),
                func.count(FinancialAnalysis.id).label('count')
            ).group_by(func.date(FinancialAnalysis.created_at)).order_by(func.date(FinancialAnalysis.created_at)).all()
            
            # Analyses by type
            analyses_by_type = self.db.query(
                FinancialAnalysis.analysis_type,
                func.count(FinancialAnalysis.id).label('count')
            ).group_by(FinancialAnalysis.analysis_type).all()
            
            # Analyses by status
            analyses_by_status = self.db.query(
                FinancialAnalysis.status,
                func.count(FinancialAnalysis.id).label('count')
            ).group_by(FinancialAnalysis.status).all()
            
            # Analyses by sector
            analyses_by_sector = self.db.query(
                FinancialAnalysis.sector,
                func.count(FinancialAnalysis.id).label('count')
            ).group_by(FinancialAnalysis.sector).order_by(desc(func.count(FinancialAnalysis.id))).limit(10).all()
            
            # Analyses by comparison level
            analyses_by_comparison = self.db.query(
                FinancialAnalysis.comparison_level,
                func.count(FinancialAnalysis.id).label('count')
            ).group_by(FinancialAnalysis.comparison_level).all()
            
            stats = {
                "analysis_growth": [
                    {"date": str(item.date), "count": item.count}
                    for item in analysis_growth
                ],
                "analyses_by_type": [
                    {"type": item.analysis_type.value, "count": item.count}
                    for item in analyses_by_type
                ],
                "analyses_by_status": [
                    {"status": item.status, "count": item.count}
                    for item in analyses_by_status
                ],
                "analyses_by_sector": [
                    {"sector": item.sector, "count": item.count}
                    for item in analyses_by_sector
                ],
                "analyses_by_comparison": [
                    {"level": item.comparison_level, "count": item.count}
                    for item in analyses_by_comparison
                ]
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting analysis statistics: {e}")
            return {}
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get system health status"""
        try:
            # Database health
            db_health = "healthy"
            try:
                self.db.execute("SELECT 1")
            except Exception:
                db_health = "unhealthy"
            
            # MongoDB health
            mongo_health = "healthy"
            try:
                self.mongodb.admin.command('ping')
            except Exception:
                mongo_health = "unhealthy"
            
            # System metrics
            total_disk_usage = 0  # In a real app, get actual disk usage
            memory_usage = 0      # In a real app, get actual memory usage
            cpu_usage = 0         # In a real app, get actual CPU usage
            
            # Active connections (simulated)
            active_connections = 10
            
            health_status = {
                "overall_status": "healthy" if all([db_health == "healthy", mongo_health == "healthy"]) else "degraded",
                "components": {
                    "database": db_health,
                    "mongodb": mongo_health
                },
                "metrics": {
                    "disk_usage": total_disk_usage,
                    "memory_usage": memory_usage,
                    "cpu_usage": cpu_usage,
                    "active_connections": active_connections
                },
                "last_check": datetime.utcnow().isoformat()
            }
            
            return health_status
            
        except Exception as e:
            logger.error(f"Error getting system health: {e}")
            return {"overall_status": "unknown", "error": str(e)}
    
    def suspend_user(self, user_id: int) -> bool:
        """Suspend user account"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} suspended by admin")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error suspending user {user_id}: {e}")
            return False
    
    def activate_user(self, user_id: int) -> bool:
        """Activate suspended user account"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            user.is_active = True
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} activated by admin")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error activating user {user_id}: {e}")
            return False
    
    def change_user_role(self, user_id: int, new_role: str) -> bool:
        """Change user role"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            # Validate role
            valid_roles = [role.value for role in UserRole]
            if new_role not in valid_roles:
                return False
            
            user.role = new_role
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} role changed to {new_role} by admin")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing user role {user_id}: {e}")
            return False
    
    def extend_user_subscription(self, user_id: int, days: int) -> bool:
        """Extend user subscription"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            # Extend subscription
            if user.subscription_end:
                user.subscription_end += timedelta(days=days)
            else:
                user.subscription_end = datetime.utcnow() + timedelta(days=days)
            
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} subscription extended by {days} days")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error extending user subscription {user_id}: {e}")
            return False
    
    def get_system_logs(self, level: str = "INFO", limit: int = 100) -> List[Dict[str, Any]]:
        """Get system logs"""
        try:
            # In a real application, this would retrieve actual log files
            # For now, we'll return mock logs
            
            mock_logs = [
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "level": level,
                    "message": f"Mock system log entry {i}",
                    "source": "system"
                }
                for i in range(1, min(limit + 1, 11))
            ]
            
            return mock_logs
            
        except Exception as e:
            logger.error(f"Error getting system logs: {e}")
            return []
    
    def get_access_logs(self, user_id: int = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get access logs"""
        try:
            # In a real application, this would retrieve actual access logs
            # For now, we'll return mock logs
            
            mock_logs = [
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "user_id": user_id or 1,
                    "action": "login",
                    "ip_address": "192.168.1.1",
                    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
                for i in range(1, min(limit + 1, 11))
            ]
            
            return mock_logs
            
        except Exception as e:
            logger.error(f"Error getting access logs: {e}")
            return []
    
    def create_system_backup(self) -> Dict[str, Any]:
        """Create system backup"""
        try:
            # In a real application, this would create actual database and file backups
            # For now, we'll return mock backup information
            
            backup_info = {
                "backup_id": f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.utcnow().isoformat(),
                "type": "full",
                "size": "500 MB",
                "status": "completed",
                "location": "/backups/",
                "components": ["database", "files", "config"]
            }
            
            logger.info(f"System backup created: {backup_info['backup_id']}")
            return backup_info
            
        except Exception as e:
            logger.error(f"Error creating system backup: {e}")
            return {"status": "failed", "error": str(e)}
    
    def cleanup_system(self) -> Dict[str, Any]:
        """Clean up system"""
        try:
            # In a real application, this would perform actual cleanup tasks
            # For now, we'll return mock cleanup results
            
            cleanup_result = {
                "timestamp": datetime.utcnow().isoformat(),
                "tasks_completed": [
                    "old_log_files_removed",
                    "expired_sessions_cleaned",
                    "temp_files_deleted",
                    "database_optimized"
                ],
                "files_removed": 150,
                "sessions_cleaned": 25,
                "disk_space_freed": "2.5 GB"
            }
            
            logger.info("System cleanup completed")
            return cleanup_result
            
        except Exception as e:
            logger.error(f"Error during system cleanup: {e}")
            return {"status": "failed", "error": str(e)}
