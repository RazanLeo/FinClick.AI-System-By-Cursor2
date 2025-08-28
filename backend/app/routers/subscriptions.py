"""
FinClick.AI - Router للاشتراكات والمدفوعات
نظام اشتراكات متكامل مع PayTabs
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import uuid
import hashlib
import hmac

from ..core.security import get_current_user, get_current_active_user
from ..core.database import get_supabase_client, get_mongodb_client
from ..core.config import settings
from ..models.user import User

# إعداد التسجيل
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/subscriptions", tags=["Subscriptions & Payments"])

# خطط الاشتراك المتاحة
SUBSCRIPTION_PLANS = {
    "free": {
        "name": "المجاني",
        "price": 0,
        "currency": "SAR",
        "duration_days": 30,
        "features": {
            "max_analyses": 5,
            "max_documents": 3,
            "ai_analysis": False,
            "priority_support": False,
            "advanced_reports": False,
            "api_access": False
        },
        "description": "خطة أساسية للمبتدئين"
    },
    "basic": {
        "name": "الأساسي",
        "price": 99,
        "currency": "SAR",
        "duration_days": 30,
        "features": {
            "max_analyses": 50,
            "max_documents": 20,
            "ai_analysis": True,
            "priority_support": False,
            "advanced_reports": False,
            "api_access": False
        },
        "description": "خطة مناسبة للمستثمرين الأفراد"
    },
    "professional": {
        "name": "المهني",
        "price": 299,
        "currency": "SAR",
        "duration_days": 30,
        "features": {
            "max_analyses": 200,
            "max_documents": 100,
            "ai_analysis": True,
            "priority_support": True,
            "advanced_reports": True,
            "api_access": False
        },
        "description": "خطة متقدمة للمحللين الماليين"
    },
    "enterprise": {
        "name": "المؤسسات",
        "price": 999,
        "currency": "SAR",
        "duration_days": 30,
        "features": {
            "max_analyses": 1000,
            "max_documents": 500,
            "ai_analysis": True,
            "priority_support": True,
            "advanced_reports": True,
            "api_access": True
        },
        "description": "خطة شاملة للمؤسسات والشركات"
    }
}

@router.get("/plans", response_model=Dict[str, Any])
async def get_subscription_plans():
    """الحصول على خطط الاشتراك المتاحة"""
    try:
        return {
            "success": True,
            "plans": SUBSCRIPTION_PLANS,
            "current_currency": "SAR",
            "billing_cycle": "monthly"
        }
    except Exception as e:
        logger.error(f"Error getting subscription plans: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على خطط الاشتراك")

@router.get("/my-subscription", response_model=Dict[str, Any])
async def get_my_subscription(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على اشتراك المستخدم الحالي"""
    try:
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        # البحث عن الاشتراك النشط
        subscription = await collection.find_one({
            "user_id": current_user.id,
            "status": "active"
        })
        
        if subscription:
            # حساب الأيام المتبقية
            end_date = subscription["end_date"]
            days_remaining = (end_date - datetime.now()).days
            
            # الحصول على تفاصيل الخطة
            plan_details = SUBSCRIPTION_PLANS.get(subscription["plan_type"], {})
            
            return {
                "success": True,
                "subscription": {
                    "plan_type": subscription["plan_type"],
                    "plan_name": plan_details.get("name", "غير محدد"),
                    "start_date": subscription["start_date"],
                    "end_date": subscription["end_date"],
                    "days_remaining": max(0, days_remaining),
                    "status": subscription["status"],
                    "features": plan_details.get("features", {}),
                    "auto_renewal": subscription.get("auto_renewal", False)
                }
            }
        else:
            # إرجاع الخطة المجانية
            free_plan = SUBSCRIPTION_PLANS["free"]
            return {
                "success": True,
                "subscription": {
                    "plan_type": "free",
                    "plan_name": free_plan["name"],
                    "start_date": None,
                    "end_date": None,
                    "days_remaining": None,
                    "status": "free",
                    "features": free_plan["features"],
                    "auto_renewal": False
                }
            }
            
    except Exception as e:
        logger.error(f"Error getting user subscription: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على الاشتراك")

@router.post("/subscribe")
async def create_subscription(
    plan_type: str,
    payment_method: str = "paytabs",
    current_user: User = Depends(get_current_active_user)
):
    """إنشاء اشتراك جديد"""
    try:
        # التحقق من صحة الخطة
        if plan_type not in SUBSCRIPTION_PLANS:
            raise HTTPException(status_code=400, detail="خطة اشتراك غير صحيحة")
        
        # التحقق من أن المستخدم ليس لديه اشتراك نشط
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        active_subscription = await collection.find_one({
            "user_id": current_user.id,
            "status": "active"
        })
        
        if active_subscription:
            raise HTTPException(
                status_code=400, 
                detail="لديك اشتراك نشط بالفعل"
            )
        
        # الحصول على تفاصيل الخطة
        plan_details = SUBSCRIPTION_PLANS[plan_type]
        
        # إنشاء معرف فريد للاشتراك
        subscription_id = str(uuid.uuid4())
        
        # حساب تواريخ البداية والنهاية
        start_date = datetime.now()
        end_date = start_date + timedelta(days=plan_details["duration_days"])
        
        # إنشاء معلومات الاشتراك
        subscription_data = {
            "subscription_id": subscription_id,
            "user_id": current_user.id,
            "plan_type": plan_type,
            "price": plan_details["price"],
            "currency": plan_details["currency"],
            "start_date": start_date,
            "end_date": end_date,
            "status": "pending",  # في انتظار الدفع
            "payment_method": payment_method,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # حفظ الاشتراك في قاعدة البيانات
        result = await collection.insert_one(subscription_data)
        
        if result.inserted_id:
            # إنشاء رابط الدفع (محاكاة)
            if payment_method == "paytabs":
                payment_url = await _create_paytabs_payment(
                    subscription_id=subscription_id,
                    amount=plan_details["price"],
                    currency=plan_details["currency"],
                    user_email=current_user.email,
                    user_name=current_user.username
                )
            else:
                payment_url = f"/payment/{subscription_id}"
            
            return {
                "success": True,
                "message": "تم إنشاء الاشتراك بنجاح",
                "subscription_id": subscription_id,
                "payment_url": payment_url,
                "amount": plan_details["price"],
                "currency": plan_details["currency"]
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في إنشاء الاشتراك")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating subscription: {e}")
        raise HTTPException(status_code=500, detail="خطأ في إنشاء الاشتراك")

@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user)
):
    """إلغاء الاشتراك الحالي"""
    try:
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        # البحث عن الاشتراك النشط
        subscription = await collection.find_one({
            "user_id": current_user.id,
            "status": "active"
        })
        
        if not subscription:
            raise HTTPException(status_code=404, detail="لا يوجد اشتراك نشط للإلغاء")
        
        # إلغاء الاشتراك
        result = await collection.update_one(
            {"subscription_id": subscription["subscription_id"]},
            {
                "$set": {
                    "status": "cancelled",
                    "cancelled_at": datetime.now(),
                    "updated_at": datetime.now()
                }
            }
        )
        
        if result.modified_count > 0:
            return {
                "success": True,
                "message": "تم إلغاء الاشتراك بنجاح",
                "subscription_id": subscription["subscription_id"]
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في إلغاء الاشتراك")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling subscription: {e}")
        raise HTTPException(status_code=500, detail="خطأ في إلغاء الاشتراك")

@router.post("/renew")
async def renew_subscription(
    current_user: User = Depends(get_current_active_user)
):
    """تجديد الاشتراك الحالي"""
    try:
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        # البحث عن الاشتراك النشط
        subscription = await collection.find_one({
            "user_id": current_user.id,
            "status": "active"
        })
        
        if not subscription:
            raise HTTPException(status_code=404, detail="لا يوجد اشتراك نشط للتجديد")
        
        # التحقق من أن الاشتراك قريب من الانتهاء (أقل من 7 أيام)
        days_remaining = (subscription["end_date"] - datetime.now()).days
        
        if days_remaining > 7:
            raise HTTPException(
                status_code=400, 
                detail="لا يمكن تجديد الاشتراك إلا عندما يكون قريباً من الانتهاء"
            )
        
        # إنشاء اشتراك جديد
        plan_details = SUBSCRIPTION_PLANS[subscription["plan_type"]]
        
        new_subscription_id = str(uuid.uuid4())
        start_date = subscription["end_date"]
        end_date = start_date + timedelta(days=plan_details["duration_days"])
        
        new_subscription_data = {
            "subscription_id": new_subscription_id,
            "user_id": current_user.id,
            "plan_type": subscription["plan_type"],
            "price": plan_details["price"],
            "currency": plan_details["currency"],
            "start_date": start_date,
            "end_date": end_date,
            "status": "pending",
            "payment_method": subscription["payment_method"],
            "is_renewal": True,
            "original_subscription_id": subscription["subscription_id"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # حفظ الاشتراك الجديد
        result = await collection.insert_one(new_subscription_data)
        
        if result.inserted_id:
            # إنشاء رابط الدفع
            payment_url = await _create_paytabs_payment(
                subscription_id=new_subscription_id,
                amount=plan_details["price"],
                currency=plan_details["currency"],
                user_email=current_user.email,
                user_name=current_user.username
            )
            
            return {
                "success": True,
                "message": "تم إنشاء تجديد الاشتراك بنجاح",
                "subscription_id": new_subscription_id,
                "payment_url": payment_url,
                "amount": plan_details["price"],
                "currency": plan_details["currency"]
            }
        else:
            raise HTTPException(status_code=500, detail="خطأ في تجديد الاشتراك")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error renewing subscription: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تجديد الاشتراك")

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_subscription_history(
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(20, description="عدد النتائج"),
    offset: int = Query(0, description="الإزاحة")
):
    """الحصول على تاريخ الاشتراكات"""
    try:
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        cursor = collection.find(
            {"user_id": current_user.id}
        ).sort("created_at", -1).skip(offset).limit(limit)
        
        subscriptions = await cursor.to_list(length=limit)
        
        # إضافة تفاصيل الخطط
        for sub in subscriptions:
            plan_details = SUBSCRIPTION_PLANS.get(sub["plan_type"], {})
            sub["plan_name"] = plan_details.get("name", "غير محدد")
            sub["_id"] = str(sub["_id"])
        
        return subscriptions
        
    except Exception as e:
        logger.error(f"Error getting subscription history: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على تاريخ الاشتراكات")

@router.post("/webhook/paytabs")
async def paytabs_webhook(
    request_data: Dict[str, Any]
):
    """webhook لاستقبال تحديثات الدفع من PayTabs"""
    try:
        # التحقق من صحة التوقيع (في الواقع سيتم التحقق من التوقيع)
        # signature = request_data.get("signature")
        # if not _verify_paytabs_signature(request_data, signature):
        #     raise HTTPException(status_code=400, detail="توقيع غير صحيح")
        
        # استخراج البيانات المهمة
        subscription_id = request_data.get("subscription_id")
        payment_status = request_data.get("payment_status")
        transaction_id = request_data.get("transaction_id")
        amount = request_data.get("amount")
        
        if not subscription_id:
            raise HTTPException(status_code=400, detail="معرف الاشتراك مطلوب")
        
        # تحديث حالة الاشتراك
        db = await get_mongodb_client()
        collection = db.subscriptions
        
        if payment_status == "success":
            # تحديث الاشتراك إلى نشط
            result = await collection.update_one(
                {"subscription_id": subscription_id},
                {
                    "$set": {
                        "status": "active",
                        "payment_status": "completed",
                        "transaction_id": transaction_id,
                        "paid_at": datetime.now(),
                        "updated_at": datetime.now()
                    }
                }
            )
            
            if result.modified_count > 0:
                logger.info(f"Subscription {subscription_id} activated successfully")
                
                # إرسال إشعار للمستخدم
                await _send_subscription_notification(subscription_id, "activated")
                
                return {"success": True, "message": "تم تفعيل الاشتراك بنجاح"}
            else:
                logger.error(f"Failed to activate subscription {subscription_id}")
                raise HTTPException(status_code=500, detail="خطأ في تفعيل الاشتراك")
        
        elif payment_status == "failed":
            # تحديث حالة الدفع
            await collection.update_one(
                {"subscription_id": subscription_id},
                {
                    "$set": {
                        "status": "payment_failed",
                        "payment_status": "failed",
                        "updated_at": datetime.now()
                    }
                }
            )
            
            logger.info(f"Subscription {subscription_id} payment failed")
            return {"success": True, "message": "تم تحديث حالة الدفع"}
        
        else:
            logger.warning(f"Unknown payment status: {payment_status}")
            return {"success": True, "message": "تم استلام التحديث"}
            
    except Exception as e:
        logger.error(f"Error processing PayTabs webhook: {e}")
        raise HTTPException(status_code=500, detail="خطأ في معالجة webhook")

@router.get("/usage", response_model=Dict[str, Any])
async def get_usage_statistics(
    current_user: User = Depends(get_current_active_user)
):
    """الحصول على إحصائيات الاستخدام"""
    try:
        db = await get_mongodb_client()
        
        # الحصول على الاشتراك الحالي
        subscription_collection = db.subscriptions
        subscription = await subscription_collection.find_one({
            "user_id": current_user.id,
            "status": "active"
        })
        
        if not subscription:
            # استخدام الخطة المجانية
            plan_type = "free"
        else:
            plan_type = subscription["plan_type"]
        
        plan_details = SUBSCRIPTION_PLANS[plan_type]
        max_analyses = plan_details["features"]["max_analyses"]
        max_documents = plan_details["features"]["max_documents"]
        
        # إحصائيات الاستخدام الشهري
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        analyses_collection = db.analyses
        documents_collection = db.documents
        
        analyses_used = await analyses_collection.count_documents({
            "user_id": current_user.id,
            "timestamp": {"$gte": current_month}
        })
        
        documents_used = await documents_collection.count_documents({
            "user_id": current_user.id,
            "uploaded_at": {"$gte": current_month}
        })
        
        return {
            "success": True,
            "plan_type": plan_type,
            "plan_name": plan_details["name"],
            "usage": {
                "analyses": {
                    "used": analyses_used,
                    "limit": max_analyses,
                    "remaining": max(0, max_analyses - analyses_used),
                    "percentage": min(100, (analyses_used / max_analyses) * 100) if max_analyses > 0 else 0
                },
                "documents": {
                    "used": documents_used,
                    "limit": max_documents,
                    "remaining": max(0, max_documents - documents_used),
                    "percentage": min(100, (documents_used / max_documents) * 100) if max_documents > 0 else 0
                }
            },
            "features": plan_details["features"],
            "current_month": current_month.strftime("%Y-%m")
        }
        
    except Exception as e:
        logger.error(f"Error getting usage statistics: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على إحصائيات الاستخدام")

# الدوال المساعدة
async def _create_paytabs_payment(
    subscription_id: str,
    amount: float,
    currency: str,
    user_email: str,
    user_name: str
) -> str:
    """إنشاء رابط دفع PayTabs (محاكاة)"""
    try:
        # في الواقع سيتم إنشاء رابط دفع حقيقي مع PayTabs
        # هنا نستخدم رابط محاكاة
        
        payment_data = {
            "profile_id": settings.PAYTABS_PROFILE_ID,
            "tran_type": "sale",
            "tran_class": "ecom",
            "cart_id": subscription_id,
            "cart_amount": amount,
            "cart_currency": currency,
            "cart_description": f"اشتراك FinClick.AI - {subscription_id}",
            "paypage_lang": "ar",
            "customer_details": {
                "name": user_name,
                "email": user_email,
                "street1": "Riyadh",
                "city": "Riyadh",
                "state": "Riyadh",
                "country": "SA",
                "zip": "00000",
                "phone": "966500000000",
                "ip": "127.0.0.1"
            },
            "return": {
                "url": f"{settings.FRONTEND_URL}/payment/success/{subscription_id}"
            },
            "callback": {
                "url": f"{settings.BACKEND_URL}/api/v1/subscriptions/webhook/paytabs"
            }
        }
        
        # في الواقع سيتم إرسال البيانات إلى PayTabs API
        # وإرجاع رابط الدفع
        
        payment_url = f"https://paytabs.com/payment/{subscription_id}"
        
        logger.info(f"Created PayTabs payment for subscription {subscription_id}")
        return payment_url
        
    except Exception as e:
        logger.error(f"Error creating PayTabs payment: {e}")
        raise HTTPException(status_code=500, detail="خطأ في إنشاء رابط الدفع")

async def _send_subscription_notification(
    subscription_id: str,
    notification_type: str
):
    """إرسال إشعار للمستخدم (محاكاة)"""
    try:
        db = await get_mongodb_client()
        collection = db.notifications
        
        # الحصول على معرف المستخدم
        subscription_collection = db.subscriptions
        subscription = await subscription_collection.find_one({
            "subscription_id": subscription_id
        })
        
        if subscription:
            user_id = subscription["user_id"]
            
            # إنشاء الإشعار
            notification_data = {
                "notification_id": str(uuid.uuid4()),
                "user_id": user_id,
                "type": "subscription",
                "title": "تحديث الاشتراك",
                "message": f"تم {notification_type} اشتراكك بنجاح",
                "data": {"subscription_id": subscription_id},
                "read": False,
                "created_at": datetime.now()
            }
            
            await collection.insert_one(notification_data)
            logger.info(f"Sent subscription notification to user {user_id}")
            
    except Exception as e:
        logger.error(f"Error sending subscription notification: {e}")

def _verify_paytabs_signature(data: Dict[str, Any], signature: str) -> bool:
    """التحقق من صحة توقيع PayTabs (محاكاة)"""
    # في الواقع سيتم التحقق من التوقيع باستخدام المفتاح السري
    try:
        # محاكاة التحقق من التوقيع
        return True
    except Exception as e:
        logger.error(f"Error verifying PayTabs signature: {e}")
        return False
