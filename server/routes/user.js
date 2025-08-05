const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile and alert config
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', auth, userController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile and alert config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
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
 *         description: Profile updated
 */
router.put('/profile', auth, userController.updateProfile);

module.exports = router; 