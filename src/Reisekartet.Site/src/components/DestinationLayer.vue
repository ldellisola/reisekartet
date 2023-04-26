<template>
    <ol-vector-layer>
        <ol-source-cluster
                :distance="40"
        >
            <ol-source-vector>
                <ol-feature
                        v-for="destination in destinations"
                        :key="destination.id"
                        :properties="{type: destination.type}"
                >
                    <ol-geom-point :coordinates="transformCoordinates(destination.location)" />
                </ol-feature>
            </ol-source-vector>

        </ol-source-cluster>

        <ol-style :overrideStyleFunction="overrideStyleFunction">
            <ol-style-stroke color="black" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>

            <ol-style-circle :radius="10">
                <ol-style-fill :color="color"></ol-style-fill>
                <ol-style-stroke color="#fff" :width="1"></ol-style-stroke>
            </ol-style-circle>
            <ol-style-text>
                <ol-style-fill color="#fff"></ol-style-fill>
            </ol-style-text>
        </ol-style>

    </ol-vector-layer>
</template>

<script lang="ts" setup>
import type {Point} from "@/api/Models/Point";
import type {Destination, DestinationType} from "@/api/Models/Destination";

const props = defineProps<{
    destinations: Destination[],
    type: DestinationType
}>();
const transformCoordinates = (point: Point) => {
    return [point.longitude,point.latitude];
}

const overrideStyleFunction = (feature: any, style:any) => {
    let clusteredFeatures = feature.get('features');
    let size = clusteredFeatures.length;
    style.getText().setText(size.toString());
}

const color = getColor(props.type);

function getColor(type: DestinationType) : string{
    switch (type) {
        case "RESTAURANT":
            return "purple";
        case "HOTEL":
            return "blue";
        case "ATTRACTION":
            return "orange";
        case "NATURE":
            return "green";
        case "OTHER":
            return "black";
        default:
            break;
    }
    
    return "";
}

</script>


