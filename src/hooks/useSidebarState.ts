import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'halal-map-sidebar-open';

export interface UseSidebarStateReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Custom hook to manage sidebar open/closed state with localStorage persistence
 */
export function useSidebarState(): UseSidebarStateReturn {
  // Initialize from localStorage, default to false (collapsed)
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      // localStorage might not be available (SSR, private browsing, etc.)
      return false;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isOpen));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [isOpen]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close,
  };
}
