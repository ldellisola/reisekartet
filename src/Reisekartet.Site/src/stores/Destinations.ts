import { defineStore } from 'pinia'
import type { Destination } from '@/api/Models/Destination'
import { useErrorStore } from './ErrorStore'
import type { ReisekartetError } from '@/api/reisekartetClient'
import { deleteResource, getResource, postResource } from '@/api/reisekartetClient'
import { ref } from 'vue'
export const useDestinationStore = defineStore('Destinations', () => {
  const errorStore = useErrorStore()
  const _destinations = ref<Destination[]>([])

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
    type: string,
    website: string | null,
    latitude: number,
    longitude: number
  ): Promise<ReisekartetError | null> {
    const { error } = await postResource('/destinations', {
      name,
      type,
      website,
      latitude,
      longitude
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
    refresh,
    create,
    remove
  }
})
