# Sitemap and Robots.txt Management Interface

Visual interface for managing dynamic sitemap.xml generation and robots.txt directives.

## Features

### Sitemap Management
- Dynamic sitemap.xml generation
- Page prioritization with priority values
- Change frequency hints (daily, weekly, monthly, yearly)
- Lastmod date management
- Section-based organization
- URL validation

### Robots.txt Management
- Visual rule builder with syntax validation
- Support for allow/disallow directives
- Crawl delay settings
- Multiple user-agent rules
- Preview of search engine interpretation

### Templates
- Pre-built robots.txt templates
- WordPress, Strict, E-commerce templates
- Googlebot-only configuration

## API Endpoints

### Sitemap
- `GET /api/sitemap/:domain` - Get sitemap config
- `POST /api/sitemap/generate` - Generate sitemap XML
- `POST /api/sitemap/pages` - Add pages
- `PUT /api/sitemap/pages/:pageId` - Update page
- `DELETE /api/sitemap/pages/:pageId` - Remove page
- `POST /api/sitemap/validate` - Validate URLs

### Robots.txt
- `GET /api/robots/:domain` - Get robots config
- `POST /api/robots/generate` - Generate robots.txt
- `POST /api/robots/rules` - Add rule
- `DELETE /api/robots/rules/:ruleId` - Remove rule
- `POST /api/robots/validate` - Validate syntax
- `POST /api/robots/preview` - Preview interpretation
- `GET /api/robots/templates/list` - List templates

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: 0b9fa7d7-33e2-4e65-bcb2-3940055d9390
