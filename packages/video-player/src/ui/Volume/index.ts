import { createElement, getBoundingClientRect } from '../../utils';
import { UiEvents } from '../../constants';
import VolumeMuteSvg from '../../icons/volume-mute.svg?raw';
import VolumeActiveSvg from '../../icons/volume-active.svg?raw';
import type { VideoPlayer } from '../../index';
import './index.scss';

export default class Volume {
  player: VideoPlayer;
  el: HTMLElement;
  volumeBox: HTMLElement;
  volumeBar: HTMLElement;
  volumeBarActive: HTMLElement;
  volumeBarPoint: HTMLElement;
  mutedBox: HTMLElement;
  mutedButton: SVGSVGElement;
  activeButton: SVGSVGElement;

  private _timer: number | null;
  constructor(player: VideoPlayer) {
    this.player = player;
    this._volumeChangeHandle = this._volumeChangeHandle.bind(this);
    this._timer = null;

    this.el = createElement('div', 'sy-player__volume');
    this.volumeBox = createElement('div', 'sy-player__volume-bar-wrap hide');
    this.volumeBar = createElement('div', 'sy-player__volume-bar');
    this.volumeBarActive = createElement('div', 'sy-player__volume-bar-active');
    this.volumeBarPoint = createElement('div', 'sy-player__volume-bar-dot');

    this.volumeBox.appendChild(this.volumeBar);
    this.volumeBar.appendChild(this.volumeBarActive);
    this.volumeBarActive.appendChild(this.volumeBarPoint);
    this.el.appendChild(this.volumeBox);

    this.mutedBox = createElement('div', 'sy-player__volume-muted-box');
    this.mutedBox.innerHTML = `${VolumeMuteSvg}${VolumeActiveSvg}`;
    const svgs = this.mutedBox.querySelectorAll('svg');
    this.mutedButton = svgs[0] as SVGSVGElement;
    this.activeButton = svgs[1] as SVGSVGElement;
    this.mutedButton.classList.add('svg-icon');
    this.activeButton.classList.add('svg-icon');

    this.mutedBox.appendChild(this.mutedButton);
    this.mutedBox.appendChild(this.activeButton);
    this.el.appendChild(this.mutedBox);

    this._initEvents();
    this._init();
  }
  private _init() {
    this._volumeChangeHandle();
  }
  private _initEvents() {
    const player = this.player;
    const { el, volumeBox, volumeBar } = this;
    player.on(UiEvents.UI_VOLUME_UPDATE, this._volumeChangeHandle);

    const { mutedButton, activeButton } = this;

    const event = this.player.supportsTouch ? 'touchend' : 'click';
    player.addEventListener(mutedButton, event, () => {
      this._active();
    });
    player.addEventListener(activeButton, event, () => {
      this._muted();
    });

    if (this.player.supportsTouch) {
      return;
    }
    let volumeDomHeight = 0;
    let volumeDomY = 0;
    const computeVolume = (
      basePosition: number,
      finalPosition: number,
      referencePosition: number
    ) => {
      const volume =
        basePosition - (finalPosition - referencePosition) / volumeDomHeight;
      requestAnimationFrame(() => {
        player.volume = volume;
        if (volume > 0) {
          player.muted = false;
        }
      });
      return volume;
    };
    player.addEventListener(el, 'mouseenter', () => {
      volumeBox.classList.remove('hide');
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
      const volumeDomBoundingClientRect = getBoundingClientRect(volumeBar);
      volumeDomHeight = volumeDomBoundingClientRect.height;
      volumeDomY = volumeDomBoundingClientRect.y;
    });
    player.addEventListener(el, 'mouseleave', () => {
      this._timer = window.setTimeout(() => {
        volumeBox.classList.add('hide');
      }, 300);
    });

    player.addEventListener(volumeBox, 'mousedown', (e) => {
      computeVolume(1, e.clientY || 0, volumeDomY);

      const stop1 = player.addEventListener(document.body, 'mousemove', (e) => {
        computeVolume(1, e.clientY || 0, volumeDomY);
      });

      const stop2 = player.addEventListener(document.body, 'mouseup', (e) => {
        computeVolume(1, e.clientY || 0, volumeDomY);
        stop1();
        stop2();
      });
    });
  }
  private _muted() {
    const player = this.player;
    player.muted = true;
  }
  private _active() {
    const { player } = this;
    const volume = player.volume;
    player.muted = false;

    if (volume === 0) {
      const volume = player.options.volume;
      player.volume = volume;
    }
  }
  private _volumeChangeHandle() {
    const player = this.player;
    const muted = player.muted;
    const volume = player.volume;
    const { volumeBarActive } = this;
    volumeBarActive.style.height = muted ? '0%' : `${volume * 100}%`;

    const mutedUi = muted || volume === 0;

    const { activeButton, mutedButton } = this;
    if (mutedUi) {
      mutedButton.classList.remove('hide');
      activeButton.classList.add('hide');
    } else {
      mutedButton.classList.add('hide');
      activeButton.classList.remove('hide');
    }
  }
}
