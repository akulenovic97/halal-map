import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock react-map-gl to render children without actual map
vi.mock('react-map-gl/maplibre', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, ...props }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-map', ...props },
      children
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Marker: ({ children, onClick, ...props }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-marker', onClick, ...props },
      children
    ),
}));

// Mock window.matchMedia (used by some libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Environment variables are set in vitest.config.ts via define option
