<!--suppress TypeScriptValidateTypes -->
<template>
  <v-dialog v-model="dialog.isOpen" width="75%">
    <template v-slot:activator="{ props }">
      <v-btn elevation="10" color="primary" v-bind="props">Add Destination</v-btn>
    </template>
    <v-stepper v-model="dialog.currentStep" hide-actions :items="dialog.steps">
      <template v-slot:item.1>
        <v-overlay v-model="dialog.isLoading" :contained="true" class="align-center justify-center">
          <v-progress-circular
            v-if="dialog.isLoading"
            color="primary"
            indeterminate
            :size="64"
          ></v-progress-circular>
        </v-overlay>

        <div class="d-flex flex-column">
          <CreateDestinationEditor reduced-fields select-location />
        </div>
      </template>
      <template v-slot:item.2>
        <v-overlay v-model="dialog.isLoading" :contained="true" class="align-center justify-center">
          <v-progress-circular
            v-if="dialog.isLoading"
            color="primary"
            indeterminate
            :size="64"
          ></v-progress-circular>
        </v-overlay>
        <CreateDestinationEditor show-map />
      </template>

      <v-stepper-actions
        v-model:disabled="disabled"
        v-model:prev-text="dialog.previousButtonLabel"
        v-model:next-text="dialog.nextButtonLabel"
        @click:next="dialog.nextButtonAction"
        @click:prev="dialog.previousButtonAction"
      />
    </v-stepper>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCreateDestinationDialog } from '@components/CreateDestination/CreateDestination.dialog'
import { useDestinationEditorForm } from '@store/DestinationEditor.form'
import CreateDestinationEditor from '@components/CreateDestination/CreateDestinationEditor.vue'
import { ref } from 'vue'

const disabled = ref(false)
const form = useDestinationEditorForm()
const dialog = useCreateDestinationDialog()
</script>
