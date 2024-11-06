import { createElement } from '../../utils';
import { VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

interface DanmakuParam {
  text: string;
  color: string;
  time?: VideoPlayer['currentTime'];
}

const DEAULT_OPACITY = 0.87;

const htmlEncode = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2f;');
};

export default class Danmaku {
  player: VideoPlayer;
  el: HTMLElement;
  container: HTMLElement;
  options: any;
  unlimited: boolean;
  _opacity: number;
  danTunnel: {
    [key: string]: HTMLElement[];
  };
  context?: CanvasRenderingContext2D;
  getCurrentTime: () => number;

  showing = true;
  danIndex = 0;
  dan: DanmakuParam[] = [];
  paused = true;
  private _currentReq = 0;
  private _ended = false;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('input', 'sy-player__danmaku-input');
    this.container = createElement('div', 'sy-player__danmaku-box');
    this.player.appendChild(this.container);

    this.options = this.player.options.danmakuOptions || {
      opacity: DEAULT_OPACITY,
      unlimited: false,
    };
    this.danTunnel = {};
    if (
      typeof this.options.opacity !== 'number' ||
      this.options.opacity < 0 ||
      this.options.opacity > 1
    ) {
      this.options.opacity = DEAULT_OPACITY;
    }
    this._opacity = this.options.opacity;
    this.unlimited = this.options.unlimited || false;
    const defaultGetCurrentTime = () => {
      return this.player.currentTime;
    };
    this.getCurrentTime = this.options.getCurrentTime || defaultGetCurrentTime;
    this._measure('');

    this._init();
    this._initEvent();
    this.pause();
  }

  _init() {
    this._cancelFrame();
    this._currentReq = window.requestAnimationFrame(() => {
      this.frame();
    });
  }

  _initEvent() {
    this.player.on(VideoEvents.CANPLAY, () => {
      this._ended = false;
    });
    this.player.on(VideoEvents.PLAY, () => {
      this._ended = false;
      this.play();
    });
    this.player.on(VideoEvents.PAUSE, () => {
      this.pause();
    });
    this.player.on(VideoEvents.ENDED, () => {
      this._ended = true;
      this._cancelFrame();
    });
    this.player.on(VideoEvents.ERROR, () => {
      this._ended = true;
      this._cancelFrame();
    });
  }

  reload() {
    this.dan = [];
    this.clear();
    this._init();
  }

  send(dan: DanmakuParam) {
    const danmaku = {
      time: typeof dan.time === 'number' ? dan.time : this.getCurrentTime(),
      text: htmlEncode(dan.text),
      color: dan.color,
    };

    this.dan.splice(this.danIndex, 0, danmaku);
    this.danIndex++;
    this.draw([danmaku]);
  }

  frame() {
    if (this._ended) {
      return;
    }
    if (this.dan.length && !this.player.paused && this.showing) {
      let item = this.dan[this.danIndex];
      const dan = [];
      while (
        item &&
        this.getCurrentTime() >= Number.parseFloat(`${item.time}`) &&
        !this._ended
      ) {
        dan.push(item);
        item = this.dan[++this.danIndex];
      }
      this.draw(dan);
    }
    this._currentReq = window.requestAnimationFrame(() => {
      if (this._ended) {
        return;
      }
      this.frame();
    });
  }

  opacity(percentage?: number) {
    if (typeof percentage !== 'number') {
      return this._opacity;
    }
    const items = this.container.getElementsByClassName(
      'sy-player__danmaku-item',
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      items[i].style.opacity = `${percentage}`;
    }
    this._opacity = percentage;
    return this._opacity;
  }

  draw(dan: Array<{ text: string; color: string }>) {
    if (!this.showing) {
      return;
    }
    const itemHeight = 30;
    const danWidth: number = this.container.offsetWidth;
    const danHeight: number = this.container.offsetHeight;
    const itemY = Number.parseInt(`${danHeight / itemHeight}`);

    const danItemRight = (ele: HTMLElement) => {
      const eleWidth = ele.offsetWidth || Number.parseInt(ele.style.width);
      const eleRight =
        ele.getBoundingClientRect().right ||
        this.container.getBoundingClientRect().right + eleWidth;
      return this.container.getBoundingClientRect().right - eleRight;
    };

    const danSpeed = (width: number) => {
      return (danWidth + width) / 5;
    };

    const getTunnel = (ele: HTMLElement, width?: number) => {
      for (let i = 0; this.unlimited || i < itemY; i++) {
        const item = this.danTunnel[`${i}`];
        if (item && item.length) {
          const tmp = danWidth / danSpeed(width || 0);
          for (let j = 0; j < item.length; j++) {
            const danRight = danItemRight(item[j]) - 10;
            if (
              danRight <=
                danWidth -
                  tmp * danSpeed(Number.parseInt(item[j].style.width)) ||
              danRight <= 0
            ) {
              break;
            }
            if (j === item.length - 1) {
              this.danTunnel[`${i}`].push(ele);
              ele.addEventListener('animationend', () => {
                this.danTunnel[`${i}`].splice(0, 1);
              });
              return i % itemY;
            }
          }
        } else {
          this.danTunnel[`${i}`] = [ele];
          ele.addEventListener('animationend', () => {
            this.danTunnel[`${i}`].splice(0, 1);
          });
          return i % itemY;
        }
      }
      return -1;
    };

    const docFragment = document.createDocumentFragment();

    for (let i = 0; i < dan.length; i++) {
      const item = document.createElement('div');
      item.classList.add('sy-player__danmaku-item');

      item.innerHTML = dan[i].text;
      if (dan[i].color) {
        item.style.color = dan[i].color;
      }
      item.style.opacity = `${this._opacity}`;
      item.addEventListener('animationend', () => {
        this.container.removeChild(item);
      });

      const itemWidth = this._measure(dan[i].text);

      const tunnel = getTunnel(item, itemWidth);
      if (tunnel >= 0) {
        item.style.width = `${itemWidth + 1}px`;
        item.style.top = `${itemHeight * tunnel}px`;
        item.style.transform = `translateX(-${danWidth}px)`;
      }

      if (typeof tunnel === 'number' && tunnel >= 0) {
        item.style.animationDuration = this._danAnimation();
        docFragment.appendChild(item);
      }
    }

    this.container.appendChild(docFragment);

    return docFragment;
  }

  play() {
    this.paused = false;
    this.container.classList.add('move');
  }

  pause() {
    this.paused = true;
    this.container.classList.remove('move');
  }

  _measure(text: string) {
    if (!this.context) {
      this.context = document
        .createElement('canvas')
        .getContext('2d') as CanvasRenderingContext2D;
    }
    return this.context.measureText(text).width;
  }

  seek() {
    this.clear();
    for (let i = 0; i < this.dan.length; i++) {
      const time = this.dan[i]?.time;
      if (typeof time !== 'number') {
        continue;
      }
      if (time >= this.getCurrentTime()) {
        this.danIndex = i;
        break;
      }
      this.danIndex = this.dan.length;
    }
  }

  clear() {
    this.danTunnel = {};
    this.danIndex = 0;
    this.options.container.innerHTML = '';
  }

  resize() {
    const danWidth = this.container.offsetWidth;
    const items = this.container.getElementsByClassName(
      'sy-player__danmaku-item',
    ) as HTMLCollectionOf<HTMLElement>;
    if (!items.length) {
      return;
    }
    for (let i = 0; i < items.length; i++) {
      items[i].style.transform = `translateX(-${danWidth}px)`;
    }
  }

  hide() {
    this.showing = false;
    this.pause();
    this.clear();
  }

  show() {
    this.seek();
    this.showing = true;
    this.play();
  }

  unlimit(unlimited: boolean) {
    this.unlimited = unlimited;
  }

  _danAnimation() {
    const rate = 1;
    const isFullScreen = this.player.fullscreen;
    return `${(isFullScreen ? 8 : 5) / rate}s`;
  }

  _cancelFrame() {
    window.cancelAnimationFrame(this._currentReq);
  }
}
