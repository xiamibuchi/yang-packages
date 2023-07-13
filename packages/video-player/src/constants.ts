export enum VideoEvents {
  PLAY = 'play',
  PAUSE = 'pause',
  CANPLAY = 'canplay',
  PLAYING = 'playing',
  DURATION_CHANGE = 'durationchange',
  TIMEUPDATE = 'timeupdate',
  PROGRESS = 'progress',
  VOLUME_CHANGE = 'volumechange',
  LOAD_START = 'loadstart',
  WAITING = 'waiting',
  ENDED = 'ended',
  LOADED_DATA = 'loadeddata',
  STALLED = 'stalled',
  SUSPEND = 'suspend',
  ERROR = 'error',
}

export enum PlayerEvents {
  OPTIONS_CHANGE = 'OPTIONS_CHANGE',
  VIDEO_ATTACHED = 'VIDEO_ATTACHED',
  BEFORE_DESTROY = 'BEFORE_DESTROY',
  DESTROYED = 'DESTROYED',
  BEFORE_SET_LEVEL = 'BEFORE_SET_LEVEL',
  AFTER_SET_LEVEL = 'AFTER_SET_LEVEL',
  BEFORE_SET_SRC = 'BEFORE_SET_SRC',
  AFTER_SET_SRC = 'AFTER_SET_SRC',
  LOAD_SOURCE = 'LOAD_SOURCE',
  SOURCE_EMPTY = 'SOURCE_EMPTY',
  CALL_PLAY_ERROR = 'CALL_PLAY_ERROR',
  CALL_PLAY_SUCCESS = 'CALL_PLAY_SUCCESS',
}

export enum WindowEvents {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BEFORE_UNLOAD = 'beforeunload',
}

export enum UiEvents {
  UI_RENDERED = 'UI_RENDERED',

  UI_FOUCS = 'UI_FOUCS',
  UI_BLUR = 'UI_BLUR',

  UI_USER_PLAY = 'UI_USER_PLAY',
  UI_USER_PAUSE = 'UI_USER_PAUSE',

  UI_LOADING_SHOW = 'UI_LOADING_SHOW',
  UI_LOADING_HIDE = 'UI_LOADING_HIDE',

  UI_CONTROLS_SHOW = 'UI_CONTROLS_SHOW',
  UI_CONTROLS_HIDE = 'UI_CONTROLS_HIDE',

  UI_CURRENT_TIME_UPDATE = 'UI_CURRENT_TIME_UPDATE',

  UI_VOLUME_UPDATE = 'UI_VOLUME_UPDATE',

  UI_FULLSCREEN_CHANGE = 'UI_FULLSCREEN_CHANGE',
  UI_FULLSCREEN_ERROR = 'UI_FULLSCREEN_ERROR',
}

export const BLACK_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export const DEFAULT_DELAY_HIDE_INTERVAL = 1800;

/**
 * Mimetypes
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml
 */
export const MimetypesKind: Record<string, string> = {
  opus: 'video/ogg',
  ogv: 'video/ogg',
  mp4: 'video/mp4',
  mov: 'video/mp4',
  m4v: 'video/mp4',
  mkv: 'video/x-matroska',
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  aac: 'audio/aac',
  caf: 'audio/x-caf',
  flac: 'audio/flac',
  oga: 'audio/ogg',
  wav: 'audio/wav',
  m3u8: 'application/x-mpegURL',
  mpd: 'application/dash+xml',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};
