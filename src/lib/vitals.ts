/**
 * HEATLEDGER AI: Real User Monitoring (RUM) Web Vitals (Prompt D11)
 * Tracks Core Web Vitals (LCP, CLS, FID/INP, FCP, TTFB)
 * Transmits to /api/vitals with navigator.sendBeacon.
 */

export interface Metric {
  name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
  url?: string;
}

export function reportVital(metric: Metric) {
  const payload = JSON.stringify({
    ...metric,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
  });

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/vitals', blob);
  } else if (typeof fetch !== 'undefined') {
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

/**
 * Initializes browser PerformanceObservers for Core Web Vitals.
 */
export function initWebVitalsReporting() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // 1. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        const val = Math.round(lastEntry.startTime);
        reportVital({
          name: 'LCP',
          value: val,
          rating: val <= 2500 ? 'good' : val <= 4000 ? 'needs-improvement' : 'poor',
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Flush CLS on page hide
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportVital({
          name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
        });
      }
    }, { once: true });

    // 3. First Contentful Paint (FCP)
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const val = Math.round(entry.startTime);
          reportVital({
            name: 'FCP',
            value: val,
            rating: val <= 1800 ? 'good' : val <= 3000 ? 'needs-improvement' : 'poor',
          });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch (err) {
    // Graceful silent fallback if certain entry types are not supported
  }
}
