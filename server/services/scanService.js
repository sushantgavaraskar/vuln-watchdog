// Scan service
const prisma = require('../config/db');
const fileParser = require('../utils/fileParser');
const cveFetcher = require('../utils/cveFetcher');
const versionChecker = require('../utils/versionChecker');
const NotificationService = require('./notificationService');
const logger = require('../utils/logger');

exports.orchestrateScan = async (projectId, file) => {
  try {
    logger.log(`Starting scan for project ${projectId}`);
    
    // Read and parse the uploaded file
    const fileContent = file.buffer.toString('utf-8');
    const deps = fileParser.detectAndParse(fileContent, file.originalname);
    
    if (!deps || deps.length === 0) {
      throw new Error('No dependencies found in the uploaded file');
    }
    
    logger.log(`Found ${deps.length} dependencies in ${file.originalname}`);
    
    const results = [];
    const scanStartTime = new Date();
    
    // Process each dependency
    for (const dep of deps) {
      try {
        logger.log(`Processing dependency: ${dep.name}@${dep.version}`);
        
        // Fetch CVE data
        const issues = await cveFetcher.fetchCVEs(dep);
        
        // Check for version updates
        const versionInfo = await versionChecker.checkLatest(dep);
        
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
          vulnerabilityCount: issues.length,
          versionInfo,
          risk: issues.some(i => i.severity === 'CRITICAL') ? 'critical' :
                issues.some(i => i.severity === 'HIGH') ? 'high' :
                issues.some(i => i.severity === 'MEDIUM') ? 'medium' :
                issues.some(i => i.severity === 'LOW') ? 'low' : 'secure'
        });
        
        logger.log(`Completed processing ${dep.name}: ${issues.length} vulnerabilities found`);
        
      } catch (depError) {
        logger.error(`Error processing dependency ${dep.name}:`, depError);
        results.push({
          dependency: { name: dep.name, version: dep.version },
          error: 'Failed to process dependency',
          vulnerabilities: [],
          risk: 'unknown'
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
    const highVulnerabilities = results.reduce((sum, result) => 
      sum + (result.vulnerabilities ? result.vulnerabilities.filter(v => v.severity === 'HIGH').length : 0), 0
    );
    
    const scanResults = {
      totalDependencies,
      totalVulnerabilities,
      criticalVulnerabilities,
      highVulnerabilities,
      scanDate: scanStartTime.toISOString(),
      duration: Date.now() - scanStartTime.getTime()
    };
    
    logger.log(`Scan completed for project ${projectId}: ${totalVulnerabilities} vulnerabilities found`);
    
    return {
      results,
      summary: scanResults,
      success: true
    };
    
  } catch (error) {
    logger.error('Scan orchestration failed:', error);
    throw error;
  }
};

// Get scan statistics for a project
exports.getScanStats = async (projectId) => {
  try {
    const deps = await prisma.dependency.findMany({
      where: { projectId: Number(projectId) },
      include: { issues: true }
    });
    
    const stats = {
      totalDependencies: deps.length,
      totalVulnerabilities: deps.reduce((sum, dep) => sum + dep.issues.length, 0),
      criticalVulnerabilities: deps.reduce((sum, dep) => 
        sum + dep.issues.filter(i => i.severity === 'CRITICAL').length, 0
      ),
      highVulnerabilities: deps.reduce((sum, dep) => 
        sum + dep.issues.filter(i => i.severity === 'HIGH').length, 0
      ),
      mediumVulnerabilities: deps.reduce((sum, dep) => 
        sum + dep.issues.filter(i => i.severity === 'MEDIUM').length, 0
      ),
      lowVulnerabilities: deps.reduce((sum, dep) => 
        sum + dep.issues.filter(i => i.severity === 'LOW').length, 0
      ),
      lastScanDate: deps.length > 0 ? 
        new Date(Math.max(...deps.map(d => d.createdAt.getTime()))) : null
    };
    
    return stats;
  } catch (error) {
    logger.error('Error getting scan stats:', error);
    throw error;
  }
};