/**
 * OpenSEO Core Web Vitals SDK
 * Real User Monitoring (RUM) collection script
 * 
 * Usage:
 * 1. Host this script on your server
 * 2. Add to your website: <script src="/web-vitals-sdk.js" data-endpoint="/api/collect"></script>
 * 3. Or initialize manually: OpenSeoWebVitals.init({ endpoint: '/api/collect' })
 */

(function() {
  'use strict';

  const OpenSeoWebVitals = {
    endpoint: null,
    debug: false,

    init: function(options) {
      options = options || {};
      this.endpoint = options.endpoint || document.currentScript?.dataset?.endpoint || '/api/collect';
      this.debug = options.debug || false;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.collect());
      } else {
        this.collect();
      }
    },

    collect: function() {
      // Collect LCP
      this.observeLCP();

      // Collect FID
      this.observeFID();

      // Collect CLS
      this.observeCLS();

      // Collect INP
      this.observeINP();

      // Send on page visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.sendMetrics();
        }
      });

      // Send on unload
      window.addEventListener('beforeunload', () => this.sendMetrics());
    },

    observeLCP: function() {
      if (!('PerformanceObserver' in window)) return;

      let lcpEntry = null;

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        lcpEntry = entries[entries.length - 1];
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        this.log('LCP observation not supported');
      }

      // Also check navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navEntries = performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            const ttfb = navEntries[0].responseStart;
            this.metrics = this.metrics || {};
            this.metrics.TTFB = ttfb;
          }
        }, 0);
      });
    },

    observeFID: function() {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0];
          this.metrics = this.metrics || {};
          this.metrics.FID = firstInput.processingStart - firstInput.startTime;
        }
      });

      try {
        observer.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        this.log('FID observation not supported');
      }
    },

    observeCLS: function() {
      if (!('PerformanceObserver' in window)) return;

      let clsValue = 0;
      let clsEntries = [];

      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
          }
        }
      });

      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        this.log('CLS observation not supported');
      }

      // Store clsValue for sending
      this._clsTimeout = setTimeout(() => {
        this.metrics = this.metrics || {};
        this.metrics.CLS = clsValue;
      }, 1000);
    },

    observeINP: function() {
      if (!('PerformanceObserver' in window)) return;

      let maxINP = 0;

      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.interactionId) {
            const inp = entry.duration;
            if (inp > maxINP) {
              maxINP = inp;
            }
          }
        }
      });

      try {
        observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      } catch (e) {
        this.log('INP observation not supported');
      }

      // Report INP on interaction end
      document.addEventListener('click', () => this.reportINP(maxINP), { once: true });
      document.addEventListener('keydown', () => this.reportINP(maxINP), { once: true });
    },

    reportINP: function(maxINP) {
      setTimeout(() => {
        this.metrics = this.metrics || {};
        if (maxINP > 0) {
          this.metrics.INP = maxINP;
        }
      }, 100);
    },

    sendMetrics: function() {
      if (!this.endpoint) return;

      const metrics = {
        LCP: this.metrics?.LCP,
        FID: this.metrics?.FID,
        CLS: this.metrics?.CLS,
        INP: this.metrics?.INP,
        TTFB: this.metrics?.TTFB,
      };

      // Get page info
      const data = {
        page: window.location.pathname,
        url: window.location.href,
        metrics: metrics,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      // Send to endpoint
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, JSON.stringify(data));
      } else {
        fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(() => {});
      }

      this.log('Metrics sent:', data);
    },

    log: function(...args) {
      if (this.debug) {
        console.log('[OpenSeoWebVitals]', ...args);
      }
    },
  };

  // Auto-initialize if data-autoinit is set
  if (document.currentScript?.dataset?.autoinit !== 'false') {
    OpenSeoWebVitals.init();
  }

  // Expose globally
  window.OpenSeoWebVitals = OpenSeoWebVitals;
})();
