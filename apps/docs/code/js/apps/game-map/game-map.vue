<script lang="ts" setup>
import { onMounted } from 'vue';
import Leaflet from 'leaflet';

onMounted(() => {
  const map = Leaflet.map('game-map', { scrollWheelZoom: false }).setView(
    [-29.5, 145],
    3.5
  );
  const basemaps = {
    StreetView: Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ),
    Topography: Leaflet.tileLayer.wms(
      'http://ows.mundialis.de/services/service?',
      { layers: 'TOPO-WMS' }
    ),
    Places: Leaflet.tileLayer.wms('http://ows.mundialis.de/services/service?', {
      layers: 'OSM-Overlay-WMS',
    }),
  };
  Leaflet.control.layers(basemaps).addTo(map);
  basemaps.Topography.addTo(map);
});
</script>

<template>
  <div>
    <h1>Map</h1>
    <div id="game-map" />
  </div>
</template>
