<template>
  <DestinationViewDialog @close="clearSelection" :destinationId="singleDestination" />
  <MultipleDestinationViewDialog @close="clearSelection" :destinationIds="multipleDestinationIds" />
  <div id="map"></div>
</template>

<script lang="ts" setup>
import 'ol/ol.css'
import { useConfiguration } from '@/stores/Configuration'
import { useDestinationStore } from '@/stores/Destinations'
import useOpenLayers from '@/composables/useOpenLayers'
import { computed, ref, watch } from 'vue'
import DestinationViewDialog from '../Destination/DestinationViewDialog/DestinationViewDialog.vue'
import MultipleDestinationViewDialog from '../Destination/MultipleDestinationView/MultipleDestinationViewDialog.vue'

export interface MapProps {
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<MapProps>(), {
  // @ts-ignore
  center: [0, 0],
  zoom: 1
})

const selectedDestinationIds = ref<string[]>([])

const singleDestination = computed(() =>
  selectedDestinationIds.value.length === 1 ? selectedDestinationIds.value[0] : undefined
)

const multipleDestinationIds = computed(() => {
  return selectedDestinationIds.value.length > 1 ? selectedDestinationIds.value : undefined
})

const configuration = useConfiguration()
await configuration.load()

const destinationStore = useDestinationStore()

const { loadDestinations, onFeatureEvent, clearFeatureSelection } = useOpenLayers({
  target: 'map',
  center: props.center,
  zoom: props.zoom,
  projection: configuration.projection,
  tileServerUrl: configuration.tileServer
})

function clearSelection() {
  selectedDestinationIds.value = []
  clearFeatureSelection()
}

function onDestinationSelected(destinationIds: string[]) {
  console.log('selecting things', destinationIds)
  if (destinationIds.length === 0) selectedDestinationIds.value = []
  if (destinationIds.length > 0) selectedDestinationIds.value = destinationIds
}

onFeatureEvent({
  selected: onDestinationSelected
})

watch(
  () => destinationStore.filteredDestinations,
  (value) => loadDestinations(value, true),
  { immediate: true }
)
</script>

<style scoped>
#map {
  width: 100%;
  height: 800px;
}
</style>
