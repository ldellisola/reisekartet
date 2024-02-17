<template>
  <v-data-table-virtual
    :headers="headers"
    v-model:expanded="expanded"
    :items="destinations.filtered"
    class="elevation-10"
    fixed-header
    show-expand
    height="600"
    :expand-on-click="true"
  >
    <template v-slot:item.actions="{ item }">
      <v-row>
        <a
          style="color: inherit"
          @click="oldId = item.id"
          :href="
            'https://www.google.com/maps/search/?api=1&query=' +
            item.latitude +
            ',' +
            item.longitude
          "
          target="_blank"
        >
          <v-icon>mdi-map-marker</v-icon>
        </a>

        <v-icon @click="edit(item.id)">mdi-pencil</v-icon>
        <v-icon @click="remove(item.id)">mdi-delete</v-icon>
      </v-row>
    </template>
    <template v-slot:item.tags="{ value }">
      <Tag v-for="tag in value" :key="tag" :name="tag" />
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <v-card class="elevation-2 fill-height">
                  <v-card-title>Information</v-card-title>
                  <v-card-text>
                    <p><b>Latitude</b>: {{ item.latitude }}</p>
                    <p><b>Longitude</b>: {{ item.longitude }}</p>
                    <p v-if="!isNullOrWhitespace(item.website)">
                      <b>Website</b>:
                      <a :href="item.website!" target="_blank">{{ item.website }} </a>
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="9">
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
import { ref, watch } from 'vue'
import Map from '@components/Mapping/Map.vue'
import SingleDestinationLayer from '@components/Mapping/SingleDestinationLayer.vue'
import { useRouter } from 'vue-router'
import Tag from '@components/Tag.vue'
const destinations = useDestinationStore()
const router = useRouter()

async function remove(id: string) {
  await destinations.remove(id)
}

async function edit(id: string) {
  oldId.value = id
  await router.push(`/destination/${id}`)
}

const oldId = ref<string | undefined>(undefined)
const expanded = ref([])

watch(expanded, (value) => {
  if (oldId.value !== undefined && value.includes(oldId.value)) {
    expanded.value = expanded.value.filter((x) => x !== oldId.value)
    oldId.value = undefined
  }
})

const headers = [
  { title: 'Name', key: 'name', width: '20%' },
  { title: 'Tags', key: 'tags', width: '40%' },
  { title: 'City', key: 'city', width: '20%' },
  { title: 'Country', key: 'country', width: '10%' },
  { title: 'Actions', key: 'actions', width: '25%', sortable: false }
]
</script>
