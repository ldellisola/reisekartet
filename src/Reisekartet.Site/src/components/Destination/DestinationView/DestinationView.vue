<script lang="ts" setup>
import SingleDestinationLayer from '@components/Mapping/SingleDestinationLayer.vue'
import { isNullOrWhitespace } from '@/lib/StringFunctions'
import Map from '@components/Mapping/Map.vue'
import type { Destination } from '@/api/Models/Destination'
import Tag from '@components/Tag.vue'
import { useDestinationStore } from '@store/Destinations'
import useOpenLayers from '@/composables/useOpenLayers'
import { useConfiguration } from '@/stores/Configuration'

const props = defineProps<{
  destination: Destination
}>()

const emit = defineEmits<{
  close: []
}>()

const configuration = useConfiguration()
const destinations = useDestinationStore()
console.log(props.destination)
console.log([props.destination.longitude, props.destination.latitude])
const { loadDestinations } = useOpenLayers({
  target: 'destination-map',
  projection: configuration.projection,
  center: [props.destination.longitude, props.destination.latitude],
  zoom: 15,
  tileServerUrl: configuration.tileServer
})

async function deleteDestination(id: string) {
  await destinations.remove(id)
  emit('close')
}

loadDestinations({ destinations: [props.destination], enableClustering: false })
</script>

<template>
  <v-card class="mx-auto w-100">
    <v-card-title>{{ destination.name }}</v-card-title>
    <v-card-subtitle>
      <Tag v-for="tag in destination.tags" :name="tag" />
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card class="elevation-2 fill-height">
            <v-card-title>Information</v-card-title>
            <v-card-text>
              <p><b>Latitude</b>: {{ destination.latitude }}</p>
              <p><b>Longitude</b>: {{ destination.longitude }}</p>
              <p v-if="!isNullOrWhitespace(destination.website)">
                <b>Website</b>:
                <a :href="destination.website!" target="_blank">{{ destination.website }}</a>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <div id="destination-map" style="width: 100%; height: 400px"></div>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :href="`https://www.google.com/maps/search/?api=1&query=${destination?.latitude},${destination?.longitude}`"
        target="_blank"
      >
        Open in Google Maps
      </v-btn>
      <router-link :to="`/destination/${destination.id}`">
        <v-btn>Edit</v-btn>
      </router-link>
      <v-btn @click="deleteDestination(destination.id)" color="error">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card-subtitle {
  opacity: unset;
}
</style>
