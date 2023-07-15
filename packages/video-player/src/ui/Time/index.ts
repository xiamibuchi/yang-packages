import { createElement, timeTranslate } from '../../utils';
import { UiEvents, VideoEvents } from '../../constants';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class TotalTime {
  player: VideoPlayer;
  el: HTMLElement;
  currentTimeText: HTMLElement;
  totalTimeText?: HTMLElement;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__time');
    this.currentTimeText = createElement('span', 'sy-player__current-time');
    this.el.appendChild(this.currentTimeText);
    if (!this.player.isLive) {
      const divideEl = document.createTextNode('/');
      this.totalTimeText = createElement('span');
      this.el.appendChild(divideEl);
      this.el.appendChild(this.totalTimeText);
      this.totalTimeText.innerText = timeTranslate(0);
    }
    this.currentTimeText.innerText = timeTranslate(0);

    this._initEvents();
  }
  private _initEvents() {
    const player = this.player;
    player.on(VideoEvents.DURATION_CHANGE, () => {
      if (!this.totalTimeText) {
        return;
      }
      this.totalTimeText.innerText = timeTranslate(player.duration);
    });
    player.on(VideoEvents.TIMEUPDATE, () => {
      const currentTime = player.currentTime;
      if (this.player.isStopUpdateCurrentTimeUi) {
        return;
      }
      this.currentTimeText.innerText = timeTranslate(currentTime);
    });
    player.on(UiEvents.UI_CURRENT_TIME_UPDATE, (currentTime: number) => {
      if (!currentTime || typeof currentTime !== 'number') {
        return;
      }
      this.currentTimeText.innerText = timeTranslate(currentTime);
    });
  }
}
