<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const PIANO_KEY_LIST = [
  { key: 'a', type: 'white' },
  { key: 'w', type: 'black' },
  { key: 's', type: 'white' },
  { key: 'e', type: 'black' },
  { key: 'd', type: 'white' },
  { key: 'f', type: 'black' },
  { key: 't', type: 'white' },
  { key: 'g', type: 'black' },
  { key: 'y', type: 'white' },
  { key: 'h', type: 'black' },
  { key: 'u', type: 'white' },
  { key: 'j', type: 'black' },
  { key: 'k', type: 'white' },
  { key: 'o', type: 'black' },
  { key: 'l', type: 'white' },
  { key: 'p', type: 'black' },
  { key: ';', type: 'white' },
];

const allKeys = PIANO_KEY_LIST.map((item) => item.key); // getting all keys from PIANO_KEY_LIST array

let audio: null | HTMLAudioElement = null;

const playTune = (key) => {
  if (!audio) {
    return;
  }
  audio.src = `tunes/${key}.wav`; // passing audio src based on key pressed
  audio.play(); // playing audio
  const clickedKey = document.querySelector(`[data-key="${key}"]`); // getting clicked key element
  if (!clickedKey) {
    return;
  }
  clickedKey.classList.add('active'); // adding active class to the clicked key element
  setTimeout(() => {
    // removing active class after 150 ms from the clicked key element
    clickedKey.classList.remove('active');
  }, 150);
};

const handleVolume = (e) => {
  if (!audio) {
    return;
  }
  audio.volume = e.target.value; // passing the range slider value as an audio volume
};

const pressedKey = (e) => {
  // if the pressed key is in the allKeys array, only call the playTune function
  if (allKeys.includes(e.key)) playTune(e.key);
};

onMounted(() => {
  audio = new window.Audio(`tunes/a.wav`);
  document.addEventListener('keydown', pressedKey);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', pressedKey);
});
</script>

<template>
  <div class="wrapper">
    <header>
      <div class="title">PIANO</div>
      <div class="column volume-slider">
        <span>Volume</span
        ><input
          type="range"
          min="0"
          max="1"
          value="0.5"
          step="any"
          @click="handleVolume"
        />
      </div>
    </header>
    <ul class="piano-keys">
      <li
        v-for="item in PIANO_KEY_LIST"
        :key="item.key"
        class="key"
        :class="item.type"
        :data-key="item.key"
        @click="playTune(item.key)"
      >
        <span>{{ item.key }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  margin: 0;
}
li + li {
  margin: 0;
}
.wrapper {
  padding: 35px 40px;
  border-radius: 20px;
  background: #141414;
}
.wrapper header {
  display: flex;
  color: #b2b2b2;
  align-items: center;
  justify-content: space-between;
}
header .title {
  font-size: 1.6rem;
}
header .column {
  display: flex;
  align-items: center;
}
header span {
  font-weight: 500;
  margin-right: 15px;
  font-size: 1.19rem;
}
header input {
  outline: none;
  border-radius: 30px;
}
.volume-slider input {
  accent-color: #fff;
}
.piano-keys {
  display: flex;
  list-style: none;
  margin-top: 40px;
}
.piano-keys .key {
  cursor: pointer;
  user-select: none;
  position: relative;
  text-transform: uppercase;
}
.piano-keys .black {
  z-index: 2;
  width: 44px;
  height: 140px;
  margin: 0 -22px 0 -22px;
  border-radius: 0 0 5px 5px;
  background: linear-gradient(#333, #000);
}
.piano-keys .black.active {
  box-shadow: inset -5px -10px 10px rgba(255, 255, 255, 0.1);
  background: linear-gradient(to bottom, #000, #434343);
}
.piano-keys .white {
  height: 230px;
  width: 70px;
  border-radius: 8px;
  border: 1px solid #000;
  background: linear-gradient(#fff 96%, #eee 4%);
}
.piano-keys .white.active {
  box-shadow: inset -5px 5px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #fff 0%, #eee 100%);
}
.piano-keys .key span {
  position: absolute;
  bottom: 20px;
  width: 100%;
  color: #a2a2a2;
  font-size: 1.13rem;
  text-align: center;
}
.piano-keys .key.hide span {
  display: none;
}
.piano-keys .black span {
  bottom: 13px;
  color: #888888;
}

@media screen and (max-width: 815px) {
  .wrapper {
    padding: 25px;
  }
  header {
    flex-direction: column;
  }
  header :where(h2, .column) {
    margin-bottom: 13px;
  }
  .volume-slider input {
    max-width: 100px;
  }
  .piano-keys {
    margin-top: 20px;
  }
  .piano-keys .key:where(:nth-child(9), :nth-child(10)) {
    display: none;
  }
  .piano-keys .black {
    height: 100px;
    width: 40px;
    margin: 0 -20px 0 -20px;
  }
  .piano-keys .white {
    height: 180px;
    width: 60px;
  }
}

@media screen and (max-width: 615px) {
  .piano-keys .key:nth-child(13),
  .piano-keys .key:nth-child(14),
  .piano-keys .key:nth-child(15),
  .piano-keys .key:nth-child(16),
  .piano-keys .key :nth-child(17) {
    display: none;
  }
  .piano-keys .white {
    width: 50px;
  }
}
</style>
