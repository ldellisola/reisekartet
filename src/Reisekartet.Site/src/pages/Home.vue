<template>
  <div
    class="flex flex-col px-6 gap-5 h-screen overflow-y-scroll sm:overflow-y-hidden no-scrollbar"
  >
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
    <div class="rounded-xl flex flex-col sm:flex-row gap-4 sm:h-[85svh]">
      <div class="hover:shadow-2xl rounded-xl sm:w-4/5 w-full h-[60svh] sm:h-full">
        <Map :destinations="destinations.filteredDestinations" />
      </div>
      <div class="sm:w-1/5 h-[60svh] sm:h-full overflow-auto no-scrollbar w-full">
        <DestinationTable :destinations="destinations.filteredDestinations" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Map from '@components/Mapping/Map.vue'
import { useDestinationStore } from '@store/Destinations'
import ImportDestinationDialog from '@components/ImportDestinations/ImportDestinationDialog.vue'
import FilterBox from '@components/Filters/FilterBox.vue'
import { useRouter } from 'vue-router'
import DestinationTable from '@/components/DestinationTable.vue'

const router = useRouter()
const destinations = useDestinationStore()
await destinations.refresh()
</script>

<style scoped></style>
