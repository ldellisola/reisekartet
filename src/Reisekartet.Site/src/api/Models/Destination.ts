export interface PlaceLocation {
  latitude: number
  longitude: number
}

export interface Destination extends PlaceLocation {
  id: string
  name: string
  city?: string
  country?: string
  tags: string[]
  website?: string
  description?: string
}
