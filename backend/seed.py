"""Load the sample October data from the design. Run: python seed.py"""
from datetime import date

from app.database import Base, SessionLocal, engine
from app.models import Transaction, TxType

Base.metadata.create_all(bind=engine)

SAMPLE = [
    ("income", 2777, "2026-10-01", None, "Fixed payment"),
    ("income", 160, "2026-10-02", None, "Shift pay"),
    ("income", 160, "2026-10-09", None, "Shift pay"),
    ("income", 160, "2026-10-16", None, "Shift pay"),
    ("expense", 617, "2026-10-01", "Rent & utilities", "October rent"),
    ("expense", 32, "2026-10-01", "Rent & utilities", "Utilities share"),
    ("expense", 13, "2026-10-01", "Wifi", "Wifi"),
    ("expense", 48, "2026-10-04", "Groceries", "Weekly groceries"),
    ("expense", 9, "2026-10-06", "Misc", "Laundry"),
    ("expense", 22, "2026-10-08", "Online orders", "Phone case"),
    ("expense", 52, "2026-10-11", "Groceries", "Weekly groceries"),
    ("expense", 31, "2026-10-13", "Groceries", "Groceries top-up"),
    ("expense", 6, "2026-10-14", "Misc", "Coffee"),
    ("expense", 12, "2026-10-15", "Trips & extras", "Movie ticket"),
]

with SessionLocal() as db:
    if db.query(Transaction).count():
        print("Database already has data; skipping seed.")
    else:
        for t, amt, d, cat, note in SAMPLE:
            db.add(Transaction(type=TxType(t), amount=amt, date=date.fromisoformat(d), category=cat, note=note))
        db.commit()
        print(f"Seeded {len(SAMPLE)} transactions.")
