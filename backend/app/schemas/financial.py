"""
Financial analysis schemas for FinClick.AI
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class AnalysisType(str, Enum):
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

class AnalysisLevel(str, Enum):
    """Analysis complexity levels"""
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ComparisonLevel(str, Enum):
    """Comparison levels"""
    LOCAL = "local"  # Saudi Arabia
    GULF = "gulf"    # Gulf countries
    ARAB = "arab"    # Arab countries
    ASIA = "asia"    # Asian countries
    AFRICA = "africa" # African countries
    EUROPE = "europe" # European countries
    NORTH_AMERICA = "north_america"
    SOUTH_AMERICA = "south_america"
    AUSTRALIA = "australia"
    GLOBAL = "global"

class Sector(str, Enum):
    """Business sectors"""
    ENERGY_RESOURCES = "energy_resources"
    BASIC_MATERIALS_CHEMICALS = "basic_materials_chemicals"
    MINING_METALS = "mining_metals"
    MANUFACTURING = "manufacturing"
    FOOD_BEVERAGES = "food_beverages"
    AGRICULTURE_LIVESTOCK = "agriculture_livestock"
    FISHING_MARINE = "fishing_marine"
    FINANCIAL_BANKING = "financial_banking"
    REAL_ESTATE_CONSTRUCTION = "real_estate_construction"
    TRADE_RETAIL = "trade_retail"
    TRANSPORT_LOGISTICS = "transport_logistics"
    TELECOMMUNICATIONS_IT = "telecommunications_it"
    AI_MACHINE_LEARNING = "ai_machine_learning"
    HEALTHCARE = "healthcare"
    EDUCATION_TRAINING = "education_training"
    TOURISM_HOSPITALITY = "tourism_hospitality"
    MEDIA_ENTERTAINMENT = "media_entertainment"
    PROFESSIONAL_SERVICES = "professional_services"
    PERSONAL_COMMUNITY_SERVICES = "personal_community_services"
    DEFENSE_SECURITY = "defense_security"
    SPACE_SATELLITES = "space_satellites"
    ENVIRONMENT_SUSTAINABILITY = "environment_sustainability"
    ROBOTICS_AUTOMATION = "robotics_automation"
    GOVERNMENT_PUBLIC = "government_public"
    NON_PROFIT_CHARITABLE = "non_profit_charitable"
    CREATIVE_ECONOMY = "creative_economy"
    EMERGING_FUTURE = "emerging_future"

class LegalEntity(str, Enum):
    """Legal entity types"""
    SIMPLIFIED_JOINT_STOCK = "simplified_joint_stock"
    PARTNERSHIP = "partnership"
    GENERAL_PARTNERSHIP = "general_partnership"
    SIMPLE_COMMANDITE = "simple_commandite"
    JOINT_VENTURE = "joint_venture"
    CAPITAL_COMPANIES = "capital_companies"
    PUBLIC_JOINT_STOCK = "public_joint_stock"
    PRIVATE_JOINT_STOCK = "private_joint_stock"
    LIMITED_LIABILITY = "limited_liability"
    SINGLE_PERSON = "single_person"
    SHARE_COMMANDITE = "share_commandite"
    INDIVIDUAL_ESTABLISHMENT = "individual_establishment"
    LLC = "llc"
    LP = "lp"
    LLP = "llp"
    HOLDING_COMPANY = "holding_company"
    SUBSIDIARY = "subsidiary"
    VENTURE_CAPITAL = "venture_capital"
    SPECIAL_PURPOSE_VEHICLE = "special_purpose_vehicle"
    CHARITABLE_ORGANIZATION = "charitable_organization"
    COOPERATIVE_SOCIETY = "cooperative_society"
    FOUNDATION = "foundation"
    ENDOWMENT = "endowment"
    PUBLIC_INSTITUTION = "public_institution"
    STATE_OWNED_ENTERPRISE = "state_owned_enterprise"
    INDEPENDENT_AUTHORITY = "independent_authority"
    EUROPEAN_COMPANY = "european_company"
    EUROPEAN_ECONOMIC_GROUP = "european_economic_group"
    MULTINATIONAL_COMPANY = "multinational_company"
    PROFESSIONAL_COMPANY = "professional_company"
    LEGAL_ENTITY_IDENTIFIER = "legal_entity_identifier"

class FinancialAnalysisCreate(BaseModel):
    """Financial analysis creation schema"""
    company_name: str
    sector: Sector
    activity: str
    legal_entity: LegalEntity
    analysis_years: int = 1
    comparison_level: ComparisonLevel = ComparisonLevel.LOCAL
    analysis_types: List[AnalysisType]
    analysis_level: AnalysisLevel = AnalysisLevel.BASIC
    
    @validator('analysis_years')
    def validate_analysis_years(cls, v):
        if v < 1 or v > 10:
            raise ValueError('Analysis years must be between 1 and 10')
        return v

class FinancialAnalysisResponse(BaseModel):
    """Financial analysis response schema"""
    id: int
    user_id: int
    company_name: str
    sector: Sector
    activity: str
    legal_entity: LegalEntity
    analysis_years: int
    comparison_level: ComparisonLevel
    analysis_type: AnalysisType
    analysis_level: AnalysisLevel
    status: str
    progress: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AnalysisResult(BaseModel):
    """Analysis result schema"""
    analysis_id: int
    analysis_type: AnalysisType
    results: Dict[str, Any]
    recommendations: List[str]
    risk_assessment: Dict[str, Any]
    swot_analysis: Dict[str, List[str]]
    charts_data: Dict[str, Any]
    created_at: datetime

class FileUpload(BaseModel):
    """File upload schema"""
    filename: str
    file_type: str
    file_size: int
    mime_type: str

class FileUploadResponse(BaseModel):
    """File upload response schema"""
    id: int
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    is_processed: bool
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class FinancialDataSchema(BaseModel):
    """Financial data schema"""
    analysis_id: int
    file_id: int
    data_type: str
    year: int
    period: str
    balance_sheet_data: Optional[Dict[str, Any]] = None
    income_statement_data: Optional[Dict[str, Any]] = None
    cash_flow_data: Optional[Dict[str, Any]] = None
    currency: str = "SAR"
    reporting_standard: str = "IFRS"
    created_at: datetime
    
    class Config:
        from_attributes = True
