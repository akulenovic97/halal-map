import { useState } from 'react';
import type { Venue } from 'src/types/venue';
import { MapHeader } from 'src/components/map/MapHeader';
import { Map } from 'src/components/map/Map';
import { VenueCard } from 'src/components/map/sidebar/VenueCard';
import { mockVenues } from 'src/data/mockVenues';

export function MapView() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <MapHeader />

      {/* Main Content */}
      <div className="relative flex-1">
        <Map venues={mockVenues} onMarkerClick={handleMarkerClick} />

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
