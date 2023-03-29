import {defineStore} from "pinia";
import type {Destination, DestinationType} from "@/api/Models/Destination";
import {createDestination, deleteDestination, getDestinations} from "@/api/destinationQueries";

export const useDestinationStore = defineStore('Destinations', {
    state: () => ({
        destinations: [] as Destination[],
        error: null as string | null,
    }),
    getters: {
        all: (state) : Destination[]=> state.destinations,
        hasError: (state) => state.error !== null,
    },
    actions: {
        async get() {
            const {data, error} = await getDestinations();
            
            if (error) {
                this.error = error.message;
                return;
            }
            
            this.destinations = data.destinations;
        },
        async create(name: string, latitude: number, longitude: number, website: string, type: DestinationType) {
            const {data, errors} = await createDestination(name, latitude, longitude, website,type);
            if (errors && errors?.length > 0) {
                this.error = errors[0].message;
                return;
            }
            
            this.destinations = [... this.destinations, data.createDestination.destinationDto];
        },
        async delete(id: string) {
            const {data,errors} = await deleteDestination(id);
            
            if (errors && errors?.length > 0) {
                this.error = errors[0].message;
                return;
            }
            
            if (data.deleteDestination.boolean)
                this.destinations = this.destinations.filter(d => d.id !== id);
        }
    }
});
