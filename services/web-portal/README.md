# web-portal

Single-page app (Vite + React + TypeScript) for the Demo Device Maintenance
Portal. Built to static files and served by nginx as a non-root user on port
`8080`. Talks to the BFF via `/api` (nginx proxies `/api` -> `bff:3000`).

## Port

`8080` (nginx).

## Views

- **Dashboard** — KPI cards (`/api/summary`) and a fleet table (`/api/fleet`);
  click a row to open the device detail.
- **Device detail** — header (serial/model/firmware/status), maintenance
  schedule panel, and service tickets list (`/api/devices/:id`).

## Runtime configuration

The BFF base URL is read from `window.__ENV__?.BFF_BASE_URL`, defaulting to
`/api`. In the container, nginx proxies `/api` to the BFF, so no override is
needed for the standard deployment.

## nginx endpoints

- `/api/*` -> proxied to `http://bff:3000`
- `/healthz`, `/ready` -> return `200`
- everything else -> SPA fallback to `index.html`

## Develop

```bash
npm install
npm run dev     # Vite dev server, proxies /api to http://localhost:3000
```

## Build

```bash
npm ci
npm run build   # type-check + emit static assets to dist/
```
