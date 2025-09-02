import { toast } from 'react-hot-toast';

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];
  private maxLogSize = 1000;

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log errors
   */
  public handleError(error: Error | any, context?: string): void {
    const errorInfo: ErrorInfo = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: this.getErrorDetails(error),
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log error
    this.logError(errorInfo);

    // Show user-friendly message
    this.showUserMessage(errorInfo, context);

    // Send to monitoring service (if configured)
    this.sendToMonitoring(errorInfo);
  }

  /**
   * Handle API errors specifically
   */
  public handleApiError(response: Response, context?: string): void {
    const error = new Error(`API Error: ${response.status} ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    this.handleError(error, context);
  }

  /**
   * Handle validation errors
   */
  public handleValidationError(errors: any[], context?: string): void {
    const error = new Error('Validation Error');
    (error as any).validationErrors = errors;
    this.handleError(error, context);
  }

  /**
   * Handle network errors
   */
  public handleNetworkError(error: any, context?: string): void {
    const networkError = new Error('Network Error');
    (networkError as any).originalError = error;
    (networkError as any).isNetworkError = true;
    this.handleError(networkError, context);
  }

  /**
   * Get error code
   */
  private getErrorCode(error: any): string {
    if (error.code) return error.code;
    if (error.status) return `HTTP_${error.status}`;
    if (error.name) return error.name;
    return 'UNKNOWN_ERROR';
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    // API errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return 'طلب غير صحيح. يرجى التحقق من البيانات المدخلة.';
        case 401:
          return 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.';
        case 403:
          return 'غير مسموح لك بتنفيذ هذا الإجراء.';
        case 404:
          return 'المورد المطلوب غير موجود.';
        case 429:
          return 'تم تجاوز حد الطلبات المسموح. يرجى المحاولة لاحقاً.';
        case 500:
          return 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
        case 502:
          return 'خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.';
        case 503:
          return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
        default:
          return 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.';
      }
    }

    // Network errors
    if (error.isNetworkError || error.message?.includes('Network')) {
      return 'خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك.';
    }

    // Validation errors
    if (error.validationErrors) {
      return 'يرجى التحقق من صحة البيانات المدخلة.';
    }

    // File upload errors
    if (error.message?.includes('file') || error.message?.includes('upload')) {
      return 'خطأ في رفع الملف. يرجى التحقق من نوع وحجم الملف.';
    }

    // Payment errors
    if (error.message?.includes('payment') || error.message?.includes('PayTabs')) {
      return 'خطأ في معالجة الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى.';
    }

    // Analysis errors
    if (error.message?.includes('analysis') || error.message?.includes('تحليل')) {
      return 'خطأ في معالجة التحليل المالي. يرجى التحقق من البيانات المدخلة.';
    }

    // Default message
    return error.message || 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.';
  }

  /**
   * Get error details for logging
   */
  private getErrorDetails(error: any): any {
    return {
      name: error.name,
      stack: error.stack,
      status: error.status,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : undefined,
      validationErrors: error.validationErrors,
      originalError: error.originalError,
      isNetworkError: error.isNetworkError
    };
  }

  /**
   * Log error to console and internal log
   */
  private logError(errorInfo: ErrorInfo): void {
    // Console log for development
    console.error('Error Handler:', errorInfo);

    // Add to internal log
    this.errorLog.unshift(errorInfo);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('errorLog', JSON.stringify(this.errorLog.slice(0, 50)));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Show user-friendly error message
   */
  private showUserMessage(errorInfo: ErrorInfo, context?: string): void {
    const message = context 
      ? `${context}: ${errorInfo.message}`
      : errorInfo.message;

    // Use toast notification
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'PlayFair Display, serif'
      }
    });
  }

  /**
   * Send error to monitoring service
   */
  private sendToMonitoring(errorInfo: ErrorInfo): void {
    // Only send in production
    if (process.env.NODE_ENV !== 'production') return;

    // Send to external monitoring service (e.g., Sentry, LogRocket, etc.)
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo)
      }).catch(() => {
        // Ignore monitoring errors
      });
    } catch (e) {
      // Ignore monitoring errors
    }
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | undefined {
    try {
      // Get from auth context or localStorage
      return localStorage.getItem('userId') || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Get session ID
   */
  private getSessionId(): string | undefined {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch {
      return undefined;
    }
  }

  /**
   * Get error log
   */
  public getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
    try {
      localStorage.removeItem('errorLog');
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    totalErrors: number;
    errorsByCode: { [code: string]: number };
    recentErrors: ErrorInfo[];
  } {
    const errorsByCode: { [code: string]: number } = {};
    
    this.errorLog.forEach(error => {
      errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      errorsByCode,
      recentErrors: this.errorLog.slice(0, 10)
    };
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.handleError(event.error, 'Global Error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handleError(event.reason, 'Unhandled Promise Rejection');
  });
}

// Utility functions for common error scenarios
export const handleApiError = (error: any, context?: string) => {
  errorHandler.handleError(error, context);
};

export const handleNetworkError = (error: any, context?: string) => {
  errorHandler.handleNetworkError(error, context);
};

export const handleValidationError = (errors: any[], context?: string) => {
  errorHandler.handleValidationError(errors, context);
};

export const handleFileUploadError = (error: any, context?: string) => {
  errorHandler.handleError(error, context || 'File Upload');
};

export const handlePaymentError = (error: any, context?: string) => {
  errorHandler.handleError(error, context || 'Payment Processing');
};

export const handleAnalysisError = (error: any, context?: string) => {
  errorHandler.handleError(error, context || 'Financial Analysis');
};
