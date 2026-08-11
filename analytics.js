/* Visuals by Joshua - deferred analytics loader.
 *
 * Single source of truth for GA4 (G-37865BSRR9) and Microsoft Clarity
 * (w0ul55zsim) across every page. Referenced as:
 *
 *   <script src="/analytics.js" defer></script>
 *
 * The gtag queue is primed immediately so events fired by page scripts are
 * never dropped, but the tag libraries themselves are only fetched on first
 * interaction, on idle after load, or after a 12 second fallback. That keeps
 * roughly 90 KB of third-party JavaScript out of the critical path and off
 * the Largest Contentful Paint measurement.
 *
 * Pages can force an early load by calling window.loadDeferredAnalytics().
 */
(function () {
  var GA_ID = 'G-37865BSRR9';
  var CLARITY_ID = 'w0ul55zsim';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);

  var analyticsLoaded = false;
  var analyticsScheduled = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function runAnalyticsWhenIdle() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnalytics, { timeout: 5000 });
    } else {
      setTimeout(loadAnalytics, 1);
    }
  }

  function scheduleAnalytics() {
    if (analyticsScheduled || analyticsLoaded) return;
    analyticsScheduled = true;

    if (document.readyState === 'complete') {
      runAnalyticsWhenIdle();
    } else {
      window.addEventListener('load', runAnalyticsWhenIdle, { once: true });
    }
  }

  window.loadDeferredAnalytics = scheduleAnalytics;
  window.addEventListener('pointerdown', scheduleAnalytics, { once: true, passive: true });
  window.addEventListener('keydown', scheduleAnalytics, { once: true });
  window.addEventListener('load', function () {
    setTimeout(scheduleAnalytics, 12000);
  }, { once: true });
})();
