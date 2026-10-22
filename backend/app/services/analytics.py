"""Pure functions that turn a list of transactions into dashboard numbers.

Kept free of database code so they are easy to unit test.
"""
import calendar
from collections import defaultdict
from datetime import date, timedelta

from ..config import FIXED_CATEGORIES, WEEKLY_CAPS


def _amt(t) -> float:
    return float(t.amount)


def _is_income(t) -> bool:
    return getattr(t.type, "value", t.type) == "income"


def totals(txs) -> dict:
    income = sum(_amt(t) for t in txs if _is_income(t))
    expenses = [t for t in txs if not _is_income(t)]
    spent = sum(_amt(t) for t in expenses)
    fixed = sum(_amt(t) for t in expenses if t.category in FIXED_CATEGORIES)
    saved = income - spent
    by_cat = defaultdict(float)
    for t in expenses:
        by_cat[t.category] += _amt(t)
    return {
        "income": round(income, 2),
        "spent": round(spent, 2),
        "fixed": round(fixed, 2),
        "variable": round(spent - fixed, 2),
        "saved": round(saved, 2),
        "savings_rate": round(saved / income * 100) if income > 0 else 0,
        "by_category": {k: round(v, 2) for k, v in sorted(by_cat.items())},
    }


def month_report(txs, year: int, month: int) -> dict:
    days = calendar.monthrange(year, month)[1]
    in_month = [t for t in txs if t.date.year == year and t.date.month == month]
    weeks = []
    for a, b in [(1, 7), (8, 14), (15, 21), (22, days)]:
        tt = totals([t for t in in_month if a <= t.date.day <= b])
        weeks.append({"label": f"{calendar.month_abbr[month]} {a}–{b}", "income": tt["income"], "spent": tt["spent"]})
    return {"month": f"{year}-{month:02d}", **totals(in_month), "weeks": weeks}


def _add_months(y: int, m: int, n: int) -> tuple[int, int]:
    idx = y * 12 + (m - 1) + n
    return idx // 12, idx % 12 + 1


def year_report(txs, start_year: int, start_month: int) -> dict:
    months = []
    for i in range(12):
        y, m = _add_months(start_year, start_month, i)
        r = month_report(txs, y, m)
        months.append({"month": r["month"], "label": calendar.month_abbr[m], "income": r["income"], "spent": r["spent"], "saved": r["saved"]})
    first = date(start_year, start_month, 1)
    ly, lm = _add_months(start_year, start_month, 11)
    last = date(ly, lm, calendar.monthrange(ly, lm)[1])
    in_year = [t for t in txs if first <= t.date <= last]
    return {"start": first.isoformat(), "end": last.isoformat(), **totals(in_year), "months": months}


def week_report(txs, today: date, weekly_cap: float) -> dict:
    start = today - timedelta(days=today.weekday())  # Monday
    end = start + timedelta(days=6)
    in_week = [t for t in txs if start <= t.date <= end]
    variable = [t for t in in_week if not _is_income(t) and t.category not in FIXED_CATEGORIES]
    spent = sum(_amt(t) for t in variable)
    caps = []
    for cap in WEEKLY_CAPS:
        s = sum(_amt(t) for t in variable if t.category in cap["categories"])
        caps.append({"name": cap["name"], "limit": cap["limit"], "spent": round(s, 2), "over": s > cap["limit"]})
    return {
        "start": start.isoformat(),
        "end": end.isoformat(),
        "weekly_cap": weekly_cap,
        "variable_spent": round(spent, 2),
        "safe_to_spend": round(weekly_cap - spent, 2),
        "over_cap": spent > weekly_cap,
        "saved_this_week": totals(in_week)["saved"],
        "caps": caps,
    }


def terrarium_stage(percent: int) -> int:
    """0 = soil only, 1 = sprout, 2 = leaves, 3 = bud, 4 = flowers."""
    for stage, threshold in ((4, 100), (3, 70), (2, 40), (1, 10)):
        if percent >= threshold:
            return stage
    return 0


def goal_progress(txs, target: float) -> dict:
    saved = totals(txs)["saved"]
    pct = max(0, min(100, round(saved / target * 100))) if target > 0 else 0
    return {"saved": saved, "percent": pct, "remaining": round(max(0, target - saved), 2), "terrarium_stage": terrarium_stage(pct)}
