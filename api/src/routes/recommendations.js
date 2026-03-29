const express = require('express');
const router = express.Router();

const recommendations = {
  LCP: [
    { id: 'lcp-1', title: 'Optimize Images', description: 'Use WebP or AVIF formats, properly size images, use responsive images with srcset.', impact: 'high', effort: 'medium', code: '<picture>\n  <source srcset="image.avif" type="image/avif">\n  <source srcset="image.webp" type="image/webp">\n  <img src="image.jpg" alt="Description">\n</picture>' },
    { id: 'lcp-2', title: 'Use CDN', description: 'Serve static assets from a CDN to reduce server response time.', impact: 'high', effort: 'low', code: '// Configure CDN in your hosting\n// Example for Cloudflare\n// Set cache-control headers for static assets' },
    { id: 'lcp-3', title: 'Preload Key Resources', description: 'Preload your LCP image and critical fonts using <link rel="preload">.', impact: 'medium', effort: 'low', code: '<link rel="preload" href="/hero-image.webp" as="image">\n<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>' },
    { id: 'lcp-4', title: 'Remove Render-Blocking Resources', description: 'Defer non-critical CSS/JS or inline critical styles.', impact: 'medium', effort: 'medium', code: '<!-- Defer non-critical JS -->\n<script src="analytics.js" defer></script>\n\n<!-- Inline critical CSS -->\n<style>/* Critical CSS here */</style>' },
  ],
  FID: [
    { id: 'fid-1', title: 'Break Up Long Tasks', description: 'Split long JavaScript tasks into smaller chunks using requestIdleCallback.', impact: 'high', effort: 'medium', code: '// Break up long task\nfunction processInChunks(items) {\n  const chunkSize = 50;\n  let index = 0;\n  \n  function processChunk() {\n    const chunk = items.slice(index, index + chunkSize);\n    chunk.forEach(processItem);\n    index += chunkSize;\n    if (index < items.length) {\n      requestIdleCallback(processChunk);\n    }\n  }\n  requestIdleCallback(processChunk);\n}' },
    { id: 'fid-2', title: 'Defer Non-Critical JS', description: 'Load third-party scripts after the main content.', impact: 'high', effort: 'low', code: '// Load non-critical scripts after interaction\nconst script = document.createElement("script");\nscript.src = "analytics.js";\nscript.async = true;\ndocument.body.appendChild(script);' },
    { id: 'fid-3', title: 'Optimize Event Handlers', description: 'Use passive event listeners for touch/wheel events.', impact: 'medium', effort: 'low', code: '// Use passive listeners\nelement.addEventListener("touchstart", handler, { passive: true });\nelement.addEventListener("wheel", handler, { passive: true });' },
  ],
  CLS: [
    { id: 'cls-1', title: 'Set Dimensions on Images', description: 'Always include width and height attributes on images.', impact: 'high', effort: 'low', code: '<!-- Always set dimensions -->\n<img src="image.jpg" width="800" height="600" alt="Description">' },
    { id: 'cls-2', title: 'Reserve Space for Ads', description: 'Use min-height or aspect-ratio for ad slots.', impact: 'high', effort: 'medium', code: '/* Reserve space for ads */\n.ad-slot {\n  min-height: 250px;\n  /* Or use aspect ratio */\n  aspect-ratio: 300 / 250;\n}' },
    { id: 'cls-3', title: 'Avoid Injecting Content Above Existing', description: "Don't insert content above existing content that causes layout shifts.", impact: 'high', effort: 'medium', code: '// Bad: banners push content\n// Good: use fixed positioning or overlay' },
    { id: 'cls-4', title: 'Use transform for Animations', description: 'Prefer transform and opacity for animations to avoid triggering layout.', impact: 'medium', effort: 'low', code: '/* Use transform instead of top/left */\n@keyframes slideIn {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}' },
  ],
  INP: [
    { id: 'inp-1', title: 'Optimize Interaction Handlers', description: 'Keep interaction handlers fast, defer non-critical work.', impact: 'high', effort: 'medium', code: '// Defer non-critical work from interaction handlers\nbutton.addEventListener("click", () => {\n  // Critical work immediately\n  updateUI();\n  // Non-critical work deferred\n  requestIdleCallback(() => trackEvent());\n});' },
    { id: 'inp-2', title: 'Reduce JavaScript Bundle', description: 'Code-split your application to reduce main thread work.', impact: 'high', effort: 'high', code: '// Use dynamic imports\nconst modal = await import("./modal.js");\nmodal.show();' },
  ],
};

router.get('/', (req, res) => {
  const { metric } = req.query;
  if (metric && recommendations[metric]) {
    res.json({ success: true, recommendations: recommendations[metric] });
  } else {
    res.json({ success: true, recommendations });
  }
});

router.get('/:id', (req, res) => {
  for (const metric of Object.keys(recommendations)) {
    const rec = recommendations[metric].find(r => r.id === req.params.id);
    if (rec) return res.json({ success: true, recommendation: rec });
  }
  res.status(404).json({ error: 'Recommendation not found' });
});

module.exports = router;
