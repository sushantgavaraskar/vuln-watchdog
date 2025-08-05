const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/alerts/config:
 *   post:
 *     summary: Set alert configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *               dailyDigest:
 *                 type: boolean
 *               securityAlerts:
 *                 type: boolean
 *               alertFrequency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert config saved
 */
router.post('/config', auth, alertController.setAlertConfig);

/**
 * @swagger
 * /api/alerts/test:
 *   post:
 *     summary: Send test alert
 *     responses:
 *       200:
 *         description: Test alert sent
 */
router.post('/test', auth, alertController.sendTestAlert);

module.exports = router;