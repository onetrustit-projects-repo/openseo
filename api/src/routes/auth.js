const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'openseo-collaboration-secret';

// In-memory users
const users = new Map();

// Default admin user
users.set('admin', {
  id: 'user_admin',
  email: 'admin@openseo.dev',
  password: bcrypt.hashSync('admin123', 10),
  name: 'Admin User',
  role: 'admin',
  provider: 'local',
  createdAt: new Date().toISOString()
});

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: 'user_' + uuidv4().slice(0, 8),
    email,
    password: hashedPassword,
    name: name || email.split('@')[0],
    role: 'viewer',
    provider: 'local',
    createdAt: new Date().toISOString()
  };
  
  users.set(email, user);
  
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.status(201).json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

/**
 * POST /api/auth/sso/google
 * Google SSO login/register
 */
router.post('/sso/google', (req, res) => {
  const { googleToken } = req.body;
  
  // In production, verify Google token
  // For demo, create/mock user from token
  const mockUser = {
    id: 'user_google_' + uuidv4().slice(0, 8),
    email: 'user@gmail.com',
    name: 'Google User',
    role: 'viewer',
    provider: 'google',
    createdAt: new Date().toISOString()
  };
  
  const token = jwt.sign({ userId: mockUser.id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    user: { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role },
    token,
    isNewUser: true
  });
});

/**
 * POST /api/auth/sso/github
 * GitHub SSO login/register
 */
router.post('/sso/github', (req, res) => {
  const { githubToken } = req.body;
  
  // In production, verify GitHub token
  const mockUser = {
    id: 'user_github_' + uuidv4().slice(0, 8),
    email: 'user@github.com',
    name: 'GitHub User',
    role: 'viewer',
    provider: 'github',
    createdAt: new Date().toISOString()
  };
  
  const token = jwt.sign({ userId: mockUser.id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    user: { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role },
    token,
    isNewUser: true
  });
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
