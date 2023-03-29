<template>

    <v-card>
        <v-card-title>
            Create new destination
        </v-card-title>
        <v-card-text>
        <v-container>
            <v-row>
                <v-text-field label="Name" v-model="form.name" />
            </v-row>
            <v-row>
                <v-text-field label="website" v-model="form.website" />
            </v-row>
            <v-row>
                <v-text-field label="latitude" v-model="form.latitude" />
            </v-row>
            <v-row>
                <v-text-field label="longitude" v-model="form.longitude" />
            </v-row>
            <v-row>
                <v-select
                    v-model="form.type"
                    :items="form.destinationTypes"
                    item-text="name"
                    item-value="id"
                    label="Type"
                ></v-select>
            </v-row>
            <v-row>
                <v-btn
                    color="primary"
                    width="100%"
                    :disabled="form.errors.length > 0"
                    @click="save">Save</v-btn>
            </v-row>
        </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>

import { useDestinationStore } from "@store/Destinations";
import {useDestinationEditorForm} from "@store/DestinationEditor.form";

const form = useDestinationEditorForm();

const destinations = useDestinationStore();

async function save() {
    await destinations.create(form.destination);
    form.reset();
}

</script>


