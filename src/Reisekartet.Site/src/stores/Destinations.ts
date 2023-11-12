import { defineStore } from 'pinia'
import type { Destination } from '@/api/Models/Destination'
import { useErrorStore } from './ErrorStore'
import type { ReisekartetError } from '@/api/reisekartetClient'
import { deleteResource, getResource, postResource } from '@/api/reisekartetClient'
import { computed, ref } from 'vue'
import { groupBy } from '@/lib/ArrayFunctions'
export const useDestinationStore = defineStore('Destinations', () => {
  const errorStore = useErrorStore()
  const _destinations = ref<Destination[]>([])
  const destinationTypes = computed(() => [
    ...new Set(
      _destinations.value.reduce(
        (accumulator, destination) => accumulator.concat(destination.tags),
        [] as string[]
      )
    )
  ])
  const byType = computed(() => groupBy(_destinations.value, (d) => d.tags[0]))

  async function refresh() {
    const { data, error } = await getResource<{ destinations: Destination[] }>('/destinations')
    if (error) {
      console.log('Bad')
      return
    }
    _destinations.value = data!.destinations
  }

  async function create(
    name: string,
    tags: string[],
    website: string | null,
    latitude: number,
    longitude: number,
    city: string | null,
    country: string | null
  ): Promise<ReisekartetError | null> {
    const { error } = await postResource('/destinations', {
      name,
      tags,
      website,
      latitude,
      longitude,
      city,
      country
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
    _destinations.value = _destinations.value.filter((d) => d.id !== id)
  }

  return {
    all: _destinations,
    byType,
    destinationTypes,
    refresh,
    create,
    remove
  }
})
