const path = require('path');
const fs = require('fs-extra');

const appPath = process.cwd();

const pkgPath = pkg => path.dirname(require.resolve(`${pkg}/package.json`));

const cacheDir = path.resolve(appPath, '.cache');

// lister les pluigns
// copy l'admin et les plugin
// builder

const pkgJSON = require(path.join(appPath, 'package.json'));

fs.copySync(
  path.resolve(pkgPath('strapi-admin'), 'admin'),
  path.resolve(cacheDir, 'admin')
);

fs.copySync(
  path.resolve(pkgPath('strapi-admin'), 'config'),
  path.resolve(cacheDir, 'config')
);

const strapiDeps = Object.keys(pkgJSON.dependencies).filter(dep =>
  dep.startsWith('strapi-plugin')
);

strapiDeps.forEach(dep => {
  const pkgFilePath = pkgPath(dep);

  fs.ensureDirSync(path.resolve(cacheDir, 'plugins', dep));
  fs.copySync(
    path.resolve(pkgFilePath, 'admin'),
    path.resolve(cacheDir, 'plugins', dep, 'admin')
  );
  fs.copySync(
    path.resolve(pkgFilePath, 'config'),
    path.resolve(cacheDir, 'plugins', dep, 'config')
  );
  fs.copySync(
    path.resolve(pkgFilePath, 'package.json'),
    path.resolve(cacheDir, 'plugins', dep, 'package.json')
  );
});

fs.writeFileSync(
  path.resolve(cacheDir, 'admin', 'src', 'plugins.js'),
  `module.exports = [
        ${strapiDeps
          .map(p => `require('../../plugins/${p}/admin/src').default`)
          .join(',')}
      ]\n
    `,
  'utf8'
);
