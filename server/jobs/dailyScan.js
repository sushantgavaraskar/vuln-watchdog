const cron = require('node-cron');
const prisma = require('../config/db');
const cveFetcher = require('../utils/cveFetcher');

module.exports = () => {
  cron.schedule('0 0 * * *', async () => {
    const projects = await prisma.project.findMany();
    for (const project of projects) {
      const deps = await prisma.dependency.findMany({ where: { projectId: project.id } });
      for (const dep of deps) {
        const issues = await cveFetcher.fetchCVEs(dep);
        await prisma.issue.deleteMany({ where: { dependencyId: dep.id } });
        for (const issue of issues) {
          await prisma.issue.create({ data: { title: issue.title, description: issue.description, severity: issue.severity, dependencyId: dep.id, cveId: issue.cveId } });
        }
      }
    }
    console.log('Daily scan complete');
  });
};