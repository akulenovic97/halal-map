import type { HalalStatus, VenueType, AlcoholPolicy } from './venue';

export type VenueFilters = {
  halalStatus?: HalalStatus[];
  venueType?: VenueType[];
  alcoholPolicy?: AlcoholPolicy[];
  cuisine?: string[];
  priceRange?: number[];
};
