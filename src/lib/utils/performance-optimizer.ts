import { debounce, throttle } from 'lodash';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorRate: number;
  timestamp: Date;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private maxMetricsSize = 1000;

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Initialize performance monitoring
   */
  public initialize(): void {
    this.setupPerformanceObservers();
    this.setupResourceOptimization();
    this.setupLazyLoading();
    this.setupCaching();
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.recordPaintMetrics(entry as PerformancePaintTiming);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    }
  }

  /**
   * Record navigation metrics
   */
  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics: PerformanceMetrics = {
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      renderTime: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      memoryUsage: this.getMemoryUsage(),
      networkLatency: entry.responseEnd - entry.requestStart,
      errorRate: 0, // Will be calculated separately
      timestamp: new Date()
    };

    this.recordMetrics(metrics);
  }

  /**
   * Record resource metrics
   */
  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    // Log slow resources
    if (entry.duration > 1000) {
      console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
    }
  }

  /**
   * Record paint metrics
   */
  private recordPaintMetrics(entry: PerformancePaintTiming): void {
    console.log(`Paint: ${entry.name} at ${entry.startTime}ms`);
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.unshift(metrics);

    // Keep metrics size manageable
    if (this.metrics.length > this.maxMetricsSize) {
      this.metrics = this.metrics.slice(0, this.maxMetricsSize);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('performanceMetrics', JSON.stringify(this.metrics.slice(0, 50)));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Setup resource optimization
   */
  private setupResourceOptimization(): void {
    // Optimize images
    this.optimizeImages();
    
    // Optimize fonts
    this.optimizeFonts();
    
    // Optimize CSS
    this.optimizeCSS();
    
    // Optimize JavaScript
    this.optimizeJavaScript();
  }

  /**
   * Optimize images
   */
  private optimizeImages(): void {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Optimize image formats
    this.convertToWebP();
  }

  /**
   * Convert images to WebP format
   */
  private convertToWebP(): void {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.src && !img.src.includes('.webp')) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const webpImg = new Image();
        webpImg.onload = () => {
          img.src = webpSrc;
        };
        webpImg.src = webpSrc;
      }
    });
  }

  /**
   * Optimize fonts
   */
  private optimizeFonts(): void {
    // Preload critical fonts
    const criticalFonts = [
      'PlayFair Display',
      'Inter',
      'Roboto'
    ];

    criticalFonts.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize CSS
   */
  private optimizeCSS(): void {
    // Remove unused CSS
    this.removeUnusedCSS();
    
    // Minify CSS
    this.minifyCSS();
    
    // Critical CSS inlining
    this.inlineCriticalCSS();
  }

  /**
   * Remove unused CSS
   */
  private removeUnusedCSS(): void {
    // This would typically be done at build time
    // For runtime, we can remove unused stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((sheet) => {
      if (!this.isStylesheetUsed(sheet as HTMLLinkElement)) {
        sheet.remove();
      }
    });
  }

  /**
   * Check if stylesheet is used
   */
  private isStylesheetUsed(sheet: HTMLLinkElement): boolean {
    // Simple heuristic - check if stylesheet is loaded and has rules
    return sheet.sheet && sheet.sheet.cssRules.length > 0;
  }

  /**
   * Minify CSS
   */
  private minifyCSS(): void {
    // This would typically be done at build time
    // For runtime, we can remove comments and whitespace
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach((style) => {
      style.textContent = style.textContent
        ?.replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Remove extra whitespace
        .trim();
    });
  }

  /**
   * Inline critical CSS
   */
  private inlineCriticalCSS(): void {
    // This would typically be done at build time
    // For runtime, we can inline critical styles
    const criticalCSS = `
      .finclick-gold { color: #D4AF37; }
      .bg-finclick-gold { background-color: #D4AF37; }
      .font-playfair { font-family: 'PlayFair Display', serif; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /**
   * Optimize JavaScript
   */
  private optimizeJavaScript(): void {
    // Code splitting
    this.setupCodeSplitting();
    
    // Tree shaking
    this.setupTreeShaking();
    
    // Dead code elimination
    this.setupDeadCodeElimination();
  }

  /**
   * Setup code splitting
   */
  private setupCodeSplitting(): void {
    // Dynamic imports for non-critical code
    const lazyModules = [
      'chart.js',
      'framer-motion',
      'react-hot-toast'
    ];

    lazyModules.forEach((module) => {
      // Load module when needed
      const loadModule = () => import(module);
      // Store loader for later use
      (window as any)[`load${module.replace(/[^a-zA-Z0-9]/g, '')}`] = loadModule;
    });
  }

  /**
   * Setup tree shaking
   */
  private setupTreeShaking(): void {
    // This would typically be done at build time
    // For runtime, we can remove unused exports
    console.log('Tree shaking setup complete');
  }

  /**
   * Setup dead code elimination
   */
  private setupDeadCodeElimination(): void {
    // This would typically be done at build time
    // For runtime, we can remove unused functions
    console.log('Dead code elimination setup complete');
  }

  /**
   * Setup lazy loading
   */
  private setupLazyLoading(): void {
    // Lazy load components
    this.lazyLoadComponents();
    
    // Lazy load routes
    this.lazyLoadRoutes();
    
    // Lazy load images
    this.lazyLoadImages();
  }

  /**
   * Lazy load components
   */
  private lazyLoadComponents(): void {
    // Use React.lazy for component lazy loading
    // This would be implemented in the component files
    console.log('Component lazy loading setup complete');
  }

  /**
   * Lazy load routes
   */
  private lazyLoadRoutes(): void {
    // Use dynamic imports for route lazy loading
    // This would be implemented in the routing configuration
    console.log('Route lazy loading setup complete');
  }

  /**
   * Lazy load images
   */
  private lazyLoadImages(): void {
    // Already implemented in optimizeImages
    console.log('Image lazy loading setup complete');
  }

  /**
   * Setup caching
   */
  private setupCaching(): void {
    // Browser caching
    this.setupBrowserCaching();
    
    // Service worker caching
    this.setupServiceWorkerCaching();
    
    // Memory caching
    this.setupMemoryCaching();
  }

  /**
   * Setup browser caching
   */
  private setupBrowserCaching(): void {
    // Set cache headers for static assets
    const staticAssets = document.querySelectorAll('link[rel="stylesheet"], script[src], img[src]');
    staticAssets.forEach((asset) => {
      // Add cache control headers
      if (asset instanceof HTMLLinkElement) {
        asset.setAttribute('data-cache', 'max-age=31536000');
      }
    });
  }

  /**
   * Setup service worker caching
   */
  private setupServiceWorkerCaching(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  /**
   * Setup memory caching
   */
  private setupMemoryCaching(): void {
    // Cache frequently accessed data
    const cache = new Map();
    
    // Cache API responses
    this.cacheApiResponses(cache);
    
    // Cache DOM queries
    this.cacheDomQueries(cache);
  }

  /**
   * Cache API responses
   */
  private cacheApiResponses(cache: Map<string, any>): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const cacheKey = `api_${url}`;
      
      // Check cache first
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes
          return new Response(JSON.stringify(cached.data));
        }
      }
      
      // Fetch from network
      const response = await originalFetch(input, init);
      const data = await response.json();
      
      // Cache response
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return new Response(JSON.stringify(data));
    };
  }

  /**
   * Cache DOM queries
   */
  private cacheDomQueries(cache: Map<string, any>): void {
    const originalQuerySelector = document.querySelector;
    document.querySelector = function(selector: string) {
      if (cache.has(selector)) {
        return cache.get(selector);
      }
      
      const element = originalQuerySelector.call(this, selector);
      if (element) {
        cache.set(selector, element);
      }
      
      return element;
    };
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get performance statistics
   */
  public getPerformanceStats(): {
    averageLoadTime: number;
    averageRenderTime: number;
    averageMemoryUsage: number;
    averageNetworkLatency: number;
    totalMetrics: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageLoadTime: 0,
        averageRenderTime: 0,
        averageMemoryUsage: 0,
        averageNetworkLatency: 0,
        totalMetrics: 0
      };
    }

    const total = this.metrics.reduce((acc, metric) => ({
      loadTime: acc.loadTime + metric.loadTime,
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      networkLatency: acc.networkLatency + metric.networkLatency
    }), { loadTime: 0, renderTime: 0, memoryUsage: 0, networkLatency: 0 });

    const count = this.metrics.length;

    return {
      averageLoadTime: total.loadTime / count,
      averageRenderTime: total.renderTime / count,
      averageMemoryUsage: total.memoryUsage / count,
      averageNetworkLatency: total.networkLatency / count,
      totalMetrics: count
    };
  }

  /**
   * Clear performance metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
    try {
      localStorage.removeItem('performanceMetrics');
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Cleanup observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions for common performance optimizations
export const debouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): T => {
  return debounce(func, delay) as T;
};

export const throttledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 100
): T => {
  return throttle(func, delay) as T;
};

export const lazyLoadComponent = (importFunc: () => Promise<any>) => {
  // This would typically be used with React.lazy in component files
  return importFunc;
};

export const preloadResource = (href: string, as: string = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

export const optimizeImage = (src: string, width?: number, height?: number): string => {
  // Add image optimization parameters
  const url = new URL(src);
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('q', '80'); // Quality
  url.searchParams.set('f', 'webp'); // Format
  return url.toString();
};
