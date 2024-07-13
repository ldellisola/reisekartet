<script setup lang="ts">
import Tag from '@components/Tag.vue'
import { useDestinationStore } from '@store/Destinations'
import { useDestinationForm } from '@components/Destination/CreateOrEdit/Destination.form'
import { useRouter } from 'vue-router'
import type { SubmitEventPromise } from 'vuetify'
import useOpenLayers from '@/composables/useOpenLayers'
import { watch } from 'vue'
const router = useRouter()
const form = useDestinationForm()
const destinationStore = useDestinationStore()
const tags = await destinationStore.refreshTags()

// Define props
const props = defineProps(['id'])

const variant = 'filled' as
  | 'filled'
  | 'outlined'
  | 'plain'
  | 'underlined'
  | 'solo'
  | 'solo-inverted'
  | 'solo-filled'
  | undefined

const { loadLocation } = useOpenLayers({
  target: 'create-map',
  zoom: 1,
  center: [0, 0]
})

await form.load(props.id as string)

async function parseLocation(event: boolean | string) {
  if (typeof event === 'string' || !event) {
    await form.parseLocation()
  }
}

async function save(event: SubmitEventPromise) {
  const result = await event
  if (result.valid) {
    if (await form.submit()) await router.push('/')
  }
}

function cancel() {
  router.go(-1)
}

watch(
  () => form.location,
  async (location) => {
    if (location !== null) {
      loadLocation({ location, center: true, zoom: 15 })
    }
  },
  { immediate: true }
)

const rules = {
  required: (value: string) => !!value || 'Required.',
  locationExists: (value: string) => form.location !== null || 'Location is not valid.',
  multipleItems: (value: string[]) => value.length > 0 || 'At least one tag is required.'
}
</script>

<template>
  <v-form validate-on="lazy submit" @submit.prevent="save">
    <v-container>
      <v-row>
        <v-col>
          <v-btn @click="cancel" color="red">Cancel</v-btn>
        </v-col>
        <v-col class="text-right">
          <v-btn type="submit" color="primary">Save</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            hide-details="auto"
            validate-on="lazy blur"
            :rules="[rules.required]"
            :variant="variant"
            label="Name"
            v-model="form.name"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field hide-details :variant="variant" label="Website" v-model="form.website" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-combobox
            hide-details="auto"
            v-model="form.tags"
            validate-on="lazy blur"
            :items="(tags ?? []).map((tag) => tag.name)"
            :rules="[rules.multipleItems]"
            label="Tags"
            :clearable="true"
            :chips="true"
            :multiple="true"
            :variant="variant"
          >
            <template v-slot:chip="{ item }">
              <Tag :name="item.title" />
            </template>
          </v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="2">
          <v-select
            label="Type"
            hide-details
            v-model="form.locationMode"
            :items="form.locationModes"
            :variant="variant"
            @update:menu="parseLocation"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="10">
          <v-text-field
            label="Location"
            hide-details="auto"
            :rules="[rules.required, rules.locationExists]"
            @update:focused="parseLocation"
            v-model="form.locationString"
            :variant="variant"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field hide-details label="City" v-model="form.city" :variant="variant" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field hide-details label="Country" v-model="form.country" :variant="variant" />
        </v-col>
      </v-row>
      <v-row v-if="form.location !== null && form.locationMode !== 'Coordinates'">
        <v-col>
          <p>
            <b>Latitude</b>: {{ form.location?.latitude }} <b>Longitude</b>:
            {{ form.location?.longitude }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div id="create-map" style="height: 400px"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.v-col {
  padding-bottom: 0;
  padding-top: 12px;
}
</style>
