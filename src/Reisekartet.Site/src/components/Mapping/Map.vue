<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import 'ol/ol.css'
import { onMounted, watch } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import { Feature, Map as OlMap } from 'ol'
import { createClusterLayer, createMap } from '@/lib/MapFunctions'
import type { Layer } from 'ol/layer'
import { groupBy } from '@/lib/ArrayFunctions'
import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import type { Point } from 'ol/geom'
import { useGeographic } from 'ol/proj'
import { useEventBus } from '@vueuse/core'

export type MapProps = {
  center?: [number, number]
  zoom?: number
  destinations: Destination[]
}

useGeographic()

const props = withDefaults(defineProps<MapProps>(), {
  // @ts-ignore
  center: [0, 0],
  zoom: 1
})

function formatLayers(destinations: Destination[]) {
  const groups = groupBy(destinations, (t) => t.tags[0])
  const dict = new Map<string, Layer>()
  for (const [tag, destinations] of groups) {
    dict.set(tag, createClusterLayer(destinations))
  }
  return dict
}

let layers = $shallowRef(formatLayers(props.destinations))
const map = $shallowRef<OlMap>(createMap([...layers.values()]))
onMounted(() => map.setTarget('map'))

watch(
  () => layers,
  (l) => {
    map.setLayers([map.getLayers().item(0), ...l.values()])
  }
)

watch(
  () => props.destinations,
  (l) => {
    layers = formatLayers(l)
    let extent = l.reduce(
      (acc, d) => [
        Math.min(acc[0], d.longitude),
        Math.min(acc[1], d.latitude),
        Math.max(acc[2], d.longitude),
        Math.max(acc[3], d.latitude)
      ],
      [180, 90, -180, -90]
    )
    if (l.length === 1)
      extent = [extent[0] - 0.007, extent[1] - 0.007, extent[2] + 0.007, extent[3] + 0.007]

    map.once('rendercomplete', () => {
      map.getView().fit(extent, { duration: 2000, padding: [100, 100, 100, 100] })
    })
  }
)

const select = new Select({ condition: click })

select.on('select', (event) => {
  const selectedFeatures = event.selected.map((f) => f.get('features')).flat()
  let extent = selectedFeatures
    .map((f: Feature) => (f.getGeometry() as Point).getCoordinates())
    .reduce(
      (acc, c) => [
        Math.min(acc[0], c[0]),
        Math.min(acc[1], c[1]),
        Math.max(acc[2], c[0]),
        Math.max(acc[3], c[1])
      ],
      [180, 90, -180, -90]
    )
  if (selectedFeatures.length === 1)
    extent = [extent[0] - 0.007, extent[1] - 0.007, extent[2] + 0.007, extent[3] + 0.007]
  map.getView().fit(extent, { duration: 2000, padding: [100, 100, 100, 100] })
})
map.addInteraction(select)

map.on('moveend', () => {
  const view = map.getView()
  const extent = view.calculateExtent(map.getSize())
  props.destinations.forEach((t) => {
    t.show =
      extent[0] <= t.longitude &&
      t.longitude <= extent[2] &&
      extent[1] <= t.latitude &&
      t.latitude <= extent[3]
  })
})

const bus = useEventBus<Destination>('destination.selected')
bus.on((d: Destination) => {
  const extent = [d.longitude - 0.007, d.latitude - 0.007, d.longitude + 0.007, d.latitude + 0.007]
  map.getView().fit(extent, { duration: 2000, padding: [100, 100, 100, 100] })
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
