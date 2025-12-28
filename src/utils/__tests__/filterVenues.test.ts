import { describe, it, expect } from 'vitest';
import { filterVenues } from '../filterVenues';
import { mockVenues } from '../../data/mockVenues';
import type { VenueFilters } from '../../types/filter';

describe('filterVenues', () => {
  describe('Venue Type Filtering', () => {
    it('should return all venues when no venueType filter is applied', () => {
      const filters: VenueFilters = {};
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockVenues);
    });

    it('should return all venues when venueType array is empty', () => {
      const filters: VenueFilters = { venueType: [] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockVenues);
    });

    it('should filter to only restaurants', () => {
      const filters: VenueFilters = { venueType: ['restaurant'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Nur');
      expect(result.every(v => v.venueType === 'restaurant')).toBe(true);
    });

    it('should filter to only cafes', () => {
      const filters: VenueFilters = { venueType: ['cafe'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Qahwah House');
      expect(result[0].venueType).toBe('cafe');
    });

    it('should filter to only bakeries (returns empty array when none exist)', () => {
      const filters: VenueFilters = { venueType: ['bakery'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(0);
    });

    it('should return venues matching multiple venue types', () => {
      const filters: VenueFilters = { venueType: ['restaurant', 'cafe'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockVenues);
    });

    it('should return venues matching cafe or bakery (only cafe exists)', () => {
      const filters: VenueFilters = { venueType: ['cafe', 'bakery'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Qahwah House');
    });
  });

  describe('Halal Status Filtering', () => {
    it('should return all venues when no halalStatus filter is applied', () => {
      const filters: VenueFilters = {};
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
    });

    it('should filter to only fully-halal venues', () => {
      const filters: VenueFilters = { halalStatus: ['fully-halal'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[0].halalStatus).toBe('fully-halal');
    });

    it('should filter to halal-friendly venues', () => {
      const filters: VenueFilters = { halalStatus: ['halal-friendly'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Qahwah House');
    });

    it('should filter to multiple halal statuses', () => {
      const filters: VenueFilters = {
        halalStatus: ['fully-halal', 'partially-halal'],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Nur');
    });
  });

  describe('Alcohol Policy Filtering', () => {
    it('should filter to venues with no alcohol', () => {
      const filters: VenueFilters = { alcoholPolicy: ['none'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Qahwah House');
    });

    it('should filter to venues with non-alcoholic options', () => {
      const filters: VenueFilters = {
        alcoholPolicy: ['non-alcoholic-available'],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Nur');
    });
  });

  describe('Cuisine Filtering', () => {
    it('should filter to venues with Middle Eastern cuisine', () => {
      const filters: VenueFilters = { cuisine: ['Middle Eastern'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result.every(v => v.cuisine.includes('Middle Eastern'))).toBe(
        true
      );
    });

    it('should filter to venues with Yemeni cuisine', () => {
      const filters: VenueFilters = { cuisine: ['Yemeni'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Qahwah House');
    });

    it('should filter to venues with multiple cuisines (OR logic)', () => {
      const filters: VenueFilters = { cuisine: ['American', 'Coffee'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Qahwah House');
    });

    it('should return empty array for non-existent cuisine', () => {
      const filters: VenueFilters = { cuisine: ['Italian'] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Price Range Filtering', () => {
    it('should filter to budget venues (price range 1)', () => {
      const filters: VenueFilters = { priceRange: [1] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[0].priceRange).toBe(1);
    });

    it('should filter to upscale venues (price range 3)', () => {
      const filters: VenueFilters = { priceRange: [3] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Nur');
    });

    it('should filter to multiple price ranges', () => {
      const filters: VenueFilters = { priceRange: [1, 2] };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Qahwah House');
    });
  });

  describe('Combined Filters (AND logic)', () => {
    it('should filter by venue type AND halal status', () => {
      const filters: VenueFilters = {
        venueType: ['restaurant'],
        halalStatus: ['fully-halal'],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('The Halal Guys');
    });

    it('should filter by venue type AND price range', () => {
      const filters: VenueFilters = {
        venueType: ['restaurant'],
        priceRange: [3],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Nur');
    });

    it('should filter by multiple criteria (venue type, halal status, alcohol policy)', () => {
      const filters: VenueFilters = {
        venueType: ['restaurant', 'cafe'],
        halalStatus: ['fully-halal', 'halal-friendly'],
        alcoholPolicy: ['none'],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Qahwah House');
    });

    it('should return empty array when no venues match all criteria', () => {
      const filters: VenueFilters = {
        venueType: ['cafe'],
        halalStatus: ['fully-halal'],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(0);
    });

    it('should handle complex multi-filter scenario', () => {
      const filters: VenueFilters = {
        venueType: ['restaurant', 'cafe'],
        halalStatus: ['fully-halal', 'halal-friendly', 'partially-halal'],
        alcoholPolicy: ['none'],
        cuisine: ['Middle Eastern'],
        priceRange: [1, 2],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('The Halal Guys');
      expect(result[1].name).toBe('Qahwah House');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty venues array', () => {
      const filters: VenueFilters = { venueType: ['restaurant'] };
      const result = filterVenues([], filters);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle all empty filter arrays', () => {
      const filters: VenueFilters = {
        venueType: [],
        halalStatus: [],
        alcoholPolicy: [],
        cuisine: [],
        priceRange: [],
      };
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockVenues);
    });

    it('should handle completely empty filters object', () => {
      const filters: VenueFilters = {};
      const result = filterVenues(mockVenues, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockVenues);
    });
  });
});
