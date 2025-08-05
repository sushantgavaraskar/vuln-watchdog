// Dependency service
exports.parseFile = async (file) => {
  // Already handled in fileParser
};
exports.classifyRisks = (deps) => {
  return deps.map(dep => {
    let risk = 'secure';
    if (dep.issues.some(i => i.severity === 'CRITICAL')) risk = 'critical';
    else if (dep.issues.some(i => i.severity === 'HIGH')) risk = 'high';
    else if (dep.issues.some(i => i.severity === 'MEDIUM')) risk = 'medium';
    else if (dep.issues.some(i => i.severity === 'LOW')) risk = 'low';
    return { ...dep, risk };
  });
};