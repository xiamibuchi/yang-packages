import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const OUTPUT_DIR = resolve(__dirname, 'dist');
export const SRC_DIR = resolve(__dirname, 'src');
export const SVG_ICON_DIR = resolve(__dirname, 'src/assets/icons');

export const ASSETS_FILE_NAME = 'assets/[name].[hash:8][ext]';
