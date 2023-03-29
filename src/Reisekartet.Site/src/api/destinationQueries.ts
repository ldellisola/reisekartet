import {graphQlClient} from "@/api/graphQl";
import gql from "graphql-tag";
import type {DestinationType} from "@/api/Models/Destination";

export const getDestinations = async () => {
    const query = gql`
    query { 
        destinations {
            name
            location {
                latitude
                longitude
            }
            id
            website
        }
    }
    `;

    return await graphQlClient.query({query: query})
};


export const createDestination = async (name: string, latitude: number, longitude: number, website: string|null, type: DestinationType) => {
    const query = gql`
    mutation createDestination(
        $name: String!, 
        $latitude: Float!, 
        $longitude: Float!, 
        $website: String!, 
        $type: DestinationType!
    ) {
        createDestination(input: { 
            name: $name, 
            location: {
                latitude: $latitude, 
                longitude: $longitude 
            },
            website: $website,
            type: $type
            }
        ) {
        
            destinationDto {
                name
                location {
                    latitude
                    longitude
                }
                id
                website
            }
        }
    }
    `;

    return await graphQlClient.mutate({
        mutation: query,
        variables: {
            name,
            latitude,
            longitude,
            website,
            type: (type as string).toUpperCase()
        }
    })
}


export const deleteDestination = async (id: string) => {
    const query = gql`
    mutation deleteDestination($id: String!) {
        deleteDestination(input: {id: $id}) {
            boolean
        }
    }
    `;

    return await graphQlClient.mutate({
        mutation: query,
        variables: {
            id
        }
    })
}
