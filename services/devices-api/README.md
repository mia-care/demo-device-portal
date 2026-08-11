# devices-api

Device inventory service for the Demo Device Portal. Serves an
in-memory fleet of ~8 Demo portable oxygen concentrators (POCs). Device ids
(`poc-0001`..`poc-0008`) are shared with `maintenance-api`.

## Port

`3001` (override with `PORT`).

## Routes

| Method | Path            | Description                        |
| ------ | --------------- | ---------------------------------- |
| GET    | `/devices`      | Full fleet list                    |
| GET    | `/devices/:id`  | Single device (404 if unknown)     |
| GET    | `/healthz`      | Liveness -> `{ "status": "ok" }`   |
| GET    | `/ready`        | Readiness -> `{ "status": "ready" }` |

## Environment

| Var    | Default | Description       |
| ------ | ------- | ----------------- |
| `PORT` | `3001`  | HTTP listen port  |

## Run

```bash
npm install
npm start
```

Logs are emitted as one structured JSON line per request to stdout.
