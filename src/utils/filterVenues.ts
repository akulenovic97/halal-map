import type { Venue } from 'src/types/venue';
import type { VenueFilters } from 'src/types/filter';

function isFilterActive<T>(filter: T[] | undefined): filter is T[] {
  return Boolean(filter && filter.length > 0);
}

function matchesSingleValueFilter<T>(
  value: T,
  filter: T[] | undefined
): boolean {
  if (!isFilterActive(filter)) return true;
  return filter.includes(value);
}

function matchesArrayFilter(
  values: string[],
  filter: string[] | undefined
): boolean {
  if (!isFilterActive(filter)) return true;
  return filter.some(filterValue => values.includes(filterValue));
}

/**
 * Filters an array of venues based on the provided filter criteria.
 *
 * @param venues - Array of venues to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered array of venues
 *
 * @remarks
 * - Empty or undefined filter arrays are treated as "show all"
 * - Multiple filters are combined with AND logic
 * - Within a filter type (e.g., venueType), values are combined with OR logic
 *
 * @performance
 * - Time complexity: O(n * m) where n = venues.length, m = avg filter checks
 * - Early returns minimize unnecessary checks
 * - Optimal for <1000 venues with client-side filtering
 */
export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  return venues.filter(venue => {
    return (
      matchesSingleValueFilter(venue.venueType, filters.venueType) &&
      matchesSingleValueFilter(venue.halalStatus, filters.halalStatus) &&
      matchesSingleValueFilter(venue.alcoholPolicy, filters.alcoholPolicy) &&
      matchesArrayFilter(venue.cuisine, filters.cuisine) &&
      matchesSingleValueFilter(venue.priceRange, filters.priceRange)
    );
  });
}
