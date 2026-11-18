// server/src/methods/mixedLP.js
// Метод 2. Змішані стратегії антагоністичної гри через лінійне програмування (симплекс-метод).
// Послідовність: зсув матриці до додатних значень -> задача Б: max Σy при P·y ≤ 1, y ≥ 0 ->
// симплекс-таблиця -> оптимальні y (стратегія Б) та двоїсті оцінки x (стратегія А) -> нормування -> перевірка.
const EPS = 1e-9;

export function solveMixedLP(A) {
  const m = A.length, n = A[0].length;
  const min = Math.min(...A.flat());
  const shift = min <= 0 ? 1 - min : 0;          // усі елементи мають стати > 0
  const P = A.map(r => r.map(v => v + shift));
  const log = [`Зсув матриці на ${shift} (щоб усі платежі були додатними).`];

  // Симплекс-таблиця: [P | I | b=1] і рядок цільової функції [-1.. | 0.. | 0]
  const T = P.map((r, i) => [...r, ...Array.from({ length: m }, (_, k) => (k === i ? 1 : 0)), 1]);
  T.push([...Array(n).fill(-1), ...Array(m).fill(0), 0]);
  const basis = Array.from({ length: m }, (_, i) => n + i);
  const last = n + m;

  for (let iter = 1; iter <= 1000; iter++) {
    const col = T[m].findIndex((v, j) => j < last && v < -EPS);   // правило Бленда
    if (col < 0) break;                                           // оптимум досягнуто
    let row = -1, best = Infinity;
    for (let i = 0; i < m; i++) if (T[i][col] > EPS) {
      const ratio = T[i][last] / T[i][col];
      if (ratio < best - EPS || (Math.abs(ratio - best) < EPS && basis[i] < basis[row])) { best = ratio; row = i; }
    }
    if (row < 0) throw new Error("Задача необмежена (некоректні дані).");
    const piv = T[row][col];
    T[row] = T[row].map(v => v / piv);
    for (let i = 0; i <= m; i++) if (i !== row) {
      const f = T[i][col];
      T[i] = T[i].map((v, j) => v - f * T[row][j]);
    }
    basis[row] = col;
    log.push(`Ітерація ${iter}: у базис входить ${col < n ? "y" + (col + 1) : "s" + (col - n + 1)}, ведучий рядок ${row + 1}.`);
  }

  const y = Array(n).fill(0);
  basis.forEach((b, i) => { if (b < n) y[b] = T[i][last]; });
  const x = T[m].slice(n, n + m);                 // двоїсті оцінки
  const z = T[m][last];
  const k = 1 / z;                                 // значення гри для зсунутої матриці
  const p = x.map(v => v * k), q = y.map(v => v * k);
  const value = k - shift;

  // Перевірка коректності розподілів
  const guaranteeA = Math.min(...A[0].map((_, j) => A.reduce((s, r, i) => s + r[j] * p[i], 0)));
  const guaranteeB = Math.max(...A.map(r => r.reduce((s, v, j) => s + v * q[j], 0)));
  const sumP = p.reduce((a, b) => a + b, 0), sumQ = q.reduce((a, b) => a + b, 0);
  const valid = Math.abs(sumP - 1) < 1e-6 && Math.abs(sumQ - 1) < 1e-6 &&
    Math.abs(guaranteeA - value) < 1e-6 && Math.abs(guaranteeB - value) < 1e-6;
  return { method: "mixed-lp", p, q, value, guaranteeA, guaranteeB, sumP, sumQ, valid, log };
}
