import { useState } from "react";
import { whole } from "../theme";

const JAR = "M70 44 H150 V50 C150 58 182 62 182 84 V178 C182 194 170 204 154 204 H66 C50 204 38 194 38 178 V84 C38 62 70 58 70 50 Z";

const Flower = ({ x, y, r, a, b }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} cx="0" cy={-r - 1} fill={a} />
    <circle r={r} cx={r + 1} cy="0" fill={b} />
    <circle r={r} cx="0" cy={r + 1} fill={a} />
    <circle r={r} cx={-r - 1} cy="0" fill={b} />
    <circle r={r * 0.7} fill="#EBDDAF" />
  </g>
);

export default function TerrariumJar({ goal, onChangeGoal }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const stage = goal?.terrarium_stage ?? 0;
  const pct = goal?.percent ?? 0;

  const save = async () => {
    const v = parseFloat(draft);
    if (v > 0) await onChangeGoal(v);
    setEditing(false);
  };

  return (
    <section className="card jar-card" aria-label="Savings jar">
      <svg viewBox="0 0 220 230" width="220" height="230" role="img" aria-label={`Terrarium savings jar, ${pct} percent full`}>
        <defs><clipPath id="terraInside"><path d={JAR} /></clipPath></defs>
        <ellipse cx="110" cy="214" rx="70" ry="6" fill="#F2CBCB" opacity="0.6" />
        <path d={JAR} fill="#FFFFFF" fillOpacity="0.75" />
        <g clipPath="url(#terraInside)">
          <path d="M30 176 C70 166 150 166 190 176 V220 H30 Z" fill="#D9C3B0" />
          <path d="M30 190 C70 184 150 184 190 190 V220 H30 Z" fill="#CBB29C" />
          <circle cx="70" cy="188" r="4" fill="#FFF" opacity="0.7" /><circle cx="128" cy="194" r="3" fill="#FFF" opacity="0.7" /><circle cx="152" cy="186" r="4" fill="#FFF" opacity="0.7" />
          {stage >= 1 && (
            <g className="grow">
              <path d="M108 172 C108 164 106 158 102 154" fill="none" stroke="#7A9874" strokeWidth="3" strokeLinecap="round" />
              <path d="M104 160 C94 158 90 150 92 146 C100 148 104 154 104 160 Z" fill="#9DB897" />
              <path d="M108 162 C116 160 120 154 118 150 C112 152 108 156 108 162 Z" fill="#BFD6B8" />
            </g>
          )}
          {stage >= 2 && (
            <g className="grow">
              <path d="M80 172 C80 150 78 134 74 120" fill="none" stroke="#7A9874" strokeWidth="3" strokeLinecap="round" />
              <path d="M76 138 C60 132 56 120 58 114 C70 116 76 126 76 138 Z" fill="#9DB897" />
              <path d="M78 152 C92 146 98 136 96 128 C84 130 78 140 78 152 Z" fill="#BFD6B8" />
            </g>
          )}
          {stage >= 3 && (
            <g className="grow">
              <path d="M136 172 C136 142 140 118 146 102" fill="none" stroke="#7A9874" strokeWidth="3" strokeLinecap="round" />
              <path d="M138 142 C154 136 160 124 156 116 C144 120 138 130 138 142 Z" fill="#9DB897" />
              <path d="M139 126 C126 122 122 112 124 106 C134 108 139 116 139 126 Z" fill="#BFD6B8" />
              {stage < 4 && <circle cx="146" cy="98" r="6" fill="#F4C7C0" />}
            </g>
          )}
          {stage >= 4 && (
            <g className="grow">
              <Flower x={146} y={94} r={8} a="#F4C7C0" b="#E39A9A" />
              <Flower x={74} y={114} r={7} a="#F7D9D4" b="#F4C7C0" />
              <path d="M164 172 C164 158 166 148 170 140" fill="none" stroke="#7A9874" strokeWidth="2.5" strokeLinecap="round" />
              <Flower x={170} y={136} r={5} a="#E39A9A" b="#E39A9A" />
            </g>
          )}
        </g>
        <path d={JAR} fill="none" stroke="#B9CFB3" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M50 102 C46 130 46 160 50 180" fill="none" stroke="#FFF" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <rect x="66" y="24" width="88" height="22" rx="9" fill="#9DB897" />
        <path d="M74 32 H146 M74 39 H146" stroke="#FFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
        <path d="M150 50 C170 48 178 56 182 66" fill="none" stroke="#E39A9A" strokeWidth="1.8" strokeLinecap="round" />
        <g transform="rotate(12 192 86)">
          <path d="M176 68 H210 V106 H176 L170 87 Z" fill="#F7D9D4" />
          <circle cx="177" cy="87" r="2.8" fill="#FFF" />
          <text x="194" y="92" textAnchor="middle" fontSize="13" fill="#9E4F63" fontFamily="DM Serif Display, Georgia, serif">{pct}%</text>
        </g>
      </svg>
      <div className="jar-text">
        <h2>My savings jar</h2>
        <div className="jar-amount">{goal ? whole(goal.saved) : "—"}</div>
        {editing ? (
          <div className="goal-edit">
            <label htmlFor="goalInput" className="field-label">New goal ($)</label>
            <div className="goal-row">
              <input id="goalInput" type="number" min="1" inputMode="decimal" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="button" className="btn primary" onClick={save}>Save goal</button>
              <button type="button" className="btn ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="muted">
            of a {goal ? whole(goal.target_amount) : "—"} goal · {goal ? whole(goal.remaining) : "—"} more to fill it.{" "}
            <button type="button" className="link-btn" onClick={() => { setDraft(goal?.target_amount ?? ""); setEditing(true); }}>Change goal</button>
          </p>
        )}
        <p className="muted">Every dollar you save helps your little garden grow: a sprout at 10%, leaves at 40%, a bud at 70% and flowers at 100%.</p>
      </div>
    </section>
  );
}
