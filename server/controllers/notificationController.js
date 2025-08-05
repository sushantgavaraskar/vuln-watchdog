const prisma = require('../config/db');

exports.listNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
    res.json({ status: 'Notification marked as read' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.listAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};