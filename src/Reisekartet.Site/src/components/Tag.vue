<script setup lang="ts">
import { getColor } from '@/lib/StringFunctions'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <v-chip class="ms-1" variant="flat" :color="getColor(name)">
    {{ name }}
  </v-chip>
</template>

<style scoped></style>
