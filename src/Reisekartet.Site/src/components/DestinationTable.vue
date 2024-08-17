<script setup lang="ts">
import type { Destination } from '@/api/Models/Destination'
import { getColor, isNullOrWhitespace, getTextColor } from '@/lib/StringFunctions'
import { useDestinationStore } from '@/stores/Destinations'
import { useEventBus } from '@vueuse/core'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaEdit, FaTrashAlt, FaMapMarkedAlt, FaExternalLinkAlt } from 'oh-vue-icons/icons'
import { useRouter } from 'vue-router'

addIcons(FaEdit, FaTrashAlt, FaMapMarkedAlt, FaExternalLinkAlt)

type Props = {
  destinations: Destination[]
}

defineProps<Props>()

const router = useRouter()
function edit(id: string) {
  router.push(`/destination/${id}`)
}

const destinationStore = useDestinationStore()
function remove(id: string) {
  destinationStore.remove(id)
}

const bus = useEventBus<Destination>('destination.selected')
function select(d: Destination) {
  bus.emit(d)
}
</script>

<template>
  <div class="flex flex-col w-full gap-3">
    <div
      class="hover:shadow-xl rounded-md bg-white p-1 w-full"
      v-for="d in destinations.filter((t) => t.show)"
      :key="d.id"
      @click="() => select(d)"
    >
      <div class="font-extrabold">{{ d.name }}</div>
      <div class="flex gap-1">
        <div
          v-for="tag in d.tags"
          class="rounded-xl px-2 font-bold"
          :style="{ backgroundColor: getColor(tag), color: getTextColor(tag) }"
        >
          {{ tag }}
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <div>{{ isNullOrWhitespace(d.city) ? '' : `${d.city},` }} {{ d.country }}</div>
        <div class="flex gap-2 px-2">
          <a v-if="!isNullOrWhitespace(d.website)" :href="d.website" target="_blank">
            <OhVueIcon name="fa-external-link-alt" />
          </a>
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${d.latitude},${d.longitude}`"
            target="_blank"
          >
            <OhVueIcon name="fa-map-marked-alt" />
          </a>
          <OhVueIcon name="fa-edit" @click="edit(d.id)" />
          <OhVueIcon name="fa-trash-alt" @click="remove(d.id)" />
        </div>
      </div>
    </div>
  </div>
</template>
