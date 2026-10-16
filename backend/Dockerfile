# Stage 1: Base & Dependency Installation
FROM python:3.11-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --user -r requirements.txt


# Stage 2: Final Minimal Runtime (Non-Root User)
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/appuser/.local/bin:$PATH

# Install libpq runtime dependency for postgres and upgrade runtime python utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && pip install --no-cache-dir --upgrade setuptools wheel \
    && rm -rf /var/lib/apt/lists/*

# Security: Create non-root dedicated application user (UID 10001)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

# Copy installed python packages from builder
COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local

# Copy application code and Alembic migrations
COPY --chown=appuser:appgroup alembic.ini .
COPY --chown=appuser:appgroup alembic/ ./alembic/
COPY --chown=appuser:appgroup app/ ./app/

# Switch to non-root user
USER 10001

EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
