export type HalalStatus = 'fully-halal' | 'partially-halal' | 'halal-friendly';

export type VenueType = 'restaurant' | 'cafe' | 'bakery';

export type AlcoholPolicy = 'none' | 'non-alcoholic-available';

export type PriceRange = 1 | 2 | 3;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Venue = {
  id: string;
  name: string;
  coordinates: Coordinates;
  halalStatus: HalalStatus;
  venueType: VenueType;
  alcoholPolicy: AlcoholPolicy;
  cuisine: string[];
  priceRange: PriceRange;
  address: string;
  website?: string;
  instagram?: string;
  googleMapsUrl?: string;
  yelpUrl?: string;
  photos?: string[];
  description: string;
};
