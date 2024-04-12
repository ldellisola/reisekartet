import type { Destination } from '@/api/Models/Destination'
import { groupBy } from '@/lib/ArrayFunctions'
import { getColor } from '@/lib/StringFunctions'
import { Feature, Map, View } from 'ol'
import { click } from 'ol/events/condition'
import { Point } from 'ol/geom'
import Select from 'ol/interaction/Select'
import type BaseLayer from 'ol/layer/Base'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import { Cluster, XYZ } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { onMounted } from 'vue'

export interface OpenLayersOptions {
  target: string
  center: [number, number]
  zoom: number
  tileServerUrl: string
  projection: string
}

export interface OnFeatureProps {
  selected?: (destinationId: string[]) => void
  unselected?: (destinationId: string[]) => void
}

export default function useOpenLayers(options: OpenLayersOptions) {
  const map = new Map({
    layers: [
      new TileLayer({
        source: new XYZ({
          url: options.tileServerUrl,
          projection: options.projection
        })
      })
    ],
    view: new View({
      center: options.center,
      zoom: options.zoom
    })
  })

  function createDestinationLayer(destinations: Destination[]): BaseLayer {
    const styleCache: { [tag: string]: Style } = {}
    return new VectorLayer({
      source: new VectorSource({
        features: destinations.map((d: Destination) => {
          return new Feature({
            primaryTag: d.tags[0],
            name: d.name,
            id: d.id,
            geometry: new Point(
              transform([d.longitude, d.latitude], 'EPSG:4326', options.projection)
            )
          })
        })
      }),
      style: function (feature) {
        const tag = feature.get('primaryTag')
        let style = styleCache[tag]

        if (!style) {
          style = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: '/icons8-place-marker-50(1).png',
              color: getColor(tag),
              scale: 0.6
            })
          })
          styleCache[tag] = style
        }

        return style
      }
    })
  }

  function createClusterLayer(destinations: Destination[]) {
    return [...groupBy(destinations, (t) => t.tags[0])].map(([tag, destinations]) => {
      const styleCache: { [id: number]: Style } = {}
      return new VectorLayer({
        source: new Cluster({
          distance: 40,
          source: new VectorSource({
            features: destinations.map((d: Destination) => {
              return new Feature({
                primaryTag: d.tags[0],
                name: d.name,
                id: d.id,
                geometry: new Point(
                  transform([d.longitude, d.latitude], 'EPSG:4326', options.projection)
                )
              })
            })
          })
        }),
        style: function (feature) {
          const size = feature.get('features').length
          let style = styleCache[size]
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                  color: '#fff'
                }),
                fill: new Fill({
                  color: getColor(tag)
                })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff'
                })
              })
            })
            styleCache[size] = style
          }
          return style
        }
      })
    })
  }

  function loadDestinations(destinations: Destination[], enableClustering: boolean) {
    const destinationLayers = enableClustering
      ? createClusterLayer(destinations)
      : [createDestinationLayer(destinations)]

    map.setLayers([map.getLayers().item(0), ...destinationLayers])
  }

  /*
   * This function is used to handle the selection and deselection of features on the map
   * It listens to the 'select' event of the 'Select' interaction and emits the selected and unselected feature ids
   * The 'unselected' function is called first and then the 'selected' function is called
   * @param selected - function to call when a feature is selected
   * @param unselected - function to call when a feature is unselected
   *
   */
  function onFeatureEvent({ selected, unselected }: OnFeatureProps) {
    const select = new Select({ condition: click })
    select.on('select', (event) => {
      const isClustered = map.getLayers().getArray().length > 2

      if (event.deselected.length > 0 && unselected !== undefined) {
        if (isClustered) {
          unselected(
            event.deselected
              .map((f: Feature) => f.get('features').map((f: Feature) => f.get('id')))
              .flat()
          )
        } else {
          unselected(event.deselected.map((f: Feature) => f.get('id')))
        }
      }

      if (event.selected.length > 0 && selected !== undefined) {
        if (isClustered) {
          selected(
            event.selected
              .map((f: Feature) => f.get('features').map((f: Feature) => f.get('id')))
              .flat()
          )
        } else {
          selected(event.selected.map((f: Feature) => f.get('id')))
        }
      }
    })
    map.addInteraction(select)
  }

  /*
   * This function is used to clear the selection of features on the map
   *
   */
  function clearFeatureSelection() {
    const select = map
      .getInteractions()
      .getArray()
      .find((i) => i instanceof Select) as Select | undefined
    select?.getFeatures().clear()
  }

  onMounted(() => map.setTarget(options.target))

  return { loadDestinations, onFeatureEvent, clearFeatureSelection }
}
