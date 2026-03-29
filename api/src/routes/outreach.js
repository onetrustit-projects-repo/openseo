const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory stores
const outreachStore = new Map();
const campaignStore = new Map();

const outreachHistory = [];

/**
 * GET /api/outreach/campaigns
 * List link building campaigns
 */
router.get('/campaigns', (req, res) => {
  const campaigns = Array.from(campaignStore.values());
  res.json({ success: true, campaigns });
});

/**
 * POST /api/outreach/campaigns
 * Create new campaign
 */
router.post('/campaigns', (req, res) => {
  const { name, target, type, startDate, endDate } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Campaign name required' });
  }
  
  const campaign = {
    id: uuidv4(),
    name,
    target: target || '',
    type: type || 'guest-post',
    status: 'active',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || null,
    prospects: [],
    contacted: 0,
    replied: 0,
    approved: 0,
    published: 0,
    createdAt: new Date().toISOString()
  };
  
  campaignStore.set(campaign.id, campaign);
  res.json({ success: true, campaign });
});

/**
 * GET /api/outreach/campaigns/:id
 * Get campaign details
 */
router.get('/campaigns/:id', (req, res) => {
  const campaign = campaignStore.get(req.params.id);
  
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  res.json({ success: true, campaign });
});

/**
 * POST /api/outreach/prospects
 * Add prospects to campaign
 */
router.post('/prospects', (req, res) => {
  const { campaignId, prospects } = req.body;
  
  if (!prospects || !Array.isArray(prospects)) {
    return res.status(400).json({ error: 'Prospects array required' });
  }
  
  const campaign = campaignStore.get(campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  const added = prospects.map(p => {
    const prospect = {
      id: uuidv4(),
      ...p,
      status: 'pending',
      addedAt: new Date().toISOString()
    };
    campaign.prospects.push(prospect);
    return prospect;
  });
  
  campaignStore.set(campaignId, campaign);
  res.json({ success: true, added, totalProspects: campaign.prospects.length });
});

/**
 * GET /api/outreach/prospects
 * List all prospects
 */
router.get('/prospects', (req, res) => {
  const { campaignId, status } = req.query;
  
  let prospects = [];
  
  if (campaignId) {
    const campaign = campaignStore.get(campaignId);
    prospects = campaign ? campaign.prospects : [];
  } else {
    campaignStore.forEach(c => {
      prospects = prospects.concat(c.prospects);
    });
  }
  
  if (status) {
    prospects = prospects.filter(p => p.status === status);
  }
  
  res.json({ success: true, prospects });
});

/**
 * PATCH /api/outreach/prospects/:id
 * Update prospect status
 */
router.patch('/prospects/:id', (req, res) => {
  const { status, notes } = req.body;
  
  let updated = null;
  campaignStore.forEach(campaign => {
    const prospect = campaign.prospects.find(p => p.id === req.params.id);
    if (prospect) {
      if (status) prospect.status = status;
      if (notes) prospect.notes = notes;
      prospect.updatedAt = new Date().toISOString();
      updated = prospect;
    }
  });
  
  if (!updated) {
    return res.status(404).json({ error: 'Prospect not found' });
  }
  
  res.json({ success: true, prospect: updated });
});

/**
 * GET /api/outreach/outreaches
 * List outreach history
 */
router.get('/outreaches', (req, res) => {
  res.json({ success: true, outreaches: outreachHistory });
});

/**
 * POST /api/outreach/outreaches
 * Log outreach activity
 */
router.post('/outreaches', (req, res) => {
  const { prospectId, type, subject, content, sentAt } = req.body;
  
  const outreach = {
    id: uuidv4(),
    prospectId,
    type: type || 'email',
    subject: subject || '',
    content: content || '',
    sentAt: sentAt || new Date().toISOString(),
    tracked: true,
    opened: false,
    clicked: false
  };
  
  outreachHistory.push(outreach);
  res.json({ success: true, outreach });
});

/**
 * GET /api/outreach/stats
 * Get outreach statistics
 */
router.get('/stats', (req, res) => {
  let allProspects = [];
  campaignStore.forEach(c => {
    allProspects = allProspects.concat(c.prospects);
  });
  
  const stats = {
    totalProspects: allProspects.length,
    pending: allProspects.filter(p => p.status === 'pending').length,
    contacted: allProspects.filter(p => p.status === 'contacted').length,
    replied: allProspects.filter(p => p.status === 'replied').length,
    approved: allProspects.filter(p => p.status === 'approved').length,
    published: allProspects.filter(p => p.status === 'published').length,
    rejected: allProspects.filter(p => p.status === 'rejected').length,
    totalCampaigns: campaignStore.size,
    activeCampaigns: Array.from(campaignStore.values()).filter(c => c.status === 'active').length,
    totalOutreaches: outreachHistory.length
  };
  
  res.json({ success: true, stats });
});

module.exports = router;
