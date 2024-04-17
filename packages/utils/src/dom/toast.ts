import { useNamespace } from '@syseven/hooks';
import { isServer } from '../env';

const getToastEl = (selector: string) => {
  if (isServer()) {
    return;
  }
  let toastEl = document.querySelector(selector) as HTMLDivElement | null;
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = selector;
    document.body.appendChild(toastEl);
  }
  return toastEl;
};

let timeout: number | null = null;
export const toast = ({
  message,
  duration = 3000,
  selector,
}: {
  message: string;
  duration?: number;
  selector?: string;
}) => {
  timeout && clearTimeout(timeout);
  const toastEl = getToastEl(selector || useNamespace('toast').b());
  if (!toastEl) {
    return;
  }
  toastEl.textContent = message;
  toastEl.style.opacity = '1';
  timeout = window.setTimeout(() => {
    toastEl.style.opacity = '0';
  }, duration);
};
