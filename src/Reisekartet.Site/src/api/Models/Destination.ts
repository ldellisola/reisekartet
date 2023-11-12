export interface PlaceLocation {
  latitude: number
  longitude: number
}

export interface Destination extends PlaceLocation {
  id: string
  name: string
  type: string
  website: string | null
}
