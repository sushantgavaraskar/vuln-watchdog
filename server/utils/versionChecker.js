// Version checker util
const axios = require('axios');

// Version comparison utility
const compareVersions = (v1, v2) => {
  const normalize = v => v.replace(/^[^\d]*/, '').replace(/[^\d.]/g, '');
  const n1 = normalize(v1).split('.').map(Number);
  const n2 = normalize(v2).split('.').map(Number);
  
  for (let i = 0; i < Math.max(n1.length, n2.length); i++) {
    const num1 = n1[i] || 0;
    const num2 = n2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

// Check latest version from npm registry
exports.checkLatestNpm = async (packageName) => {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);
    return response.data.version;
  } catch (error) {
    console.error(`Error fetching latest version for ${packageName}:`, error.message);
    return null;
  }
};

// Check latest version from PyPI
exports.checkLatestPyPI = async (packageName) => {
  try {
    const response = await axios.get(`https://pypi.org/pypi/${packageName}/json`);
    return response.data.info.version;
  } catch (error) {
    console.error(`Error fetching latest version for ${packageName}:`, error.message);
    return null;
  }
};

// Generic version checker
exports.checkLatest = async (dep) => {
  try {
    let latestVersion = null;
    
    // Try different registries based on package name patterns
    if (dep.name.includes('@') || dep.name.match(/^[a-z-]+$/)) {
      // Likely npm package
      latestVersion = await exports.checkLatestNpm(dep.name);
    } else if (dep.name.includes('_') || dep.name.match(/^[a-z-]+$/)) {
      // Likely PyPI package
      latestVersion = await exports.checkLatestPyPI(dep.name);
    }
    
    if (latestVersion) {
      const comparison = compareVersions(dep.version, latestVersion);
      return {
        current: dep.version,
        latest: latestVersion,
        isOutdated: comparison < 0,
        updateAvailable: comparison < 0,
        severity: comparison < 0 ? 'medium' : 'low'
      };
    }
    
    return {
      current: dep.version,
      latest: null,
      isOutdated: false,
      updateAvailable: false,
      severity: 'unknown'
    };
  } catch (error) {
    console.error('Error checking version:', error);
    return {
      current: dep.version,
      latest: null,
      isOutdated: false,
      updateAvailable: false,
      severity: 'unknown'
    };
  }
};

// Check if version is vulnerable (basic check)
exports.isVulnerableVersion = (version, vulnerableVersions = []) => {
  if (!vulnerableVersions.length) return false;
  
  return vulnerableVersions.some(vulnVersion => {
    // Check if current version matches vulnerable version pattern
    if (vulnVersion.includes('<')) {
      const maxVersion = vulnVersion.replace('<', '');
      return compareVersions(version, maxVersion) < 0;
    }
    if (vulnVersion.includes('>=')) {
      const minVersion = vulnVersion.replace('>=', '');
      return compareVersions(version, minVersion) >= 0;
    }
    if (vulnVersion.includes('=')) {
      const exactVersion = vulnVersion.replace('=', '');
      return version === exactVersion;
    }
    
    return version === vulnVersion;
  });
};