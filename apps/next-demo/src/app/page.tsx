import Image from 'next/image';
import SyButton from '@/components/SyButton/SyButton.tsx';

const count = 0;

export default function Home() {
  return (
    <main className="flex">
      <SyButton />
      <div>{count}</div>
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
    </main>
  );
}
