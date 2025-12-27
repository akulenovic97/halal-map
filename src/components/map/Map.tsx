import { useState } from 'react';
import ReactMapGL from 'react-map-gl/mapbox';
import type { ViewState } from 'react-map-gl/mapbox';
import type { Venue } from 'src/types/venue';
import { VenueMarker } from 'src/components/map/sidebar/VenueMarker';

type MapProps = {
  venues: Venue[];
  onMarkerClick?: (venue: Venue) => void;
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// NYC center coordinates
const INITIAL_VIEW_STATE: ViewState = {
  longitude: -73.9712,
  latitude: 40.7831,
  zoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

export function Map({ venues, onMarkerClick }: MapProps) {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);

  return (
    <div className="h-full w-full">
      <ReactMapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {venues.map(venue => (
          <VenueMarker
            key={venue.id}
            venue={venue}
            onClick={() => onMarkerClick?.(venue)}
          />
        ))}
      </ReactMapGL>
    </div>
  );
}
