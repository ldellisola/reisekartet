import {defineStore} from "pinia";
import type {Destination, DestinationType} from "@/api/Models/Destination";


export const useDestinationEditorForm = defineStore('DestinationsEditorForm', {
    state: () => ({
        name: '' as string,
        latitude: '0',
        longitude: '0',
        website: '' as string | null,
        type: '' as DestinationType,
    }),
    getters: {
        destinationTypes: () => ["Restaurant" , "Hotel" , "Attraction" , "Nature" , "Other"],
        errors: (state) => {
            const errors: string[] = [];
            if (state.name.length < 3) {
                errors.push('Name is too short');
            }
            
            const lat = Number.parseFloat(state.latitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                errors.push('Latitude is invalid');
            }
            
            const lon = Number.parseFloat(state.longitude);
            if (isNaN(lon) || lon < -180 || lon > 180) {
                errors.push('Longitude is invalid');
            }
            if (state.website && !state.website.startsWith('http')) {
                errors.push('Website is invalid');
            }
            return errors;
        },
        destination: (state) : Destination => {
            return {
                description: "", 
                id: "",
                name: state.name,
                location: {
                    latitude: Number.parseFloat(state.latitude),
                    longitude: Number.parseFloat(state.longitude),
                },
                website: state.website,
                type: state.type
            };
        }
    },
    actions: {
        reset() {
            this.name = '';
            this.latitude = '0';
            this.longitude = '0';
            this.website = null;
            this.type = '' as DestinationType;
        }
    },
})
