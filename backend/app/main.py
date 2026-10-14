import time
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

from app.config import settings
from app.database import Base, engine
from app.routes.health import router as health_router
from app.routes.books import router as books_router

# Prometheus Metrics Definition
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP Requests",
    ["method", "endpoint", "http_status"],
)

REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP Request Latency in seconds",
    ["method", "endpoint"],
)

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe table creation check
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        pass
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready REST API for BookVerse Bookstore & Library Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def prometheus_metrics_middleware(request: Request, call_next):
    start_time = time.time()
    method = request.method
    endpoint = request.url.path

    # Process request
    response = await call_next(request)

    # Record metrics (skip metrics endpoint itself to prevent loop inflation)
    if endpoint != "/metrics":
        duration = time.time() - start_time
        REQUEST_COUNT.labels(
            method=method,
            endpoint=endpoint,
            http_status=response.status_code,
        ).inc()
        REQUEST_LATENCY.labels(method=method, endpoint=endpoint).observe(duration)

    return response


# Include application routers
app.include_router(health_router)
app.include_router(books_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to BookVerse API",
        "documentation": "/docs",
        "health": "/health",
        "metrics": "/metrics",
    }


@app.get("/metrics", tags=["Observability"])
def metrics():
    """Prometheus metrics endpoint returning scrapeable metrics."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

