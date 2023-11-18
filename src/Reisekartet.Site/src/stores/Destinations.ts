import { defineStore } from 'pinia'
import type { Destination } from '@/api/Models/Destination'
import { useErrorStore } from './ErrorStore'
import type { ReisekartetError } from '@/api/reisekartetClient'
import { deleteResource, getResource, postResource } from '@/api/reisekartetClient'
import { computed, ref } from 'vue'
import { groupBy } from '@/lib/ArrayFunctions'
import type { Filters } from '@components/Filters/Filters.dialog'
import { containsIgnoreCase } from '@/lib/StringFunctions'

export const useDestinationStore = defineStore('Destinations', () => {
  const errorStore = useErrorStore()
  const filters = ref<Filters>({
    name: '',
    tags: [],
    city: '',
    country: ''
  })

  const destinations = ref<Destination[]>([])

  const all = computed(() =>
    destinations.value.filter(
      ({ name, tags, city, country }) =>
        containsIgnoreCase(name, filters.value.name) &&
        containsIgnoreCase(city, filters.value.city) &&
        containsIgnoreCase(country, filters.value.country) &&
        filters.value.tags.every((t) => tags.includes(t))
    )
  )
  const destinationTypes = computed(() => [
    ...new Set(
      destinations.value.reduce(
        (accumulator, destination) => accumulator.concat(destination.tags),
        [] as string[]
      )
    )
  ])

  const byType = computed(() => groupBy(all.value, (d) => d.tags[0]))

  async function refresh() {
    const { data, error } = await getResource<{ destinations: Destination[] }>('/destinations')
    if (error) {
      console.log('Bad')
      return
    }

    console.debug(data?.destinations)
    destinations.value = data!.destinations
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

  async function remove(id: string) {
    const { error } = await deleteResource(`/destinations/${id}`)
    if (error) {
      console.error(error)
      errorStore.addError(error.message)
      return
    }
    destinations.value = destinations.value.filter((d) => d.id !== id)
  }

  function setFilters(newFilters: Filters) {
    filters.value = newFilters
  }

  return {
    all,
    byType,
    destinationTypes,
    refresh,
    create,
    remove,
    setFilters
  }
})
