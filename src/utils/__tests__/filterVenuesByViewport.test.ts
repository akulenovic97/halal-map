import { describe, it, expect } from 'vitest';
import { filterVenuesByViewport } from '../filterVenuesByViewport';
import type { Venue } from 'src/types/venue';
import type { MapBounds } from 'src/types/map';

// Helper to create a test venue
const createVenue = (lat: number, lng: number, id: string = '1'): Venue => ({
  id,
  name: `Test Venue ${id}`,
  coordinates: { lat, lng },
  halalStatus: 'fully-halal',
  venueType: 'restaurant',
  alcoholPolicy: 'none',
  cuisine: ['Test'],
  priceRange: 2,
  address: 'Test Address',
  description: 'Test description',
});

//NYC-ish bounds
const testBounds: MapBounds = {
  north: 40.8,
  south: 40.7,
  east: -73.9,
  west: -74.0,
};

describe('filterVenuesByViewport', () => {
  describe('Basic Filtering', () => {
    it('includes venues within bounds', () => {
      const venues = [
        createVenue(40.75, -73.95, '1'), // Center of bounds
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('excludes venues outside bounds (north)', () => {
      const venues = [
        createVenue(40.9, -73.95, '1'), // Too far north
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(0);
    });

    it('excludes venues outside bounds (south)', () => {
      const venues = [
        createVenue(40.6, -73.95, '1'), // Too far south
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(0);
    });

    it('excludes venues outside bounds (east)', () => {
      const venues = [
        createVenue(40.75, -73.8, '1'), // Too far east
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(0);
    });

    it('excludes venues outside bounds (west)', () => {
      const venues = [
        createVenue(40.75, -74.1, '1'), // Too far west
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(0);
    });
  });

  describe('Boundary Edge Cases', () => {
    it('includes venues exactly on northern boundary', () => {
      const venues = [createVenue(40.8, -73.95, '1')];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(1);
    });

    it('includes venues exactly on southern boundary', () => {
      const venues = [createVenue(40.7, -73.95, '1')];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(1);
    });

    it('includes venues exactly on eastern boundary', () => {
      const venues = [createVenue(40.75, -73.9, '1')];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(1);
    });

    it('includes venues exactly on western boundary', () => {
      const venues = [createVenue(40.75, -74.0, '1')];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(1);
    });
  });

  describe('Padding Behavior', () => {
    it('includes venues outside bounds with 20% padding', () => {
      const latRange = testBounds.north - testBounds.south; // 0.1
      const padding = latRange * 0.2; // 0.02

      const venues = [
        createVenue(40.8 + padding * 0.9, -73.95, '1'), // Just inside padded bounds
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0.2);

      expect(result).toHaveLength(1);
    });

    it('excludes venues far outside even with padding', () => {
      const venues = [
        createVenue(41.0, -73.95, '1'), // Way outside even with padding
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0.2);

      expect(result).toHaveLength(0);
    });

    it('uses 0 padding correctly', () => {
      const venues = [
        createVenue(40.8 + 0.001, -73.95, '1'), // Slightly outside
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(0);
    });

    it('uses default 20% padding when not specified', () => {
      const latRange = testBounds.north - testBounds.south;
      const padding = latRange * 0.2;

      const venues = [
        createVenue(40.8 + padding * 0.9, -73.95, '1'), // Just inside default padding
      ];

      const result = filterVenuesByViewport(venues, testBounds); // No padding arg

      expect(result).toHaveLength(1);
    });

    it('applies padding in all directions', () => {
      const latRange = testBounds.north - testBounds.south;
      const lngRange = testBounds.east - testBounds.west;
      const latPadding = latRange * 0.2;
      const lngPadding = lngRange * 0.2;

      const venues = [
        createVenue(40.8 + latPadding * 0.9, -73.95, '1'), // North
        createVenue(40.7 - latPadding * 0.9, -73.95, '2'), // South
        createVenue(40.75, -73.9 + lngPadding * 0.9, '3'), // East
        createVenue(40.75, -74.0 - lngPadding * 0.9, '4'), // West
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0.2);

      expect(result).toHaveLength(4);
    });
  });

  describe('Multiple Venues', () => {
    it('filters mixed venues correctly', () => {
      const venues = [
        createVenue(40.75, -73.95, '1'), // Inside
        createVenue(40.9, -73.95, '2'), // Outside
        createVenue(40.78, -73.92, '3'), // Inside
        createVenue(40.6, -74.1, '4'), // Outside
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result).toHaveLength(2);
      expect(result.map(v => v.id)).toEqual(['1', '3']);
    });

    it('preserves venue order', () => {
      const venues = [
        createVenue(40.75, -73.95, '1'),
        createVenue(40.78, -73.92, '2'),
        createVenue(40.72, -73.98, '3'),
      ];

      const result = filterVenuesByViewport(venues, testBounds, 0);

      expect(result.map(v => v.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('Edge Cases', () => {
    it('returns empty array when given empty venues array', () => {
      const result = filterVenuesByViewport([], testBounds, 0);

      expect(result).toEqual([]);
    });

    it('returns all venues when bounds is null', () => {
      const venues = [
        createVenue(40.75, -73.95, '1'),
        createVenue(50.0, -100.0, '2'), // Completely different location
      ];

      const result = filterVenuesByViewport(venues, null, 0);

      expect(result).toHaveLength(2);
    });

    it('handles very small bounds correctly', () => {
      const smallBounds: MapBounds = {
        north: 40.7501,
        south: 40.75,
        east: -73.95,
        west: -73.9501,
      };

      const venues = [
        createVenue(40.75005, -73.95005, '1'), // Inside tiny bounds
        createVenue(40.76, -73.95, '2'), // Outside
      ];

      const result = filterVenuesByViewport(venues, smallBounds, 0);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('handles very large bounds correctly', () => {
      const largeBounds: MapBounds = {
        north: 50,
        south: 30,
        east: -60,
        west: -80,
      };

      const venues = [
        createVenue(40.75, -73.95, '1'), // Inside large bounds
        createVenue(55, -73.95, '2'), // Outside
      ];

      const result = filterVenuesByViewport(venues, largeBounds, 0);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('handles 100% padding (doubling the bounds in each direction)', () => {
      const latRange = testBounds.north - testBounds.south; // 0.1
      const padding = latRange * 1.0; // 0.1

      const venues = [
        createVenue(40.75, -73.95, '1'), // Inside original
        createVenue(40.8 + padding * 0.9, -73.95, '2'), // Outside original, inside with 100% padding
      ];

      const result = filterVenuesByViewport(venues, testBounds, 1.0);

      expect(result).toHaveLength(2);
    });
  });

  describe('Real-World Scenarios', () => {
    it('filters NYC venues correctly', () => {
      const nycBounds: MapBounds = {
        north: 40.8,
        south: 40.7,
        east: -73.9,
        west: -74.0,
      };

      const venues = [
        createVenue(40.7614, -73.9776, '1'), // The Halal Guys (should be in)
        createVenue(40.7282, -73.9942, '2'), // Qahwah House (should be in)
        createVenue(40.7252, -73.9874, '3'), // Nur (should be in)
        createVenue(40.85, -73.95, '4'), // Too far north
      ];

      const result = filterVenuesByViewport(venues, nycBounds, 0);

      expect(result).toHaveLength(3);
      expect(result.map(v => v.id)).toEqual(['1', '2', '3']);
    });
  });
});
