import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlaceLocation } from '@/api/Models/Destination'
import { getResource } from '@/api/reisekartetClient'
import type GeocodedLocation from '@/api/Models/GeocodedLocation'
import { isNullOrWhitespace, stripChars } from '@/lib/StringFunctions'
import { useDestinationStore } from '@store/Destinations'

export const useDestinationForm = defineStore('DestinationForm', () => {
  const destinationStore = useDestinationStore()

  const locationModes = ['Smart', 'Coordinates', 'Google Maps', 'Address'] as const

  const id = ref<string | null>(null)
  const name = ref<string>('')
  const website = ref<string | undefined>(undefined)
  const city = ref<string | undefined>(undefined)
  const tags = ref<string[]>([])
  const country = ref<string | undefined>(undefined)
  const description = ref<string | undefined>(undefined)
  const locationString = ref<string>('')
  const locationMode = ref<(typeof locationModes)[number]>('Smart')
  const location = ref<PlaceLocation | null>(null)

  async function TryParseCoordinates(coordinates: string): Promise<boolean> {
    const parts = stripChars(coordinates, '[]() ').split(',')

    if (parts.length != 2) {
      return false
    }
    const latitude = parseFloat(parts[0])
    const longitude = parseFloat(parts[1])
    if (isNaN(latitude) || isNaN(longitude)) {
      return false
    }
    location.value = { latitude, longitude }
    const { data, error } = await getResource<{ locations: GeocodedLocation[] }>(
      `/geocoder/point?latitude=${latitude}&longitude=${longitude}`
    )

    if (error || !data || data.locations.length === 0) {
      city.value = undefined
      country.value = undefined
    } else {
      city.value = data.locations[0].city
      country.value = data.locations[0].country
    }
    return true
  }

  async function TryParseGoogleMaps(link: string): Promise<boolean> {
    if (!link.includes('google.com/maps') || !link.includes('@')) {
      return false
    }

    const parts = link
      .substring(link.indexOf('@') + 1)
      .split(',')
      .slice(0, 2)

    if (parts.length !== 2) {
      return false
    }

    return await TryParseCoordinates(parts.join(','))
  }

  async function TryParseAddress(address: string): Promise<boolean> {
    const { data, error } = await getResource<{ locations: GeocodedLocation[] }>(
      `/geocoder/address?address=${address}`
    )
    if (error || !data || data.locations.length === 0) {
      return false
    }

    location.value = {
      latitude: data.locations[0].latitude,
      longitude: data.locations[0].longitude
    }
    city.value = data.locations[0].city
    country.value = data.locations[0].country
    return true
  }

  async function parseLocation(): Promise<PlaceLocation | null> {
    if (isNullOrWhitespace(locationString.value)) {
      location.value = null
      city.value = undefined
      country.value = undefined
      return null
    }

    let isValid = false
    try {
      switch (locationMode.value) {
        case 'Smart':
          isValid =
            (await TryParseCoordinates(locationString.value)) ||
            (await TryParseGoogleMaps(locationString.value)) ||
            (await TryParseAddress(locationString.value))
          break
        case 'Coordinates':
          isValid = await TryParseCoordinates(locationString.value)
          break
        case 'Google Maps':
          isValid = await TryParseGoogleMaps(locationString.value)
          break
        case 'Address':
          isValid = await TryParseAddress(locationString.value)
          break
        default:
          isValid = false
      }
    } catch (e) {
      console.error(e)
    }

    if (!isValid) {
      location.value = null
      city.value = undefined
      country.value = undefined
    }

    return location.value
  }

  async function create() {
    const error = await destinationStore.create(
      name.value,
      tags.value,
      website.value,
      location.value!.latitude,
      location.value!.longitude,
      city.value,
      country.value,
      description.value
    )

    if (error) {
      console.error(error)
      return false
    }
    return true
  }

  async function update() {
    const error = await destinationStore.update(
      id.value!,
      name.value,
      tags.value,
      website.value,
      location.value!.latitude,
      location.value!.longitude,
      city.value,
      country.value,
      description.value
    )
    if (error) {
      console.error(error)
      return false
    }
    return true
  }

  async function submit(): Promise<boolean> {
    return isNullOrWhitespace(id.value) ? await create() : await update()
  }

  async function load(destinationId: string) {
    clear()
    if (isNullOrWhitespace(destinationId)) {
      return
    }

    const destination = await destinationStore.get(destinationId)
    if (!destination) {
      return
    }

    id.value = destinationId
    name.value = destination.name
    website.value = destination.website
    city.value = destination.city
    tags.value = destination.tags
    country.value = destination.country
    description.value = destination.description
    location.value = {
      latitude: destination.latitude,
      longitude: destination.longitude
    }
    locationString.value = `${destination.latitude}, ${destination.longitude}`
  }

  function clear() {
    id.value = null
    name.value = ''
    website.value = undefined
    city.value = undefined
    tags.value = []
    country.value = undefined
    description.value = undefined
    locationString.value = ''
    location.value = null
  }

  return {
    name,
    website,
    city,
    tags,
    country,
    description,
    locationString,
    location,
    locationMode,
    locationModes,
    parseLocation,
    submit,
    load
  }
})
