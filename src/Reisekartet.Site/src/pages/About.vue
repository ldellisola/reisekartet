<template>
    <v-btn @click="count.increment">Increment: {{ count.count }}</v-btn>
</template>

<script lang="ts" setup>
import {useCounterStore} from "@store/counter";

const count = useCounterStore();

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
