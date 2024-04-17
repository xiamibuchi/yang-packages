'use client';
import { useState } from 'react';
import './styles.scss';

const TEST_VAR = 'test';
export default function TestPage() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
  }
  function MyButton() {
    return <button onClick={handleClick}>I'm {count}</button>;
  }
  return (
    <div className="test-page">
      <h1>Welcome to my {TEST_VAR}</h1>
      <MyButton />
      <br></br>
      <MyButton />
    </div>
  );
}
