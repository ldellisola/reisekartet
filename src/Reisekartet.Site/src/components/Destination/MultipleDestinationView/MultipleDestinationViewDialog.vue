<script setup lang="ts">
import { useMultipleDestinationViewDialog } from '@components/Destination/MultipleDestinationView/MultipleDestinationView.Dialog'
import { ref } from 'vue'
import type { Destination } from '@/api/Models/Destination'
import DestinationView from '@components/Destination/DestinationView.vue'
import { getColor, isNullOrWhitespace } from '@/lib/StringFunctions'
import Tag from '@components/Tag.vue'

const destinationViewDialog = useMultipleDestinationViewDialog()

const selectedDestination = ref<Destination | undefined>(undefined)

function close() {
  selectedDestination.value = undefined
}

destinationViewDialog.onClose(close)
</script>

<template>
  <v-dialog class="h-100 w-75" v-model="destinationViewDialog.isOpen">
    <DestinationView v-if="selectedDestination !== undefined" :destination="selectedDestination!" />
    <v-card class="mx-auto w-100 h-100" v-else>
      <v-card-text>
        <v-data-iterator :items="destinationViewDialog.destinations" items-per-page="100">
          <template v-slot:default="{ items }">
            <v-row>
              <v-col v-for="item in items" :key="item.raw.id" cols="12" sm="12" md="6">
                <v-card @click="selectedDestination = item.raw">
                  <v-card-title>{{ item.raw.name }}</v-card-title>
                  <v-card-subtitle
                    v-if="
                      !isNullOrWhitespace(item.raw.country) && !isNullOrWhitespace(item.raw.city)
                    "
                  >
                    {{ item.raw.city }}, {{ item.raw.country }}
                  </v-card-subtitle>
                  <v-card-text>
                    <Tag v-for="tag in item.raw.tags" :name="tag" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
