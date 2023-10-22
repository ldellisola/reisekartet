import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { useDestinationStore } from '@store/Destinations'

export interface DestinationEditorForm {
  name: string
  latitude: string
  longitude: string
  website: string | null
  type: string
}

const schema = Yup.object({
  name: Yup.string().required(),
  latitude: Yup.number().min(-1000).max(1000).required(),
  longitude: Yup.number().min(-1000).max(1000).required(),
  website: Yup.string().nullable().url()
})

export const useDestinationEditorForm = defineStore('DestinationsEditorForm', () => {
  const destinations = useDestinationStore()
  const { errors, useFieldModel, handleSubmit } = useForm<DestinationEditorForm>({
    validationSchema: schema,
    initialValues: {
      name: 'Test',
      latitude: '100',
      longitude: '100',
      website: null,
      type: 'Ttt'
    }
  })
  const [name, latitude, longitude, website, type] = useFieldModel([
    'name',
    'latitude',
    'longitude',
    'website',
    'type'
  ])

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    const error = await destinations.create(
      values.name,
      values.type,
      values.website,
      Number.parseFloat(values.latitude),
      Number.parseFloat(values.longitude)
    )
    if (error) {
      console.error(error)
      setErrors(error.errors)
    } else {
      clear()
    }
  })

  function clear() {
    name.value = ''
    latitude.value = '0'
    longitude.value = '0'
    website.value = null
    type.value = ''
  }

  function setCords(lat: number, lon: number) {
    latitude.value = lat.toString()
    longitude.value = lon.toString()
  }

  return {
    name,
    latitude,
    longitude,
    website,
    type,
    errors,
    onSubmit,
    setCords,
    clear
  }
})
