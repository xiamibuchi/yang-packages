import { createElement } from '../../utils';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Danmaku {
  player: VideoPlayer;
  el: HTMLElement;

  _lastFullscreenState = false;
  constructor(player: VideoPlayer) {
    this.player = player;
    this.el = createElement('div', 'sy-player__danmaku-box');

    this.player.appendChild(this.el);
  }
}
