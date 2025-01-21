import { isServer } from '../env';

export const updateHTMLAttribute = (
  selector: string,
  attribute: string,
  value: string,
  isSwitch?: boolean, // 属性存在时是否切换
) => {
  if (isServer()) {
    return;
  }
  if (typeof selector !== 'string') {
    return;
  }
  const el = window?.document.querySelector(selector);
  if (!el) {
    return;
  }
  if (attribute === 'class') {
    if (isSwitch && el.classList.contains(value)) {
      return el.classList.remove(value);
    }
    return el.classList.add(value);
  }

  if (isSwitch && el.getAttribute(attribute) === value) {
    return el.removeAttribute(attribute);
  }
  return el.setAttribute(attribute, value);
};

let passiveSupported: boolean | null = null;
const initPassiveEventListenerOption = () => {
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      },
    } as EventListenerOptions;
    const TestListener = () => {};
    window.addEventListener('test', TestListener, options);
    window.removeEventListener('test', TestListener, options);
  } catch (err) {
    passiveSupported = false;
  }
};

export const getPassiveSupported = () => {
  if (passiveSupported === null) {
    initPassiveEventListenerOption();
  }
  return passiveSupported;
};

type AddEventListenerReturn = void | (() => void);
export function addEventListener<E extends keyof WindowEventMap>(
  target: Window,
  eventType: E,
  listener: (this: Window, ev: WindowEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): AddEventListenerReturn;
export function addEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  eventType: E,
  listener: (this: Window, ev: DocumentEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): AddEventListenerReturn;
export function addEventListener<E extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  eventType: E,
  listener: (this: Window, ev: HTMLElementEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): AddEventListenerReturn;
export function addEventListener(
  target: Window | Document | HTMLElement | null | undefined,
  eventType: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions,
): AddEventListenerReturn {
  if (!target) {
    return undefined;
  }
  let eventOptions;
  if (!options || typeof options === 'boolean' || getPassiveSupported()) {
    eventOptions = options;
  } else {
    eventOptions = options?.passive === true;
  }
  target.addEventListener(eventType, listener, eventOptions);
  return () => {
    target.removeEventListener(eventType, listener, eventOptions);
  };
}
