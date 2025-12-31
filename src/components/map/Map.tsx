import { useState, useEffect } from 'react';
import ReactMapGL from 'react-map-gl/maplibre';
import type { ViewState } from 'react-map-gl/maplibre';
import type { Venue } from 'src/types/venue';
import type { MapBounds } from 'src/types/map';
import { VenueMarker } from 'src/components/map/sidebar/VenueMarker';

type MapProps = {
  venues: Venue[];
  onMarkerClick?: (venue: Venue) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
};

// NYC center coordinates
const INITIAL_VIEW_STATE: ViewState = {
  longitude: -73.9712,
  latitude: 40.7831,
  zoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

/**
 * Calculate approximate map bounds from view state
 * Uses the Mercator projection approximation for bounds calculation
 */
function calculateBounds(viewState: ViewState): MapBounds {
  const { latitude, longitude, zoom } = viewState;

  // Calculate the degrees per pixel at this zoom level
  // At zoom 0, 256 pixels = 360 degrees
  const degreesPerPixel = 360 / (256 * Math.pow(2, zoom));

  // Assume a viewport size (this is approximate - in production you'd use actual viewport size)
  // For now, use a standard approximation
  const viewportWidth = 800; // pixels
  const viewportHeight = 600; // pixels

  // Calculate lat/lng offsets
  const lngOffset = (viewportWidth / 2) * degreesPerPixel;
  const latOffset =
    (viewportHeight / 2) *
    degreesPerPixel *
    Math.cos((latitude * Math.PI) / 180);

  return {
    north: latitude + latOffset,
    south: latitude - latOffset,
    east: longitude + lngOffset,
    west: longitude - lngOffset,
  };
}

export function Map({ venues, onMarkerClick, onBoundsChange }: MapProps) {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);

  // Calculate and notify bounds when viewState changes
  useEffect(() => {
    if (onBoundsChange) {
      const bounds = calculateBounds(viewState);
      onBoundsChange(bounds);
    }
  }, [viewState, onBoundsChange]);

  return (
    <div className="h-full w-full">
      <ReactMapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
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
