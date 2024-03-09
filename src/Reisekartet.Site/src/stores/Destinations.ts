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
  const destinations = ref<Destination[]>([])
  const filters = ref<string>('[]')

  const destinationTypes = ref<string[]>([])

  const filteredDestinations = computed(() => destinations.value)
  const byType = computed(() => groupBy(destinations.value, (d) => d.tags[0]))

  async function refresh() {
    const { data, error } = await getResource<{ destinations: Destination[] }>(
      `/destinations?filters=${filters.value}`
    )
    if (error) {
      console.error('Bad')
      return
    }
    destinations.value = data!.destinations

    await refreshTags()
  }

  async function refreshTags(): Promise<Tag[] | undefined> {
    const tagsPayload = await getResource<{ tags: Tag[] }>('/tags')
    if (tagsPayload.error) {
      console.error('Bad')
      return undefined
    }
    destinationTypes.value = tagsPayload.data!.tags.map((t) => t.name)
    return tagsPayload.data!.tags
  }

  async function create(
    name: string,
    tags: string[],
    website: string | undefined,
    latitude: number,
    longitude: number,
    city: string | undefined,
    country: string | undefined,
    description: string | undefined
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
    website: string | undefined,
    latitude: number,
    longitude: number,
    city: string | undefined,
    country: string | undefined,
    description: string | undefined
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

  async function setFilters(newFilter: SearchItem[]) {
    filters.value = JSON.stringify(newFilter.map((f) => ({ Text: f.text, Type: f.type })))
    await refresh()
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
    filteredDestinations,
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
