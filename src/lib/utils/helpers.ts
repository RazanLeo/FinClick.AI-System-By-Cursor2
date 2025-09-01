// Utility Helper Functions

export function formatCurrency(
  amount: number, 
  currency: string = 'SAR',
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(
  num: number,
  locale: string = 'ar-SA',
  decimals: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string,
  locale: string = 'ar-SA',
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

export function calculateGrowthRate(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  numberOfPeriods: number
): number {
  if (beginningValue <= 0 || endingValue <= 0 || numberOfPeriods <= 0) {
    return 0;
  }
  return (Math.pow(endingValue / beginningValue, 1 / numberOfPeriods) - 1) * 100;
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const mean = calculateAverage(numbers);
  const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
  const variance = calculateAverage(squaredDifferences);
  
  return Math.sqrt(variance);
}

export function getRatingFromScore(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'veryGood';
  if (score >= 60) return 'good';
  if (score >= 40) return 'acceptable';
  return 'weak';
}

export function getScoreFromRatio(
  ratio: number,
  benchmarks: { excellent: number; good: number; acceptable: number; weak: number },
  isHigherBetter: boolean = true
): number {
  if (isHigherBetter) {
    if (ratio >= benchmarks.excellent) return 95;
    if (ratio >= benchmarks.good) return 80;
    if (ratio >= benchmarks.acceptable) return 60;
    if (ratio >= benchmarks.weak) return 40;
    return 20;
  } else {
    if (ratio <= benchmarks.excellent) return 95;
    if (ratio <= benchmarks.good) return 80;
    if (ratio <= benchmarks.acceptable) return 60;
    if (ratio <= benchmarks.weak) return 40;
    return 20;
  }
}

export function abbreviateNumber(
  num: number,
  locale: string = 'ar-SA'
): string {
  const absNum = Math.abs(num);
  
  if (absNum >= 1e12) {
    return formatNumber(num / 1e12, locale, 1) + (locale === 'ar-SA' ? ' ت' : 'T');
  }
  if (absNum >= 1e9) {
    return formatNumber(num / 1e9, locale, 1) + (locale === 'ar-SA' ? ' مليار' : 'B');
  }
  if (absNum >= 1e6) {
    return formatNumber(num / 1e6, locale, 1) + (locale === 'ar-SA' ? ' مليون' : 'M');
  }
  if (absNum >= 1e3) {
    return formatNumber(num / 1e3, locale, 1) + (locale === 'ar-SA' ? ' ألف' : 'K');
  }
  
  return formatNumber(num, locale, 0);
}

export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#D4AF37', // Gold
    '#E5C558', // Light Gold
    '#B8981F', // Dark Gold
    '#2E7D32', // Green
    '#0288D1', // Blue
    '#ED6C02', // Orange
    '#D32F2F', // Red
    '#7B1FA2', // Purple
    '#455A64', // Grey
    '#00796B', // Teal
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function downloadFile(
  content: Blob | string,
  filename: string,
  mimeType?: string
): void {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type: mimeType || 'text/plain' });
    
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseFinancialValue(value: string | number): number {
  if (typeof value === 'number') return value;
  
  // Remove currency symbols, spaces, and commas
  const cleanValue = value
    .replace(/[^\d.-]/g, '')
    .replace(/,/g, '');
    
  return parseFloat(cleanValue) || 0;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sortByKey<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 10;
}

export function getYearRange(startYear: number, endYear: number): number[] {
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    if (isValidYear(year)) {
      years.push(year);
    }
  }
  return years;
}

export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number | null {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : null;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

export function isFinancialFileValid(file: File): boolean {
  const validExtensions = ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'csv'];
  const extension = getFileExtension(file.name);
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  return validExtensions.includes(extension) && file.size <= maxSize;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}
