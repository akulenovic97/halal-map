import { FilterBar } from '../filters/FilterBar';

export function MapHeader() {
  return (
    <header className="bg-halal-green-600 shadow-lg">
      <div className="p-4 text-black">
        <h1 className="text-2xl font-bold">Halal Map NYC</h1>
        <p className="text-halal-green-50 text-sm">
          Discover halal restaurants and cafes in New York City
        </p>
      </div>
      <FilterBar />
    </header>
  );
}
