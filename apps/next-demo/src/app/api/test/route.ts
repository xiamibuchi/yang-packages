import { cookies, headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { db } from '@/server/db';

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const users = await db.user.findMany();
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const headersList = headers();
  const referer = headersList.get('referer');
  return new Response('Hello, World!', {
    headers: {
      'content-type': 'text/plain',
      'Set-Cookie': `token=${token?.value || ''}`,
      referer: referer || '',
    },
  });
}
