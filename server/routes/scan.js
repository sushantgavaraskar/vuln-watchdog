const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { upload, handleUploadError } = require('../utils/uploadConfig');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/scan/history/{projectId}:
 *   get:
 *     summary: Get scan history for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Scan history
 */
router.get('/history/:projectId', auth, scanController.getScanHistory);

/**
 * @swagger
 * /api/scan/:
 *   post:
 *     summary: Submit dependency file and initiate scan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Dependency file (package.json, requirements.txt, etc.)
 *               projectId:
 *                 type: integer
 *                 description: Project ID to associate the scan with
 *     responses:
 *       200:
 *         description: Scan complete
 *       400:
 *         description: Invalid file or upload error
 *       413:
 *         description: File too large
 */
router.post('/', auth, upload.single('file'), handleUploadError, scanController.initiateScan);

/**
 * @swagger
 * /api/scan/{projectId}:
 *   get:
 *     summary: Get scan results for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Scan results
 */
router.get('/:projectId', auth, scanController.getScanResults);

module.exports = router;