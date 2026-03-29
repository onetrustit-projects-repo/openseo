# Schema Markup Generator and Validator

Visual interface for generating and validating structured data markup (JSON-LD).

## Features

### Schema Types
- Article
- Product
- FAQPage
- HowTo
- LocalBusiness
- Event
- Organization

### Validation
- Real-time validation against Google's guidelines
- Error detection
- Warning for best practices
- Rich result preview

### Batch Operations
- Generate multiple schemas at once
- Export to JSON or HTML

## API Endpoints

### Schema
- `GET /api/schema/types` - List schema types
- `POST /api/schema/generate` - Generate schema markup
- `GET /api/schema/saved` - List saved schemas

### Validation
- `POST /api/validate/schema` - Validate schema markup
- `POST /api/validate/url` - Validate from URL

### Batch
- `POST /api/batch/generate` - Batch generate schemas
- `POST /api/batch/validate` - Batch validate

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: 2b182586-6150-4028-be08-a51b34a3791f
