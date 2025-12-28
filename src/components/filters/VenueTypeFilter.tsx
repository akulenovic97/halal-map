import type { VenueType } from 'src/types/venue';
import type { VenueFilters } from 'src/types/filter';
import { Button } from 'src/components/common/Button';
import { Badge } from 'src/components/common/Badge';
import { DropdownMenu } from 'src/components/common/dropdown/DropdownMenu';
import { FilterQuickActions } from 'src/components/common/dropdown/FilterQuickActions';
import { CheckboxOption } from 'src/components/common/dropdown/CheckboxOption';

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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VenueTypeFilter({
  filters,
  onToggleVenueType,
  onSetVenueTypes,
  isOpen,
  onOpenChange,
}: VenueTypeFilterProps) {
  const selectedTypes = filters.venueType || [];
  const selectedCount = selectedTypes.length;
  const allSelected = selectedCount === VENUE_TYPE_OPTIONS.length;

  const handleSelectAll = () => {
    onSetVenueTypes(VENUE_TYPE_OPTIONS.map(option => option.type));
  };

  const handleClearAll = () => {
    onSetVenueTypes([]);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center gap-2"
      >
        Venue Type
        {selectedCount > 0 && (
          <Badge variant="halal">{allSelected ? 'All' : selectedCount}</Badge>
        )}
      </Button>
      <DropdownMenu isOpen={isOpen} onOpenChange={onOpenChange}>
        <FilterQuickActions
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          allSelected={allSelected}
          noneSelected={selectedCount === 0}
        />
        <div className="space-y-1">
          {VENUE_TYPE_OPTIONS.map(option => (
            <CheckboxOption
              key={option.type}
              checked={selectedTypes.includes(option.type)}
              onChange={() => onToggleVenueType(option.type)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      </DropdownMenu>
    </div>
  );
}
