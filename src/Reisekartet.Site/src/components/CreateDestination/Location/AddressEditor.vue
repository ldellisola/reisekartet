<template>
  <v-row>
    <v-col>
      <v-text-field label="Address" v-model="form.address" :error-messages="form.errors.address" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useLocationForm } from '@components/CreateDestination/Location/Location.form'

const form = useLocationForm()
</script>
