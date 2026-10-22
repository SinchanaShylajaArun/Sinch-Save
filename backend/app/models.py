import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class TxType(str, enum.Enum):
    income = "income"
    expense = "expense"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[TxType] = mapped_column(Enum(TxType), index=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    date: Mapped[date] = mapped_column(Date, index=True)
    # Expenses use one of the configured categories; income uses None.
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    note: Mapped[str | None] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), default="Savings jar")
    target_amount: Mapped[float] = mapped_column(Numeric(10, 2))
