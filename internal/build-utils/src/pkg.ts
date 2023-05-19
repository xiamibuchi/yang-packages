export const PKG_PREFIX = '@syseven';

export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath);
};

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

export const excludeFiles = (files: string[]) => {
  const excludes = [
    'node_modules',
    'test',
    'mock',
    'gulpfile',
    'dist',
    'icons-svg',
    'icons-vue',
  ];
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};
