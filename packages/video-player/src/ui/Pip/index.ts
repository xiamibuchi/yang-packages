import { createElement } from '../../utils';
import PipSvg from '../../icons/pip.svg?raw';
import PipExitSvg from '../../icons/pip-exit.svg?raw';
import { UiEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Pip {
  player: VideoPlayer;
  el: HTMLElement;
  pipBtn: SVGSVGElement;
  exitPipBtn: SVGSVGElement;

  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__css-pip-box');
    this.el.innerHTML = `${PipSvg}${PipExitSvg}`;
    const svgs = this.el.querySelectorAll('svg');
    this.pipBtn = svgs[0] as SVGSVGElement;
    this.exitPipBtn = svgs[1] as SVGSVGElement;
    this.pipBtn.classList.add('svg-icon');
    this.exitPipBtn.classList.add('svg-icon');

    this._initEvents();
    this._init();
  }
  private _init() {
    const player = this.player;
    const isFullScreen = player.fullscreen;
    this._switchPipBtn(isFullScreen);
  }
  private _initEvents() {
    const { pipBtn, exitPipBtn } = this;
    const player = this.player;
    player.on(UiEvents.UI_FULLSCREEN_CHANGE, () => {
      const isFullScreen = player.fullscreen;
      if (isFullScreen) {
        this._switchPipBtn(false);
      }
    });

    player.addEventListener(pipBtn, 'click', () => {
      const isFullScreen = player.fullscreen;
      if (isFullScreen) {
        this.player.exitFullscreen();
      }
      this._switchPipBtn(true);
    });
    player.addEventListener(exitPipBtn, 'click', () => {
      this._switchPipBtn(false);
    });
  }
  private _switchPipBtn(isFullScreen: boolean) {
    if (isFullScreen) {
      this.pipBtn.classList.add('hide');
      this.exitPipBtn.classList.remove('hide');
      this.player.requestPictureInPicture();
    } else {
      this.pipBtn.classList.remove('hide');
      this.exitPipBtn.classList.add('hide');
      this.player.exitPictureInPicture();
    }
  }
}
