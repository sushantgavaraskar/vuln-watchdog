const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async ({ email, password, name, role }) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hashed, name, role: role || 'user' } });
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
  // Return full user object needed by frontend
  const { id, name, role, emailNotifications, dailyDigest, securityAlerts, alertFrequency, createdAt } = user;
  return {
    token,
    user: {
      id,
      email,
      name,
      role: role || 'user',
      emailNotifications: !!emailNotifications,
      dailyDigest: !!dailyDigest,
      securityAlerts: !!securityAlerts,
      alertFrequency: alertFrequency || 'immediate',
      createdAt
    }
  };
};