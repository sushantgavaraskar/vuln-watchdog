const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               repositoryUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', auth, projectController.createProject);

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Get user's projects
 *     responses:
 *       200:
 *         description: List of user's projects
 */
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