'use strict';

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const DEVICES_API_URL = process.env.DEVICES_API_URL || 'http://devices-api';
const MAINTENANCE_API_URL =
  process.env.MAINTENANCE_API_URL || 'http://maintenance-api';

function log(level, msg, extra = {}) {
  process.stdout.write(
    JSON.stringify({ ts: new Date().toISOString(), level, msg, ...extra }) + '\n'
  );
}

// Fetch JSON from an upstream. On failure returns `fallback` and logs a
// warning so the demo portal still renders with partial data.
async function fetchJson(url, fallback) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) {
      log('warn', 'upstream non-2xx', { url, status: res.status });
      return fallback;
    }
    return await res.json();
  } catch (err) {
    log('warn', 'upstream unreachable', { url, error: String(err) });
    return fallback;
  }
}

app.use((req, res, next) => {
  res.on('finish', () => {
    log('info', 'request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

// Readiness pings both upstreams; 200 only when both are healthy, else 503.
app.get('/ready', async (_req, res) => {
  const check = async (base) => {
    try {
      const r = await fetch(`${base}/healthz`, { signal: AbortSignal.timeout(3000) });
      return r.ok;
    } catch {
      return false;
    }
  };
  const [devicesOk, maintenanceOk] = await Promise.all([
    check(DEVICES_API_URL),
    check(MAINTENANCE_API_URL),
  ]);
  const ready = devicesOk && maintenanceOk;
  res
    .status(ready ? 200 : 503)
    .json({ status: ready ? 'ready' : 'not-ready', devicesOk, maintenanceOk });
});

// GET /api/fleet -> devices enriched with schedule + open ticket count.
app.get('/api/fleet', async (_req, res) => {
  const [devices, schedules, tickets] = await Promise.all([
    fetchJson(`${DEVICES_API_URL}/devices`, []),
    fetchJson(`${MAINTENANCE_API_URL}/maintenance`, []),
    fetchJson(`${MAINTENANCE_API_URL}/tickets`, []),
  ]);

  const scheduleByDevice = new Map(schedules.map((s) => [s.deviceId, s]));
  const openTicketsByDevice = new Map();
  for (const t of tickets) {
    if (t.status !== 'closed') {
      openTicketsByDevice.set(t.deviceId, (openTicketsByDevice.get(t.deviceId) || 0) + 1);
    }
  }

  const fleet = devices.map((d) => ({
    ...d,
    schedule: scheduleByDevice.get(d.id) || null,
    openTicketCount: openTicketsByDevice.get(d.id) || 0,
  }));

  res.json(fleet);
});

// GET /api/devices/:id -> device + full schedule + its tickets.
app.get('/api/devices/:id', async (req, res) => {
  const { id } = req.params;
  const [device, schedule, tickets] = await Promise.all([
    fetchJson(`${DEVICES_API_URL}/devices/${encodeURIComponent(id)}`, null),
    fetchJson(`${MAINTENANCE_API_URL}/maintenance/device/${encodeURIComponent(id)}`, null),
    fetchJson(`${MAINTENANCE_API_URL}/tickets?deviceId=${encodeURIComponent(id)}`, []),
  ]);

  if (!device) {
    return res.status(404).json({ error: 'device not found', id });
  }

  res.json({ ...device, schedule, tickets });
});

// GET /api/tickets -> passthrough to maintenance tickets.
app.get('/api/tickets', async (req, res) => {
  const qs = req.query.deviceId
    ? `?deviceId=${encodeURIComponent(req.query.deviceId)}`
    : '';
  const tickets = await fetchJson(`${MAINTENANCE_API_URL}/tickets${qs}`, []);
  res.json(tickets);
});

// GET /api/summary -> fleet KPIs.
app.get('/api/summary', async (_req, res) => {
  const [devices, tickets] = await Promise.all([
    fetchJson(`${DEVICES_API_URL}/devices`, []),
    fetchJson(`${MAINTENANCE_API_URL}/tickets`, []),
  ]);

  const totalDevices = devices.length;
  const maintenanceDue = devices.filter((d) => d.status === 'maintenance-due').length;
  const openTickets = tickets.filter((t) => t.status !== 'closed').length;
  const avgBatteryHealthPct = totalDevices
    ? Math.round(
        devices.reduce((sum, d) => sum + (d.batteryHealthPct || 0), 0) / totalDevices
      )
    : 0;

  res.json({ totalDevices, maintenanceDue, openTickets, avgBatteryHealthPct });
});

const server = app.listen(PORT, () => {
  log('info', 'bff listening', {
    port: PORT,
    devicesApi: DEVICES_API_URL,
    maintenanceApi: MAINTENANCE_API_URL,
  });
});

function shutdown(signal) {
  log('info', 'shutting down', { signal });
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
