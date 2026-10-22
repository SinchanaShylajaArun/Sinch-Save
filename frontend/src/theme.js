export const CATEGORY_STYLE = {
  "Rent & utilities": { color: "#4F6B3A", chip: "#DDE8D0" },
  Wifi: { color: "#C2D6A8", chip: "#EEF4E4" },
  Groceries: { color: "#9DB896", chip: "#E4EDE1" },
  Misc: { color: "#EBC97A", chip: "#FDF0D2" },
  "Trips & extras": { color: "#F7C3CF", chip: "#FDE8EE" },
  "Online orders": { color: "#E39A9A", chip: "#FBE1E8" },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_STYLE);

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MON_FULL = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export const money = (n) => {
  const v = Math.abs(n);
  const t = Number.isInteger(v) ? v.toLocaleString("en-US") : v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? "−$" : "$") + t;
};
export const whole = (n) => (n < 0 ? "−$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US");

export function trackingMonths(start = "2026-10") {
  const [y0, m0] = start.split("-").map(Number);
  return Array.from({ length: 12 }, (_, i) => {
    const idx = y0 * 12 + (m0 - 1) + i;
    const y = Math.floor(idx / 12);
    const m = idx % 12;
    return { key: `${y}-${String(m + 1).padStart(2, "0")}`, y, m, label: `${MON_FULL[m]} ${y}`, short: `${MON[m]} ${y}`, abbr: MON[m] };
  });
}

export function currentMonthKey(months) {
  const d = new Date();
  const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return months.some((m) => m.key === k) ? k : months[0].key;
}

export const shortDate = (iso) => {
  const [, m, d] = iso.split("-");
  return `${MON[Number(m) - 1]} ${Number(d)}`;
};

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
