import OpenLayersMap, { type Vue3OpenlayersGlobalOptions } from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

export const openLayers = OpenLayersMap
export const openLayersOptions: Vue3OpenlayersGlobalOptions = {
  debug: false
}
