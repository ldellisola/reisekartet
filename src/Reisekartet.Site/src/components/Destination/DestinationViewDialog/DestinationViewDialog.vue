<script setup lang="ts">
import DestinationView from '@components/Destination/DestinationView.vue'
import { useDestinationViewDialog } from '@components/Destination/DestinationViewDialog/DestinationView.Dialog'

const destinationViewDialog = useDestinationViewDialog()
</script>

<template>
  <v-dialog
    class="w-75"
    @close="destinationViewDialog.close()"
    v-model="destinationViewDialog.isOpen"
  >
    <DestinationView
      v-if="destinationViewDialog.destination !== undefined"
      :destination="destinationViewDialog.destination!"
    />
  </v-dialog>
</template>

<style scoped></style>
