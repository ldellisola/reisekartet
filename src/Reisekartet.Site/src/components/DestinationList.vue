<template>
  <DestinationViewDialog @close="close" :destinationIds="selectedDestination" />
  <v-data-table-virtual
    :headers="headers"
    :items="destinations.filteredDestinations"
    class="elevation-10"
    fixed-header
    height="600"
  >
    <template v-slot:item.actions="{ item }">
      <v-row>
        <a
          style="color: inherit"
          @click="oldId = item.id"
          :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`"
          target="_blank"
        >
          <v-icon>mdi-map-marker</v-icon>
        </a>
        <v-icon @click="selectedDestination = [item.id]">mdi-eye</v-icon>
        <v-icon @click="edit(item.id)">mdi-pencil</v-icon>
        <v-icon @click="remove(item.id)">mdi-delete</v-icon>
      </v-row>
    </template>
    <template v-slot:item.tags="{ value }">
      <Tag v-for="tag in value" :key="tag" :name="tag" />
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { useDestinationStore } from '@store/Destinations'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Tag from '@components/Tag.vue'
import DestinationViewDialog from '@components/Destination/DestinationView/DestinationViewDialog.vue'
const destinations = useDestinationStore()
const router = useRouter()

async function remove(id: string) {
  await destinations.remove(id)
}

function edit(id: string) {
  router.push(`/destination/${id}`)
}

function close() {
  selectedDestination.value = []
}

const selectedDestination = ref<string[]>([])
const headers = [
  { title: 'Name', key: 'name', width: '20%' },
  { title: 'Tags', key: 'tags', width: '40%' },
  { title: 'City', key: 'city', width: '20%' },
  { title: 'Country', key: 'country', width: '10%' },
  { title: 'Actions', key: 'actions', width: '25%', sortable: false }
]
</script>
