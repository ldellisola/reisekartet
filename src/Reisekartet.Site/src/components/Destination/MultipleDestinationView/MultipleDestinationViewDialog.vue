<script setup lang="ts">
import { useMultipleDestinationViewDialog } from '@components/Destination/MultipleDestinationView/MultipleDestinationView.Dialog'
import { ref } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import DestinationView from '@components/Destination/DestinationView.vue'
import { getColor, isNullOrWhitespace } from '@/lib/StringFunctions'
import Tag from '@components/Tag.vue'

const destinationViewDialog = useMultipleDestinationViewDialog()

const selectedDestination = ref<Destination | undefined>(undefined)

const headers = [
  { title: 'Name', key: 'name', width: '20%' },
  { title: 'Tags', key: 'tags', width: '40%' },
  { title: 'City', key: 'city', width: '20%' },
  { title: 'Country', key: 'country', width: '10%' },
  { title: 'Actions', key: 'actions', width: '25%', sortable: false }
]

function close() {
  selectedDestination.value = undefined
}

destinationViewDialog.onClose(close)
</script>

<template>
  <v-dialog class="h-100 w-75" v-model="destinationViewDialog.isOpen">
    <DestinationView v-if="selectedDestination !== undefined" :destination="selectedDestination!" />
    <v-card class="mx-auto w-100 h-100" v-else>
      <v-card-text>
        <v-data-table-virtual
          height="500px"
          :headers="headers"
          fixed-header
          hover
          :items="destinationViewDialog.destinations"
        >
          <template v-slot:item.tags="{ value }">
            <Tag v-for="tag in value" :key="tag" :name="tag" />
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon @click="selectedDestination = item">mdi-eye</v-icon>
          </template>
        </v-data-table-virtual>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
