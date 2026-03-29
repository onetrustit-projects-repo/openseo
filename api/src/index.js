const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const schemaRoutes = require('./routes/schema');
const validateRoutes = require('./routes/validate');
const batchRoutes = require('./routes/batch');

const app = express();
const PORT = process.env.PORT || 3087;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/schema', schemaRoutes);
app.use('/api/validate', validateRoutes);
app.use('/api/batch', batchRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenSEO Schema API running on port ${PORT}`);
});

module.exports = app;
