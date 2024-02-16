<template>
  <DestinationViewDialog />
  <MultipleDestinationViewDialog />
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-btn @click="router.push('/destination')" elevation="10" color="primary"
          >Add Destination</v-btn
        >
      </v-col>

      <v-col cols="4" class="text-left">
        <ImportDestinationDialog />
      </v-col>

      <v-col class="text-right" cols="5">
        <FilterBox />
        <!--        <Filters />-->
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
import { useRouter } from 'vue-router'
import FilterBox from '@components/Filters/FilterBox.vue'
const destinations = useDestinationStore()
await destinations.refresh()

const router = useRouter()
</script>

<style scoped>
.v-col {
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.v-row {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
