<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="50%">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">Create Destination</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create Destination</span>
        </v-card-title>
        <v-card-text> </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DestinationEditor from '@components/DestinationEditor.vue'
const dialog = ref(false)
</script>
