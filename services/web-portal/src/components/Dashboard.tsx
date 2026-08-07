import { useEffect, useState } from 'react';
import { api, type FleetDevice, type Summary } from '../api/client';
import StatusBadge from './StatusBadge';
import BatteryBar from './BatteryBar';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export default function Dashboard({
  onSelectDevice,
}: {
  onSelectDevice: (id: string) => void;
}) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [fleet, setFleet] = useState<FleetDevice[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    Promise.all([api.summary(), api.fleet()])
      .then(([s, f]) => {
        if (cancelled) return;
        setSummary(s);
        setFleet(f);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="state-msg error">Failed to load dashboard: {error}</div>;
  }
  if (!summary || !fleet) {
    return <div className="state-msg">Loading fleet…</div>;
  }

  const kpis = [
    { label: 'Total devices', value: summary.totalDevices },
    { label: 'Maintenance due', value: summary.maintenanceDue },
    { label: 'Open tickets', value: summary.openTickets },
    { label: 'Avg battery health', value: `${summary.avgBatteryHealthPct}%` },
  ];

  return (
    <>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">Fleet</div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Status</th>
                <th>Battery</th>
                <th>Next filter</th>
                <th>Open tickets</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((d) => (
                <tr
                  key={d.id}
                  className="clickable"
                  onClick={() => onSelectDevice(d.id)}
                >
                  <td>
                    <div>{d.model}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {d.id}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <BatteryBar pct={d.batteryHealthPct} />
                  </td>
                  <td>{formatDate(d.schedule?.nextFilterReplacement)}</td>
                  <td>{d.openTicketCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
