import { NuqsAdapter } from 'nuqs/adapters/react';
import { MapView } from 'src/components/map/MapView';

function App() {
  return (
    <NuqsAdapter>
      <MapView />
    </NuqsAdapter>
  );
}

export default App;
