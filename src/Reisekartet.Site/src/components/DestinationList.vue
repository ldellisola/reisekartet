<template>
  <v-data-table-virtual :headers="headers" :items="destinations.all" class="elevation-1">
    <template v-slot:item.actions="{ item }">
      <v-icon @click="destinations.remove(item.id)">mdi-delete</v-icon>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { useDestinationStore } from '@store/Destinations'
const destinations = useDestinationStore()
await destinations.refresh()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Latitude', key: 'latitude' },
  { title: 'Longitude', key: 'longitude' },
  { title: 'Actions', key: 'actions', sortable: false }
]
</script>
