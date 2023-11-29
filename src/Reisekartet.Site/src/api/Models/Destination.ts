export interface PlaceLocation {
  latitude: number
  longitude: number
}

export interface Destination extends PlaceLocation {
  id: string
  name: string
  city: string | null
  country: string | null
  tags: string[]
  website: string | null
  description: string | null
}
