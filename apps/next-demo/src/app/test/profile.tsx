import { useContext } from 'react';
import { TestContext } from './context';

export default function Profile() {
  const test = useContext(TestContext);
  return <div className="test-page__profile">{test}</div>;
}
