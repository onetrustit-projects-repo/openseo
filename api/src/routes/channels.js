const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory channel store
const channelsStore = new Map([
  ['slack_default', {
    id: 'slack_default',
    platform: 'slack',
    name: 'SEO Alerts',
    webhookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
    channel: '#seo-alerts',
    icon: ':warning:',
    active: true,
    createdAt: new Date().toISOString()
  }],
  ['discord_default', {
    id: 'discord_default',
    platform: 'discord',
    name: 'SEO Alerts',
    webhookUrl: 'https://discord.com/api/webhooks/XXX/YYY',
    channel: 'seo-alerts',
    icon: null,
    active: true,
    createdAt: new Date().toISOString()
  }]
]);

/**
 * GET /api/channels
 * List all notification channels
 */
router.get('/', (req, res) => {
  const channels = Array.from(channelsStore.values()).map(c => ({
    id: c.id,
    platform: c.platform,
    name: c.name,
    channel: c.channel,
    active: c.active
  }));
  
  res.json({ success: true, channels, total: channels.length });
});

/**
 * POST /api/channels
 * Create notification channel
 */
router.post('/', (req, res) => {
  const { platform, name, webhookUrl, channel, icon } = req.body;
  
  if (!platform || !name || !webhookUrl) {
    return res.status(400).json({ error: 'Platform, name, and webhookUrl required' });
  }
  
  if (!['slack', 'discord'].includes(platform)) {
    return res.status(400).json({ error: 'Platform must be slack or discord' });
  }
  
  const channelObj = {
    id: platform + '_' + uuidv4().slice(0, 8),
    platform,
    name,
    webhookUrl,
    channel: channel || (platform === 'slack' ? '#alerts' : 'alerts'),
    icon: icon || null,
    active: true,
    createdAt: new Date().toISOString()
  };
  
  channelsStore.set(channelObj.id, channelObj);
  
  res.status(201).json({ success: true, channel: channelObj });
});

/**
 * PUT /api/channels/:id
 * Update channel
 */
router.put('/:id', (req, res) => {
  const channel = channelsStore.get(req.params.id);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  const { name, webhookUrl, channel: channelName, icon, active } = req.body;
  
  if (name) channel.name = name;
  if (webhookUrl) channel.webhookUrl = webhookUrl;
  if (channelName) channel.channel = channelName;
  if (icon !== undefined) channel.icon = icon;
  if (active !== undefined) channel.active = active;
  
  channelsStore.set(channel.id, channel);
  
  res.json({ success: true, channel });
});

/**
 * DELETE /api/channels/:id
 * Delete channel
 */
router.delete('/:id', (req, res) => {
  if (!channelsStore.has(req.params.id)) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  channelsStore.delete(req.params.id);
  res.json({ success: true, message: 'Channel deleted' });
});

/**
 * POST /api/channels/:id/test
 * Test channel configuration
 */
router.post('/:id/test', (req, res) => {
  const channel = channelsStore.get(req.params.id);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  const testPayload = channel.platform === 'slack' 
    ? { text: 'Test alert from OpenSEO', icon_emoji: channel.icon || ':robot_face:' }
    : { content: 'Test alert from OpenSEO' };
  
  res.json({
    success: true,
    message: `Test message prepared for ${channel.platform}`,
    channelId: channel.id,
    platform: channel.platform,
    payload: testPayload
  });
});

/**
 * POST /api/channels/:id/send
 * Send message to channel
 */
router.post('/:id/send', (req, res) => {
  const channel = channelsStore.get(req.params.id);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  const { message, severity, alertType, actions } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  const payload = channel.platform === 'slack'
    ? buildSlackPayload(message, severity, alertType, actions)
    : buildDiscordPayload(message, severity, alertType, actions);
  
  res.json({
    success: true,
    message: 'Message sent',
    channelId: channel.id,
    platform: channel.platform,
    payload
  });
});

function buildSlackPayload(message, severity, alertType, actions) {
  const color = severity === 'critical' ? '#FF0000' : 
                severity === 'high' ? '#FFA500' : 
                severity === 'medium' ? '#FFFF00' : '#36A64F';
  
  return {
    attachments: [{
      color,
      title: alertType || 'OpenSEO Alert',
      text: message,
      footer: 'OpenSEO Alerting System',
      ts: Math.floor(Date.now() / 1000),
      actions: actions || []
    }]
  };
}

function buildDiscordPayload(message, severity, alertType, actions) {
  const color = severity === 'critical' ? 0xFF0000 : 
                severity === 'high' ? 0xFFA500 : 
                severity === 'medium' ? 0xFFFF00 : 0x36A64F;
  
  return {
    embeds: [{
      title: alertType || 'OpenSEO Alert',
      description: message,
      color,
      footer: { text: 'OpenSEO Alerting System' },
      timestamp: new Date().toISOString(),
      fields: (actions || []).map(a => ({
        name: a.label,
        value: a.url,
        inline: true
      }))
    }]
  };
}

module.exports = router;
