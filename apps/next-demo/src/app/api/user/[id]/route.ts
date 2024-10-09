import { cookies, headers } from 'next/headers';
import { db } from '@/server/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const requestHeaders = new Headers(request.headers);
  // 获取 id
  const userId = params.id;
  const user = await db.user.findUnique({
    where: {
      id: Number(userId),
    },
  });
  console.log(requestHeaders);
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const headersList = headers();
  const referer = headersList.get('referer');
  // return user if exists
  if (user) {
    return new Response(JSON.stringify(user), {
      headers: {
        'content-type': 'application/json',
        'Set-Cookie': `token=${token?.value || ''}`,
        referer: referer || '',
      },
    });
  } else {
    return new Response('User not found', {
      status: 404,
      headers: {
        'content-type': 'text/plain',
        'Set-Cookie': `token=${token?.value || ''}`,
        referer: referer || '',
      },
    });
  }
}
