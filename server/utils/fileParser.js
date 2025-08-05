// File parser util
const xml2js = require('xml2js');

const detectAndParse = (content, filename = '') => {
  try {
    if (filename.endsWith('package.json') || content.trim().startsWith('{')) {
      // package.json
      const pkg = JSON.parse(content);
      return Object.entries(pkg.dependencies || {}).map(([name, version]) => ({ name, version }));
    } else if (filename.endsWith('requirements.txt')) {
      // requirements.txt
      return content.split('\n').filter(Boolean).map(line => {
        const [name, version] = line.split('==');
        return { name: name.trim(), version: (version || '').trim() };
      });
    } else if (filename.endsWith('Gemfile')) {
      // Gemfile (very basic Ruby gem parser)
      return content.split('\n').filter(line => line.startsWith('gem ')).map(line => {
        const match = line.match(/gem ['\"]([^'\"]+)['\"],?\s*['\"]?([^'\"]*)['\"]?/);
        return match ? { name: match[1], version: match[2] || '' } : null;
      }).filter(Boolean);
    } else if (filename.endsWith('composer.json')) {
      // composer.json (PHP)
      const comp = JSON.parse(content);
      return Object.entries(comp.require || {}).map(([name, version]) => ({ name, version }));
    } else if (filename.endsWith('go.mod')) {
      // go.mod (Go)
      return content.split('\n').filter(line => line.startsWith('require ')).map(line => {
        const parts = line.replace('require ', '').split(' ');
        return { name: parts[0], version: parts[1] || '' };
      });
    } else if (filename.endsWith('pom.xml')) {
      // pom.xml (Maven)
      let deps = [];
      xml2js.parseString(content, (err, result) => {
        if (err) return [];
        const dependencies = result?.project?.dependencies?.[0]?.dependency || [];
        deps = dependencies.map(dep => ({
          name: dep.artifactId?.[0] || '',
          version: dep.version?.[0] || ''
        }));
      });
      return deps;
    } else {
      // fallback: try requirements.txt style
      return content.split('\n').filter(Boolean).map(line => {
        const [name, version] = line.split('==');
        return { name: name.trim(), version: (version || '').trim() };
      });
    }
  } catch {
    return [];
  }
};
exports.detectAndParse = detectAndParse;