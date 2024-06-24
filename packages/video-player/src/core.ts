import EventEmitter from 'eventemitter3';
// @ts-ignore
import Hls from 'hls.js/dist/hls.light.js';
import { PlayerEvents, VideoEvents, WindowEvents } from './constants';
import type { PlayerOptions } from './types';

type EventListenerOptions =
  | boolean
  | {
      capture?: boolean;
      passive?: boolean;
      once?: boolean;
    };

interface EventListener {
  (
    evt: Event & {
      changedTouches?: TouchList;
      clientX?: number;
      clientY?: number;
    },
  ): void;
}

interface CoreConfig {
  /** video element */
  video?: HTMLMediaElement;
  autoplay: boolean;
  muted: boolean;
  playsinline: boolean;
  preload: PlayerOptions['preload'];
  playbackRate: HTMLMediaElement['playbackRate'];
  loop: HTMLMediaElement['loop'];
}

const DEFAULT_CONFIG: CoreConfig = {
  autoplay: true,
  muted: true,
  playsinline: true,
  preload: 'auto',
  playbackRate: 1,
  loop: false,
};

const normalizeConfig = (config: CoreConfig) => {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};

export class Core extends EventEmitter {
  plugins: any;
  config: CoreConfig;
  video: HTMLVideoElement | undefined;
  hls?: Hls;
  _videoEvents?: Array<() => void>;
  _windowEvents?: Array<() => void>;
  _canvas?: HTMLCanvasElement;
  _canvasCtx?: CanvasRenderingContext2D;
  private _removeListenerList?: Array<() => void>;
  constructor(config: CoreConfig) {
    super();
    this.plugins = {};
    this.config = normalizeConfig(config);
    this._removeListenerList = [];
  }
  _initVideoEvents() {
    const { video } = this;
    if (!video) {
      return;
    }
    this._videoEvents = Object.values(VideoEvents).map((event) => {
      const emit = this.emit.bind(this);
      const cb = (...args: any[]) => emit(event, ...args);
      video.addEventListener(event, cb);
      return () => video.removeEventListener(event, cb);
    });
  }
  _initWindowEvent() {
    if (typeof window === 'undefined') {
      return;
    }
    if (!this.hls) {
      return;
    }

    this._windowEvents = Object.values(WindowEvents).map((event) => {
      const emit = this.emit.bind(this);
      const cb = (e: Event) => emit(event, e);
      window.addEventListener(event, cb);
      return () => window.removeEventListener(event, cb);
    });

    this.on(WindowEvents.ONLINE, () => {
      if (this.hls) {
        this.hls.startLoad();
      }
    });
  }
  _removeEvents() {
    while (this?._videoEvents?.length) {
      const removeListener = this._videoEvents.shift();
      removeListener && removeListener();
    }
    this._videoEvents = undefined;
    while (this?._windowEvents?.length) {
      const removeListener = this._windowEvents.shift();
      removeListener && removeListener();
    }
    this._videoEvents = undefined;
    if (Array.isArray(this._removeListenerList)) {
      for (const removeListener of this._removeListenerList) {
        removeListener && removeListener();
      }
    }
    this._removeListenerList = undefined;
  }
  // src
  get src(): string {
    return this.video ? this.video.src : '';
  }
  set src(src: string) {
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => (this.src = src));
      return;
    }
    this.emit(PlayerEvents.LOAD_SOURCE);
    if (!src || typeof src !== 'string') {
      this.emit(PlayerEvents.SOURCE_EMPTY);
      return;
    }
    this.emit(PlayerEvents.BEFORE_SET_SRC);
    if (Hls.isSupported()) {
      if (this.hls) {
        this.hls.destroy();
        this.hls = undefined;
      }
      this.hls = new Hls();
      if (!this.hls) {
        throw new Error('Hls is not supported');
      }
      this.video && this.hls.attachMedia(this.video);
      this.hls.loadSource(src);
    } else {
      this.video.src = src;
      this.video.load();
    }
    this.emit(PlayerEvents.AFTER_SET_SRC);
  }
  // currentTime
  get currentTime() {
    const currentTime = this?.video?.currentTime;
    if (typeof currentTime !== 'number') {
      return 0;
    }
    if (currentTime < 0) {
      return 0;
    }
    return currentTime;
  }
  set currentTime(currentTime: number) {
    if (typeof currentTime !== 'number') {
      return;
    }
    const { video } = this;

    if (!video || !this.canplay) {
      this.once(VideoEvents.CANPLAY, () => {
        this.currentTime = currentTime;
      });
      return;
    }

    const duration = this.duration;
    // Safari 设置当前时间与总时间差 1 秒以内时，会不触发 ended 事件，因此设置小于 1 秒时回退 1 秒，并且向下取整
    if (currentTime > duration - 1) {
      currentTime = Math.floor(duration - 1);
    }

    if (currentTime < 0) {
      currentTime = 0;
    }

    if (typeof video.fastSeek === 'function') {
      video.fastSeek(currentTime);
    }
    video.currentTime = currentTime;
  }
  get playsinline() {
    return this.video ? this.video.playsInline : false;
  }
  set playsinline(playsinline: boolean) {
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.playsinline = playsinline;
      });
      return;
    }
    this.video.playsInline = playsinline;
    if (playsinline) {
      this.video.setAttribute('playsinline', String(playsinline));
      this.video.setAttribute('webkit-playsinline', String(playsinline));
      this.video.setAttribute('x5-playsinline', String(playsinline));
      // 微信 X5 https://x5.tencent.com/docs/video.html
      this.video.setAttribute('x5-video-player-type', 'h5-page');
      // 支付宝/UC/钉钉 https://opendocs.alipay.com/mini/component/video
      this.video.setAttribute('raw-controls', 'raw-controls');
      // 360浏览器 https://bbs.360.cn/thread-15959526-1-1.html
      this.video.setAttribute('controls360', 'no');
    } else {
      this.video.removeAttribute('playsinline');
      this.video.removeAttribute('webkit-playsinline');
      this.video.removeAttribute('x5-playsinline');
      this.video.removeAttribute('x5-video-player-type');
      this.video.removeAttribute('raw-controls');
      this.video.removeAttribute('controls360');
    }
  }
  // duration
  get duration(): number {
    const duration = this?.video?.duration;
    return typeof duration === 'number' ? duration : 0;
  }
  // preload
  get preload() {
    const preload = this.config.preload || '';
    if (preload === '') {
      return true;
    }
    if (preload === 'none') {
      return false;
    }
    return preload;
  }
  set preload(preload: CoreConfig['preload']) {
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.preload = preload;
      });
      return;
    }
    if (preload === true) {
      preload = 'auto';
    } else if (preload === false) {
      preload = 'none';
    }
    this.video.preload = preload;
    if (preload) {
      this.video.setAttribute('preload', preload);
    } else {
      this.video.removeAttribute('preload');
    }
  }
  // muted
  get muted() {
    return this.video ? this.video.muted : false;
  }
  set muted(muted) {
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.muted = muted;
      });
      return;
    }
    this.video.muted = muted;
  }
  // volume
  get volume() {
    return this.video?.volume || 0;
  }
  set volume(volume: number) {
    if (typeof volume !== 'number' || !volume) {
      volume = 0;
    }
    if (volume < 0) {
      volume = 0;
    }

    if (volume > 1) {
      volume = 1;
    }
    const { video } = this;

    if (!video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.volume = volume;
      });
      return;
    }

    if (video.volume === volume) {
      return;
    }
    video.volume = volume;
  }
  // autoplay
  get autoplay() {
    return this.video?.autoplay || false;
  }
  set autoplay(autoplay) {
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.autoplay = autoplay;
      });
      return;
    }
    this.video.autoplay = autoplay;
    if (autoplay === true) {
      this.video.setAttribute('autoplay', 'autoplay');
    } else {
      this.video.removeAttribute('autoplay');
    }
  }
  // buffered
  get buffered() {
    return this.video?.buffered;
  }
  get canplay() {
    if (!this.video) {
      return false;
    }
    if (typeof this.video.readyState === 'number') {
      return this.video.readyState >= 3;
    }
    return true;
  }
  // paused
  get paused() {
    return this.video?.paused || false;
  }
  // ended
  get ended() {
    return this.video?.ended || false;
  }
  // playbackRate
  get playbackRate() {
    return this.video?.playbackRate || 1;
  }
  set playbackRate(playbackRate: number) {
    if (this.playbackRate === playbackRate) {
      return;
    }
    if (typeof playbackRate !== 'number') {
      return;
    }
    if (playbackRate <= 0) {
      return;
    }
    if (playbackRate === Number.POSITIVE_INFINITY) {
      return;
    }
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.playbackRate = playbackRate;
      });
      return;
    }
    this.video.defaultPlaybackRate = playbackRate;
    this.video.playbackRate = playbackRate;
  }
  // loop
  get loop() {
    return this.video?.loop || false;
  }
  set loop(loop: CoreConfig['loop']) {
    if (typeof loop !== 'boolean') {
      return;
    }
    if (!this.video) {
      this.once(PlayerEvents.VIDEO_ATTACHED, () => {
        this.loop = loop;
      });
      return;
    }
    this.video.loop = loop;
  }

  attachMedia(video: HTMLVideoElement) {
    this._initVideoEvents();
    this._initWindowEvent();
    this.video = video;
    this.emit(PlayerEvents.VIDEO_ATTACHED);
    this.muted = this.config.muted;
    this.playsinline = this.config.playsinline;
    this.preload = this.config.preload;
    if (this.config.autoplay) {
      this.play();
    }
  }
  load() {
    this.video && this.video.load();
  }
  play() {
    const { video } = this;

    if (!video) {
      return Promise.reject();
    }

    if (!this.paused) {
      this.emit(PlayerEvents.CALL_PLAY_SUCCESS);
      return Promise.resolve();
    }

    const played = video.play();

    if (played) {
      played
        .catch((err) => {
          this.emit(PlayerEvents.CALL_PLAY_ERROR, err);
        })
        .then(() => {
          this.emit(PlayerEvents.CALL_PLAY_SUCCESS);
        });
    } else {
      this.emit(PlayerEvents.CALL_PLAY_SUCCESS);
    }

    return played;
  }
  pause() {
    this.video && this.video.pause();
  }
  destroy() {
    this.emit(PlayerEvents.BEFORE_DESTROY);
    this._removeEvents();
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }
    this._canvasCtx = undefined;
    this._canvas = undefined;
    this.emit(PlayerEvents.DESTROYED);
  }
  addEventListener(
    dom: Element,
    type: string,
    listener: EventListener,
    options?: EventListenerOptions,
  ): () => void {
    dom.addEventListener(type, listener, options);
    const removeListener = () => {
      dom && dom.removeEventListener(type, listener, options);
      if (this._removeListenerList?.length) {
        for (let i = 0; i < this._removeListenerList?.length; i++) {
          if (this._removeListenerList[i] === removeListener) {
            this._removeListenerList.splice(i, 1);
            break;
          }
        }
      }
    };
    if (!this._removeListenerList) {
      this._removeListenerList = [];
    }
    this._removeListenerList.push(removeListener);
    return removeListener;
  }
  // one canvas，save memory
  getScreenshot(): string {
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');
      this._canvasCtx = this._canvas.getContext('2d') || undefined;
    }
    if (!this._canvasCtx) {
      return '';
    }
    if (!this.video) {
      return '';
    }
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvasCtx.drawImage(this.video, 0, 0, width, height);
    let dataURL = '';
    try {
      dataURL = this._canvas.toDataURL('image/png');
      this._canvasCtx.clearRect(0, 0, width, height);
      if (typeof dataURL !== 'string') {
        return '';
      }
      if (dataURL === 'data:,') {
        return '';
      }
    } catch (_) {}
    return dataURL;
  }
}

export default Core;
