<template>
  <v-row>
    <v-col>
      <v-text-field
        variant="solo-inverted"
        label="Google Maps Link"
        v-model="form.googleMapsLink"
        :error-messages="form.errors.googleMapsLink"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useLocationForm } from '@components/CreateDestination/Location/Location.form'
const form = useLocationForm()
</script>
