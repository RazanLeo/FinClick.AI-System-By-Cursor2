"""
User service for FinClick.AI
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
from datetime import datetime, timedelta
import logging

from app.models.user import User, UserRole, SubscriptionType
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.database import get_mongodb

logger = logging.getLogger(__name__)

class UserService:
    """User service class"""
    
    def __init__(self, db: Session):
        self.db = db
        self.mongodb = get_mongodb()
    
    def create_user(self, user_data: UserCreate) -> Optional[User]:
        """Create a new user"""
        try:
            # Check if username already exists
            existing_user = self.db.query(User).filter(User.username == user_data.username).first()
            if existing_user:
                logger.warning(f"Username {user_data.username} already exists")
                return None
            
            # Check if email already exists
            existing_email = self.db.query(User).filter(User.email == user_data.email).first()
            if existing_email:
                logger.warning(f"Email {user_data.email} already exists")
                return None
            
            # Create new user
            hashed_password = get_password_hash(user_data.password)
            db_user = User(
                email=user_data.email,
                username=user_data.username,
                hashed_password=hashed_password,
                full_name=user_data.full_name,
                company_name=user_data.company_name,
                phone=user_data.phone,
                country=user_data.country,
                city=user_data.city,
                language=user_data.language,
                timezone=user_data.timezone,
                currency=user_data.currency,
                role=UserRole.USER,
                subscription_type=SubscriptionType.TRIAL,
                is_active=True,
                is_verified=False
            )
            
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            
            logger.info(f"User {user_data.username} created successfully")
            return db_user
            
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Database integrity error while creating user: {e}")
            return None
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating user: {e}")
            return None
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username and password"""
        user = self.get_user_by_username(username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return None
            
            # Update fields
            update_data = user_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"User {user_id} updated successfully")
            return user
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating user {user_id}: {e}")
            return None
    
    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            # Verify current password
            if not verify_password(current_password, user.hashed_password):
                return False
            
            # Hash and set new password
            user.hashed_password = get_password_hash(new_password)
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"Password changed successfully for user {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing password for user {user_id}: {e}")
            return False
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate a user account"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} deactivated successfully")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deactivating user {user_id}: {e}")
            return False
    
    def activate_user(self, user_id: int) -> bool:
        """Activate a user account"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.is_active = True
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"User {user_id} activated successfully")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error activating user {user_id}: {e}")
            return False
    
    def update_subscription(self, user_id: int, subscription_type: SubscriptionType, 
                          start_date: datetime, end_date: datetime) -> bool:
        """Update user subscription"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.subscription_type = subscription_type
            user.subscription_start = start_date
            user.subscription_end = end_date
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"Subscription updated for user {user_id}")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating subscription for user {user_id}: {e}")
            return False
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def get_users_by_role(self, role: UserRole) -> List[User]:
        """Get users by role"""
        return self.db.query(User).filter(User.role == role).all()
    
    def get_active_users(self) -> List[User]:
        """Get all active users"""
        return self.db.query(User).filter(User.is_active == True).all()
    
    def get_expired_subscriptions(self) -> List[User]:
        """Get users with expired subscriptions"""
        current_time = datetime.utcnow()
        return self.db.query(User).filter(
            User.subscription_end < current_time,
            User.is_active == True
        ).all()
    
    def update_last_login(self, user_id: int) -> bool:
        """Update user's last login time"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            user.last_login = datetime.utcnow()
            self.db.commit()
            return True
            
        except Exception as e:
            logger.error(f"Error updating last login for user {user_id}: {e}")
            return False
    
    def create_admin_user(self, username: str, email: str, password: str) -> Optional[User]:
        """Create an admin user (for initial setup)"""
        try:
            # Check if admin already exists
            existing_admin = self.db.query(User).filter(User.role == UserRole.ADMIN).first()
            if existing_admin:
                logger.warning("Admin user already exists")
                return None
            
            # Create admin user
            hashed_password = get_password_hash(password)
            admin_user = User(
                email=email,
                username=username,
                hashed_password=hashed_password,
                role=UserRole.ADMIN,
                subscription_type=SubscriptionType.TRIAL,
                is_active=True,
                is_verified=True,
                language="ar",
                timezone="Asia/Riyadh",
                currency="SAR"
            )
            
            self.db.add(admin_user)
            self.db.commit()
            self.db.refresh(admin_user)
            
            logger.info(f"Admin user {username} created successfully")
            return admin_user
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating admin user: {e}")
            return None
    
    def create_guest_user(self, username: str, password: str) -> Optional[User]:
        """Create a guest user account"""
        try:
            # Check if guest user already exists
            existing_guest = self.db.query(User).filter(User.username == username).first()
            if existing_guest:
                logger.warning(f"Guest user {username} already exists")
                return None
            
            # Create guest user
            hashed_password = get_password_hash(password)
            guest_user = User(
                email=f"{username}@guest.finclick.ai",
                username=username,
                hashed_password=hashed_password,
                role=UserRole.GUEST,
                subscription_type=SubscriptionType.TRIAL,
                is_active=True,
                is_verified=True,
                language="ar",
                timezone="Asia/Riyadh",
                currency="SAR"
            )
            
            self.db.add(guest_user)
            self.db.commit()
            self.db.refresh(guest_user)
            
            logger.info(f"Guest user {username} created successfully")
            return guest_user
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating guest user: {e}")
            return None
