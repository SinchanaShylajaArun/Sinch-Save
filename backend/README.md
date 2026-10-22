# Sinch & Save · Backend

FastAPI service that stores transactions and calculates the dashboard numbers.

## Run
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # optional; SQLite is used if DATABASE_URL is unset
alembic upgrade head     # create or update the database tables
python seed.py           # optional: create the demo account
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## Test
```bash
pytest -q
```

## Database migrations
Tables are managed by Alembic, so schema changes are versioned like code.
```bash
# after changing app/models.py
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Auth
- Passwords are hashed with bcrypt; they are never stored as plain text.
- Log in returns a JWT. Send it as `Authorization: Bearer <token>`.
- Every transaction and goal belongs to a user, and each user only sees their own.
- `POST /auth/demo` opens a shared demo account and resets its sample data each time.
- In the docs page, click **Authorize** and paste a token to try the protected endpoints.

## Structure
| Path | Job |
|---|---|
| app/main.py | Creates the app and registers routers |
| app/routers/ | Endpoints: transactions, analytics, goal |
| app/services/analytics.py | All calculations, as pure functions |
| app/schemas.py | Input and output validation |
| app/models.py | Database tables |
| app/config.py | Settings, categories and weekly caps |
| app/security.py | Password hashing, JWT, current-user check |
| app/services/demo.py | Builds the demo account |
| migrations/ | Alembic migration history |

## Endpoints
All endpoints except `/auth/*`, `/health` and `/config` require a token.

| Method | Path | What it does |
|---|---|---|
| POST | /auth/signup | Create an account |
| POST | /auth/login | Log in |
| POST | /auth/demo | Open the demo account |
| GET | /auth/me | Current user |
| POST | /transactions | Log income or an expense |
| GET | /transactions?month=YYYY-MM | List entries |
| DELETE | /transactions/{id} | Delete an entry |
| GET | /analytics/month/{YYYY-MM} | Month totals, categories, weekly bars |
| GET | /analytics/year?start=2026-10 | 12-month recap |
| GET | /analytics/week?on=YYYY-MM-DD | Safe to spend and weekly caps |
| GET / PUT | /goal | Savings goal and terrarium stage |
| GET | /config | Categories and caps |
