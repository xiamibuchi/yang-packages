import { join } from 'node:path';
import { existsSync, readFileSync, statSync } from 'fs-extra';
import { STATIC_PATH } from '../constant/config';

export async function getStaticFile(path): Promise<string> {
  const filePath = join(STATIC_PATH, path);
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return readFileSync(filePath, 'utf8');
  }
  return '';
}

export async function getIndexHtml(path): Promise<string> {
  const filePath = join(STATIC_PATH, path);
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return readFileSync(filePath, 'utf8');
  }
  const indexPath = join(filePath, 'index.html');
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    return readFileSync(filePath, 'utf8');
  }
  return '';
}
