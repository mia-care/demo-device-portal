# bff

Backend-for-frontend for the Demo Device Portal. Aggregates
`devices-api` and `maintenance-api` into portal-shaped responses under `/api`.
Uses the global `fetch` (Node 20). Degrades gracefully: if an upstream is down
it logs a warning and returns partial data so the demo still renders. The
container is designed to run with a read-only root filesystem (no runtime
writes).

## Port

`3000` (override with `PORT`).

## Routes

| Method | Path                 | Description                                              |
| ------ | -------------------- | -------------------------------------------------------- |
| GET    | `/api/fleet`         | Devices enriched with schedule + open ticket count       |
| GET    | `/api/devices/:id`   | Device + full schedule + its tickets (404 if unknown)    |
| GET    | `/api/tickets`       | Passthrough to maintenance tickets (`?deviceId=` filter) |
| GET    | `/api/summary`       | KPIs: totalDevices, maintenanceDue, openTickets, avgBatteryHealthPct |
| GET    | `/healthz`           | Liveness -> `{ "status": "ok" }`                         |
| GET    | `/ready`             | 200 only when both upstreams healthy, else 503           |

## Environment

| Var                   | Default                       | Description                 |
| --------------------- | ----------------------------- | --------------------------- |
| `PORT`                | `3000`                        | HTTP listen port            |
| `DEVICES_API_URL`     | `http://devices-api:3001`     | devices-api base URL        |
| `MAINTENANCE_API_URL` | `http://maintenance-api:3002` | maintenance-api base URL    |

## Run

```bash
npm install
npm start
```

Logs are emitted as one structured JSON line per request to stdout.
