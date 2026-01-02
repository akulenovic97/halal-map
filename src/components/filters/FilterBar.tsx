import { useFilters } from 'src/hooks/useFilters';
import { GenericFilter } from 'src/components/filters/GenericFilter';
import { FILTER_CONFIGS } from 'src/config/filterConfig';
import { useState } from 'react';

export function FilterBar() {
  const { filters, toggleFilter, setFilter } = useFilters();
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  return (
    <div className="bg-halal-green-50 flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        <span className="text-halal-green-900 text-sm font-medium">
          Filters:
        </span>
        <GenericFilter
          config={FILTER_CONFIGS.venueType}
          filters={filters}
          onToggle={value => toggleFilter('venueType', value)}
          onSetValues={values => setFilter('venueType', values)}
          isOpen={openFilter === 'venueType'}
          onOpenChange={open => setOpenFilter(open ? 'venueType' : null)}
        />
        <GenericFilter
          config={FILTER_CONFIGS.halalStatus}
          filters={filters}
          onToggle={value => toggleFilter('halalStatus', value)}
          onSetValues={values => setFilter('halalStatus', values)}
          isOpen={openFilter === 'halalStatus'}
          onOpenChange={open => setOpenFilter(open ? 'halalStatus' : null)}
        />
        <GenericFilter
          config={FILTER_CONFIGS.alcoholPolicy}
          filters={filters}
          onToggle={value => toggleFilter('alcoholPolicy', value)}
          onSetValues={values => setFilter('alcoholPolicy', values)}
          isOpen={openFilter === 'alcoholPolicy'}
          onOpenChange={open => setOpenFilter(open ? 'alcoholPolicy' : null)}
        />
      </div>
    </div>
  );
}
