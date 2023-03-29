<template>
    
    <ol-map
        ref="map"
        :loadTilesWhileAnimating="true"
        :loadTilesWhileInteracting="true"
        height="100%"
        style="height: 800px; "
        @singleclick="featureSelected"
    >
        <ol-view
            ref="view"
            :center="center"
            :zoom="zoom"
            :rotation="rotation"
            :projection="projection"
            />
        
        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>
        
        <ol-vector-layer>
            <ol-source-cluster
                :distance="40"
            >
                <ol-source-vector>
                    <ol-feature
                        v-for="destination in destinations.all"
                        :key="destination.id"
                    >
                        <ol-geom-point :coordinates="transformCoordinates(destination.location)" />
                    </ol-feature>
                </ol-source-vector>    
            </ol-source-cluster>

            <ol-style :overrideStyleFunction="overrideStyleFunction">
                <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>

                <ol-style-circle :radius="10">
                    <ol-style-fill color="#3399CC"></ol-style-fill>
                    <ol-style-stroke color="#fff" :width="1"></ol-style-stroke>

                </ol-style-circle>
                <ol-style-text>
                    <ol-style-fill color="#fff"></ol-style-fill>
                </ol-style-text>
            </ol-style>
            
        </ol-vector-layer>
        
    </ol-map>
</template>

<script lang="ts" setup>
import { useDestinationStore } from "@store/Destinations";
import {inject, ref} from "vue";
import type {Point} from "@/api/Models/Point";
import type {MapClickEvent} from "@/types/MapClickEvent";
import {useDestinationEditorForm} from "@store/DestinationEditor.form";


const destinationEditor = useDestinationEditorForm();
const destinations = useDestinationStore();

await destinations.refresh();

const center = ref([0, 0]);
const zoom = ref(2);
const rotation = ref(0);
const projection = ref("EPSG:4326");

const featureSelected = (event: MapClickEvent) => {
    destinationEditor.latitude = String(event.coordinate[1]);
    destinationEditor.longitude = String(event.coordinate[0]);
};


const transformCoordinates = (point: Point) => {
    return [point.longitude,point.latitude];
}

const overrideStyleFunction = (feature: any, style:any) => {
    let clusteredFeatures = feature.get('features');
    let size = clusteredFeatures.length;
    style.getText().setText(size.toString());

}



</script>

<style scoped>

</style>
