# 🚀 دليل النشر - FinClick.AI

## نظرة عامة
دليل شامل لنشر نظام FinClick.AI على مختلف المنصات السحابية والبيئات.

## 🎯 خيارات النشر

### **1. Vercel (موصى به للواجهة الأمامية)**
- **مميزات**: سريع، سهل، دعم React
- **التكلفة**: مجاني للمشاريع الصغيرة
- **الأداء**: ممتاز مع CDN عالمي

### **2. Railway (موصى به للنظام الخلفي)**
- **مميزات**: دعم Python، قاعدة بيانات، سهل النشر
- **التكلفة**: $5/شهر
- **الأداء**: جيد للمشاريع المتوسطة

### **3. DigitalOcean App Platform**
- **مميزات**: مرونة عالية، دعم كامل
- **التكلفة**: $12/شهر
- **الأداء**: ممتاز

### **4. AWS (للإنتاج الكبير)**
- **مميزات**: خدمات شاملة، قابلية التوسع
- **التكلفة**: حسب الاستخدام
- **الأداء**: ممتاز

## 🚀 النشر على Vercel

### **الخطوة 1: إعداد Vercel**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# إنشاء مشروع جديد
vercel
```

### **الخطوة 2: إعداد المشروع**
```bash
# نسخ ملف التكوين
cp config.env .env.local

# تعديل المتغيرات البيئية
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_LANGUAGE=ar
```

### **الخطوة 3: النشر**
```bash
# بناء المشروع
npm run build

# النشر
vercel --prod

# أو النشر التلقائي
vercel --prod --yes
```

### **الخطوة 4: إعداد النطاق المخصص**
```bash
# إضافة نطاق مخصص
vercel domains add finclick.ai

# إعداد DNS
# إضافة CNAME record: cname.vercel-dns.com
```

## ⚙️ النشر على Railway

### **الخطوة 1: إعداد Railway**
```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init
```

### **الخطوة 2: إعداد المتغيرات البيئية**
```bash
# إضافة المتغيرات
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_ANON_KEY=your_supabase_key
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set OPENAI_API_KEY=your_openai_key
railway variables set JWT_SECRET=your_jwt_secret
```

### **الخطوة 3: النشر**
```bash
# رفع الكود
railway up

# تشغيل الخدمة
railway service up
```

## 🐳 النشر باستخدام Docker

### **الخطوة 1: إعداد Docker**
```bash
# بناء الصور
docker-compose build

# تشغيل الخدمات
docker-compose up -d

# فحص الحالة
docker-compose ps
```

### **الخطوة 2: إعداد Nginx**
```nginx
# /etc/nginx/sites-available/finclick
server {
    listen 80;
    server_name finclick.ai www.finclick.ai;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **الخطوة 3: تفعيل الموقع**
```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/finclick /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

## ☁️ النشر على AWS

### **الخطوة 1: إعداد EC2**
```bash
# الاتصال بالخادم
ssh -i your-key.pem ubuntu@your-server-ip

# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### **الخطوة 2: إعداد Docker Compose**
```bash
# نسخ المشروع
git clone https://github.com/RazanLeo/FinClick.AI-System-By-Cursor.git
cd FinClick.AI-System-By-Cursor

# تشغيل الخدمات
docker-compose up -d

# فحص السجلات
docker-compose logs -f
```

### **الخطوة 3: إعداد Load Balancer**
```bash
# إنشاء Application Load Balancer
aws elbv2 create-load-balancer \
    --name finclick-alb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678

# إضافة Target Groups
aws elbv2 create-target-group \
    --name finclick-frontend \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-12345678
```

## 🔐 إعداد SSL/HTTPS

### **الخطوة 1: تثبيت Certbot**
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### **الخطوة 2: الحصول على شهادة SSL**
```bash
# الحصول على شهادة
sudo certbot --nginx -d finclick.ai -d www.finclick.ai

# تجديد تلقائي
sudo crontab -e
# إضافة: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🗄️ إعداد قواعد البيانات

### **Supabase (PostgreSQL)**
```sql
-- إنشاء الجداول
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    language VARCHAR(10) DEFAULT 'ar',
    subscription_plan VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- إنشاء Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_plan);
```

### **MongoDB**
```javascript
// إنشاء Collections
db.createCollection("analyses", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "analysis_type", "data"],
            properties: {
                user_id: { bsonType: "string" },
                analysis_type: { bsonType: "string" },
                data: { bsonType: "object" },
                created_at: { bsonType: "date" }
            }
        }
    }
});

// إنشاء Indexes
db.analyses.createIndex({ "user_id": 1 });
db.analyses.createIndex({ "analysis_type": 1 });
db.analyses.createIndex({ "created_at": -1 });
```

## 📊 مراقبة الأداء

### **Health Checks**
```python
@app.get("/health")
async def health_check():
    """فحص صحة النظام"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {
            "database": await check_database_health(),
            "redis": await check_redis_health(),
            "ai_engine": await check_ai_engine_health()
        }
    }
    
    # إذا كان هناك مشكلة، إرجاع 503
    if not all(health_status["services"].values()):
        health_status["status"] = "unhealthy"
        raise HTTPException(status_code=503, detail=health_status)
    
    return health_status
```

### **Logging**
```python
import logging
from logging.handlers import RotatingFileHandler

# إعداد Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/finclick.log', maxBytes=10485760, backupCount=5),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# استخدام في الكود
logger.info("User logged in successfully", extra={"user_id": user_id, "ip": client_ip})
logger.error("Database connection failed", exc_info=True)
```

## 🔒 الأمان

### **Rate Limiting**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")
async def login(request: Request):
    # الكود هنا
    pass
```

### **CORS Configuration**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://finclick.ai",
        "https://www.finclick.ai",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### **Security Headers**
```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["finclick.ai", "www.finclick.ai", "localhost"]
)
```

## 📈 التوسع (Scaling)

### **Horizontal Scaling**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    environment:
      - NODE_ENV=production
```

### **Load Balancer Configuration**
```nginx
upstream backend {
    least_conn;
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    server_name finclick.ai;
    
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 الاختبار

### **Load Testing**
```bash
# تثبيت Apache Bench
sudo apt install apache2-utils

# اختبار الحمل
ab -n 1000 -c 10 https://finclick.ai/api/health

# اختبار الأداء
ab -n 1000 -c 50 -k https://finclick.ai/api/health
```

### **Stress Testing**
```python
import asyncio
import aiohttp
import time

async def stress_test(url: str, num_requests: int, concurrency: int):
    """اختبار الإجهاد"""
    async def make_request(session, url):
        async with session.get(url) as response:
            return await response.text()
    
    async with aiohttp.ClientSession() as session:
        tasks = [make_request(session, url) for _ in range(num_requests)]
        start_time = time.time()
        results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = time.time()
        
        print(f"Completed {num_requests} requests in {end_time - start_time:.2f} seconds")
        print(f"Average response time: {(end_time - start_time) / num_requests:.3f} seconds")

# تشغيل الاختبار
asyncio.run(stress_test("https://finclick.ai/api/health", 1000, 100))
```

## 📊 المراقبة

### **Prometheus + Grafana**
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

### **Application Metrics**
```python
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import FastAPI

# تعريف المقاييس
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    # تسجيل الطلب
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    
    # تسجيل زمن الاستجابة
    REQUEST_LATENCY.observe(time.time() - start_time)
    
    return response

@app.get("/metrics")
async def metrics():
    """عرض مقاييس Prometheus"""
    return Response(generate_latest(), media_type="text/plain")
```

## 🚨 التنبيهات

### **Email Alerts**
```python
import smtplib
from email.mime.text import MIMEText

def send_alert(subject: str, message: str, recipients: list):
    """إرسال تنبيه بالبريد الإلكتروني"""
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = 'alerts@finclick.ai'
    msg['To'] = ', '.join(recipients)
    
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('alerts@finclick.ai', 'your-app-password')
            server.send_message(msg)
    except Exception as e:
        logger.error(f"Failed to send alert: {e}")

# استخدام في النظام
if not database_healthy:
    send_alert(
        "Database Health Check Failed",
        "The database connection is not responding",
        ["admin@finclick.ai", "tech@finclick.ai"]
    )
```

### **Slack Notifications**
```python
import requests

def send_slack_notification(channel: str, message: str):
    """إرسال إشعار إلى Slack"""
    webhook_url = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    
    payload = {
        "channel": channel,
        "text": message,
        "username": "FinClick.AI Bot",
        "icon_emoji": ":robot_face:"
    }
    
    try:
        response = requests.post(webhook_url, json=payload)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to send Slack notification: {e}")

# استخدام في النظام
if system_overloaded:
    send_slack_notification(
        "#alerts",
        "🚨 System is experiencing high load! CPU: 95%, Memory: 87%"
    )
```

## 🔄 النسخ الاحتياطي

### **Database Backup**
```bash
#!/bin/bash
# backup.sh

# نسخ احتياطي لـ Supabase
pg_dump $SUPABASE_URL > "backups/supabase_$(date +%Y%m%d_%H%M%S).sql"

# نسخ احتياطي لـ MongoDB
mongodump --uri="$MONGODB_URI" --out="backups/mongodb_$(date +%Y%m%d_%H%M%S)"

# ضغط النسخ الاحتياطية
tar -czf "backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz" backups/

# رفع إلى S3
aws s3 cp "backups/backup_$(date +%Y%m%d_%H%M%S).tar.gz" s3://finclick-backups/

# تنظيف النسخ القديمة
find backups/ -name "*.tar.gz" -mtime +7 -delete
```

### **Automated Backup**
```bash
# إضافة إلى crontab
crontab -e

# نسخ احتياطي يومي في 2 صباحاً
0 2 * * * /path/to/backup.sh

# نسخ احتياطي أسبوعي في الأحد 3 صباحاً
0 3 * * 0 /path/to/weekly_backup.sh
```

## 📋 قائمة التحقق قبل النشر

### **✅ الأمان**
- [ ] تحديث جميع التبعيات
- [ ] إعداد HTTPS/SSL
- [ ] تكوين CORS
- [ ] إعداد Rate Limiting
- [ ] اختبار الأمان

### **✅ الأداء**
- [ ] تحسين الصور
- [ ] ضغط CSS/JS
- [ ] إعداد CDN
- [ ] اختبار الحمل
- [ ] مراقبة الأداء

### **✅ المراقبة**
- [ ] إعداد Logging
- [ ] تكوين Health Checks
- [ ] إعداد التنبيهات
- [ ] مراقبة قاعدة البيانات
- [ ] تتبع الأخطاء

### **✅ النسخ الاحتياطي**
- [ ] إعداد النسخ الاحتياطي التلقائي
- [ ] اختبار استعادة البيانات
- [ ] رفع النسخ الاحتياطية
- [ ] توثيق إجراءات الاستعادة

## 🆘 استكشاف الأخطاء

### **Common Issues**

#### **مشكلة: النظام لا يستجيب**
```bash
# فحص الخدمات
docker-compose ps

# فحص السجلات
docker-compose logs -f backend

# فحص الموارد
docker stats

# إعادة تشغيل الخدمة
docker-compose restart backend
```

#### **مشكلة: قاعدة البيانات لا تستجيب**
```bash
# فحص اتصال MongoDB
docker exec -it mongodb mongosh --eval "db.runCommand('ping')"

# فحص اتصال Supabase
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key"
```

#### **مشكلة: الذاكرة منخفضة**
```bash
# فحص استخدام الذاكرة
free -h

# تنظيف الذاكرة
sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

# إعادة تشغيل الخدمات
docker-compose restart
```

## 📞 الدعم

### **معلومات الاتصال**
- **البريد الإلكتروني**: support@finclick.ai
- **الدردشة**: Discord Server
- **المسائل**: GitHub Issues
- **الهاتف**: +966-XX-XXX-XXXX

### **مستويات الدعم**
- **مستوى 1**: دعم أساسي (24 ساعة)
- **مستوى 2**: دعم فني (8 ساعات)
- **مستوى 3**: دعم متخصص (4 ساعات)

---

## 🎉 تهانينا! لقد نشرت نظام FinClick.AI بنجاح!

**النظام جاهز للاستخدام والبيع** 🚀

إذا واجهت أي مشاكل، لا تتردد في التواصل مع فريق الدعم.
