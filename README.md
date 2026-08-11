# Demo Device Portal

A field-service portal for managing the maintenance lifecycle of **Demo medical devices**: fleet inventory, filter & sieve-bed replacement schedules, battery health, and service tickets.

> This repository simulates a **customer-side application** to be imported into the **Mia-Platform Console (IDP)**. It is a monorepo containing service source, container definitions, Kubernetes manifests, and a Mia-Platform **import descriptor**.

## Architecture

```
                 ┌────────────────┐
 browser  ──────▶│   web-portal   │  React SPA (nginx :3000)
                 └───────┬────────┘
                         │ /api
                 ┌───────▼────────┐
                 │      bff       │  Backend-for-Frontend (Express :3000)
                 └───┬────────┬───┘
                     │        │
        ┌────────────▼─┐   ┌──▼───────────────┐
        │ devices-api  │   │ maintenance-api  │  Express :3000 / :3000
        └──────────────┘   └──────────────────┘
```

| Service | Type | Port | Data classification | Public |
|---|---|---|---|---|
| `web-portal` | frontend (React) | 3000 | internal | ✅ |
| `bff` | backend (Express) | 3000 | internal | ✅ (`/api`) |
| `devices-api` | backend (Express) | 3000 | confidential (PII) | ❌ internal |
| `maintenance-api` | backend (Express) | 3000 | confidential (PII) | ❌ internal |

## Repository layout

```
.
├── mia-import.yaml          # ← Mia-Platform IDP import descriptor (the import contract)
├── services/
│   ├── web-portal/          # React + Vite SPA, served by nginx
│   ├── bff/                 # aggregates devices-api + maintenance-api
│   ├── devices-api/         # POC fleet inventory
│   └── maintenance-api/     # schedules + service tickets
├── k8s/
│   ├── base/                # per-service Deployment + Service
│   └── overlays/{dev,prod}/ # kustomize overlays
├── docs/runbooks/           # per-service operational runbooks
└── .github/workflows/ci.yaml
```

## Importing into Mia-Platform IDP

The [`mia-import.yaml`](./mia-import.yaml) descriptor at the repo root is the contract the **import Playbook** consumes. It declares the project metadata, the target template, environments, and every service (with the container port, endpoints, resources, and compliance signals such as data classification and ownership). The same file is ingested by the **Mia-Platform Catalog** GitHub connector to populate catalog items and drive compliance **Scorecards** (e.g. SOC 2 Type II).

## Local development

```bash
# each service
cd services/<service> && npm install && npm start   # or `npm run dev` for web-portal
```

## Deploy (Kubernetes / AKS)

```bash
kubectl apply -k k8s/overlays/dev    # or overlays/prod
```

In the Mia-Platform demo this is driven by the Console (IDP) deploy pipeline rather than a raw `kubectl apply`.
