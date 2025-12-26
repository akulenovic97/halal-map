import { useState } from 'react';
import { Map } from './components/map/Map';
import { mockVenues } from './data/mockVenues';
import type { Venue } from './types/venue';

function App() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
    console.log('Venue clicked:', venue.name);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="bg-halal-green-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Halal Map NYC</h1>
        <p className="text-sm text-halal-green-50">
          Discover halal restaurants and cafes in New York City
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        <Map venues={mockVenues} onMarkerClick={handleMarkerClick} />

        {/* Temporary selected venue display */}
        {selectedVenue && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl max-w-sm">
            <h3 className="font-bold text-lg mb-2">{selectedVenue.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedVenue.address}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-halal-green-100 text-halal-green-800 px-2 py-1 rounded">
                {selectedVenue.halalStatus}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {selectedVenue.venueType}
              </span>
            </div>
            <button
              onClick={() => setSelectedVenue(null)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
