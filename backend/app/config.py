from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./sinch_and_save.db"
    weekly_cap: float = 80
    savings_goal: float = 4460
    frontend_origin: str = "http://localhost:5173"
    # Change this in production. Generate one with: python -c "import secrets; print(secrets.token_urlsafe(48))"
    jwt_secret: str = "dev-only-change-me"
    jwt_expire_minutes: int = 60 * 24 * 7
    demo_email: str = "demo@sinchandsave.app"


settings = Settings()

# Category rules live in one place so the frontend and analytics agree.
FIXED_CATEGORIES = {"Rent & utilities", "Wifi"}
VARIABLE_CATEGORIES = {"Groceries", "Misc", "Trips & extras", "Online orders"}
ALL_CATEGORIES = FIXED_CATEGORIES | VARIABLE_CATEGORIES

# Weekly caps. One cap can cover several categories.
WEEKLY_CAPS = [
    {"name": "Groceries", "limit": 55, "categories": ["Groceries"]},
    {"name": "Misc", "limit": 15, "categories": ["Misc"]},
    {"name": "Trips & online orders", "limit": 10, "categories": ["Trips & extras", "Online orders"]},
]

# Tracking year shown in the month dropdown (Oct 2026 – Sep 2027).
YEAR_START = "2026-10"
