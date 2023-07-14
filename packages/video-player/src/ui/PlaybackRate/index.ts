import { createElement } from '../../utils';
import { VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

const playbackRateList = [2, 1.5, 1.25, 1, 0.75, 0.5];

export default class PlaybackRate {
  player: VideoPlayer;
  el: HTMLElement;
  playbackrateResult: HTMLElement;
  playbackrateMenu: HTMLElement;

  private _timer: number | null;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._timer = null;

    this.el = createElement('div', 'sy-player__playbackrate-wrap');
    this.playbackrateResult = createElement(
      'div',
      'sy-player__playbackrate-result'
    );
    this.playbackrateMenu = createElement(
      'div',
      'sy-player__playbackrate-menu hide'
    );
    this.el.appendChild(this.playbackrateResult);
    this.el.appendChild(this.playbackrateMenu);

    this._initPlaybackrateList();
    this._initEvents();
    this._init();
  }
  private _init() {
    const playbackRate = this.player.options.playbackRate;
    this._setPlaybackrate(playbackRate);
  }
  private _initPlaybackrateList() {
    const player = this.player;
    const { playbackrateMenu } = this;

    playbackrateMenu.innerHTML = '';
    const event = this.player.supportsTouch ? 'touchend' : 'click';
    if (!Array.isArray(playbackRateList) || playbackRateList.length === 0) {
      return;
    }
    if (playbackRateList.some((item) => typeof item !== 'number')) {
      return;
    }
    for (let index = 0; index < playbackRateList.length; index++) {
      const playbackRate = playbackRateList[index];
      const playbackrateDom = document.createElement('div');
      playbackrateDom.className = 'sy-player__playbackrate-menu-item';
      if (this.player.playbackRate === playbackRate) {
        playbackrateDom.classList.add('is-active');
      }

      const name = this._getPlaybackrateName(playbackRate);
      const textDom = document.createElement('span');
      textDom.innerText = name;
      playbackrateDom.appendChild(textDom);
      playbackrateMenu.appendChild(playbackrateDom);

      player.addEventListener(playbackrateDom, event, () => {
        playbackrateMenu.classList.add('hide');
        this._setPlaybackrate(playbackRate);
      });
    }
  }
  private _initEvents() {
    const player = this.player;
    const { el, playbackrateResult, playbackrateMenu } = this;

    player.on(VideoEvents.RATE_CHANGE, () => {
      const playbackrateDoms: NodeListOf<HTMLElement> =
        this.playbackrateMenu.querySelectorAll(
          '.sy-player__playbackrate-menu-item'
        );
      const playbackRate = this.player.playbackRate;
      const name = this._getPlaybackrateName(playbackRate);
      this._setPlaybackrate(playbackRate);
      for (let i = 0; i < playbackrateDoms.length; i++) {
        const menuItem = playbackrateDoms[i];
        if (menuItem?.innerText === name) {
          menuItem.classList.add('is-active');
        } else if (menuItem) {
          menuItem.classList.remove('is-active');
        }
      }
    });
    player.addEventListener(document.body, 'click', (e) => {
      if (e?.target === playbackrateResult) {
        return;
      }
      this._hidePlaybackrateList(0);
    });
    if (this.player.supportsTouch) {
      player.addEventListener(playbackrateResult, 'touchend', (e) => {
        e.stopPropagation();
        if (!playbackrateMenu.classList.contains('hide')) {
          this._hidePlaybackrateList();
          return;
        }
        this._showPlaybackrateList();
      });
    } else {
      player.addEventListener(el, 'mouseenter', () => {
        this._showPlaybackrateList();
      });
      player.addEventListener(el, 'mouseleave', () => {
        this._hidePlaybackrateList();
      });
    }
  }
  private _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
  private _showPlaybackrateList() {
    const { playbackrateMenu } = this;
    this._clearTimer();
    playbackrateMenu.classList.remove('hide');
  }
  private _hidePlaybackrateList(interval = 300) {
    const { playbackrateMenu } = this;
    this._clearTimer();
    this._timer = window.setTimeout(() => {
      playbackrateMenu.classList.add('hide');
    }, interval);
  }
  private _getPlaybackrateName(playbackRate: number): string {
    let name = `${playbackRate}`;
    if (name.length === 1) {
      name = `${name}.0`;
    }
    return `${name}x`;
  }
  private _setPlaybackrate(playbackRate: number) {
    if (!playbackRate || typeof playbackRate !== 'number') {
      playbackRate = 1;
    }
    this.player.playbackRate = playbackRate;
    const name =
      playbackRate === 1
        ? this.player.getLang('playbackRate')
        : this._getPlaybackrateName(playbackRate);
    this.playbackrateResult.innerText = name;
  }
}
