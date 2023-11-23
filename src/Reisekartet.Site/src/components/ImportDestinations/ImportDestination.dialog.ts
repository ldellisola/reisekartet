import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { postResource } from '@/api/reisekartetClient'
import { useDestinationStore } from '@store/Destinations'

export interface DropEvent extends DragEvent {
  dataTransfer: DataTransfer
}

export const useImportDestinationDialog = defineStore('ImportDestinationsDialog', () => {
  const destinationStore = useDestinationStore()

  const files = ref<File[]>([])
  const isOpen = ref(false)
  const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

  watch(isOpen, (value) => clearFiles())

  function addFile(file: File) {
    if (file.type === 'application/vnd.google-earth.kml+xml') {
      files.value.push(file)
    }
  }

  function removeFile(index: number) {
    files.value.splice(index, 1)
  }

  function clearFiles() {
    files.value = []
  }

  async function sendFiles() {
    state.value = 'loading'
    for (const file of files.value) {
      const formData = new FormData()
      formData.append('kmlFile', file)
      const { error } = await postResource('/destinations/bulk', formData)
      if (error) {
        state.value = 'error'
        console.error(error)
      } else {
        state.value = 'success'
        await destinationStore.refresh()
        setTimeout(() => {
          isOpen.value = false
        }, 2000)
      }
    }
  }

  return {
    files,
    isOpen,
    state,
    addFile,
    removeFile,
    clearFiles,
    sendFiles
  }
})
