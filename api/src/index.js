const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const urlAuditRoutes = require('./routes/url-audit');
const keywordRoutes = require('./routes/keywords');
const schemaRoutes = require('./routes/schema');
const contentRoutes = require('./routes/content');
const rankRoutes = require('./routes/ranks');
const crawlRoutes = require('./routes/crawl');
const webhookRoutes = require('./routes/webhooks');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3080;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please slow down' }
});
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenSEO API',
      version: '1.0.0',
      description: 'Comprehensive SEO REST API with URL auditing, keyword analysis, schema validation, content scoring, rank tracking, and site crawling.',
      contact: {
        name: 'OpenSEO Developer Support',
        email: 'api@openseo.dev'
      }
    },
    servers: [
      { url: '/api', description: 'API v1' }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ ApiKeyAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/url-audit', urlAuditRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/schema', schemaRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ranks', rankRoutes);
app.use('/api/crawl', crawlRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`OpenSEO API running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
