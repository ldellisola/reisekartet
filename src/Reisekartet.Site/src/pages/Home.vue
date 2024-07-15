<template>
  <div class="flex flex-col mx-4 gap-5">
    <div class="flex items-center gap-5 flex-wrap">
      <div class="flex gap-3 flex-wrap">
        <!-- <button -->
        <!--   class="bg-primary rounded py-1 px-2 uppercase font-medium text-justify line-" -->
        <!--   @click="router.push('/destination')" -->
        <!-- > -->
        <!--   New Destination -->
        <!-- </button> -->

        <v-btn elevation="10" color="primary" @click="router.push('/destination')">
          New Destination
        </v-btn>
        <div class="grow">
          <ImportDestinationDialog />
        </div>
      </div>

      <div class="grow">
        <FilterBox />
      </div>
    </div>
    <div>
      <v-card elevation="10">
        <Map>
          <destination-layer
            v-for="[type, list] in destinations.byType"
            :destinations="list"
            :type="type"
          />
        </Map>
      </v-card>
    </div>
    <div>
      <v-card elevation="10">
        <DestinationList />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Map from '@components/Mapping/Map.vue'
import DestinationList from '@components/DestinationList.vue'
import DestinationLayer from '@components/Mapping/MultipleDestinationsLayer.vue'
import { useDestinationStore } from '@store/Destinations'
import ImportDestinationDialog from '@components/ImportDestinations/ImportDestinationDialog.vue'
import FilterBox from '@components/Filters/FilterBox.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const destinations = useDestinationStore()
await destinations.refresh()
</script>

<style scoped></style>
