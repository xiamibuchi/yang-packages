'use client';
import { useReducer, useRef, useState } from 'react';
import { useOnlineStatus } from '../../hooks/use-online-status';
import Profile from './profile';
import './styles.scss';
import StopWatch from './components/StopWatch/StopWatch.tsx';

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
  return (
    <div className="test-page">
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
