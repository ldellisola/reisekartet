<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import DestinationView from '@components/Destination/DestinationView/DestinationView.vue'
import { useDestinationStore } from '@/stores/Destinations'

export interface MultipleDestinationViewDialogProps {
  destinationId?: string
}

const destinationStore = useDestinationStore()

const props = defineProps<MultipleDestinationViewDialogProps>()
const emit = defineEmits(['close'])

const selectedDestination = ref<Destination | undefined>(undefined)

const isOpen = ref<boolean>(false)
watch(
  () => props.destinationId,
  async (destinationId) => {
    if (destinationId === undefined) {
      isOpen.value = false
      return
    }

    selectedDestination.value = await destinationStore.get(destinationId)
    isOpen.value = true
  }
)

function close() {
  selectedDestination.value = undefined
  emit('close')
}

function closeOnKeyboardInut(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('keydown', closeOnKeyboardInut)
})
onUnmounted(() => {
  window.removeEventListener('keydown', closeOnKeyboardInut)
})
</script>

<template>
  <v-dialog class="h-100 w-75" @click:outside="close" v-model="isOpen">
    <DestinationView
      @close="close"
      v-if="selectedDestination !== undefined"
      :destination="selectedDestination!"
    />
  </v-dialog>
</template>

<style scoped></style>
