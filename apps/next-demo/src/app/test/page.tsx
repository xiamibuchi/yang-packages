'use client';
import { useState } from 'react';
import Profile from './profile';
import './styles.scss';

export default function TestPage() {
  function MyButton() {
    const [count, setCount] = useState(0);
    function handleClick() {
      setCount(count + 1);
    }
    return <button onClick={handleClick}>I'm {count}</button>;
  }
  return (
    <div className="test-page">
      <Profile />
      <MyButton />
      <br></br>
      <MyButton />
    </div>
  );
}
