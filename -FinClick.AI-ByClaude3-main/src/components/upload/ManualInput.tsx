'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { FinancialStatement } from '@/lib/types';
import toast from 'react-hot-toast';

interface ManualInputProps {
  onSubmit: (data: FinancialStatement[]) => void;
}

export default function ManualInput({ onSubmit }: ManualInputProps) {
  const [years, setYears] = useState<number[]>([new Date().getFullYear() - 1]);
  const [financialData, setFinancialData] = useState<{[year: number]: Partial<FinancialStatement>}>({});

  const addYear = () => {
    if (years.length < 10) {
      const newYear = Math.min(...years) - 1;
      setYears([...years, newYear].sort((a, b) => a - b));
    }
  };

  const removeYear = (year: number) => {
    setYears(years.filter(y => y !== year));
    const newData = { ...financialData };
    delete newData[year];
    setFinancialData(newData);
  };

  const updateFinancialData = (year: number, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setFinancialData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        year,
        [field]: numValue
      }
    }));
  };

  const handleSubmit = () => {
    const completeData: FinancialStatement[] = [];
    
    for (const year of years) {
      const yearData = financialData[year];
      if (!yearData) continue;
      
      // Create complete financial statement with default structure
      const statement: FinancialStatement = {
        year,
        balanceSheet: {
          currentAssets: {
            cash: yearData['cash'] || 0,
            accountsReceivable: yearData['accountsReceivable'] || 0,
            inventory: yearData['inventory'] || 0,
            totalCurrentAssets: yearData['totalCurrentAssets'] || 0,
          },
          nonCurrentAssets: {
            propertyPlantEquipment: yearData['propertyPlantEquipment'] || 0,
            netPPE: yearData['netPPE'] || 0,
            totalNonCurrentAssets: yearData['totalNonCurrentAssets'] || 0,
          },
          totalAssets: yearData['totalAssets'] || 0,
          currentLiabilities: {
            accountsPayable: yearData['accountsPayable'] || 0,
            totalCurrentLiabilities: yearData['totalCurrentLiabilities'] || 0,
          },
          nonCurrentLiabilities: {
            longTermDebt: yearData['longTermDebt'] || 0,
            totalNonCurrentLiabilities: yearData['totalNonCurrentLiabilities'] || 0,
          },
          totalLiabilities: yearData['totalLiabilities'] || 0,
          shareholdersEquity: {
            commonStock: yearData['commonStock'] || 0,
            retainedEarnings: yearData['retainedEarnings'] || 0,
            totalShareholdersEquity: yearData['totalShareholdersEquity'] || 0,
          },
          totalLiabilitiesAndEquity: yearData['totalLiabilitiesAndEquity'] || 0,
        },
        incomeStatement: {
          revenue: yearData['revenue'] || 0,
          costOfGoodsSold: yearData['costOfGoodsSold'] || 0,
          grossProfit: yearData['grossProfit'] || 0,
          operatingExpenses: {
            sellingGeneralAdmin: yearData['sellingGeneralAdmin'] || 0,
            totalOperatingExpenses: yearData['totalOperatingExpenses'] || 0,
          },
          operatingIncome: yearData['operatingIncome'] || 0,
          incomeBeforeTax: yearData['incomeBeforeTax'] || 0,
          incomeTaxExpense: yearData['incomeTaxExpense'] || 0,
          netIncome: yearData['netIncome'] || 0,
        },
        cashFlowStatement: {
          operatingActivities: {
            netIncome: yearData['cfNetIncome'] || 0,
            depreciation: yearData['depreciation'] || 0,
            changeInWorkingCapital: {
              accountsReceivable: yearData['cfAccountsReceivable'] || 0,
              inventory: yearData['cfInventory'] || 0,
              accountsPayable: yearData['cfAccountsPayable'] || 0,
            },
            netCashFromOperating: yearData['netCashFromOperating'] || 0,
          },
          investingActivities: {
            capitalExpenditures: yearData['capitalExpenditures'] || 0,
            netCashFromInvesting: yearData['netCashFromInvesting'] || 0,
          },
          financingActivities: {
            dividendsPaid: yearData['dividendsPaid'] || 0,
            netCashFromFinancing: yearData['netCashFromFinancing'] || 0,
          },
          netChangeInCash: yearData['netChangeInCash'] || 0,
          cashBeginningPeriod: yearData['cashBeginningPeriod'] || 0,
          cashEndPeriod: yearData['cashEndPeriod'] || 0,
        }
      };
      
      completeData.push(statement);
    }
    
    if (completeData.length > 0) {
      onSubmit(completeData);
      toast.success('تم حفظ البيانات المالية بنجاح');
    } else {
      toast.error('يرجى إدخال بيانات مالية واحدة على الأقل');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-finclick-gold">
          إدخال القوائم المالية يدوياً
        </h3>
        <button
          onClick={addYear}
          className="btn btn-sm flex items-center gap-2"
          disabled={years.length >= 10}
        >
          <Plus className="w-4 h-4" />
          إضافة سنة
        </button>
      </div>

      {/* Years Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {years.map(year => (
          <div
            key={year}
            className="flex items-center gap-2 px-4 py-2 bg-finclick-gold/10 rounded-lg border border-finclick-gold/20 min-w-fit"
          >
            <span className="font-medium">{year}</span>
            {years.length > 1 && (
              <button
                onClick={() => removeYear(year)}
                className="p-1 hover:bg-finclick-gold/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-finclick-gold/60" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Financial Data Forms */}
      <div className="space-y-8">
        {years.map(year => (
          <div key={year} className="card p-6">
            <h4 className="text-lg font-semibold mb-4 text-finclick-gold">
              البيانات المالية لسنة {year}
            </h4>
            
            {/* Balance Sheet */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 text-finclick-gold/80">قائمة المركز المالي</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">النقد وما في حكمه</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'cash', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">حسابات المدينون</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'accountsReceivable', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">المخزون</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'inventory', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">إجمالي الأصول المتداولة</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'totalCurrentAssets', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الممتلكات والمعدات</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'propertyPlantEquipment', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">إجمالي الأصول</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'totalAssets', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">حسابات الدائنون</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'accountsPayable', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">القروض طويلة الأجل</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'longTermDebt', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">حقوق الملكية</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'totalShareholdersEquity', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Income Statement */}
            <div className="mb-6">
              <h5 className="font-medium mb-3 text-finclick-gold/80">قائمة الدخل</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">الإيرادات</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'revenue', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">تكلفة البضاعة المباعة</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'costOfGoodsSold', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">إجمالي الربح</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'grossProfit', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">المصاريف التشغيلية</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'totalOperatingExpenses', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">صافي الدخل</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'netIncome', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Cash Flow Statement */}
            <div>
              <h5 className="font-medium mb-3 text-finclick-gold/80">قائمة التدفقات النقدية</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">التدفقات من الأنشطة التشغيلية</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'netCashFromOperating', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">التدفقات من الأنشطة الاستثمارية</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'netCashFromInvesting', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">التدفقات من الأنشطة التمويلية</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={(e) => updateFinancialData(year, 'netCashFromFinancing', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          حفظ البيانات
        </button>
      </div>
    </div>
  );
}
