import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSidebarState } from '../useSidebarState';

describe('useSidebarState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with isOpen as false when localStorage is empty', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with isOpen as true when localStorage has "true"', () => {
      localStorage.setItem('halal-map-sidebar-open', 'true');

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(true);
    });

    it('should initialize with isOpen as false when localStorage has "false"', () => {
      localStorage.setItem('halal-map-sidebar-open', 'false');

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with isOpen as false when localStorage has invalid value', () => {
      localStorage.setItem('halal-map-sidebar-open', 'invalid');

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(typeof result.current.toggle).toBe('function');
      expect(typeof result.current.open).toBe('function');
      expect(typeof result.current.close).toBe('function');
    });
  });

  describe('toggle', () => {
    it('should toggle isOpen from false to true', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should toggle isOpen from true to false', () => {
      localStorage.setItem('halal-map-sidebar-open', 'true');
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should persist toggle to localStorage', () => {
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.toggle();
      });

      expect(localStorage.getItem('halal-map-sidebar-open')).toBe('true');

      act(() => {
        result.current.toggle();
      });

      expect(localStorage.getItem('halal-map-sidebar-open')).toBe('false');
    });
  });

  describe('open', () => {
    it('should set isOpen to true when currently false', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should keep isOpen as true when already true', () => {
      localStorage.setItem('halal-map-sidebar-open', 'true');
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should persist open state to localStorage', () => {
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.open();
      });

      expect(localStorage.getItem('halal-map-sidebar-open')).toBe('true');
    });
  });

  describe('close', () => {
    it('should set isOpen to false when currently true', () => {
      localStorage.setItem('halal-map-sidebar-open', 'true');
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should keep isOpen as false when already false', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should persist close state to localStorage', () => {
      localStorage.setItem('halal-map-sidebar-open', 'true');
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.close();
      });

      expect(localStorage.getItem('halal-map-sidebar-open')).toBe('false');
    });
  });

  describe('Function Stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useSidebarState());

      const initialToggle = result.current.toggle;
      const initialOpen = result.current.open;
      const initialClose = result.current.close;

      rerender();

      expect(result.current.toggle).toBe(initialToggle);
      expect(result.current.open).toBe(initialOpen);
      expect(result.current.close).toBe(initialClose);
    });
  });

  describe('localStorage Edge Cases', () => {
    it('should handle localStorage.getItem errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage unavailable');
      });

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      localStorage.getItem = originalGetItem;
    });

    it('should handle localStorage.setItem errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage unavailable');
      });

      const { result } = renderHook(() => useSidebarState());

      // Should not throw error
      expect(() => {
        act(() => {
          result.current.toggle();
        });
      }).not.toThrow();

      // State should still update
      expect(result.current.isOpen).toBe(true);

      localStorage.setItem = originalSetItem;
    });
  });

  describe('Integration', () => {
    it('should work with mixed operations', () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });
});
