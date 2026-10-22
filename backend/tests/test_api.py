import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
if os.path.exists("test.db"):
    os.remove("test.db")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def add(type_, amount, date, category=None, note=None):
    r = client.post("/transactions", json={"type": type_, "amount": amount, "date": date, "category": category, "note": note})
    assert r.status_code == 201, r.text
    return r.json()


def test_flow():
    add("income", 2777, "2026-10-01", note="Fixed payment")
    add("income", 160, "2026-10-16", note="Shift pay")
    add("expense", 617, "2026-10-01", "Rent & utilities")
    add("expense", 13, "2026-10-01", "Wifi")
    add("expense", 31, "2026-10-13", "Groceries")
    add("expense", 12, "2026-10-15", "Trips & extras")
    online = add("expense", 22, "2026-10-14", "Online orders")

    m = client.get("/analytics/month/2026-10").json()
    assert m["income"] == 2937
    assert m["fixed"] == 630
    assert m["spent"] == 695
    assert m["saved"] == 2242
    assert len(m["weeks"]) == 4

    w = client.get("/analytics/week", params={"on": "2026-10-16"}).json()
    assert w["start"] == "2026-10-12"
    assert w["variable_spent"] == 65
    assert w["safe_to_spend"] == 15
    trips = next(c for c in w["caps"] if c["name"] == "Trips & online orders")
    assert trips["spent"] == 34 and trips["over"] is True

    y = client.get("/analytics/year").json()
    assert len(y["months"]) == 12 and y["months"][0]["month"] == "2026-10"

    g = client.get("/goal").json()
    assert g["saved"] == 2242 and g["percent"] == 50 and g["terrarium_stage"] == 2

    assert client.delete(f"/transactions/{online['id']}").status_code == 204
    assert len(client.get("/transactions", params={"month": "2026-10"}).json()) == 6
    assert client.get("/transactions", params={"month": "2026-11"}).json() == []


def test_validation():
    r = client.post("/transactions", json={"type": "expense", "amount": 5, "date": "2026-10-01", "category": "Shoes"})
    assert r.status_code == 422
    r = client.post("/transactions", json={"type": "income", "amount": -5, "date": "2026-10-01"})
    assert r.status_code == 422


def test_goal_update():
    g = client.put("/goal", json={"name": "Savings jar", "target_amount": 5000}).json()
    assert g["target_amount"] == 5000
