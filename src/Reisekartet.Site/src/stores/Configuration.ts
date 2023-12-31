import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getResource } from '@/api/reisekartetClient'
import type { Configuration } from '@/api/Models/Configuration'

export const useConfiguration = defineStore('ConfigurationStore', () => {
  const tileServer = ref<string>('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  const projection = ref<string>('EPSG:3857')

  async function refresh() {
    const { data, error } = await getResource<Configuration>('/configuration')
    if (error) {
      console.log(error)
      return
    }

    tileServer.value = data?.tileServer ?? tileServer.value
    projection.value = data?.projection ?? projection.value
  }

  return {
    tileServer,
    projection,
    refresh
  }
})
