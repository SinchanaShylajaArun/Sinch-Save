import { money, whole } from "../theme";

export default function SafeToSpend({ week }) {
  if (!week) return <section className="hero skeleton" aria-busy="true" />;
  const pct = Math.min(100, Math.round((week.variable_spent / week.weekly_cap) * 100));
  const safe = week.safe_to_spend;
  const tone = safe < 0 ? "over" : safe < 15 ? "close" : "ok";
  return (
    <section className="hero" aria-label="Safe to spend">
      <svg className="hero-sparkles" width="180" height="120" viewBox="0 0 180 120" aria-hidden="true">
        <path d="M30 20 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#F4D3D8" />
        <path d="M140 14 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#C9DCC3" />
        <path d="M160 86 c0 -6 8 -6 8 0 c0 -6 8 -6 8 0 c0 6 -8 10 -8 14 c0 -4 -8 -8 -8 -14 z" fill="#F4D3D8" />
      </svg>
      <div className="hero-main">
        <div className="hero-label">Safe to spend this week</div>
        <div className={`hero-number ${tone}`}>{whole(safe)}</div>
        <div className="hero-sub">of your {whole(week.weekly_cap)} weekly cap · spent {money(week.variable_spent)} so far</div>
      </div>
      <div className="hero-bar-wrap">
        <div className="hero-track"><div className={`hero-fill ${tone}`} style={{ width: `${pct}%` }} /></div>
        <div className="hero-scale"><span>$0</span><span>{whole(week.weekly_cap)} cap</span></div>
        {week.over_cap && <div className="hero-warn">Over the cap. Pause online orders and treats until Monday.</div>}
      </div>
    </section>
  );
}
