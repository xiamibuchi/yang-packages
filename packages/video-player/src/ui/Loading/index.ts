import { createElement } from '../../utils';
import { UiEvents, VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';
export default class Loading {
  player: VideoPlayer;
  el: HTMLElement;

  private _timer: number | null;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._timer = null;
    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);

    this.el = createElement('div', 'sy-player__loading-box hide');
    this.el.innerHTML = `
      <div class="sy-player__loading"></div>
    `;

    this._initEvents();

    this.player.appendChild(this.el);
  }
  private _initEvents() {
    const player = this.player;
    player.on(VideoEvents.LOAD_START, this._show);
    player.on(VideoEvents.WAITING, this._show);
    player.on(VideoEvents.CANPLAY, this._hide);
    player.on(VideoEvents.PLAYING, this._hide);
    player.on(VideoEvents.TIMEUPDATE, this._hide);

    if (this.player.supportsTouch) {
      player.addEventListener(
        this.el,
        'touchstart',
        () => {
          player.emit(UiEvents.UI_FOUCS);
        },
        { passive: true }
      );
    } else {
      player.addEventListener(this.el, 'click', () => {
        player.emit(UiEvents.UI_FOUCS);
      });
    }
  }
  private _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
  private _show(interval = 300) {
    const { player, el } = this;
    this._clearTimer();
    this._timer = window.setTimeout(() => {
      el.classList.remove('hide');
      player.state.loading = true;
      player && player.emit(UiEvents.UI_LOADING_SHOW);
    }, interval);
  }
  private _hide(interval = 300) {
    const { el, player } = this;
    if (el.classList.contains('hide')) {
      return;
    }
    this._clearTimer();
    this._timer = window.setTimeout(() => {
      el.classList.add('hide');
      player.state.loading = false;
      player && player.emit(UiEvents.UI_LOADING_HIDE);
    }, interval);
  }
}
