/**
 * @see https://github.com/willmcpo/body-scroll-lock
 */

import { isiOS } from '../browser/index';
import { isServer } from '../env';
import { addEventListener } from './html';

interface LockOptions {
  reserveScrollBarGap?: boolean;
  allowTouchMove: (target: EventTarget | null) => boolean;
}

interface Lock {
  targetElement: HTMLElement;
  options: LockOptions;
}

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
let locks: Lock[] = [];
let documentListenerAdded = false;
let initialClientY = -1;
let previousBodyOverflowSetting: string | undefined = undefined;
let previousBodyPosition:
  | {
      position: string;
      top: string;
      left: string;
    }
  | undefined = undefined;
let previousBodyPaddingRight: string | undefined = undefined;

function isScrollGutterStable(targetElement: HTMLElement) {
  const styles = window.getComputedStyle(targetElement);
  if (
    styles?.getPropertyValue('scrollbar-gutter') === 'stable' &&
    typeof CSS !== 'undefined' &&
    CSS?.supports('scrollbar-gutter: stable')
  ) {
    return true;
  } else {
    return false;
  }
}

function allowTouchMove(eventTarget: EventTarget | null) {
  return locks.some((lock) => {
    if (
      lock.options.allowTouchMove &&
      lock.options.allowTouchMove(eventTarget)
    ) {
      return true;
    }

    return false;
  });
}

function preventDefault(rawEvent: TouchEvent) {
  const e = rawEvent || window.event;
  if (allowTouchMove(e.target)) {
    return true;
  }

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) {
    return true;
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

function setOverflowHidden(options: LockOptions) {
  if (previousBodyPaddingRight === undefined) {
    if (options?.reserveScrollBarGap === true) {
      const scrollBarGap =
        window.innerWidth - document.documentElement.clientWidth;
      // if css scrollgutter is stable, no need to reserve the scrollbar gap
      if (scrollBarGap > 0 && !isScrollGutterStable(document.body)) {
        const computedBodyPaddingRight = parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue('padding-right'),
        );
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = `${computedBodyPaddingRight + scrollBarGap}px`;
      }
    }
  }

  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}

function restoreOverflowSetting() {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
    // can be set again.
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    previousBodyOverflowSetting = undefined;
  }
}

function setPositionFixed() {
  window.requestAnimationFrame(() => {
    if (previousBodyPosition === undefined) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
      };

      // Update the dom inside an animation frame
      const _window = window,
        scrollY = _window.scrollY,
        scrollX = _window.scrollX,
        innerHeight = _window.innerHeight;

      document.body.style.position = 'fixed';
      document.body.style.top = `${-scrollY}px`;
      document.body.style.left = `${-scrollX}px`;

      setTimeout(() => {
        window.requestAnimationFrame(() => {
          // Attempt to check if the bottom bar appeared due to the position change
          const bottomBarHeight = innerHeight - window.innerHeight;
          if (bottomBarHeight && scrollY >= innerHeight) {
            // Move the content further up so that the bottom bar doesn't hide it
            document.body.style.top = `${-(scrollY + bottomBarHeight)}`;
          }
        });
      }, 300);
    }
  });
}

const restorePositionSetting = function restorePositionSetting() {
  if (previousBodyPosition !== undefined) {
    const y = -parseInt(document.body.style.top);
    const x = -parseInt(document.body.style.left);

    // Restore styles
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;

    // Restore scroll
    window.scrollTo(x, y);

    previousBodyPosition = undefined;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
function isTargetElementTotallyScrolled(targetElement: HTMLElement) {
  return targetElement
    ? targetElement.scrollHeight - targetElement.scrollTop <=
        targetElement.clientHeight
    : false;
}

function handleScroll(event: TouchEvent, targetElement: HTMLElement) {
  const clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return preventDefault(event);
  }

  event.stopPropagation();
  return true;
}

export function disableBodyScroll(
  targetElement: HTMLElement,
  options: LockOptions,
) {
  if (isServer()) {
    return;
  }
  if (!targetElement) {
    console.error('need targetElement');
    return;
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (
    locks.some((lock) => {
      return lock.targetElement === targetElement;
    })
  ) {
    return;
  }

  const lock = {
    targetElement,
    options: options || {},
  };

  locks.push(lock);

  if (isiOS(navigator.userAgent)) {
    setPositionFixed();
    targetElement.ontouchstart = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function (event) {
      if (event.targetTouches.length === 1) {
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      addEventListener(document, 'touchmove', preventDefault, {
        passive: false,
      });
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
}

export function clearAllBodyScrollLocks() {
  if (isServer()) {
    return;
  }
  if (isiOS(navigator.userAgent)) {
    // Clear all locks ontouchstart/ontouchmove handlers, and the references.
    for (const lock of locks) {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    }
    if (documentListenerAdded) {
      document.removeEventListener('touchmove', preventDefault);
      documentListenerAdded = false;
    }

    // Reset initial clientY.
    initialClientY = -1;
  }

  if (isiOS(navigator.userAgent)) {
    restorePositionSetting();
  } else {
    restoreOverflowSetting();
  }
  locks = [];
}

export function enableBodyScroll(targetElement: HTMLElement) {
  if (isServer()) {
    return;
  }
  if (!targetElement) {
    console.error('need targetElement');
    return;
  }

  locks = locks.filter((lock) => {
    return lock.targetElement !== targetElement;
  });

  if (isiOS(navigator.userAgent)) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault);
      documentListenerAdded = false;
    }
  }

  if (isiOS(navigator.userAgent)) {
    restorePositionSetting();
  } else {
    restoreOverflowSetting();
  }
}
