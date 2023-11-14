import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDestinationStore } from '@store/Destinations'

export interface Filters {
  name: string
  tags: string[]
  city: string
  country: string
}

export const useFiltersDialog = defineStore('FiltersDialog', () => {
  const isOpen = ref(true)
  const name = ref('')
  const country = ref('')
  const city = ref('')
  const tags = ref<string[]>([])

  const destinationStore = useDestinationStore()

  function applyFilters() {
    destinationStore.setFilters({
      name: name.value,
      country: country.value,
      city: city.value,
      tags: tags.value
    })
    isOpen.value = false
  }
  function resetFilters() {
    name.value = ''
    country.value = ''
    city.value = ''
    tags.value = []
    applyFilters()
  }

  return {
    isOpen,
    name,
    country,
    city,
    tags,
    applyFilters,
    resetFilters
  }
})
