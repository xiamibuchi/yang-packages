import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';

function findRootDir(dir: string): string {
  const parentDir = dirname(dir);
  if (dir === parentDir) {
    return dir;
  }

  return findRootDir(parentDir);
}

// Root paths
export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
export const ES_DIR = join(ROOT, 'es');
export const LIB_DIR = join(ROOT, 'lib');
export const DOCS_DIR = join(ROOT, 'docs');
export const SITE_DIST_DIR = join(ROOT, 'site-dist');
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const CJS_DIR = join(__dirname, '..', '..', 'cjs');
export const DIST_DIR = join(__dirname, '..', '..', 'dist');
export const CONFIG_DIR = join(__dirname, '..', 'config');
export const SITE_SRC_DIR = join(__dirname, '..', '..', 'site');

// Dist files
export const PACKAGE_ENTRY_FILE = join(DIST_DIR, 'package-entry.js');
export const PACKAGE_STYLE_FILE = join(DIST_DIR, 'package-style.css');

export const STYLE_DEPS_JSON_FILE = join(DIST_DIR, 'style-deps.json');

// Config files
export const POSTCSS_CONFIG_FILE = join(CJS_DIR, 'postcss.config.cjs');
export const JEST_CONFIG_FILE = join(CJS_DIR, 'jest.config.cjs');

export const SCRIPT_EXTS = [
  '.js',
  '.jsx',
  '.vue',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
];
export const STYLE_EXTS = ['.css', '.less', '.scss'];

export function getPackageJson() {
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

const syConfig = {
  name: 'sy',
  build: {
    srcDir: 'src',
    namedExport: true,
    skipInstall: ['lazyload'],
    extensions: {
      esm: '.mjs',
    },
    tagPrefix: 'sy-',
    vetur: {
      tagPrefix: 'sy-',
    },
    css: {
      removeSourceFile: true,
      base: '',
      preprocessor: 'scss',
    },
  },
  configureVite: null,
};

export function getSyConfig() {
  return syConfig;
}

function getSrcDir() {
  const syConfig = getSyConfig();
  const srcDir = syConfig.build?.srcDir;

  if (srcDir) {
    if (isAbsolute(srcDir)) {
      return srcDir;
    }

    return join(ROOT, srcDir);
  }

  return join(ROOT, 'src');
}

export const SRC_DIR = getSrcDir();
export const STYLE_DIR = join(SRC_DIR, 'style');
