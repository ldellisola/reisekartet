<script setup lang="ts">
import { useRoute } from 'vue-router'
import DestinationForm from '@components/Destination/CreateOrEdit/DestinationForm.vue'

const route = useRoute()
</script>

<template>
  <DestinationForm :id="route.params.id"></DestinationForm>
</template>

<style scoped></style>
