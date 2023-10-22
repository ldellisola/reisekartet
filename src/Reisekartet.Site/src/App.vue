<template>
    <suspense>
        <v-app>
            <Header />
            <v-main>
                <Error />
                <router-view />
            </v-main>
        </v-app>
    </suspense>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@components/Header.vue'
import Error from '@components/Error.vue'
</script>
