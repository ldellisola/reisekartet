<template>
  <v-dialog width="50%" v-model="hasErrors">
    <v-card>
      <v-card-title>
        <span class="headline">Errors</span>
      </v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-for="error in errors" :key="error">
            <v-list-item-title>{{ error }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="clear()"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/ErrorStore'
import { storeToRefs } from 'pinia'

const { hasErrors, errors } = storeToRefs(useErrorStore())
const { clear } = useErrorStore()
</script>
