<template>

    <v-card>
        <v-card-title>
            Create new destination
        </v-card-title>
        <v-card-text>
        <v-container>

            
            <v-row>
                <v-text-field 
                    label="Name" 
                    v-model="form.name"
                    :error-messages="form.errors.name"
                />
            </v-row>
            <v-row>
                <v-text-field 
                    label="website" 
                    v-model="form.website" 
                    :error-messages="form.errors.website"
                />
            </v-row>
            <v-row>
                <v-text-field 
                    label="latitude" 
                    v-model="form.latitude" 
                    :error-messages="form.errors.latitude"
                />
            </v-row>
            <v-row>
                <v-text-field 
                    label="longitude" 
                    v-model="form.longitude" 
                    :error-messages="form.errors.longitude"
                />
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
                    :disabled="form.hasErrors()"
                    @click="form.onSubmit">Save</v-btn>
            </v-row>
        </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import {useDestinationEditorForm} from "@store/DestinationEditor.form";

const form = useDestinationEditorForm();

</script>


