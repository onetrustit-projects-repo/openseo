# Slack and Discord Alerting System

Real-time notifications via Slack and Discord for SEO alerts.

## Features

### Alerts
- Configurable alerts for ranking drops, backlinks, Core Web Vitals, crawl errors, schema failures
- Severity levels (critical, high, medium, low)
- Quiet hours configuration
- Test alert functionality

### Channels
- Slack webhook integration
- Discord webhook integration
- Channel configuration and testing

### Digests
- Scheduled daily/weekly/monthly summary digests
- Configurable digest content
- Manual trigger support

## API Endpoints

### Alerts
- `GET /api/alerts` - List alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert
- `POST /api/alerts/:id/test` - Test alert
- `POST /api/alerts/trigger` - Trigger alert

### Channels
- `GET /api/channels` - List channels
- `POST /api/channels` - Create channel
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel
- `POST /api/channels/:id/test` - Test channel
- `POST /api/channels/:id/send` - Send message

### Webhooks
- `POST /api/webhooks/inbound` - Receive webhook
- `GET /api/webhooks` - List outgoing webhooks
- `POST /api/webhooks` - Create webhook
- `DELETE /api/webhooks/:id` - Delete webhook

### Digests
- `GET /api/digests` - List digests
- `POST /api/digests` - Create digest
- `PUT /api/digests/:id` - Update digest
- `DELETE /api/digests/:id` - Delete digest
- `POST /api/digests/:id/trigger` - Trigger digest

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: e3ace169-f0db-4cbf-8833-14b33f3ec9e8
