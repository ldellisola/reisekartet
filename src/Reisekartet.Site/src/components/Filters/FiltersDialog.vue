<script setup lang="ts">
import { useFiltersDialog } from '@components/Filters/Filters.dialog'
import { useDestinationStore } from '@store/Destinations'
import { getColor } from '@/lib/StringFunctions'

const destinations = useDestinationStore()
const filters = useFiltersDialog()
</script>
<template>
  <v-dialog v-model="filters.isOpen" width="75%">
    <template v-slot:activator="{ props }">
      <v-btn elevation="10" color="primary" v-bind="props">Filters</v-btn>
    </template>
    <v-card elevation="10">
      <v-card-title>Filters</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                label="Name"
                hide-details
                density="compact"
                variant="solo-inverted"
                v-model="filters.name"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Country"
                hide-details
                density="compact"
                variant="solo-inverted"
                v-model="filters.country"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="City"
                hide-details
                density="compact"
                variant="solo-inverted"
                v-model="filters.city"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-combobox
                :items="destinations.destinationTypes"
                label="Tags"
                clearable
                chips
                multiple
                variant="solo-inverted"
                v-model="filters.tags"
              >
                <template v-slot:chip="{ item, attrs, on }">
                  <v-chip :color="getColor(item.title)">
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="filters.resetFilters()">Reset</v-btn>
        <v-btn color="primary" @click="filters.applyFilters()">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
