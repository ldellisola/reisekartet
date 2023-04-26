<template>
    <v-card>
        <v-card-title>
            Destinations
        </v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="d in destinations.all" :key="d.id">
                        <v-list-item-title>{{d.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{d.location.latitude}}, {{d.location.longitude}}</v-list-item-subtitle>
                    <v-list-item-action>
                        <v-btn icon @click="destinations.delete(d.id as string)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { useDestinationStore } from "@store/Destinations";

const destinations = useDestinationStore();

</script>


