// client/src/components/ComparePanel.jsx — порівняння бюджетних сценаріїв
import { fmt } from "../data/scenarios.js";

export default function ComparePanel({ rows }) {
  return (
    <div className="card">
      <h2>Порівняння бюджетних сценаріїв</h2>
      <div className="scroll"><table>
        <thead><tr><th>Сценарій</th><th>Рівноваги Неша (чисті)</th><th>Значення гри для А</th>
          <th>Ймовірності А</th><th>Ймовірності Б</th></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.name}><td>{r.name}</td>
            <td>{r.nash ? (r.nash.equilibria.length ? r.nash.equilibria.map(e => `(А${e.row + 1}; Б${e.col + 1})`).join(", ") : "немає") : "—"}</td>
            <td>{r.lp ? `${fmt(r.lp.value)} %` : "—"}</td>
            <td>{r.lp ? r.lp.p.map(fmt).join(" / ") : "—"}</td>
            <td>{r.lp ? r.lp.q.map(fmt).join(" / ") : "—"}</td></tr>))}
        </tbody>
      </table></div>
    </div>);
}
