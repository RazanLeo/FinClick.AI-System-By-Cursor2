"""
FinClick.AI - Revolutionary Intelligent Financial Analysis System
Main FastAPI Application
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("../config.env")

# Import routers
from app.routers import auth, users, analysis, documents, payments, subscriptions
from app.core.config import settings
from app.core.database import init_db
from app.core.security import create_access_token

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting FinClick.AI Backend...")
    await init_db()
    print("✅ Database initialized successfully")
    
    # Shutdown
    print("🔄 Shutting down FinClick.AI Backend...")
    yield

# Create FastAPI app
app = FastAPI(
    title="FinClick.AI - Revolutionary Intelligent Financial Analysis System",
    description="""
    ## FinClick.AI - نظام تحليل مالي ذكي ثوري
    
    ### المميزات الرئيسية:
    - **170+ نوع تحليل مالي شامل**
    - **ذكاء اصطناعي متقدم** (GPT-4, Gemini, FinBERT)
    - **معالجة ذكية للمستندات** (PDF, Excel, Word, صور)
    - **تقارير مهنية** (Word, PDF, PowerPoint)
    - **واجهة ثنائية اللغة** (العربية والإنجليزية)
    - **نظام اشتراكات متكامل** مع PayTabs
    
    ### التقنيات المستخدمة:
    - **Backend**: FastAPI, Python, Supabase, MongoDB
    - **Frontend**: React, TypeScript, Tailwind CSS
    - **AI/ML**: OpenAI, Google Gemini, Transformers, LangChain
    - **Financial Data**: FMP, Alpha Vantage, Yahoo Finance
    """,
    version="1.0.0",
    contact={
        "name": "FinClick.AI Team",
        "email": "support@finclick.ai",
        "url": "https://finclick.ai"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    },
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Financial Analysis"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Document Processing"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🚀 FinClick.AI Backend is running!",
        "version": "1.0.0",
        "status": "active",
        "features": [
            "170+ Financial Analysis Types",
            "Advanced AI/ML Engine",
            "Intelligent Document Processing",
            "Professional Reporting",
            "Bilingual Interface",
            "Subscription Management"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-15T12:00:00Z",
        "services": {
            "database": "connected",
            "ai_engine": "active",
            "payment_gateway": "ready"
        }
    }

@app.get("/api/v1/features")
async def get_features():
    """Get all available features"""
    return {
        "financial_analysis": {
            "total_types": 170,
            "categories": [
                "Fundamental Analysis",
                "Technical Analysis",
                "Risk Analysis",
                "Valuation Models",
                "Portfolio Analysis",
                "Market Analysis",
                "Industry Analysis",
                "Economic Analysis"
            ]
        },
        "ai_capabilities": [
            "GPT-4 Integration",
            "Gemini AI",
            "FinBERT Models",
            "Custom Financial Models",
            "Natural Language Processing",
            "Predictive Analytics"
        ],
        "document_processing": [
            "PDF Analysis",
            "Excel Data Extraction",
            "Word Document Processing",
            "Image OCR",
            "Data Cleaning",
            "Format Conversion"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
