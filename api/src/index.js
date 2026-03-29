const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const sitemapRoutes = require('./routes/sitemap');
const robotsRoutes = require('./routes/robots');

const app = express();
const PORT = process.env.PORT || 3082;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/robots', robotsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Sitemap API running on port ${PORT}`);
});

module.exports = app;
