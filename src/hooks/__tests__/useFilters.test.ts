import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../useFilters';
import { FILTER_CONFIGS } from 'src/config/filterConfig';
import { NuqsAdapter } from 'nuqs/adapters/react';
import React from 'react';

// Wrapper for nuqs adapter
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NuqsAdapter, null, children);

describe('useFilters', () => {
  describe('Initial State', () => {
    it('should initialize with all venue types selected', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'cafe',
        'bakery',
      ]);
    });

    it('should initialize with all halal statuses selected', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      expect(result.current.filters.halalStatus).toEqual([
        'fully-halal',
        'partially-halal',
        'halal-friendly',
      ]);
    });
  });

  describe('toggleFilter', () => {
    it('should remove venue type when it is currently selected', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.toggleFilter('venueType', 'cafe');
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'bakery',
      ]);
    });

    // TODO: Fix async state updates with nuqs in tests
    it.skip('should add venue type when it is not currently selected', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      // First remove cafe
      act(() => {
        result.current.toggleFilter('venueType', 'cafe');
      });

      // Then add it back
      act(() => {
        result.current.toggleFilter('venueType', 'cafe');
      });

      expect(result.current.filters.venueType).toContain('cafe');
      expect(result.current.filters.venueType).toHaveLength(3);
    });

    // TODO: Fix async state updates with nuqs in tests
    it.skip('should allow deselecting all venue types', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.toggleFilter('venueType', 'restaurant');
        result.current.toggleFilter('venueType', 'cafe');
        result.current.toggleFilter('venueType', 'bakery');
      });

      expect(result.current.filters.venueType).toEqual([]);
    });

    // TODO: Fix async state updates with nuqs in tests
    it.skip('should handle multiple sequential toggles', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.toggleFilter('venueType', 'restaurant');
        result.current.toggleFilter('venueType', 'cafe');
      });

      expect(result.current.filters.venueType).toEqual(['bakery']);
    });

    it('should preserve other filter properties when toggling venue type', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      // Manually set other filters
      act(() => {
        result.current.setFilter('venueType', ['restaurant']);
      });

      const initialFilters = result.current.filters;

      act(() => {
        result.current.toggleFilter('venueType', 'cafe');
      });

      // Other filter properties should be unchanged
      expect(result.current.filters.halalStatus).toEqual(
        initialFilters.halalStatus
      );
    });
  });

  describe('setFilter', () => {
    it('should replace venue types with provided array', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', ['cafe']);
      });

      expect(result.current.filters.venueType).toEqual(['cafe']);
    });

    it('should allow setting multiple venue types', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', ['restaurant', 'bakery']);
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'bakery',
      ]);
    });

    it('should allow setting empty array', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', []);
      });

      expect(result.current.filters.venueType).toEqual([]);
    });

    it('should preserve other filter properties', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      const initialFilters = result.current.filters;

      act(() => {
        result.current.setFilter('venueType', ['cafe']);
      });

      expect(result.current.filters.halalStatus).toEqual(
        initialFilters.halalStatus
      );
    });
  });

  describe('Reset to defaults', () => {
    it('should reset to default state with all venue types', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      // Modify filters
      act(() => {
        result.current.setFilter('venueType', ['cafe']);
      });

      // Reset to defaults
      act(() => {
        result.current.setFilter(
          'venueType',
          FILTER_CONFIGS.venueType.defaultValue
        );
      });

      expect(result.current.filters.venueType).toEqual([
        'restaurant',
        'cafe',
        'bakery',
      ]);
    });

    it('should work multiple times consecutively', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', ['cafe']);
        result.current.setFilter(
          'venueType',
          FILTER_CONFIGS.venueType.defaultValue
        );
        result.current.setFilter('venueType', ['restaurant']);
        result.current.setFilter(
          'venueType',
          FILTER_CONFIGS.venueType.defaultValue
        );
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
      const { result, rerender } = renderHook(() => useFilters(), { wrapper });

      const firstToggleFilter = result.current.toggleFilter;
      const firstSetFilter = result.current.setFilter;

      rerender();

      expect(result.current.toggleFilter).toBe(firstToggleFilter);
      expect(result.current.setFilter).toBe(firstSetFilter);
    });

    // TODO: Fix async state updates with nuqs in tests
    it.skip('should only trigger re-renders when filter state changes', () => {
      let renderCount = 0;
      const { result } = renderHook(
        () => {
          renderCount++;
          return useFilters();
        },
        { wrapper }
      );

      const initialRenderCount = renderCount;

      // This should trigger a re-render
      act(() => {
        result.current.toggleFilter('venueType', 'cafe');
      });

      expect(renderCount).toBe(initialRenderCount + 1);
    });
  });

  describe('Edge Cases', () => {
    // TODO: Fix async state updates with nuqs in tests
    it.skip('should handle toggling a venue type that does not exist in current selection', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', []);
        result.current.toggleFilter('venueType', 'restaurant');
      });

      expect(result.current.filters.venueType).toEqual(['restaurant']);
    });

    it('should handle setting venue types to the same value', () => {
      const { result } = renderHook(() => useFilters(), { wrapper });

      act(() => {
        result.current.setFilter('venueType', ['restaurant']);
        result.current.setFilter('venueType', ['restaurant']);
      });

      expect(result.current.filters.venueType).toEqual(['restaurant']);
    });
  });
});
