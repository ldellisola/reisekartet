import { defineStore } from 'pinia'
import { useDestinationStore } from '@store/Destinations'
import { computed, ref, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'

export const useDestinationViewDialog = defineStore('DestinationViewDialog', () => {
  const isOpen = ref(false)
  const destination = ref<Destination | undefined>(undefined)

  watch(isOpen, (value) => {
    if (!value) {
      destination.value = undefined
    }
  })
  const destinationStore = useDestinationStore()

  function open(destinationId: string) {
    destination.value = destinationStore.get(destinationId)
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    destination,
    open,
    close
  }
})
