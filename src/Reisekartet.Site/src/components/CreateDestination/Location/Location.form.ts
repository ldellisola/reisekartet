import { number, object, string } from 'yup'
import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import { isNullOrWhitespace } from '@/lib/StringFunctions'
import { getResource } from '@/api/reisekartetClient'
import type GeocodedLocation from '@/api/Models/GeocodedLocation'
import type { PlaceLocation } from '@/api/Models/Destination'
import { ref } from 'vue'

export interface LocationForm {
  latitude: string | null
  longitude: string | null
  address: string | null
  googleMapsLink: string | null
  city: string | null
  country: string | null
}

const schema = object({
  latitude: number().min(-1000).max(1000).nullable(),
  longitude: number().min(-1000).max(1000).nullable(),
  address: string().nullable(),
  googleMapsLink: string().nullable(),
  city: string().nullable(),
  country: string().nullable()
})

export const useLocationForm = defineStore('LocationForm', () => {
  const mode = ref<'coordinates' | 'address' | 'googleMapsLink'>('coordinates')
  const { errors, useFieldModel, handleSubmit, resetForm, resetField, setFieldValue } =
    useForm<LocationForm>({
      validationSchema: schema,
      initialValues: {
        latitude: null,
        longitude: null,
        address: null,
        googleMapsLink: null,
        city: null,
        country: null
      }
    })

  const [latitude, longitude, address, googleMapsLink, city, country] = useFieldModel([
    'latitude',
    'longitude',
    'address',
    'googleMapsLink',
    'city',
    'country'
  ])

  function hasCoordinates() {
    return (
      !isNullOrWhitespace(latitude.value) &&
      !isNullOrWhitespace(longitude.value) &&
      errors.value.latitude === undefined &&
      errors.value.longitude === undefined
    )
  }

  function hasAddress() {
    return !isNullOrWhitespace(address.value) && errors.value.address === undefined
  }

  function hasGoogleMapsLink() {
    return !isNullOrWhitespace(googleMapsLink.value) && errors.value.googleMapsLink === undefined
  }

  function getCoordinatesFromGoogleMapsURL(url: string): PlaceLocation | null {
    const match = url.match(/@([-\d.]+),([-\d.]+)/)
    if (match && match[1] && match[2]) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      }
    }
    return null
  }

  const onSubmit = handleSubmit(async (values, { setErrors, resetForm }) => {
    if (mode.value === 'googleMapsLink' && hasGoogleMapsLink()) {
      const location = getCoordinatesFromGoogleMapsURL(values.googleMapsLink!)
      if (location !== null) {
        reset()
        return await reverseGeocode(
          location.latitude.toString(),
          location.longitude.toString(),
          setErrors
        )
      } else {
        setErrors({
          googleMapsLink: 'Could not parse Google Maps link'
        })
      }
    }

    if (mode.value === 'coordinates' && hasCoordinates()) {
      return await reverseGeocode(values.latitude!, values.longitude!, setErrors)
    } else if (mode.value === 'address' && hasAddress()) {
      return await geocode(values.address!, setErrors)
    } else return false
  })

  async function geocode(address: string, setErrors: Function) {
    const { data, error } = await getResource<{ locations: GeocodedLocation[] }>(
      `/geocoder/address?address=${address}`
    )

    if (error) {
      console.error(error)
      setErrors(error.errors)
      return false
    }

    if (data && data.locations.length > 0) {
      const location = data.locations[0]
      latitude.value = location.latitude.toString()
      longitude.value = location.longitude.toString()
      city.value = location.city
      country.value = location.country
      reset()
    }
    return true
  }

  async function reverseGeocode(lat: string, lon: string, setErrors: Function) {
    const { data, error } = await getResource<{ locations: GeocodedLocation[] }>(
      `/geocoder/point?latitude=${lat}&longitude=${lon}`
    )

    if (error) {
      console.error(error)
      setErrors(error.errors)
      return false
    }

    if (data && data.locations.length > 0) {
      const location = data.locations[0]
      latitude.value = location.latitude.toString()
      longitude.value = location.longitude.toString()
      city.value = location.city
      country.value = location.country
    }
    return true
  }

  function getLocation(): PlaceLocation | null {
    try {
      if (!hasCoordinates()) return null
      return {
        latitude: Number.parseFloat(latitude.value!),
        longitude: Number.parseFloat(longitude.value!)
      }
    } catch (e) {
      return null
    }
  }

  function reset() {
    resetField('address')
    resetField('googleMapsLink')
  }

  function setLocation(location: PlaceLocation) {
    setFieldValue('latitude', location.latitude.toString())
    setFieldValue('longitude', location.longitude.toString())
  }

  return {
    errors,
    latitude,
    longitude,
    address,
    googleMapsLink,
    city,
    mode,
    country,
    onSubmit,
    setLocation,
    getLocation,
    resetForm
  }
})
