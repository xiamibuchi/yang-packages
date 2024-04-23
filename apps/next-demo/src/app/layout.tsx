import type { Metadata } from 'next';
import { checkAuth } from '@/utils/auth';
import './globals.css';
import '@syseven/style/src/reset.scss';
import './styles.scss';

export const metadata: Metadata = {
  title: 'Next.js demo',
  description: 'test description',
};

export default function RootLayout({
  children,
  hometop,
}: Readonly<{
  children: React.ReactNode;
  hometop?: React.ReactNode;
}>) {
  const isAuth = checkAuth();
  if (!isAuth) {
    return <div>Unauthorized</div>;
  }
  return (
    <html lang="zh-CN">
      <body>
        {hometop}
        {children}
      </body>
    </html>
  );
}
