import { createElement } from '../../utils';
import {
  BLACK_IMAGE,
  PlayerEvents,
  UiEvents,
  VideoEvents,
} from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Level {
  player: VideoPlayer;
  el: HTMLElement;
  levelResult: HTMLElement;
  levelMenu: HTMLElement;
  levelImage: HTMLElement;

  private _timer: number | null;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._timer = null;

    this.el = createElement('div', 'sy-player__level-wrap');
    this.levelImage = createElement('img', 'sy-player__level-image hide');
    this.levelResult = createElement('div', 'sy-player__level-result');
    this.levelMenu = createElement('div', 'sy-player__level-menu hide');
    this.el.appendChild(this.levelResult);
    this.el.appendChild(this.levelMenu);
    this.player.appendChild(this.levelImage);

    this._initLevelList();
    this._initEvents();
    this._init();
  }
  private _init() {
    const { levelImage } = this;
    if (this.player.options.fit) {
      levelImage.style.objectFit = this.player.options.fit;
    }
    if (this.player.options.levels?.length) {
      this.el.classList.remove('hide');
    } else {
      this.el.classList.add('hide');
    }
    const current = this.player.getCurrentLevel();
    if (!current) {
      this.el.classList.add('hide');
    }
  }
  private _initLevelList() {
    const player = this.player;
    const { levelMenu } = this;
    const levels = this.player.options.levels;

    levelMenu.innerHTML = '';
    const event = this.player.supportsTouch ? 'touchend' : 'click';
    if (!Array.isArray(levels) || levels.length === 0) {
      return;
    }
    for (let index = 0; index < levels.length; index++) {
      const level = levels[index];
      const name = level.name;
      if (!name) {
        return;
      }
      const levelDom = document.createElement('div');
      levelDom.className = 'sy-player__level-menu-item';

      const textDom = document.createElement('span');
      textDom.innerText = name;
      levelDom.appendChild(textDom);

      levelMenu.appendChild(levelDom);

      player.addEventListener(levelDom, event, () => {
        levelMenu.classList.add('hide');
        this.player.setCurrentLevel(level);
      });
    }
  }
  private _initEvents() {
    const player = this.player;
    const { el, levelImage, levelResult, levelMenu } = this;

    player.on(VideoEvents.PLAYING, () => {
      levelImage.classList.add('hide');
    });
    player.on(PlayerEvents.BEFORE_SET_LEVEL, () => {
      if (!player.video) {
        return;
      }
      let levelImageSrc = player.getScreenshot();
      if (!levelImageSrc) {
        levelImageSrc = BLACK_IMAGE;
      }
      this.levelImage.setAttribute('src', levelImageSrc);
      this.levelImage.classList.remove('hide');
    });
    player.on(PlayerEvents.AFTER_SET_LEVEL, () => {
      const levelDoms: NodeListOf<HTMLElement> =
        this.levelMenu.querySelectorAll('.sy-player__level-menu-item');
      const current = this.player.getCurrentLevel();
      if (!current?.name) {
        this.el.classList.add('hide');
        return;
      }
      this.levelResult.innerText = current.name;
      for (let i = 0; i < levelDoms.length; i++) {
        const menuItem = levelDoms[i];
        if (menuItem?.innerText === current.name) {
          menuItem.classList.add('is-active');
        } else if (menuItem) {
          menuItem.classList.remove('is-active');
        }
      }
    });

    player.addEventListener(this.levelImage, 'click', () => {
      if (!this.player.options.controls) {
        return;
      }
      if (this.player.supportsTouch) {
        return;
      }
      if (player.paused) {
        player.play();
      }
    });
    player.addEventListener(document.body, 'click', (e) => {
      if (e?.target === levelResult) {
        return;
      }
      this._hideLevelList(0);
    });
    if (this.player.supportsTouch) {
      player.addEventListener(levelResult, 'touchend', (e) => {
        e.stopPropagation();
        if (!levelMenu.classList.contains('hide')) {
          this._hideLevelList();
          return;
        }
        this._showLevelList();
      });
      player.addEventListener(
        levelImage,
        'touchstart',
        () => {
          player.emit(UiEvents.UI_FOUCS);
        },
        { passive: true }
      );
      player.addEventListener(levelImage, 'touchend', () => {
        player.emit(UiEvents.UI_BLUR);
      });
    } else {
      player.addEventListener(el, 'mouseenter', () => {
        this._showLevelList();
      });
      player.addEventListener(el, 'mouseleave', () => {
        this._hideLevelList();
      });

      player.addEventListener(levelImage, 'mousemove', () => {
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
  private _showLevelList() {
    const { levelMenu } = this;
    this._clearTimer();
    levelMenu.classList.remove('hide');
  }
  private _hideLevelList(interval = 300) {
    const { levelMenu } = this;
    this._clearTimer();
    this._timer = window.setTimeout(() => {
      levelMenu.classList.add('hide');
    }, interval);
  }
}
