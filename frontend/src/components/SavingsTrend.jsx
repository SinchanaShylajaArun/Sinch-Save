import { whole } from "../theme";

// points: [{ value }] evenly spaced across the period
export default function SavingsTrend({ points, totalSteps, goal, startLabel, endLabel }) {
  const g = goal || 1;
  const steps = Math.max(1, totalSteps - 1);
  const xy = points.map((p, i) => [40 + (i / steps) * 580, 190 - Math.max(0, Math.min(1, p / g)) * 170]);
  const last = xy[xy.length - 1] || [40, 190];
  return (
    <section className="card" aria-label="Savings over time">
      <div className="card-head">
        <h2>Watching it grow</h2>
        <span className="muted small">Dotted line = jar goal</span>
      </div>
      <svg viewBox="0 0 640 220" role="img" aria-label="Line chart of cumulative savings against the goal">
        <line x1="40" y1="20" x2="620" y2="20" stroke="#EBB2B0" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
        <text x="620" y="13" textAnchor="end" fontSize="12" fontWeight="700" fill="#9E4F63">{whole(goal || 0)}</text>
        <line x1="40" y1="190" x2="620" y2="190" stroke="#F5E1DD" strokeWidth="2" strokeLinecap="round" />
        {xy.length > 1 && <polyline points={xy.map((p) => p.join(",")).join(" ")} fill="none" stroke="#4F6E4B" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />}
        <circle cx={last[0]} cy={last[1]} r="8" fill="#FFF" stroke="#4F6E4B" strokeWidth="4" />
        <text x="40" y="210" fontSize="13" fontWeight="700" fill="#6B6466">{startLabel}</text>
        <text x="620" y="210" textAnchor="end" fontSize="13" fontWeight="700" fill="#6B6466">{endLabel}</text>
      </svg>
    </section>
  );
}
