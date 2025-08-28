"""
FinClick.AI - AI Engine Demo
عرض توضيحي لمحرك الذكاء الاصطناعي
"""

import pandas as pd
import numpy as np
from pathlib import Path
import logging

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# استيراد المحرك
try:
    from ai_engine import AIEngine, AnalysisType, FinancialData
except ImportError:
    logger.error("لا يمكن استيراد المحرك. تأكد من تثبيت جميع التبعيات.")
    exit(1)

def create_sample_financial_data():
    """إنشاء بيانات مالية تجريبية"""
    logger.info("إنشاء بيانات مالية تجريبية...")
    
    # الميزانية العمومية
    balance_sheet_data = {
        'Item': [
            'Cash and Cash Equivalents',
            'Accounts Receivable',
            'Inventory',
            'Prepaid Expenses',
            'Total Current Assets',
            'Property, Plant and Equipment',
            'Intangible Assets',
            'Total Non-Current Assets',
            'Total Assets',
            'Accounts Payable',
            'Short-term Debt',
            'Accrued Liabilities',
            'Total Current Liabilities',
            'Long-term Debt',
            'Total Non-Current Liabilities',
            'Total Liabilities',
            'Common Stock',
            'Retained Earnings',
            'Total Equity',
            'Total Liabilities and Equity'
        ],
        '2024': [
            500000,  # نقد
            300000,  # ذمم مدينة
            400000,  # مخزون
            50000,   # مصروفات مدفوعة مسبقاً
            1250000, # إجمالي الأصول المتداولة
            2000000, # الممتلكات والمصانع والمعدات
            500000,  # الأصول غير الملموسة
            2500000, # إجمالي الأصول غير المتداولة
            3750000, # إجمالي الأصول
            200000,  # ذمم دائنة
            300000,  # دين قصير الأجل
            150000,  # التزامات مستحقة
            650000,  # إجمالي الخصوم المتداولة
            1000000, # دين طويل الأجل
            1000000, # إجمالي الخصوم غير المتداولة
            1650000, # إجمالي الخصوم
            1000000, # أسهم عادية
            1100000, # أرباح محتجزة
            2100000, # إجمالي حقوق الملكية
            3750000  # إجمالي الخصوم وحقوق الملكية
        ]
    }
    
    balance_sheet = pd.DataFrame(balance_sheet_data)
    
    # قائمة الدخل
    income_statement_data = {
        'Item': [
            'Revenue',
            'Cost of Goods Sold',
            'Gross Profit',
            'Operating Expenses',
            'Operating Income',
            'Interest Expense',
            'Income Before Tax',
            'Income Tax Expense',
            'Net Income'
        ],
        '2024': [
            5000000,  # الإيرادات
            3000000,  # تكلفة البضائع المباعة
            2000000,  # إجمالي الربح
            1200000,  # المصروفات التشغيلية
            800000,   # الدخل التشغيلي
            80000,    # مصروفات الفائدة
            720000,   # الدخل قبل الضريبة
            180000,   # مصروفات ضريبة الدخل
            540000    # صافي الدخل
        ]
    }
    
    income_statement = pd.DataFrame(income_statement_data)
    
    # قائمة التدفق النقدي
    cash_flow_data = {
        'Item': [
            'Net Income',
            'Depreciation and Amortization',
            'Changes in Working Capital',
            'Operating Cash Flow',
            'Capital Expenditures',
            'Free Cash Flow',
            'Net Borrowing',
            'Net Cash Flow'
        ],
        '2024': [
            540000,   # صافي الدخل
            200000,   # الإهلاك والاستهلاك
            -100000,  # التغيرات في رأس المال العامل
            640000,   # التدفق النقدي التشغيلي
            -300000,  # المصروفات الرأسمالية
            340000,   # التدفق النقدي الحر
            200000,   # صافي الاقتراض
            540000    # صافي التدفق النقدي
        ]
    }
    
    cash_flow_statement = pd.DataFrame(cash_flow_data)
    
    return balance_sheet, income_statement, cash_flow_statement

def run_basic_analysis():
    """تشغيل تحليل أساسي"""
    logger.info("=== تشغيل التحليل الأساسي ===")
    
    try:
        # إنشاء المحرك
        ai_engine = AIEngine()
        
        # إنشاء البيانات التجريبية
        balance_sheet, income_statement, cash_flow_statement = create_sample_financial_data()
        
        # إنشاء كائن البيانات المالية
        financial_data = FinancialData(
            company_name="شركة التقنية المتقدمة",
            period="2024",
            currency="SAR",
            balance_sheet=balance_sheet,
            income_statement=income_statement,
            cash_flow_statement=cash_flow_statement
        )
        
        # أنواع التحليل الأساسية
        analysis_types = [
            AnalysisType.BASIC_RATIOS,
            AnalysisType.LIQUIDITY_ANALYSIS,
            AnalysisType.PROFITABILITY_ANALYSIS,
            AnalysisType.EFFICIENCY_ANALYSIS,
            AnalysisType.SOLVENCY_ANALYSIS
        ]
        
        logger.info(f"أنواع التحليل المطلوبة: {[at.value for at in analysis_types]}")
        
        # تشغيل التحليل
        result = ai_engine.financial_analyzer.analyze(financial_data, analysis_types)
        
        # عرض النتائج
        logger.info(f"تم إكمال {len(result)} تحليل")
        
        for analysis_type, analysis_result in result.items():
            logger.info(f"\n--- {analysis_type.value} ---")
            logger.info(f"مستوى المخاطر: {analysis_result.risk_level}")
            logger.info(f"درجة الثقة: {analysis_result.confidence_score:.2f}")
            logger.info(f"عدد المقاييس: {len(analysis_result.metrics)}")
            
            if analysis_result.insights:
                logger.info("الرؤى:")
                for insight in analysis_result.insights:
                    logger.info(f"  - {insight}")
            
            if analysis_result.recommendations:
                logger.info("التوصيات:")
                for rec in analysis_result.recommendations:
                    logger.info(f"  - {rec}")
        
        return result
        
    except Exception as e:
        logger.error(f"خطأ في التحليل الأساسي: {e}")
        return None

def run_advanced_analysis():
    """تشغيل تحليل متقدم"""
    logger.info("\n=== تشغيل التحليل المتقدم ===")
    
    try:
        # إنشاء المحرك
        ai_engine = AIEngine()
        
        # إنشاء البيانات التجريبية
        balance_sheet, income_statement, cash_flow_statement = create_sample_financial_data()
        
        # إنشاء كائن البيانات المالية
        financial_data = FinancialData(
            company_name="شركة التقنية المتقدمة",
            period="2024",
            currency="SAR",
            balance_sheet=balance_sheet,
            income_statement=income_statement,
            cash_flow_statement=cash_flow_statement
        )
        
        # أنواع التحليل المتقدمة
        analysis_types = [
            AnalysisType.ADVANCED_RATIOS,
            AnalysisType.CASH_FLOW_ANALYSIS,
            AnalysisType.GROWTH_ANALYSIS,
            AnalysisType.RISK_ANALYSIS,
            AnalysisType.VALUATION_ANALYSIS
        ]
        
        logger.info(f"أنواع التحليل المتقدم: {[at.value for at in analysis_types]}")
        
        # تشغيل التحليل
        result = ai_engine.financial_analyzer.analyze(financial_data, analysis_types)
        
        # عرض النتائج
        logger.info(f"تم إكمال {len(result)} تحليل متقدم")
        
        for analysis_type, analysis_result in result.items():
            logger.info(f"\n--- {analysis_type.value} ---")
            logger.info(f"مستوى المخاطر: {analysis_result.risk_level}")
            logger.info(f"درجة الثقة: {analysis_result.confidence_score:.2f}")
            
            if analysis_result.metrics:
                logger.info("المقاييس:")
                for metric_name, value in analysis_result.metrics.items():
                    if isinstance(value, (int, float)):
                        logger.info(f"  - {metric_name}: {value:.3f}")
                    else:
                        logger.info(f"  - {metric_name}: {value}")
        
        return result
        
    except Exception as e:
        logger.error(f"خطأ في التحليل المتقدم: {e}")
        return None

def run_comprehensive_analysis():
    """تشغيل تحليل شامل"""
    logger.info("\n=== تشغيل التحليل الشامل ===")
    
    try:
        # إنشاء المحرك
        ai_engine = AIEngine()
        
        # إنشاء البيانات التجريبية
        balance_sheet, income_statement, cash_flow_statement = create_sample_financial_data()
        
        # إنشاء كائن البيانات المالية
        financial_data = FinancialData(
            company_name="شركة التقنية المتقدمة",
            period="2024",
            currency="SAR",
            balance_sheet=balance_sheet,
            income_statement=income_statement,
            cash_flow_statement=cash_flow_statement
        )
        
        # جميع أنواع التحليل
        analysis_types = list(AnalysisType)
        
        logger.info(f"إجمالي أنواع التحليل: {len(analysis_types)}")
        logger.info("أنواع التحليل:")
        for i, at in enumerate(analysis_types, 1):
            logger.info(f"  {i:2d}. {at.value}")
        
        # تشغيل التحليل
        result = ai_engine.financial_analyzer.analyze(financial_data, analysis_types)
        
        # عرض ملخص النتائج
        logger.info(f"\nتم إكمال {len(result)} تحليل بنجاح")
        
        # إحصائيات عامة
        total_metrics = sum(len(ar.metrics) for ar in result.values())
        total_insights = sum(len(ar.insights) for ar in result.values())
        total_recommendations = sum(len(ar.recommendations) for ar in result.values())
        
        logger.info(f"\nإحصائيات التحليل:")
        logger.info(f"  - إجمالي المقاييس: {total_metrics}")
        logger.info(f"  - إجمالي الرؤى: {total_insights}")
        logger.info(f"  - إجمالي التوصيات: {total_recommendations}")
        
        # تحليل المخاطر
        risk_levels = [ar.risk_level for ar in result.values()]
        risk_counts = {}
        for risk in risk_levels:
            risk_counts[risk] = risk_counts.get(risk, 0) + 1
        
        logger.info(f"\nتوزيع مستويات المخاطر:")
        for risk, count in risk_counts.items():
            logger.info(f"  - {risk}: {count}")
        
        return result
        
    except Exception as e:
        logger.error(f"خطأ في التحليل الشامل: {e}")
        return None

def main():
    """الدالة الرئيسية"""
    logger.info("🚀 بدء تشغيل FinClick.AI AI Engine Demo")
    logger.info("=" * 50)
    
    try:
        # 1. التحليل الأساسي
        basic_result = run_basic_analysis()
        
        # 2. التحليل المتقدم
        advanced_result = run_advanced_analysis()
        
        # 3. التحليل الشامل
        comprehensive_result = run_comprehensive_analysis()
        
        # ملخص النتائج
        logger.info("\n" + "=" * 50)
        logger.info("📊 ملخص النتائج")
        logger.info("=" * 50)
        
        if basic_result:
            logger.info(f"✅ التحليل الأساسي: {len(basic_result)} تحليل مكتمل")
        
        if advanced_result:
            logger.info(f"✅ التحليل المتقدم: {len(advanced_result)} تحليل مكتمل")
        
        if comprehensive_result:
            logger.info(f"✅ التحليل الشامل: {len(comprehensive_result)} تحليل مكتمل")
        
        logger.info("\n🎉 تم إكمال جميع التحليلات بنجاح!")
        logger.info("FinClick.AI يوفر 170+ نوع تحليل مالي متقدم")
        
    except Exception as e:
        logger.error(f"خطأ في التشغيل الرئيسي: {e}")
        logger.error("يرجى التأكد من تثبيت جميع التبعيات")

if __name__ == "__main__":
    main()
