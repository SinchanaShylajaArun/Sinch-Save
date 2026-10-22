from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ALL_CATEGORIES, FIXED_CATEGORIES, WEEKLY_CAPS, settings
from .database import Base, engine
from .routers import analytics, goals, transactions

# Phase 1 creates tables directly. Alembic migrations come in Phase 3.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sinch & Save API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(analytics.router)
app.include_router(goals.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


@app.get("/config", tags=["meta"])
def config():
    """Category and cap rules, so the frontend never hard-codes them."""
    return {
        "categories": sorted(ALL_CATEGORIES),
        "fixed_categories": sorted(FIXED_CATEGORIES),
        "weekly_cap": settings.weekly_cap,
        "weekly_caps": WEEKLY_CAPS,
    }
