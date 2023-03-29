import type {Point} from "@/api/Models/Point";


export type DestinationType = "Restaurant" | "Hotel" | "Attraction" | "Nature" | "Other";
export interface Destination {
    id: string;
    name: string;
    description: string;
    location: Point;
    type: DestinationType;
    Website?: string;
}
