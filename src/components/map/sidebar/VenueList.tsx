import type { Venue } from 'src/types/venue';
import { VenueListItem } from './VenueListItem';

type VenueListProps = {
  venues: Venue[];
  onVenueClick: (venue: Venue) => void;
};

export function VenueList({ venues, onVenueClick }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-gray-500">No venues match your filters</p>
        <p className="mt-2 text-xs text-gray-400">
          Try adjusting your filter settings
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {venues.map(venue => (
        <VenueListItem key={venue.id} venue={venue} onClick={onVenueClick} />
      ))}
    </div>
  );
}
