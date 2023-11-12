<!--suppress TypeScriptValidateTypes -->
<script setup lang="ts">
import CoordinatesEditor from '@components/CreateDestination/Location/CoordinatesEditor.vue'
import AddressEditor from '@components/CreateDestination/Location/AddressEditor.vue'
import { useDestinationStore } from '@store/Destinations'
import { computed, ref } from 'vue'
import { useDestinationEditorForm } from '@store/DestinationEditor.form'
import Map from '@components/Mapping/Map.vue'
import SingleDestinationLayer from '@components/Mapping/SingleDestinationLayer.vue'
import { getColor } from '@/lib/StringFunctions'
const destinationStore = useDestinationStore()
const form = useDestinationEditorForm()

const locationMethod = ref('coordinates')
const location = computed(() => form.getLocation())

const props = defineProps({
  selectLocation: {
    type: Boolean,
    default: false
  },
  reducedFields: {
    type: Boolean,
    default: false
  },
  showMap: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field
          variant="solo-inverted"
          label="Name"
          v-model="form.name"
          :error-messages="form.errors.name"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Website"
          v-model="form.website"
          :error-messages="form.errors.website"
          variant="solo-inverted"
        />
      </v-col>
    </v-row>
    <v-row v-if="!reducedFields">
      <v-col cols="6">
        <v-text-field label="City" v-model="form.city" :error-messages="form.errors.city" />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Country"
          v-model="form.country"
          :error-messages="form.errors.country"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-combobox
          v-model="form.tags"
          :items="destinationStore.destinationTypes"
          label="Tags"
          :error-messages="form.errors.tags"
          clearable
          chips
          multiple
          variant="solo-inverted"
        >
          <template v-slot:chip="{ item, attrs, on }">
            <v-chip :color="getColor(item.title)">
              {{ item.title }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <div v-if="selectLocation">
      <v-row justify="center" variant="outlined">
        <v-btn-toggle v-model="locationMethod">
          <v-btn value="coordinates">Coordinates</v-btn>
          <v-btn value="address">Address</v-btn>
        </v-btn-toggle>
      </v-row>
      <CoordinatesEditor v-if="locationMethod === 'coordinates'" />
      <AddressEditor v-else-if="locationMethod === 'address'" />
    </div>
    <v-row v-if="showMap">
      <Map
        :center="[location?.longitude ?? 0, location?.latitude ?? 0]"
        :zoom="location !== null ? 15 : 2"
        :rotation="0"
        style="width: 100%; height: 300px"
      >
        <SingleDestinationLayer v-if="location !== null" :destination="location" />
      </Map>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-col {
  padding-bottom: 0;
  padding-top: 0;
}
</style>
