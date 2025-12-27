import { useQueryState, parseAsArrayOf, parseAsStringEnum } from 'nuqs';
import { useMemo, useCallback } from 'react';
import type { VenueFilters, VenueType } from '../types/filter';

const VENUE_TYPES = ['restaurant', 'cafe', 'bakery'] as const;
const DEFAULT_VENUE_TYPES: VenueType[] = [
  'restaurant',
  'cafe',
  'bakery',
] as const;

export interface UseFiltersReturn {
  filters: VenueFilters;
  toggleVenueType: (type: VenueType) => void;
  setVenueTypes: (types: VenueType[]) => void;
  clearFilters: () => void;
}

/**
 * Custom hook for managing venue filter state via URL query parameters.
 *
 * This hook uses URL search params to store filter state, enabling:
 * - Shareable filtered views via URL
 * - Browser back/forward navigation
 * - State persistence across page reloads
 *
 * @returns Object containing filter state and update functions
 *
 * @example
 * ```tsx
 * const { filters, toggleVenueType } = useFilters();
 *
 * // Toggle a venue type (updates URL: ?venueType=restaurant,cafe)
 * toggleVenueType('cafe');
 *
 * // Set multiple venue types
 * setVenueTypes(['restaurant', 'bakery']);
 *
 * // Reset filters (clears URL params)
 * clearFilters();
 * ```
 */
export function useFilters(): UseFiltersReturn {
  const [venueTypes, setVenueTypesState] = useQueryState(
    'venueType',
    parseAsArrayOf(parseAsStringEnum(VENUE_TYPES)).withDefault(
      DEFAULT_VENUE_TYPES
    )
  );

  const toggleVenueType = useCallback(
    (type: VenueType) => {
      const currentTypes = venueTypes || [];
      const isSelected = currentTypes.includes(type);

      if (isSelected) {
        setVenueTypesState(currentTypes.filter(t => t !== type));
      } else {
        setVenueTypesState([...currentTypes, type]);
      }
    },
    [venueTypes, setVenueTypesState]
  );

  const setVenueTypes = useCallback(
    (types: VenueType[]) => {
      setVenueTypesState(types);
    },
    [setVenueTypesState]
  );

  const clearFilters = useCallback(() => {
    setVenueTypesState(DEFAULT_VENUE_TYPES);
  }, [setVenueTypesState]);

  const filters: VenueFilters = useMemo(
    () => ({
      venueType: venueTypes,
    }),
    [venueTypes]
  );

  return useMemo(
    () => ({
      filters,
      toggleVenueType,
      setVenueTypes,
      clearFilters,
    }),
    [filters, toggleVenueType, setVenueTypes, clearFilters]
  );
}
