"""
Financial analysis models for FinClick.AI
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from .base import Base, TimestampMixin, IDMixin

class AnalysisType(str, enum.Enum):
    """Types of financial analysis"""
    # Basic Classical Analysis
    VERTICAL_ANALYSIS = "vertical_analysis"
    HORIZONTAL_ANALYSIS = "horizontal_analysis"
    COMBINED_ANALYSIS = "combined_analysis"
    TREND_ANALYSIS = "trend_analysis"
    BASIC_COMPARATIVE = "basic_comparative"
    VALUE_ADDED_ANALYSIS = "value_added_analysis"
    COMMON_SIZE_ANALYSIS = "common_size_analysis"
    TIME_SERIES_SIMPLE = "time_series_simple"
    RELATIVE_CHANGES = "relative_changes"
    GROWTH_RATES = "growth_rates"
    BASIC_DEVIATIONS = "basic_deviations"
    SIMPLE_VARIANCE = "simple_variance"
    DIFFERENCES_ANALYSIS = "differences_analysis"
    EXCEPTIONAL_ITEMS = "exceptional_items"
    INDEX_NUMBERS = "index_numbers"
    
    # Financial Ratios
    LIQUIDITY_RATIOS = "liquidity_ratios"
    ACTIVITY_RATIOS = "activity_ratios"
    DEBT_RATIOS = "debt_ratios"
    PROFITABILITY_RATIOS = "profitability_ratios"
    MARKET_RATIOS = "market_ratios"
    
    # Cash Flow Analysis
    CASH_FLOW_BASIC = "cash_flow_basic"
    WORKING_CAPITAL = "working_capital"
    CASH_CYCLE = "cash_cycle"
    BREAKEVEN_ANALYSIS = "breakeven_analysis"
    SAFETY_MARGIN = "safety_margin"
    COST_STRUCTURE = "cost_structure"
    FIXED_VARIABLE_COSTS = "fixed_variable_costs"
    OPERATING_LEVERAGE = "operating_leverage"
    CONTRIBUTION_MARGIN = "contribution_margin"
    FREE_CASH_FLOWS = "free_cash_flows"
    
    # Advanced Comparative Analysis
    INDUSTRIAL_COMPARATIVE = "industrial_comparative"
    PEER_COMPARATIVE = "peer_comparative"
    HISTORICAL_COMPARATIVE = "historical_comparative"
    BENCHMARKING = "benchmarking"
    GAP_ANALYSIS = "gap_analysis"
    COMPETITIVE_POSITION = "competitive_position"
    MARKET_SHARE = "market_share"
    COMPETITIVE_STRENGTH = "competitive_strength"
    FINANCIAL_STRENGTH_WEAKNESS = "financial_strength_weakness"
    RELATIVE_PERFORMANCE = "relative_performance"
    
    # Investment and Valuation
    TIME_VALUE_MONEY = "time_value_money"
    NPV_ANALYSIS = "npv_analysis"
    IRR_ANALYSIS = "irr_analysis"
    PAYBACK_PERIOD = "payback_period"
    DISCOUNTED_CASH_FLOW = "discounted_cash_flow"
    ROI_ANALYSIS = "roi_analysis"
    ECONOMIC_VALUE_ADDED = "economic_value_added"
    MARKET_VALUE_ADDED = "market_value_added"
    GORDON_GROWTH_MODEL = "gordon_growth_model"
    DIVIDEND_DISCOUNT_MODEL = "dividend_discount_model"
    FAIR_VALUE_ANALYSIS = "fair_value_analysis"
    COST_BENEFIT_ANALYSIS = "cost_benefit_analysis"
    FEASIBILITY_ANALYSIS = "feasibility_analysis"
    INVESTMENT_PROJECTS = "investment_projects"
    INVESTMENT_ALTERNATIVES = "investment_alternatives"
    COMPANY_VALUATION = "company_valuation"
    
    # Performance and Efficiency
    DUPONT_ANALYSIS = "dupont_analysis"
    PRODUCTIVITY_ANALYSIS = "productivity_analysis"
    OPERATIONAL_EFFICIENCY = "operational_efficiency"
    VALUE_CHAIN_ANALYSIS = "value_chain_analysis"
    ACTIVITY_BASED_COSTING = "activity_based_costing"
    BALANCED_SCORECARD = "balanced_scorecard"
    KPI_ANALYSIS = "kpi_analysis"
    CRITICAL_SUCCESS_FACTORS = "critical_success_factors"
    ADVANCED_DEVIATIONS = "advanced_deviations"
    VARIANCE_ANALYSIS = "variance_analysis"
    FLEXIBILITY_ANALYSIS = "flexibility_analysis"
    SENSITIVITY_ANALYSIS = "sensitivity_analysis"
    
    # Modeling and Simulation
    SCENARIO_ANALYSIS = "scenario_analysis"
    MONTE_CARLO = "monte_carlo"
    COMPLEX_FINANCIAL_MODELING = "complex_financial_modeling"
    MULTIVARIATE_SENSITIVITY = "multivariate_sensitivity"
    DECISION_TREE_ANALYSIS = "decision_tree_analysis"
    REAL_OPTIONS_ANALYSIS = "real_options_analysis"
    FINANCIAL_FORECASTING = "financial_forecasting"
    WHAT_IF_ANALYSIS = "what_if_analysis"
    STOCHASTIC_SIMULATION = "stochastic_simulation"
    OPTIMIZATION_MODELS = "optimization_models"
    LINEAR_PROGRAMMING = "linear_programming"
    DYNAMIC_PROGRAMMING = "dynamic_programming"
    OPTIMAL_ALLOCATION = "optimal_allocation"
    GAME_THEORY_FINANCIAL = "game_theory_financial"
    FINANCIAL_NETWORKS = "financial_networks"
    
    # Statistical and Quantitative
    MULTIPLE_REGRESSION = "multiple_regression"
    ADVANCED_TIME_SERIES = "advanced_time_series"
    ARIMA_MODELS = "arima_models"
    GARCH_MODELS = "garch_models"
    PRINCIPAL_COMPONENTS = "principal_components"
    FACTOR_ANALYSIS = "factor_analysis"
    ANOVA_ANALYSIS = "anova_analysis"
    COINTEGRATION_ANALYSIS = "cointegration_analysis"
    VAR_MODELS = "var_models"
    VECM_MODELS = "vecm_models"
    COPULA_DEPENDENCE = "copula_dependence"
    EXTREME_VALUE_THEORY = "extreme_value_theory"
    SURVIVAL_ANALYSIS = "survival_analysis"
    MARKOV_MODELS = "markov_models"
    THRESHOLD_ANALYSIS = "threshold_analysis"
    REGIME_SWITCHING = "regime_switching"
    CHAOS_THEORY = "chaos_theory"
    FRACTAL_DIMENSIONS = "fractal_dimensions"
    BOOTSTRAP_ANALYSIS = "bootstrap_analysis"
    WAVELET_ANALYSIS = "wavelet_analysis"
    
    # Portfolio and Risk Management
    MODERN_PORTFOLIO_THEORY = "modern_portfolio_theory"
    CAPM_MODEL = "capm_model"
    ARBITRAGE_PRICING = "arbitrage_pricing"
    FAMA_FRENCH_MODEL = "fama_french_model"
    BETA_SYSTEMATIC_RISK = "beta_systematic_risk"
    ALPHA_ABNORMAL_RETURNS = "alpha_abnormal_returns"
    VALUE_AT_RISK = "value_at_risk"
    EXPECTED_SHORTFALL = "expected_shortfall"
    STRESS_TESTING = "stress_testing"
    CATASTROPHIC_SCENARIOS = "catastrophic_scenarios"
    OPERATIONAL_RISK = "operational_risk"
    MARKET_RISK = "market_risk"
    CREDIT_RISK = "credit_risk"
    LIQUIDITY_RISK = "liquidity_risk"
    CYBERSECURITY_RISK = "cybersecurity_risk"
    GEOPOLITICAL_RISK = "geopolitical_risk"
    ENVIRONMENTAL_CLIMATE_RISK = "environmental_climate_risk"
    CREDIT_RISK_MODELS = "credit_risk_models"
    CONCENTRATION_DIVERSIFICATION = "concentration_diversification"
    DYNAMIC_CORRELATION = "dynamic_correlation"
    RISK_PARITY = "risk_parity"
    DRAWDOWN_ANALYSIS = "drawdown_analysis"
    ICAAP_MODELS = "icaap_models"
    BASEL_III_REQUIREMENTS = "basel_iii_requirements"
    BACKTESTING_MODELS = "backtesting_models"
    MA_ANALYSIS = "ma_analysis"
    LBO_PRIVATE_EQUITY = "lbo_private_equity"
    IPO_ANALYSIS = "ipo_analysis"
    SPIN_OFFS_ANALYSIS = "spin_offs_analysis"
    RESTRUCTURING_ANALYSIS = "restructuring_analysis"
    BANKRUPTCY_WORKOUT = "bankruptcy_workout"
    FORENSIC_FINANCIAL = "forensic_financial"
    
    # Detection and Intelligent Forecasting
    AI_FRAUD_DETECTION = "ai_fraud_detection"
    MONEY_LAUNDERING_DETECTION = "money_laundering_detection"
    MARKET_MANIPULATION_DETECTION = "market_manipulation_detection"
    BANKRUPTCY_PREDICTION = "bankruptcy_prediction"
    FINANCIAL_CRISIS_PREDICTION = "financial_crisis_prediction"
    REAL_TIME_ANOMALY_DETECTION = "real_time_anomaly_detection"
    MARKET_VOLATILITY_PREDICTION = "market_volatility_prediction"
    EARLY_WARNING_MODELS = "early_warning_models"
    INTELLIGENT_FINANCIAL_BEHAVIOR = "intelligent_financial_behavior"
    EXPLAINABLE_AI_FINANCIAL = "explainable_ai_financial"

class AnalysisLevel(str, enum.Enum):
    """Analysis complexity levels"""
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class FinancialAnalysis(Base, IDMixin, TimestampMixin):
    """Financial analysis model"""
    __tablename__ = "financial_analyses"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(255), nullable=False)
    sector = Column(String(100))
    activity = Column(String(100))
    legal_entity = Column(String(100))
    analysis_years = Column(Integer, default=1)
    comparison_level = Column(String(50))  # local, gulf, arab, asia, africa, europe, north_america, south_america, australia, global
    
    # Analysis details
    analysis_type = Column(Enum(AnalysisType), nullable=False)
    analysis_level = Column(Enum(AnalysisLevel), default=AnalysisLevel.BASIC)
    analysis_data = Column(JSON)  # Raw analysis data
    results = Column(JSON)  # Analysis results
    recommendations = Column(Text)
    risk_assessment = Column(Text)
    swot_analysis = Column(JSON)
    
    # Status
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    progress = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    files = relationship("UploadedFile", back_populates="analysis")
    
    def __repr__(self):
        return f"<FinancialAnalysis(id={self.id}, type={self.analysis_type}, company='{self.company_name}')>"

class UploadedFile(Base, IDMixin, TimestampMixin):
    """Uploaded financial documents"""
    __tablename__ = "uploaded_files"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("financial_analyses.id"), nullable=True)
    
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(50), nullable=False)
    mime_type = Column(String(100))
    
    # Processing status
    is_processed = Column(Boolean, default=False)
    processing_status = Column(String(50), default="pending")
    extracted_data = Column(JSON)
    
    # Relationships
    user = relationship("User", back_populates="files")
    analysis = relationship("FinancialAnalysis", back_populates="files")
    
    def __repr__(self):
        return f"<UploadedFile(id={self.id}, filename='{self.filename}')>"

class FinancialData(Base, IDMixin, TimestampMixin):
    """Extracted financial data from documents"""
    __tablename__ = "financial_data"
    
    analysis_id = Column(Integer, ForeignKey("financial_analyses.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)
    
    data_type = Column(String(50))  # balance_sheet, income_statement, cash_flow
    year = Column(Integer)
    period = Column(String(50))  # annual, quarterly, monthly
    
    # Financial statements data
    balance_sheet_data = Column(JSON)
    income_statement_data = Column(JSON)
    cash_flow_data = Column(JSON)
    
    # Metadata
    currency = Column(String(10), default="SAR")
    reporting_standard = Column(String(50), default="IFRS")
    
    def __repr__(self):
        return f"<FinancialData(id={self.id}, type={self.data_type}, year={self.year})>"
