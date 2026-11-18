// client/src/components/ResultsPanel.jsx — структуровані панелі результатів
import { fmt } from "../data/scenarios.js";

function Probs({ title, probs, prefix }) {
  return (
    <div><b>{title}</b>
      {probs.map((p, i) => (
        <div key={i}>{prefix}{i + 1}:{" "}
          <span className="bar"><div style={{ width: `${Math.max(0, p) * 100}%` }} /></span> {fmt(p * 100)} %</div>))}
    </div>);
}

export default function ResultsPanel({ result }) {
  const { A, B, nash, lp, total } = result;
  return (
    <div>
      <div className="card">
        <h2>Матриці виграшів (А; Б)</h2>
        <div className="scroll"><table>
          <thead><tr><th></th>{A[0].map((_, j) => <th key={j}>Б{j + 1}</th>)}</tr></thead>
          <tbody>{A.map((r, i) => <tr key={i}><th>А{i + 1}</th>
            {r.map((v, j) => <td key={j}>({fmt(v)}; {fmt(B[i][j])})</td>)}</tr>)}</tbody>
        </table></div>
      </div>
      <div className="grid2">
        {nash && (
          <div className="card">
            <h2>Метод 1. Рівновага Неша (чисті стратегії)</h2>
            <p className={nash.equilibria.length ? "ok" : "bad"}>{nash.conclusion}</p>
            {nash.equilibria.length > 0 && (
              <table><thead><tr><th>Профіль</th><th>Виграш А</th><th>Виграш Б</th></tr></thead>
                <tbody>{nash.equilibria.map((e, k) => <tr key={k}>
                  <td>А{e.row + 1}; Б{e.col + 1}</td><td>{fmt(e.payoffA)}</td><td>{fmt(e.payoffB)}</td></tr>)}</tbody></table>)}
            <div className="log">{nash.log.map((l, k) => <div key={k}>{l}</div>)}</div>
            <details><summary>Односторонні відхилення (приріст виграшу)</summary>
              <table><thead><tr><th>Профіль</th><th>Приріст А</th><th>Приріст Б</th></tr></thead>
                <tbody>{nash.deviations.map((d, k) => <tr key={k}>
                  <td>А{d.row + 1}; Б{d.col + 1}</td><td>{fmt(d.gainA)}</td><td>{fmt(d.gainB)}</td></tr>)}</tbody></table>
            </details>
          </div>)}
        {lp && (
          <div className="card">
            <h2>Метод 2. Змішані стратегії (лінійне програмування)</h2>
            <p>Значення гри: А — <b>{fmt(lp.value)} %</b>, Б — <b>{fmt(total - lp.value)} %</b></p>
            <Probs title="Стратегія А" probs={lp.p} prefix="А" />
            <Probs title="Стратегія Б" probs={lp.q} prefix="Б" />
            <p>Сума ймовірностей: {fmt(lp.sumP)} / {fmt(lp.sumQ)}. Гарантія А: {fmt(lp.guaranteeA)}, Б: {fmt(lp.guaranteeB)}.<br />
              Перевірка коректності:{" "}
              <span className={lp.valid ? "ok" : "bad"}>{lp.valid ? "пройдена" : "НЕ пройдена"}</span></p>
            <details><summary>Журнал симплекс-методу</summary>
              <div className="log">{lp.log.map((l, k) => <div key={k}>{l}</div>)}</div></details>
          </div>)}
      </div>
    </div>
  );
}
