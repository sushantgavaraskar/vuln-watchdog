const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

module.exports = async (req, res, next) => {
  // Support Authorization header (preferred) and `?token=` query param (for SSE/EventSource)
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const userId = decoded.userId || decoded.id; // support both payload shapes
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    req.user = { id: user.id, role: user.role || 'user' };
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};