const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const notionRoutes = require('./routes/notion');
const syncRoutes = require('./routes/sync');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3086;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/notion', notionRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/content', contentRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Notion API running on port ${PORT}`);
});

module.exports = app;
