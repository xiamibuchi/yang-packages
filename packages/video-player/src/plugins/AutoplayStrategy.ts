import { PlayerEvents, VideoEvents } from '../constants';
import type { VideoPlayer } from '../index';

const RETRY_COUNT = 3;

/** 自动播放策略 */
class AutoplayStrategy {
  player: VideoPlayer;
  private _retryCount: number;
  constructor(player: VideoPlayer) {
    this._emitPlaySuccess = this._emitPlaySuccess.bind(this);
    this._retryCount = RETRY_COUNT;
    this.player = player;
    this._init();
  }
  get pluginName() {
    return 'AutoplayStrategy';
  }
  private _init() {
    const { player } = this;
    player.on(PlayerEvents.CALL_PLAY_ERROR, (error: Error) => {
      player.on(VideoEvents.PLAYING, this._emitPlaySuccess);
      if (!player.options.autoplayMuted) {
        return;
      }
      if (this._retryCount <= 0) {
        return;
      }
      this._retryCount--;
      if (!error || error?.name === 'NotAllowedError') {
        player.muted = true;
        player.play();
      }
    });
    player.on(PlayerEvents.OPTIONS_CHANGE, () => {
      this._retryCount = RETRY_COUNT;
    });
  }
  private _emitPlaySuccess() {
    const { player } = this;
    player.emit(PlayerEvents.CALL_PLAY_SUCCESS);
    setTimeout(() => {
      if (!player.paused) {
        player.off(VideoEvents.PLAYING, this._emitPlaySuccess);
      }
    });
  }
}

export default AutoplayStrategy;
