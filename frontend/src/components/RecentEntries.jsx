import { CATEGORY_STYLE, money, shortDate } from "../theme";

export default function RecentEntries({ items, onDelete }) {
  return (
    <section className="card" aria-label="Recent entries">
      <h2>Recent entries</h2>
      {items.length === 0 ? (
        <p className="muted">Nothing logged for this period yet. Add your first entry with “Jot it down.”</p>
      ) : (
        <div className="scroll-x">
          <ul className="entries">
            {items.map((t) => {
              const inc = t.type === "income";
              return (
                <li key={t.id} className="entry">
                  <span className="muted strong small">{shortDate(t.date)}</span>
                  <span className="entry-note">{t.note || (inc ? "Income" : t.category)}</span>
                  <span className="pill" style={{ background: inc ? "#E4EDE1" : CATEGORY_STYLE[t.category]?.chip }}>{inc ? "Income" : t.category}</span>
                  <span className="entry-amt">{inc ? "+" : "−"}{money(t.amount)}</span>
                  <button type="button" className="icon-btn" aria-label={`Delete ${t.note || "entry"}`} onClick={() => onDelete(t.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
