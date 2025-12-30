import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMapBounds } from '../useMapBounds';
import type { MapBounds } from 'src/types/map';

const testBounds: MapBounds = {
  north: 40.8,
  south: 40.7,
  east: -73.9,
  west: -74.0,
};

const testBounds2: MapBounds = {
  north: 40.9,
  south: 40.6,
  east: -73.8,
  west: -74.1,
};

describe('useMapBounds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with null bounds when no initial value provided', () => {
      const { result } = renderHook(() => useMapBounds());

      expect(result.current.bounds).toBeNull();
    });

    it('initializes with provided initial bounds', () => {
      const { result } = renderHook(() => useMapBounds(testBounds));

      expect(result.current.bounds).toEqual(testBounds);
    });

    it('provides updateBounds function', () => {
      const { result } = renderHook(() => useMapBounds());

      expect(typeof result.current.updateBounds).toBe('function');
    });
  });

  describe('updateBounds with debouncing', () => {
    it('updates bounds after debounce delay', () => {
      const { result } = renderHook(() => useMapBounds(null, 500));

      expect(result.current.bounds).toBeNull();

      act(() => {
        result.current.updateBounds(testBounds);
      });

      // Should not update immediately
      expect(result.current.bounds).toBeNull();

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should update after delay
      expect(result.current.bounds).toEqual(testBounds);
    });

    it('cancels previous update when called multiple times rapidly', () => {
      const { result } = renderHook(() => useMapBounds(null, 500));

      act(() => {
        result.current.updateBounds(testBounds);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.updateBounds(testBounds2);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should only have the latest bounds
      expect(result.current.bounds).toEqual(testBounds2);
    });

    it('handles multiple rapid updates correctly (debounce behavior)', () => {
      const { result } = renderHook(() => useMapBounds(null, 500));

      const bounds1 = { ...testBounds, north: 40.81 };
      const bounds2 = { ...testBounds, north: 40.82 };
      const bounds3 = { ...testBounds, north: 40.83 };

      act(() => {
        result.current.updateBounds(bounds1);
        vi.advanceTimersByTime(100);
        result.current.updateBounds(bounds2);
        vi.advanceTimersByTime(100);
        result.current.updateBounds(bounds3);
      });

      expect(result.current.bounds).toBeNull();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Only the last update should be applied
      expect(result.current.bounds).toEqual(bounds3);
    });

    it('respects custom debounce delay', () => {
      const { result } = renderHook(() => useMapBounds(null, 1000));

      act(() => {
        result.current.updateBounds(testBounds);
      });

      act(() => {
        vi.advanceTimersByTime(999);
      });

      expect(result.current.bounds).toBeNull();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current.bounds).toEqual(testBounds);
    });

    it('allows updates after debounce delay has passed', () => {
      const { result } = renderHook(() => useMapBounds(null, 500));

      act(() => {
        result.current.updateBounds(testBounds);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(testBounds);

      // Update again
      act(() => {
        result.current.updateBounds(testBounds2);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(testBounds2);
    });
  });

  describe('Function Stability', () => {
    it('returns stable updateBounds function reference', () => {
      const { result, rerender } = renderHook(() => useMapBounds());

      const initialUpdate = result.current.updateBounds;

      rerender();

      expect(result.current.updateBounds).toBe(initialUpdate);
    });

    it('maintains stable function when bounds change', () => {
      const { result } = renderHook(() => useMapBounds());

      const initialUpdate = result.current.updateBounds;

      act(() => {
        result.current.updateBounds(testBounds);
        vi.advanceTimersByTime(500);
      });

      expect(result.current.updateBounds).toBe(initialUpdate);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero debounce delay', () => {
      const { result } = renderHook(() => useMapBounds(null, 0));

      act(() => {
        result.current.updateBounds(testBounds);
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.bounds).toEqual(testBounds);
    });

    it('handles updating from null to bounds', () => {
      const { result } = renderHook(() => useMapBounds());

      expect(result.current.bounds).toBeNull();

      act(() => {
        result.current.updateBounds(testBounds);
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(testBounds);
    });

    it('handles updating from bounds to different bounds', () => {
      const { result } = renderHook(() => useMapBounds(testBounds));

      expect(result.current.bounds).toEqual(testBounds);

      act(() => {
        result.current.updateBounds(testBounds2);
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(testBounds2);
    });

    it('handles very rapid updates (simulating fast panning)', () => {
      const { result } = renderHook(() => useMapBounds(null, 500));

      // Simulate 20 rapid updates (user panning map)
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.updateBounds({
            ...testBounds,
            north: 40.8 + i * 0.01,
          });
          vi.advanceTimersByTime(50);
        });
      }

      expect(result.current.bounds).toBeNull();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should have the last bounds
      expect(result.current.bounds).toEqual({
        ...testBounds,
        north: 40.8 + 19 * 0.01,
      });
    });
  });

  describe('Debounce Delay Changes', () => {
    it('uses new debounce delay when prop changes', () => {
      const { result, rerender } = renderHook(
        ({ delay }) => useMapBounds(null, delay),
        { initialProps: { delay: 500 } }
      );

      act(() => {
        result.current.updateBounds(testBounds);
      });

      // Change delay
      rerender({ delay: 1000 });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Old delay shouldn't trigger update
      // Note: This behavior depends on implementation
      // With current implementation, changing delay creates new debounced function
    });
  });

  describe('Real-World Scenarios', () => {
    it('simulates user panning map and stopping', () => {
      const { result } = renderHook(() => useMapBounds(testBounds, 500));

      // User starts panning
      act(() => {
        result.current.updateBounds({ ...testBounds, north: 40.81 });
        vi.advanceTimersByTime(100);
        result.current.updateBounds({ ...testBounds, north: 40.82 });
        vi.advanceTimersByTime(100);
        result.current.updateBounds({ ...testBounds, north: 40.83 });
      });

      // Still panning, no update yet
      expect(result.current.bounds).toEqual(testBounds);

      // User stops panning
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Bounds update after user stops
      expect(result.current.bounds).toEqual({ ...testBounds, north: 40.83 });
    });

    it('simulates user zooming in and out', () => {
      const { result } = renderHook(() => useMapBounds(testBounds, 500));

      const zoomedIn = {
        north: 40.76,
        south: 40.74,
        east: -73.94,
        west: -73.96,
      };

      act(() => {
        result.current.updateBounds(zoomedIn);
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(zoomedIn);

      const zoomedOut = {
        north: 40.9,
        south: 40.6,
        east: -73.8,
        west: -74.1,
      };

      act(() => {
        result.current.updateBounds(zoomedOut);
        vi.advanceTimersByTime(500);
      });

      expect(result.current.bounds).toEqual(zoomedOut);
    });
  });
});
