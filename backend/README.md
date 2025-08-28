# ⚙️ FinClick.AI Backend

## نظرة عامة
النظام الخلفي لنظام FinClick.AI - نظام تحليل مالي ذكي ثوري مبني بـ FastAPI و Python.

## 🚀 المميزات

### **API متقدم**
- **FastAPI** - إطار عمل سريع وحديث
- **OpenAPI/Swagger** - توثيق تلقائي للـ API
- **Async/Await** - أداء عالي
- **Type Hints** - أمان النوع
- **Validation** - التحقق من المدخلات

### **قواعد البيانات**
- **Supabase** - قاعدة بيانات PostgreSQL
- **MongoDB** - قاعدة بيانات NoSQL
- **Redis** - تخزين مؤقت
- **Connection Pooling** - إدارة الاتصالات

### **الأمان**
- **JWT Authentication** - مصادقة آمنة
- **Password Hashing** - تشفير كلمات المرور
- **Rate Limiting** - حماية من الهجمات
- **CORS** - حماية متقدمة
- **Input Validation** - التحقق من المدخلات

### **معالجة الملفات**
- **File Upload** - رفع الملفات
- **Document Processing** - معالجة المستندات
- **Image OCR** - استخراج النصوص من الصور
- **Format Conversion** - تحويل الصيغ

## 🛠️ التقنيات المستخدمة

- **Python 3.11+** - لغة البرمجة الرئيسية
- **FastAPI** - إطار عمل الويب
- **Uvicorn** - خادم ASGI
- **Pydantic** - التحقق من البيانات
- **SQLAlchemy** - ORM
- **Motor** - MongoDB async driver
- **Redis** - التخزين المؤقت
- **Celery** - معالجة المهام الخلفية

## 📦 التثبيت والتشغيل

### **المتطلبات**
- Python 3.11+
- pip
- Redis
- MongoDB

### **التثبيت**
```bash
# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة
source venv/bin/activate  # Linux/Mac
# أو
venv\Scripts\activate     # Windows

# تثبيت التبعيات
pip install -r requirements.txt

# تشغيل التطبيق
python main.py
```

### **البيئة**
```bash
# نسخ ملف البيئة
cp ../config.env .

# تعديل المتغيرات
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
```

## 🏗️ هيكل المشروع

```
backend/
├── app/                    # التطبيق الرئيسي
│   ├── core/             # المكونات الأساسية
│   ├── models/           # نماذج البيانات
│   ├── schemas/          # مخططات البيانات
│   ├── routers/          # مسارات API
│   ├── services/         # الخدمات
│   ├── middleware/       # الوسائط
│   └── utils/            # الأدوات المساعدة
├── main.py               # نقطة البداية
├── requirements.txt      # تبعيات Python
└── Dockerfile           # ملف Docker
```

## 🎯 المسارات الرئيسية

### **المصادقة**
```python
# تسجيل الدخول
POST /api/v1/auth/login

# التسجيل
POST /api/v1/auth/register

# تحديث الملف الشخصي
PUT /api/v1/auth/profile

# تسجيل الخروج
POST /api/v1/auth/logout
```

### **المستخدمين**
```python
# الحصول على معلومات المستخدم
GET /api/v1/users/me

# تحديث المستخدم
PUT /api/v1/users/me

# حذف المستخدم
DELETE /api/v1/users/me
```

### **التحليل المالي**
```python
# إنشاء تحليل جديد
POST /api/v1/analysis/

# الحصول على التحليلات
GET /api/v1/analysis/

# الحصول على تحليل محدد
GET /api/v1/analysis/{analysis_id}

# تحديث التحليل
PUT /api/v1/analysis/{analysis_id}

# حذف التحليل
DELETE /api/v1/analysis/{analysis_id}
```

### **المستندات**
```python
# رفع مستند
POST /api/v1/documents/upload

# معالجة المستند
POST /api/v1/documents/process

# الحصول على المستندات
GET /api/v1/documents/

# تحميل المستند
GET /api/v1/documents/{document_id}/download
```

### **المدفوعات**
```python
# إنشاء عملية دفع
POST /api/v1/payments/create

# تأكيد الدفع
POST /api/v1/payments/confirm

# الحصول على سجل المدفوعات
GET /api/v1/payments/history
```

### **الاشتراكات**
```python
# إنشاء اشتراك
POST /api/v1/subscriptions/create

# تحديث الاشتراك
PUT /api/v1/subscriptions/{subscription_id}

# إلغاء الاشتراك
DELETE /api/v1/subscriptions/{subscription_id}

# الحصول على خطط الاشتراك
GET /api/v1/subscriptions/plans
```

## 🔒 الأمان

### **JWT Authentication**
```python
from app.core.security import get_current_user

@router.get("/protected")
async def protected_route(current_user = Depends(get_current_user)):
    return {"message": "This is a protected route", "user": current_user}
```

### **Rate Limiting**
```python
from app.core.security import check_rate_limit

@router.post("/api/endpoint")
async def rate_limited_endpoint(
    current_user = Depends(get_current_user)
):
    if not check_rate_limit(current_user["sub"], "endpoint", 100):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    # الكود هنا
```

### **Input Validation**
```python
from pydantic import BaseModel, validator

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

## 🗄️ قواعد البيانات

### **Supabase (PostgreSQL)**
```python
from app.core.database import get_supabase

supabase = get_supabase()

# إدراج بيانات
result = supabase.table('users').insert({
    'username': 'john_doe',
    'email': 'john@example.com'
}).execute()

# استعلام
result = supabase.table('users').select('*').eq('email', 'john@example.com').execute()
```

### **MongoDB**
```python
from app.core.database import get_mongodb

db = get_mongodb()

# إدراج مستند
result = await db.users.insert_one({
    'username': 'john_doe',
    'email': 'john@example.com',
    'created_at': datetime.utcnow()
})

# استعلام
user = await db.users.find_one({'email': 'john@example.com'})
```

## 📊 معالجة المهام الخلفية

### **Celery Tasks**
```python
from app.core.celery_app import celery_app

@celery_app.task
def process_financial_document(document_id: str):
    """معالجة المستند المالي"""
    try:
        # معالجة المستند
        result = process_document(document_id)
        
        # تحديث الحالة
        update_document_status(document_id, 'completed', result)
        
        return result
    except Exception as e:
        update_document_status(document_id, 'failed', str(e))
        raise
```

### **Redis Cache**
```python
import redis
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL)

# تخزين في الكاش
redis_client.setex('user:123', 3600, user_data_json)

# استرجاع من الكاش
user_data = redis_client.get('user:123')
```

## 🧪 الاختبارات

### **Pytest**
```bash
# تشغيل جميع الاختبارات
pytest

# تشغيل اختبار محدد
pytest tests/test_auth.py

# تشغيل مع تغطية
pytest --cov=app tests/
```

### **Test Examples**
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

## 🚀 النشر

### **Docker**
```bash
# بناء الصورة
docker build -t finclick-backend .

# تشغيل الحاوية
docker run -p 8000:8000 finclick-backend
```

### **Docker Compose**
```bash
# تشغيل جميع الخدمات
docker-compose up -d

# إيقاف الخدمات
docker-compose down

# عرض السجلات
docker-compose logs -f
```

### **Production**
```bash
# تشغيل مع Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# تشغيل مع Supervisor
supervisord -c supervisord.conf
```

## 📊 المراقبة

### **Health Checks**
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {
            "database": await check_database_health(),
            "redis": await check_redis_health(),
            "ai_engine": await check_ai_engine_health()
        }
    }
```

### **Logging**
```python
import logging

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Process Time: {process_time:.4f}s"
    )
    
    return response
```

## 🔧 التطوير

### **Code Formatting**
```bash
# تنسيق الكود
black .
isort .

# فحص الكود
flake8 .
mypy .
```

### **Pre-commit Hooks**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.11.0
    hooks:
      - id: black
        language_version: python3.11
```

## 📚 التوثيق

### **API Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### **Code Documentation**
```python
def calculate_financial_ratios(balance_sheet: dict, income_statement: dict) -> dict:
    """
    حساب النسب المالية الأساسية
    
    Args:
        balance_sheet: بيانات الميزانية العمومية
        income_statement: بيانات قائمة الدخل
    
    Returns:
        dict: النسب المالية المحسوبة
        
    Raises:
        ValueError: إذا كانت البيانات غير صحيحة
    """
    # الكود هنا
```

## 🤝 المساهمة

### **معايير الكود**
- استخدام Python 3.11+
- اتباع معايير PEP 8
- كتابة اختبارات شاملة
- تحديث التوثيق

### **عملية المساهمة**
1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التعديلات
4. كتابة الاختبارات
5. إنشاء Pull Request

## 📞 الدعم

### **المساعدة**
- **المسائل**: GitHub Issues
- **الوثائق**: README.md
- **الدردشة**: Discord Server
- **البريد**: support@finclick.ai

### **المطورون**
- **المطور الرئيسي**: Razan Leo
- **المصمم**: FinClick.AI Team
- **المدققون**: Community Contributors

---

## ⭐ إذا أعجبك المشروع، لا تنس إعطاءه نجمة!

**FinClick.AI** - نظام التحليل المالي الذكي المتقدم 🚀
