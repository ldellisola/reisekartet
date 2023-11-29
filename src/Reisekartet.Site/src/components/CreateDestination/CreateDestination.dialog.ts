import { defineStore } from 'pinia'
import { useLocationForm } from '@components/CreateDestination/Location/Location.form'
import { useDestinationEditorForm } from '@components/CreateDestination/DestinationEditor.form'
import { computed, ref, watch } from 'vue'

export const useCreateDestinationDialog = defineStore('CreateDestinationDialog', () => {
  const steps = ['Destination', 'Review']
  const currentStep = ref(1)
  const isLoading = ref(false)
  const isOpen = ref(false)
  const mode = ref<'create' | 'edit'>('create')
  const previousButtonLabel = computed(() => (currentStep.value > 1 ? 'Previous' : 'Cancel'))
  const nextButtonLabel = computed(() => (currentStep.value < steps.length ? 'Next' : 'Save'))

  watch(isOpen, (value) => {
    if (value) {
      currentStep.value = 1
      isLoading.value = false
    } else {
      locationForm.resetForm()
      destinationForm.resetForm()
    }
  })

  const locationForm = useLocationForm()
  const destinationForm = useDestinationEditorForm()

  function previousButtonAction() {
    console.debug(currentStep.value)
    if (currentStep.value > 1) {
      currentStep.value--
    } else {
      isOpen.value = false
    }
  }

  async function nextButtonAction() {
    isLoading.value = true

    if (currentStep.value === 2) {
      if (await destinationForm.onSubmit()) {
        isOpen.value = false
      }
    }

    if (currentStep.value === 1) {
      if (await locationForm.onSubmit()) {
        destinationForm.setCords(
          locationForm.latitude!,
          locationForm.longitude!,
          locationForm.city,
          locationForm.country
        )
        currentStep.value = 2
      }
    }

    isLoading.value = false
  }

  async function open(id?: string) {
    if (id) {
      mode.value = 'edit'
      const destination = await destinationForm.loadDestination(id)
      if (destination !== undefined)
        locationForm.setLocation({
          latitude: destination.latitude,
          longitude: destination.longitude
        })
    } else {
      mode.value = 'create'
    }
    isOpen.value = true
  }

  return {
    steps,
    currentStep,
    isLoading,
    isOpen,
    nextButtonLabel,
    previousButtonLabel,
    nextButtonAction,
    previousButtonAction,
    open
  }
})
