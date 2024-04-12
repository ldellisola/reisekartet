<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import DestinationView from '@components/Destination/DestinationView.vue'
import Tag from '@components/Tag.vue'
import { useDestinationStore } from '@/stores/Destinations'

export interface MultipleDestinationViewDialogProps {
  destinationIds?: string[]
}

const destinationStore = useDestinationStore()

const props = defineProps<MultipleDestinationViewDialogProps>()
const emit = defineEmits(['close'])

const selectedDestination = ref<Destination | undefined>(undefined)
const destinations = ref<Destination[] | undefined>()
const loading = ref(false)
const headers = [
  { title: 'Name', key: 'name', width: '20%' },
  { title: 'Tags', key: 'tags', width: '40%' },
  { title: 'City', key: 'city', width: '20%' },
  { title: 'Country', key: 'country', width: '10%' },
  { title: 'Actions', key: 'actions', width: '25%', sortable: false }
]

function close() {
  selectedDestination.value = undefined
  emit('close')
  loading.value = false
}

watch(
  () => props.destinationIds,
  async (destinationIds) => {
    console.log('destinationIds', destinationIds)
    if (destinationIds === undefined) return

    loading.value = true
    destinations.value = (await Promise.all(
      destinationIds.map((id) => destinationStore.get(id))
    )) as Destination[]
  },
  { immediate: true }
)

const isOpen = computed(
  () => props.destinationIds !== undefined && (!loading || destinations !== undefined)
)
</script>

<template>
  <v-dialog class="h-100 w-75" @click:outside="close" v-model="isOpen">
    <DestinationView
      @close="close"
      v-if="selectedDestination !== undefined"
      :destination="selectedDestination!"
    />
    <v-card class="mx-auto w-100 h-100" v-else>
      <v-card-text>
        <v-data-table-virtual
          height="500px"
          :headers="headers"
          fixed-header
          hover
          :items="destinations"
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
