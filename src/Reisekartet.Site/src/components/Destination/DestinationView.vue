<script lang="ts" setup>
import SingleDestinationLayer from '@components/Mapping/SingleDestinationLayer.vue'
import { getColor, isNullOrWhitespace } from '@/lib/StringFunctions'
import Map from '@components/Mapping/Map.vue'
import type { Destination } from '@/api/Models/Destination'

defineProps<{
  destination: Destination
}>()
</script>

<template>
  <v-card class="mx-auto w-75">
    <v-card-title>{{ destination?.name }}</v-card-title>
    <v-card-subtitle>
      <v-chip class="ms-1" variant="flat" v-for="tag in destination?.tags" :color="getColor(tag)">
        {{ tag }}
      </v-chip>
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-card class="elevation-2 fill-height">
            <v-card-title>Information</v-card-title>
            <v-card-text>
              <p><b>Latitude</b>: {{ destination?.latitude }}</p>
              <p><b>Longitude</b>: {{ destination?.longitude }}</p>
              <p v-if="!isNullOrWhitespace(destination?.website)">
                <b>Website</b>:
                <a :href="destination?.website!" target="_blank">{{ destination?.website }} </a>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="!isNullOrWhitespace(destination?.description)">
          <v-card class="elevation-2 fill-height">
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <p>{{ destination?.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <Map
          :center="[destination?.longitude ?? 0, destination?.latitude ?? 0]"
          :zoom="15"
          :rotation="0"
          style="width: 100%; height: 400px"
        >
          <SingleDestinationLayer :destination="destination!" />
        </Map>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :href="`https://www.google.com/maps/search/?api=1&query=${destination?.latitude},${destination?.longitude}`"
        target="_blank"
      >
        Open in Google Maps
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
