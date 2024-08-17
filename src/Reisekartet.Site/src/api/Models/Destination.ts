export type PlaceLocation = {
  latitude: number
  longitude: number
}

export type Destination = PlaceLocation & {
  id: string
  name: string
  city?: string
  country?: string
  tags: string[]
  website?: string
  description?: string
  show?: boolean
}
