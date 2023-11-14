<template>
  <v-data-table-virtual :headers="headers" :items="destinations.all" class="elevation-1">
    <template v-slot:item.actions="{ item }">
      <v-icon @click="destinations.remove(item.id)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.tags="{ value }">
      <v-chip v-for="tag in value" :color="getColor(tag)">
        {{ tag }}
      </v-chip>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { useDestinationStore } from '@store/Destinations'
import { getColor } from '@/lib/StringFunctions'
const destinations = useDestinationStore()
await destinations.refresh()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Tags', key: 'tags' },
  { title: 'City', key: 'city' },
  { title: 'Country', key: 'country' },
  { title: 'Latitude', key: 'latitude' },
  { title: 'Longitude', key: 'longitude' },
  { title: 'Actions', key: 'actions', sortable: false }
]
</script>
