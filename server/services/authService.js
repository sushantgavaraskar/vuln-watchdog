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
  const token = jwt.sign({ id: user.id, role: user.role || 'user' }, process.env.JWT_SECRET || 'devsecret');
  return { token, role: user.role || 'user' };
};