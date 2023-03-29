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
        async refresh() {
            const {data, error} = await getDestinations();
            
            if (error) {
                this.error = error.message;
                return;
            }
            
            this.destinations = data.destinations;
        },
        async create(destination : Destination) {
            const {data, errors} = await createDestination(destination.name, destination.location.latitude, destination.location.longitude, destination.website, destination.type);
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
