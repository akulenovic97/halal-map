import type { Venue } from 'src/types/venue';
import type { MapBounds } from 'src/types/map';

/**
 * Checks if a venue's coordinates are within the given map bounds with optional padding
 *
 * @param venue - The venue to check
 * @param bounds - The map viewport bounds
 * @param padding - Padding percentage (0-1) to extend bounds. Default is 0.2 (20%)
 * @returns True if the venue is within the padded bounds
 */
function isVenueInBounds(
  venue: Venue,
  bounds: MapBounds,
  padding: number
): boolean {
  // Calculate padding in degrees
  const latPadding = (bounds.north - bounds.south) * padding;
  const lngPadding = (bounds.east - bounds.west) * padding;

  // Check if venue coordinates are within padded bounds
  return (
    venue.coordinates.lat >= bounds.south - latPadding &&
    venue.coordinates.lat <= bounds.north + latPadding &&
    venue.coordinates.lng >= bounds.west - lngPadding &&
    venue.coordinates.lng <= bounds.east + lngPadding
  );
}

/**
 * Filters venues to only those within the current map viewport with padding
 *
 * @param venues - Array of venues to filter
 * @param bounds - The map viewport bounds
 * @param padding - Padding percentage (0-1) to extend bounds. Default is 0.2 (20%)
 * @returns Filtered array of venues within the viewport
 *
 * @example
 * ```typescript
 * const visibleVenues = filterVenuesByViewport(
 *   allVenues,
 *   { north: 40.8, south: 40.7, east: -73.9, west: -74.0 },
 *   0.2 // 20% padding beyond viewport edges
 * );
 * ```
 */
export function filterVenuesByViewport(
  venues: Venue[],
  bounds: MapBounds | null,
  padding: number = 0.2
): Venue[] {
  // If no bounds provided, return all venues
  if (!bounds) {
    return venues;
  }

  // Filter venues that are within the bounds
  return venues.filter(venue => isVenueInBounds(venue, bounds, padding));
}
