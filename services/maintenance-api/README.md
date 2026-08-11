# maintenance-api

Maintenance service for the Demo Device Portal. Serves in-memory
maintenance schedules and service tickets keyed by the same device ids used by
`devices-api` (`poc-0001`..`poc-0008`).

## Port

`3000` (override with `PORT`).

## Routes

| Method | Path                         | Description                              |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/maintenance`               | All device schedules                     |
| GET    | `/maintenance/device/:id`    | Schedule for one device (404 if unknown) |
| GET    | `/tickets`                   | All service tickets                      |
| GET    | `/tickets?deviceId=poc-0003` | Tickets filtered by device               |
| GET    | `/healthz`                   | Liveness -> `{ "status": "ok" }`         |
| GET    | `/ready`                     | Readiness -> `{ "status": "ready" }`     |

## Environment

| Var    | Default | Description      |
| ------ | ------- | ---------------- |
| `PORT` | `3000`  | HTTP listen port |

## Run

```bash
npm install
npm start
```

Logs are emitted as one structured JSON line per request to stdout.
