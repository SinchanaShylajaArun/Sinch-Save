import { CATEGORY_ORDER, CATEGORY_STYLE, whole } from "../theme";

export default function CategoryDonut({ byCategory, spent }) {
  const C = 2 * Math.PI * 60;
  let acc = 0;
  const segs = CATEGORY_ORDER.map((name) => {
    const amt = byCategory?.[name] || 0;
    const len = spent > 0 ? (amt / spent) * C : 0;
    const s = { name, amt, len, offset: -acc, color: CATEGORY_STYLE[name].color };
    acc += len;
    return s;
  });
  return (
    <section className="card chart" aria-label="Spending by category">
      <h2>Where it went</h2>
      <div className="donut-wrap">
        <svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="Donut chart of spending by category">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#F8E1DC" strokeWidth="24" />
          {segs.map((s) => s.len > 0 && (
            <circle key={s.name} cx="80" cy="80" r="60" fill="none" stroke={s.color} strokeWidth="24" strokeDasharray={`${s.len} ${C - s.len}`} strokeDashoffset={s.offset} transform="rotate(-90 80 80)" />
          ))}
          <text x="80" y="80" textAnchor="middle" fontSize="20" fill="#3E4A3C" fontFamily="DM Serif Display, Georgia, serif">{whole(spent)}</text>
          <text x="80" y="99" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6B6466">spent</text>
        </svg>
        <ul className="legend-list">
          {segs.map((s) => (
            <li key={s.name}><span><i style={{ background: s.color }} />{s.name}</span><strong>{whole(s.amt)}</strong></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
