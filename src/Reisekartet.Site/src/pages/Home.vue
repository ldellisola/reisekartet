<template>
  <v-container>
    <v-row align="end" justify="space-between" style="margin-left: 0; margin-right: 0">
      <v-col cols="2">
        <CreateDestination justify="start" />
      </v-col>

      <v-col
        cols="2"
        style="padding-bottom: 0; padding-top: 0; padding-right: 0"
        class="text-right"
      >
        <Filters />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="10">
          <Map>
            <destination-layer
              v-for="[type, list] in destinations.byType"
              :destinations="list"
              :type="type"
            />
          </Map>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="10">
          <DestinationList />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Map from '@components/Mapping/Map.vue'
import DestinationList from '@components/DestinationList.vue'
import CreateDestination from '@components/CreateDestination/CreateDestinationDialog.vue'
import DestinationLayer from '@components/Mapping/MultipleDestinationsLayer.vue'
import { useDestinationStore } from '@store/Destinations'
import Filters from '@components/Filters/FiltersDialog.vue'
const destinations = useDestinationStore()
</script>
