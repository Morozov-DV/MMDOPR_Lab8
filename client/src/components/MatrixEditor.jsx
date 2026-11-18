// client/src/components/MatrixEditor.jsx — редактор матриці з підсвіткою результатів
import { rowName, colName } from "../data/scenarios.js";

export default function MatrixEditor({ cells, setCells, result }) {
  const set = (i, j, v) => setCells(cells.map((r, a) => r.map((c, b) => (a === i && b === j ? v : c))));
  const addRow = () => setCells([...cells, Array(cells[0].length).fill("50")]);
  const addCol = () => setCells(cells.map(r => [...r, "50"]));
  const delRow = () => cells.length > 2 && setCells(cells.slice(0, -1));
  const delCol = () => cells[0].length > 2 && setCells(cells.map(r => r.slice(0, -1)));
  const cls = (i, j) => {
    const n = result?.nash;
    if (!n) return "";
    return [n.bestA[i]?.[j] ? "bestA" : "", n.bestB[i]?.[j] ? "bestB" : "",
      n.equilibria.some(e => e.row === i && e.col === j) ? "ne" : ""].join(" ");
  };
  return (
    <div>
      <div className="scroll">
        <table>
          <thead><tr><th>А \ Б</th>{cells[0].map((_, j) => <th key={j}>{colName(j)}</th>)}</tr></thead>
          <tbody>{cells.map((row, i) => (
            <tr key={i}><th>{rowName(i)}</th>
              {row.map((v, j) => (
                <td key={j} className={cls(i, j)}>
                  <input value={v} onChange={e => set(i, j, e.target.value)} />
                </td>))}
            </tr>))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow}>+ рядок</button><button onClick={delRow}>− рядок</button>
      <button onClick={addCol}>+ стовпець</button><button onClick={delCol}>− стовпець</button>
      {result?.nash && (
        <div className="legend">
          <span className="bestA">найкраща відповідь А</span>
          <span className="bestB">найкраща відповідь Б</span>
          <span className="ne">рівновага Неша</span>
        </div>)}
    </div>
  );
}
