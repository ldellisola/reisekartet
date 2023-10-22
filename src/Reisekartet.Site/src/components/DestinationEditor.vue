<template>
  <v-card>
    <v-card-title> Create new destination </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field label="Name" v-model="form.name" :error-messages="form.errors.name" />
        </v-row>
        <v-row>
          <v-text-field
            label="website"
            v-model="form.website"
            :error-messages="form.errors.website"
          />
        </v-row>
        <v-row>
          <v-text-field
            label="latitude"
            v-model="form.latitude"
            :error-messages="form.errors.latitude"
          />
        </v-row>
        <v-row>
          <v-text-field
            label="longitude"
            v-model="form.longitude"
            :error-messages="form.errors.longitude"
          />
        </v-row>
        <v-row>
          <v-combobox
            v-model="form.type"
            :items="destinationTypes"
            label="Type"
            :error-messages="form.errors.type"
            :clearable="true"
          >
          </v-combobox>
        </v-row>
        <v-row>
          <v-btn color="primary" width="100%" @click="onSubmit()"> Save </v-btn>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useDestinationEditorForm } from '@store/DestinationEditor.form'
import { useDestinationStore } from '@store/Destinations'
import { computed } from 'vue'

const form = useDestinationEditorForm()
const destinationStore = useDestinationStore()

const destinationTypes = computed(() => [...new Set(destinationStore.all.map((t) => t.type))])
const onSubmit = async () => {
  console.debug('submitting form')
  await form.onSubmit()
  // form.clear()
  // destinationTypes.value = (await getDestinationTypes()).data?.destinationTypes ?? []
}
</script>
