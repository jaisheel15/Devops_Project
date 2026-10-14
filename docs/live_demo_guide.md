# Module 10 — Live Demonstration Step-by-Step Guide

This guide provides the exact command sequence and verification steps for the live demonstration required for the DevOps Final Capstone evaluation.

---

## Part 1: Local Stack Demonstration (M1 & M4)
1. **Start the local Docker Compose stack:**
   ```bash
   docker compose up --build -d
   ```
2. **Verify container statuses and healthchecks:**
   ```bash
   docker compose ps
   ```
   *Expected output: `bookverse-db`, `bookverse-backend`, and `bookverse-frontend` all showing `healthy` / `Up`.*
3. **Verify API endpoints via curl:**
   - Health: `curl -s http://localhost:8000/health | jq`
   - Metrics: `curl -s http://localhost:8000/metrics | head -n 20`
   - Books Catalog: `curl -s http://localhost:8000/api/v1/books | jq`
4. **Open Browser:**
   Navigate to `http://localhost:3000` to interact with the BookVerse UI (add a book, edit a title, delete an entry, search).

---

## Part 2: Automated Testing Verification (M2)
Run pytest inside the backend environment:
```bash
cd backend
.venv/bin/pytest -v
```
*Expected output: 9 passed in < 0.3s.*

---

## Part 3: Live CI/CD Pipeline Trigger (M5 & M6)
1. **Make a minor change (e.g., in a comment or version):**
   ```bash
   git commit -am "feat: trigger live demo CI/CD build"
   git push origin main
   ```
2. **Watch GitHub Actions run:**
   - Observe `backend-test` (Pytest) passing.
   - Observe `frontend-build` (Vite compilation) passing.
   - Observe `build-scan-publish` running Trivy security scan and publishing images to GHCR tagged with Git commit SHA `${{ github.sha }}`.

---

## Part 4: Kubernetes & Helm Deployment (M8 & M9)
1. **Deploy via Helm into the `bookverse` namespace:**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   helm upgrade --install bookverse ./helm/bookverse -n bookverse
   ```
2. **Inspect pods and services:**
   ```bash
   kubectl get pods -n bookverse
   kubectl get svc -n bookverse
   kubectl get ingress -n bookverse
   ```
   *Expected: 2 replicas of frontend, 2 replicas of backend, 1 postgres pod, all in `Running` state.*
3. **Observability Verification:**
   - Port-forward backend: `kubectl port-forward -n bookverse svc/bookverse-backend 8000:8000 &`
   - Check metrics: `curl http://localhost:8000/metrics`
