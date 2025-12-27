import { useState, useRef, useEffect } from 'react';
import type { VenueType } from 'src/types/venue';
import type { VenueFilters } from 'src/types/filter';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const VENUE_TYPE_OPTIONS: Array<{
  type: VenueType;
  label: string;
  icon: string;
}> = [
  { type: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { type: 'cafe', label: 'Cafe', icon: '☕' },
  { type: 'bakery', label: 'Bakery', icon: '🥐' },
];

type VenueTypeFilterProps = {
  filters: VenueFilters;
  onToggleVenueType: (type: VenueType) => void;
  onSetVenueTypes: (types: VenueType[]) => void;
};

export function VenueTypeFilter({
  filters,
  onToggleVenueType,
  onSetVenueTypes,
}: VenueTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTypes = filters.venueType || [];
  const selectedCount = selectedTypes.length;
  const allSelected = selectedCount === VENUE_TYPE_OPTIONS.length;

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const handleSelectAll = () => {
    onSetVenueTypes(VENUE_TYPE_OPTIONS.map(option => option.type));
  };

  const handleClearAll = () => {
    onSetVenueTypes([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Filter by venue type. ${selectedCount} ${selectedCount === 1 ? 'type' : 'types'} selected`}
      >
        <span>Venue Type</span>
        {selectedCount > 0 && (
          <Badge variant="halal">{allSelected ? 'All' : selectedCount}</Badge>
        )}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div
          className="absolute left-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg"
          role="menu"
          aria-label="Venue type options"
        >
          <div className="p-2">
            {/* Quick Actions */}
            <div className="mb-2 flex gap-2 border-b border-gray-200 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={allSelected}
                className="text-halal-green-700 hover:bg-halal-green-50 flex-1 text-xs disabled:opacity-50"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={selectedCount === 0}
                className="flex-1 text-xs disabled:opacity-50"
              >
                Clear All
              </Button>
            </div>

            {/* Checkboxes */}
            <div className="space-y-1" role="group" aria-label="Venue types">
              {VENUE_TYPE_OPTIONS.map(option => {
                const isChecked = selectedTypes.includes(option.type);

                return (
                  <label
                    key={option.type}
                    className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleVenueType(option.type)}
                      className="text-halal-green-600 focus:ring-halal-green-600 h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-offset-0"
                      aria-label={`${option.label} ${isChecked ? 'selected' : 'not selected'}`}
                    />
                    <span className="text-lg" aria-hidden="true">
                      {option.icon}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
