from datetime import date

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import YEAR_START, settings
from ..database import get_db
from ..models import Transaction, User
from ..security import current_user
from ..services import analytics

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _mine(db: Session, user: User):
    return db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()


@router.get("/month/{month}")
def month(month: str = Path(pattern=r"^\d{4}-\d{2}$"), user: User = Depends(current_user), db: Session = Depends(get_db)):
    y, m = map(int, month.split("-"))
    return analytics.month_report(_mine(db, user), y, m)


@router.get("/year")
def year(start: str = Query(default=YEAR_START, pattern=r"^\d{4}-\d{2}$"), user: User = Depends(current_user), db: Session = Depends(get_db)):
    y, m = map(int, start.split("-"))
    return analytics.year_report(_mine(db, user), y, m)


@router.get("/week")
def week(on: date | None = None, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return analytics.week_report(_mine(db, user), on or date.today(), settings.weekly_cap)
