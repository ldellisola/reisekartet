<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    height="100%"
    style="height: 600px"
  >
    <ol-view
      ref="view"
      :center="transform(center, 'EPSG:4326', projection)"
      :zoom="zoom"
      :rotation="rotation"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm :url="configuration.tileServer" />
    </ol-tile-layer>

    <slot></slot>
  </ol-map>
</template>

<script lang="ts" setup>
import { transform } from 'ol/proj.js'
import { useConfiguration } from '@store/Configuration'

const configuration = useConfiguration()
await configuration.refresh()
defineProps({
  center: {
    type: Array,
    default: () => [0, 0]
  },
  zoom: {
    type: Number,
    default: 2
  },
  rotation: {
    type: Number,
    default: 0
  },
  projection: {
    type: String,
    default: 'EPSG:3857'
  }
})
</script>

<style scoped></style>
