# Runbook — devices-api

**Service:** `devices-api` · **Port:** 3000 · **Owner:** @mia-care/device-portal-team

## What it does
POC fleet inventory. Holds device + patient reference data (confidential).

## Health
- Liveness: `GET /healthz` → `200 {"status":"ok"}`
- Readiness: `GET /ready`

## Common operations
| Symptom | Check | Action |
|---|---|---|
| Pod not Ready | `kubectl logs deploy/devices-api` | verify upstream/env vars, restart pod |
| High latency | request logs (structured JSON) | scale replicas via Console |
| Crash loop | events + logs | roll back to previous deploy revision in Console |

## Escalation
Field Services on-call → Platform team. See incident policy (SOC 2 CC7.3).
