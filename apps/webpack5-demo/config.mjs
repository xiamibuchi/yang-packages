import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const OUTPUT_DIR = resolve(__dirname, 'dist');
export const SRC_DIR = resolve(__dirname, 'src');
export const PUBLIC_DIR = resolve(__dirname, 'public');
export const SVG_ICON_DIR = resolve(__dirname, 'src/assets/icons');
