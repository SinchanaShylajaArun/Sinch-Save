const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail)) detail = body.detail.map((d) => d.msg).join(", ");
    } catch {}
    throw new Error(detail);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  config: () => request("/config"),
  month: (m) => request(`/analytics/month/${m}`),
  year: () => request("/analytics/year"),
  week: () => request("/analytics/week"),
  goal: () => request("/goal"),
  updateGoal: (target) => request("/goal", { method: "PUT", body: JSON.stringify({ name: "Savings jar", target_amount: target }) }),
  transactions: (month) => request(`/transactions?limit=1000${month ? `&month=${month}` : ""}`),
  addTransaction: (tx) => request("/transactions", { method: "POST", body: JSON.stringify(tx) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),
};
