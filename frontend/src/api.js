const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const KEY = "sinch-and-save-session";

export const session = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  },
  set(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  },
  clear() {
    try { localStorage.removeItem(KEY); } catch {}
  },
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function request(path, options = {}) {
  const token = session.get()?.access_token;
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401 && !path.startsWith("/auth/")) onUnauthorized();
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail)) detail = body.detail.map((d) => d.msg.replace(/^Value error, /, "")).join(", ");
    } catch {}
    throw new Error(detail);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  signup: (name, email, password) => request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  demo: () => request("/auth/demo", { method: "POST" }),
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
