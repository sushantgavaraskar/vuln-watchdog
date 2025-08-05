const prisma = require('../config/db');
const fileParser = require('../utils/fileParser');
const cveFetcher = require('../utils/cveFetcher');
const dependencyService = require('../services/dependencyService');
const { cleanupFile } = require('../utils/uploadConfig');
const fs = require('fs');

exports.initiateScan = async (req, res) => {
  let uploadedFilePath = null;
  
  try {
    const { projectId } = req.body;
    const file = req.file;
    const userId = req.user.id;

    // Validate project ownership
    const project = await prisma.project.findUnique({ 
      where: { id: Number(projectId), userId } 
    });
    
    if (!project) {
      return res.status(403).json({ error: 'Project not found or access denied' });
    }

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    uploadedFilePath = file.path;

    // Read and parse the uploaded file
    const fileContent = fs.readFileSync(file.path, 'utf-8');
    const deps = fileParser.detectAndParse(fileContent, file.originalname);

    if (!deps || deps.length === 0) {
      return res.status(400).json({ 
        error: 'No dependencies found in the uploaded file',
        supportedFiles: ['package.json', 'requirements.txt', 'pom.xml', 'Gemfile', 'composer.json', 'go.mod']
      });
    }

    let results = [];
    
    // Process each dependency
    for (const dep of deps) {
      try {
        // Fetch CVE data for the dependency
        const issues = await cveFetcher.fetchCVEs(dep);
        
        // Save dependency to database
        const dbDep = await prisma.dependency.create({ 
          data: { 
            name: dep.name, 
            version: dep.version, 
            projectId: Number(projectId) 
          } 
        });

        // Save issues to database
        for (const issue of issues) {
          await prisma.issue.create({ 
            data: { 
              title: issue.title, 
              description: issue.description, 
              severity: issue.severity, 
              dependencyId: dbDep.id, 
              cveId: issue.cveId 
            } 
          });
        }

        results.push({ 
          dependency: { ...dbDep }, 
          vulnerabilities: issues,
          vulnerabilityCount: issues.length
        });
        
      } catch (depError) {
        console.error(`Error processing dependency ${dep.name}:`, depError);
        // Continue with other dependencies even if one fails
        results.push({ 
          dependency: { name: dep.name, version: dep.version }, 
          error: 'Failed to process dependency',
          vulnerabilities: []
        });
      }
    }

    // Calculate summary statistics
    const totalDependencies = results.length;
    const totalVulnerabilities = results.reduce((sum, result) => 
      sum + (result.vulnerabilities ? result.vulnerabilities.length : 0), 0
    );
    const criticalVulnerabilities = results.reduce((sum, result) => 
      sum + (result.vulnerabilities ? result.vulnerabilities.filter(v => v.severity === 'CRITICAL').length : 0), 0
    );

    res.json({ 
      status: 'Scan complete', 
      results,
      summary: {
        totalDependencies,
        totalVulnerabilities,
        criticalVulnerabilities,
        scanDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Failed to process scan',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Clean up uploaded file
    if (uploadedFilePath) {
      cleanupFile(uploadedFilePath);
    }
  }
};

exports.getScanResults = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    
    const project = await prisma.project.findUnique({ 
      where: { id: Number(projectId), userId } 
    });
    
    if (!project) {
      return res.status(403).json({ error: 'Project not found or access denied' });
    }

    const deps = await prisma.dependency.findMany({ 
      where: { projectId: Number(projectId) }, 
      include: { issues: true } 
    });

    const classified = dependencyService.classifyRisks(
      deps.map(d => ({ ...d, issues: d.issues }))
    );

    res.json(classified);
  } catch (error) {
    console.error('Get scan results error:', error);
    res.status(500).json({ error: 'Failed to retrieve scan results' });
  }
};

exports.getScanHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    
    const project = await prisma.project.findUnique({ 
      where: { id: Number(projectId), userId } 
    });
    
    if (!project) {
      return res.status(403).json({ error: 'Project not found or access denied' });
    }

    const deps = await prisma.dependency.findMany({ 
      where: { projectId: Number(projectId) }, 
      include: { issues: true },
      orderBy: { createdAt: 'desc' }
    });

    // Group by scan date (for now, using dependency creation date)
    const history = deps.map(dep => ({
      id: dep.id,
      dependencyName: dep.name,
      dependencyVersion: dep.version,
      scanDate: dep.createdAt,
      vulnerabilityCount: dep.issues.length,
      criticalCount: dep.issues.filter(i => i.severity === 'CRITICAL').length,
      highCount: dep.issues.filter(i => i.severity === 'HIGH').length,
      mediumCount: dep.issues.filter(i => i.severity === 'MEDIUM').length,
      lowCount: dep.issues.filter(i => i.severity === 'LOW').length
    }));

    res.json({ history });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({ error: 'Failed to retrieve scan history' });
  }
};