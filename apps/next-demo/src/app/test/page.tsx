'use client';
import { useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useOnlineStatus } from '../../hooks/use-online-status';
import Profile from './profile';
import './styles.scss';
import StopWatch from './components/stop-watch/stop-watch.tsx';

const initialState = { count: 0 };

function reducer(
  state: {
    count: number;
  },
  action: {
    type: string;
  },
) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      throw new Error();
  }
}

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function TestPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const ref = useRef(0); // { current: 0 } // 修改 state 不会触发重新渲染
  function MyButton() {
    const [count, setCount] = useState(0);
    function handleClick() {
      ref.current = ref.current + 1;
      setCount(count + 1);
      alert(`You clicked ${ref.current} times!`);
    }
    return <button onClick={handleClick}>I'm {count}</button>;
  }
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="test-page">
      <div>
        <h2>router</h2>
        <div>当前路径：{pathname}</div>
        <Link href="/" scroll={false}>
          Home by Link
        </Link>
        <div onClick={() => router.push('/', { scroll: false })}>
          Home by router.push
        </div>
        <div onClick={() => router.replace('/')}>Home by router.redirect</div>
        <div>searchParams：{searchParams.toString()}</div>
      </div>
      <StatusBar />
      <Profile />
      <MyButton />
      <br></br>
      <MyButton />
      <div>
        <div>Count: {state.count}</div>
        <button
          className="font-bold"
          onClick={() => dispatch({ type: 'increment' })}
        >
          +
        </button>
        <button
          className="font-bold"
          onClick={() => dispatch({ type: 'decrement' })}
        >
          -
        </button>
      </div>
      <StopWatch />
    </div>
  );
}
