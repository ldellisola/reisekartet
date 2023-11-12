<!--suppress TypeScriptValidateTypes -->
<template>
  <v-row>
    <v-col>
      <v-text-field
        label="latitude"
        v-model="form.latitude"
        :error-messages="form.errors.latitude"
      />
    </v-col>
    <v-col>
      <v-text-field
        label="longitude"
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
