import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { User } from '../types/user.d.ts';

@Injectable()
export class UserService {
  private CACHE_KEY = 'user';
  private getCacheKey = (id: string) => {
    return `${this.CACHE_KEY}:${id}`;
  };
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.cacheManager.get(this.getCacheKey(id));
    if (user) {
      return user;
    }
    return null;
  }
}
