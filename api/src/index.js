const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const alertRoutes = require('./routes/alerts');
const channelRoutes = require('./routes/channels');
const webhookRoutes = require('./routes/webhooks');
const digestRoutes = require('./routes/digests');

const app = express();
const PORT = process.env.PORT || 3084;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/digests', digestRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Alerts API running on port ${PORT}`);
});

module.exports = app;
