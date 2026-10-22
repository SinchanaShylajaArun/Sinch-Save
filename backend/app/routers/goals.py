from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import Goal, Transaction, User
from ..schemas import GoalOut, GoalUpdate
from ..security import current_user
from ..services import analytics

router = APIRouter(prefix="/goal", tags=["goal"])


def _goal(db: Session, user: User) -> Goal:
    goal = db.scalars(select(Goal).where(Goal.user_id == user.id)).first()
    if not goal:
        goal = Goal(user_id=user.id, name="Savings jar", target_amount=settings.savings_goal)
        db.add(goal)
        db.commit()
        db.refresh(goal)
    return goal


def _out(goal: Goal, user: User, db: Session) -> GoalOut:
    txs = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    p = analytics.goal_progress(txs, float(goal.target_amount))
    return GoalOut(name=goal.name, target_amount=float(goal.target_amount), **p)


@router.get("", response_model=GoalOut)
def get_goal(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return _out(_goal(db, user), user, db)


@router.put("", response_model=GoalOut)
def update_goal(body: GoalUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    goal = _goal(db, user)
    goal.name = body.name
    goal.target_amount = body.target_amount
    db.commit()
    return _out(goal, user, db)
