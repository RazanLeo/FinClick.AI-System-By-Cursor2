import { FinancialStatement } from '@/lib/types';

export interface CleaningResult {
  data: any;
  issues: CleaningIssue[];
  warnings: string[];
  appliedFixes: string[];
}

export interface CleaningIssue {
  field: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  suggestedFix?: string;
}

export function cleanFinancialData(rawData: any): CleaningResult {
  const issues: CleaningIssue[] = [];
  const warnings: string[] = [];
  const appliedFixes: string[] = [];
  
  // Deep clone to avoid mutating original data
  const data = JSON.parse(JSON.stringify(rawData));
  
  // Clean balance sheet
  if (data.balanceSheet) {
    cleanBalanceSheet(data.balanceSheet, issues, warnings, appliedFixes);
  }
  
  // Clean income statement
  if (data.incomeStatement) {
    cleanIncomeStatement(data.incomeStatement, issues, warnings, appliedFixes);
  }
  
  // Clean cash flow statement
  if (data.cashFlowStatement) {
    cleanCashFlowStatement(data.cashFlowStatement, issues, warnings, appliedFixes);
  }
  
  // Validate inter-statement consistency
  validateInterStatementConsistency(data, issues, warnings);
  
  return {
    data,
    issues,
    warnings,
    appliedFixes
  };
}

function cleanBalanceSheet(
  balanceSheet: any,
  issues: CleaningIssue[],
  warnings: string[],
  appliedFixes: string[]
): void {
  // Ensure all required fields exist
  ensureBalanceSheetStructure(balanceSheet);
  
  // Calculate missing totals
  if (!balanceSheet.currentAssets.totalCurrentAssets) {
    const total = (balanceSheet.currentAssets.cash || 0) +
                  (balanceSheet.currentAssets.accountsReceivable || 0) +
                  (balanceSheet.currentAssets.inventory || 0) +
                  (balanceSheet.currentAssets.prepaidExpenses || 0) +
                  (balanceSheet.currentAssets.otherCurrentAssets || 0);
    
    balanceSheet.currentAssets.totalCurrentAssets = total;
    appliedFixes.push('Calculated total current assets');
  }
  
  if (!balanceSheet.totalAssets) {
    balanceSheet.totalAssets = (balanceSheet.currentAssets.totalCurrentAssets || 0) +
                               (balanceSheet.nonCurrentAssets.totalNonCurrentAssets || 0);
    appliedFixes.push('Calculated total assets');
  }
  
  // Validate balance sheet equation
  const assetTotal = balanceSheet.totalAssets || 0;
  const liabilityEquityTotal = (balanceSheet.totalLiabilities || 0) + 
                               (balanceSheet.shareholdersEquity.totalShareholdersEquity || 0);
  
  if (Math.abs(assetTotal - liabilityEquityTotal) > 0.01) {
    issues.push({
      field: 'balanceSheet',
      issue: `Balance sheet doesn't balance: Assets (${assetTotal}) ≠ Liabilities + Equity (${liabilityEquityTotal})`,
      severity: 'error',
      suggestedFix: 'Review all balance sheet entries for accuracy'
    });
  }
  
  // Check for negative values where they shouldn't be
  checkNegativeValues(balanceSheet, 'balanceSheet', issues);
  
  // Clean accumulated depreciation (should be negative or zero)
  if (balanceSheet.nonCurrentAssets.accumulatedDepreciation > 0) {
    balanceSheet.nonCurrentAssets.accumulatedDepreciation = 
      -Math.abs(balanceSheet.nonCurrentAssets.accumulatedDepreciation);
    appliedFixes.push('Corrected accumulated depreciation to negative value');
  }
}

function cleanIncomeStatement(
  incomeStatement: any,
  issues: CleaningIssue[],
  warnings: string[],
  appliedFixes: string[]
): void {
  // Calculate gross profit if missing
  if (!incomeStatement.grossProfit && incomeStatement.revenue && incomeStatement.costOfGoodsSold) {
    incomeStatement.grossProfit = incomeStatement.revenue - incomeStatement.costOfGoodsSold;
    appliedFixes.push('Calculated gross profit');
  }
  
  // Calculate operating income if missing
  if (!incomeStatement.operatingIncome && incomeStatement.grossProfit) {
    incomeStatement.operatingIncome = incomeStatement.grossProfit - 
      (incomeStatement.operatingExpenses?.totalOperatingExpenses || 0);
    appliedFixes.push('Calculated operating income');
  }
  
  // Validate profit margins
  if (incomeStatement.revenue > 0) {
    const grossMargin = incomeStatement.grossProfit / incomeStatement.revenue;
    const netMargin = incomeStatement.netIncome / incomeStatement.revenue;
    
    if (grossMargin < 0) {
      warnings.push('Negative gross margin detected');
    }
    
    if (grossMargin > 0.9) {
      warnings.push('Unusually high gross margin (>90%)');
    }
    
    if (netMargin > grossMargin) {
      issues.push({
        field: 'incomeStatement',
        issue: 'Net margin exceeds gross margin',
        severity: 'error',
        suggestedFix: 'Review income statement calculations'
      });
    }
  }
}

function cleanCashFlowStatement(
  cashFlow: any,
  issues: CleaningIssue[],
  warnings: string[],
  appliedFixes: string[]
): void {
  // Calculate net cash from operating if missing
  if (!cashFlow.operatingActivities.netCashFromOperating) {
    let operatingCash = cashFlow.operatingActivities.netIncome || 0;
    operatingCash += cashFlow.operatingActivities.depreciation || 0;
    operatingCash += cashFlow.operatingActivities.amortization || 0;
    
    // Add changes in working capital
    const wcChanges = cashFlow.operatingActivities.changeInWorkingCapital || {};
    operatingCash -= wcChanges.accountsReceivable || 0;
    operatingCash -= wcChanges.inventory || 0;
    operatingCash += wcChanges.accountsPayable || 0;
    
    cashFlow.operatingActivities.netCashFromOperating = operatingCash;
    appliedFixes.push('Calculated net cash from operating activities');
  }
  
  // Calculate net change in cash
  const netChange = (cashFlow.operatingActivities.netCashFromOperating || 0) +
                   (cashFlow.investingActivities.netCashFromInvesting || 0) +
                   (cashFlow.financingActivities.netCashFromFinancing || 0);
  
  if (!cashFlow.netChangeInCash) {
    cashFlow.netChangeInCash = netChange;
    appliedFixes.push('Calculated net change in cash');
  } else if (Math.abs(cashFlow.netChangeInCash - netChange) > 0.01) {
    issues.push({
      field: 'cashFlowStatement',
      issue: 'Net change in cash doesn\'t match sum of activities',
      severity: 'warning',
      suggestedFix: 'Verify cash flow calculations'
    });
  }
  
  // Validate cash ending balance
  if (cashFlow.cashBeginningPeriod && cashFlow.cashEndPeriod) {
    const expectedEnding = cashFlow.cashBeginningPeriod + cashFlow.netChangeInCash;
    if (Math.abs(expectedEnding - cashFlow.cashEndPeriod) > 0.01) {
      issues.push({
        field: 'cashFlowStatement.cashEndPeriod',
        issue: 'Cash ending balance doesn\'t match beginning + net change',
        severity: 'error'
      });
    }
  }
}

function validateInterStatementConsistency(
  data: any,
  issues: CleaningIssue[],
  warnings: string[]
): void {
  if (!data.balanceSheet || !data.incomeStatement || !data.cashFlowStatement) {
    return;
  }
  
  // Check if net income matches between statements
  const isNetIncome = data.incomeStatement.netIncome || 0;
  const cfNetIncome = data.cashFlowStatement.operatingActivities.netIncome || 0;
  
  if (Math.abs(isNetIncome - cfNetIncome) > 0.01) {
    issues.push({
      field: 'netIncome',
      issue: 'Net income mismatch between income statement and cash flow',
      severity: 'error',
      suggestedFix: 'Ensure net income is consistent across statements'
    });
  }
  
  // Check if cash matches between balance sheet and cash flow
  const bsCash = data.balanceSheet.currentAssets.cash || 0;
  const cfCashEnd = data.cashFlowStatement.cashEndPeriod || 0;
  
  if (cfCashEnd > 0 && Math.abs(bsCash - cfCashEnd) > 0.01) {
    issues.push({
      field: 'cash',
      issue: 'Cash balance mismatch between balance sheet and cash flow',
      severity: 'warning'
    });
  }
}

function ensureBalanceSheetStructure(balanceSheet: any): void {
  // Ensure all nested objects exist
  balanceSheet.currentAssets = balanceSheet.currentAssets || {};
  balanceSheet.nonCurrentAssets = balanceSheet.nonCurrentAssets || {};
  balanceSheet.currentLiabilities = balanceSheet.currentLiabilities || {};
  balanceSheet.nonCurrentLiabilities = balanceSheet.nonCurrentLiabilities || {};
  balanceSheet.shareholdersEquity = balanceSheet.shareholdersEquity || {};
  
  // Set defaults for common fields
  const defaults = {
    currentAssets: {
      cash: 0,
      accountsReceivable: 0,
      inventory: 0,
      totalCurrentAssets: 0
    },
    nonCurrentAssets: {
      propertyPlantEquipment: 0,
      accumulatedDepreciation: 0,
      netPPE: 0,
      totalNonCurrentAssets: 0
    },
    currentLiabilities: {
      accountsPayable: 0,
      totalCurrentLiabilities: 0
    },
    nonCurrentLiabilities: {
      longTermDebt: 0,
      totalNonCurrentLiabilities: 0
    },
    shareholdersEquity: {
      commonStock: 0,
      retainedEarnings: 0,
      totalShareholdersEquity: 0
    }
  };
  
  // Apply defaults
  Object.entries(defaults).forEach(([section, fields]) => {
    Object.entries(fields).forEach(([field, defaultValue]) => {
      if (balanceSheet[section][field] === undefined) {
        balanceSheet[section][field] = defaultValue;
      }
    });
  });
}

function checkNegativeValues(
  data: any,
  path: string,
  issues: CleaningIssue[]
): void {
  const nonNegativeFields = [
    'cash',
    'accountsReceivable',
    'inventory',
    'totalAssets',
    'revenue',
    'totalCurrentAssets',
    'totalNonCurrentAssets'
  ];
  
  const checkObject = (obj: any, currentPath: string) => {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldPath = `${currentPath}.${key}`;
      
      if (typeof value === 'number' && nonNegativeFields.includes(key) && value < 0) {
        issues.push({
          field: fieldPath,
          issue: `Negative value (${value}) for field that should be non-negative`,
          severity: 'warning',
          suggestedFix: 'Verify if this is correct or if it should be positive'
        });
      } else if (typeof value === 'object' && value !== null) {
        checkObject(value, fieldPath);
      }
    });
  };
  
  checkObject(data, path);
}

export function normalizeFinancialData(data: any[]): FinancialStatement[] {
  return data.map(item => {
    const year = extractYear(item);
    
    return {
      year,
      balanceSheet: normalizeBalanceSheet(item),
      incomeStatement: normalizeIncomeStatement(item),
      cashFlowStatement: normalizeCashFlowStatement(item)
    };
  });
}

function extractYear(data: any): number {
  // Try different possible year fields
  const yearFields = ['year', 'Year', 'period', 'Period', 'date', 'Date'];
  
  for (const field of yearFields) {
    if (data[field]) {
      const yearStr = data[field].toString();
      const yearMatch = yearStr.match(/\d{4}/);
      if (yearMatch) {
        return parseInt(yearMatch[0]);
      }
    }
  }
  
  // Default to current year if not found
  return new Date().getFullYear();
}

function normalizeBalanceSheet(data: any): any {
  // Map common variations of field names
  const fieldMappings = {
    // Assets
    'Cash': 'cash',
    'Cash and Cash Equivalents': 'cash',
    'Accounts Receivable': 'accountsReceivable',
    'Trade Receivables': 'accountsReceivable',
    'Inventory': 'inventory',
    'Inventories': 'inventory',
    'Total Current Assets': 'totalCurrentAssets',
    'Property, Plant and Equipment': 'propertyPlantEquipment',
    'PP&E': 'propertyPlantEquipment',
    'Total Assets': 'totalAssets',
    
    // Liabilities
    'Accounts Payable': 'accountsPayable',
    'Trade Payables': 'accountsPayable',
    'Total Current Liabilities': 'totalCurrentLiabilities',
    'Long-term Debt': 'longTermDebt',
    'Long Term Debt': 'longTermDebt',
    'Total Liabilities': 'totalLiabilities',
    
    // Equity
    'Common Stock': 'commonStock',
    'Share Capital': 'commonStock',
    'Retained Earnings': 'retainedEarnings',
    'Total Shareholders Equity': 'totalShareholdersEquity',
    'Total Equity': 'totalShareholdersEquity'
  };
  
  const normalized: any = {
    currentAssets: {},
    nonCurrentAssets: {},
    currentLiabilities: {},
    nonCurrentLiabilities: {},
    shareholdersEquity: {}
  };
  
  // Map fields to normalized structure
  Object.entries(data).forEach(([key, value]) => {
    const normalizedKey = fieldMappings[key] || key.toLowerCase().replace(/\s+/g, '');
    
    // Determine which section this belongs to
    if (['cash', 'accountsreceivable', 'inventory'].includes(normalizedKey)) {
      normalized.currentAssets[normalizedKey] = parseFloat(value) || 0;
    } else if (['propertylantequipment', 'ppe'].includes(normalizedKey)) {
      normalized.nonCurrentAssets[normalizedKey] = parseFloat(value) || 0;
    }
    // ... continue for other sections
  });
  
  return normalized;
}

function normalizeIncomeStatement(data: any): any {
  const fieldMappings = {
    'Revenue': 'revenue',
    'Sales': 'revenue',
    'Total Revenue': 'revenue',
    'Cost of Goods Sold': 'costOfGoodsSold',
    'COGS': 'costOfGoodsSold',
    'Cost of Sales': 'costOfGoodsSold',
    'Gross Profit': 'grossProfit',
    'Operating Income': 'operatingIncome',
    'EBIT': 'operatingIncome',
    'Net Income': 'netIncome',
    'Net Profit': 'netIncome'
  };
  
  const normalized: any = {};
  
  Object.entries(data).forEach(([key, value]) => {
    const normalizedKey = fieldMappings[key] || key.toLowerCase().replace(/\s+/g, '');
    normalized[normalizedKey] = parseFloat(value) || 0;
  });
  
  return normalized;
}

function normalizeCashFlowStatement(data: any): any {
  return {
    operatingActivities: {
      netIncome: parseFloat(data.netIncome || data['Net Income']) || 0,
      depreciation: parseFloat(data.depreciation || data['Depreciation']) || 0,
      changeInWorkingCapital: {},
      netCashFromOperating: parseFloat(data.operatingCashFlow || data['Operating Cash Flow']) || 0
    },
    investingActivities: {
      capitalExpenditures: parseFloat(data.capex || data['Capital Expenditures']) || 0,
      netCashFromInvesting: parseFloat(data.investingCashFlow || data['Investing Cash Flow']) || 0
    },
    financingActivities: {
      dividendsPaid: parseFloat(data.dividends || data['Dividends Paid']) || 0,
      netCashFromFinancing: parseFloat(data.financingCashFlow || data['Financing Cash Flow']) || 0
    },
    netChangeInCash: parseFloat(data.netChangeInCash || data['Net Change in Cash']) || 0,
    cashBeginningPeriod: parseFloat(data.cashBeginning || data['Beginning Cash']) || 0,
    cashEndPeriod: parseFloat(data.cashEnd || data['Ending Cash']) || 0
  };
}
