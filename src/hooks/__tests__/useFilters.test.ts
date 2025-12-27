import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../useFilters';

describe('useFilters', () => {
  describe('Initial State', () => {
    it('should initialize with all venue types selected', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'cafe',
        'bakery',
      ]);
    });

    it('should initialize with no other filters set', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filters.halalStatus).toBeUndefined();
      expect(result.current.filters.alcoholPolicy).toBeUndefined();
      expect(result.current.filters.cuisine).toBeUndefined();
      expect(result.current.filters.priceRange).toBeUndefined();
    });
  });

  describe('toggleVenueType', () => {
    it('should remove venue type when it is currently selected', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleVenueType('cafe');
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'bakery',
      ]);
    });

    it('should add venue type when it is not currently selected', () => {
      const { result } = renderHook(() => useFilters());

      // First remove cafe
      act(() => {
        result.current.toggleVenueType('cafe');
      });

      // Then add it back
      act(() => {
        result.current.toggleVenueType('cafe');
      });

      expect(result.current.filters.venueType).toContain('cafe');
      expect(result.current.filters.venueType).toHaveLength(3);
    });

    it('should allow deselecting all venue types', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleVenueType('restaurant');
        result.current.toggleVenueType('cafe');
        result.current.toggleVenueType('bakery');
      });

      expect(result.current.filters.venueType).toEqual([]);
    });

    it('should handle multiple sequential toggles', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleVenueType('restaurant');
        result.current.toggleVenueType('cafe');
      });

      expect(result.current.filters.venueType).toEqual(['bakery']);
    });

    it('should preserve other filter properties when toggling venue type', () => {
      const { result } = renderHook(() => useFilters());

      // Manually set other filters
      act(() => {
        result.current.setVenueTypes(['restaurant']);
      });

      const initialFilters = result.current.filters;

      act(() => {
        result.current.toggleVenueType('cafe');
      });

      // Other filter properties should be unchanged
      expect(result.current.filters.halalStatus).toBe(
        initialFilters.halalStatus
      );
    });
  });

  describe('setVenueTypes', () => {
    it('should replace venue types with provided array', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes(['cafe']);
      });

      expect(result.current.filters.venueType).toEqual(['cafe']);
    });

    it('should allow setting multiple venue types', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes(['restaurant', 'bakery']);
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'bakery',
      ]);
    });

    it('should allow setting empty array', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes([]);
      });

      expect(result.current.filters.venueType).toEqual([]);
    });

    it('should preserve other filter properties', () => {
      const { result } = renderHook(() => useFilters());

      const initialFilters = result.current.filters;

      act(() => {
        result.current.setVenueTypes(['cafe']);
      });

      expect(result.current.filters.halalStatus).toBe(
        initialFilters.halalStatus
      );
    });
  });

  describe('clearFilters', () => {
    it('should reset to default state with all venue types', () => {
      const { result } = renderHook(() => useFilters());

      // Modify filters
      act(() => {
        result.current.setVenueTypes(['cafe']);
      });

      // Clear filters
      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'cafe',
        'bakery',
      ]);
    });

    it('should work multiple times consecutively', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes(['cafe']);
        result.current.clearFilters();
        result.current.setVenueTypes(['restaurant']);
        result.current.clearFilters();
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'cafe',
        'bakery',
      ]);
    });
  });

  describe('Stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useFilters());

      const firstToggleVenueType = result.current.toggleVenueType;
      const firstSetVenueTypes = result.current.setVenueTypes;
      const firstClearFilters = result.current.clearFilters;

      rerender();

      expect(result.current.toggleVenueType).toBe(firstToggleVenueType);
      expect(result.current.setVenueTypes).toBe(firstSetVenueTypes);
      expect(result.current.clearFilters).toBe(firstClearFilters);
    });

    it('should only trigger re-renders when filter state changes', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useFilters();
      });

      const initialRenderCount = renderCount;

      // This should trigger a re-render
      act(() => {
        result.current.toggleVenueType('cafe');
      });

      expect(renderCount).toBe(initialRenderCount + 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle toggling a venue type that does not exist in current selection', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes([]);
        result.current.toggleVenueType('restaurant');
      });

      expect(result.current.filters.venueType).toEqual(['restaurant']);
    });

    it('should handle setting venue types to the same value', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setVenueTypes(['restaurant']);
        result.current.setVenueTypes(['restaurant']);
      });

      expect(result.current.filters.venueType).toEqual(['restaurant']);
    });
  });
});
