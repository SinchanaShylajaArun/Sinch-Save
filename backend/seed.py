"""Create (or reset) the demo account with sample data. Run after migrations:
    alembic upgrade head
    python seed.py
"""
from app.database import SessionLocal
from app.services.demo import reset_demo

with SessionLocal() as db:
    user = reset_demo(db)
    print(f"Demo account ready ({user.email}). Use 'Try the demo' on the login page.")
