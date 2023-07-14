export interface VideoLevel {
  uri: string;
  name: string;
  loudness?: number | string;
}

type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * @description 播放器配置项
 * @property {HTMLElement} el 播放器容器
 * @property {string} src 视频地址
 * @property {boolean} autoplay 是否自动播放
 * @property {boolean} autoplayMuted 是否自动播放且静音
 * @property {boolean} muted 是否静音
 * @property {boolean} playsinline 是否内联播放
 * @property {(HTMLVideoElement['preload'] | boolean)} preload 预加载
 * @property {ObjectFit} fit 视频填充模式
 * @property {string} poster 封面图
 * @property {ObjectFit} posterFit 封面图填充模式
 * @property {boolean} controls 是否显示控制条
 * @property {number} volume 音量
 * @property {boolean} multipleBuffer 是否开启多段缓冲
 * @property {string} levelName 当前播放的清晰度
 * @property {string} posterErrorImage 封面图出错的保底图（默认纯黑）
 * @property {VideoLevel[]} levels 清晰度列表
 * @property {number} currentTime 当前播放时间
 * @property {string} lang 语言
 */
export interface PlayerOptions {
  el: HTMLElement;
  src: string;
  autoplay: boolean;
  autoplayMuted: boolean;
  muted: boolean;
  playsinline: boolean;
  preload: HTMLVideoElement['preload'] | boolean;
  fit: ObjectFit;
  fillMode?: 'auto';
  poster: string;
  posterFit: ObjectFit;
  controls: boolean;
  volume: number;
  multipleBuffer: boolean;
  levelName: string;
  posterErrorImage: string;
  levels: VideoLevel[];
  currentTime: number;
  lang: string;
  playbackRate: HTMLVideoElement['playbackRate'];
  loop: HTMLMediaElement['loop'];
}
