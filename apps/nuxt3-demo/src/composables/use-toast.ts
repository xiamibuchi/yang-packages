import '@syseven/style/src/components/toast.scss';
import { useNamespace } from '@syseven/hooks';
const ns = useNamespace('toast');

let timeout: number | null = null;
let tapToast: HTMLDivElement | null = null;
export function useToast() {
  const Toast = (message: string, duration: number = 3000) => {
    timeout && window.clearTimeout(timeout);
    timeout = null;
    if (tapToast) {
      tapToast.textContent = message;
      tapToast.style.opacity = '1';
    } else {
      tapToast = document.createElement('div');
      tapToast.className = ns.b();
      tapToast.textContent = message;
      document.body.appendChild(tapToast);
    }

    timeout = window.setTimeout(() => {
      tapToast && (tapToast.style.opacity = '0');
      timeout = null;
    }, duration);
  };
  return {
    Toast,
  };
}
