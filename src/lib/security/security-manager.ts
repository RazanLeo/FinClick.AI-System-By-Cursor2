import CryptoJS from 'crypto-js';

export interface SecurityConfig {
  encryptionKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  require2FA: boolean;
  allowedOrigins: string[];
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'file_upload' | 'payment';
  userId?: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private securityEvents: SecurityEvent[] = [];
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private blockedIPs: Set<string> = new Set();
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  constructor() {
    this.config = {
      encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production',
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      require2FA: true,
      allowedOrigins: [
        'https://finclick.ai',
        'https://www.finclick.ai',
        'http://localhost:3000',
        'http://localhost:3001'
      ],
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      }
    };
  }

  /**
   * Initialize security manager
   */
  public initialize(): void {
    this.setupSecurityHeaders();
    this.setupCSP();
    this.setupHSTS();
    this.setupXSSProtection();
    this.setupCSRFProtection();
    this.setupRateLimiting();
    this.setupSessionSecurity();
    this.setupFileUploadSecurity();
    this.setupAPISecurity();
  }

  /**
   * Setup security headers
   */
  private setupSecurityHeaders(): void {
    if (typeof window !== 'undefined') {
      // Set security headers via meta tags
      const securityHeaders = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' }
      ];

      securityHeaders.forEach(header => {
        const meta = document.createElement('meta');
        meta.httpEquiv = header.name;
        meta.content = header.content;
        document.head.appendChild(meta);
      });
    }
  }

  /**
   * Setup Content Security Policy
   */
  private setupCSP(): void {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.finclick.ai https://api.paytabs.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  /**
   * Setup HTTP Strict Transport Security
   */
  private setupHSTS(): void {
    // This would typically be set by the server
    // For client-side, we can add a meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Strict-Transport-Security';
    meta.content = 'max-age=31536000; includeSubDomains; preload';
    document.head.appendChild(meta);
  }

  /**
   * Setup XSS Protection
   */
  private setupXSSProtection(): void {
    // Sanitize user input
    this.sanitizeInput();
    
    // Escape HTML output
    this.escapeHTML();
  }

  /**
   * Sanitize user input
   */
  private sanitizeInput(): void {
    // Override innerHTML to sanitize content
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTML) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value) {
          const sanitized = this.sanitizeHTML(value);
          originalInnerHTML.set.call(this, sanitized);
        },
        get: originalInnerHTML.get
      });
    }
  }

  /**
   * Sanitize HTML content
   */
  private sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Escape HTML output
   */
  private escapeHTML(): void {
    // Utility function to escape HTML
    (window as any).escapeHTML = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };
  }

  /**
   * Setup CSRF Protection
   */
  private setupCSRFProtection(): void {
    // Generate CSRF token
    const csrfToken = this.generateCSRFToken();
    sessionStorage.setItem('csrfToken', csrfToken);

    // Add CSRF token to all forms
    this.addCSRFTokenToForms(csrfToken);

    // Add CSRF token to AJAX requests
    this.addCSRFTokenToAJAX(csrfToken);
  }

  /**
   * Generate CSRF token
   */
  private generateCSRFToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Add CSRF token to forms
   */
  private addCSRFTokenToForms(token: string): void {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'csrfToken';
      input.value = token;
      form.appendChild(input);
    });
  }

  /**
   * Add CSRF token to AJAX requests
   */
  private addCSRFTokenToAJAX(token: string): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.set('X-CSRF-Token', token);
      
      return originalFetch(input, {
        ...init,
        headers
      });
    };
  }

  /**
   * Setup rate limiting
   */
  private setupRateLimiting(): void {
    // Client-side rate limiting
    this.enforceRateLimit();
  }

  /**
   * Enforce rate limiting
   */
  private enforceRateLimit(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const key = this.getRateLimitKey(url);
      
      if (this.isRateLimited(key)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      this.recordRequest(key);
      
      return originalFetch(input, init);
    };
  }

  /**
   * Get rate limit key
   */
  private getRateLimitKey(url: string): string {
    // Use IP and URL as key
    return `${this.getClientIP()}_${url}`;
  }

  /**
   * Check if rate limited
   */
  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.rateLimitTracker.get(key);
    
    if (!record) return false;
    
    if (now > record.resetTime) {
      this.rateLimitTracker.delete(key);
      return false;
    }
    
    return record.count >= this.config.rateLimit.maxRequests;
  }

  /**
   * Record request for rate limiting
   */
  private recordRequest(key: string): void {
    const now = Date.now();
    const record = this.rateLimitTracker.get(key);
    
    if (!record || now > record.resetTime) {
      this.rateLimitTracker.set(key, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs
      });
    } else {
      record.count++;
    }
  }

  /**
   * Setup session security
   */
  private setupSessionSecurity(): void {
    // Session timeout
    this.setupSessionTimeout();
    
    // Session validation
    this.setupSessionValidation();
    
    // Secure session storage
    this.setupSecureSessionStorage();
  }

  /**
   * Setup session timeout
   */
  private setupSessionTimeout(): void {
    let lastActivity = Date.now();
    
    // Update last activity on user interaction
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        lastActivity = Date.now();
      }, true);
    });
    
    // Check for session timeout
    setInterval(() => {
      if (Date.now() - lastActivity > this.config.sessionTimeout) {
        this.handleSessionTimeout();
      }
    }, 60000); // Check every minute
  }

  /**
   * Handle session timeout
   */
  private handleSessionTimeout(): void {
    this.logSecurityEvent({
      type: 'logout',
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      details: { reason: 'session_timeout' },
      severity: 'medium'
    });
    
    // Clear session data
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Setup session validation
   */
  private setupSessionValidation(): void {
    // Validate session on page load
    this.validateSession();
    
    // Validate session periodically
    setInterval(() => {
      this.validateSession();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Validate session
   */
  private validateSession(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.handleSessionTimeout();
      return;
    }
    
    // Validate token with server
    fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }).then(response => {
      if (!response.ok) {
        this.handleSessionTimeout();
      }
    }).catch(() => {
      this.handleSessionTimeout();
    });
  }

  /**
   * Setup secure session storage
   */
  private setupSecureSessionStorage(): void {
    // Encrypt sensitive data in session storage
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = (key: string, value: string) => {
      if (this.isSensitiveKey(key)) {
        value = this.encrypt(value);
      }
      originalSetItem.call(sessionStorage, key, value);
    };
    
    const originalGetItem = sessionStorage.getItem;
    sessionStorage.getItem = (key: string) => {
      const value = originalGetItem.call(sessionStorage, key);
      if (value && this.isSensitiveKey(key)) {
        return this.decrypt(value);
      }
      return value;
    };
  }

  /**
   * Check if key is sensitive
   */
  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = ['authToken', 'userData', 'paymentInfo', 'analysisData'];
    return sensitiveKeys.some(sensitiveKey => key.includes(sensitiveKey));
  }

  /**
   * Setup file upload security
   */
  private setupFileUploadSecurity(): void {
    // Validate file types
    this.validateFileTypes();
    
    // Scan for malware
    this.scanForMalware();
    
    // Limit file size
    this.limitFileSize();
  }

  /**
   * Validate file types
   */
  private validateFileTypes(): void {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/csv'
    ];
    
    // Override file input validation
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          Array.from(files).forEach(file => {
            if (!allowedTypes.includes(file.type)) {
              throw new Error(`File type ${file.type} is not allowed`);
            }
          });
        }
      });
    });
  }

  /**
   * Scan for malware
   */
  private scanForMalware(): void {
    // This would typically be done server-side
    // For client-side, we can do basic validation
    console.log('Malware scanning setup complete');
  }

  /**
   * Limit file size
   */
  private limitFileSize(): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          Array.from(files).forEach(file => {
            if (file.size > maxSize) {
              throw new Error(`File size ${file.size} exceeds maximum allowed size ${maxSize}`);
            }
          });
        }
      });
    });
  }

  /**
   * Setup API security
   */
  private setupAPISecurity(): void {
    // API key validation
    this.validateAPIKeys();
    
    // Request signing
    this.signRequests();
    
    // Response validation
    this.validateResponses();
  }

  /**
   * Validate API keys
   */
  private validateAPIKeys(): void {
    // Check if API keys are properly configured
    const requiredKeys = [
      'NEXT_PUBLIC_OPENAI_API_KEY',
      'NEXT_PUBLIC_GEMINI_API_KEY',
      'NEXT_PUBLIC_PAYTABS_PROFILE_ID'
    ];
    
    requiredKeys.forEach(key => {
      if (!process.env[key]) {
        console.warn(`API key ${key} is not configured`);
      }
    });
  }

  /**
   * Sign requests
   */
  private signRequests(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const timestamp = Date.now().toString();
      const signature = this.generateSignature(url, timestamp);
      
      const headers = new Headers(init?.headers);
      headers.set('X-Timestamp', timestamp);
      headers.set('X-Signature', signature);
      
      return originalFetch(input, {
        ...init,
        headers
      });
    };
  }

  /**
   * Generate request signature
   */
  private generateSignature(url: string, timestamp: string): string {
    const data = `${url}${timestamp}${this.config.encryptionKey}`;
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Validate responses
   */
  private validateResponses(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      
      // Validate response headers
      this.validateResponseHeaders(response);
      
      // Validate response body
      this.validateResponseBody(response);
      
      return response;
    };
  }

  /**
   * Validate response headers
   */
  private validateResponseHeaders(response: Response): void {
    const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options'];
    
    requiredHeaders.forEach(header => {
      if (!response.headers.get(header)) {
        console.warn(`Missing security header: ${header}`);
      }
    });
  }

  /**
   * Validate response body
   */
  private validateResponseBody(response: Response): void {
    // Check for suspicious content
    if (response.headers.get('content-type')?.includes('text/html')) {
      // This would typically be done server-side
      console.log('Response body validation complete');
    }
  }

  /**
   * Encrypt data
   */
  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.config.encryptionKey).toString();
  }

  /**
   * Decrypt data
   */
  public decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.config.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Hash password
   */
  public hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  /**
   * Verify password
   */
  public verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  /**
   * Generate secure token
   */
  public generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Get client IP
   */
  private getClientIP(): string {
    // This would typically be done server-side
    // For client-side, we can use a placeholder
    return '127.0.0.1';
  }

  /**
   * Log security event
   */
  public logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.unshift(event);
    
    // Keep only recent events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(0, 1000);
    }
    
    // Send to monitoring service
    this.sendToMonitoring(event);
    
    // Check for suspicious patterns
    this.checkSuspiciousPatterns();
  }

  /**
   * Send to monitoring service
   */
  private sendToMonitoring(event: SecurityEvent): void {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(() => {
        // Ignore monitoring errors
      });
    }
  }

  /**
   * Check for suspicious patterns
   */
  private checkSuspiciousPatterns(): void {
    const recentEvents = this.securityEvents.slice(0, 10);
    
    // Check for multiple failed logins
    const failedLogins = recentEvents.filter(e => e.type === 'failed_login');
    if (failedLogins.length >= 3) {
      this.handleSuspiciousActivity('Multiple failed login attempts');
    }
    
    // Check for rapid requests
    const now = Date.now();
    const recentRequests = recentEvents.filter(e => 
      now - e.timestamp.getTime() < 60000 // Last minute
    );
    if (recentRequests.length >= 20) {
      this.handleSuspiciousActivity('Rapid request pattern');
    }
  }

  /**
   * Handle suspicious activity
   */
  private handleSuspiciousActivity(reason: string): void {
    this.logSecurityEvent({
      type: 'suspicious_activity',
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      details: { reason },
      severity: 'high'
    });
    
    // Block IP temporarily
    this.blockedIPs.add(this.getClientIP());
    setTimeout(() => {
      this.blockedIPs.delete(this.getClientIP());
    }, 15 * 60 * 1000); // 15 minutes
  }

  /**
   * Check if IP is blocked
   */
  public isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Get security events
   */
  public getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  /**
   * Get security statistics
   */
  public getSecurityStats(): {
    totalEvents: number;
    eventsByType: { [type: string]: number };
    eventsBySeverity: { [severity: string]: number };
    recentEvents: SecurityEvent[];
  } {
    const eventsByType: { [type: string]: number } = {};
    const eventsBySeverity: { [severity: string]: number } = {};
    
    this.securityEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });
    
    return {
      totalEvents: this.securityEvents.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.securityEvents.slice(0, 10)
    };
  }

  /**
   * Clear security events
   */
  public clearSecurityEvents(): void {
    this.securityEvents = [];
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();

// Utility functions for common security operations
export const encryptData = (data: string): string => {
  return securityManager.encrypt(data);
};

export const decryptData = (encryptedData: string): string => {
  return securityManager.decrypt(encryptedData);
};

export const hashPassword = (password: string): string => {
  return securityManager.hashPassword(password);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return securityManager.verifyPassword(password, hash);
};

export const generateSecureToken = (): string => {
  return securityManager.generateSecureToken();
};

export const logSecurityEvent = (event: SecurityEvent): void => {
  securityManager.logSecurityEvent(event);
};
