import { join } from 'node:path';
import {
  existsSync,
  outputFileSync,
  readFileSync,
  readdirSync,
} from 'fs-extra';
import {
  VUE_COMPONENTS_PACKAGE_FILE,
  VUE_COMPONENTS_SRC_ROOT,
} from './constants';

type PathResolver = (path: string) => string;

const ENTRY_EXTS = ['js', 'ts', 'tsx', 'jsx', 'vue'];
const camelizeRE = /-(\w)/g;
const pascalizeRE = /(\w)(\w*)/g;

export function camelize(str: string): string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

export function pascalize(str: string): string {
  return camelize(str).replace(
    pascalizeRE,
    (_, c1, c2) => c1.toUpperCase() + c2,
  );
}
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export function getPackageJson() {
  const rawJson = readFileSync(VUE_COMPONENTS_PACKAGE_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

function hasDefaultExport(code: string) {
  return code.includes('export default') || code.includes('export { default }');
}

export function getComponents(rootDir: string) {
  const EXCLUDES = ['.DS_Store'];
  const dirs = readdirSync(rootDir);

  return dirs
    .filter((dir) => !EXCLUDES.includes(dir))
    .filter((dir) =>
      ENTRY_EXTS.some((ext) => {
        const path = join(rootDir, dir, `index.${ext}`);
        if (existsSync(path)) {
          return hasDefaultExport(readFileSync(path, 'utf-8'));
        }

        return false;
      }),
    );
}
function getPathByName(name: string, pathResolver?: PathResolver) {
  let path = join(VUE_COMPONENTS_SRC_ROOT, name);
  if (pathResolver) {
    path = pathResolver(path);
  }
  return normalizePath(path);
}

function genImports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean,
): string {
  return names
    .map((name) => {
      const pascalName = pascalize(name);
      const importName = namedExport ? `{ ${pascalName} }` : pascalName;
      const importPath = getPathByName(name, pathResolver);

      return `import ${importName} from '${importPath}';`;
    })
    .join('\n');
}

function genExports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean,
): string {
  if (namedExport) {
    const exports = names
      .map((name) => `export * from '${getPathByName(name, pathResolver)}';`)
      .join('\n');

    return `
  export {
    install,
    version,
  };
  ${exports}
`;
  }

  return `
  export {
    install,
    version,
    ${names.map(pascalize).join(',\n  ')}
  };
  `;
}
export function smartOutputFile(filePath: string, content: string) {
  if (existsSync(filePath)) {
    const previousContent = readFileSync(filePath, 'utf-8');

    if (previousContent === content) {
      return;
    }
  }

  outputFileSync(filePath, content);
}
export function genPackageEntry({
  outputPath,
  pathResolver,
}: {
  outputPath: string;
  pathResolver?: PathResolver;
}) {
  const names = getComponents(VUE_COMPONENTS_SRC_ROOT);

  const namedExport = true;
  const skipInstall = ['lazyload'].map(pascalize);

  const version = process.env.PACKAGE_VERSION || getPackageJson().version;

  const components = names.map(pascalize);
  const content = `${genImports(names, pathResolver, namedExport)}

const version = '${version}';

function install(app) {
  const components = [
    ${components.filter((item) => !skipInstall.includes(item)).join(',\n    ')}
  ];

  components.forEach(item => {
    if (item.install) {
      app.use(item);
    } else if (item.name) {
      app.component(item.name, item);
    }
  });
}

${genExports(names, pathResolver, namedExport)}

export default {
  install,
  version
};
`;

  smartOutputFile(outputPath, content);
}
