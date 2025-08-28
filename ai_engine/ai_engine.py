"""
AI Engine - محرك الذكاء الاصطناعي الرئيسي
يستخدم GPT-4, FinBERT, Transformers
"""

import logging
from typing import Dict, List, Optional, Any, Union
import pandas as pd
import numpy as np
from pathlib import Path

# AI/ML Libraries
try:
    from transformers import pipeline, AutoTokenizer, AutoModel
    from sentence_transformers import SentenceTransformer
    import openai
    from langchain.llms import OpenAI
    from langchain.chains import LLMChain
    from langchain.prompts import PromptTemplate
except ImportError:
    logging.warning("Some AI libraries not available")

from .models.financial_models import FinancialData, AnalysisResult, AnalysisType
from .analyzers.financial_analyzer import FinancialAnalyzer
from .processors.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

class AIEngine:
    """محرك الذكاء الاصطناعي الرئيسي"""
    
    def __init__(self, openai_api_key: Optional[str] = None):
        self.financial_analyzer = FinancialAnalyzer()
        self.document_processor = DocumentProcessor()
        
        # تهيئة نماذج الذكاء الاصطناعي
        self._initialize_ai_models()
        
        # إعداد OpenAI
        if openai_api_key:
            openai.api_key = openai_api_key
            self.openai_available = True
        else:
            self.openai_available = False
            logger.warning("OpenAI API key not provided")
    
    def _initialize_ai_models(self):
        """تهيئة نماذج الذكاء الاصطناعي"""
        try:
            # FinBERT للتحليل المالي
            self.finbert_tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
            self.finbert_model = AutoModel.from_pretrained("ProsusAI/finbert")
            
            # Sentence Transformers للتحليل الدلالي
            self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Sentiment Analysis
            self.sentiment_analyzer = pipeline("sentiment-analysis", model="ProsusAI/finbert")
            
            logger.info("AI models initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing AI models: {e}")
            self.finbert_model = None
            self.sentence_transformer = None
            self.sentiment_analyzer = None
    
    def process_financial_document(self, file_path: str, analysis_types: List[AnalysisType]) -> Dict[str, Any]:
        """معالجة المستند المالي وتحليله"""
        try:
            # 1. معالجة المستند
            processing_result = self.document_processor.process_document(file_path)
            
            if not processing_result.get('success', False):
                return {
                    'success': False,
                    'error': processing_result.get('error', 'Document processing failed')
                }
            
            # 2. استخراج البيانات المالية
            financial_data = self._extract_financial_data(processing_result)
            
            # 3. التحليل المالي
            analysis_results = self.financial_analyzer.analyze(financial_data, analysis_types)
            
            # 4. التحليل بالذكاء الاصطناعي
            ai_insights = self._generate_ai_insights(financial_data, analysis_results)
            
            # 5. توليد التقرير
            report = self._generate_comprehensive_report(
                processing_result, 
                analysis_results, 
                ai_insights
            )
            
            return {
                'success': True,
                'processing_summary': self.document_processor.get_processing_summary(processing_result),
                'analysis_results': analysis_results,
                'ai_insights': ai_insights,
                'comprehensive_report': report,
                'financial_data': financial_data
            }
            
        except Exception as e:
            logger.error(f"Error in process_financial_document: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _extract_financial_data(self, processing_result: Dict[str, Any]) -> FinancialData:
        """استخراج البيانات المالية من نتيجة المعالجة"""
        financial_data = processing_result.get('financial_data', {})
        
        # إنشاء DataFrames فارغة إذا لم تكن موجودة
        balance_sheet = financial_data.get('balance_sheet', pd.DataFrame())
        income_statement = financial_data.get('income_statement', pd.DataFrame())
        cash_flow_statement = financial_data.get('cash_flow_statement', pd.DataFrame())
        
        # استخراج اسم الشركة من البيانات
        company_name = self._extract_company_name(processing_result)
        
        return FinancialData(
            company_name=company_name,
            period="2024",  # يمكن جعله ديناميكي
            currency="SAR",  # يمكن جعله ديناميكي
            balance_sheet=balance_sheet,
            income_statement=income_statement,
            cash_flow_statement=cash_flow_statement,
            market_data=None,
            industry_data=None
        )
    
    def _extract_company_name(self, processing_result: Dict[str, Any]) -> str:
        """استخراج اسم الشركة من المستند"""
        # محاولة استخراج اسم الشركة من النص
        text_content = processing_result.get('cleaned_data', {}).get('text_content', '')
        
        # استخدام الذكاء الاصطناعي لاستخراج اسم الشركة
        if self.openai_available:
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "أنت مساعد مالي متخصص. استخرج اسم الشركة من النص المالي."},
                        {"role": "user", "content": f"استخرج اسم الشركة من هذا النص المالي:\n{text_content[:1000]}"}
                    ],
                    max_tokens=100
                )
                company_name = response.choices[0].message.content.strip()
                return company_name
            except Exception as e:
                logger.warning(f"OpenAI extraction failed: {e}")
        
        # استخدام FinBERT إذا كان متاحاً
        if self.finbert_model:
            try:
                # تحليل النص باستخدام FinBERT
                inputs = self.finbert_tokenizer(text_content[:512], return_tensors="pt", truncation=True)
                outputs = self.finbert_model(**inputs)
                
                # استخراج اسم الشركة (هذا مثال مبسط)
                company_name = "شركة مالية"  # يمكن تحسين هذا
                return company_name
                
            except Exception as e:
                logger.warning(f"FinBERT extraction failed: {e}")
        
        # استخدام طريقة بسيطة
        return "شركة مالية غير معروفة"
    
    def _generate_ai_insights(self, financial_data: FinancialData, analysis_results: Dict[AnalysisType, AnalysisResult]) -> Dict[str, Any]:
        """توليد رؤى ذكية باستخدام الذكاء الاصطناعي"""
        insights = {
            'sentiment_analysis': {},
            'semantic_analysis': {},
            'ai_recommendations': [],
            'risk_assessment': {},
            'future_outlook': {}
        }
        
        try:
            # تحليل المشاعر للنص المالي
            if self.sentiment_analyzer:
                text_content = self._extract_text_for_sentiment(financial_data)
                sentiment_result = self.sentiment_analyzer(text_content[:512])
                insights['sentiment_analysis'] = sentiment_result
            
            # تحليل دلالي
            if self.sentence_transformer:
                semantic_analysis = self._perform_semantic_analysis(financial_data, analysis_results)
                insights['semantic_analysis'] = semantic_analysis
            
            # توصيات ذكية
            ai_recommendations = self._generate_ai_recommendations(financial_data, analysis_results)
            insights['ai_recommendations'] = ai_recommendations
            
            # تقييم المخاطر
            risk_assessment = self._assess_ai_risk(financial_data, analysis_results)
            insights['risk_assessment'] = risk_assessment
            
            # النظرة المستقبلية
            future_outlook = self._generate_future_outlook(financial_data, analysis_results)
            insights['future_outlook'] = future_outlook
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {e}")
        
        return insights
    
    def _extract_text_for_sentiment(self, financial_data: FinancialData) -> str:
        """استخراج النص لتحليل المشاعر"""
        text_parts = []
        
        # إضافة البيانات المالية كنص
        if not financial_data.balance_sheet.empty:
            text_parts.append(financial_data.balance_sheet.to_string())
        
        if not financial_data.income_statement.empty:
            text_parts.append(financial_data.income_statement.to_string())
        
        if not financial_data.cash_flow_statement.empty:
            text_parts.append(financial_data.cash_flow_statement.to_string())
        
        return " ".join(text_parts)
    
    def _perform_semantic_analysis(self, financial_data: FinancialData, analysis_results: Dict[AnalysisType, AnalysisResult]) -> Dict[str, Any]:
        """إجراء تحليل دلالي"""
        semantic_analysis = {
            'financial_health_score': 0.0,
            'performance_trends': [],
            'key_indicators': [],
            'anomalies': []
        }
        
        try:
            # حساب درجة الصحة المالية
            health_score = self._calculate_financial_health_score(analysis_results)
            semantic_analysis['financial_health_score'] = health_score
            
            # تحديد اتجاهات الأداء
            performance_trends = self._identify_performance_trends(analysis_results)
            semantic_analysis['performance_trends'] = performance_trends
            
            # تحديد المؤشرات الرئيسية
            key_indicators = self._identify_key_indicators(analysis_results)
            semantic_analysis['key_indicators'] = key_indicators
            
            # تحديد الشذوذ
            anomalies = self._detect_anomalies(analysis_results)
            semantic_analysis['anomalies'] = anomalies
            
        except Exception as e:
            logger.error(f"Error in semantic analysis: {e}")
        
        return semantic_analysis
    
    def _calculate_financial_health_score(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> float:
        """حساب درجة الصحة المالية"""
        try:
            total_score = 0.0
            total_weight = 0.0
            
            for analysis_type, result in analysis_results.items():
                # وزن مختلف لكل نوع تحليل
                weight = self._get_analysis_weight(analysis_type)
                
                # حساب درجة لكل تحليل
                score = self._calculate_analysis_score(result)
                
                total_score += score * weight
                total_weight += weight
            
            if total_weight > 0:
                return total_score / total_weight
            else:
                return 0.0
                
        except Exception as e:
            logger.error(f"Error calculating financial health score: {e}")
            return 0.0
    
    def _get_analysis_weight(self, analysis_type: AnalysisType) -> float:
        """الحصول على وزن نوع التحليل"""
        weights = {
            AnalysisType.BASIC_RATIOS: 0.25,
            AnalysisType.LIQUIDITY_ANALYSIS: 0.20,
            AnalysisType.PROFITABILITY_ANALYSIS: 0.20,
            AnalysisType.EFFICIENCY_ANALYSIS: 0.15,
            AnalysisType.SOLVENCY_ANALYSIS: 0.20,
            AnalysisType.ADVANCED_RATIOS: 0.30,
            AnalysisType.CASH_FLOW_ANALYSIS: 0.25,
            AnalysisType.RISK_ANALYSIS: 0.25,
            AnalysisType.VALUATION_ANALYSIS: 0.20,
        }
        
        return weights.get(analysis_type, 0.15)
    
    def _calculate_analysis_score(self, result: AnalysisResult) -> float:
        """حساب درجة التحليل"""
        try:
            # استخدام درجة الثقة
            base_score = result.confidence_score
            
            # تعديل الدرجة بناءً على مستوى المخاطر
            risk_multiplier = {
                "منخفض": 1.0,
                "متوسط": 0.8,
                "عالي": 0.6,
                "عالي جداً": 0.4
            }
            
            risk_mult = risk_multiplier.get(result.risk_level, 0.8)
            
            return base_score * risk_mult
            
        except Exception as e:
            logger.error(f"Error calculating analysis score: {e}")
            return 0.0
    
    def _identify_performance_trends(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> List[str]:
        """تحديد اتجاهات الأداء"""
        trends = []
        
        try:
            for analysis_type, result in analysis_results.items():
                if result.metrics:
                    # تحليل المقاييس لتحديد الاتجاهات
                    for metric_name, value in result.metrics.items():
                        if isinstance(value, (int, float)):
                            if value > 0:
                                trends.append(f"{metric_name}: إيجابي")
                            elif value < 0:
                                trends.append(f"{metric_name}: سلبي")
                            else:
                                trends.append(f"{metric_name}: مستقر")
            
        except Exception as e:
            logger.error(f"Error identifying performance trends: {e}")
        
        return trends
    
    def _identify_key_indicators(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> List[str]:
        """تحديد المؤشرات الرئيسية"""
        key_indicators = []
        
        try:
            for analysis_type, result in analysis_results.items():
                if result.metrics:
                    # تحديد المقاييس المهمة
                    for metric_name, value in result.metrics.items():
                        if isinstance(value, (int, float)) and abs(value) > 0.1:
                            key_indicators.append(f"{metric_name}: {value:.3f}")
            
        except Exception as e:
            logger.error(f"Error identifying key indicators: {e}")
        
        return key_indicators
    
    def _detect_anomalies(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> List[str]:
        """اكتشاف الشذوذ"""
        anomalies = []
        
        try:
            for analysis_type, result in analysis_results.items():
                if result.metrics:
                    # اكتشاف القيم الشاذة
                    for metric_name, value in result.metrics.items():
                        if isinstance(value, (int, float)):
                            if abs(value) > 10:  # قيمة عالية جداً
                                anomalies.append(f"{metric_name}: قيمة عالية جداً ({value})")
                            elif abs(value) < 0.001:  # قيمة منخفضة جداً
                                anomalies.append(f"{metric_name}: قيمة منخفضة جداً ({value})")
            
        except Exception as e:
            logger.error(f"Error detecting anomalies: {e}")
        
        return anomalies
    
    def _generate_ai_recommendations(self, financial_data: FinancialData, analysis_results: Dict[AnalysisType, AnalysisResult]) -> List[str]:
        """توليد توصيات ذكية"""
        recommendations = []
        
        try:
            # استخدام OpenAI إذا كان متاحاً
            if self.openai_available:
                try:
                    # تجميع البيانات للتوصيات
                    analysis_summary = self._create_analysis_summary(analysis_results)
                    
                    response = openai.ChatCompletion.create(
                        model="gpt-4",
                        messages=[
                            {"role": "system", "content": "أنت مستشار مالي متخصص. قدم توصيات عملية بناءً على التحليل المالي."},
                            {"role": "user", "content": f"قدم 5 توصيات مالية عملية بناءً على هذا التحليل:\n{analysis_summary}"}
                        ],
                        max_tokens=300
                    )
                    
                    ai_recommendations = response.choices[0].message.content.strip()
                    recommendations.extend(ai_recommendations.split('\n'))
                    
                except Exception as e:
                    logger.warning(f"OpenAI recommendations failed: {e}")
            
            # إضافة توصيات من التحليل التقليدي
            for result in analysis_results.values():
                recommendations.extend(result.recommendations)
            
        except Exception as e:
            logger.error(f"Error generating AI recommendations: {e}")
        
        return recommendations[:10]  # حد أقصى 10 توصيات
    
    def _create_analysis_summary(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> str:
        """إنشاء ملخص التحليل"""
        summary_parts = []
        
        for analysis_type, result in analysis_results.items():
            summary_parts.append(f"{analysis_type.value}:")
            summary_parts.append(f"  - مستوى المخاطر: {result.risk_level}")
            summary_parts.append(f"  - درجة الثقة: {result.confidence_score:.2f}")
            summary_parts.append(f"  - عدد المقاييس: {len(result.metrics)}")
        
        return "\n".join(summary_parts)
    
    def _assess_ai_risk(self, financial_data: FinancialData, analysis_results: Dict[AnalysisType, AnalysisResult]) -> Dict[str, Any]:
        """تقييم المخاطر باستخدام الذكاء الاصطناعي"""
        risk_assessment = {
            'overall_risk_level': 'متوسط',
            'risk_factors': [],
            'risk_score': 0.0,
            'mitigation_strategies': []
        }
        
        try:
            # حساب درجة المخاطر الإجمالية
            total_risk_score = 0.0
            total_weight = 0.0
            
            for analysis_type, result in analysis_results.items():
                weight = self._get_analysis_weight(analysis_type)
                risk_score = self._calculate_risk_score(result)
                
                total_risk_score += risk_score * weight
                total_weight += weight
            
            if total_weight > 0:
                avg_risk_score = total_risk_score / total_weight
                risk_assessment['risk_score'] = avg_risk_score
                
                # تحديد مستوى المخاطر
                if avg_risk_score >= 0.7:
                    risk_assessment['overall_risk_level'] = 'عالي جداً'
                elif avg_risk_score >= 0.5:
                    risk_assessment['overall_risk_level'] = 'عالي'
                elif avg_risk_score >= 0.3:
                    risk_assessment['overall_risk_level'] = 'متوسط'
                else:
                    risk_assessment['overall_risk_level'] = 'منخفض'
            
            # تحديد عوامل المخاطر
            risk_factors = self._identify_risk_factors(analysis_results)
            risk_assessment['risk_factors'] = risk_factors
            
            # استراتيجيات التخفيف
            mitigation_strategies = self._suggest_mitigation_strategies(risk_assessment)
            risk_assessment['mitigation_strategies'] = mitigation_strategies
            
        except Exception as e:
            logger.error(f"Error in AI risk assessment: {e}")
        
        return risk_assessment
    
    def _calculate_risk_score(self, result: AnalysisResult) -> float:
        """حساب درجة المخاطر"""
        risk_levels = {
            "منخفض": 0.2,
            "متوسط": 0.5,
            "عالي": 0.8,
            "عالي جداً": 1.0
        }
        
        return risk_levels.get(result.risk_level, 0.5)
    
    def _identify_risk_factors(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> List[str]:
        """تحديد عوامل المخاطر"""
        risk_factors = []
        
        for analysis_type, result in analysis_results.items():
            if result.risk_level in ["عالي", "عالي جداً"]:
                risk_factors.append(f"{analysis_type.value}: {result.risk_level}")
        
        return risk_factors
    
    def _suggest_mitigation_strategies(self, risk_assessment: Dict[str, Any]) -> List[str]:
        """اقتراح استراتيجيات التخفيف"""
        strategies = []
        
        risk_level = risk_assessment.get('overall_risk_level', 'متوسط')
        
        if risk_level in ["عالي", "عالي جداً"]:
            strategies.extend([
                "مراجعة شاملة للاستراتيجية المالية",
                "تطوير خطة إدارة مخاطر شاملة",
                "زيادة رأس المال أو تقليل الدين",
                "تحسين إدارة رأس المال العامل",
                "مراقبة مستمرة للمؤشرات المالية"
            ])
        elif risk_level == "متوسط":
            strategies.extend([
                "مراقبة دورية للمؤشرات المالية",
                "تحسين الكفاءة التشغيلية",
                "تطوير استراتيجيات النمو بحذر"
            ])
        else:
            strategies.extend([
                "الحفاظ على الأداء الحالي",
                "استكشاف فرص النمو",
                "تحسين الكفاءة"
            ])
        
        return strategies
    
    def _generate_future_outlook(self, financial_data: FinancialData, analysis_results: Dict[AnalysisType, AnalysisResult]) -> Dict[str, Any]:
        """توليد النظرة المستقبلية"""
        future_outlook = {
            'short_term_outlook': 'مستقر',
            'medium_term_outlook': 'مستقر',
            'long_term_outlook': 'مستقر',
            'growth_potential': 'متوسط',
            'key_drivers': [],
            'challenges': []
        }
        
        try:
            # تحليل الاتجاهات لتحديد النظرة المستقبلية
            trends = self._identify_performance_trends(analysis_results)
            
            # تحديد النظرة بناءً على الاتجاهات
            positive_trends = [t for t in trends if "إيجابي" in t]
            negative_trends = [t for t in trends if "سلبي" in t]
            
            if len(positive_trends) > len(negative_trends):
                future_outlook['short_term_outlook'] = 'إيجابي'
                future_outlook['growth_potential'] = 'عالي'
            elif len(negative_trends) > len(positive_trends):
                future_outlook['short_term_outlook'] = 'سلبي'
                future_outlook['growth_potential'] = 'منخفض'
            
            # تحديد المحركات الرئيسية
            key_indicators = self._identify_key_indicators(analysis_results)
            future_outlook['key_drivers'] = key_indicators[:5]
            
            # تحديد التحديات
            risk_factors = self._identify_risk_factors(analysis_results)
            future_outlook['challenges'] = risk_factors
            
        except Exception as e:
            logger.error(f"Error generating future outlook: {e}")
        
        return future_outlook
    
    def _generate_comprehensive_report(self, processing_result: Dict[str, Any], analysis_results: Dict[AnalysisType, AnalysisResult], ai_insights: Dict[str, Any]) -> Dict[str, Any]:
        """توليد تقرير شامل"""
        report = {
            'executive_summary': {},
            'detailed_analysis': {},
            'ai_insights': ai_insights,
            'recommendations': [],
            'risk_assessment': {},
            'future_outlook': {},
            'appendix': {}
        }
        
        try:
            # الملخص التنفيذي
            report['executive_summary'] = self._create_executive_summary(processing_result, analysis_results, ai_insights)
            
            # التحليل التفصيلي
            report['detailed_analysis'] = self._create_detailed_analysis(analysis_results)
            
            # التوصيات
            all_recommendations = []
            for result in analysis_results.values():
                all_recommendations.extend(result.recommendations)
            
            if 'ai_recommendations' in ai_insights:
                all_recommendations.extend(ai_insights['ai_recommendations'])
            
            report['recommendations'] = list(set(all_recommendations))[:15]  # إزالة التكرار
            
            # تقييم المخاطر
            report['risk_assessment'] = ai_insights.get('risk_assessment', {})
            
            # النظرة المستقبلية
            report['future_outlook'] = ai_insights.get('future_outlook', {})
            
            # الملحق
            report['appendix'] = {
                'processing_details': processing_result.get('processing_metadata', {}),
                'analysis_metadata': {
                    'total_analyses': len(analysis_results),
                    'analysis_types': [at.value for at in analysis_results.keys()],
                    'confidence_scores': [result.confidence_score for result in analysis_results.values()]
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating comprehensive report: {e}")
        
        return report
    
    def _create_executive_summary(self, processing_result: Dict[str, Any], analysis_results: Dict[AnalysisType, AnalysisResult], ai_insights: Dict[str, Any]) -> Dict[str, Any]:
        """إنشاء الملخص التنفيذي"""
        summary = {
            'company_name': 'غير محدد',
            'analysis_period': '2024',
            'overall_health_score': 0.0,
            'key_findings': [],
            'critical_issues': [],
            'success_indicators': []
        }
        
        try:
            # حساب درجة الصحة الإجمالية
            if 'semantic_analysis' in ai_insights:
                summary['overall_health_score'] = ai_insights['semantic_analysis'].get('financial_health_score', 0.0)
            
            # تحديد النتائج الرئيسية
            for result in analysis_results.values():
                if result.insights:
                    summary['key_findings'].extend(result.insights[:2])  # أول رؤيتين فقط
            
            # تحديد القضايا الحرجة
            for result in analysis_results.values():
                if result.risk_level in ["عالي", "عالي جداً"]:
                    summary['critical_issues'].append(f"{result.analysis_type.value}: {result.risk_level}")
            
            # تحديد مؤشرات النجاح
            for result in analysis_results.values():
                if result.risk_level == "منخفض":
                    summary['success_indicators'].append(f"{result.analysis_type.value}: {result.risk_level}")
            
        except Exception as e:
            logger.error(f"Error creating executive summary: {e}")
        
        return summary
    
    def _create_detailed_analysis(self, analysis_results: Dict[AnalysisType, AnalysisResult]) -> Dict[str, Any]:
        """إنشاء التحليل التفصيلي"""
        detailed_analysis = {}
        
        try:
            for analysis_type, result in analysis_results.items():
                detailed_analysis[analysis_type.value] = {
                    'metrics': result.metrics,
                    'insights': result.insights,
                    'recommendations': result.recommendations,
                    'risk_level': result.risk_level,
                    'confidence_score': result.confidence_score
                }
            
        except Exception as e:
            logger.error(f"Error creating detailed analysis: {e}")
        
        return detailed_analysis
