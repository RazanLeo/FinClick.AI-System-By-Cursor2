"""
FinClick.AI - Router لإدارة المستخدمين
إدارة المستخدمين والملفات الشخصية والاشتراكات
"""

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
from pydantic import BaseModel, EmailStr

from ..core.security import get_current_user, get_current_active_user, check_permissions
from ..core.database import get_supabase_client, get_mongodb_client
from ..models.user import User, UserProfile, UserUpdate

# إعداد التسجيل
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/users", tags=["Users Management"])

# نماذج البيانات
class ProfileUpdate(BaseModel):
    """تحديث الملف الشخصي"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None
    notification_preferences: Optional[Dict[str, bool]] = None

class UserStats(BaseModel):
    """إحصائيات المستخدم"""
    total_analyses: int
    total_documents: int
    subscription_status: str
    usage_this_month: Dict[str, int]
    last_activity: datetime

class UserSearch(BaseModel):
    """بحث المستخدمين (للمشرفين)"""
    query: str
    filters: Optional[Dict[str, Any]] = None
    limit: int = 20
    offset: int = 0

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على معلومات المستخدم الحالي"""
    return current_user

@router.get("/me/profile", response_model=UserProfile)
async def get_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على الملف الشخصي للمستخدم"""
    try:
        supabase = await get_supabase_client()
        
        # الحصول على الملف الشخصي من Supabase
        response = supabase.table("profiles").select("*").eq("id", current_user.id).execute()
        
        if response.data:
            profile_data = response.data[0]
            return UserProfile(**profile_data)
        else:
            # إنشاء ملف شخصي افتراضي
            default_profile = UserProfile(
                id=current_user.id,
                first_name="",
                last_name="",
                phone="",
                language="ar",
                timezone="Asia/Riyadh",
                currency="SAR",
                notification_preferences={
                    "email_notifications": True,
                    "sms_notifications": False,
                    "push_notifications": True
                },
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            return default_profile
            
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على الملف الشخصي")

@router.put("/me/profile", response_model=UserProfile)
async def update_user_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """تحديث الملف الشخصي للمستخدم"""
    try:
        supabase = await get_supabase_client()
        
        # تحديث البيانات
        update_data = profile_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now().isoformat()
        
        # التحقق من وجود الملف الشخصي
        response = supabase.table("profiles").select("id").eq("id", current_user.id).execute()
        
        if response.data:
            # تحديث الملف الموجود
            response = supabase.table("profiles").update(update_data).eq("id", current_user.id).execute()
        else:
            # إنشاء ملف جديد
            profile_data = {
                "id": current_user.id,
                **update_data,
                "created_at": datetime.now().isoformat()
            }
            response = supabase.table("profiles").insert(profile_data).execute()
        
        if response.data:
            return UserProfile(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="خطأ في تحديث الملف الشخصي")
            
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحديث الملف الشخصي")

@router.get("/me/stats", response_model=UserStats)
async def get_user_stats(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على إحصائيات المستخدم"""
    try:
        db = await get_mongodb_client()
        
        # إحصائيات التحليل
        analyses_collection = db.analyses
        total_analyses = await analyses_collection.count_documents({"user_id": current_user.id})
        
        # إحصائيات المستندات
        documents_collection = db.documents
        total_documents = await documents_collection.count_documents({"user_id": current_user.id})
        
        # إحصائيات الاستخدام الشهري
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        usage_this_month = {
            "analyses": await analyses_collection.count_documents({
                "user_id": current_user.id,
                "timestamp": {"$gte": current_month}
            }),
            "documents": await documents_collection.count_documents({
                "user_id": current_user.id,
                "uploaded_at": {"$gte": current_month}
            })
        }
        
        # آخر نشاط
        last_analysis = await analyses_collection.find_one(
            {"user_id": current_user.id},
            sort=[("timestamp", -1)]
        )
        last_document = await documents_collection.find_one(
            {"user_id": current_user.id},
            sort=[("uploaded_at", -1)]
        )
        
        last_activity = max(
            last_analysis["timestamp"] if last_analysis else datetime.min,
            last_document["uploaded_at"] if last_document else datetime.min
        )
        
        # حالة الاشتراك (محاكاة)
        subscription_status = "active"  # في الواقع سيتم الحصول عليها من قاعدة البيانات
        
        return UserStats(
            total_analyses=total_analyses,
            total_documents=total_documents,
            subscription_status=subscription_status,
            usage_this_month=usage_this_month,
            last_activity=last_activity
        )
        
    except Exception as e:
        logger.error(f"Error getting user stats: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على الإحصائيات")

@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """رفع صورة الملف الشخصي"""
    try:
        # التحقق من نوع الملف
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="يجب أن يكون الملف صورة")
        
        # التحقق من حجم الملف (5MB كحد أقصى)
        if file.size > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="حجم الملف يجب أن يكون أقل من 5MB")
        
        # قراءة محتوى الملف
        content = await file.read()
        
        # حفظ الصورة (في الواقع سيتم حفظها في خدمة تخزين سحابية)
        # هنا نستخدم MongoDB كمثال
        db = await get_mongodb_client()
        collection = db.user_avatars
        
        avatar_doc = {
            "user_id": current_user.id,
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size,
            "content": content,
            "uploaded_at": datetime.now()
        }
        
        # حذف الصورة القديمة إن وجدت
        await collection.delete_one({"user_id": current_user.id})
        
        # حفظ الصورة الجديدة
        result = await collection.insert_one(avatar_doc)
        
        if result.inserted_id:
            return {
                "success": True,
                "message": "تم رفع الصورة بنجاح",
                "avatar_id": str(result.inserted_id)
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في حفظ الصورة")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading avatar: {e}")
        raise HTTPException(status_code=500, detail="خطأ في رفع الصورة")

@router.get("/me/avatar")
async def get_avatar(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على صورة الملف الشخصي"""
    try:
        db = await get_mongodb_client()
        collection = db.user_avatars
        
        avatar = await collection.find_one({"user_id": current_user.id})
        
        if avatar:
            return {
                "success": True,
                "avatar_url": f"/api/v1/users/me/avatar/{current_user.id}",
                "filename": avatar["filename"],
                "content_type": avatar["content_type"],
                "size": avatar["size"],
                "uploaded_at": avatar["uploaded_at"]
            }
        else:
            return {
                "success": False,
                "message": "لا توجد صورة للملف الشخصي"
            }
            
    except Exception as e:
        logger.error(f"Error getting avatar: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على الصورة")

@router.delete("/me/avatar")
async def delete_avatar(
    current_user: User = Depends(get_current_active_user)
):
    """حذف صورة الملف الشخصي"""
    try:
        db = await get_mongodb_client()
        collection = db.user_avatars
        
        result = await collection.delete_one({"user_id": current_user.id})
        
        if result.deleted_count > 0:
            return {
                "success": True,
                "message": "تم حذف الصورة بنجاح"
            }
        else:
            return {
                "success": False,
                "message": "لا توجد صورة للحذف"
            }
            
    except Exception as e:
        logger.error(f"Error deleting avatar: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حذف الصورة")

@router.get("/me/notifications")
async def get_notifications(
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(20, description="عدد الإشعارات"),
    offset: int = Query(0, description="الإزاحة")
):
    """الحصول على إشعارات المستخدم"""
    try:
        db = await get_mongodb_client()
        collection = db.notifications
        
        cursor = collection.find(
            {"user_id": current_user.id},
            {"_id": 0}
        ).sort("created_at", -1).skip(offset).limit(limit)
        
        notifications = await cursor.to_list(length=limit)
        
        return {
            "success": True,
            "data": notifications,
            "total": len(notifications)
        }
        
    except Exception as e:
        logger.error(f"Error getting notifications: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على الإشعارات")

@router.put("/me/notifications/read")
async def mark_notifications_read(
    notification_ids: List[str],
    current_user: User = Depends(get_current_active_user)
):
    """تحديد الإشعارات كمقروءة"""
    try:
        db = await get_mongodb_client()
        collection = db.notifications
        
        result = await collection.update_many(
            {
                "user_id": current_user.id,
                "notification_id": {"$in": notification_ids}
            },
            {"$set": {"read": True, "read_at": datetime.now()}}
        )
        
        return {
            "success": True,
            "message": f"تم تحديث {result.modified_count} إشعار",
            "updated_count": result.modified_count
        }
        
    except Exception as e:
        logger.error(f"Error marking notifications read: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحديث الإشعارات")

# === إدارة المستخدمين (للمشرفين فقط) ===

@router.get("/admin/users", response_model=List[User])
async def get_all_users(
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(50, description="عدد المستخدمين"),
    offset: int = Query(0, description="الإزاحة"),
    search: Optional[str] = Query(None, description="بحث في الأسماء أو البريد الإلكتروني"),
    status: Optional[str] = Query(None, description="حالة الحساب")
):
    """الحصول على جميع المستخدمين (للمشرفين فقط)"""
    try:
        # التحقق من الصلاحيات
        if not await check_permissions(current_user.id, "admin:users:read"):
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض المستخدمين")
        
        supabase = await get_supabase_client()
        
        # بناء استعلام البحث
        query = supabase.table("users").select("*")
        
        if search:
            query = query.or_(f"username.ilike.%{search}%,email.ilike.%{search}%")
        
        if status:
            query = query.eq("status", status)
        
        # تنفيذ الاستعلام
        response = query.range(offset, offset + limit - 1).execute()
        
        if response.data:
            return [User(**user_data) for user_data in response.data]
        else:
            return []
            
    except Exception as e:
        logger.error(f"Error getting all users: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على المستخدمين")

@router.get("/admin/users/{user_id}", response_model=User)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على مستخدم محدد (للمشرفين فقط)"""
    try:
        # التحقق من الصلاحيات
        if not await check_permissions(current_user.id, "admin:users:read"):
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض المستخدمين")
        
        supabase = await get_supabase_client()
        
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if response.data:
            return User(**response.data[0])
        else:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user by ID: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على المستخدم")

@router.put("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status: str,
    current_user: User = Depends(get_current_active_user)
):
    """تحديث حالة المستخدم (للمشرفين فقط)"""
    try:
        # التحقق من الصلاحيات
        if not await check_permissions(current_user.id, "admin:users:update"):
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية لتحديث المستخدمين")
        
        # التحقق من صحة الحالة
        valid_statuses = ["active", "inactive", "suspended", "banned"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"الحالة يجب أن تكون واحدة من: {', '.join(valid_statuses)}"
            )
        
        supabase = await get_supabase_client()
        
        response = supabase.table("users").update({
            "status": status,
            "updated_at": datetime.now().isoformat()
        }).eq("id", user_id).execute()
        
        if response.data:
            return {
                "success": True,
                "message": f"تم تحديث حالة المستخدم إلى {status}",
                "user_id": user_id,
                "new_status": status
            }
        else:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user status: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تحديث حالة المستخدم")

@router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """حذف مستخدم (للمشرفين فقط)"""
    try:
        # التحقق من الصلاحيات
        if not await check_permissions(current_user.id, "admin:users:delete"):
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية لحذف المستخدمين")
        
        # منع حذف المستخدم الحالي
        if user_id == current_user.id:
            raise HTTPException(status_code=400, detail="لا يمكنك حذف حسابك")
        
        supabase = await get_supabase_client()
        
        # حذف المستخدم من Supabase
        response = supabase.table("users").delete().eq("id", user_id).execute()
        
        if response.data:
            # حذف البيانات المرتبطة من MongoDB
            db = await get_mongodb_client()
            
            # حذف التحليلات
            analyses_collection = db.analyses
            await analyses_collection.delete_many({"user_id": user_id})
            
            # حذف المستندات
            documents_collection = db.documents
            await documents_collection.delete_many({"user_id": user_id})
            
            # حذف الإشعارات
            notifications_collection = db.notifications
            await notifications_collection.delete_many({"user_id": user_id})
            
            # حذف الصورة الشخصية
            avatars_collection = db.user_avatars
            await avatars_collection.delete_many({"user_id": user_id})
            
            return {
                "success": True,
                "message": "تم حذف المستخدم وجميع بياناته بنجاح",
                "user_id": user_id
            }
        else:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حذف المستخدم")

@router.get("/admin/users/{user_id}/activity")
async def get_user_activity(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
    days: int = Query(30, description="عدد الأيام")
):
    """الحصول على نشاط المستخدم (للمشرفين فقط)"""
    try:
        # التحقق من الصلاحيات
        if not await check_permissions(current_user.id, "admin:users:read"):
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض نشاط المستخدمين")
        
        db = await get_mongodb_client()
        
        # حساب التاريخ
        from_date = datetime.now() - timedelta(days=days)
        
        # نشاط التحليل
        analyses_collection = db.analyses
        analysis_activity = await analyses_collection.aggregate([
            {
                "$match": {
                    "user_id": user_id,
                    "timestamp": {"$gte": from_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                        "type": "$analysis_type"
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id.date": 1}
            }
        ]).to_list(length=None)
        
        # نشاط المستندات
        documents_collection = db.documents
        document_activity = await documents_collection.aggregate([
            {
                "$match": {
                    "user_id": user_id,
                    "uploaded_at": {"$gte": from_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$uploaded_at"}},
                        "type": "$document_type"
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id.date": 1}
            }
        ]).to_list(length=None)
        
        return {
            "success": True,
            "user_id": user_id,
            "period_days": days,
            "analysis_activity": analysis_activity,
            "document_activity": document_activity
        }
        
    except Exception as e:
        logger.error(f"Error getting user activity: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على نشاط المستخدم")
