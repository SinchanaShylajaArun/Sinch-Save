"""Builds the recruiter demo account with realistic data relative to today,
so the demo always looks current."""
from datetime import date, timedelta

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from ..config import settings  # noqa: F401
from ..models import Goal, Transaction, TxType, User
from ..security import hash_password


def _month_start(d: date, back: int) -> date:
    idx = d.year * 12 + d.month - 1 - back
    return date(idx // 12, idx % 12 + 1, 1)


def _sample(today: date) -> list[tuple]:
    rows = []
    for back in (2, 1, 0):
        start = _month_start(today, back)
        def on(day: int) -> date:
            return start + timedelta(days=day - 1)
        rows += [
            ("income", 2777 if back != 1 else 693, on(1), None, "Fixed payment" if back != 1 else "Shift pay (month)"),
            ("expense", 617, on(1), "Rent & utilities", "Rent"),
            ("expense", 31 + back * 4, on(1), "Rent & utilities", "Utilities share"),
            ("expense", 13, on(1), "Wifi", "Wifi"),
        ]
        for i, day in enumerate((2, 9, 16, 23)):
            rows.append(("income", 160, on(day), None, "Shift pay"))
            rows.append(("expense", 46 + (i * 7 + back * 3) % 12, on(min(day + 2, 28)), "Groceries", "Weekly groceries"))
        rows += [
            ("expense", 9, on(6), "Misc", "Laundry"),
            ("expense", 22 - back * 5, on(8), "Online orders", "Phone case" if back == 0 else "Desk lamp"),
            ("expense", 12, on(15), "Trips & extras", "Movie ticket"),
            ("expense", 6, on(14), "Misc", "Coffee"),
        ]
    # A little activity in the current week so "safe to spend" is not empty.
    monday = today - timedelta(days=today.weekday())
    rows += [
        ("expense", 28, monday, "Groceries", "Groceries"),
        ("expense", 7, today, "Misc", "Coffee with a friend"),
    ]
    return [r for r in rows if r[2] <= today]


def reset_demo(db: Session, today: date | None = None) -> User:
    today = today or date.today()
    user = db.scalars(select(User).where(User.email == settings.demo_email)).first()
    if user is None:
        user = User(name="Demo", email=settings.demo_email, password_hash=hash_password("demo-no-login"), is_demo=True)
        db.add(user)
        db.flush()
    db.execute(delete(Transaction).where(Transaction.user_id == user.id))
    db.execute(delete(Goal).where(Goal.user_id == user.id))
    for t, amt, d, cat, note in _sample(today):
        db.add(Transaction(user_id=user.id, type=TxType(t), amount=amt, date=d, category=cat, note=note))
    # A larger goal than the default so the demo jar shows a plant mid-growth.
    db.add(Goal(user_id=user.id, name="Savings jar", target_amount=7500))
    db.commit()
    db.refresh(user)
    return user
