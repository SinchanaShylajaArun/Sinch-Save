from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Transaction, TxType
from ..schemas import TransactionCreate, TransactionOut

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("", response_model=TransactionOut, status_code=201)
def create_transaction(body: TransactionCreate, db: Session = Depends(get_db)):
    tx = Transaction(**body.model_dump())
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.get("", response_model=list[TransactionOut])
def list_transactions(
    month: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}$", description="YYYY-MM"),
    type: TxType | None = None,
    limit: int = Query(default=200, le=1000),
    db: Session = Depends(get_db),
):
    q = select(Transaction)
    if month:
        y, m = map(int, month.split("-"))
        start = date(y, m, 1)
        end = date(y + (m == 12), m % 12 + 1, 1)
        q = q.where(Transaction.date >= start, Transaction.date < end)
    if type:
        q = q.where(Transaction.type == type)
    q = q.order_by(Transaction.date.desc(), Transaction.id.desc()).limit(limit)
    return db.scalars(q).all()


@router.delete("/{tx_id}", status_code=204)
def delete_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.get(Transaction, tx_id)
    if not tx:
        raise HTTPException(404, "Transaction not found")
    db.delete(tx)
    db.commit()
