<template>
  <ol-vector-layer>
    <ol-source-cluster :distance="40">
      <ol-source-vector>
        <ol-feature
          v-for="destination in destinations"
          :key="destination.id"
          :properties="{ type: destination.type }"
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

const props = defineProps<{
  destinations: Destination[]
  type: string
}>()
const transformCoordinates = (longitude: number, latitude: number) => {
  return [longitude, latitude]
}

const overrideStyleFunction = (feature: any, style: any) => {
  let clusteredFeatures = feature.get('features')
  let size = clusteredFeatures.length
  style.getText().setText(size.toString())
}

const color = getColor(props.type)

function getColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}
</script>
