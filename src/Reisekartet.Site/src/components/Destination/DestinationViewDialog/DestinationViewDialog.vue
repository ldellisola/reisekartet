<script setup lang="ts">
import { useDestinationStore } from '@/stores/Destinations'
import DestinationView from '@components/Destination/DestinationView.vue'
import { computed, ref, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'

export interface DestinationViewDialogProps {
  destinationId?: string
}
const destinationStore = useDestinationStore()

const props = defineProps<DestinationViewDialogProps>()
const emit = defineEmits(['close'])
const loading = ref(false)
const destination = ref<Destination | undefined>(undefined)

watch(
  () => props.destinationId,
  async (destinationId) => {
    console.log('destinationId', destinationId)

    if (destinationId !== undefined) {
      loading.value = true
      destination.value = await destinationStore.get(destinationId)
    }
  },
  { immediate: true }
)

const isOpen = computed(
  () => props.destinationId !== undefined && (!loading || destination !== undefined)
)

function close() {
  emit('close')
  destination.value = undefined
  loading.value = false
}
</script>

<template>
  <v-dialog class="w-75" @click:outside="close" v-model="isOpen">
    <DestinationView @close="close" v-if="destination !== undefined" :destination="destination!" />
  </v-dialog>
</template>

<style scoped></style>
