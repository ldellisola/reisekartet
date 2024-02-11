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
      :center="transform(center ?? [0, 0], 'EPSG:4326', projection)"
      :zoom="zoom"
      :rotation="rotation"
      :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-osm :url="configuration.tileServer" />
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
import { useConfiguration } from '@store/Configuration'
import { inject, ref, watch } from 'vue'
import marker from '@/assets/marker.png'
import { useDestinationViewDialog } from '@components/Destination/DestinationViewDialog/DestinationView.Dialog'
import type Map from 'ol/Map'
import { useMultipleDestinationViewDialog } from '@components/Destination/MultipleDestinationView/MultipleDestinationView.Dialog'

const destinationViewDialog = useDestinationViewDialog()
const multipleDestinationViewDialog = useMultipleDestinationViewDialog()

const mapRef = ref(null)

const configuration = useConfiguration()
await configuration.load()
defineProps({
  center: {
    type: Array<Number>,
    default: () => [20, 0]
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

const featureSelected = async (event: any) => {
  if (event.selected[0] === undefined) {
    destinationViewDialog.close()
    return
  }

  if (event.selected[0].values_.features.length === 0) {
    destinationViewDialog.close()
  } else if (event.selected[0].values_.features.length == 1) {
    await destinationViewDialog.open(event.selected[0].values_.features[0].values_.id)
  } else {
    console.log(event.selected[0].values_.features.map((feature: any) => feature.values_.id))
    await multipleDestinationViewDialog.open(
      event.selected[0].values_.features.map((feature: any) => feature.values_.id)
    )
  }
}

multipleDestinationViewDialog.onClose(() => {
  const map = mapRef.value?.map as Map
  console.debug(map)
  map.getInteractions().forEach((interaction) => {
    if (interaction.getFeatures !== undefined) interaction.getFeatures().clear()
  })
})
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
