const prisma = require('../config/db');
const NotificationService = require('../services/notificationService');

// Store active SSE connections
const sseConnections = new Map();

exports.listNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const userId = req.user.id;

    const result = await NotificationService.getUserNotifications(
      userId, 
      parseInt(page), 
      parseInt(limit), 
      type
    );

    res.json(result);
  } catch (error) {
    console.error('Error listing notifications:', error);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
};

exports.streamNotifications = async (req, res) => {
  const userId = req.user.id;

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`);

  // Store connection for this user
  sseConnections.set(userId, res);

  // Send current unread count
  try {
    const unreadCount = await NotificationService.getUnreadCount(userId);
    res.write(`data: ${JSON.stringify({ type: 'unread_count', count: unreadCount })}\n\n`);
  } catch (error) {
    console.error('Error getting unread count for SSE:', error);
  }

  // Handle client disconnect
  req.on('close', () => {
    sseConnections.delete(userId);
    console.log(`SSE connection closed for user ${userId}`);
  });

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    if (sseConnections.has(userId)) {
      res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`);
    } else {
      clearInterval(heartbeat);
    }
  }, 30000); // 30 second heartbeat
};

// Function to send notification to specific user via SSE
exports.sendNotificationToUser = async (userId, notification) => {
  const connection = sseConnections.get(userId);
  if (connection) {
    try {
      connection.write(`data: ${JSON.stringify({ type: 'new_notification', notification })}\n\n`);
    } catch (error) {
      console.error('Error sending SSE notification:', error);
      sseConnections.delete(userId);
    }
  }
};

// Function to update unread count for user
exports.updateUnreadCount = async (userId) => {
  const connection = sseConnections.get(userId);
  if (connection) {
    try {
      const unreadCount = await NotificationService.getUnreadCount(userId);
      connection.write(`data: ${JSON.stringify({ type: 'unread_count', count: unreadCount })}\n\n`);
    } catch (error) {
      console.error('Error updating unread count via SSE:', error);
    }
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.id;

    if (!notificationId) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }

    const notification = await NotificationService.markAsRead(notificationId, userId);
    
    // Update unread count via SSE
    await this.updateUnreadCount(userId);
    
    res.json({ status: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await NotificationService.markAllAsRead(userId);
    
    // Update unread count via SSE
    await this.updateUnreadCount(userId);
    
    res.json({ status: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await NotificationService.getUnreadCount(userId);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

exports.createTestNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, type = 'system' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const notification = await NotificationService.createNotification(
      userId, 
      message, 
      type
    );

    // Send notification via SSE if user is connected
    await this.sendNotificationToUser(userId, notification);
    
    // Update unread count via SSE
    await this.updateUnreadCount(userId);

    res.json({ status: 'Test notification created', notification });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ error: 'Failed to create test notification' });
  }
};

// Admin functions (moved from admin routes)
exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        emailNotifications: true,
        securityAlerts: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        dependencies: {
          include: {
            issues: true
          }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};

exports.listAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error('Error listing audit logs:', error);
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
};