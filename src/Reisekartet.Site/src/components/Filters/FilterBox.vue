<script setup lang="ts">
import { useDestinationStore } from '@store/Destinations'
import { onMounted, onUnmounted, ref } from 'vue'
import type { SearchItem } from '@/types/SearchItem'
import { getResource } from '@/api/reisekartetClient'
import { useFilters } from '@components/Filters/FilterStore'
import { storeToRefs } from 'pinia'

const destinationStore = useDestinationStore()

const { isLoading, selectedFilters, possibleFilters } = storeToRefs(useFilters())
const { loadFilterSuggestions } = useFilters()

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

function compareItems(value: string, query: string, item: any) {
  const preparedValue = item.value
  const preparedQuery = query.toLowerCase()
  return preparedValue.includes(preparedQuery)
}

onMounted(() => {
  loadFilterSuggestions()
  window.addEventListener('keydown', focusOnSearch)
})
onUnmounted(() => {
  window.removeEventListener('keydown', focusOnSearch)
})
</script>

<template>
  <v-autocomplete
    ref="searchBox"
    v-model="selectedFilters"
    :items="possibleFilters"
    hide-details
    item-title="text"
    item-text="text"
    item-value="normalizedText"
    :loading="isLoading"
    label="Search destinations"
    return-object
    variant="solo-filled"
    auto-select-first
    clearable
    closable-chips
    multiple
    :custom-filter="compareItems"
    @update:model-value="(value) => destinationStore.setFilters(value)"
  >
    <template v-slot:chip="{ props, item }">
      <v-chip class="ms-1" v-bind="props" :text="item.raw.text">
        <template v-slot:prepend>
          <v-icon v-if="item.raw.type === 'City'">mdi-city</v-icon>
          <v-icon v-else-if="item.raw.type === 'Country'">mdi-earth</v-icon>
          <v-icon v-else-if="item.raw.type === 'Name'">mdi-map-marker</v-icon>
          <v-icon v-else-if="item.raw.type === 'Tag'">mdi-tag</v-icon>
          <v-icon v-else>mdi-help-circle </v-icon>
        </template>
      </v-chip>
    </template>

    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-icon v-if="item.raw.type === 'City'">mdi-city</v-icon>
          <v-icon v-else-if="item.raw.type === 'Country'">mdi-earth</v-icon>
          <v-icon v-else-if="item.raw.type === 'Name'">mdi-map-marker</v-icon>
          <v-icon v-else-if="item.raw.type === 'Tag'">mdi-tag</v-icon>
          <v-icon v-else>mdi-help-circle </v-icon>
        </template>
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
