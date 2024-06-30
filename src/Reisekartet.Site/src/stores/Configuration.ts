import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getResource } from '@/api/reisekartetClient'
import type { Configuration } from '@/api/Models/Configuration'

export const useConfiguration = defineStore('ConfigurationStore', () => {
  const customTileServer = ref<string | null>(null)
  const customProjection = ref<string | null>(null)
  const isLoaded = ref<boolean>(false)
  const tileServer = computed<string>(
    () => customTileServer.value ?? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  )
  const projection = computed<string>(() => customProjection.value ?? 'EPSG:3857')

  async function refresh() {
    if (isLoaded.value) return

    const { data, error } = await getResource<Configuration>('/configuration')
    if (error) {
      console.log(error)
      return
    }

    isLoaded.value = true
    customTileServer.value = data?.tileServer!
    customProjection.value = data?.projection!
  }

  return {
    tileServer,
    projection,
    load: refresh
  }
})
