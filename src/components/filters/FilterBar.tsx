import { useFilters } from 'src/hooks/useFilters';
import { VenueTypeFilter } from 'src/components/filters/VenueTypeFilter';
import { useState } from 'react';

export function FilterBar() {
  const { filters, toggleVenueType, setVenueTypes } = useFilters();
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  return (
    <div className="bg-halal-green-50 flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        <span className="text-halal-green-900 text-sm font-medium">
          Filters:
        </span>
        <VenueTypeFilter
          filters={filters}
          onToggleVenueType={toggleVenueType}
          onSetVenueTypes={setVenueTypes}
          isOpen={openFilter === 'venue-type'}
          onOpenChange={open => setOpenFilter(open ? 'venue-type' : null)}
        />
        {/* Future filters will be added here:
            - HalalStatusFilter
            - AlcoholPolicyFilter
            - CuisineFilter
            - PriceRangeFilter
        */}
      </div>
    </div>
  );
}
