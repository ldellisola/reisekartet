<template>
  <ol-vector-layer>
    <ol-source-vector>
      <ol-feature>
        <ol-geom-point :coordinates="transformCoordinates(destination)" />
      </ol-feature>
    </ol-source-vector>

    <ol-style>
      <ol-style-stroke color="black" :width="2"></ol-style-stroke>
      <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>

      <ol-style-circle :radius="10">
        <ol-style-fill color="green"></ol-style-fill>
        <ol-style-stroke color="#fff" :width="1"></ol-style-stroke>
      </ol-style-circle>
      <ol-style-text>
        <ol-style-fill color="#fff"></ol-style-fill>
      </ol-style-text>
    </ol-style>
  </ol-vector-layer>
</template>

<script lang="ts" setup>
import type { PlaceLocation } from '@/api/Models/Destination'
import { transform } from 'ol/proj'
import { toArray } from '@/lib/ArrayFunctions'
import { useConfiguration } from '@store/Configuration'

const props = defineProps<{
  destination: PlaceLocation
}>()

const configuration = useConfiguration()
await configuration.load()

const transformCoordinates = (destination: PlaceLocation) => {
  return transform(toArray(destination)!, 'EPSG:4326', configuration.projection)
}
</script>
