import { useEffect } from 'react';
import type { Venue } from 'src/types/venue';
import { VenueList } from './VenueList';

type VenueListSidebarProps = {
  venues: Venue[];
  onVenueClick: (venue: Venue) => void;
  isOpen: boolean;
  onToggle: () => void;
};

// Simple chevron icons using SVG
function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function VenueListSidebar({
  venues,
  onVenueClick,
  isOpen,
  onToggle,
}: VenueListSidebarProps) {
  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  return (
    <div
      className={`fixed z-20 transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${/* Mobile: bottom sheet */ ''} right-0 bottom-0 left-0 h-[60vh] rounded-t-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'} ${/* Desktop: right sidebar - override mobile styles */ ''} md:top-[156px] md:right-0 md:bottom-0 md:left-auto md:h-auto md:w-80 md:translate-y-0 md:rounded-none ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'} `}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        aria-label={isOpen ? 'Close venue list' : 'Open venue list'}
        className={`focus:ring-halal-green-500 absolute z-10 border border-gray-200 bg-white px-3 py-2 shadow-lg transition-colors hover:bg-gray-50 focus:ring-2 focus:outline-none ${/* Desktop positioning */ ''} md:top-4 md:left-0 md:-translate-x-full md:rounded-l-lg ${/* Mobile positioning */ ''} -top-10 left-1/2 -translate-x-1/2 rounded-lg`}
      >
        <span className="hidden md:block">
          {isOpen ? <ChevronRight /> : <ChevronLeft />}
        </span>
        <span className="block md:hidden">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
        </span>
      </button>

      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <h2 className="font-bold text-gray-900">Venues ({venues.length})</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          {venues.length === 0
            ? 'No venues to display'
            : venues.length === 1
              ? '1 venue nearby'
              : `${venues.length} venues nearby`}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-hidden">
        <VenueList venues={venues} onVenueClick={onVenueClick} />
      </div>
    </div>
  );
}
