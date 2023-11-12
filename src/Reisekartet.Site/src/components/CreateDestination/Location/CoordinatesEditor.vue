<!--suppress TypeScriptValidateTypes -->
<template>
  <v-row>
    <v-col>
      <v-text-field
        variant="solo-inverted"
        label="Latitude"
        v-model="form.latitude"
        :error-messages="form.errors.latitude"
      />
    </v-col>
    <v-col>
      <v-text-field
        variant="solo-inverted"
        label="Longitude"
        v-model="form.longitude"
        :error-messages="form.errors.longitude"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useLocationForm } from '@components/CreateDestination/Location/Location.form'

const form = useLocationForm()
</script>
