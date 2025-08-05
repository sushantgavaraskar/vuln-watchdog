const authService = require('../services/authService');
const prisma = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await authService.register({ email, password, name, role });
    res.json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result) return res.status(401).json({ error: 'Invalid' });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.logout = async (req, res) => {
  // JWT is stateless; client should delete token
  res.json({ status: 'Logged out' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ status: 'If that email exists, a reset link will be sent.' });
    // TODO: Generate reset token, save to DB, send email
    // For now, just mock
    // await emailService.sendReset(user, token)
    res.json({ status: 'If that email exists, a reset link will be sent.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};