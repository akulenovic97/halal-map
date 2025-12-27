import { useFilters } from '../../hooks/useFilters';
import { VenueTypeFilter } from './VenueTypeFilter';

export function FilterBar() {
  const { filters, toggleVenueType, setVenueTypes } = useFilters();

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
