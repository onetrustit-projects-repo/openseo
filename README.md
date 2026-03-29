# Notion Integration for SEO-Aware Content Workflows

Bidirectional sync between OpenSEO and Notion.

## Features

### Content Analysis
- Analyze Notion page content for SEO
- Extract keywords and readability metrics
- Generate recommendations

### Meta Tag Generation
- Auto-generate meta title and description
- Create SEO-friendly URL slugs
- Content-based meta tag suggestions

### Notion Sync
- Bidirectional sync between OpenSEO and Notion
- Sync status and history
- Batch sync support

### Content Calendar
- View content calendar with SEO scores
- Track keyword performance

## API Endpoints

### Notion
- `POST /api/notion/connect` - Connect Notion workspace
- `POST /api/notion/analyze-page` - Analyze page content
- `POST /api/notion/generate-meta` - Generate meta tags
- `POST /api/notion/database` - Get database entries
- `POST /api/notion/sidebar` - Generate sidebar data

### Sync
- `POST /api/sync/notion` - Sync with Notion
- `POST /api/sync/pull` - Pull from Notion
- `GET /api/sync/history` - Get sync history
- `POST /api/sync/calendar` - Sync content calendar

### Content
- `POST /api/content/export` - Export with meta tags
- `POST /api/content/render-blocks` - Render Notion blocks
- `POST /api/content/analyze` - Analyze content
- `GET /api/content/templates` - Get templates

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: 70ef4a20-de21-45b6-9ab2-3a4d754c49dc
