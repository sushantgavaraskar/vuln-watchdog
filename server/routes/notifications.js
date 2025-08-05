const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: List in-app notifications with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [system, security, scan, collaboration]
 *     responses:
 *       200:
 *         description: List of notifications with pagination
 */
router.get('/', auth, notificationController.listNotifications);

/**
 * @swagger
 * /api/notifications/stream:
 *   get:
 *     summary: Server-Sent Events stream for real-time notifications
 *     responses:
 *       200:
 *         description: Event stream for real-time notifications
 */
router.get('/stream', auth, notificationController.streamNotifications);

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

/**
 * @swagger
 * /api/notifications/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.post('/read-all', auth, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     responses:
 *       200:
 *         description: Unread notification count
 */
router.get('/unread-count', auth, notificationController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/test:
 *   post:
 *     summary: Create a test notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [system, security, scan, collaboration]
 *     responses:
 *       200:
 *         description: Test notification created
 */
router.post('/test', auth, notificationController.createTestNotification);

module.exports = router; 