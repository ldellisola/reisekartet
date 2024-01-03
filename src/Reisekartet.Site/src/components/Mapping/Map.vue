<template>
  <ol-map
    ref="mapRef"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    height="100%"
    style="height: 800px"
    :controls="[]"
  >
    <ol-view
      ref="view"
      :center="transform(center, 'EPSG:4326', projection)"
      :zoom="zoom"
      :rotation="rotation"
      :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-interaction-select
      @select="featureSelected"
      :condition="selectCondition"
      :filter="selectInteractionFilter"
    >
      <ol-style>
        <ol-style-icon :src="marker" :scale="0.05"></ol-style-icon>
      </ol-style>
    </ol-interaction-select>

    <slot></slot>
  </ol-map>
</template>

<script lang="ts" setup>
import { transform } from 'ol/proj.js'
import { inject, ref, watch } from 'vue'
import marker from '@/assets/marker.png'
import { useDestinationViewDialog } from '@components/Destination/DestinationView.Dialog'
import type Map from 'ol/Map'

const destinationViewDialog = useDestinationViewDialog()

const mapRef = ref(null)

defineProps({
  center: {
    type: Array<Number>,
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

const selectConditions = inject('ol-selectconditions')
const selectCondition = selectConditions.click

const featureSelected = (event: any) => {
  if (event.selected[0] === undefined) {
    destinationViewDialog.close()
    return
  }
  for (let feature of event.selected[0].values_.features) {
    destinationViewDialog.open(feature.values_.id)
    return
  }
}

watch(
  () => destinationViewDialog.isOpen,
  (isOpen) => {
    if (!isOpen) {
      const map = mapRef.value?.map as Map
      map.getInteractions().forEach((interaction) => {
        if (interaction.getFeatures !== undefined) interaction.getFeatures().clear()
      })
    }
  }
)

const selectInteractionFilter = (feature: any) => {
  return !destinationViewDialog.isOpen && feature.values_.features.length > 0
}
</script>

<style scoped>
.overlay-content {
  background: #efefef;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
  color: black;
}
</style>
