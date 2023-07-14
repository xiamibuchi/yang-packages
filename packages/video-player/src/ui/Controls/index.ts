import { createElement } from '../../utils';
import {
  DEFAULT_DELAY_HIDE_INTERVAL,
  UiEvents,
  VideoEvents,
} from '../../constants';
import './index.scss';
// controls items
import UiPlay from '../Play';
import UiTime from '../Time';
import UiProgress from '../Progress';
import UiVolume from '../Volume';
import UiPlaybackRate from '../PlaybackRate';
import UiLevel from '../Level';
import UiCssFullscreen from '../CssFullscreen';
import UiFullscreen from '../Fullscreen';
// types
import type { VideoPlayer } from '../../index';

export default class Controls {
  player: VideoPlayer;
  el: HTMLElement;
  uiPlay?: UiPlay;
  uiTime?: UiTime;
  uiProgress?: UiProgress;
  uiVolume?: UiVolume;
  UiPlaybackRate?: UiPlaybackRate;
  uiLevel?: UiLevel;
  uiCssFullscreen?: UiCssFullscreen;
  uiFullscreen?: UiFullscreen;

  private _timer: number | null;
  private _disableHide: boolean;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._timer = null;
    this._disableHide = false;
    this._clearTimer = this._clearTimer.bind(this);
    this._delayHide = this._delayHide.bind(this);

    this.el = createElement('div', 'sy-player__controls hide');

    const placeholder = createElement('div', 'sy-player__placeholder'); // 占位
    this.uiPlay = new UiPlay(this.player);
    this.uiTime = new UiTime(this.player);
    this.uiProgress = new UiProgress(this.player);
    this.UiPlaybackRate = new UiPlaybackRate(this.player);
    this.uiLevel = new UiLevel(this.player);
    this.uiVolume = new UiVolume(this.player);
    this.uiCssFullscreen = new UiCssFullscreen(this.player);
    this.uiFullscreen = new UiFullscreen(this.player);

    this.el.appendChild(placeholder);
    this.el.appendChild(this.uiPlay.el);
    this.el.appendChild(this.uiTime.el);
    this.el.appendChild(this.uiProgress.el);
    this.el.appendChild(this.uiVolume.el);
    this.el.appendChild(this.UiPlaybackRate.el);
    this.el.appendChild(this.uiLevel.el);
    this.el.appendChild(this.uiCssFullscreen.el);
    this.el.appendChild(this.uiFullscreen.el);

    this.player.appendChild(this.el);

    this._initEvents();
    this._init();
  }
  private _init() {
    this._delayHide();
  }
  private _initEvents() {
    const player = this.player;
    const { supportsTouch } = player;
    const { el } = this;
    player.on(UiEvents.UI_FOUCS, () => {
      this._show();
      this._delayHide();
    });
    player.on(UiEvents.UI_BLUR, () => {
      this._delayHide();
    });
    player.on(VideoEvents.ENDED, () => {
      this._disableHide = false;
      this._hide(0);
    });
    if (supportsTouch) {
      player.addEventListener(el, 'touchstart', this._clearTimer, {
        passive: true,
      });
      player.addEventListener(el, 'touchend', () => {
        this._delayHide();
      });
    } else {
      player.addEventListener(el, 'mouseenter', () => {
        this._disableHide = true;
        this._clearTimer();
      });
      player.addEventListener(el, 'mouseleave', () => {
        this._disableHide = false;
        this._delayHide();
      });
    }
  }
  private _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
  private _show() {
    if (!this.player.options.controls) {
      return;
    }
    const player = this.player;
    if (player.ended) {
      return;
    }
    this._clearTimer();
    this.el.classList.remove('hide');
    player.emit(UiEvents.UI_CONTROLS_SHOW);
  }
  private _hide(interval = 300) {
    this._clearTimer();
    if (this._disableHide) {
      return;
    }
    const { el } = this;
    this._timer = window.setTimeout(() => {
      el.classList.add('hide');
    }, interval);
  }
  private _delayHide() {
    this._hide(DEFAULT_DELAY_HIDE_INTERVAL);
  }
}
