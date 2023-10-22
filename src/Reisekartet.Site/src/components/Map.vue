<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    height="100%"
    style="height: 600px"
    @singleclick="featureSelected"
  >
    <ol-view
      ref="view"
      :center="center"
      :zoom="zoom"
      :rotation="rotation"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <destination-layer
      v-for="[type, list] in groupBy(destinations.all, (t) => t.type).entries()"
      :destinations="list"
      :type="type"
    />
  </ol-map>
</template>

<script lang="ts" setup>
import { useDestinationStore } from '@store/Destinations'
import { ref } from 'vue'
import { groupBy } from '@/lib/ArrayFunctions'
import type { MapClickEvent } from '@/types/MapClickEvent'
import { useDestinationEditorForm } from '@store/DestinationEditor.form'
import DestinationLayer from '@components/DestinationLayer.vue'

const destinationEditor = useDestinationEditorForm()
const destinations = useDestinationStore()

const center = ref([0, 0])
const zoom = ref(2)
const rotation = ref(0)
const projection = ref('EPSG:4326')

const featureSelected = (event: MapClickEvent) => {
  destinationEditor.setCords(event.coordinate[1], event.coordinate[0])
}
</script>

<style scoped></style>
