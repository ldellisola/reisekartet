import { object, number, string } from 'yup'
import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import { isNullOrWhitespace } from '@/lib/StringFunctions'
import { getResource } from '@/api/reisekartetClient'
import type GeocodedLocation from '@/api/Models/GeocodedLocation'
import type { PlaceLocation } from '@/api/Models/Destination'
import { useErrorStore } from '@store/ErrorStore'

export interface LocationForm {
  latitude: string | null
  longitude: string | null
  address: string | null
  city: string | null
  country: string | null
}

const schema = object({
  latitude: number().min(-1000).max(1000).nullable(),
  longitude: number().min(-1000).max(1000).nullable(),
  address: string().nullable(),
  city: string().nullable(),
  country: string().nullable()
})

export const useLocationForm = defineStore('LocationForm', () => {
  const { errors, useFieldModel, handleSubmit } = useForm<LocationForm>({
    validationSchema: schema,
    initialValues: {
      latitude: null,
      longitude: null,
      address: null,
      city: null,
      country: null
    }
  })

  const [latitude, longitude, address, city, country] = useFieldModel([
    'latitude',
    'longitude',
    'address',
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

  const onSubmit = handleSubmit(async (values, { setErrors, resetForm }) => {
    if (hasCoordinates()) {
      const result = await reverseGeocode(values.latitude!, values.longitude!, setErrors)
      resetForm()
      return result
    } else if (hasAddress()) {
      const result = await geocode(values.address!, setErrors)
      resetForm()
      return result
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
    }
    return true
  }

  async function reverseGeocode(latitude: string, longitude: string, setErrors: Function) {
    const { data, error } = await getResource<{ locations: GeocodedLocation[] }>(
      `/geocoder/point?latitude=${latitude}&longitude=${longitude}`
    )

    if (error) {
      console.error(error)
      setErrors(error.errors)
      return false
    }

    if (data && data.locations.length > 0) {
      const location = data.locations[0]
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

  return {
    errors,
    latitude,
    longitude,
    address,
    city,
    country,
    onSubmit,
    getLocation
  }
})
