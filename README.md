# Google Search Console Integration Dashboard

Connect to Google Search Console API for keyword rankings and search performance.

## Features

- OAuth2 GSC authentication
- Performance metrics: clicks, impressions, CTR, position
- Device and geographic breakdown
- Top pages and queries
- Anomaly detection for traffic drops
- Daily sync with GSC

## API Endpoints

- `GET /api/gsc/performance` - Get performance data
- `GET /api/gsc/analytics` - Get analytics summary
- `GET /api/gsc/top-pages` - Top performing pages
- `GET /api/gsc/top-queries` - Top queries
- `POST /api/sync/trigger` - Trigger GSC sync
- `GET /api/alerts/anomalies` - Get detected anomalies

---

Task: a8ab6854-5956-47e5-a53a-ab775b00fba2
