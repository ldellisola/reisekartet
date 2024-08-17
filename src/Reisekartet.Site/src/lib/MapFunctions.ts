import type { Destination, PlaceLocation } from '@/api/Models/Destination'
import { match } from 'ts-pattern'
import { Feature, Map, View } from 'ol'
import { Point } from 'ol/geom'
import type { Layer } from 'ol/layer'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { Cluster, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import cluster from 'cluster'
import { getColor } from './StringFunctions'
import CircleStyle from 'ol/style/Circle'

function coords(place: PlaceLocation | [number, number] | number[]) {
  return Array.isArray(place) ? [place[0], place[1]] : [place.longitude, place.latitude]
}

export function createMap(layers?: Layer[]) {
  return new Map({
    layers: [
      new TileLayer({
        source: new XYZ({
          url: '/api/tiles/{z}/{x}/{y}.png',
          projection: 'EPSG:3857'
        })
      }),
      ...(layers ?? [])
    ],
    view: new View({
      center: coords([0, 0]),
      zoom: 1
    })
  })
}

export function createLayer() {
  const source = new VectorSource({
    features: []
  })
  return new VectorLayer({
    source: source,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: '/icons8-place-marker-50(1).png',
        color: '#FF0000',
        scale: 0.6
      })
    })
  })
}

export function createClusterLayer(destinations: Destination[]) {
  const color = destinations[0].tags[0]
  const source = new VectorSource({
    features: destinations.map(toFeature)
  })

  const cluster = new Cluster({
    distance: 40,
    source: source
  })

  const cache: { [id: number]: Style } = {}

  return new VectorLayer({
    // @ts-ignore
    cluster: true,
    source: cluster,
    style: function (feature) {
      const size = feature.get('features').length
      let style = cache[size]
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({ color: '#fff' }),
            fill: new Fill({ color: getColor(color) })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({ color: '#fff' })
          })
        })
        cache[size] = style
      }
      return style
    }
  })
}

export function toFeature(destination: Destination | PlaceLocation) {
  const metadata = match(destination)
    // @ts-ignore
    .with({ name: String }, (d: Destination) => {
      return {
        primaryTag: d.tags[0],
        name: d.name,
        id: d.id
      }
    })
    .otherwise(() => {})

  return new Feature({
    geometry: new Point(coords(destination)),
    ...metadata
  })
}
