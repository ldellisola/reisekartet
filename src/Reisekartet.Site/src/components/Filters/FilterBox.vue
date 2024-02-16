<script setup lang="ts">
import { useDestinationStore } from '@store/Destinations'
import type { Destination } from '@/api/Models/Destination'
import { onMounted, onUnmounted, ref } from 'vue'

interface SearchItem {
  text: string
  type: 'city' | 'country' | 'name'
}

const destinationStore = useDestinationStore()

const isLoading = ref(false)
const items = ref<SearchItem[]>([])
const model = ref<SearchItem | null>(null)
const searchBox = ref<HTMLElement | null>(null)

function focusOnSearch(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
    event.preventDefault()
    searchBox.value?.scrollTo()
    searchBox.value?.focus()
  } else if (event.key === 'Escape') {
    searchBox.value?.blur()
  }
}
async function loadFilterSuggestions() {
  isLoading.value = true
  if (destinationStore.all.length === 0) {
    await destinationStore.refresh()
  }

  if (items.length > 0) {
    return
  }

  const all = destinationStore.all.flatMap((destination: Destination) => {
    let filterValues = [{ text: destination.name, type: 'name' }]
    if (destination.country) {
      filterValues.push({ text: destination.country, type: 'country' })
    }
    if (destination.city) {
      filterValues.push({ text: destination.city, type: 'city' })
    }
    return filterValues
  })
  all.forEach((item: { text: string; type: 'city' | 'country' | 'name' }) => {
    if (!items.value.some((i) => i.text === item.text)) {
      items.value.push(item)
    }
  })

  isLoading.value = false
}
function compareItems(value: string, query: string) {
  const preparedValue = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const preparedQuery = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  return preparedValue.includes(preparedQuery)
}

onMounted(() => {
  window.addEventListener('keydown', focusOnSearch)
})
onUnmounted(() => {
  window.removeEventListener('keydown', focusOnSearch)
})
</script>

<template>
  <v-autocomplete
    class="w-100"
    ref="searchBox"
    v-model="model"
    :items="items"
    hide-details
    item-title="text"
    item-text="text"
    :loading="isLoading"
    label="Filter"
    return-object
    @focus="loadFilterSuggestions"
    @click="loadFilterSuggestions"
    prepend-icon="mdi-magnify"
    auto-select-first
    :custom-filter="compareItems"
    @update:model-value="(value) => destinationStore.setFilters(value?.text, value?.type)"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item>
        <template v-slot:prepend>
          <v-icon v-if="item.raw.type === 'city'">mdi-city</v-icon>
          <v-icon v-else-if="item.raw.type === 'country'">mdi-earth</v-icon>
          <v-icon v-else-if="item.raw.type === 'name'">mdi-map-marker</v-icon>
          <v-icon v-else>mdi-help-circle </v-icon>
        </template>
        <v-list-item-title
          ><p class="text-wrap">{{ item.raw.text }}</p></v-list-item-title
        >
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped>
.text-wrap {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
