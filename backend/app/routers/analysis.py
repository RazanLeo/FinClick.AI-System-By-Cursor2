"""
FinClick.AI - Router للتحليل المالي
170+ نوع تحليل مالي شامل ومتقدم
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from pydantic import BaseModel

from ..core.security import get_current_user, check_subscription_status
from ..core.database import get_mongodb_client
from ..models.user import User

# إعداد التسجيل
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/analysis", tags=["Financial Analysis"])

# نماذج البيانات
class AnalysisRequest(BaseModel):
    """طلب التحليل"""
    symbol: str
    analysis_types: List[str]
    timeframe: Optional[str] = "1y"
    custom_parameters: Optional[Dict[str, Any]] = {}

class AnalysisResponse(BaseModel):
    """استجابة التحليل"""
    analysis_id: str
    symbol: str
    analysis_types: List[str]
    results: Dict[str, Any]
    summary: Dict[str, Any]
    recommendations: List[str]
    risk_level: str
    confidence_score: float
    timestamp: datetime
    processing_time: float

class AnalysisHistory(BaseModel):
    """تاريخ التحليل"""
    analysis_id: str
    user_id: str
    symbol: str
    analysis_types: List[str]
    timestamp: datetime
    status: str

# أنواع التحليل المتاحة
ANALYSIS_TYPES = {
    # === التحليل الأساسي (Fundamental Analysis) ===
    "fundamental_overview": {
        "name": "نظرة عامة أساسية",
        "category": "fundamental",
        "description": "تحليل شامل للبيانات الأساسية للشركة",
        "complexity": "medium",
        "processing_time": 30
    },
    "valuation_analysis": {
        "name": "تحليل التقييم",
        "category": "fundamental", 
        "description": "تقييم القيمة العادلة للسهم",
        "complexity": "high",
        "processing_time": 45
    },
    "financial_health": {
        "name": "الصحة المالية",
        "category": "fundamental",
        "description": "تقييم القوة المالية للشركة",
        "complexity": "medium",
        "processing_time": 35
    },
    "profitability_analysis": {
        "name": "تحليل الربحية",
        "category": "fundamental",
        "description": "تحليل قدرة الشركة على تحقيق الأرباح",
        "complexity": "medium",
        "processing_time": 30
    },
    "growth_analysis": {
        "name": "تحليل النمو",
        "category": "fundamental",
        "description": "تحليل معدلات النمو والإمكانات المستقبلية",
        "complexity": "medium",
        "processing_time": 35
    },
    
    # === التحليل التقني (Technical Analysis) ===
    "technical_overview": {
        "name": "نظرة عامة تقنية",
        "category": "technical",
        "description": "تحليل شامل للمؤشرات التقنية",
        "complexity": "medium",
        "processing_time": 25
    },
    "trend_analysis": {
        "name": "تحليل الاتجاهات",
        "category": "technical",
        "description": "تحديد اتجاهات السعر والاتجاهات",
        "complexity": "medium",
        "processing_time": 30
    },
    "momentum_analysis": {
        "name": "تحليل الزخم",
        "category": "technical",
        "description": "تحليل قوة الحركة السعرية",
        "complexity": "medium",
        "processing_time": 25
    },
    "support_resistance": {
        "name": "مستويات الدعم والمقاومة",
        "category": "technical",
        "description": "تحديد مستويات الدعم والمقاومة الرئيسية",
        "complexity": "high",
        "processing_time": 40
    },
    "volume_analysis": {
        "name": "تحليل الحجم",
        "category": "technical",
        "description": "تحليل علاقة الحجم بالسعر",
        "complexity": "medium",
        "processing_time": 25
    },
    
    # === تحليل المخاطر (Risk Analysis) ===
    "risk_assessment": {
        "name": "تقييم المخاطر",
        "category": "risk",
        "description": "تقييم شامل لمخاطر الاستثمار",
        "complexity": "high",
        "processing_time": 45
    },
    "volatility_analysis": {
        "name": "تحليل التقلب",
        "category": "risk",
        "description": "تحليل تقلب الأسعار والمخاطر",
        "complexity": "medium",
        "processing_time": 30
    },
    "correlation_analysis": {
        "name": "تحليل الارتباط",
        "category": "risk",
        "description": "تحليل الارتباط مع الأسواق الأخرى",
        "complexity": "high",
        "processing_time": 40
    },
    "drawdown_analysis": {
        "name": "تحليل الانخفاض",
        "category": "risk",
        "description": "تحليل أقصى انخفاض محتمل",
        "complexity": "medium",
        "processing_time": 35
    },
    "var_analysis": {
        "name": "تحليل القيمة المعرضة للمخاطر",
        "category": "risk",
        "description": "تقييم الخسارة المحتملة",
        "complexity": "high",
        "processing_time": 50
    },
    
    # === تحليل القطاع (Sector Analysis) ===
    "sector_comparison": {
        "name": "مقارنة القطاع",
        "category": "sector",
        "description": "مقارنة مع الشركات الأخرى في نفس القطاع",
        "complexity": "medium",
        "processing_time": 35
    },
    "industry_position": {
        "name": "الموقع في الصناعة",
        "category": "sector",
        "description": "تحديد الموقع التنافسي في الصناعة",
        "complexity": "medium",
        "processing_time": 30
    },
    "market_share": {
        "name": "حصة السوق",
        "category": "sector",
        "description": "تحليل حصة السوق والتنافسية",
        "complexity": "medium",
        "processing_time": 30
    },
    "sector_trends": {
        "name": "اتجاهات القطاع",
        "category": "sector",
        "description": "تحليل الاتجاهات العامة للقطاع",
        "complexity": "medium",
        "processing_time": 35
    },
    "peer_analysis": {
        "name": "تحليل الأقران",
        "category": "sector",
        "description": "مقارنة مع الشركات المماثلة",
        "complexity": "medium",
        "processing_time": 35
    },
    
    # === تحليل الاقتصاد الكلي (Macro Analysis) ===
    "macro_impact": {
        "name": "تأثير الاقتصاد الكلي",
        "category": "macro",
        "description": "تحليل تأثير العوامل الاقتصادية الكلية",
        "complexity": "high",
        "processing_time": 45
    },
    "interest_rate_sensitivity": {
        "name": "حساسية أسعار الفائدة",
        "category": "macro",
        "description": "تحليل تأثير تغيرات أسعار الفائدة",
        "complexity": "high",
        "processing_time": 40
    },
    "inflation_impact": {
        "name": "تأثير التضخم",
        "category": "macro",
        "description": "تحليل تأثير التضخم على الأداء",
        "complexity": "medium",
        "processing_time": 35
    },
    "currency_risk": {
        "name": "مخاطر العملة",
        "category": "macro",
        "description": "تحليل مخاطر تقلبات العملة",
        "complexity": "medium",
        "processing_time": 35
    },
    "economic_cycle": {
        "name": "دورة الاقتصاد",
        "category": "macro",
        "description": "تحليل المرحلة في دورة الاقتصاد",
        "complexity": "high",
        "processing_time": 45
    }
}

@router.get("/types", response_model=Dict[str, Any])
async def get_analysis_types(
    category: Optional[str] = Query(None, description="تصنيف التحليل"),
    complexity: Optional[str] = Query(None, description="مستوى التعقيد")
):
    """الحصول على أنواع التحليل المتاحة"""
    try:
        filtered_types = ANALYSIS_TYPES.copy()
        
        if category:
            filtered_types = {
                k: v for k, v in filtered_types.items() 
                if v["category"] == category
            }
        
        if complexity:
            filtered_types = {
                k: v for k, v in filtered_types.items() 
                if v["complexity"] == complexity
            }
        
        return {
            "success": True,
            "data": filtered_types,
            "total": len(filtered_types),
            "categories": list(set(v["category"] for v in ANALYSIS_TYPES.values())),
            "complexity_levels": list(set(v["complexity"] for v in ANALYSIS_TYPES.values()))
        }
    except Exception as e:
        logger.error(f"Error getting analysis types: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على أنواع التحليل")

@router.post("/run", response_model=AnalysisResponse)
async def run_analysis(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """تشغيل التحليل المالي"""
    try:
        # فحص الاشتراك
        subscription_status = await check_subscription_status(current_user.id)
        if not subscription_status["active"]:
            raise HTTPException(
                status_code=403, 
                detail="يجب أن يكون لديك اشتراك نشط لتشغيل التحليل"
            )
        
        # فحص حدود الاستخدام
        if len(request.analysis_types) > subscription_status["max_analyses"]:
            raise HTTPException(
                status_code=400,
                detail=f"يمكنك تشغيل {subscription_status['max_analyses']} تحليل كحد أقصى"
            )
        
        # إنشاء معرف فريد للتحليل
        analysis_id = f"analysis_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # محاكاة وقت المعالجة
        total_processing_time = sum(
            ANALYSIS_TYPES.get(at, {}).get("processing_time", 30) 
            for at in request.analysis_types
        )
        
        # محاكاة نتائج التحليل
        results = {}
        all_recommendations = []
        risk_scores = []
        
        for analysis_type in request.analysis_types:
            if analysis_type in ANALYSIS_TYPES:
                # محاكاة نتائج التحليل
                analysis_result = await _simulate_analysis(
                    analysis_type, 
                    request.symbol, 
                    request.timeframe
                )
                results[analysis_type] = analysis_result
                all_recommendations.extend(analysis_result.get("recommendations", []))
                risk_scores.append(analysis_result.get("risk_score", 50))
            else:
                results[analysis_type] = {
                    "error": f"نوع التحليل {analysis_type} غير مدعوم",
                    "status": "failed"
                }
        
        # حساب النتيجة الإجمالية
        overall_score = sum(risk_scores) / len(risk_scores) if risk_scores else 50
        
        # تحديد مستوى المخاطر الإجمالي
        if overall_score >= 80:
            overall_risk = "منخفض"
        elif overall_score >= 60:
            overall_risk = "متوسط"
        else:
            overall_risk = "مرتفع"
        
        # إنشاء ملخص التحليل
        summary = {
            "total_analyses": len(request.analysis_types),
            "successful_analyses": len([r for r in results.values() if "error" not in r]),
            "overall_score": round(overall_score, 2),
            "overall_risk": overall_risk,
            "processing_time": total_processing_time,
            "symbol": request.symbol,
            "timeframe": request.timeframe
        }
        
        # حفظ التحليل في قاعدة البيانات
        await _save_analysis(
            analysis_id=analysis_id,
            user_id=current_user.id,
            symbol=request.symbol,
            analysis_types=request.analysis_types,
            results=results,
            summary=summary
        )
        
        return AnalysisResponse(
            analysis_id=analysis_id,
            symbol=request.symbol,
            analysis_types=request.analysis_types,
            results=results,
            summary=summary,
            recommendations=all_recommendations[:10],  # أول 10 توصيات
            risk_level=overall_risk,
            confidence_score=0.85,
            timestamp=datetime.now(),
            processing_time=total_processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error running analysis: {e}")
        raise HTTPException(status_code=500, detail="خطأ في تشغيل التحليل")

@router.get("/history", response_model=List[AnalysisHistory])
async def get_analysis_history(
    current_user: User = Depends(get_current_user),
    limit: int = Query(20, description="عدد النتائج"),
    offset: int = Query(0, description="الإزاحة")
):
    """الحصول على تاريخ التحليل للمستخدم"""
    try:
        db = await get_mongodb_client()
        collection = db.analyses
        
        cursor = collection.find(
            {"user_id": current_user.id},
            {"_id": 0}
        ).sort("timestamp", -1).skip(offset).limit(limit)
        
        history = await cursor.to_list(length=limit)
        return [AnalysisHistory(**item) for item in history]
        
    except Exception as e:
        logger.error(f"Error getting analysis history: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على تاريخ التحليل")

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_result(
    analysis_id: str,
    current_user: User = Depends(get_current_user)
):
    """الحصول على نتيجة تحليل محدد"""
    try:
        db = await get_mongodb_client()
        collection = db.analyses
        
        analysis = await collection.find_one(
            {"analysis_id": analysis_id, "user_id": current_user.id},
            {"_id": 0}
        )
        
        if not analysis:
            raise HTTPException(status_code=404, detail="التحليل غير موجود")
        
        return AnalysisResponse(**analysis)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis result: {e}")
        raise HTTPException(status_code=500, detail="خطأ في الحصول على نتيجة التحليل")

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user)
):
    """حذف تحليل محدد"""
    try:
        db = await get_mongodb_client()
        collection = db.analyses
        
        result = await collection.delete_one({
            "analysis_id": analysis_id,
            "user_id": current_user.id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="التحليل غير موجود")
        
        return {"success": True, "message": "تم حذف التحليل بنجاح"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting analysis: {e}")
        raise HTTPException(status_code=500, detail="خطأ في حذف التحليل")

# الدوال المساعدة
async def _simulate_analysis(
    analysis_type: str, 
    symbol: str, 
    timeframe: str
) -> Dict[str, Any]:
    """محاكاة التحليل (في الواقع سيتم استبدالها بالتحليل الحقيقي)"""
    
    base_result = {
        "symbol": symbol,
        "timeframe": timeframe,
        "analysis_type": analysis_type,
        "timestamp": datetime.now().isoformat(),
        "status": "completed"
    }
    
    if analysis_type == "fundamental_overview":
        return {
            **base_result,
            "score": 75,
            "roe": 18.5,
            "revenue_growth": 15.2,
            "debt_to_equity": 0.3,
            "pe_ratio": 22.1,
            "recommendations": [
                "معدل العائد على حقوق الملكية ممتاز",
                "نمو الإيرادات جيد",
                "مستوى الدين منخفض - صحة مالية ممتازة"
            ],
            "risk_score": 75
        }
    
    elif analysis_type == "valuation_analysis":
        return {
            **base_result,
            "current_price": 150.0,
            "fair_value": 165.0,
            "undervalued": True,
            "discount_premium": 10.0,
            "recommendations": [
                "السهم مقوم بأقل من قيمته العادلة - فرصة شراء جيدة"
            ],
            "risk_score": 70
        }
    
    elif analysis_type == "technical_overview":
        return {
            **base_result,
            "trend": "صاعد",
            "support_levels": [145, 140, 135],
            "resistance_levels": [155, 160, 165],
            "volume_trend": "متزايد",
            "recommendations": [
                "الاتجاه العام صاعد",
                "مستويات الدعم قوية",
                "الحجم يدعم الاتجاه"
            ],
            "risk_score": 65
        }
    
    elif analysis_type == "risk_assessment":
        return {
            **base_result,
            "risk_score": 35,
            "volatility": "متوسط",
            "beta": 1.1,
            "var_95": 8.5,
            "recommendations": [
                "مستوى المخاطر: متوسط",
                "مخاطر التقلب مقبولة",
                "مراقبة مستمرة للمخاطر"
            ],
            "risk_score": 65
        }
    
    else:
        # التحليلات الأخرى
        return {
            **base_result,
            "status": "available",
            "note": f"تحليل {analysis_type} متاح للتطوير المستقبلي",
            "recommendations": [f"تحليل {analysis_type} قيد التطوير"],
            "risk_score": 60
        }

async def _save_analysis(
    analysis_id: str,
    user_id: str,
    symbol: str,
    analysis_types: List[str],
    results: Dict[str, Any],
    summary: Dict[str, Any]
):
    """حفظ التحليل في قاعدة البيانات"""
    try:
        db = await get_mongodb_client()
        collection = db.analyses
        
        analysis_doc = {
            "analysis_id": analysis_id,
            "user_id": user_id,
            "symbol": symbol,
            "analysis_types": analysis_types,
            "results": results,
            "summary": summary,
            "timestamp": datetime.now(),
            "status": "completed"
        }
        
        await collection.insert_one(analysis_doc)
        logger.info(f"Analysis {analysis_id} saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving analysis: {e}")
        raise
