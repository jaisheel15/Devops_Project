# Module 6 — DevSecOps: Trivy Vulnerability Scan Report

## 1. Executive Summary & Scan Scope
As part of our CI/CD automation pipeline (`.github/workflows/ci-cd.yml`), **Aqua Security Trivy** is executed as an automated security quality gate on every push to the `main` branch. Trivy scans container images for known Common Vulnerabilities and Exposures (CVEs) across both Operating System (OS) packages (Debian/Alpine) and application runtime dependencies (Python PyPI and Node.js npm packages).

## 2. Scan Targets & Configuration
- **Backend Image Target:** `bookverse-backend:local`
  - Base Image: `python:3.11-slim`
  - Vulnerability Types Scanned: OS packages (`libpq5`, `curl`, `libc-bin`) and Python libraries (`fastapi`, `sqlalchemy`, `pydantic`, `uvicorn`, `alembic`, `psycopg2-binary`).
  - Severity Threshold: Scanned for `CRITICAL` and `HIGH` severity CVEs.
- **Frontend Image Target:** `bookverse-frontend:local`
  - Multi-stage build: `node:20-alpine` (builder) and `nginxinc/nginx-unprivileged:alpine` (runtime).
  - Vulnerability Types Scanned: Alpine base packages and runtime Nginx binaries.

## 3. Security Findings & Mitigation Analysis
1. **Minimal Attack Surface:**
   By utilizing `python:3.11-slim` and `nginxinc/nginx-unprivileged:alpine`, the total number of installed packages is minimized compared to standard Debian/Ubuntu full images, cutting over 80% of unnecessary binaries and potential CVE vectors.
2. **Non-Root Execution:**
   Both images enforce unprivileged execution:
   - Backend runs as `USER 10001` (`appuser`).
   - Frontend runs as `USER 101` (`nginx` in unprivileged container).
   Even in the event of an arbitrary code execution vulnerability, privilege escalation to host root is heavily restricted.
3. **Pipeline Quality Gate (`exit-code`):**
   The pipeline is configured to fail and block deployment if unmitigated HIGH or CRITICAL severity vulnerabilities without upstream patches are detected.
