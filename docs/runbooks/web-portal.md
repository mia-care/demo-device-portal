# Runbook — web-portal

**Service:** `web-portal` · **Port:** 8080 · **Owner:** @mia-care/inogen-field-services

## What it does
React SPA served by nginx. Talks to the BFF via /api.

## Health
- Liveness: `GET /healthz` → `200 {"status":"ok"}`
- Readiness: `GET /ready`

## Common operations
| Symptom | Check | Action |
|---|---|---|
| Pod not Ready | `kubectl logs deploy/web-portal` | verify upstream/env vars, restart pod |
| High latency | request logs (structured JSON) | scale replicas via Console |
| Crash loop | events + logs | roll back to previous deploy revision in Console |

## Escalation
Field Services on-call → Platform team. See incident policy (SOC 2 CC7.3).
