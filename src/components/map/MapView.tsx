import { useState, useMemo } from 'react';
import type { Venue } from 'src/types/venue';
import { MapHeader } from 'src/components/map/MapHeader';
import { Map } from 'src/components/map/Map';
import { VenueCard } from 'src/components/map/sidebar/VenueCard';
import { mockVenues } from 'src/data/mockVenues';
import { useFilters } from 'src/hooks/useFilters';
import { filterVenues } from 'src/utils/filterVenues';

export function MapView() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const { filters } = useFilters();

  // Filter venues based on active filters
  const filteredVenues = useMemo(
    () => filterVenues(mockVenues, filters),
    [filters]
  );

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <MapHeader />

      {/* Main Content */}
      <div className="relative flex-1">
        <Map venues={filteredVenues} onMarkerClick={handleMarkerClick} />

        {/* Temporary selected venue display */}
        {selectedVenue && (
          <VenueCard
            selectedVenue={selectedVenue}
            onClose={() => setSelectedVenue(null)}
          />
        )}
      </div>
    </div>
  );
}
