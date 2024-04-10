<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import 'ol/ol.css'
import { useConfiguration } from '@/stores/Configuration'
import { useDestinationStore } from '@/stores/Destinations'
import useOpenLayers from '@/composables/useOpenLayers'
import { watch } from 'vue'
import { useDestinationViewDialog } from '../Destination/DestinationViewDialog/DestinationView.Dialog'
import { useMultipleDestinationViewDialog } from '../Destination/MultipleDestinationView/MultipleDestinationView.Dialog'

export interface MapProps {
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<MapProps>(), {
  // @ts-ignore
  center: [0, 0],
  zoom: 1
})

const configuration = useConfiguration()
await configuration.load()

const destinationStore = useDestinationStore()
const destinationViewDialog = useDestinationViewDialog()
const multipleDestinationViewDialog = useMultipleDestinationViewDialog()

const { loadDestinations, onFeatureEvent, clearFeatureSelection } = useOpenLayers({
  target: 'map',
  center: props.center,
  zoom: props.zoom,
  projection: configuration.projection,
  tileServerUrl: configuration.tileServer
})

function onDestinationSelected(destinationIds: string[]) {
  if (destinationIds.length === 0) destinationViewDialog.close()
  if (destinationIds.length === 1) destinationViewDialog.open(destinationIds[0])
  if (destinationIds.length > 1) multipleDestinationViewDialog.open(destinationIds)
}

onFeatureEvent({
  selected: onDestinationSelected
})

watch(
  () => destinationViewDialog.isOpen,
  (value) => {
    if (!value) clearFeatureSelection()
  }
)

watch(
  () => destinationStore.filteredDestinations,
  (value) => loadDestinations(value, false),
  { immediate: true }
)
</script>

<style scoped>
#map {
  width: 100%;
  height: 800px;
}
</style>
