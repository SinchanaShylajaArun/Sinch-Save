import { whole } from "../theme";

const Icon = ({ bg, stroke, d }) => (
  <div className="icon-dot" style={{ background: bg }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  </div>
);

export default function SummaryCards({ report, week, period, count }) {
  const r = report || { income: 0, spent: 0, fixed: 0, variable: 0, saved: 0, savings_rate: 0 };
  return (
    <section className="summary" aria-label="Summary">
      <div className="card stat">
        <Icon bg="#E4EDE1" stroke="#4F6E4B" d="M12 19V5M5 12l7-7 7 7" />
        <div className="stat-label">Earned in {period}</div>
        <div className="stat-value ink">{whole(r.income)}</div>
        <div className="stat-sub">{count} payments logged</div>
      </div>
      <div className="card stat">
        <Icon bg="#FBE1E8" stroke="#B4456A" d="M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0" />
        <div className="stat-label">Spent in {period}</div>
        <div className="stat-value rose">{whole(r.spent)}</div>
        <div className="stat-sub">{whole(r.fixed)} bills · {whole(r.variable)} everything else</div>
      </div>
      <div className="card stat">
        <Icon bg="#E4EDE1" stroke="#4F6E4B" d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        <div className="stat-label">Saved in {period}</div>
        <div className="stat-value sage">{whole(r.saved)}</div>
        <div className="stat-sub">That's {r.savings_rate}% of what you earned</div>
      </div>
      <div className="card stat">
        <Icon bg="#FBE1E8" stroke="#B4456A" d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
        <div className="stat-label">Saved this week</div>
        <div className="stat-value ink">{week ? whole(week.saved_this_week) : "—"}</div>
        <div className="stat-sub">earned minus spent, this week</div>
      </div>
    </section>
  );
}
