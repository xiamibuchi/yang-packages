import { join } from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import { existsSync, readFileSync, statSync } from 'fs-extra';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { STATIC_PATH } from '../constant/config';

@Injectable()
export class HttpStaticService {
  private CACHE_KEY = 'http-static';
  private getCacheKey = (path: string) => {
    return `${this.CACHE_KEY}:${path}`;
  };
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  async getStaticFile(path): Promise<string> {
    const filePath = join(STATIC_PATH, path);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      return readFileSync(filePath, 'utf8');
    }
    return '';
  }
  async getIndexHtml(path): Promise<string> {
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
  async getIndexHtmlByCache(path): Promise<string> {
    const cacheKey = this.getCacheKey(path);
    const cache = await this.cacheManager.get(cacheKey);
    if (cache) {
      return cache;
    }
    try {
      const str = await this.getIndexHtml(path);
      await this.cacheManager.set(cacheKey, str);
      return str;
    } catch {}
    return '';
  }
}
