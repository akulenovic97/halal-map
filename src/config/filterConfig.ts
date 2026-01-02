import type { VenueFilters } from 'src/types/filter';
import type { VenueType, HalalStatus, AlcoholPolicy } from 'src/types/venue';

export type FilterKey = keyof VenueFilters;

export type FilterOption<T> = {
  value: T;
  label: string;
  icon: string;
};

export type FilterConfig<T> = {
  key: FilterKey;
  label: string;
  options: FilterOption<T>[];
  defaultValue: T[];
};

const VENUE_TYPE_CONFIG: FilterConfig<VenueType> = {
  key: 'venueType',
  label: 'Venue Type',
  options: [
    { value: 'restaurant' as const, label: 'Restaurant', icon: '🍽️' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
    { value: 'bakery', label: 'Bakery', icon: '🥐' },
  ],
  defaultValue: ['restaurant', 'cafe', 'bakery'],
};

const HALAL_STATUS_CONFIG: FilterConfig<HalalStatus> = {
  key: 'halalStatus',
  label: 'Halal Status',
  options: [
    { value: 'fully-halal' as const, label: 'Fully Halal', icon: '✓' },
    { value: 'partially-halal' as const, label: 'Partially Halal', icon: '◐' },
    { value: 'halal-friendly' as const, label: 'Halal-Friendly', icon: '○' },
  ],
  defaultValue: ['fully-halal', 'partially-halal', 'halal-friendly'],
};

const ALCOHOL_POLICY_CONFIG: FilterConfig<AlcoholPolicy> = {
  key: 'alcoholPolicy',
  label: 'Alcohol Policy',
  options: [
    { value: 'none' as const, label: 'No Alcohol', icon: '🚫🍺' },
    {
      value: 'non-alcoholic-available' as const,
      label: 'Non-Alcoholic Available',
      icon: '🍺',
    },
  ],
  defaultValue: ['none', 'non-alcoholic-available'],
};

export const FILTER_CONFIGS = {
  venueType: VENUE_TYPE_CONFIG,
  halalStatus: HALAL_STATUS_CONFIG,
  alcoholPolicy: ALCOHOL_POLICY_CONFIG,
};

export function getFilterConfig<K extends keyof typeof FILTER_CONFIGS>(
  key: K
): (typeof FILTER_CONFIGS)[K] {
  return FILTER_CONFIGS[key];
}
