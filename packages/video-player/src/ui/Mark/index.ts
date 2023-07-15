import { createElement } from '../../utils';
import { PlayerEvents, VideoEvents } from '../../constants';
import SvgReply from '../../icons/replay.svg?raw';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Mark {
  player: VideoPlayer;
  el: HTMLElement;
  private _isSourceEmpty: boolean;
  markBox: HTMLElement;
  markText: HTMLElement;
  markIcon: SVGSVGElement;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._isSourceEmpty = false;
    this._replay = this._replay.bind(this);
    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);

    this.el = createElement('div', 'sy-player__mark hide');
    this.markBox = createElement('div', 'sy-player__mark-box');
    this.markText = createElement('span', 'sy-player__mark-text');
    this.markText.innerText = this.player.getLang('replay');
    this.markBox.innerHTML = SvgReply;
    this.markBox.appendChild(this.markText);
    this.markIcon = this.markBox.querySelector('svg') as SVGSVGElement;
    this.markIcon.classList.add('svg-icon');
    this.el.appendChild(this.markBox);

    this._initEvents();

    this.player.appendChild(this.el);
  }
  private _initEvents() {
    const player = this.player;

    player.on(VideoEvents.CANPLAY, () => {
      this._switchSourceEmpty(false);
    });
    player.on(VideoEvents.PLAYING, () => {
      this._switchSourceEmpty(false);
    });
    player.on(VideoEvents.TIMEUPDATE, () => {
      this._switchSourceEmpty(false);
    });
    player.on(PlayerEvents.SOURCE_EMPTY, () => {
      this._switchSourceEmpty(true);
    });
    player.on(VideoEvents.ENDED, () => {
      this._show();
    });
    player.on(VideoEvents.TIMEUPDATE, () => {
      const currentTime = player.currentTime;
      const duration = player.duration;
      if (currentTime && duration && currentTime === duration) {
        player.pause();
        player.emit(VideoEvents.ENDED);
      }
    });
    player.on(VideoEvents.PLAY, this._hide);

    player.addEventListener(this.markBox, 'click', () => {
      if (this._isSourceEmpty) {
        return;
      }
      this._replay();
    });
  }
  private _switchSourceEmpty(isSourceEmpty: boolean) {
    if (this._isSourceEmpty === isSourceEmpty) {
      return;
    }
    this._isSourceEmpty = isSourceEmpty;
    if (isSourceEmpty) {
      this.markText.innerText = this.player.getLang('has_been_deleted');
      this.markIcon.classList.add('hide');
      this._show();
    } else {
      this.markText.innerText = this.player.getLang('replay');
      this.markIcon.classList.remove('hide');
    }
  }
  private _replay() {
    const player = this.player;
    if (player.isLive) {
      return;
    }
    player.play();
  }
  private _show() {
    this.el.classList.remove('hide');
  }

  private _hide() {
    this.el.classList.add('hide');
  }
}
