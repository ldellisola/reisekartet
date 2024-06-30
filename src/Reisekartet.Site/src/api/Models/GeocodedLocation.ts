import type { PlaceLocation } from '@/api/Models/Destination'

export default interface GeocodedLocation extends PlaceLocation {
  city: string
  country: string
}
