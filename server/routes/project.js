const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Get project details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project details
 */
router.get('/:id', auth, projectController.getProjectDetails);

/**
 * @swagger
 * /api/project/{id}/collaborator:
 *   post:
 *     summary: Add collaborator to project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Collaborator added
 */
router.post('/:id/collaborator', auth, projectController.addCollaborator);

/**
 * @swagger
 * /api/project/{id}/export:
 *   get:
 *     summary: Export project report
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *     responses:
 *       200:
 *         description: Exported report
 */
router.get('/:id/export', auth, projectController.exportProject);

module.exports = router;