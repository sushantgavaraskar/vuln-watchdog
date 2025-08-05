const prisma = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { id, email, name, role, emailNotifications, dailyDigest, securityAlerts, alertFrequency } = user;
    res.json({ id, email, name, role, emailNotifications, dailyDigest, securityAlerts, alertFrequency });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, emailNotifications, dailyDigest, securityAlerts, alertFrequency } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, emailNotifications, dailyDigest, securityAlerts, alertFrequency }
    });
    res.json({ status: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};