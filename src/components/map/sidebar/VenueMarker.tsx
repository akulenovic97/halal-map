import { Marker } from 'react-map-gl/mapbox';
import type { Venue } from 'src/types/venue';

type VenueMarkerProps = {
  venue: Venue;
  onClick: () => void;
};

export function VenueMarker({ venue, onClick }: VenueMarkerProps) {
  // Color based on halal status
  const getMarkerColor = () => {
    switch (venue.halalStatus) {
      case 'fully-halal':
        return 'bg-halal-green-600 hover:bg-halal-green-700';
      case 'partially-halal':
        return 'bg-halal-gold-500 hover:bg-halal-gold-600';
      case 'halal-friendly':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Marker
      longitude={venue.coordinates.lng}
      latitude={venue.coordinates.lat}
      anchor="bottom"
      onClick={e => {
        // Handle both Mapbox events (with originalEvent) and regular events (tests)
        e.originalEvent?.stopPropagation();
        onClick();
      }}
    >
      <button
        className={` ${getMarkerColor()} flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl`}
        aria-label={`View details for ${venue.name}`}
      >
        <span className="text-xs font-bold text-white">
          {venue.venueType === 'cafe' ? '☕' : '🍽️'}
        </span>
      </button>
    </Marker>
  );
}
