import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getResource } from '@/api/reisekartetClient'
import type { SearchItem } from '@/types/SearchItem'

export const useFilters = defineStore('FilterStore', () => {
  const isLoading = ref(false)
  const possibleFilters = ref<SearchItem[]>([])
  const selectedFilters = ref<SearchItem[]>([])

  async function loadFilterSuggestions() {
    isLoading.value = true
    const { data, error } = await getResource<{ filters: SearchItem[] }>('/filters')
    if (error) {
      console.error(error)
      return
    }
    possibleFilters.value = data!.filters

    isLoading.value = false
  }

  return {
    isLoading,
    possibleFilters,
    selectedFilters,
    loadFilterSuggestions
  }
})
