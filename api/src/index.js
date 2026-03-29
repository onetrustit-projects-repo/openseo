const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const reportRoutes = require('./routes/reports');
const templateRoutes = require('./routes/templates');
const scheduleRoutes = require('./routes/schedules');
const brandingRoutes = require('./routes/branding');

const app = express();
const PORT = process.env.PORT || 3083;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/branding', brandingRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Reports API running on port ${PORT}`);
});

module.exports = app;
