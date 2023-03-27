<template>
    <h1>{{ hello.content }}</h1>
    <v-btn @click="hello.get"> Click here!</v-btn>
</template>

<script lang="ts" setup>
import {useHelloStore} from "@store/hello";

const hello = useHelloStore();
</script>
