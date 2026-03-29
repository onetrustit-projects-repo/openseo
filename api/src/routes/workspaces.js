const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory workspaces store
const workspacesStore = new Map([
  ['ws_default', {
    id: 'ws_default',
    name: 'Default Workspace',
    description: 'Default shared workspace',
    owner: 'user_admin',
    members: [
      { userId: 'user_admin', role: 'admin' }
    ],
    createdAt: new Date().toISOString()
  }]
]);

/**
 * GET /api/workspaces
 * List workspaces for current user
 */
router.get('/', (req, res) => {
  const workspaces = Array.from(workspacesStore.values()).map(w => ({
    id: w.id,
    name: w.name,
    description: w.description,
    memberCount: w.members.length
  }));
  
  res.json({ success: true, workspaces, total: workspaces.length });
});

/**
 * POST /api/workspaces
 * Create workspace
 */
router.post('/', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  
  const workspace = {
    id: 'ws_' + uuidv4().slice(0, 8),
    name,
    description: description || '',
    owner: 'current_user',
    members: [],
    createdAt: new Date().toISOString()
  };
  
  workspacesStore.set(workspace.id, workspace);
  
  res.status(201).json({ success: true, workspace });
});

/**
 * GET /api/workspaces/:id
 * Get workspace details
 */
router.get('/:id', (req, res) => {
  const workspace = workspacesStore.get(req.params.id);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  res.json({ success: true, workspace });
});

/**
 * PUT /api/workspaces/:id
 * Update workspace
 */
router.put('/:id', (req, res) => {
  const workspace = workspacesStore.get(req.params.id);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  const { name, description } = req.body;
  
  if (name) workspace.name = name;
  if (description !== undefined) workspace.description = description;
  
  workspacesStore.set(workspace.id, workspace);
  
  res.json({ success: true, workspace });
});

/**
 * POST /api/workspaces/:id/members
 * Add member to workspace
 */
router.post('/:id/members', (req, res) => {
  const workspace = workspacesStore.get(req.params.id);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  const { userId, role } = req.body;
  
  if (!userId || !role) {
    return res.status(400).json({ error: 'UserId and role required' });
  }
  
  workspace.members.push({ userId, role });
  workspacesStore.set(workspace.id, workspace);
  
  res.json({ success: true, members: workspace.members });
});

/**
 * DELETE /api/workspaces/:id/members/:userId
 * Remove member from workspace
 */
router.delete('/:id/members/:userId', (req, res) => {
  const workspace = workspacesStore.get(req.params.id);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  workspace.members = workspace.members.filter(m => m.userId !== req.params.userId);
  workspacesStore.set(workspace.id, workspace);
  
  res.json({ success: true, members: workspace.members });
});

/**
 * GET /api/workspaces/:id/comments
 * Get workspace comments
 */
router.get('/:id/comments', (req, res) => {
  const workspace = workspacesStore.get(req.params.id);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  res.json({
    success: true,
    comments: [
      {
        id: 'comment_1',
        userId: 'user_admin',
        userName: 'Admin User',
        content: 'This SEO issue needs attention',
        resourceType: 'audit',
        resourceId: 'audit_1',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

/**
 * POST /api/workspaces/:id/comments
 * Add comment
 */
router.post('/:id/comments', (req, res) => {
  const { content, resourceType, resourceId, mentions } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  const comment = {
    id: 'comment_' + uuidv4().slice(0, 8),
    userId: 'current_user',
    userName: 'Current User',
    content,
    resourceType,
    resourceId,
    mentions: mentions || [],
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({ success: true, comment });
});

/**
 * GET /api/workspaces/:id/tasks
 * Get workspace tasks
 */
router.get('/:id/tasks', (req, res) => {
  const tasks = [
    {
      id: 'task_1',
      title: 'Fix meta descriptions on homepage',
      assignedTo: 'user_admin',
      assignedName: 'Admin User',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({ success: true, tasks, total: tasks.length });
});

/**
 * POST /api/workspaces/:id/tasks
 * Create task
 */
router.post('/:id/tasks', (req, res) => {
  const { title, assignedTo, priority } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }
  
  const task = {
    id: 'task_' + uuidv4().slice(0, 8),
    title,
    assignedTo,
    status: 'open',
    priority: priority || 'medium',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({ success: true, task });
});

module.exports = router;
