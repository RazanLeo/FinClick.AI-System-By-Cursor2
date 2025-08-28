"""
Financial Analysis Models
نماذج التحليل المالي الأساسية
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class AnalysisType(Enum):
    """أنواع التحليل المالي"""
    # التحليل الأساسي
    BASIC_RATIOS = "basic_ratios"
    LIQUIDITY_ANALYSIS = "liquidity_analysis"
    PROFITABILITY_ANALYSIS = "profitability_analysis"
    EFFICIENCY_ANALYSIS = "efficiency_analysis"
    SOLVENCY_ANALYSIS = "solvency_analysis"
    
    # التحليل المتقدم
    ADVANCED_RATIOS = "advanced_ratios"
    CASH_FLOW_ANALYSIS = "cash_flow_analysis"
    GROWTH_ANALYSIS = "growth_analysis"
    RISK_ANALYSIS = "risk_analysis"
    VALUATION_ANALYSIS = "valuation_analysis"
    
    # تحليل السوق
    MARKET_ANALYSIS = "market_analysis"
    COMPETITIVE_ANALYSIS = "competitive_analysis"
    INDUSTRY_ANALYSIS = "industry_analysis"
    ECONOMIC_ANALYSIS = "economic_analysis"
    
    # تحليل الاستثمار
    INVESTMENT_ANALYSIS = "investment_analysis"
    PORTFOLIO_ANALYSIS = "portfolio_analysis"
    ASSET_ALLOCATION = "asset_allocation"
    RISK_RETURN_ANALYSIS = "risk_return_analysis"

class FinancialMetric(Enum):
    """المقاييس المالية الأساسية"""
    # مقاييس السيولة
    CURRENT_RATIO = "current_ratio"
    QUICK_RATIO = "quick_ratio"
    CASH_RATIO = "cash_ratio"
    WORKING_CAPITAL = "working_capital"
    
    # مقاييس الربحية
    GROSS_MARGIN = "gross_margin"
    OPERATING_MARGIN = "operating_margin"
    NET_MARGIN = "net_margin"
    ROA = "return_on_assets"
    ROE = "return_on_equity"
    ROIC = "return_on_invested_capital"
    
    # مقاييس الكفاءة
    ASSET_TURNOVER = "asset_turnover"
    INVENTORY_TURNOVER = "inventory_turnover"
    RECEIVABLES_TURNOVER = "receivables_turnover"
    PAYABLES_TURNOVER = "payables_turnover"
    
    # مقاييس الملاءة
    DEBT_RATIO = "debt_ratio"
    DEBT_TO_EQUITY = "debt_to_equity"
    INTEREST_COVERAGE = "interest_coverage"
    CASH_FLOW_TO_DEBT = "cash_flow_to_debt"

@dataclass
class FinancialData:
    """بيانات مالية أساسية"""
    company_name: str
    period: str
    currency: str
    balance_sheet: pd.DataFrame
    income_statement: pd.DataFrame
    cash_flow_statement: pd.DataFrame
    market_data: Optional[pd.DataFrame] = None
    industry_data: Optional[pd.DataFrame] = None

@dataclass
class AnalysisResult:
    """نتيجة التحليل"""
    analysis_type: AnalysisType
    metrics: Dict[str, float]
    insights: List[str]
    recommendations: List[str]
    risk_level: str
    confidence_score: float
    charts_data: Optional[Dict] = None
    raw_data: Optional[pd.DataFrame] = None

class FinancialModel:
    """النموذج المالي الأساسي"""
    
    def __init__(self):
        self.analysis_types = list(AnalysisType)
        self.metrics = list(FinancialMetric)
    
    def calculate_basic_ratios(self, financial_data: FinancialData) -> AnalysisResult:
        """حساب النسب الأساسية"""
        try:
            bs = financial_data.balance_sheet
            is_stmt = financial_data.income_statement
            
            metrics = {}
            
            # Current Ratio
            if 'Current Assets' in bs.columns and 'Current Liabilities' in bs.columns:
                metrics['current_ratio'] = bs['Current Assets'].iloc[-1] / bs['Current Liabilities'].iloc[-1]
            
            # Quick Ratio
            if 'Current Assets' in bs.columns and 'Inventory' in bs.columns and 'Current Liabilities' in bs.columns:
                quick_assets = bs['Current Assets'].iloc[-1] - bs['Inventory'].iloc[-1]
                metrics['quick_ratio'] = quick_assets / bs['Current Liabilities'].iloc[-1]
            
            # Debt to Equity
            if 'Total Debt' in bs.columns and 'Total Equity' in bs.columns:
                metrics['debt_to_equity'] = bs['Total Debt'].iloc[-1] / bs['Total Equity'].iloc[-1]
            
            # ROE
            if 'Net Income' in is_stmt.columns and 'Total Equity' in bs.columns:
                metrics['roe'] = is_stmt['Net Income'].iloc[-1] / bs['Total Equity'].iloc[-1]
            
            # ROA
            if 'Net Income' in is_stmt.columns and 'Total Assets' in bs.columns:
                metrics['roa'] = is_stmt['Net Income'].iloc[-1] / bs['Total Assets'].iloc[-1]
            
            insights = self._generate_insights(metrics)
            recommendations = self._generate_recommendations(metrics)
            
            return AnalysisResult(
                analysis_type=AnalysisType.BASIC_RATIOS,
                metrics=metrics,
                insights=insights,
                recommendations=recommendations,
                risk_level=self._assess_risk(metrics),
                confidence_score=0.85,
                raw_data=pd.DataFrame(metrics.items(), columns=['Metric', 'Value'])
            )
            
        except Exception as e:
            logger.error(f"Error calculating basic ratios: {e}")
            raise
    
    def _generate_insights(self, metrics: Dict[str, float]) -> List[str]:
        """توليد الرؤى من المقاييس"""
        insights = []
        
        if 'current_ratio' in metrics:
            cr = metrics['current_ratio']
            if cr > 2.0:
                insights.append("نسبة السيولة الحالية ممتازة وتشير إلى قدرة عالية على سداد الالتزامات قصيرة الأجل")
            elif cr > 1.5:
                insights.append("نسبة السيولة الحالية جيدة وتوازن مناسب بين الأصول والخصوم")
            elif cr > 1.0:
                insights.append("نسبة السيولة الحالية مقبولة ولكن قد تحتاج إلى مراقبة")
            else:
                insights.append("نسبة السيولة الحالية منخفضة وتشير إلى مخاطر في السيولة")
        
        if 'debt_to_equity' in metrics:
            dte = metrics['debt_to_equity']
            if dte < 0.5:
                insights.append("نسبة الدين إلى حقوق الملكية منخفضة مما يشير إلى هيكل رأسمالي محافظ")
            elif dte < 1.0:
                insights.append("نسبة الدين إلى حقوق الملكية معقولة وتوازن جيد في التمويل")
            else:
                insights.append("نسبة الدين إلى حقوق الملكية عالية وتشير إلى اعتماد كبير على التمويل بالدين")
        
        return insights
    
    def _generate_recommendations(self, metrics: Dict[str, float]) -> List[str]:
        """توليد التوصيات من المقاييس"""
        recommendations = []
        
        if 'current_ratio' in metrics and metrics['current_ratio'] < 1.0:
            recommendations.append("زيادة رأس المال العامل لتحسين السيولة")
            recommendations.append("مراجعة سياسات إدارة المخزون والذمم المدينة")
        
        if 'debt_to_equity' in metrics and metrics['debt_to_equity'] > 1.0:
            recommendations.append("تقليل الاعتماد على التمويل بالدين")
            recommendations.append("زيادة حقوق الملكية من خلال الأرباح المحتجزة أو إصدار أسهم جديدة")
        
        if 'roe' in metrics and metrics['roe'] < 0.1:
            recommendations.append("تحسين كفاءة استخدام رأس المال")
            recommendations.append("مراجعة هيكل التكاليف والعمليات")
        
        return recommendations
    
    def _assess_risk(self, metrics: Dict[str, float]) -> str:
        """تقييم مستوى المخاطر"""
        risk_score = 0
        
        if 'current_ratio' in metrics:
            if metrics['current_ratio'] < 1.0:
                risk_score += 3
            elif metrics['current_ratio'] < 1.5:
                risk_score += 1
        
        if 'debt_to_equity' in metrics:
            if metrics['debt_to_equity'] > 1.0:
                risk_score += 3
            elif metrics['debt_to_equity'] > 0.7:
                risk_score += 1
        
        if 'roe' in metrics:
            if metrics['roe'] < 0.05:
                risk_score += 2
            elif metrics['roe'] < 0.1:
                risk_score += 1
        
        if risk_score >= 6:
            return "عالي"
        elif risk_score >= 3:
            return "متوسط"
        else:
            return "منخفض"

class AdvancedFinancialModel(FinancialModel):
    """النموذج المالي المتقدم"""
    
    def calculate_advanced_ratios(self, financial_data: FinancialData) -> AnalysisResult:
        """حساب النسب المتقدمة"""
        try:
            metrics = {}
            bs = financial_data.balance_sheet
            is_stmt = financial_data.income_statement
            cf = financial_data.cash_flow_statement
            
            # Free Cash Flow
            if 'Operating Cash Flow' in cf.columns and 'Capital Expenditures' in cf.columns:
                metrics['free_cash_flow'] = cf['Operating Cash Flow'].iloc[-1] - cf['Capital Expenditures'].iloc[-1]
            
            # Economic Value Added (EVA)
            if 'Net Income' in is_stmt.columns and 'Total Assets' in bs.columns:
                cost_of_capital = 0.1  # يمكن جعله ديناميكي
                metrics['eva'] = is_stmt['Net Income'].iloc[-1] - (bs['Total Assets'].iloc[-1] * cost_of_capital)
            
            # Altman Z-Score
            if all(col in bs.columns for col in ['Working Capital', 'Total Assets', 'Retained Earnings']):
                z_score = self._calculate_altman_z_score(bs, is_stmt)
                metrics['altman_z_score'] = z_score
            
            insights = self._generate_advanced_insights(metrics)
            recommendations = self._generate_advanced_recommendations(metrics)
            
            return AnalysisResult(
                analysis_type=AnalysisType.ADVANCED_RATIOS,
                metrics=metrics,
                insights=insights,
                recommendations=recommendations,
                risk_level=self._assess_advanced_risk(metrics),
                confidence_score=0.90,
                raw_data=pd.DataFrame(metrics.items(), columns=['Metric', 'Value'])
            )
            
        except Exception as e:
            logger.error(f"Error calculating advanced ratios: {e}")
            raise
    
    def _calculate_altman_z_score(self, bs: pd.DataFrame, is_stmt: pd.DataFrame) -> float:
        """حساب Altman Z-Score"""
        try:
            working_capital = bs['Working Capital'].iloc[-1]
            total_assets = bs['Total Assets'].iloc[-1]
            retained_earnings = bs['Retained Earnings'].iloc[-1]
            ebit = is_stmt['EBIT'].iloc[-1] if 'EBIT' in is_stmt.columns else is_stmt['Operating Income'].iloc[-1]
            total_equity = bs['Total Equity'].iloc[-1]
            sales = is_stmt['Revenue'].iloc[-1]
            
            z_score = (1.2 * (working_capital / total_assets) +
                      1.4 * (retained_earnings / total_assets) +
                      3.3 * (ebit / total_assets) +
                      0.6 * (total_equity / total_assets) +
                      1.0 * (sales / total_assets))
            
            return z_score
            
        except Exception as e:
            logger.error(f"Error calculating Altman Z-Score: {e}")
            return 0.0
    
    def _generate_advanced_insights(self, metrics: Dict[str, float]) -> List[str]:
        """توليد رؤى متقدمة"""
        insights = []
        
        if 'altman_z_score' in metrics:
            z_score = metrics['altman_z_score']
            if z_score > 3.0:
                insights.append("مؤشر Altman Z-Score يشير إلى استقرار مالي ممتاز")
            elif z_score > 2.7:
                insights.append("مؤشر Altman Z-Score يشير إلى استقرار مالي جيد")
            elif z_score > 1.8:
                insights.append("مؤشر Altman Z-Score يشير إلى استقرار مالي مقبول")
            else:
                insights.append("مؤشر Altman Z-Score يشير إلى مخاطر مالية عالية")
        
        if 'free_cash_flow' in metrics:
            fcf = metrics['free_cash_flow']
            if fcf > 0:
                insights.append("التدفق النقدي الحر إيجابي مما يشير إلى قدرة على التوسع والاستثمار")
            else:
                insights.append("التدفق النقدي الحر سالب مما قد يشير إلى تحديات في السيولة")
        
        return insights
    
    def _generate_advanced_recommendations(self, metrics: Dict[str, float]) -> List[str]:
        """توليد توصيات متقدمة"""
        recommendations = []
        
        if 'altman_z_score' in metrics and metrics['altman_z_score'] < 1.8:
            recommendations.append("تحسين هيكل رأس المال لزيادة الاستقرار المالي")
            recommendations.append("مراجعة استراتيجية الأعمال لتقليل المخاطر")
        
        if 'free_cash_flow' in metrics and metrics['free_cash_flow'] < 0:
            recommendations.append("تحسين إدارة رأس المال العامل")
            recommendations.append("مراجعة سياسات الاستثمار الرأسمالي")
        
        return recommendations
    
    def _assess_advanced_risk(self, metrics: Dict[str, float]) -> str:
        """تقييم المخاطر المتقدمة"""
        risk_score = 0
        
        if 'altman_z_score' in metrics:
            z_score = metrics['altman_z_score']
            if z_score < 1.8:
                risk_score += 4
            elif z_score < 2.7:
                risk_score += 2
            elif z_score < 3.0:
                risk_score += 1
        
        if 'free_cash_flow' in metrics and metrics['free_cash_flow'] < 0:
            risk_score += 2
        
        if risk_score >= 5:
            return "عالي جداً"
        elif risk_score >= 3:
            return "عالي"
        elif risk_score >= 1:
            return "متوسط"
        else:
            return "منخفض"
