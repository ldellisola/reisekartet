export interface PlaceLocation {
  latitude: number
  longitude: number
}

export interface Destination extends PlaceLocation {
  id: string
  name: string
  tags: string[]
  website: string | null
}
