const express = require('express');
const router = express.Router();

// Role definitions
const roles = {
  admin: {
    name: 'Admin',
    permissions: [
      'workspace.manage',
      'workspace.delete',
      'users.manage',
      'users.invite',
      'reports.view',
      'reports.create',
      'reports.delete',
      'alerts.manage',
      'settings.manage',
      'audit.view',
      'audit.execute',
      'keywords.manage'
    ]
  },
  editor: {
    name: 'Editor',
    permissions: [
      'reports.view',
      'reports.create',
      'reports.edit',
      'alerts.view',
      'alerts.create',
      'audit.view',
      'audit.execute',
      'keywords.manage',
      'keywords.view'
    ]
  },
  viewer: {
    name: 'Viewer',
    permissions: [
      'reports.view',
      'alerts.view',
      'audit.view',
      'keywords.view'
    ]
  }
};

/**
 * GET /api/rbac/roles
 * List all roles
 */
router.get('/roles', (req, res) => {
  const roleList = Object.entries(roles).map(([id, role]) => ({
    id,
    name: role.name,
    permissions: role.permissions
  }));
  
  res.json({ success: true, roles: roleList });
});

/**
 * GET /api/rbac/roles/:roleId
 * Get role details
 */
router.get('/roles/:roleId', (req, res) => {
  const role = roles[req.params.roleId];
  
  if (!role) {
    return res.status(404).json({ error: 'Role not found' });
  }
  
  res.json({
    success: true,
    role: { id: req.params.roleId, name: role.name, permissions: role.permissions }
  });
});

/**
 * POST /api/rbac/check
 * Check if user has permission
 */
router.post('/check', (req, res) => {
  const { userId, permission } = req.body;
  
  if (!userId || !permission) {
    return res.status(400).json({ error: 'UserId and permission required' });
  }
  
  // In production, fetch user role from database
  // For demo, assume viewer role
  const userRole = 'viewer';
  const hasPermission = roles[userRole]?.permissions.includes(permission) || false;
  
  res.json({
    success: true,
    hasPermission,
    userRole,
    requiredPermission: permission
  });
});

/**
 * GET /api/rbac/permissions
 * List all available permissions
 */
router.get('/permissions', (req, res) => {
  const permissions = [
    // Workspace
    { id: 'workspace.manage', name: 'Manage Workspace', category: 'Workspace' },
    { id: 'workspace.delete', name: 'Delete Workspace', category: 'Workspace' },
    // Users
    { id: 'users.manage', name: 'Manage Users', category: 'Users' },
    { id: 'users.invite', name: 'Invite Users', category: 'Users' },
    // Reports
    { id: 'reports.view', name: 'View Reports', category: 'Reports' },
    { id: 'reports.create', name: 'Create Reports', category: 'Reports' },
    { id: 'reports.edit', name: 'Edit Reports', category: 'Reports' },
    { id: 'reports.delete', name: 'Delete Reports', category: 'Reports' },
    // Alerts
    { id: 'alerts.view', name: 'View Alerts', category: 'Alerts' },
    { id: 'alerts.create', name: 'Create Alerts', category: 'Alerts' },
    { id: 'alerts.manage', name: 'Manage Alerts', category: 'Alerts' },
    // Audit
    { id: 'audit.view', name: 'View Audit', category: 'Audit' },
    { id: 'audit.execute', name: 'Execute Audit', category: 'Audit' },
    // Keywords
    { id: 'keywords.view', name: 'View Keywords', category: 'Keywords' },
    { id: 'keywords.manage', name: 'Manage Keywords', category: 'Keywords' },
    // Settings
    { id: 'settings.manage', name: 'Manage Settings', category: 'Settings' }
  ];
  
  res.json({ success: true, permissions });
});

/**
 * PUT /api/rbac/roles/:roleId/permissions
 * Update role permissions
 */
router.put('/roles/:roleId/permissions', (req, res) => {
  const { permissions } = req.body;
  
  if (!roles[req.params.roleId]) {
    return res.status(404).json({ error: 'Role not found' });
  }
  
  roles[req.params.roleId].permissions = permissions;
  
  res.json({
    success: true,
    role: { id: req.params.roleId, permissions: roles[req.params.roleId].permissions }
  });
});

module.exports = router;
