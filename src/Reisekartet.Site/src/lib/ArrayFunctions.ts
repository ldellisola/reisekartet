import type { PlaceLocation } from '@/api/Models/Destination'

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
function groupBy<K, V>(list: K[], keyGetter: (arg0: K) => V) {
  const map = new Map<V, K[]>()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

/**
 * @description
 * Takes a PlaceLocation object and returns an array of the latitude and longitude.
 * If the input is null or undefined, null is returned.
 *
 * @param location A PlaceLocation object.
 *
 * @returns An array of the latitude and longitude.
 */
function toArray(location: PlaceLocation | null | undefined): [number, number] | null {
  if (!location) {
    return null
  }

  return [location.longitude, location.latitude]
}

export { groupBy, toArray }
