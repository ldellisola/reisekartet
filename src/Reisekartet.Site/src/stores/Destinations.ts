import { defineStore } from 'pinia'
import type { Destination } from '@/api/Models/Destination'
import { useErrorStore } from './ErrorStore'
import type { ReisekartetError } from '@/api/reisekartetClient'
import { deleteResource, getResource, postResource, putResource } from '@/api/reisekartetClient'
import { computed, ref } from 'vue'
import { groupBy } from '@/lib/ArrayFunctions'
import type { Tag } from '@/api/Models/Tag'
import type { SearchItem } from '@/types/SearchItem'

export const useDestinationStore = defineStore('Destinations', () => {
  const errorStore = useErrorStore()
  const filter = ref<SearchItem | null>(null)

  const destinations = ref<Destination[]>([])

  const filtered = computed(() =>
    destinations.value.filter(
      ({ name, tags, city, country }) =>
        !filter.value ||
        (filter.value.type === 'city' && city === filter.value.text) ||
        (filter.value.type === 'country' && country === filter.value.text) ||
        (filter.value.type === 'name' && name === filter.value.text) ||
        (filter.value.type === 'tag' && tags.includes(filter.value.text))
    )
  )
  const destinationTypes = ref<string[]>([])

  const byType = computed(() => groupBy(filtered.value, (d) => d.tags[0]))

  async function refresh() {
    const destinationsPayload = await getResource<{ destinations: Destination[] }>('/destinations')
    if (destinationsPayload.error) {
      console.log('Bad')
      return
    }
    destinations.value = destinationsPayload.data!.destinations

    await refreshTags()
  }

  async function refreshTags(): Promise<Tag[] | undefined> {
    const tagsPayload = await getResource<{ tags: Tag[] }>('/tags')
    if (tagsPayload.error) {
      console.log('Bad')
      return undefined
    }
    destinationTypes.value = tagsPayload.data!.tags.map((t) => t.name)
    return tagsPayload.data!.tags
  }

  async function create(
    name: string,
    tags: string[],
    website: string | null,
    latitude: number,
    longitude: number,
    city: string | null,
    country: string | null,
    description: string | null
  ): Promise<ReisekartetError | null> {
    const { error } = await postResource('/destinations', {
      name,
      tags,
      website,
      latitude,
      longitude,
      city,
      country,
      description
    })

    if (error && error.statusCode !== 400) {
      errorStore.addError(error.message)
      return null
    }

    if (error && error.statusCode === 400) {
      return error
    }

    await refresh()
    return null
  }

  async function update(
    id: string,
    name: string,
    tags: string[],
    website: string | null,
    latitude: number,
    longitude: number,
    city: string | null,
    country: string | null,
    description: string | null
  ): Promise<ReisekartetError | null> {
    const { error } = await putResource(`/destinations/${id}`, {
      name,
      tags,
      website,
      latitude,
      longitude,
      city,
      country,
      description
    })

    if (error && error.statusCode !== 400) {
      errorStore.addError(error.message)
      return null
    }

    if (error && error.statusCode === 400) {
      return error
    }

    await refresh()
    return null
  }

  async function remove(id: string) {
    const { error } = await deleteResource(`/destinations/${id}`)
    if (error) {
      console.error(error)
      errorStore.addError(error.message)
      return
    }
    destinations.value = destinations.value.filter((d) => d.id !== id)
  }

  function setFilters(newFilter: SearchItem | null) {
    filter.value = newFilter
  }

  async function get(id: string, refresh: boolean = false): Promise<Destination | undefined> {
    if (!refresh && destinations.value.some((d) => d.id === id)) {
      return destinations.value.find((d) => d.id === id)!
    }

    const { data, error } = await getResource<Destination>(`/destinations/${id}`)
    if (error) {
      errorStore.addError(error.message)
      return undefined
    }

    return data!
  }

  return {
    destinations,
    filtered,
    byType,
    destinationTypes,
    refresh,
    refreshTags,
    create,
    remove,
    setFilters,
    get,
    update
  }
})
