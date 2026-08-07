import { useEffect, useState } from 'react';
import { api, type DeviceDetail as DeviceDetailData } from '../api/client';
import StatusBadge from './StatusBadge';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export default function DeviceDetail({
  deviceId,
  onBack,
}: {
  deviceId: string;
  onBack: () => void;
}) {
  const [device, setDevice] = useState<DeviceDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDevice(null);
    setError(null);
    api
      .device(deviceId)
      .then((d) => {
        if (!cancelled) setDevice(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  return (
    <>
      <button className="breadcrumb" onClick={onBack}>
        ← Back to fleet
      </button>

      {error && <div className="state-msg error">Failed to load device: {error}</div>}
      {!error && !device && <div className="state-msg">Loading device…</div>}

      {device && (
        <>
          <div className="detail-header">
            <h2>{device.model}</h2>
            <span className="serial">
              {device.id} · SN {device.serial}
            </span>
            <StatusBadge status={device.status} />
          </div>

          <div className="panel">
            <div className="meta-grid">
              <Meta label="Firmware" value={device.firmware} />
              <Meta label="Region" value={device.region} />
              <Meta label="Patient ref" value={device.patientRef} />
              <Meta label="Purchase date" value={formatDate(device.purchaseDate)} />
              <Meta label="Battery health" value={`${device.batteryHealthPct}%`} />
              <Meta
                label="Sieve bed hours"
                value={device.sieveBedHours.toLocaleString()}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">Maintenance schedule</div>
            {device.schedule ? (
              <div className="meta-grid">
                <Meta
                  label="Next filter replacement"
                  value={formatDate(device.schedule.nextFilterReplacement)}
                />
                <Meta
                  label="Next sieve-bed service"
                  value={formatDate(device.schedule.nextSieveBedService)}
                />
                <Meta
                  label="Last serviced"
                  value={formatDate(device.schedule.lastServicedAt)}
                />
                <Meta
                  label="Interval"
                  value={`${device.schedule.intervalDays} days`}
                />
              </div>
            ) : (
              <div className="empty">No schedule available for this device.</div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">Service tickets</div>
            {device.tickets.length === 0 ? (
              <div className="empty">No tickets for this device.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Opened</th>
                      <th>Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {device.tickets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.type}</td>
                        <td>
                          <span className={`pill priority-${t.priority}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>{t.status}</td>
                        <td>{formatDate(t.openedAt)}</td>
                        <td>{t.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <div className="meta-label">{label}</div>
      <div className="meta-value">{value}</div>
    </div>
  );
}
