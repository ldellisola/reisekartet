import type {Point} from "@/api/Models/Point";


export type DestinationType = "RESTAURANT" | "HOTEL" | "ATTRACTION" | "NATURE" | "OTHER";
export interface Destination {
    id: string | null;
    name: string;
    description: string;
    location: Point;
    type: DestinationType;
    website : string | null
}
