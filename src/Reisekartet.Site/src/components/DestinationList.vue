<template>
  <v-data-table-virtual
    :headers="headers"
    v-model:expanded="expanded"
    :items="destinations.all"
    class="elevation-10"
    show-expand
    height="600"
    :expand-on-click="true"
  >
    <template v-slot:item.actions="{ item }">
      <a
        style="color: inherit"
        :href="
          'https://www.google.com/maps/search/?api=1&query=' + item.latitude + ',' + item.longitude
        "
        target="_blank"
      >
        <v-icon>mdi-map-marker</v-icon>
      </a>

      <v-icon @click="">mdi-pencil</v-icon>
      <v-icon @click="destinations.remove(item.id)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.tags="{ value }">
      <v-chip class="ms-1" v-for="tag in value" :color="getColor(tag)">
        {{ tag }}
      </v-chip>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-card class="elevation-2 fill-height">
                  <v-card-title>Information</v-card-title>
                  <v-card-text>
                    <p><b>Latitude</b>: {{ item.latitude }}</p>
                    <p><b>Longitude</b>: {{ item.longitude }}</p>
                    <p v-if="!isNullOrWhitespace(item.website)">
                      <b>Website</b>:
                      <a :href="item.website" target="_blank">{{ item.website }} </a>
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col v-if="!isNullOrWhitespace(item.description)">
                <v-card class="elevation-2 fill-height">
                  <v-card-title>Description</v-card-title>
                  <v-card-text>
                    <p>{{ item.description }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col :cols="isNullOrWhitespace(item.description) ? 9 : 6">
                <Map
                  :center="[item.longitude, item.latitude]"
                  :zoom="15"
                  :rotation="0"
                  style="width: 100%; height: 200px"
                >
                  <SingleDestinationLayer :destination="item" />
                </Map>
              </v-col>
            </v-row>
          </v-container>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { useDestinationStore } from '@store/Destinations'
import { getColor, isNullOrWhitespace } from '@/lib/StringFunctions'
import { ref } from 'vue'
import Map from '@components/Mapping/Map.vue'
import SingleDestinationLayer from '@components/Mapping/SingleDestinationLayer.vue'
const destinations = useDestinationStore()
await destinations.refresh()

const expanded = ref([])

const headers = [
  { title: 'Name', key: 'name', width: '20%' },
  { title: 'Tags', key: 'tags', width: '40%' },
  { title: 'City', key: 'city', width: '20%' },
  { title: 'Country', key: 'country', width: '20%' },
  { title: 'Actions', key: 'actions', width: '15%', sortable: false }
]
</script>
