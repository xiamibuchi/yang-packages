import { isServer } from '../env';

// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
interface NetworkInformation {
  saveData: boolean;
  effectiveType: string;
}

export const isSlowNetwork = () => {
  if (isServer()) {
    return false;
  }
  const connection = (
    navigator as Navigator & {
      connection: NetworkInformation;
    }
  ).connection;
  if (connection?.saveData || /(2|3)g/.test(connection?.effectiveType)) {
    return true;
  }
  return false;
};
