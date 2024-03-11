import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SearchItem } from '@/types/SearchItem'

export const useFilters = defineStore('FilterStore', () => {
  const selectedFilters = ref<SearchItem[]>([])

  return {
    selectedFilters
  }
})
