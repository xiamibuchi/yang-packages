import { createElement } from '../../utils';
import PlaySvg from '../../icons/play.svg?raw';
import PauseSvg from '../../icons/pause.svg?raw';
import { PlayerEvents, UiEvents, VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';

import './index.scss';

export default class Play {
  player: VideoPlayer;
  el: HTMLElement;
  playButton: SVGSVGElement;
  pauseButton: SVGSVGElement;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__play-pause');
    this.el.innerHTML = `${PlaySvg}${PauseSvg}`;
    const svgs = this.el.querySelectorAll('svg');
    this.playButton = svgs[0] as SVGSVGElement;
    this.pauseButton = svgs[1] as SVGSVGElement;
    this.playButton.classList.add('svg-icon');
    this.pauseButton.classList.add('svg-icon');

    this._initEvents();
    this._init();
  }
  private _init() {
    this._switchPlay(true);
  }
  private _initEvents() {
    const { playButton } = this;
    const player = this.player;

    player.on(UiEvents.UI_LOADING_HIDE, () => {
      if (player.paused) {
        this._switchPlay(true);
      }
    });
    player.on(VideoEvents.PAUSE, () => {
      this._switchPlay(true);
    });
    player.on(VideoEvents.PLAYING, () => {
      this._switchPlay(false);
    });
    player.on(VideoEvents.ENDED, () => {
      this._switchPlay(false);
    });
    player.on(PlayerEvents.SOURCE_EMPTY, () => {
      this._switchPlay(false);
    });

    playButton.addEventListener('click', () => {
      player.emit(UiEvents.UI_USER_PLAY);
    });
    this.pauseButton.addEventListener('click', () => {
      player.emit(UiEvents.UI_USER_PAUSE);
    });
  }
  private _switchPlay(isShow: boolean) {
    const { playButton, pauseButton } = this;
    if (isShow) {
      playButton.classList.remove('hide');
      pauseButton.classList.add('hide');
    } else {
      playButton.classList.add('hide');
      pauseButton.classList.remove('hide');
    }
  }
}
