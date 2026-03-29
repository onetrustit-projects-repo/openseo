require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const keywordRoutes = require('./routes/keywords');
const backlinkRoutes = require('./routes/backlinks');
const auditRoutes = require('./routes/audits');
const rankRoutes = require('./routes/ranks');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/keywords', keywordRoutes);
app.use('/api/backlinks', backlinkRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/ranks', rankRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'OpenSEO API',
    version: '1.0.0',
    endpoints: {
      keywords: 'GET /api/keywords/suggest?q=term',
      backlinks: 'GET /api/backlinks?domain=example.com',
      audits: 'GET /api/audits?url=https://example.com',
      ranks: 'GET /api/ranks?keyword=term&domain=example.com'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO API running on port ${PORT}`);
});

module.exports = app;
