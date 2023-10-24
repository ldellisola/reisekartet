<template>
  <v-container>
    <v-row justify="start">
      <CreateDestination />
    </v-row>
    <v-row>
      <v-col cols="3">
        <DestinationEditor />
      </v-col>
      <v-col cols="9">
        <v-card>
          <Map />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <DestinationList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Map from '@components/Map.vue'
import DestinationEditor from '@components/DestinationEditor.vue'
import DestinationList from '@components/DestinationList.vue'
import CreateDestination from '@components/CreateDestination.vue'
</script>
