import { useQueryState } from 'nuqs';
import { useCallback } from 'react';
import type { VenueFilters } from 'src/types/filter';
import type { VenueType, HalalStatus, AlcoholPolicy } from 'src/types/venue';
import { FILTER_CONFIGS, type FilterKey } from 'src/config/filterConfig';

// Type helper to map filter keys to their value types
type FilterValue<K extends FilterKey> = K extends 'venueType'
  ? VenueType
  : K extends 'halalStatus'
    ? HalalStatus
    : K extends 'alcoholPolicy'
      ? AlcoholPolicy
      : K extends 'cuisine'
        ? string
        : K extends 'priceRange'
          ? number
          : never;

// Build default filters dynamically from config
function getDefaultFilters(): VenueFilters {
  const defaults: Partial<VenueFilters> = {};

  (Object.keys(FILTER_CONFIGS) as (keyof typeof FILTER_CONFIGS)[]).forEach(
    key => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaults[key] = FILTER_CONFIGS[key].defaultValue as any;
    }
  );

  return defaults as VenueFilters;
}

// Custom JSON parser for URL query param
const filtersParser = {
  parse: (value: string | null): VenueFilters => {
    if (!value) return getDefaultFilters();
    try {
      return JSON.parse(value) as VenueFilters;
    } catch {
      return getDefaultFilters();
    }
  },
  serialize: (value: VenueFilters): string => {
    return JSON.stringify(value);
  },
};

export type UseFiltersReturn = {
  filters: VenueFilters;
  toggleFilter: <K extends FilterKey>(
    filterKey: K,
    value: FilterValue<K>
  ) => void;
  setFilter: <K extends FilterKey>(
    filterKey: K,
    values: FilterValue<K>[]
  ) => void;
};

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useQueryState(
    'filters',
    {
      ...filtersParser,
      defaultValue: getDefaultFilters(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any // nuqs types might need this
  );

  const toggleFilter = useCallback(
    <K extends FilterKey>(filterKey: K, value: FilterValue<K>) => {
      setFilters(prev => {
        const currentFilters = (prev || getDefaultFilters()) as VenueFilters;
        const current = (currentFilters[filterKey as keyof VenueFilters] ||
          []) as FilterValue<K>[];
        const newValues = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];

        return {
          ...currentFilters,
          [filterKey]: newValues,
        };
      });
    },
    [setFilters]
  );

  const setFilter = useCallback(
    <K extends FilterKey>(filterKey: K, values: FilterValue<K>[]) => {
      setFilters(prev => ({
        ...(prev || getDefaultFilters()),
        [filterKey]: values,
      }));
    },
    [setFilters]
  );

  return {
    filters: filters || getDefaultFilters(),
    toggleFilter,
    setFilter,
  };
}
