// server/src/services/gameService.js
// Сервісний шар: валідація даних, побудова матриці гравця Б, запуск методів.
import { findPureNash } from "../methods/nash.js";
import { solveMixedLP } from "../methods/mixedLP.js";

// Перевірка матриці: щонайменше 2x2, прямокутна, лише скінченні числа
export function validateMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length < 2)
    throw new Error("Потрібно щонайменше два рядки.");
  const cols = matrix[0]?.length;
  if (!Number.isInteger(cols) || cols < 2)
    throw new Error("Потрібно щонайменше два стовпці.");
  for (const row of matrix) {
    if (!Array.isArray(row) || row.length !== cols ||
        row.some(v => typeof v !== "number" || !Number.isFinite(v)))
      throw new Error("Матриця має бути прямокутною та числовою (порожні клітинки й текст недопустимі).");
  }
  return { rows: matrix.length, cols };
}

// Матриця виграшів рекламодавця Б.
// Дві компанії ділять аудиторію (total = 100 %), тому виграш Б = total - виграш А
// (гра з постійною сумою, стратегічно еквівалентна грі з нульовою сумою).
export function buildPlayerB(matrixA, total) {
  return matrixA.map(row => row.map(v => total - v));
}

// Запуск вибраних методів
export function analyze({ matrix, methods = ["nash", "mixed-lp"], total = 100 }) {
  validateMatrix(matrix);
  if (typeof total !== "number" || !Number.isFinite(total) || total <= 0)
    throw new Error("Сума аудиторії має бути додатним числом.");
  if (!Array.isArray(methods) || !methods.length)
    throw new Error("Потрібно вибрати хоча б один метод.");
  const B = buildPlayerB(matrix, total);
  const results = { A: matrix, B, total };
  if (methods.includes("nash")) results.nash = findPureNash(matrix, B);
  if (methods.includes("mixed-lp")) results.lp = solveMixedLP(matrix);
  return results;
}
