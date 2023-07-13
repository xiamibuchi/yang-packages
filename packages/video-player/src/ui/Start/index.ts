import { createElement } from '../../utils';
import {
  DEFAULT_DELAY_HIDE_INTERVAL,
  UiEvents,
  VideoEvents,
} from '../../constants';
import PlaySvg from '../../icons/play.svg?raw';
import PauseSvg from '../../icons/pause.svg?raw';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Start {
  player: VideoPlayer;
  playButton: HTMLElement;
  pauseButton: HTMLElement;

  private _timer: number | null;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._timer = null;

    this.playButton = createElement('div', 'sy-player__play--big');
    this.playButton.innerHTML = PlaySvg;
    this.pauseButton = createElement('div', 'sy-player__pause--big');
    this.pauseButton.innerHTML = PauseSvg;
    this.playButton.firstElementChild?.classList.add('svg-icon');
    this.pauseButton.firstElementChild?.classList.add('svg-icon');

    this.player.appendChild(this.playButton);
    this.player.appendChild(this.pauseButton);

    this._initEvents();
  }
  private _initEvents() {
    const player = this.player;

    player.on(VideoEvents.PLAYING, () => {
      this._switchPlay(false);
    });
    player.on(UiEvents.UI_USER_PLAY, () => {
      this._switchPlay(false);
    });
    player.on(UiEvents.UI_USER_PAUSE, () => {
      this._switchPlay(true);
      this._switchPause(false);
    });
    player.on(UiEvents.UI_LOADING_SHOW, () => {
      this._switchPlay(false);
      this._switchPause(false);
    });
    player.on(UiEvents.UI_LOADING_HIDE, () => {
      if (player.paused && !this.player.state.loading) {
        this._switchPlay(true);
      }
    });
    player.on(UiEvents.UI_FOUCS, () => {
      if (player.paused) {
        return;
      }
      if (!this.player.options.controls) {
        return;
      }
      if (this.player.state.loading) {
        return;
      }
      if (!this.player.supportsTouch) {
        return;
      }
      this._switchPause(true);
    });

    player.addEventListener(this.playButton, 'click', () => {
      player.emit(UiEvents.UI_USER_PLAY);
    });

    player.addEventListener(this.pauseButton, 'click', () => {
      player.emit(UiEvents.UI_USER_PAUSE);
    });
  }
  private _switchPlay(isShow: boolean) {
    if (!this.player.options.controls) {
      return;
    }
    const player = this.player;
    if (player.ended) {
      return;
    }
    if (isShow) {
      this.playButton.classList.remove('hide');
    } else {
      this.playButton.classList.add('hide');
    }
  }
  private _switchPause(isShow: boolean) {
    if (!this.player.options.controls) {
      return;
    }
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (isShow) {
      this.pauseButton.classList.remove('hide');
      this._timer = window.setTimeout(() => {
        this.pauseButton.classList.add('hide');
      }, DEFAULT_DELAY_HIDE_INTERVAL);
    } else {
      this.pauseButton.classList.add('hide');
    }
  }
}
