import type { Venue } from 'src/types/venue';
import { Badge } from 'src/components/common/Badge';

// Default placeholder image for venues without photos
const DEFAULT_VENUE_IMAGE =
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop';

type VenueListItemProps = {
  venue: Venue;
  onClick: (venue: Venue) => void;
};

// Format halal status for display
const formatHalalStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'fully-halal': 'Fully Halal',
    'partially-halal': 'Partially Halal',
    'halal-friendly': 'Halal Friendly',
  };
  return statusMap[status] || status;
};

// Format venue type for display
const formatVenueType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function VenueListItem({ venue, onClick }: VenueListItemProps) {
  const photo = venue.photos?.[0] || DEFAULT_VENUE_IMAGE;

  return (
    <div
      className="hover:bg-halal-green-50 flex cursor-pointer gap-3 border-b p-3 transition-colors"
      onClick={() => onClick(venue)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(venue);
        }
      }}
    >
      {/* Photo */}
      <img
        src={photo}
        alt={venue.name}
        className="h-16 w-16 flex-shrink-0 rounded object-cover"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <h3 className="truncate text-sm font-bold">{venue.name}</h3>

        {/* Address */}
        <p className="truncate text-xs text-gray-600">{venue.address}</p>

        {/* Badges */}
        <div className="mt-1 flex gap-1">
          <Badge variant="halal">{formatHalalStatus(venue.halalStatus)}</Badge>
          <Badge variant="info">{formatVenueType(venue.venueType)}</Badge>
        </div>

        {/* Cuisine & Price */}
        <div className="mt-1 flex items-center justify-between">
          <span className="truncate text-xs text-gray-500">
            {venue.cuisine.join(', ')}
          </span>
          <span className="text-halal-gold-600 ml-2 flex-shrink-0 text-xs font-bold">
            {'$'.repeat(venue.priceRange)}
          </span>
        </div>
      </div>
    </div>
  );
}
