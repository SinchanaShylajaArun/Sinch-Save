import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
if os.path.exists("test.db"):
    os.remove("test.db")

from fastapi.testclient import TestClient  # noqa: E402

from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402

Base.metadata.create_all(bind=engine)
client = TestClient(app)


def signup(email, name="Test"):
    r = client.post("/auth/signup", json={"name": name, "email": email, "password": "password123"})
    assert r.status_code == 201, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def add(h, type_, amount, date, category=None, note=None):
    r = client.post("/transactions", headers=h, json={"type": type_, "amount": amount, "date": date, "category": category, "note": note})
    assert r.status_code == 201, r.text
    return r.json()


def test_requires_login():
    assert client.get("/transactions").status_code == 401
    assert client.get("/goal", headers={"Authorization": "Bearer nonsense"}).status_code == 401


def test_flow():
    h = signup("flow@example.com")
    add(h, "income", 2777, "2026-10-01", note="Fixed payment")
    add(h, "income", 160, "2026-10-16", note="Shift pay")
    add(h, "expense", 617, "2026-10-01", "Rent & utilities")
    add(h, "expense", 13, "2026-10-01", "Wifi")
    add(h, "expense", 31, "2026-10-13", "Groceries")
    add(h, "expense", 12, "2026-10-15", "Trips & extras")
    online = add(h, "expense", 22, "2026-10-14", "Online orders")

    m = client.get("/analytics/month/2026-10", headers=h).json()
    assert (m["income"], m["fixed"], m["spent"], m["saved"]) == (2937, 630, 695, 2242)

    w = client.get("/analytics/week", headers=h, params={"on": "2026-10-16"}).json()
    assert w["start"] == "2026-10-12" and w["variable_spent"] == 65 and w["safe_to_spend"] == 15
    trips = next(c for c in w["caps"] if c["name"] == "Trips & online orders")
    assert trips["spent"] == 34 and trips["over"] is True

    y = client.get("/analytics/year", headers=h).json()
    assert len(y["months"]) == 12 and y["months"][0]["month"] == "2026-10"

    g = client.get("/goal", headers=h).json()
    assert g["saved"] == 2242 and g["percent"] == 50 and g["terrarium_stage"] == 2

    assert client.delete(f"/transactions/{online['id']}", headers=h).status_code == 204
    assert len(client.get("/transactions", headers=h, params={"month": "2026-10"}).json()) == 6


def test_users_are_isolated():
    a = signup("a@example.com")
    b = signup("b@example.com")
    tx = add(a, "expense", 40, "2026-10-05", "Groceries")
    assert client.get("/transactions", headers=b).json() == []
    assert client.delete(f"/transactions/{tx['id']}", headers=b).status_code == 404
    assert client.get("/goal", headers=b).json()["saved"] == 0


def test_signup_and_login_rules():
    signup("dupe@example.com")
    r = client.post("/auth/signup", json={"name": "X", "email": "DUPE@example.com", "password": "password123"})
    assert r.status_code == 409
    assert client.post("/auth/signup", json={"name": "X", "email": "short@example.com", "password": "short"}).status_code == 422
    assert client.post("/auth/login", json={"email": "dupe@example.com", "password": "wrongpass"}).status_code == 401
    r = client.post("/auth/login", json={"email": "Dupe@Example.com", "password": "password123"})
    assert r.status_code == 200 and r.json()["user"]["email"] == "dupe@example.com"


def test_demo_resets_and_cannot_password_login():
    r = client.post("/auth/demo").json()
    h = {"Authorization": f"Bearer {r['access_token']}"}
    assert r["user"]["is_demo"] is True
    n = len(client.get("/transactions", headers=h).json())
    assert n > 0
    add(h, "expense", 999, "2026-10-01", "Misc")
    client.post("/auth/demo")
    assert len(client.get("/transactions", headers=h).json()) == n
    assert client.post("/auth/login", json={"email": r["user"]["email"], "password": "demo-no-login"}).status_code == 401


def test_validation():
    h = signup("val@example.com")
    r = client.post("/transactions", headers=h, json={"type": "expense", "amount": 5, "date": "2026-10-01", "category": "Shoes"})
    assert r.status_code == 422
    r = client.post("/transactions", headers=h, json={"type": "income", "amount": -5, "date": "2026-10-01"})
    assert r.status_code == 422
