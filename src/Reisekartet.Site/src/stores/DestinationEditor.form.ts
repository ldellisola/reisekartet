import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { useDestinationStore } from '@store/Destinations'
import type { PlaceLocation } from '@/api/Models/Destination'
import { isNullOrWhitespace } from '@/lib/StringFunctions'

export interface DestinationEditorForm {
  name: string
  latitude: string
  longitude: string
  website: string | null
  tags: string[]
  city: string | null
  country: string | null
}

const schema = Yup.object({
  name: Yup.string().required(),
  latitude: Yup.number().min(-1000).max(1000).required(),
  longitude: Yup.number().min(-1000).max(1000).required(),
  website: Yup.string().nullable().url(),
  city: Yup.string().nullable(),
  tags: Yup.array().of(Yup.string().required()).required(),
  country: Yup.string().nullable()
})

export const useDestinationEditorForm = defineStore('DestinationsEditorForm', () => {
  const destinations = useDestinationStore()

  const { errors, useFieldModel, handleSubmit, resetForm } = useForm<DestinationEditorForm>({
    validationSchema: schema,
    initialValues: {
      name: '',
      latitude: '',
      longitude: '',
      website: null,
      tags: [] as string[],
      city: null,
      country: null
    }
  })
  const [name, latitude, longitude, website, tags, city, country] = useFieldModel([
    'name',
    'latitude',
    'longitude',
    'website',
    'tags',
    'city',
    'country'
  ])

  const onSubmit = handleSubmit(async (values, { setErrors, resetForm }) => {
    const error = await destinations.create(
      values.name,
      values.tags,
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
      resetForm()
    }

    return error === null
  })

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
    if (
      isNullOrWhitespace(latitude.value as string | null) ||
      isNullOrWhitespace(longitude.value as string | null) ||
      errors.value.latitude !== undefined ||
      errors.value.longitude !== undefined
    ) {
      return null
    }

    return {
      latitude: Number.parseFloat(latitude.value as string),
      longitude: Number.parseFloat(longitude.value as string)
    }
  }

  return {
    name,
    latitude,
    longitude,
    website,
    tags,
    city,
    country,
    errors,
    onSubmit,
    setCords,
    getLocation,
    resetForm
  }
})
