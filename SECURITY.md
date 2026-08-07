# Security Policy

This repository follows the organization's SOC 2 Type II control expectations.

- **Access control (CC6.1):** least-privilege RBAC; branch protection on `main`.
- **Change management (CC8.1):** all changes via pull request with required review (see CODEOWNERS) and passing CI.
- **Vulnerability management (CC7.1):** dependency + filesystem scanning in CI (Trivy).
- **Data classification:** device/patient references are **confidential** and never logged in cleartext.
- **Monitoring (CC7.2):** services emit structured JSON logs; health endpoints exposed for probes.

Report vulnerabilities to security@inogen.example.
