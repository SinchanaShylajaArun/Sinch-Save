import { useState } from "react";
import { CATEGORY_STYLE, todayISO } from "../theme";

export default function EntryForm({ categories, onAdd }) {
  const [mode, setMode] = useState("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState("Groceries");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isExp = mode === "expense";

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!(amt > 0) || !date) return setError("Enter an amount above $0 and a date.");
    setBusy(true);
    setError("");
    try {
      await onAdd({ type: mode, amount: amt, date, category: isExp ? category : null, note: note || (isExp ? null : "Income") });
      setAmount("");
      setNote("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card form" aria-label="Log an entry">
      <h2>Jot it down</h2>
      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={isExp} className={isExp ? "tab on" : "tab"} onClick={() => setMode("expense")}>Spent</button>
        <button type="button" role="tab" aria-selected={!isExp} className={!isExp ? "tab on" : "tab"} onClick={() => setMode("income")}>Earned</button>
      </div>
      <div className="two">
        <div className="field">
          <label htmlFor="amt" className="field-label">Amount ($)</label>
          <input id="amt" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="dt" className="field-label">{isExp ? "Date spent" : "Date received"}</label>
          <input id="dt" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      {isExp && (
        <div className="field">
          <div className="field-label">Category</div>
          <div className="chips">
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} className={category === c ? "chip on" : "chip"} style={category === c ? undefined : { background: CATEGORY_STYLE[c]?.chip }} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}
      <div className="field">
        <label htmlFor="note" className="field-label">{isExp ? "Note (optional)" : "Source (optional)"}</label>
        <input id="note" type="text" maxLength={200} placeholder={isExp ? "e.g. Weekly groceries" : "e.g. Shift pay"} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {isExp && category === "Online orders" && <div className="tip">Little reminder: leave it in the cart for 48 hours. Still love it? Then log it.</div>}
      <button type="button" className="btn primary big" disabled={busy} onClick={submit}>{busy ? "Saving…" : isExp ? "Add to spending" : "Add to earnings"}</button>
      {error && <div className="error" role="alert">{error}</div>}
    </section>
  );
}
