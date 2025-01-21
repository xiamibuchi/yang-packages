import { join } from 'node:path';

export const STATIC_PATH = join(process.cwd(), 'client');

export const configuration = () => ({
  port: process.env.PORT || 3000,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
});
