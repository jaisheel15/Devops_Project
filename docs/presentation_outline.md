# Module 10 — Final Capstone Presentation Outline

## Project: BookVerse — Enterprise Bookstore & Library Platform
**Presenter:** DevOps Capstone Engineer  
**Duration:** 10–12 Minutes

---

## Slide 1: Title & Overview
- **Project Name:** BookVerse
- **Domain:** Enterprise Bookstore & Library Management Platform
- **DevOps Core Pillars:** Containerization, GitOps CI/CD, DevSecOps Quality Gates, Infrastructure as Code (AWS EKS), Kubernetes/Helm Orchestration, and End-to-End Observability.

---

## Slide 2: Application Architecture (M1 & M2)
- **Backend:** FastAPI REST service with health check (`/health`), Prometheus metrics (`/metrics`), and full CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`).
- **Database:** PostgreSQL 16 managed with Alembic schema migrations.
- **Frontend:** Responsive React application with glassmorphic UI, live inventory statistics, and search/filtering.
- **Automated Testing:** 9 automated Pytest test cases using an isolated in-memory test database fixture in `conftest.py` ensuring zero pollution of production DB.

---

## Slide 3: Containerization & Local Development (M4)
- **Multi-Stage Builds:** Node 20 builder stage compiled into an unprivileged Alpine Nginx runtime.
- **Least-Privilege Security:** Non-root users (`appuser` UID 10001 in backend, UID 101 in frontend).
- **Docker Compose:** One-command full-stack bootstrap (`docker compose up --build`) orchestrating DB, Backend, and Frontend with automated health checks.

---

## Slide 4: CI/CD Pipeline & DevSecOps Scanning (M5 & M6)
- **GitHub Actions Automation (`.github/workflows/ci-cd.yml`):**
  1. Automated Pytest quality gate (fails build on any regression).
  2. Frontend build & asset compilation verification.
  3. Trivy automated vulnerability scan for HIGH/CRITICAL CVEs.
  4. Immutable container image publishing to GitHub Container Registry (GHCR) using Git Commit SHA tags.

---

## Slide 5: Cloud Infrastructure as Code with Terraform (M7)
- **AWS Provisioning:**
  - Multi-AZ VPC spanning 2 public and 2 private subnets across availability zones.
  - Internet Gateway and Kubernetes-tagged routing tables.
  - Managed Amazon EKS Cluster (v1.29) with IAM roles, OIDC, and an autoscaling EC2 Node Group (`t3.medium`).
  - Zero hardcoded credentials with `terraform.tfvars.example` and verified `terraform destroy` lifecycle.

---

## Slide 6: Kubernetes Orchestration & Helm (M8)
- **Helm Package (`helm/bookverse`):**
  - Modular `Chart.yaml`, `values.yaml`, and production templates.
  - High availability: 2+ replicas for both backend and frontend deployments.
  - ClusterIP services and Kubernetes Ingress routing `/` to Frontend and `/api` to Backend.
  - Liveness and readiness probes for zero-downtime rolling updates.

---

## Slide 7: Production Observability (M9)
- **Prometheus Scraper:** Backend exposes standard Prometheus metrics at `/metrics`.
- **Grafana Visualization:** Custom dashboard tracking Request Rates (RPS), 95th Percentile Response Latency, 4xx/5xx Error Rates, and Target Health.

---

## Slide 8: Live Demonstration & Q&A
- Walkthrough of live application running in Docker and Kubernetes.
- Commit change to trigger GitHub Actions CI/CD pipeline.
- Verification of Prometheus and Grafana metrics.
