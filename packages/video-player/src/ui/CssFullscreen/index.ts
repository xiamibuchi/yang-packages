import { createElement } from '../../utils';
import CssFullscreenSvg from '../../icons/css-fullscreen.svg?raw';
import CssFullscreenExitSvg from '../../icons/css-fullscreen-exit.svg?raw';
import { UiEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class CssFullscreen {
  player: VideoPlayer;
  el: HTMLElement;
  cssFullscreenBtn: SVGSVGElement;
  exitFullscreenBtn: SVGSVGElement;

  _lastFullscreenState = false;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__css-fullscreen-box');
    this.el.innerHTML = `${CssFullscreenSvg}${CssFullscreenExitSvg}`;
    const svgs = this.el.querySelectorAll('svg');
    this.cssFullscreenBtn = svgs[0] as SVGSVGElement;
    this.exitFullscreenBtn = svgs[1] as SVGSVGElement;
    this.cssFullscreenBtn.classList.add('svg-icon');
    this.exitFullscreenBtn.classList.add('svg-icon');

    this._initEvents();
    this._init();
  }
  private _init() {
    const player = this.player;
    const isFullScreen = player.fullscreen;
    this._switchCssFullscreenBtn(isFullScreen);
  }
  private _initEvents() {
    const { cssFullscreenBtn, exitFullscreenBtn } = this;
    const player = this.player;
    player.on(UiEvents.UI_FULLSCREEN_ERROR, () => {
      this._switchCssFullscreenBtn(this._lastFullscreenState);
    });
    player.on(UiEvents.UI_FULLSCREEN_CHANGE, (isFullScreen?: boolean) => {
      if (typeof isFullScreen !== 'boolean') {
        isFullScreen = player.fullscreen;
      }
      if (!isFullScreen) {
        this._switchCssFullscreenBtn(this._lastFullscreenState);
      } else {
        this._switchCssFullscreenBtn(false);
      }
    });

    player.addEventListener(cssFullscreenBtn, 'click', () => {
      const isFullScreen = player.fullscreen;
      if (isFullScreen) {
        this.player.exitFullscreen();
      }
      this._lastFullscreenState = true;
      this._switchCssFullscreenBtn(this._lastFullscreenState);
    });
    player.addEventListener(exitFullscreenBtn, 'click', () => {
      this._lastFullscreenState = false;
      this._switchCssFullscreenBtn(this._lastFullscreenState);
    });
  }
  private _switchCssFullscreenBtn(isFullScreen: boolean) {
    if (isFullScreen) {
      this.cssFullscreenBtn.classList.add('hide');
      this.exitFullscreenBtn.classList.remove('hide');
      this.player.playerBox?.classList.add('sy-player--css-fullscreen');
    } else {
      this.cssFullscreenBtn.classList.remove('hide');
      this.exitFullscreenBtn.classList.add('hide');
      this.player.playerBox?.classList.remove('sy-player--css-fullscreen');
    }
  }
}
