# 播放器

## autoplay

[文档](https://developer.mozilla.org/zh-CN/docs/Web/Media/Autoplay_guide)

[chromium](https://sites.google.com/a/chromium.org/dev/audio-video/autoplay)

- 音频被静音或其音量设置为 0
- 用户和网页已有交互行为（包括点击、触摸、按下某个键等等）
- 网站已被列入白名单；如果浏览器确定用户经常与媒体互动，这可能会自动发生，也可能通过首选项或其他用户界面功能手动发生
- 自动播放策略应用到 `<iframe>` 或者其文档上

### Chrome

[文档](https://developer.chrome.com/blog/autoplay)

- 始终允许静音自动播放。
- 在以下情况下，允许自动播放声音
  - 用户已与域进行了交互（单击，点击等）。
  - 在**台式机上**，已经超过了用户的“[Media Engagement Index (MEI)](about://media-engagement)”阈值，这意味着该用户以前曾播放带声音的视频。
  - 用户已将该网站添加到他们在移动设备上的主屏幕，或者在桌面上安装了 PWA。

### Firefox

[文档](https://hacks.mozilla.org/2019/02/firefox-66-to-block-automatically-playing-audible-video-and-audio/)

- 始终允许静音自动播放。
- 如果未执行任何用户交互，则将永远不允许自动播放
- 如果用户已授予摄像头/麦克风权限，则允许自动播放音频

### Safari 自动推理引擎

[文档](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

safari 会通过自动推理引擎来阻止自动播放，文档提到的因素有**电量**和**带宽**，猜测会有类似 chrome 白名单的策略。

### 最佳实践

```
var promise = document.querySelector('video').play();

if (promise !== undefined) {
  promise.then(_ => {
    // Autoplay started!
  }).catch(error => {
    // Autoplay was prevented.
    // Show a "Play" button so that user can start playback.
  });
}
```

## 媒体参与度指数（MEI）

MEI 衡量个人在站点上消费媒体的倾向。Chrome 当前的做法是每个来源的访问次数与重大媒体播放事件的比率：

- 媒体（音频/视频）的消耗必须大于 7 秒。
- 音频必须存在且不能静音。
- 带有视频的标签处于活动状态。
- 视频大小（以 px 为单位）必须大于 200x140。

_chrome 可以访问[chrome://media-engagement](chrome://media-engagement/)查看_

_Chrome 提供了全球 1000 多个站点允许自动播放的白名单，白名单未公开，加入方式未公开。这也解释了为什么 youtube 在 pc 上是允许自动播放的。_

### YouTube、Twitter 的做法

默认静音播放，提示用户点击取消静音

```
<video id="video" muted autoplay>
<button id="unmuteButton"></button>

<script>
  unmuteButton.addEventListener('click', function() {
    video.muted = false;
  });
</script>
```

### macOS 的自动播放政策

- 允许由用户手势导致的播放（**不代表有过用户手势就可以播**），touchend，click，doubleclick，keydown
- 允许带有 autoplay 属性，并且不包含音轨（有音轨单无声音的不在范围内）
- 允许带有 muted 属性的
- 无音轨视频正在播放的时候获得音轨，未经用户手势导致的取消静音，将会暂停播放
- 视频元素必须在可视区域并且 css 可见，透明度 0 视为不可见。

### 在流中的视频

如果带声音播放被浏览器阻止，会将视频设置为静音，然后再播放，如果静音播放也被浏览器阻止，将会暂停播放。

### 实现

```js
// 自动播放策略
const PlayMode = {
  STOP_PLAY: 'STOP_PLAY',
  MUTED_PLAY: 'MUTED_PLAY',
};

export default class AutoplayStrategy {
  constructor(config) {
    this.config = {
      mode: PlayMode.MUTED_PLAY,
      ...config,
    };
    this.emitCallPlaySuccess = this.emitCallPlaySuccess.bind(this);
  }
  install(player) {
    this.player = player;
    this._initEvent();
  }
  _initEvent() {
    const { player } = this;
    player.on(player.Events.CALL_PLAY_ERROR, (err) => {
      player.on(player.Events.PLAYING, this.emitCallPlaySuccess);

      if (this.config.mode === PlayMode.MUTED_PLAY) {
        if (!err || err.name === 'NotAllowedError') {
          player.setMuted(true);
          player.play();
        }
      }
    });
  }
  emitCallPlaySuccess() {
    const { player } = this;
    player.emit(player.Events.CALL_PLAY_SUCCESS);
    setTimeout(() => {
      if (!player.getPaused()) {
        player.off(player.Events.PLAYING, this.emitCallPlaySuccess);
      }
    });
  }
  setMode(mode) {
    this.config.mode = mode;
  }
}
```

## 防止 video 被渲染成原生播放器

一些浏览器会劫持 video 并且生成原生视频播放器。在这种情况下，用 z-index 无法控制浏览器层级，播放器定位永远高于其他元素（包括定位元素）。
解决方案。部分浏览器提供特殊属性控制浏览器，设置后不再将 vidoe 转化为原生播放器：

- `raw-controls`：钉钉、UC
- `controls`：360 浏览器
- `x5-video-player-type="h5"`：微信内置浏览器

```html
<video
  raw-controls
  controls
  x-webkit-airplay
  webkit-playsinline
  x5-playsinline
  x5-video-player-type="h5-page"
></video>
```

## Picture-in-Picture

```js
// 进入画中画
HTMLVideoElement.requestPictureInPicture();
// 退出画中画
document.exitPictureInPicture();

// events
HTMLVideoElement.addEventListener('enterpictureinpicture', () => {
  // 已进入画中画模式
});
// 退出画中画模式时候执行
HTMLVideoElement.addEventListener('leavepictureinpicture', () => {
  // 已退出画中画模式
});

// 监听小窗口尺寸的改变。PictureInPictureWindow 对象的获取在画中画响应事件的event对象中
HTMLVideoElement.addEventListener('enterpictureinpicture', (event) => {
  const videoPicWindow = event.pictureInPictureWindow;
  pipWindow.addEventListener('resize', () => {
    // videoPicWindow.width
    // videoPicWindow.height
  });
});

// document.pictureInPictureElement 返回当前的画中画元素是什么。可以判断当前浏览器是否进入了画中画模式（无画中画返回 null）。
```

## 响度均衡

```js
// 响度均衡
const AudioContext = window.AudioContext || window.webkitAudioContext;

class Index {
  constructor(config) {
    this.config = config;
    this._initAudio = this._initAudio.bind(this);
    this.destroy = this.destroy.bind(this);
  }
  install(player) {
    this.player = player;
    if (!this.config.loudnessTargets) {
      console.warn('目标响度未配置');
      return;
    }
    if (!this.config.loudnessField) {
      console.warn('响度字段未配置');
      return;
    }
    this._initEvent();
  }
  _initEvent() {
    const { player } = this;
    player.on(player.Events.PLAYING, this._initAudio);
    player.on(player.Events.VOLUME_CHANGE, this._initAudio);
    player.on(player.Events.SET_CURRENT_LEVEL, () => {
      const leave = player.getCurrentLevel();
      const levels = player.getLevels();
      if (!levels[leave].attributes) {
        return;
      }
      this.loudnessOfVideo =
        levels[leave].attributes[this.config.loudnessField];
      this._setGain();
    });
    player.on(player.Events.BEFORE_DESTROY, this.destroy);
  }
  _initAudio() {
    const { player } = this;
    if (!player.getMuted()) {
      this.audioCtx = new AudioContext();
      this.source = this.audioCtx.createMediaElementSource(this.player.video);
      this.gainNode = this.audioCtx.createGain();
      this._setGain();
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      player.off(player.Events.PLAYING, this._initAudio);
      player.off(player.Events.VOLUME_CHANGE, this._initAudio);
    }
  }
  _setGain() {
    const { loudnessTargets } = this.config;
    const { loudnessOfVideo, audioCtx } = this;

    if (!loudnessOfVideo || !loudnessTargets || !audioCtx) {
      return;
    }

    this.gainNode.gain.value = 10 ** ((loudnessTargets - loudnessOfVideo) / 20);
  }
  destroy() {
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}

export default Index;
```
