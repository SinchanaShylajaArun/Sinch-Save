import { CATEGORY_STYLE, money } from "../theme";

const capColor = (name) => (name.startsWith("Groceries") ? CATEGORY_STYLE.Groceries.color : name.startsWith("Misc") ? CATEGORY_STYLE.Misc.color : CATEGORY_STYLE["Online orders"].color);

export default function WeeklyCaps({ week }) {
  return (
    <section className="card caps" aria-label="Weekly caps">
      <h2>Weekly caps</h2>
      {(week?.caps || []).map((c) => (
        <div key={c.name} className="cap">
          <div className="cap-row">
            <span className="strong">{c.name}</span>
            <span className={c.over ? "cap-num over" : "cap-num"}>{money(c.spent)} / {money(c.limit)}</span>
          </div>
          <div className="track"><div className="fill" style={{ width: `${Math.min(100, (c.spent / c.limit) * 100)}%`, background: c.over ? "#C2304F" : capColor(c.name) }} /></div>
        </div>
      ))}
      <div className="bills">
        <div className="strong">Monthly bills</div>
        <div className="bill"><span>Rent</span><span className="strong">$617</span></div>
        <div className="bill"><span>Utilities (your share)</span><span className="strong">$20–40</span></div>
        <div className="bill"><span>Wifi</span><span className="strong">$13</span></div>
      </div>
    </section>
  );
}
