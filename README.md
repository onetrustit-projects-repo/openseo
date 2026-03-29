# Core Web Vitals Monitoring and Optimization Suite

Real user monitoring (RUM) and synthetic testing for Core Web Vitals metrics.

## Features

- **Real User Monitoring**: Track LCP, FID, CLS, INP metrics
- **Synthetic Testing**: Run Lighthouse-based tests via Playwright
- **Device Breakdown**: Desktop, mobile, tablet performance
- **Geographic Distribution**: Performance by region
- **Alerting**: Threshold-based alerts for violations
- **Recommendations**: Optimization suggestions with code examples

## API Endpoints

- `GET /api/metrics` - List page metrics
- `GET /api/metrics/summary` - Overall summary
- `GET /api/synthetic/tests` - List tests
- `POST /api/synthetic/run` - Run test
- `GET /api/alerts` - List alerts
- `GET /api/recommendations` - Optimization tips

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: fcb28672-a50e-4498-b92d-c17b4c9bec9b
