const prisma = require('../config/db');
const emailService = require('../services/emailService');

exports.setAlertConfig = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, dailyDigest, securityAlerts, alertFrequency } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { emailNotifications, dailyDigest, securityAlerts, alertFrequency }
    });
    res.json({ status: 'Alert config saved' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.sendTestAlert = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const result = await emailService.sendAlert(user, { subject: 'Test Alert', text: 'This is a test alert.' });
    
    if (result.success) {
      res.json({ status: 'Test alert sent successfully' });
    } else {
      // Don't fail the test if email is not configured
      res.json({ 
        status: 'Test alert processed', 
        message: result.message,
        note: 'Email not sent due to configuration issues'
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};