import { whole } from "../theme";

export default function EarnedSpentChart({ groups, compact }) {
  const max = Math.max(500, ...groups.map((g) => Math.max(g.income, g.spent)));
  const n = groups.length || 1;
  const gw = 560 / n;
  const bw = Math.min(44, gw * 0.36);
  return (
    <section className="card chart wide" aria-label="Earned vs spent">
      <div className="card-head">
        <h2>Earned vs spent</h2>
        <div className="legend"><span><i style={{ background: "#3E4A3C" }} />Earned</span><span><i style={{ background: "#F1BDB6" }} />Spent</span></div>
      </div>
      <svg viewBox="0 0 640 250" role="img" aria-label="Bar chart of income and spending">
        <line x1="40" y1="210" x2="620" y2="210" stroke="#F5E1DD" strokeWidth="2" strokeLinecap="round" />
        {groups.map((g, i) => {
          const x = 50 + i * gw + (gw - 2 * bw - 6) / 2;
          const h1 = Math.max(4, (g.income / max) * 170);
          const h2 = Math.max(4, (g.spent / max) * 170);
          const rx = Math.min(14, bw / 3);
          return (
            <g key={g.label}>
              <rect x={x} y={210 - h1} width={bw} height={h1} rx={rx} fill="#3E4A3C" />
              <rect x={x + bw + 6} y={210 - h2} width={bw} height={h2} rx={rx} fill="#F1BDB6" />
              <text x={x + bw + 3} y="234" textAnchor="middle" fontSize={compact ? 12 : 14} fontWeight="700" fill="#3E4A3C">{g.label}</text>
              {!compact && <text x={x + bw / 2} y={203 - h1} textAnchor="middle" fontSize="12" fontWeight="700" fill="#6B6466">{whole(g.income)}</text>}
              {!compact && <text x={x + bw * 1.5 + 6} y={203 - h2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#6B6466">{whole(g.spent)}</text>}
            </g>
          );
        })}
      </svg>
    </section>
  );
}
