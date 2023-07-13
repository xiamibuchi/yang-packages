import { createElement, getBoundingClientRect } from '../../utils';
import { UiEvents, VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Progress {
  player: VideoPlayer;
  el: HTMLElement;
  progressPlayed: HTMLElement;
  progressPoint: HTMLElement;
  progressMouse: HTMLElement;

  buffered: HTMLElement[];
  elWidth: number;
  elLeft: number;

  constructor(player: VideoPlayer) {
    this.elWidth = 0;
    this.elLeft = 0;
    this.player = player;
    this.buffered = [];

    this._resize = this._resize.bind(this);

    this.el = createElement('div', 'sy-player__progress');
    this.progressPlayed = createElement('div', 'sy-player__progress-played');
    this.progressPoint = createElement('div', 'sy-player__progress-dot');
    this.progressMouse = createElement('div', 'sy-player__progress-mouse');
    this.progressPlayed.appendChild(this.progressPoint);
    this.el.appendChild(this.progressPlayed);
    this.el.appendChild(this.progressMouse);

    this._initEvents();
  }
  private _initEvents() {
    const { player, el } = this;
    player.on(UiEvents.UI_RENDERED, this._resize);
    player.on(UiEvents.UI_CONTROLS_SHOW, this._resize);
    player.on(VideoEvents.TIMEUPDATE, () => {
      if (player.isStopUpdateCurrentTimeUi) {
        return;
      }
      this._updatePlayed(this._currentTimeToWidth());
    });

    player.on(VideoEvents.PROGRESS, () => {
      const buffered = player.buffered;
      if (!buffered) {
        return;
      }
      const bufferedEndIndex = buffered.length - 1;
      this._clearBuffed();

      const currentTime = player.currentTime;
      for (let i = bufferedEndIndex; i >= 0; i--) {
        if (this.player.options.multipleBuffer) {
          this._addBuffed(buffered.start(i), buffered.end(i));
        } else if (
          currentTime >= buffered.start(i) &&
          currentTime <= buffered.end(i)
        ) {
          this._addBuffed(0, buffered.end(i));
        }
      }
    });

    if (player.supportsTouch) {
      player.addEventListener(
        el,
        'touchstart',
        (e) => {
          this.progressPoint.classList.add('active');
          player.isStopUpdateCurrentTimeUi = true;
          const clientX = e.changedTouches?.[0].clientX || 0;
          const width = this._clientXToWidth(clientX);
          this._updatePlayed(width);
        },
        { passive: true }
      );

      player.addEventListener(
        el,
        'touchmove',
        (e) => {
          const clientX = e.changedTouches?.[0].clientX || 0;
          const width = this._clientXToWidth(clientX);
          this._updatePlayed(width);
          const time = this._clientXToTime(clientX);
          player.emit(UiEvents.UI_CURRENT_TIME_UPDATE, time);
        },
        { passive: true }
      );

      player.addEventListener(el, 'touchend', (e) => {
        this.progressPoint.classList.remove('active');
        player.isStopUpdateCurrentTimeUi = false;
        const clientX = e.changedTouches?.[0].clientX || 0;
        const currentTime = this._clientXToTime(clientX);
        player.currentTime = currentTime;
      });
    } else {
      player.addEventListener(el, 'mousedown', (e) => {
        this.progressPoint.classList.add('active');
        player.isStopUpdateCurrentTimeUi = true;
        this._updatePlayed(this._clientXToWidth(e.clientX || 0));

        const stop1 = player.addEventListener(
          document.body,
          'mousemove',
          (e) => {
            e.preventDefault();
            const currentTime = this._clientXToTime(e.clientX);

            this._updatePlayed(this._clientXToWidth(e.clientX));

            player.emit(UiEvents.UI_CURRENT_TIME_UPDATE, currentTime);
          }
        );

        const stop2 = player.addEventListener(document.body, 'mouseup', (e) => {
          this.progressPoint.classList.remove('active');
          player.isStopUpdateCurrentTimeUi = false;

          const currentTime = this._clientXToTime(e.clientX);
          player.currentTime = currentTime;

          stop1();
          stop2();
        });
      });

      player.addEventListener(el, 'mouseenter', (e) => {
        this._updateMouse(this._clientXToWidth(e.clientX));
      });
      player.addEventListener(el, 'mousemove', (e) => {
        this._updateMouse(this._clientXToWidth(e.clientX));
      });
      player.addEventListener(el, 'mouseleave', () => {
        this._updateMouse('0');
      });
    }
  }
  private _resize() {
    const { el } = this;
    const progressBoundingClientRect = getBoundingClientRect(el);
    this.elWidth = progressBoundingClientRect.width;
    this.elLeft = progressBoundingClientRect.left;
  }
  private _addBuffed(startTime: number, endTime: number) {
    const duration = this.player?.duration || 0;
    const { el } = this;

    const progressBuffered = createElement(
      'div',
      'sy-player__progress-buffered'
    );
    if (!progressBuffered) {
      return;
    }
    this.buffered.push(progressBuffered);
    progressBuffered.style.left = `${(startTime / duration) * 100}%`;
    progressBuffered.style.width = `${
      ((endTime - startTime) / duration) * 100
    }%`;
    el.appendChild(progressBuffered);
  }
  private _clearBuffed() {
    while (this.buffered.length) {
      const bufferedEl = this.buffered.pop();
      bufferedEl && this.el.removeChild(bufferedEl);
    }
  }
  private _updatePlayed(width: string) {
    const { progressPlayed } = this;
    progressPlayed.style.width = width;
  }
  private _updateMouse(width: string) {
    const { progressMouse } = this;
    progressMouse.style.width = width;
  }
  private _clientXToWidth(clientX?: number) {
    clientX = clientX || 0;
    const proportion = this._getWidthProportion(clientX);
    if (!proportion) {
      return '0';
    }
    return `${proportion * 100}%`;
  }
  private _clientXToTime(clientX?: number) {
    clientX = clientX || 0;
    const player = this.player;
    const duration = player.duration;
    if (!duration) {
      return 0;
    }
    const proportion = this._getWidthProportion(clientX);
    if (!proportion) {
      return 0;
    }
    return proportion * duration;
  }
  private _getWidthProportion(clientX: number) {
    const proportion = (clientX - this.elLeft) / this.elWidth;
    if (proportion > 1) {
      return 1;
    }
    if (proportion < 0) {
      return 0;
    }
    if (!proportion) {
      return 0;
    }
    return proportion;
  }
  private _currentTimeToWidth() {
    const player = this.player;
    const currentTime = player.currentTime;
    const duration = player.duration;
    if (!currentTime || typeof currentTime !== 'number') {
      return '0';
    }
    if (!duration || typeof duration !== 'number') {
      return '0';
    }
    let proportion = currentTime / duration;
    if (proportion > 1) {
      proportion = 1;
    } else if (proportion < 0) {
      proportion = 0;
    }
    return `${proportion * 100}%`;
  }
}
