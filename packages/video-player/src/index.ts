import './ui/index.scss';
import { getLang } from './lang';
import Core from './core';
import {
  BLACK_IMAGE,
  PlayerEvents,
  UiEvents,
  VideoEvents,
  WindowEvents,
} from './constants';
// utils
import { createElement } from './utils';
// plugins
import AutoplayStrategy from './plugins/AutoplayStrategy';
// ui
import UiStart from './ui/Start';
import UiLoading from './ui/Loading';
import UiPoster from './ui/Poster';
import UiMark from './ui/Mark';
import Controls from './ui/Controls';
// types
import type { PlayerOptions, VideoLevel } from './types';

const DEFAULT_OPTIONS = {
  autoplay: true,
  autoplayMuted: false,
  muted: true,
  playsinline: true,
  preload: 'auto',
  fit: 'contain',
  posterFit: 'contain',
  controls: true,
  volume: 0.6,
  currentTime: 0,
  multipleBuffer: false,
  levelName: '',
  posterErrorImage: BLACK_IMAGE, // 封面图出错的保底图（默认纯黑）
};

export class VideoPlayer extends Core {
  _resizeTimer: number | null = null;
  _lastRatio = 0;

  options: PlayerOptions;
  autoplayStrategy?: AutoplayStrategy;

  currentLevelName: string;
  supportsTouch: boolean;
  isStopUpdateCurrentTimeUi = false;
  state: {
    loading: boolean;
  };
  // ui
  root: HTMLElement;
  playerBox: HTMLElement;
  video: HTMLVideoElement & {
    /* https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen */
    webkitEnterFullscreen?: () => void;
  };

  controls?: Controls;
  uiLoading?: UiLoading;
  uiStart?: UiStart;
  uiPoster?: UiPoster;
  uiMark?: UiMark;
  constructor(options: Partial<PlayerOptions>) {
    if (!options.el) {
      throw new Error('el is required');
    }
    const _options = {
      ...DEFAULT_OPTIONS,
      ...options,
    } as PlayerOptions;

    super(_options);
    this.options = _options;
    this.getLang.bind(this);
    this.currentLevelName = '';
    this.supportsTouch =
      'ontouchstart' in window || Boolean(navigator?.maxTouchPoints);
    this.state = {
      loading: false,
    };
    this.root = this.options.el;

    const { autoplayMuted } = _options;
    this.autoplayStrategy = this.install(AutoplayStrategy, {
      autoplayMuted,
    });
    // 播放器容器
    this._initEvents();
    this.playerBox = createElement('div', 'sy-player');
    // video
    this._initDom();
    this.root.appendChild(this.playerBox);
    this.emit(UiEvents.UI_RENDERED);
    this.video = createElement('video', 'sy-player__video') as HTMLVideoElement;
    this.attachMedia(this.video);
    if (this.options.fit) {
      this.setFit(this.options.fit);
    }
    this._initBaseDomEvents();

    this.playerBox.appendChild(this.video);
    this._setPlayerOptions(_options);

    this.setPlayerSrc();
  }

  get isLive() {
    if (this.options.isLive === true) {
      return true;
    }
    if (this.duration === Number.POSITIVE_INFINITY) {
      return true;
    }
    return false;
  }

  getLang(key: string) {
    return getLang(this.options.lang, key);
  }

  appendChild(el: HTMLElement | SVGSVGElement | DocumentFragment) {
    this.playerBox?.appendChild(el);
  }

  setFit(fit: PlayerOptions['fit']) {
    this.video.style['objectFit'] = fit;
  }

  setPlayerSrc() {
    if (!this.video) {
      return;
    }
    const src = this.options.src;
    if (this.options.levels?.length) {
      const level = this.getCurrentLevel();
      this.setCurrentLevel(level);
    }
    if (src) {
      this.src = src;
      return;
    }
  }

  requestFullscreen() {
    const { playerBox, video } = this;
    if (!playerBox) {
      return;
    }
    if (playerBox.requestFullscreen) {
      return playerBox.requestFullscreen();
    } else if (video?.webkitEnterFullscreen) {
      this.emit(UiEvents.UI_FULLSCREEN_ERROR);
      return video.webkitEnterFullscreen();
    }
  }
  exitFullscreen() {
    const isFullScreen = this.fullscreen;
    if (!isFullScreen) {
      return;
    }
    return document.exitFullscreen();
  }

  getCurrentLevel() {
    const levels = this.options.levels;
    if (!Array.isArray(levels) || levels.length === 0) {
      return;
    }
    let currentLevelName = this.currentLevelName;
    if (!currentLevelName) {
      currentLevelName = this.options.src;
    }
    let currentLevel = levels.find((level) => {
      if (currentLevelName === level.name) {
        return true;
      }
      if (currentLevelName === level.uri) {
        return true;
      }
      return false;
    });
    if (!currentLevel && currentLevelName) {
      return;
    }
    if (!currentLevel) {
      currentLevel = levels[0];
    }
    return currentLevel;
  }
  setCurrentLevel(level?: VideoLevel) {
    if (!level?.uri) {
      return;
    }
    this.emit(PlayerEvents.BEFORE_SET_LEVEL);
    const record = this.currentLevelName
      ? {
          currentTime: this.currentTime,
          paused: this.paused,
        }
      : {
          paused: !this.options.autoplay,
        };

    this.currentLevelName = level.uri;

    this.once(VideoEvents.CANPLAY, () => {
      if (record.currentTime) {
        this.currentTime = record.currentTime;
      }
      if (!record.paused) {
        this.play();
      }
    });

    this.src = level.uri;
    this.emit(PlayerEvents.AFTER_SET_LEVEL);
  }

  resize() {
    if (!this.playerBox) {
      return;
    }
    if (!this.video) {
      return;
    }
    if (this._resizeTimer) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = null;
    }
    this._resizeTimer = window.setTimeout(() => {
      if (this.options.fillMode === 'auto') {
        const width = this.video.videoWidth;
        const height = this.video.videoHeight;
        if (!width || typeof width !== 'number') {
          return;
        }
        if (!height || typeof height !== 'number') {
          return;
        }
        if (width < 10 || height < 10) {
          return;
        }
        const ratio = height / width;
        if (ratio === this._lastRatio) {
          return;
        }
        this.playerBox.classList.add('sy-player--fill-auto');
        this.playerBox.style.paddingBottom = `${ratio * 100}%`;
      } else {
        this.playerBox.classList.remove('sy-player--fill-auto');
        this.playerBox.style.paddingBottom = '';
      }
    }, 100);
  }

  setOptions(options: Partial<PlayerOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };
    this._setPlayerOptions(this.options);
    this.emit(PlayerEvents.OPTIONS_CHANGE);
  }

  destroy() {
    super.destroy();
    if (this.root && this.playerBox?.parentNode === this.root) {
      this.root.removeChild(this.playerBox);
    }
  }

  // install plugin
  install(pluginCtr: any, config: any) {
    const pluginName = pluginCtr?.pluginName;
    if (!pluginName) {
      return;
    }
    const plugin = new pluginCtr(this, config);
    if (this.plugins[pluginName]) {
      return;
    }
    this.plugins[pluginName] = plugin;
    return plugin;
  }
  private _initBaseDomEvents() {
    const { root } = this;
    this.addEventListener(this.playerBox, 'fullscreenchange', () => {
      this.emit(UiEvents.UI_FULLSCREEN_CHANGE);
    });
    // handle ESC
    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', () => {
        this.emit(UiEvents.UI_FULLSCREEN_CHANGE);
      });
    }

    if (this.supportsTouch) {
      root.addEventListener('touchend', () => {
        this.emit(UiEvents.UI_FOUCS);
      });

      this.addEventListener(this.video, 'touchstart', () => {
        this.emit(UiEvents.UI_FOUCS);
      });
      this.addEventListener(
        this.video,
        'touchend',
        () => {
          this.emit(UiEvents.UI_BLUR);
        },
        { passive: true }
      );
    } else {
      root.addEventListener('mouseleave', () => {
        this.emit(UiEvents.UI_BLUR);
      });
      root.addEventListener('mousemove', () => {
        this.emit(UiEvents.UI_FOUCS);
      });
      this.addEventListener(this.video, 'click', () => {
        if (this.isLive) {
          return;
        }
        if (this.paused) {
          this.emit(UiEvents.UI_USER_PLAY);
        } else {
          this.emit(UiEvents.UI_USER_PAUSE);
        }
      });
    }
  }
  private _initDom() {
    this.uiStart = new UiStart(this);
    this.uiLoading = new UiLoading(this);
    this.uiPoster = new UiPoster(this);
    this.uiMark = new UiMark(this);
    this.controls = new Controls(this);
  }
  private _initEvents() {
    this.on(PlayerEvents.OPTIONS_CHANGE, () => {
      const config = this.options;
      if (typeof config.fit === 'string') {
        this.setFit(config.fit);
      }
      this.resize();
    });
    this.on(PlayerEvents.BEFORE_SET_SRC, () => {
      this.isStopUpdateCurrentTimeUi = true;
    });
    this.on(PlayerEvents.AFTER_SET_SRC, () => {
      this.isStopUpdateCurrentTimeUi = false;
      this.resize();
    });
    this.once(PlayerEvents.LOAD_SOURCE, () => {
      this.volume = this.options.volume;
      this.muted = this.options.muted;
      this.emit(UiEvents.UI_VOLUME_UPDATE);
    });
    this.on(VideoEvents.VOLUME_CHANGE, () => {
      this.emit(UiEvents.UI_VOLUME_UPDATE);
    });
    this.on(VideoEvents.CANPLAY, () => {
      this.resize();
    });
    this.on(PlayerEvents.BEFORE_DESTROY, this.destroy);
    this.on(UiEvents.UI_USER_PLAY, () => {
      this.play();
    });
    this.on(UiEvents.UI_USER_PAUSE, () => {
      this.pause();
    });
    this.on(WindowEvents.ONLINE, () => {
      this.setPlayerSrc();
    });
  }

  private _setPlayerOptions(options: Partial<PlayerOptions>) {
    if (!options || typeof options !== 'object') {
      return;
    }
    if (typeof options.volume === 'number') {
      this.volume = options.volume;
    }
    if (typeof options.muted === 'boolean') {
      this.muted = options.muted;
    }
    if (typeof options.currentTime === 'number') {
      if (!this.ended) {
        this.currentTime = options.currentTime;
      }
    }
    if (typeof options.loop === 'boolean') {
      this.loop = options.loop;
    }
  }
}

export { PlayerEvents, UiEvents, VideoEvents, WindowEvents } from './constants';

export default VideoPlayer;
