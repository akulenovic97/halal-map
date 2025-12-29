import { useState, useMemo, useCallback } from 'react';
import type { MapBounds } from 'src/types/map';
import { debounce } from 'src/utils/debounce';

export interface UseMapBoundsReturn {
  bounds: MapBounds | null;
  updateBounds: (newBounds: MapBounds) => void;
}

/**
 * Custom hook to manage map viewport bounds with debouncing
 *
 * @param initialBounds - Optional initial bounds
 * @param debounceDelay - Delay in milliseconds for debouncing updates. Default is 500ms
 * @returns Object with current bounds and updateBounds function
 *
 * @example
 * ```typescript
 * const { bounds, updateBounds } = useMapBounds(null, 500);
 * ```
 */
export function useMapBounds(
  initialBounds: MapBounds | null = null,
  debounceDelay: number = 500
): UseMapBoundsReturn {
  const [bounds, setBounds] = useState<MapBounds | null>(initialBounds);

  // Create a debounced version of setBounds
  // Memoize so it doesn't change on every render
  const debouncedSetBounds = useMemo(
    () => debounce(setBounds, debounceDelay),
    [debounceDelay]
  );

  // Wrap in useCallback to provide stable reference
  const updateBounds = useCallback(
    (newBounds: MapBounds) => {
      debouncedSetBounds(newBounds);
    },
    [debouncedSetBounds]
  );

  return {
    bounds,
    updateBounds,
  };
}
