from datetime import date

from pydantic import BaseModel, ConfigDict, Field, model_validator

from .config import ALL_CATEGORIES
from .models import TxType


class TransactionCreate(BaseModel):
    type: TxType
    amount: float = Field(gt=0, le=1_000_000)
    date: date
    category: str | None = None
    note: str | None = Field(default=None, max_length=200)

    @model_validator(mode="after")
    def check_category(self):
        if self.type == TxType.expense:
            if self.category not in ALL_CATEGORIES:
                raise ValueError(f"Expense category must be one of: {sorted(ALL_CATEGORIES)}")
        else:
            self.category = None
        return self


class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: TxType
    amount: float
    date: date
    category: str | None
    note: str | None


class GoalUpdate(BaseModel):
    name: str = Field(default="Savings jar", max_length=80)
    target_amount: float = Field(gt=0)


class GoalOut(BaseModel):
    name: str
    target_amount: float
    saved: float
    percent: int
    remaining: float
    terrarium_stage: int  # 0 = soil, 1 sprout, 2 leaves, 3 bud, 4 flowers
