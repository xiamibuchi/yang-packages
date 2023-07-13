import { createElement } from '../../utils';
import FullscreenSvg from '../../icons/fullscreen.svg?raw';
import FullscreenExitSvg from '../../icons/fullscreen-exit.svg?raw';
import { UiEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Fullscreen {
  player: VideoPlayer;
  el: HTMLElement;
  fullscreenBtn: SVGSVGElement;
  exitFullscreenBtn: SVGSVGElement;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__fullscreen-box');
    this.el.innerHTML = `${FullscreenSvg}${FullscreenExitSvg}`;
    const svgs = this.el.querySelectorAll('svg');
    this.fullscreenBtn = svgs[0] as SVGSVGElement;
    this.exitFullscreenBtn = svgs[1] as SVGSVGElement;
    this.fullscreenBtn.classList.add('svg-icon');
    this.exitFullscreenBtn.classList.add('svg-icon');

    this._initEvents();
    this._init();
  }
  private _init() {
    const player = this.player;
    const isFullScreen = player.fullscreen;
    this._switchFullscreenBtn(isFullScreen);
  }
  private _initEvents() {
    const { fullscreenBtn, exitFullscreenBtn } = this;
    const player = this.player;

    player.on(UiEvents.UI_FULLSCREEN_ERROR, () => {
      this._switchFullscreenBtn(false);
    });
    player.on(UiEvents.UI_FULLSCREEN_CHANGE, (isFullScreen?: boolean) => {
      if (typeof isFullScreen !== 'boolean') {
        isFullScreen = player.fullscreen;
      }
      this._switchFullscreenBtn(isFullScreen);
    });

    player.addEventListener(fullscreenBtn, 'click', () => {
      this.player.requestFullscreen();
    });
    player.addEventListener(exitFullscreenBtn, 'click', () => {
      this.player.exitFullscreen();
    });
  }
  private _switchFullscreenBtn(isFullScreen: boolean) {
    if (isFullScreen) {
      this.fullscreenBtn.classList.add('hide');
      this.exitFullscreenBtn.classList.remove('hide');
    } else {
      this.fullscreenBtn.classList.remove('hide');
      this.exitFullscreenBtn.classList.add('hide');
    }
  }
}
