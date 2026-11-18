// server/src/methods/nash.js
// Метод 1. Пошук рівноваги Неша в чистих стратегіях для біматричної гри.
// A[i][j] — виграш рекламодавця А, B[i][j] — виграш рекламодавця Б.
const EPS = 1e-9;

export function findPureNash(A, B) {
  const m = A.length, n = A[0].length, log = [];
  // Найкраща відповідь А — максимум у стовпці; найкраща відповідь Б — максимум у рядку
  const colMaxA = Array.from({ length: n }, (_, j) => Math.max(...A.map(r => r[j])));
  const rowMaxB = B.map(r => Math.max(...r));
  const bestA = A.map(r => r.map((v, j) => Math.abs(v - colMaxA[j]) < EPS));
  const bestB = B.map((r, i) => r.map(v => Math.abs(v - rowMaxB[i]) < EPS));

  const equilibria = [], deviations = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    // Приріст виграшу при одностороннiй зміні стратегії (для таблиці відхилень)
    deviations.push({ row: i, col: j, gainA: colMaxA[j] - A[i][j], gainB: rowMaxB[i] - B[i][j] });
    if (bestA[i][j] && bestB[i][j]) {
      equilibria.push({ row: i, col: j, payoffA: A[i][j], payoffB: B[i][j] });
      log.push(`Профіль (А${i + 1}; Б${j + 1}) — рівновага: жоден гравець не виграє від одностороннього відхилення.`);
    }
  }
  if (!equilibria.length)
    log.push("Рівноваги Неша в чистих стратегіях немає — потрібні змішані стратегії.");
  return {
    method: "nash", bestA, bestB, equilibria, deviations, log,
    conclusion: equilibria.length
      ? `Знайдено рівноваг у чистих стратегіях: ${equilibria.length}.`
      : "Рівноваги в чистих стратегіях немає."
  };
}
