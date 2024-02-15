import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import { useDestinationStore } from '@store/Destinations'

export const useMultipleDestinationViewDialog = defineStore('MultipleDestinationViewDialog', () => {
  const isOpen = ref(false)
  const onCloseCallbacks = ref<(() => void)[]>([() => (destinations.value = [])])
  const destinations = ref<Destination[]>([])

  watch(isOpen, (value) => {
    if (!value) {
      onCloseCallbacks.value.forEach((callback) => callback())
    }
  })
  const destinationStore = useDestinationStore()

  async function open(destinationIds: string[]) {
    destinations.value = []

    for (const id of destinationIds) {
      const destination = await destinationStore.get(id, false)
      if (destination) {
        destinations.value.push(destination)
      }
    }
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function onClose(action: () => void) {
    onCloseCallbacks.value.push(action)
  }

  return {
    isOpen,
    destinations,
    open,
    onClose,
    close
  }
})
