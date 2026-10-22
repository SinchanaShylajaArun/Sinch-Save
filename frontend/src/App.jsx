import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { currentMonthKey, shortDate, todayISO, trackingMonths } from "./theme";
import Header from "./components/Header";
import SafeToSpend from "./components/SafeToSpend";
import SummaryCards from "./components/SummaryCards";
import TerrariumJar from "./components/TerrariumJar";
import EntryForm from "./components/EntryForm";
import WeeklyCaps from "./components/WeeklyCaps";
import EarnedSpentChart from "./components/EarnedSpentChart";
import CategoryDonut from "./components/CategoryDonut";
import SavingsTrend from "./components/SavingsTrend";
import RecentEntries from "./components/RecentEntries";

const months = trackingMonths("2026-10");

function cumulativeUpTo(all, iso) {
  return all.reduce((acc, t) => (t.date <= iso ? acc + (t.type === "income" ? t.amount : -t.amount) : acc), 0);
}

export default function App() {
  const [period, setPeriod] = useState(currentMonthKey(months));
  const [config, setConfig] = useState(null);
  const [report, setReport] = useState(null);
  const [week, setWeek] = useState(null);
  const [goal, setGoal] = useState(null);
  const [all, setAll] = useState([]);
  const [error, setError] = useState("");

  const isYear = period === "year";
  const monthInfo = months.find((m) => m.key === period) || months[0];

  const load = useCallback(async () => {
    try {
      const [cfg, rep, wk, gl, txs] = await Promise.all([
        config ? Promise.resolve(config) : api.config(),
        isYear ? api.year() : api.month(period),
        api.week(),
        api.goal(),
        api.transactions(),
      ]);
      setConfig(cfg);
      setReport(rep);
      setWeek(wk);
      setGoal(gl);
      setAll(txs);
      setError("");
    } catch (e) {
      setError(`Can’t reach the Sinch & Save API. Start the backend with “uvicorn app.main:app --reload”, then refresh. (${e.message})`);
    }
  }, [period, isYear, config]);

  useEffect(() => { load(); }, [load]);

  const addEntry = async (tx) => { await api.addTransaction(tx); await load(); };
  const deleteEntry = async (id) => { await api.deleteTransaction(id); await load(); };
  const changeGoal = async (v) => { setGoal(await api.updateGoal(v)); };

  const groups = useMemo(() => {
    if (!report) return [];
    return isYear
      ? report.months.map((m) => ({ label: m.label, income: m.income, spent: m.spent }))
      : report.weeks.map((w) => ({ label: w.label, income: w.income, spent: w.spent }));
  }, [report, isYear]);

  const periodTx = useMemo(() => (isYear ? all : all.filter((t) => t.date.startsWith(period))), [all, period, isYear]);

  const trend = useMemo(() => {
    const today = todayISO();
    let steps;
    if (isYear) {
      steps = months.map((m) => `${m.key}-31`);
    } else {
      const days = new Date(monthInfo.y, monthInfo.m + 1, 0).getDate();
      steps = Array.from({ length: days }, (_, i) => `${period}-${String(i + 1).padStart(2, "0")}`);
    }
    const shown = steps.filter((s, i) => i === 0 || s.slice(0, isYear ? 7 : 10) <= today.slice(0, isYear ? 7 : 10));
    return { points: shown.map((s) => cumulativeUpTo(all, s)), total: steps.length, start: isYear ? "Oct 2026" : shortDate(steps[0]), end: isYear ? "Sep 2027" : shortDate(steps[steps.length - 1]) };
  }, [all, period, isYear, monthInfo]);

  const periodName = isYear ? "the year" : monthInfo.short;
  const weekLabel = week ? `Week of ${shortDate(week.start)} – ${shortDate(week.end)}` : "This week";

  return (
    <div className="page">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      <div className="blob blob-c" aria-hidden="true" />
      <main className="wrap">
        <Header months={months} value={period} onChange={setPeriod} weekLabel={weekLabel} />
        {error && <div className="error banner" role="alert">{error}</div>}
        <SafeToSpend week={week} />
        <SummaryCards report={report} week={week} period={periodName} count={periodTx.filter((t) => t.type === "income").length} />
        <TerrariumJar goal={goal} onChangeGoal={changeGoal} />
        <div className="row">
          <EntryForm categories={config?.categories ? orderCats(config.categories) : []} onAdd={addEntry} />
          <WeeklyCaps week={week} />
        </div>
        <div className="row">
          <EarnedSpentChart groups={groups} compact={isYear} />
          <CategoryDonut byCategory={report?.by_category} spent={report?.spent || 0} />
        </div>
        <SavingsTrend points={trend.points} totalSteps={trend.total} goal={goal?.target_amount} startLabel={trend.start} endLabel={trend.end} />
        <RecentEntries items={periodTx.slice(0, 12)} onDelete={deleteEntry} />
      </main>
    </div>
  );
}

const ORDER = ["Rent & utilities", "Wifi", "Groceries", "Misc", "Trips & extras", "Online orders"];
function orderCats(cats) {
  return [...cats].sort((a, b) => (ORDER.indexOf(a) + 99 * (ORDER.indexOf(a) < 0)) - (ORDER.indexOf(b) + 99 * (ORDER.indexOf(b) < 0)));
}
