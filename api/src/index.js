const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const metricsRoutes = require('./routes/metrics');
const syntheticRoutes = require('./routes/synthetic');
const alertsRoutes = require('./routes/alerts');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3090;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', module: 'core-web-vitals', version: '1.0.0' });
});

app.use('/api/metrics', metricsRoutes);
app.use('/api/synthetic', syntheticRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/recommendations', recommendationsRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Core Web Vitals API running on port ${PORT}`);
});

module.exports = app;
