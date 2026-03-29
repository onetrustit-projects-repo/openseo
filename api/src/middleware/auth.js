const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'openseo-secret-key-change-in-production';

// API Key authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required', code: 'MISSING_API_KEY' });
  }
  
  // Validate API key (in production, check against database)
  const validKeys = {
    'openseo-test-key-001': { userId: 'user_001', plan: 'free', rateLimit: 100 },
    'openseo-test-key-002': { userId: 'user_002', plan: 'pro', rateLimit: 1000 }
  };
  
  const keyData = validKeys[apiKey];
  if (!keyData) {
    return res.status(401).json({ error: 'Invalid API key', code: 'INVALID_API_KEY' });
  }
  
  req.apiKey = apiKey;
  req.userId = keyData.userId;
  req.plan = keyData.plan;
  req.rateLimit = keyData.rateLimit;
  next();
};

// JWT authentication
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'JWT token required', code: 'MISSING_TOKEN' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
    }
    req.user = user;
    next();
  });
};

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

// API Key generator
const generateApiKey = () => {
  const { v4: uuidv4 } = require('uuid');
  return `openseo_${uuidv4().replace(/-/g, '')}`;
};

module.exports = { authenticateApiKey, authenticateJWT, generateToken, generateApiKey, JWT_SECRET };
