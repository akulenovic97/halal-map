import type { HalalStatus, VenueType, AlcoholPolicy } from 'src/types/venue';

export type VenueFilters = {
  halalStatus?: HalalStatus[];
  venueType?: VenueType[];
  alcoholPolicy?: AlcoholPolicy[];
  cuisine?: string[];
  priceRange?: number[];
};
