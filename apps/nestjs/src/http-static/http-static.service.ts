import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getIndexHtml } from '@/utils/get-static';

@Injectable()
export class HttpStaticService {
  private CACHE_KEY = 'http-static';
  private getCacheKey = (path: string) => {
    return `${this.CACHE_KEY}:${path}`;
  };
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  async getIndexHtmlByCache(path): Promise<string> {
    const cacheKey = this.getCacheKey(path);
    const cache = await this.cacheManager.get(cacheKey);
    if (cache) {
      return cache;
    }
    try {
      const str = await getIndexHtml(path);
      await this.cacheManager.set(cacheKey, str);
      return str;
    } catch {}
    return '';
  }
}
