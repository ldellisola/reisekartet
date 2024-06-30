<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DropEvent } from '@components/ImportDestinations/ImportDestination.dialog'
import { useImportDestinationDialog } from '@components/ImportDestinations/ImportDestination.dialog'

const store = useImportDestinationDialog()
const handleDrop = (e: DropEvent) => {
  for (const file of e.dataTransfer.files) {
    store.addFile(file)
  }
}
</script>

<template>
  <v-dialog v-model="store.isOpen">
    <template v-slot:activator="{ props }">
      <v-btn elevation="10" color="primary" v-bind="props">Import Destinations</v-btn>
    </template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card
            class="pa-5 d-flex flex-column align-center justify-center"
            outlined
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="handleDrop"
          >
            <v-icon v-if="store.state === 'idle'" size="48">mdi-cloud-upload</v-icon>
            <v-progress-circular
              v-else-if="store.state === 'loading'"
              color="primary"
              size="48"
              indeterminate
            ></v-progress-circular>
            <v-icon v-else-if="store.state === 'error'" size="48" color="red"
              >mdi-alert-circle</v-icon
            >
            <v-icon v-else-if="store.state === 'success'" size="48" color="green"
              >mdi-check-circle</v-icon
            >
            <span v-if="store.state === 'idle'"
              >Drop your file(s) here, or click to select them.</span
            >
            <span v-else-if="store.state === 'loading'">Uploading...</span>
            <span v-else-if="store.state === 'error'">Error uploading files.</span>
            <span v-else-if="store.state === 'success'"
              >Files uploaded successfully. This window will close now.</span
            >

            <v-list dense v-if="store.files.length > 0">
              <v-list-item v-for="(file, index) in store.files" :key="file.name" class="py-1">
                <span>
                  <v-icon @click="store.removeFile(index)">mdi-delete</v-icon>
                </span>
                {{ file.name }}
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-btn color="primary" @click="store.sendFiles()">Upload</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<style scoped></style>
