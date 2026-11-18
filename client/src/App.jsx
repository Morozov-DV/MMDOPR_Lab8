// client/src/App.jsx — головний компонент SPA
import { useState } from "react";
import { analyzeGame } from "./api/gameApi.js";
import { SCENARIOS } from "./data/scenarios.js";
import MatrixEditor from "./components/MatrixEditor.jsx";
import MethodSelector from "./components/MethodSelector.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import ComparePanel from "./components/ComparePanel.jsx";

const toCells = m => m.map(r => r.map(String));
// Порожня клітинка -> NaN, щоб сервер повернув зрозумілу помилку
const toNumbers = c => c.map(r => r.map(v => (String(v).trim() === "" ? NaN : Number(v))));

export default function App() {
  const [scenario, setScenario] = useState("mid");
  const [cells, setCells] = useState(toCells(SCENARIOS.mid.matrix));
  const [total, setTotal] = useState("100");
  const [methods, setMethods] = useState(["nash", "mixed-lp"]);
  const [result, setResult] = useState(null);
  const [compare, setCompare] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(key) {
    setScenario(key); setCells(toCells(SCENARIOS[key].matrix)); setResult(null); setError("");
  }
  async function run() {
    setError(""); setResult(null); setBusy(true);
    try {
      setResult(await analyzeGame(toNumbers(cells), methods, total.trim() === "" ? NaN : Number(total)));
    } catch (e) { setError(e.message); }
    setBusy(false);
  }
  async function runCompare() {
    setError("");
    try {
      const rows = [];
      for (const s of Object.values(SCENARIOS))
        rows.push({ name: s.name, ...(await analyzeGame(s.matrix, methods, 100)) });
      setCompare(rows);
    } catch (e) { setError(e.message); }
  }

  return (
    <main className="container">
      <h1>Рекламна конкуренція: аналіз матричної гри</h1>
      <p className="sub">Варіант 4. Два рекламодавці обирають інтенсивність кампанії; платіж — частка аудиторії (%) рекламодавця А. </p>
      <div className="card">
        <h2>Дані моделі</h2>
        <div>Бюджетний сценарій:{" "}
          {Object.entries(SCENARIOS).map(([k, s]) => (
            <button key={k} className={scenario === k ? "active" : ""} onClick={() => pick(k)}>{s.name}</button>))}
        </div>
        <p>Загальна аудиторія, %: <input style={{ width: 70 }} value={total} onChange={e => setTotal(e.target.value)} />
          <span className="hint"> (виграш Б = сума − виграш А)</span></p>
        <MatrixEditor cells={cells} setCells={setCells} result={result} />
        <MethodSelector methods={methods} setMethods={setMethods} />
        <button className="primary" disabled={!methods.length || busy} onClick={run}>Виконати аналіз</button>
        <button disabled={!methods.length} onClick={runCompare}>Порівняти три сценарії</button>
        {error && <p className="err" role="alert">Помилка: {error}</p>}
      </div>
      {result && <ResultsPanel result={result} />}
      {compare && <ComparePanel rows={compare} />}
    </main>
  );
}
