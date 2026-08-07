import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DeviceDetail from './components/DeviceDetail';

// Minimal state-based routing: either the dashboard or a device detail view.
export default function App() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="container">
        {selectedDeviceId ? (
          <DeviceDetail
            deviceId={selectedDeviceId}
            onBack={() => setSelectedDeviceId(null)}
          />
        ) : (
          <Dashboard onSelectDevice={setSelectedDeviceId} />
        )}
      </main>
    </>
  );
}
