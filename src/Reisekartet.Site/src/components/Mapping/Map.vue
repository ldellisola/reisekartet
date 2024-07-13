<template>
  <DestinationViewDialog @close="clearSelection" :destinationId="selectedDestinationId" />
  <div id="map"></div>
</template>

<script lang="ts" setup>
import 'ol/ol.css'
import { useDestinationStore } from '@/stores/Destinations'
import useOpenLayers from '@/composables/useOpenLayers'
import { ref, watch } from 'vue'
import DestinationViewDialog from '@components/Destination/DestinationView/DestinationViewDialog.vue'

export interface MapProps {
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<MapProps>(), {
  // @ts-ignore
  center: [0, 0],
  zoom: 1
})

const selectedDestinationId = ref<string | undefined>(undefined)

const destinationStore = useDestinationStore()

const { loadDestinations, onFeatureEvent, clearFeatureSelection } = useOpenLayers({
  target: 'map',
  center: props.center,
  zoom: props.zoom
})

function clearSelection() {
  selectedDestinationId.value = undefined
  clearFeatureSelection()
}

function onDestinationSelected(destinationIds: string[]) {
  if (destinationIds.length === 1) selectedDestinationId.value = destinationIds[0]
}

onFeatureEvent({
  selected: onDestinationSelected
})

watch(
  () => destinationStore.filteredDestinations,
  (value) => loadDestinations({ animate: true, destinations: value, enableClustering: true }),
  { immediate: true }
)
</script>

<style scoped>
#map {
  width: 100%;
  height: 800px;
}
</style>
