import { cookies, headers } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers);
  console.log(requestHeaders);
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
