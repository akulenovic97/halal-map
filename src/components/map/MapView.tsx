import { useState, useMemo } from 'react';
import type { Venue } from 'src/types/venue';
import { MapHeader } from 'src/components/map/MapHeader';
import { Map } from 'src/components/map/Map';
import { VenueCard } from 'src/components/map/sidebar/VenueCard';
import { VenueListSidebar } from 'src/components/map/sidebar/VenueListSidebar';
import { mockVenues } from 'src/data/mockVenues';
import { useFilters } from 'src/hooks/useFilters';
import { useSidebarState } from 'src/hooks/useSidebarState';
import { useMapBounds } from 'src/hooks/useMapBounds';
import { filterVenues } from 'src/utils/filterVenues';
import { filterVenuesByViewport } from 'src/utils/filterVenuesByViewport';

export function MapView() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const { filters } = useFilters();
  const { isOpen, toggle } = useSidebarState();
  const { bounds, updateBounds } = useMapBounds(null, 500);

  // Filter venues based on active type/halal/etc filters
  const typeFilteredVenues = useMemo(
    () => filterVenues(mockVenues, filters),
    [filters]
  );

  // Further filter by viewport for sidebar (with 20% padding)
  const viewportFilteredVenues = useMemo(
    () => filterVenuesByViewport(typeFilteredVenues, bounds, 0.2),
    [typeFilteredVenues, bounds]
  );

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <MapHeader />

      {/* Main Content */}
      <div className="relative flex-1">
        {/* Map shows all type-filtered markers */}
        <Map
          venues={typeFilteredVenues}
          onMarkerClick={handleMarkerClick}
          onBoundsChange={updateBounds}
        />

        {/* Temporary selected venue display */}
        {selectedVenue && (
          <VenueCard
            selectedVenue={selectedVenue}
            onClose={() => setSelectedVenue(null)}
          />
        )}

        {/* Venue list sidebar shows only viewport-filtered venues */}
        <VenueListSidebar
          venues={viewportFilteredVenues}
          onVenueClick={handleMarkerClick}
          isOpen={isOpen}
          onToggle={toggle}
        />
      </div>
    </div>
  );
}
