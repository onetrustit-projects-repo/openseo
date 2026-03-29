const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory users store
const usersStore = new Map();

/**
 * GET /api/users
 * List users
 */
router.get('/', (req, res) => {
  const users = Array.from(usersStore.values()).map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status
  }));
  
  res.json({ success: true, users, total: users.length });
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
  const user = usersStore.get(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res) => {
  const user = usersStore.get(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, role, status } = req.body;
  
  if (name) user.name = name;
  if (role) user.role = role;
  if (status) user.status = status;
  
  usersStore.set(user.id, user);
  
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', (req, res) => {
  if (!usersStore.has(req.params.id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  usersStore.delete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

/**
 * POST /api/users/invite
 * Invite user to workspace
 */
router.post('/invite', (req, res) => {
  const { email, role, workspaceId } = req.body;
  
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role required' });
  }
  
  const invite = {
    id: uuidv4(),
    email,
    role,
    workspaceId: workspaceId || 'default',
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  res.status(201).json({ success: true, invite });
});

module.exports = router;
