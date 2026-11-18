// client/src/components/MethodSelector.jsx — вибір двох методів варіанта 4
export const METHODS = [
  ["nash", "Пошук рівноваги Неша"],
  ["mixed-lp", "Змішані стратегії (лінійне програмування)"]
];
export default function MethodSelector({ methods, setMethods }) {
  return (
    <p>Методи:{" "}
      {METHODS.map(([id, label]) => (
        <label key={id}>
          <input type="checkbox" checked={methods.includes(id)}
            onChange={e => setMethods(old => e.target.checked ? [...old, id] : old.filter(x => x !== id))} />
          {label}
        </label>))}
    </p>
  );
}
