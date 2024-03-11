<template>
  <DestinationViewDialog />
  <MultipleDestinationViewDialog />
  <v-container>
    <v-row>
      <v-col cols="12" sm="4" md="3" lg="2" xl="2" class="d-flex align-center py-1">
        <router-link to="/destination">
          <v-btn elevation="10" color="primary">New Destination</v-btn>
        </router-link>
      </v-col>

      <v-col cols="12" sm="5" md="3" lg="3" xl="2" class="d-flex align-center py-1">
        <ImportDestinationDialog />
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" sm="12" md="12" lg="7" xl="8" class="d-flex justify-end py-1">
        <FilterBox />
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
import DestinationLayer from '@components/Mapping/MultipleDestinationsLayer.vue'
import { useDestinationStore } from '@store/Destinations'
import ImportDestinationDialog from '@components/ImportDestinations/ImportDestinationDialog.vue'
import DestinationViewDialog from '@components/Destination/DestinationViewDialog/DestinationViewDialog.vue'
import MultipleDestinationViewDialog from '@components/Destination/MultipleDestinationView/MultipleDestinationViewDialog.vue'
import FilterBox from '@components/Filters/FilterBox.vue'

const destinations = useDestinationStore()
await destinations.refresh()

</script>

<style scoped></style>
