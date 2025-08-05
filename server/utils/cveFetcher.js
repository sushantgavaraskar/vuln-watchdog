const axios = require('axios');
exports.fetchCVEs = async (dep) => {
  try {
    const res = await axios.post('https://api.osv.dev/v1/query', {
      package: { name: dep.name },
      version: dep.version
    });
    return (res.data.vulns || []).map(v => ({
      title: v.summary || v.id,
      description: v.details || '',
      severity: v.severity ? v.severity[0].type : 'unknown',
      cveId: v.id
    }));
  } catch {
    return [];
  }
};