import { existsSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { getSyConfig } from '../common/index.js';
import { SRC_DIR, STYLE_DIR } from './constant.js';

function getCssLang(): string {
  const syConfig = getSyConfig();
  const preprocessor = syConfig.build?.css?.preprocessor || 'scss';

  if (preprocessor === 'scss' || preprocessor === 'sass') {
    return 'scss';
  }

  return preprocessor;
}

export const CSS_LANG = getCssLang();

export function getCssBaseFile() {
  const syConfig = getSyConfig();
  let path = join(STYLE_DIR, `base.${CSS_LANG}`);

  const baseFile = syConfig.build?.css?.base || '';
  if (baseFile) {
    path = isAbsolute(baseFile) ? baseFile : join(SRC_DIR, baseFile);
  }

  if (existsSync(path)) {
    return path;
  }

  return null;
}

const IMPORT_STYLE_RE = /import\s+?(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

// "import 'a.scss';" => "import 'a.css';"
export function replaceCSSImportExt(code: string) {
  return code.replace(IMPORT_STYLE_RE, (str) =>
    str.replace(`.${CSS_LANG}`, '.css')
  );
}
