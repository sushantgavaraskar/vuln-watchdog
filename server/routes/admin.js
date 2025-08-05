const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all users (admin)
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', auth, admin, notificationController.listUsers);

/**
 * @swagger
 * /api/admin/projects:
 *   get:
 *     summary: List all projects (admin)
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/projects', auth, admin, notificationController.listProjects);

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get audit logs (admin)
 *     responses:
 *       200:
 *         description: List of audit logs
 */
router.get('/logs', auth, admin, notificationController.listAuditLogs);

module.exports = router; 