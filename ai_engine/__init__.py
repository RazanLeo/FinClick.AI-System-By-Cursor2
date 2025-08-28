"""
FinClick.AI - AI Engine
محرك الذكاء الاصطناعي للتحليل المالي
"""

from .ai_engine import AIEngine
from .models.financial_models import FinancialData, AnalysisResult, AnalysisType, FinancialModel, AdvancedFinancialModel
from .analyzers.financial_analyzer import FinancialAnalyzer
from .processors.document_processor import DocumentProcessor

__version__ = "1.0.0"
__author__ = "FinClick.AI Team"

__all__ = [
    'AIEngine',
    'FinancialData',
    'AnalysisResult',
    'AnalysisType',
    'FinancialModel',
    'AdvancedFinancialModel',
    'FinancialAnalyzer',
    'DocumentProcessor'
]
