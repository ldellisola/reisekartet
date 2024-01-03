<template>
  <ol-vector-layer>
    <ol-source-cluster :distance="40">
      <ol-source-vector>
        <ol-feature
          v-for="destination in destinations"
          :key="destination.latitude * 2 + destination.longitude * 3"
          :properties="{ type: type, id: destination.id }"
        >
          <ol-geom-point
            :coordinates="transformCoordinates(destination.longitude, destination.latitude)"
          />
        </ol-feature>
      </ol-source-vector>
    </ol-source-cluster>

    <ol-style :overrideStyleFunction="overrideStyleFunction">
      <ol-style-stroke color="black" :width="2"></ol-style-stroke>
      <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>

      <ol-style-circle :radius="10">
        <ol-style-fill :color="color"></ol-style-fill>
        <ol-style-stroke color="#fff" :width="1"></ol-style-stroke>
      </ol-style-circle>
      <ol-style-text>
        <ol-style-fill color="#fff"></ol-style-fill>
      </ol-style-text>
    </ol-style>
  </ol-vector-layer>
</template>

<script lang="ts" setup>
import type { Destination } from '@/api/Models/Destination'
import { transform } from 'ol/proj.js'
import { getColor } from '@/lib/StringFunctions'
const props = defineProps<{
  destinations: Destination[]
  type: string
}>()
const transformCoordinates = (longitude: number, latitude: number) => {
  return transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')
}

const overrideStyleFunction = (feature: any, style: any) => {
  let clusteredFeatures = feature.get('features')
  let size = clusteredFeatures.length
  style.getText().setText(size.toString())
}

const color = getColor(props.type)
</script>
