from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import Goal, Transaction
from ..schemas import GoalOut, GoalUpdate
from ..services import analytics

router = APIRouter(prefix="/goal", tags=["goal"])


def _goal(db: Session) -> Goal:
    goal = db.scalars(select(Goal)).first()
    if not goal:
        goal = Goal(name="Savings jar", target_amount=settings.savings_goal)
        db.add(goal)
        db.commit()
        db.refresh(goal)
    return goal


def _out(goal: Goal, db: Session) -> GoalOut:
    txs = db.scalars(select(Transaction)).all()
    p = analytics.goal_progress(txs, float(goal.target_amount))
    return GoalOut(name=goal.name, target_amount=float(goal.target_amount), **p)


@router.get("", response_model=GoalOut)
def get_goal(db: Session = Depends(get_db)):
    return _out(_goal(db), db)


@router.put("", response_model=GoalOut)
def update_goal(body: GoalUpdate, db: Session = Depends(get_db)):
    goal = _goal(db)
    goal.name = body.name
    goal.target_amount = body.target_amount
    db.commit()
    return _out(goal, db)
