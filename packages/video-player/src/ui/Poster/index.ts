import { createElement } from '../../utils';
import { BLACK_IMAGE, PlayerEvents, UiEvents } from '../../constants';
import type { VideoPlayer } from '../../index';

export default class Poster {
  player: VideoPlayer;
  el: HTMLImageElement;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('img', 'sy-player__poster') as HTMLImageElement;

    this._initEvents();
    this._init();
  }
  private _init() {
    this._setPoster();
  }
  private _initEvents() {
    const player = this.player;
    const { options } = player;
    const { el } = this;
    player.on(PlayerEvents.OPTIONS_CHANGE, () => {
      this._setPoster();
    });

    player.on(PlayerEvents.CALL_PLAY_SUCCESS, () => {
      if (!player.paused) {
        el.classList.add('hide');
      }
    });

    player.addEventListener(el, 'click', () => {
      if (player.paused) {
        player.play();
      }
    });
    player.addEventListener(el, 'error', () => {
      const posterErrorImage = options.posterErrorImage || BLACK_IMAGE;
      el.setAttribute('src', posterErrorImage);
    });
    if (this.player.supportsTouch) {
      player.addEventListener(
        el,
        'touchstart',
        () => {
          player.emit(UiEvents.UI_FOUCS);
        },
        { passive: true }
      );
      player.addEventListener(el, 'touchend', () => {
        player.emit(UiEvents.UI_BLUR);
      });
    } else {
      player.addEventListener(el, 'mousemove', () => {
        player.emit(UiEvents.UI_FOUCS);
      });
    }
  }
  private _setPoster() {
    const { el } = this;
    const { options } = this.player;
    if (typeof options.poster === 'string') {
      const poster = options.poster;
      el.src = poster;
      el.setAttribute('src', poster);
    }
    if (typeof options.posterFit === 'string') {
      const posterFit = options.posterFit;
      const { el } = this;
      el.style.objectFit = posterFit;
    }
  }
}
