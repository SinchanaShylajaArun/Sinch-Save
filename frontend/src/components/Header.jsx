export default function Header({ months, value, onChange, weekLabel }) {
  return (
    <header className="header">
      <div>
        <h1 className="brand">
          Sinch <span className="amp">&amp;</span> Save
        </h1>
        <p className="muted">{weekLabel} · you're doing lovely</p>
      </div>
      <div className="month-pick">
        <label htmlFor="monthPick" className="small-label">Showing</label>
        <div className="select-wrap">
          <select id="monthPick" value={value} onChange={(e) => onChange(e.target.value)}>
            {months.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
            <option value="year">YEAR RECAP</option>
          </select>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>
    </header>
  );
}
