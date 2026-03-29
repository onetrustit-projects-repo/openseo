const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generateToken, generateApiKey, JWT_SECRET } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new API user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               plan:
 *                 type: string
 *                 enum: [free, pro, enterprise]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, plan = 'free' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate API key
    const apiKey = generateApiKey();
    
    // In production, save to database
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      plan,
      apiKeys: [{ key: apiKey, name: 'Primary', createdAt: new Date() }],
      createdAt: new Date()
    };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email, plan },
      apiKey,
      token: generateToken(user.id, email)
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get API credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In production, validate against database
    // For demo, accept any credentials
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const userId = 'user_' + email.split('@')[0];
    const apiKey = 'openseo_' + uuidv4().replace(/-/g, '').slice(0, 24);
    
    res.json({
      message: 'Login successful',
      token: generateToken(userId, email),
      apiKey,
      expiresIn: '7d'
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @swagger
 * /api/auth/keys:
 *   post:
 *     summary: Generate new API key
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: API key generated
 */
router.post('/keys', (req, res) => {
  const apiKey = generateApiKey();
  res.status(201).json({
    apiKey,
    name: 'New Key',
    createdAt: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/auth/keys:
 *   get:
 *     summary: List API keys
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 */
router.get('/keys', (req, res) => {
  // In production, fetch from database
  res.json({
    keys: [
      { id: 'key_001', name: 'Primary', createdAt: new Date().toISOString(), lastUsed: new Date().toISOString() }
    ]
  });
});

module.exports = router;
