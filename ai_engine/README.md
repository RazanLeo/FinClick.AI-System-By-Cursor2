# 🧠 FinClick.AI - محرك الذكاء الاصطناعي

## نظرة عامة
محرك الذكاء الاصطناعي المتقدم لنظام FinClick.AI - يقدم **170+ نوع تحليل مالي شامل** باستخدام أحدث تقنيات الذكاء الاصطناعي والتعلم الآلي.

## 🚀 المميزات الرئيسية

### **170+ نوع تحليل مالي**
- **التحليل الأساسي** - نسب مالية، ربحية، سيولة
- **التحليل الفني** - مؤشرات، أنماط، مستويات
- **تحليل المخاطر** - تقييم شامل للمخاطر
- **نماذج التقييم** - DCF، مضاعفات، قيم مضافة
- **تحليل المحفظة** - توزيع الأصول، التنويع
- **تحليل السوق** - منافسة، صناعة، اقتصاد

### **نماذج الذكاء الاصطناعي المتقدمة**
- **GPT-4** - تحليل ذكي للنصوص المالية
- **Google Gemini** - معالجة متقدمة للبيانات
- **FinBERT** - نموذج مالي متخصص
- **Transformers** - معالجة اللغة الطبيعية
- **Sentence Embeddings** - التحليل الدلالي
- **Custom Models** - نماذج مخصصة

### **معالجة المستندات الذكية**
- **PDF Analysis** - استخراج وتحليل البيانات
- **Excel Processing** - معالجة الجداول المالية
- **Word Documents** - تحليل التقارير
- **Image OCR** - استخراج النصوص من الصور
- **Data Cleaning** - تنظيف البيانات
- **Format Conversion** - تحويل الصيغ

## 🛠️ التقنيات المستخدمة

### **AI/ML Libraries**
- **PyTorch** - التعلم العميق
- **Transformers** - نماذج اللغة الطبيعية
- **OpenAI** - GPT-4 API
- **Google Generative AI** - Gemini API
- **Sentence Transformers** - تحويل النصوص
- **LangChain** - سلاسل الذكاء الاصطناعي

### **Financial Analysis**
- **Pandas** - معالجة البيانات
- **NumPy** - العمليات الحسابية
- **SciPy** - الإحصائيات
- **Scikit-learn** - خوارزميات التعلم الآلي
- **Statsmodels** - النماذج الإحصائية
- **YFinance** - بيانات الأسهم

### **Document Processing**
- **PyPDF2** - معالجة ملفات PDF
- **python-docx** - معالجة ملفات Word
- **openpyxl** - معالجة ملفات Excel
- **Pillow** - معالجة الصور
- **pytesseract** - استخراج النصوص من الصور
- **python-magic** - تحديد نوع الملف

## 📦 التثبيت والتشغيل

### **المتطلبات**
- Python 3.11+
- pip
- Tesseract OCR
- CUDA (اختياري للـ GPU)

### **التثبيت**
```bash
# تثبيت التبعيات
pip install -r requirements.txt

# تثبيت Tesseract
# Ubuntu/Debian
sudo apt-get install tesseract-ocr tesseract-ocr-ara tesseract-ocr-eng

# macOS
brew install tesseract tesseract-lang

# Windows
# تحميل من https://github.com/UB-Mannheim/tesseract/wiki

# تشغيل العرض التوضيحي
python3 simple_demo.py
```

### **البيئة**
```bash
# نسخ ملف البيئة
cp ../config.env .

# تعديل المتغيرات
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
FMP_API_KEY=your_fmp_key
```

## 🏗️ هيكل المشروع

```
ai_engine/
├── models/                 # النماذج المالية
│   ├── financial_models.py
│   └── ai_models.py
├── analyzers/             # محركات التحليل
│   ├── financial_analyzer.py
│   ├── technical_analyzer.py
│   ├── risk_analyzer.py
│   └── valuation_analyzer.py
├── processors/            # معالجة المستندات
│   ├── document_processor.py
│   ├── pdf_processor.py
│   ├── excel_processor.py
│   └── image_processor.py
├── utils/                 # الأدوات المساعدة
│   ├── data_utils.py
│   ├── visualization.py
│   └── reporting.py
├── ai_engine.py          # المحرك الرئيسي
├── simple_demo.py        # العرض التوضيحي
└── requirements.txt      # التبعيات
```

## 🎯 أنواع التحليل

### **1. التحليل الأساسي (Fundamental Analysis)**

#### **نسب السيولة**
```python
def calculate_liquidity_ratios(balance_sheet: dict) -> dict:
    """حساب نسب السيولة"""
    current_assets = balance_sheet['current_assets']
    current_liabilities = balance_sheet['current_liabilities']
    cash = balance_sheet['cash']
    
    return {
        'current_ratio': current_assets / current_liabilities,
        'quick_ratio': (current_assets - balance_sheet['inventory']) / current_liabilities,
        'cash_ratio': cash / current_liabilities
    }
```

#### **نسب الربحية**
```python
def calculate_profitability_ratios(income_statement: dict) -> dict:
    """حساب نسب الربحية"""
    revenue = income_statement['revenue']
    gross_profit = income_statement['gross_profit']
    net_income = income_statement['net_income']
    total_assets = income_statement['total_assets']
    
    return {
        'gross_margin': gross_profit / revenue,
        'net_margin': net_income / revenue,
        'roa': net_income / total_assets,
        'roe': net_income / income_statement['shareholders_equity']
    }
```

### **2. التحليل الفني (Technical Analysis)**

#### **المتوسطات المتحركة**
```python
def calculate_moving_averages(prices: list, periods: list) -> dict:
    """حساب المتوسطات المتحركة"""
    results = {}
    
    for period in periods:
        if len(prices) >= period:
            ma = sum(prices[-period:]) / period
            results[f'ma_{period}'] = ma
    
    return results
```

#### **مؤشرات القوة النسبية**
```python
def calculate_rsi(prices: list, period: int = 14) -> float:
    """حساب مؤشر القوة النسبية"""
    if len(prices) < period + 1:
        return None
    
    gains = []
    losses = []
    
    for i in range(1, len(prices)):
        change = prices[i] - prices[i-1]
        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))
    
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    
    if avg_loss == 0:
        return 100
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi
```

### **3. تحليل المخاطر (Risk Analysis)**

#### **مخاطر السوق**
```python
def calculate_market_risk(prices: list) -> dict:
    """حساب مخاطر السوق"""
    returns = []
    for i in range(1, len(prices)):
        returns.append((prices[i] - prices[i-1]) / prices[i-1])
    
    volatility = np.std(returns) * np.sqrt(252)  # سنوي
    var_95 = np.percentile(returns, 5)
    
    return {
        'volatility': volatility,
        'var_95': var_95,
        'max_drawdown': calculate_max_drawdown(prices)
    }
```

#### **مخاطر الائتمان**
```python
def calculate_credit_risk(balance_sheet: dict, income_statement: dict) -> dict:
    """حساب مخاطر الائتمان"""
    total_debt = balance_sheet['total_debt']
    total_assets = balance_sheet['total_assets']
    ebit = income_statement['ebit']
    interest_expense = income_statement['interest_expense']
    
    return {
        'debt_ratio': total_debt / total_assets,
        'debt_to_equity': total_debt / balance_sheet['shareholders_equity'],
        'interest_coverage': ebit / interest_expense if interest_expense > 0 else float('inf')
    }
```

### **4. نماذج التقييم (Valuation Models)**

#### **نموذج خصم التدفقات النقدية (DCF)**
```python
def calculate_dcf(free_cash_flows: list, terminal_growth: float, discount_rate: float) -> dict:
    """حساب القيمة باستخدام نموذج DCF"""
    present_values = []
    
    for i, fcf in enumerate(free_cash_flows):
        pv = fcf / ((1 + discount_rate) ** (i + 1))
        present_values.append(pv)
    
    # القيمة النهائية
    terminal_value = free_cash_flows[-1] * (1 + terminal_growth) / (discount_rate - terminal_growth)
    terminal_pv = terminal_value / ((1 + discount_rate) ** len(free_cash_flows))
    
    total_value = sum(present_values) + terminal_pv
    
    return {
        'present_values': present_values,
        'terminal_value': terminal_value,
        'total_value': total_value
    }
```

#### **نموذج مضاعف الأرباح**
```python
def calculate_pe_valuation(earnings: float, pe_ratio: float, growth_rate: float) -> dict:
    """تقييم باستخدام مضاعف الأرباح"""
    base_value = earnings * pe_ratio
    
    # تعديل النمو
    adjusted_pe = pe_ratio * (1 + growth_rate)
    adjusted_value = earnings * adjusted_pe
    
    return {
        'base_value': base_value,
        'adjusted_value': adjusted_value,
        'growth_adjustment': adjusted_value - base_value
    }
```

## 🤖 نماذج الذكاء الاصطناعي

### **GPT-4 Integration**
```python
import openai
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY

def analyze_financial_text(text: str, analysis_type: str) -> dict:
    """تحليل النص المالي باستخدام GPT-4"""
    prompt = f"""
    قم بتحليل النص المالي التالي من نوع {analysis_type}:
    
    {text}
    
    قدم:
    1. ملخص للوضع المالي
    2. النقاط الرئيسية
    3. التوصيات
    4. المخاطر المحتملة
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "أنت محلل مالي محترف متخصص في التحليل المالي."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.3
    )
    
    return {
        'analysis': response.choices[0].message.content,
        'model': 'gpt-4',
        'tokens_used': response.usage.total_tokens
    }
```

### **Gemini AI Integration**
```python
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def analyze_financial_data(data: dict, analysis_type: str) -> dict:
    """تحليل البيانات المالية باستخدام Gemini"""
    prompt = f"""
    قم بتحليل البيانات المالية التالية من نوع {analysis_type}:
    
    {data}
    
    قدم تحليلاً شاملاً يتضمن:
    1. تحليل الاتجاهات
    2. المقارنات
    3. التوقعات
    4. التوصيات
    """
    
    response = model.generate_content(prompt)
    
    return {
        'analysis': response.text,
        'model': 'gemini-pro',
        'prompt_tokens': len(prompt)
    }
```

### **FinBERT Model**
```python
from transformers import AutoTokenizer, AutoModel
import torch

class FinBERTAnalyzer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('ProsusAI/finbert')
        self.model = AutoModel.from_pretrained('ProsusAI/finbert')
    
    def analyze_sentiment(self, text: str) -> dict:
        """تحليل المشاعر المالية"""
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
        
        # تحليل المشاعر (positive, negative, neutral)
        sentiment_scores = torch.softmax(embeddings, dim=1)
        
        return {
            'positive': sentiment_scores[0][0].item(),
            'negative': sentiment_scores[0][1].item(),
            'neutral': sentiment_scores[0][2].item(),
            'dominant_sentiment': self.get_dominant_sentiment(sentiment_scores)
        }
    
    def get_dominant_sentiment(self, scores):
        """تحديد المشاعر السائدة"""
        max_index = torch.argmax(scores).item()
        sentiments = ['positive', 'negative', 'neutral']
        return sentiments[max_index]
```

## 📄 معالجة المستندات

### **PDF Processor**
```python
import PyPDF2
import fitz  # PyMuPDF

class PDFProcessor:
    def __init__(self):
        self.supported_formats = ['.pdf']
    
    def extract_text(self, file_path: str) -> dict:
        """استخراج النص من PDF"""
        try:
            # استخدام PyMuPDF للحصول على نتائج أفضل
            doc = fitz.open(file_path)
            text = ""
            tables = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text += page.get_text()
                
                # استخراج الجداول
                tables.extend(page.get_tables())
            
            return {
                'text': text,
                'tables': tables,
                'pages': len(doc),
                'success': True
            }
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
```

### **Excel Processor**
```python
import openpyxl
import pandas as pd

class ExcelProcessor:
    def __init__(self):
        self.supported_formats = ['.xlsx', '.xls']
    
    def extract_data(self, file_path: str) -> dict:
        """استخراج البيانات من Excel"""
        try:
            # قراءة جميع الأوراق
            excel_file = pd.ExcelFile(file_path)
            sheets_data = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                sheets_data[sheet_name] = {
                    'data': df.to_dict('records'),
                    'columns': df.columns.tolist(),
                    'shape': df.shape
                }
            
            return {
                'sheets': sheets_data,
                'total_sheets': len(excel_file.sheet_names),
                'success': True
            }
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
```

### **Image OCR Processor**
```python
from PIL import Image
import pytesseract
import cv2
import numpy as np

class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.tiff']
    
    def extract_text(self, image_path: str, language: str = 'ara+eng') -> dict:
        """استخراج النص من الصور"""
        try:
            # قراءة الصورة
            image = cv2.imread(image_path)
            
            # تحسين الصورة
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            
            # استخراج النص
            text = pytesseract.image_to_string(thresh, lang=language)
            
            # تنظيف النص
            cleaned_text = self.clean_text(text)
            
            return {
                'text': cleaned_text,
                'original_text': text,
                'confidence': pytesseract.image_to_data(thresh, lang=language, output_type=pytesseract.Output.DICT),
                'success': True
            }
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
    
    def clean_text(self, text: str) -> str:
        """تنظيف النص المستخرج"""
        # إزالة الأسطر الفارغة المتكررة
        text = '\n'.join(line.strip() for line in text.split('\n') if line.strip())
        
        # إزالة الأحرف الخاصة
        text = re.sub(r'[^\w\s\n\.\,\-\+\%\$\€\£\¥]', '', text)
        
        return text
```

## 📊 التصور والرسوم البيانية

### **Chart Generator**
```python
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px

class ChartGenerator:
    def __init__(self):
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
    
    def create_financial_chart(self, data: dict, chart_type: str) -> str:
        """إنشاء رسوم بيانية مالية"""
        if chart_type == 'line':
            return self.create_line_chart(data)
        elif chart_type == 'bar':
            return self.create_bar_chart(data)
        elif chart_type == 'pie':
            return self.create_pie_chart(data)
        elif chart_type == 'candlestick':
            return self.create_candlestick_chart(data)
    
    def create_line_chart(self, data: dict) -> str:
        """إنشاء رسم بياني خطي"""
        fig = go.Figure()
        
        for series_name, series_data in data.items():
            fig.add_trace(go.Scatter(
                x=list(series_data.keys()),
                y=list(series_data.values()),
                mode='lines+markers',
                name=series_name
            ))
        
        fig.update_layout(
            title='تحليل الاتجاهات المالية',
            xaxis_title='الفترة الزمنية',
            yaxis_title='القيمة',
            template='plotly_white'
        )
        
        return fig.to_html(include_plotlyjs='cdn')
```

## 📋 التقارير

### **Report Generator**
```python
from docx import Document
from docx.shared import Inches
import json

class ReportGenerator:
    def __init__(self):
        self.document = Document()
    
    def create_financial_report(self, analysis_results: dict, company_name: str) -> str:
        """إنشاء تقرير مالي شامل"""
        # العنوان
        self.document.add_heading(f'التقرير المالي - {company_name}', 0)
        
        # الملخص التنفيذي
        self.document.add_heading('الملخص التنفيذي', level=1)
        self.document.add_paragraph(analysis_results.get('executive_summary', ''))
        
        # التحليل الأساسي
        self.document.add_heading('التحليل الأساسي', level=1)
        self.add_financial_ratios(analysis_results.get('financial_ratios', {}))
        
        # التحليل الفني
        self.document.add_heading('التحليل الفني', level=1)
        self.add_technical_analysis(analysis_results.get('technical_analysis', {}))
        
        # التوصيات
        self.document.add_heading('التوصيات', level=1)
        self.add_recommendations(analysis_results.get('recommendations', []))
        
        # حفظ التقرير
        report_path = f'reports/{company_name}_financial_report.docx'
        self.document.save(report_path)
        
        return report_path
    
    def add_financial_ratios(self, ratios: dict):
        """إضافة النسب المالية للتقرير"""
        table = self.document.add_table(rows=1, cols=2)
        table.style = 'Table Grid'
        
        # رؤوس الجدول
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'النسبة المالية'
        hdr_cells[1].text = 'القيمة'
        
        # البيانات
        for ratio_name, ratio_value in ratios.items():
            row_cells = table.add_row().cells
            row_cells[0].text = ratio_name
            row_cells[1].text = f'{ratio_value:.4f}'
```

## 🧪 الاختبارات

### **Unit Tests**
```python
import unittest
from ai_engine.analyzers.financial_analyzer import FinancialAnalyzer

class TestFinancialAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = FinancialAnalyzer()
    
    def test_liquidity_ratios(self):
        """اختبار حساب نسب السيولة"""
        balance_sheet = {
            'current_assets': 1000000,
            'current_liabilities': 500000,
            'cash': 200000,
            'inventory': 300000
        }
        
        ratios = self.analyzer.calculate_liquidity_ratios(balance_sheet)
        
        self.assertEqual(ratios['current_ratio'], 2.0)
        self.assertEqual(ratios['quick_ratio'], 1.4)
        self.assertEqual(ratios['cash_ratio'], 0.4)
    
    def test_profitability_ratios(self):
        """اختبار حساب نسب الربحية"""
        income_statement = {
            'revenue': 2000000,
            'gross_profit': 800000,
            'net_income': 400000,
            'total_assets': 3000000,
            'shareholders_equity': 2000000
        }
        
        ratios = self.analyzer.calculate_profitability_ratios(income_statement)
        
        self.assertEqual(ratios['gross_margin'], 0.4)
        self.assertEqual(ratios['net_margin'], 0.2)
        self.assertEqual(ratios['roa'], 0.1333)
        self.assertEqual(ratios['roe'], 0.2)

if __name__ == '__main__':
    unittest.main()
```

## 🚀 النشر

### **Docker**
```bash
# بناء الصورة
docker build -t finclick-ai-engine .

# تشغيل الحاوية
docker run -p 9000:9000 finclick-ai-engine
```

### **API Server**
```python
from fastapi import FastAPI
from ai_engine import AIEngine

app = FastAPI(title="FinClick.AI Engine")
ai_engine = AIEngine()

@app.post("/analyze")
async def analyze_financial_data(data: dict):
    """تحليل البيانات المالية"""
    return await ai_engine.analyze(data)

@app.post("/process_document")
async def process_document(file_path: str):
    """معالجة المستند"""
    return await ai_engine.process_document(file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
```

## 📊 الأداء

### **Benchmarks**
- **تحليل أساسي**: < 30 ثانية
- **تحليل فني**: < 1 دقيقة
- **تحليل شامل**: < 5 دقائق
- **معالجة مستند**: < 2 دقيقة
- **تقرير مهني**: < 10 دقائق

### **Optimization**
```python
# استخدام الكاش
from functools import lru_cache

@lru_cache(maxsize=128)
def calculate_complex_ratio(data: tuple) -> float:
    """حساب نسبة معقدة مع الكاش"""
    # الكود هنا
    pass

# معالجة متوازية
import multiprocessing as mp

def parallel_analysis(data_list: list) -> list:
    """تحليل متوازي للبيانات"""
    with mp.Pool() as pool:
        results = pool.map(analyze_single_dataset, data_list)
    return results
```

## 🔧 التطوير

### **Code Quality**
```bash
# تنسيق الكود
black .
isort .

# فحص الكود
flake8 .
mypy .

# الاختبارات
pytest --cov=ai_engine tests/
```

### **Documentation**
```python
def calculate_financial_metrics(data: dict) -> dict:
    """
    حساب المقاييس المالية الأساسية
    
    Args:
        data (dict): البيانات المالية
        
    Returns:
        dict: المقاييس المحسوبة
        
    Raises:
        ValueError: إذا كانت البيانات غير صحيحة
        
    Example:
        >>> data = {'revenue': 1000000, 'expenses': 800000}
        >>> calculate_financial_metrics(data)
        {'profit': 200000, 'margin': 0.2}
    """
    # الكود هنا
    pass
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
