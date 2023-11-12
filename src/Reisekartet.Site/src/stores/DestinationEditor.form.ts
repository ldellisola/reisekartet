import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { useDestinationStore } from '@store/Destinations'
import type { PlaceLocation } from '@/api/Models/Destination'
import { ref } from 'vue'
import { getResource } from '@/api/reisekartetClient'
import type GeocodedLocation from '@/api/Models/GeocodedLocation'
import isNullOrWhitespace from '@/lib/StringFunctions'

export interface DestinationEditorForm {
  name: string
  latitude: string
  longitude: string
  website: string | null
  type: string
  city: string | null
  country: string | null
}

const schema = Yup.object({
  name: Yup.string().required(),
  latitude: Yup.number().min(-1000).max(1000).required(),
  longitude: Yup.number().min(-1000).max(1000).required(),
  website: Yup.string().nullable().url(),
  city: Yup.string().nullable(),
  country: Yup.string().nullable()
})

export const useDestinationEditorForm = defineStore('DestinationsEditorForm', () => {
  const destinations = useDestinationStore()

  const { errors, useFieldModel, handleSubmit } = useForm<DestinationEditorForm>({
    validationSchema: schema,
    initialValues: {
      name: 'Test',
      latitude: '',
      longitude: '',
      website: null,
      type: 'Ttt',
      city: null,
      country: null
    }
  })
  const [name, latitude, longitude, website, type, city, country] = useFieldModel([
    'name',
    'latitude',
    'longitude',
    'website',
    'type',
    'city',
    'country'
  ])

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    const error = await destinations.create(
      values.name,
      values.type,
      values.website,
      Number.parseFloat(values.latitude),
      Number.parseFloat(values.longitude),
      values.city,
      values.country
    )
    if (error) {
      console.error(error)
      setErrors(error.errors)
    } else {
      clear()
    }

    return error === null
  })

  function clear() {
    name.value = ''
    latitude.value = '0'
    longitude.value = '0'
    website.value = null
    type.value = ''
    city.value = null
    country.value = null
  }

  function setCords(
    _latitude: string,
    _longitude: string,
    _city: string | null,
    _country: string | null
  ) {
    latitude.value = _latitude
    longitude.value = _longitude
    city.value = _city
    country.value = _country
  }

  function getLocation(): PlaceLocation | null {
    console.debug('getLocation')
    if (
      isNullOrWhitespace(latitude.value) ||
      isNullOrWhitespace(longitude.value) ||
      errors.value.latitude !== undefined ||
      errors.value.longitude !== undefined
    ) {
      console.debug('getLocation: invalid')
      console.debug(latitude.value)
      console.debug(longitude.value)
      console.debug(errors.value.latitude)
      console.debug(errors.value.longitude)
      return null
    }

    return {
      latitude: Number.parseFloat(latitude.value!),
      longitude: Number.parseFloat(longitude.value!)
    }
  }

  return {
    name,
    latitude,
    longitude,
    website,
    type,
    city,
    country,
    errors,
    onSubmit,
    setCords,
    clear,
    getLocation
  }
})
