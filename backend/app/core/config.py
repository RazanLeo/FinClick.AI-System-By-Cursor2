"""
Configuration settings for FinClick.AI
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FinClick.AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://finclick.ai",
        "https://www.finclick.ai"
    ]
    
    ALLOWED_HOSTS: List[str] = [
        "localhost",
        "127.0.0.1",
        "finclick.ai",
        "www.finclick.ai"
    ]
    
    # Database
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    
    # AI Services
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Financial Data APIs
    FMP_API_KEY: str = os.getenv("FMP_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    YAHOO_FINANCE_API_KEY: str = os.getenv("YAHOO_FINANCE_API_KEY", "")
    
    # Payment Gateway (PayTabs)
    PAYTABS_PROFILE_ID: str = os.getenv("PAYTABS_PROFILE_ID", "")
    PAYTABS_SERVER_KEY: str = os.getenv("PAYTABS_SERVER_KEY", "")
    PAYTABS_CLIENT_KEY: str = os.getenv("PAYTABS_CLIENT_KEY", "")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/csv"
    ]
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Celery
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # External Services
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    # Subscription Plans
    SUBSCRIPTION_PLANS = {
        "free": {
            "name": "Free",
            "price": 0,
            "currency": "SAR",
            "features": [
                "5 تحليلات أساسية شهرياً",
                "معالجة 3 مستندات شهرياً",
                "تقارير أساسية",
                "دعم البريد الإلكتروني"
            ],
            "limits": {
                "analyses_per_month": 5,
                "documents_per_month": 3,
                "storage_gb": 0.5
            }
        },
        "basic": {
            "name": "Basic",
            "price": 99,
            "currency": "SAR",
            "features": [
                "50 تحليل شامل شهرياً",
                "معالجة 20 مستند شهرياً",
                "تقارير متقدمة",
                "دعم فني",
                "تصدير PDF/Word"
            ],
            "limits": {
                "analyses_per_month": 50,
                "documents_per_month": 20,
                "storage_gb": 5
            }
        },
        "professional": {
            "name": "Professional",
            "price": 299,
            "currency": "SAR",
            "features": [
                "تحليلات غير محدودة",
                "معالجة مستندات غير محدودة",
                "تقارير مهنية",
                "دعم فني 24/7",
                "تصدير PowerPoint",
                "مقارنات عالمية"
            ],
            "limits": {
                "analyses_per_month": -1,  # Unlimited
                "documents_per_month": -1,  # Unlimited
                "storage_gb": 50
            }
        },
        "enterprise": {
            "name": "Enterprise",
            "price": 999,
            "currency": "SAR",
            "features": [
                "جميع المميزات",
                "API مخصص",
                "دعم مخصص",
                "تدريب الفريق",
                "تكامل مع الأنظمة",
                "تقارير مخصصة"
            ],
            "limits": {
                "analyses_per_month": -1,
                "documents_per_month": -1,
                "storage_gb": 500
            }
        }
    }
    
    # Analysis Types Configuration
    ANALYSIS_CATEGORIES = {
        "fundamental": {
            "name": "التحليل الأساسي",
            "description": "تحليل البيانات المالية الأساسية للشركة",
            "types": [
                "تحليل الميزانية العمومية",
                "تحليل قائمة الدخل",
                "تحليل التدفقات النقدية",
                "تحليل النسب المالية",
                "تحليل الربحية",
                "تحليل السيولة",
                "تحليل الكفاءة",
                "تحليل النمو"
            ]
        },
        "technical": {
            "name": "التحليل الفني",
            "description": "تحليل حركة الأسعار والرسوم البيانية",
            "types": [
                "المتوسطات المتحركة",
                "مؤشرات القوة النسبية",
                "مؤشرات التذبذب",
                "أنماط الأسعار",
                "مستويات الدعم والمقاومة",
                "تحليل الحجم",
                "تحليل الزخم"
            ]
        },
        "risk": {
            "name": "تحليل المخاطر",
            "description": "تقييم المخاطر المالية والاستثمارية",
            "types": [
                "تحليل مخاطر السوق",
                "تحليل مخاطر الائتمان",
                "تحليل مخاطر التشغيل",
                "تحليل مخاطر السيولة",
                "تحليل مخاطر العملة",
                "تحليل مخاطر الفائدة"
            ]
        },
        "valuation": {
            "name": "نماذج التقييم",
            "description": "تقييم القيمة العادلة للأصول والشركات",
            "types": [
                "نموذج خصم التدفقات النقدية",
                "نموذج خصم الأرباح",
                "نموذج القيمة الدفترية",
                "نموذج مضاعف الأرباح",
                "نموذج القيمة المضافة",
                "نموذج التقييم النسبي"
            ]
        }
    }
    
    class Config:
        env_file = "../config.env"
        case_sensitive = True

# Create settings instance
settings = Settings()
