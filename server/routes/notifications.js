const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: List in-app notifications
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', auth, notificationController.listNotifications);

/**
 * @swagger
 * /api/notifications/read:
 *   post:
 *     summary: Mark notification as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.post('/read', auth, notificationController.markAsRead);

module.exports = router; 