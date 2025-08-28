"""
FinClick.AI - Router للمصادقة
تسجيل الدخول، التسجيل، إعادة تعيين كلمة المرور
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import uuid
import re

from ..core.security import (
    create_access_token, 
    create_refresh_token, 
    verify_token,
    hash_password,
    verify_password,
    get_current_user
)
from ..core.database import get_supabase_client, get_mongodb_client
from ..core.config import settings
from ..models.user import User, UserCreate, UserLogin, UserUpdate

# إعداد التسجيل
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# إعداد HTTP Bearer
security = HTTPBearer()

# أنماط التحقق
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
PASSWORD_PATTERN = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')

@router.post("/register", response_model=Dict[str, Any])
async def register_user(user_data: UserCreate):
    """تسجيل مستخدم جديد"""
    try:
        # التحقق من صحة البيانات
        validation_errors = _validate_user_data(user_data)
        if validation_errors:
            raise HTTPException(
                status_code=400,
                detail={"message": "بيانات غير صحيحة", "errors": validation_errors}
            )
        
        supabase = await get_supabase_client()
        
        # التحقق من عدم وجود البريد الإلكتروني
        existing_user = supabase.table("users").select("id").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(
                status_code=400,
                detail="البريد الإلكتروني مستخدم بالفعل"
            )
        
        # التحقق من عدم وجود اسم المستخدم
        existing_username = supabase.table("users").select("id").eq("username", user_data.username).execute()
        if existing_username.data:
            raise HTTPException(
                status_code=400,
                detail="اسم المستخدم مستخدم بالفعل"
            )
        
        # تشفير كلمة المرور
        hashed_password = hash_password(user_data.password)
        
        # إنشاء المستخدم
        user_record = {
            "id": str(uuid.uuid4()),
            "username": user_data.username,
            "email": user_data.email,
            "password_hash": hashed_password,
            "status": "active",
            "email_verified": False,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # حفظ المستخدم في Supabase
        result = supabase.table("users").insert(user_record).execute()
        
        if result.data:
            # إنشاء ملف شخصي افتراضي
            profile_data = {
                "id": user_record["id"],
                "first_name": "",
                "last_name": "",
                "phone": "",
                "language": "ar",
                "timezone": "Asia/Riyadh",
                "currency": "SAR",
                "notification_preferences": {
                    "email_notifications": True,
                    "sms_notifications": False,
                    "push_notifications": True
                },
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            supabase.table("profiles").insert(profile_data).execute()
            
            # إنشاء اشتراك مجاني
            db = await get_mongodb_client()
            subscription_collection = db.subscriptions
            
            subscription_data = {
                "subscription_id": str(uuid.uuid4()),
                "user_id": user_record["id"],
                "plan_type": "free",
                "price": 0,
                "currency": "SAR",
                "start_date": datetime.now(),
                "end_date": datetime.now() + timedelta(days=30),
                "status": "active",
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            await subscription_collection.insert_one(subscription_data)
            
            # إنشاء رموز الوصول
            access_token = create_access_token(
                data={"sub": user_record["id"]},
                expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            
            refresh_token = create_refresh_token(
                data={"sub": user_record["id"]}
            )
            
            # حفظ رمز التحديث
            await _save_refresh_token(user_record["id"], refresh_token)
            
            logger.info(f"User {user_data.email} registered successfully")
            
            return {
                "success": True,
                "message": "تم التسجيل بنجاح",
                "user": {
                    "id": user_record["id"],
                    "username": user_record["username"],
                    "email": user_record["email"],
                    "status": user_record["status"]
                },
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في إنشاء المستخدم")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail="خطأ في التسجيل")

@router.post("/login", response_model=Dict[str, Any])
async def login_user(user_data: UserLogin):
    """تسجيل دخول المستخدم"""
    try:
        supabase = await get_supabase_client()
        
        # البحث عن المستخدم
        if "@" in user_data.email_or_username:
            # تسجيل الدخول بالبريد الإلكتروني
            user = supabase.table("users").select("*").eq("email", user_data.email_or_username).execute()
        else:
            # تسجيل الدخول باسم المستخدم
            user = supabase.table("users").select("*").eq("username", user_data.email_or_username).execute()
        
        if not user.data:
            raise HTTPException(
                status_code=401,
                detail="بيانات تسجيل الدخول غير صحيحة"
            )
        
        user_record = user.data[0]
        
        # التحقق من كلمة المرور
        if not verify_password(user_data.password, user_record["password_hash"]):
            raise HTTPException(
                status_code=401,
                detail="بيانات تسجيل الدخول غير صحيحة"
            )
        
        # التحقق من حالة الحساب
        if user_record["status"] != "active":
            raise HTTPException(
                status_code=403,
                detail="الحساب غير نشط"
            )
        
        # إنشاء رموز الوصول
        access_token = create_access_token(
            data={"sub": user_record["id"]},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        refresh_token = create_refresh_token(
            data={"sub": user_record["id"]}
        )
        
        # حفظ رمز التحديث
        await _save_refresh_token(user_record["id"], refresh_token)
        
        # تحديث آخر تسجيل دخول
        supabase.table("users").update({
            "last_login": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }).eq("id", user_record["id"]).execute()
        
        logger.info(f"User {user_record['email']} logged in successfully")
        
        return {
            "success": True,
            "message": "تم تسجيل الدخول بنجاح",
            "user": {
                "id": user_record["id"],
                "username": user_record["username"],
                "email": user_record["email"],
                "status": user_record["status"]
            },
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تسجيل الدخول")

@router.post("/refresh", response_model=Dict[str, Any])
async def refresh_access_token(
    refresh_token: str,
    current_user: User = Depends(get_current_user)
):
    """تحديث رمز الوصول"""
    try:
        # التحقق من رمز التحديث
        if not await _verify_refresh_token(current_user.id, refresh_token):
            raise HTTPException(
                status_code=401,
                detail="رمز التحديث غير صحيح"
            )
        
        # إنشاء رمز وصول جديد
        new_access_token = create_access_token(
            data={"sub": current_user.id},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "success": True,
            "access_token": new_access_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحديث الرمز")

@router.post("/logout")
async def logout_user(
    current_user: User = Depends(get_current_user),
    refresh_token: str = None
):
    """تسجيل خروج المستخدم"""
    try:
        # حذف رمز التحديث
        if refresh_token:
            await _delete_refresh_token(current_user.id, refresh_token)
        
        logger.info(f"User {current_user.email} logged out successfully")
        
        return {
            "success": True,
            "message": "تم تسجيل الخروج بنجاح"
        }
        
    except Exception as e:
        logger.error(f"Error logging out user: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تسجيل الخروج")

@router.post("/forgot-password")
async def forgot_password(email: str):
    """إعادة تعيين كلمة المرور"""
    try:
        # التحقق من صحة البريد الإلكتروني
        if not EMAIL_PATTERN.match(email):
            raise HTTPException(
                status_code=400,
                detail="بريد إلكتروني غير صحيح"
            )
        
        supabase = await get_supabase_client()
        
        # البحث عن المستخدم
        user = supabase.table("users").select("id, username").eq("email", email).execute()
        
        if not user.data:
            # لا نكشف عن وجود البريد الإلكتروني أم لا
            return {
                "success": True,
                "message": "إذا كان البريد الإلكتروني مسجل، سيتم إرسال رابط إعادة التعيين"
            }
        
        user_record = user.data[0]
        
        # إنشاء رمز إعادة التعيين
        reset_token = str(uuid.uuid4())
        reset_expires = datetime.now() + timedelta(hours=24)
        
        # حفظ رمز إعادة التعيين
        db = await get_mongodb_client()
        collection = db.password_resets
        
        reset_data = {
            "user_id": user_record["id"],
            "reset_token": reset_token,
            "expires_at": reset_expires,
            "used": False,
            "created_at": datetime.now()
        }
        
        await collection.insert_one(reset_data)
        
        # إرسال بريد إعادة التعيين (محاكاة)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        # في الواقع سيتم إرسال البريد الإلكتروني
        logger.info(f"Password reset requested for {email}, reset URL: {reset_url}")
        
        return {
            "success": True,
            "message": "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing forgot password: {e}")
        raise HTTPException(status_code=500, detail="خطأ في معالجة طلب إعادة التعيين")

@router.post("/reset-password")
async def reset_password(
    reset_token: str,
    new_password: str
):
    """إعادة تعيين كلمة المرور باستخدام الرمز"""
    try:
        # التحقق من صحة كلمة المرور الجديدة
        if not PASSWORD_PATTERN.match(new_password):
            raise HTTPException(
                status_code=400,
                detail="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
            )
        
        db = await get_mongodb_client()
        collection = db.password_resets
        
        # البحث عن رمز إعادة التعيين
        reset_record = await collection.find_one({
            "reset_token": reset_token,
            "used": False,
            "expires_at": {"$gt": datetime.now()}
        })
        
        if not reset_record:
            raise HTTPException(
                status_code=400,
                detail="رمز إعادة التعيين غير صحيح أو منتهي الصلاحية"
            )
        
        # تشفير كلمة المرور الجديدة
        hashed_password = hash_password(new_password)
        
        # تحديث كلمة المرور
        supabase = await get_supabase_client()
        result = supabase.table("users").update({
            "password_hash": hashed_password,
            "updated_at": datetime.now().isoformat()
        }).eq("id", reset_record["user_id"]).execute()
        
        if result.data:
            # تحديد رمز إعادة التعيين كمستخدم
            await collection.update_one(
                {"reset_token": reset_token},
                {"$set": {"used": True}}
            )
            
            # حذف جميع رموز التحديث للمستخدم
            await _delete_all_refresh_tokens(reset_record["user_id"])
            
            logger.info(f"Password reset successfully for user {reset_record['user_id']}")
            
            return {
                "success": True,
                "message": "تم إعادة تعيين كلمة المرور بنجاح"
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في تحديث كلمة المرور")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting password: {e}")
        raise HTTPException(status_code=500, detail="خطأ في إعادة تعيين كلمة المرور")

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user)
):
    """تغيير كلمة المرور"""
    try:
        # التحقق من صحة كلمة المرور الجديدة
        if not PASSWORD_PATTERN.match(new_password):
            raise HTTPException(
                status_code=400,
                detail="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
            )
        
        supabase = await get_supabase_client()
        
        # الحصول على المستخدم مع كلمة المرور
        user = supabase.table("users").select("password_hash").eq("id", current_user.id).execute()
        
        if not user.data:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
        
        user_record = user.data[0]
        
        # التحقق من كلمة المرور الحالية
        if not verify_password(current_password, user_record["password_hash"]):
            raise HTTPException(
                status_code=400,
                detail="كلمة المرور الحالية غير صحيحة"
            )
        
        # تشفير كلمة المرور الجديدة
        hashed_password = hash_password(new_password)
        
        # تحديث كلمة المرور
        result = supabase.table("users").update({
            "password_hash": hashed_password,
            "updated_at": datetime.now().isoformat()
        }).eq("id", current_user.id).execute()
        
        if result.data:
            # حذف جميع رموز التحديث للمستخدم
            await _delete_all_refresh_tokens(current_user.id)
            
            logger.info(f"Password changed successfully for user {current_user.id}")
            
            return {
                "success": True,
                "message": "تم تغيير كلمة المرور بنجاح"
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في تحديث كلمة المرور")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تغيير كلمة المرور")

@router.post("/verify-email")
async def verify_email(
    verification_token: str
):
    """التحقق من البريد الإلكتروني"""
    try:
        db = await get_mongodb_client()
        collection = db.email_verifications
        
        # البحث عن رمز التحقق
        verification_record = await collection.find_one({
            "verification_token": verification_token,
            "used": False,
            "expires_at": {"$gt": datetime.now()}
        })
        
        if not verification_record:
            raise HTTPException(
                status_code=400,
                detail="رمز التحقق غير صحيح أو منتهي الصلاحية"
            )
        
        # تحديث حالة التحقق
        supabase = await get_supabase_client()
        result = supabase.table("users").update({
            "email_verified": True,
            "updated_at": datetime.now().isoformat()
        }).eq("id", verification_record["user_id"]).execute()
        
        if result.data:
            # تحديد رمز التحقق كمستخدم
            await collection.update_one(
                {"verification_token": verification_token},
                {"$set": {"used": True}}
            )
            
            logger.info(f"Email verified successfully for user {verification_record['user_id']}")
            
            return {
                "success": True,
                "message": "تم التحقق من البريد الإلكتروني بنجاح"
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في تحديث حالة التحقق")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying email: {e}")
        raise HTTPException(status_code=500, detail="خطأ في التحقق من البريد الإلكتروني")

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """الحصول على معلومات المستخدم الحالي"""
    try:
        supabase = await get_supabase_client()
        
        # الحصول على معلومات المستخدم الكاملة
        user = supabase.table("users").select("*").eq("id", current_user.id).execute()
        
        if user.data:
            user_record = user.data[0]
            
            # إزالة كلمة المرور من النتيجة
            user_record.pop("password_hash", None)
            
            return {
                "success": True,
                "user": user_record
            }
        else:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user info: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على معلومات المستخدم")

# الدوال المساعدة
def _validate_user_data(user_data: UserCreate) -> list:
    """التحقق من صحة بيانات المستخدم"""
    errors = []
    
    # التحقق من اسم المستخدم
    if not USERNAME_PATTERN.match(user_data.username):
        errors.append("اسم المستخدم يجب أن يكون 3-20 حرف، أحرف وأرقام وشرطة سفلية فقط")
    
    # التحقق من البريد الإلكتروني
    if not EMAIL_PATTERN.match(user_data.email):
        errors.append("بريد إلكتروني غير صحيح")
    
    # التحقق من كلمة المرور
    if not PASSWORD_PATTERN.match(user_data.password):
        errors.append("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص")
    
    return errors

async def _save_refresh_token(user_id: str, refresh_token: str):
    """حفظ رمز التحديث"""
    try:
        db = await get_mongodb_client()
        collection = db.refresh_tokens
        
        token_data = {
            "user_id": user_id,
            "refresh_token": refresh_token,
            "created_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(days=30)
        }
        
        await collection.insert_one(token_data)
        
    except Exception as e:
        logger.error(f"Error saving refresh token: {e}")

async def _verify_refresh_token(user_id: str, refresh_token: str) -> bool:
    """التحقق من صحة رمز التحديث"""
    try:
        db = await get_mongodb_client()
        collection = db.refresh_tokens
        
        token_record = await collection.find_one({
            "user_id": user_id,
            "refresh_token": refresh_token,
            "expires_at": {"$gt": datetime.now()}
        })
        
        return token_record is not None
        
    except Exception as e:
        logger.error(f"Error verifying refresh token: {e}")
        return False

async def _delete_refresh_token(user_id: str, refresh_token: str):
    """حذف رمز تحديث محدد"""
    try:
        db = await get_mongodb_client()
        collection = db.refresh_tokens
        
        await collection.delete_one({
            "user_id": user_id,
            "refresh_token": refresh_token
        })
        
    except Exception as e:
        logger.error(f"Error deleting refresh token: {e}")

async def _delete_all_refresh_tokens(user_id: str):
    """حذف جميع رموز التحديث للمستخدم"""
    try:
        db = await get_mongodb_client()
        collection = db.refresh_tokens
        
        await collection.delete_many({"user_id": user_id})
        
    except Exception as e:
        logger.error(f"Error deleting all refresh tokens: {e}")
