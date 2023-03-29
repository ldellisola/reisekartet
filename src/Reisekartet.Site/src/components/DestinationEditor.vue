<template>

    <v-card>
        <v-card-title>
            Create new destination
        </v-card-title>
        <v-container>
            <v-row>
                <v-text-field label="Name" v-model="name" />
            </v-row>
            <v-row>
                <v-text-field label="website" v-model="website" />
            </v-row>
            <v-row>
                <v-text-field label="latitude" v-model="latitude" />
            </v-row>
            <v-row>
                <v-text-field label="longitude" v-model="longitude" />
            </v-row>
            <v-row>
                <v-select
                    v-model="selectedType"
                    :items="destinationTypes"
                    item-text="name"
                    item-value="id"
                    label="Country"
                ></v-select>
            </v-row>
            <v-row>
                <v-btn @click="save">Save</v-btn>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts" setup>

import { useDestinationStore } from "@store/Destinations";
import {ref} from "vue";
import type {DestinationType} from "@/api/Models/Destination";

const selectedType = ref("");
const destinationTypes = ["Restaurant" , "Hotel" , "Attraction" , "Nature" , "Other"];
const name = ref("");
const website = ref("");
const latitude = ref("");
const longitude = ref("");

const destinations = useDestinationStore();

async function save() {
    await destinations.create(
        name.value,
        Number.parseFloat(latitude.value),
        Number.parseFloat(longitude.value),
        website.value,
        selectedType.value as DestinationType
    );
}

</script>


