const prisma = require('../config/db');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const project = await prisma.project.create({ data: { name, description, userId } });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    // Include dependencies and their issues so the frontend dashboard can compute stats
    const projects = await prisma.project.findMany({ 
      where: { userId },
      include: { 
        dependencies: { include: { issues: true } },
        collaborators: true
      }
    });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const project = await prisma.project.findUnique({
      where: { id: Number(id), userId },
      include: { dependencies: { include: { issues: true } }, collaborators: true }
    });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.id;
    const project = await prisma.project.findUnique({ where: { id: Number(id), userId } });
    if (!project) return res.status(403).json({ error: 'Forbidden' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await prisma.collaborator.create({ data: { userId: user.id, projectId: Number(id) } });
    res.json({ status: 'Collaborator added' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.exportProject = async (req, res) => {
  try {
    // Placeholder: implement PDF/CSV export logic
    res.json({ status: 'Export not implemented yet' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};