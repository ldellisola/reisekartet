<template>
  <v-app-bar>
    <v-app-bar-nav-icon>
      <v-img
        style="margin-top: -7px"
        :src="reisekartet"
        alt="Reisekartet"
        height="64px"
        width="64px"
      />
    </v-app-bar-nav-icon>
    <v-app-bar-title style="line-height: normal; font-size: 50px">
      <b>Reisekartet</b>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
import reisekartet from '@/assets/reisekartet.png'
</script>
