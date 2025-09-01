'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Minus,
  FileText,
  TrendingUp,
  DollarSign,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FinancialStatement } from '@/types';

interface ManualInputProps {
  onDataSubmit: (data: FinancialStatement[]) => void;
  language: 'ar' | 'en';
}

const ManualInput: React.FC<ManualInputProps> = ({ onDataSubmit, language }) => {
  const [statements, setStatements] = useState<FinancialStatement[]>([
    {
      year: new Date().getFullYear(),
      balanceSheet: {
        currentAssets: {
          cashAndCashEquivalents: 0,
          shortTermInvestments: 0,
          accountsReceivable: 0,
          inventory: 0,
          prepaidExpenses: 0,
          otherCurrentAssets: 0
        },
        nonCurrentAssets: {
          propertyPlantEquipment: 0,
          accumulatedDepreciation: 0,
          intangibleAssets: 0,
          goodwill: 0,
          longTermInvestments: 0,
          otherNonCurrentAssets: 0
        },
        currentLiabilities: {
          accountsPayable: 0,
          shortTermDebt: 0,
          accruedExpenses: 0,
          deferredRevenue: 0,
          otherCurrentLiabilities: 0
        },
        nonCurrentLiabilities: {
          longTermDebt: 0,
          deferredTaxLiabilities: 0,
          pensionLiabilities: 0,
          otherNonCurrentLiabilities: 0
        },
        equity: {
          commonStock: 0,
          additionalPaidInCapital: 0,
          retainedEarnings: 0,
          treasuryStock: 0,
          otherComprehensiveIncome: 0
        }
      },
      incomeStatement: {
        revenue: {
          salesRevenue: 0,
          serviceRevenue: 0,
          otherRevenue: 0
        },
        costOfGoodsSold: 0,
        grossProfit: 0,
        operatingExpenses: {
          sellingExpenses: 0,
          generalAndAdministrative: 0,
          researchAndDevelopment: 0,
          depreciationAndAmortization: 0
        },
        operatingIncome: 0,
        nonOperatingIncome: {
          interestIncome: 0,
          dividendIncome: 0,
          gainOnSaleOfAssets: 0,
          otherIncome: 0
        },
        nonOperatingExpenses: {
          interestExpense: 0,
          lossOnSaleOfAssets: 0,
          otherExpenses: 0
        },
        incomeBeforeTax: 0,
        incomeTaxExpense: 0,
        netIncome: 0
      },
      cashFlowStatement: {
        operatingActivities: {
          netIncome: 0,
          depreciationAndAmortization: 0,
          changesInWorkingCapital: {
            accountsReceivable: 0,
            inventory: 0,
            accountsPayable: 0,
            accruedExpenses: 0
          },
          otherOperatingCashFlows: 0
        },
        investingActivities: {
          capitalExpenditures: 0,
          acquisitions: 0,
          salesOfAssets: 0,
          purchasesOfInvestments: 0,
          salesOfInvestments: 0,
          otherInvestingCashFlows: 0
        },
        financingActivities: {
          issuanceOfDebt: 0,
          repaymentOfDebt: 0,
          issuanceOfEquity: 0,
          repurchaseOfEquity: 0,
          dividendsPaid: 0,
          otherFinancingCashFlows: 0
        }
      }
    }
  ]);

  const [activeTab, setActiveTab] = useState<'balance' | 'income' | 'cashflow'>('balance');
  const [activeYear, setActiveYear] = useState(0);

  const addYear = () => {
    const newYear = statements[0].year + 1;
    const newStatement: FinancialStatement = {
      year: newYear,
      balanceSheet: { ...statements[0].balanceSheet },
      incomeStatement: { ...statements[0].incomeStatement },
      cashFlowStatement: { ...statements[0].cashFlowStatement }
    };
    setStatements([newStatement, ...statements]);
    setActiveYear(0);
  };

  const removeYear = (index: number) => {
    if (statements.length > 1) {
      setStatements(statements.filter((_, i) => i !== index));
      if (activeYear >= index) {
        setActiveYear(Math.max(0, activeYear - 1));
      }
    }
  };

  const updateStatement = (path: string, value: number) => {
    const keys = path.split('.');
    setStatements(prev => prev.map((statement, index) => {
      if (index === activeYear) {
        const newStatement = { ...statement };
        let current: any = newStatement;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newStatement;
      }
      return statement;
    }));
  };

  const calculateTotals = (statement: FinancialStatement) => {
    // Balance Sheet totals
    const totalCurrentAssets = Object.values(statement.balanceSheet.currentAssets).reduce((a, b) => a + b, 0);
    const totalNonCurrentAssets = Object.values(statement.balanceSheet.nonCurrentAssets).reduce((a, b) => a + b, 0);
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
    
    const totalCurrentLiabilities = Object.values(statement.balanceSheet.currentLiabilities).reduce((a, b) => a + b, 0);
    const totalNonCurrentLiabilities = Object.values(statement.balanceSheet.nonCurrentLiabilities).reduce((a, b) => a + b, 0);
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
    
    const totalEquity = Object.values(statement.balanceSheet.equity).reduce((a, b) => a + b, 0);
    
    // Income Statement totals
    const totalRevenue = Object.values(statement.incomeStatement.revenue).reduce((a, b) => a + b, 0);
    const totalOperatingExpenses = Object.values(statement.incomeStatement.operatingExpenses).reduce((a, b) => a + b, 0);
    const totalNonOperatingIncome = Object.values(statement.incomeStatement.nonOperatingIncome).reduce((a, b) => a + b, 0);
    const totalNonOperatingExpenses = Object.values(statement.incomeStatement.nonOperatingExpenses).reduce((a, b) => a + b, 0);
    
    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalOperatingExpenses,
      totalNonOperatingIncome,
      totalNonOperatingExpenses
    };
  };

  const handleSubmit = () => {
    // Validate data
    const hasData = statements.some(statement => {
      const totals = calculateTotals(statement);
      return totals.totalAssets > 0 || totals.totalRevenue > 0;
    });

    if (!hasData) {
      toast.error(
        language === 'ar' 
          ? 'يرجى إدخال بيانات مالية على الأقل'
          : 'Please enter at least some financial data'
      );
      return;
    }

    onDataSubmit(statements);
    toast.success(
      language === 'ar' 
        ? 'تم حفظ البيانات المالية بنجاح'
        : 'Financial data saved successfully'
    );
  };

  const downloadTemplate = () => {
    const template = {
      balanceSheet: {
        currentAssets: {
          cashAndCashEquivalents: 0,
          shortTermInvestments: 0,
          accountsReceivable: 0,
          inventory: 0,
          prepaidExpenses: 0,
          otherCurrentAssets: 0
        },
        nonCurrentAssets: {
          propertyPlantEquipment: 0,
          accumulatedDepreciation: 0,
          intangibleAssets: 0,
          goodwill: 0,
          longTermInvestments: 0,
          otherNonCurrentAssets: 0
        },
        currentLiabilities: {
          accountsPayable: 0,
          shortTermDebt: 0,
          accruedExpenses: 0,
          deferredRevenue: 0,
          otherCurrentLiabilities: 0
        },
        nonCurrentLiabilities: {
          longTermDebt: 0,
          deferredTaxLiabilities: 0,
          pensionLiabilities: 0,
          otherNonCurrentLiabilities: 0
        },
        equity: {
          commonStock: 0,
          additionalPaidInCapital: 0,
          retainedEarnings: 0,
          treasuryStock: 0,
          otherComprehensiveIncome: 0
        }
      },
      incomeStatement: {
        revenue: {
          salesRevenue: 0,
          serviceRevenue: 0,
          otherRevenue: 0
        },
        costOfGoodsSold: 0,
        operatingExpenses: {
          sellingExpenses: 0,
          generalAndAdministrative: 0,
          researchAndDevelopment: 0,
          depreciationAndAmortization: 0
        },
        nonOperatingIncome: {
          interestIncome: 0,
          dividendIncome: 0,
          gainOnSaleOfAssets: 0,
          otherIncome: 0
        },
        nonOperatingExpenses: {
          interestExpense: 0,
          lossOnSaleOfAssets: 0,
          otherExpenses: 0
        },
        incomeTaxExpense: 0
      },
      cashFlowStatement: {
        operatingActivities: {
          depreciationAndAmortization: 0,
          changesInWorkingCapital: {
            accountsReceivable: 0,
            inventory: 0,
            accountsPayable: 0,
            accruedExpenses: 0
          },
          otherOperatingCashFlows: 0
        },
        investingActivities: {
          capitalExpenditures: 0,
          acquisitions: 0,
          salesOfAssets: 0,
          purchasesOfInvestments: 0,
          salesOfInvestments: 0,
          otherInvestingCashFlows: 0
        },
        financingActivities: {
          issuanceOfDebt: 0,
          repaymentOfDebt: 0,
          issuanceOfEquity: 0,
          repurchaseOfEquity: 0,
          dividendsPaid: 0,
          otherFinancingCashFlows: 0
        }
      }
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_template.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success(
      language === 'ar' 
        ? 'تم تحميل النموذج بنجاح'
        : 'Template downloaded successfully'
    );
  };

  const renderInputField = (label: string, path: string, value: number, prefix = '') => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-finclick-gold font-playfair">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finclick-gold/50">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => updateStatement(path, parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border border-finclick-gold/20 rounded-lg bg-finclick-gold/5 text-finclick-gold focus:outline-none focus:border-finclick-gold transition-colors ${prefix ? 'pl-8' : ''}`}
          placeholder="0"
        />
      </div>
    </div>
  );

  const currentStatement = statements[activeYear];
  const totals = calculateTotals(currentStatement);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-finclick-gold font-playfair">
          {language === 'ar' ? 'إدخال البيانات المالية' : 'Financial Data Entry'}
        </h2>
        <div className="flex gap-2">
          <motion.button
            onClick={downloadTemplate}
            className="btn flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'نموذج' : 'Template'}
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            className="btn btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save className="w-4 h-4" />
            {language === 'ar' ? 'حفظ' : 'Save'}
          </motion.button>
        </div>
      </div>

      {/* Year Selection */}
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-finclick-gold font-playfair">
          {language === 'ar' ? 'السنة المالية:' : 'Financial Year:'}
        </h3>
        <div className="flex gap-2">
          {statements.map((statement, index) => (
            <motion.button
              key={statement.year}
              onClick={() => setActiveYear(index)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                activeYear === index
                  ? 'bg-finclick-gold text-white border-finclick-gold'
                  : 'bg-finclick-gold/10 text-finclick-gold border-finclick-gold/20 hover:bg-finclick-gold/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {statement.year}
            </motion.button>
          ))}
          <motion.button
            onClick={addYear}
            className="p-2 text-finclick-gold hover:text-finclick-gold-light transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          {statements.length > 1 && (
            <motion.button
              onClick={() => removeYear(activeYear)}
              className="p-2 text-finclick-error hover:text-finclick-error/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-finclick-gold/20">
        {[
          { key: 'balance', label: language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet', icon: Building },
          { key: 'income', label: language === 'ar' ? 'قائمة الدخل' : 'Income Statement', icon: TrendingUp },
          { key: 'cashflow', label: language === 'ar' ? 'قائمة التدفقات النقدية' : 'Cash Flow', icon: DollarSign }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
              activeTab === key
                ? 'border-finclick-gold text-finclick-gold'
                : 'border-transparent text-finclick-gold/50 hover:text-finclick-gold'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'balance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assets */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'الأصول' : 'Assets'}
                </h4>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الأصول المتداولة' : 'Current Assets'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'النقد وما يعادله' : 'Cash & Cash Equivalents',
                    'balanceSheet.currentAssets.cashAndCashEquivalents',
                    currentStatement.balanceSheet.currentAssets.cashAndCashEquivalents,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'الاستثمارات قصيرة الأجل' : 'Short-term Investments',
                    'balanceSheet.currentAssets.shortTermInvestments',
                    currentStatement.balanceSheet.currentAssets.shortTermInvestments,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'الذمم المدينة' : 'Accounts Receivable',
                    'balanceSheet.currentAssets.accountsReceivable',
                    currentStatement.balanceSheet.currentAssets.accountsReceivable,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'المخزون' : 'Inventory',
                    'balanceSheet.currentAssets.inventory',
                    currentStatement.balanceSheet.currentAssets.inventory,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الأصول غير المتداولة' : 'Non-Current Assets'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'الأصول الثابتة' : 'Property, Plant & Equipment',
                    'balanceSheet.nonCurrentAssets.propertyPlantEquipment',
                    currentStatement.balanceSheet.nonCurrentAssets.propertyPlantEquipment,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'الأصول غير الملموسة' : 'Intangible Assets',
                    'balanceSheet.nonCurrentAssets.intangibleAssets',
                    currentStatement.balanceSheet.nonCurrentAssets.intangibleAssets,
                    '$'
                  )}
                </div>
              </div>

              {/* Liabilities & Equity */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-finclick-gold font-playfair">
                  {language === 'ar' ? 'الخصوم وحقوق الملكية' : 'Liabilities & Equity'}
                </h4>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الخصوم المتداولة' : 'Current Liabilities'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'الذمم الدائنة' : 'Accounts Payable',
                    'balanceSheet.currentLiabilities.accountsPayable',
                    currentStatement.balanceSheet.currentLiabilities.accountsPayable,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'الديون قصيرة الأجل' : 'Short-term Debt',
                    'balanceSheet.currentLiabilities.shortTermDebt',
                    currentStatement.balanceSheet.currentLiabilities.shortTermDebt,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الخصوم غير المتداولة' : 'Non-Current Liabilities'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'الديون طويلة الأجل' : 'Long-term Debt',
                    'balanceSheet.nonCurrentLiabilities.longTermDebt',
                    currentStatement.balanceSheet.nonCurrentLiabilities.longTermDebt,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'حقوق الملكية' : 'Equity'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'رأس المال' : 'Common Stock',
                    'balanceSheet.equity.commonStock',
                    currentStatement.balanceSheet.equity.commonStock,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'الأرباح المحتجزة' : 'Retained Earnings',
                    'balanceSheet.equity.retainedEarnings',
                    currentStatement.balanceSheet.equity.retainedEarnings,
                    '$'
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-finclick-gold font-playfair">
                {language === 'ar' ? 'قائمة الدخل' : 'Income Statement'}
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'إيرادات المبيعات' : 'Sales Revenue',
                    'incomeStatement.revenue.salesRevenue',
                    currentStatement.incomeStatement.revenue.salesRevenue,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'إيرادات الخدمات' : 'Service Revenue',
                    'incomeStatement.revenue.serviceRevenue',
                    currentStatement.incomeStatement.revenue.serviceRevenue,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'المصروفات' : 'Expenses'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'تكلفة البضائع المباعة' : 'Cost of Goods Sold',
                    'incomeStatement.costOfGoodsSold',
                    currentStatement.incomeStatement.costOfGoodsSold,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'مصروفات البيع' : 'Selling Expenses',
                    'incomeStatement.operatingExpenses.sellingExpenses',
                    currentStatement.incomeStatement.operatingExpenses.sellingExpenses,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'المصروفات الإدارية' : 'General & Administrative',
                    'incomeStatement.operatingExpenses.generalAndAdministrative',
                    currentStatement.incomeStatement.operatingExpenses.generalAndAdministrative,
                    '$'
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-finclick-gold font-playfair">
                {language === 'ar' ? 'قائمة التدفقات النقدية' : 'Cash Flow Statement'}
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الأنشطة التشغيلية' : 'Operating Activities'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'الاستهلاك والإطفاء' : 'Depreciation & Amortization',
                    'cashFlowStatement.operatingActivities.depreciationAndAmortization',
                    currentStatement.cashFlowStatement.operatingActivities.depreciationAndAmortization,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الأنشطة الاستثمارية' : 'Investing Activities'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'الإنفاق الرأسمالي' : 'Capital Expenditures',
                    'cashFlowStatement.investingActivities.capitalExpenditures',
                    currentStatement.cashFlowStatement.investingActivities.capitalExpenditures,
                    '$'
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-finclick-gold/80 font-playfair">
                    {language === 'ar' ? 'الأنشطة التمويلية' : 'Financing Activities'}
                  </h5>
                  {renderInputField(
                    language === 'ar' ? 'إصدار الديون' : 'Issuance of Debt',
                    'cashFlowStatement.financingActivities.issuanceOfDebt',
                    currentStatement.cashFlowStatement.financingActivities.issuanceOfDebt,
                    '$'
                  )}
                  {renderInputField(
                    language === 'ar' ? 'سداد الديون' : 'Repayment of Debt',
                    'cashFlowStatement.financingActivities.repaymentOfDebt',
                    currentStatement.cashFlowStatement.financingActivities.repaymentOfDebt,
                    '$'
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 bg-finclick-gold/5 border border-finclick-gold/20 rounded-lg"
      >
        <h4 className="text-lg font-semibold mb-4 text-finclick-gold font-playfair">
          {language === 'ar' ? 'ملخص البيانات' : 'Data Summary'}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-finclick-gold/70 font-playfair">
              {language === 'ar' ? 'إجمالي الأصول' : 'Total Assets'}
            </p>
            <p className="text-lg font-semibold text-finclick-gold font-playfair">
              ${totals.totalAssets.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-finclick-gold/70 font-playfair">
              {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </p>
            <p className="text-lg font-semibold text-finclick-gold font-playfair">
              ${totals.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-finclick-gold/70 font-playfair">
              {language === 'ar' ? 'إجمالي الخصوم' : 'Total Liabilities'}
            </p>
            <p className="text-lg font-semibold text-finclick-gold font-playfair">
              ${totals.totalLiabilities.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-finclick-gold/70 font-playfair">
              {language === 'ar' ? 'حقوق الملكية' : 'Equity'}
            </p>
            <p className="text-lg font-semibold text-finclick-gold font-playfair">
              ${totals.totalEquity.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManualInput;
