# Sinch & Save · Backend

FastAPI service that stores transactions and calculates the dashboard numbers.

## Run
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # optional; SQLite is used if DATABASE_URL is unset
python seed.py           # optional sample data
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## Test
```bash
pytest -q
```

## Structure
| Path | Job |
|---|---|
| app/main.py | Creates the app and registers routers |
| app/routers/ | Endpoints: transactions, analytics, goal |
| app/services/analytics.py | All calculations, as pure functions |
| app/schemas.py | Input and output validation |
| app/models.py | Database tables |
| app/config.py | Settings, categories and weekly caps |

## Endpoints
| Method | Path | What it does |
|---|---|---|
| POST | /transactions | Log income or an expense |
| GET | /transactions?month=YYYY-MM | List entries |
| DELETE | /transactions/{id} | Delete an entry |
| GET | /analytics/month/{YYYY-MM} | Month totals, categories, weekly bars |
| GET | /analytics/year?start=2026-10 | 12-month recap |
| GET | /analytics/week?on=YYYY-MM-DD | Safe to spend and weekly caps |
| GET / PUT | /goal | Savings goal and terrarium stage |
| GET | /config | Categories and caps |
