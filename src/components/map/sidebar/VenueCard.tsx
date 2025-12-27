import { Badge } from 'src/components/common/Badge';
import { Button } from 'src/components/common/Button';
import { Card } from 'src/components/common/Card';
import type { Venue } from 'src/types/venue';

type VenueCardProps = {
    selectedVenue: Venue;
    onClose: () => void;
}

export function VenueCard({ selectedVenue, onClose }: VenueCardProps) {
    return (
      <Card position="absolute">
        <h3 className="font-bold text-lg mb-2">{selectedVenue.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{selectedVenue.address}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="halal">{selectedVenue.halalStatus}</Badge>
          <Badge variant="info">{selectedVenue.venueType}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </Card>
    );
}