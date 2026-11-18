// server/test/game.test.js — тести ядра (запуск: npm test). Не потребують сторонніх бібліотек.
import test from "node:test";
import assert from "node:assert/strict";
import { analyze, validateMatrix } from "../src/services/gameService.js";

const low  = [[50,45,40],[55,50,42],[60,58,50]];
const mid  = [[50,60,40],[45,50,65],[62,40,50]];
const high = [[55,48,62],[58,52,50],[44,56,53]];

test("«Орлянка»: значення 0.5, стратегії 50/50, чистої рівноваги немає", () => {
  const r = analyze({ matrix: [[1,0],[0,1]], total: 1 });
  assert.ok(Math.abs(r.lp.value - 0.5) < 1e-9);
  assert.ok(r.lp.p.every(v => Math.abs(v - 0.5) < 1e-9));
  assert.equal(r.nash.equilibria.length, 0);
});
test("Сідлова точка [[3,2],[4,5]]: рівновага (А2;Б1), значення 4", () => {
  const r = analyze({ matrix: [[3,2],[4,5]] });
  assert.deepEqual([r.nash.equilibria[0].row, r.nash.equilibria[0].col], [1, 0]);
  assert.ok(Math.abs(r.lp.value - 4) < 1e-9);
});
test("Низький бюджет: рівновага (А3;Б3), значення 50", () => {
  const r = analyze({ matrix: low });
  assert.equal(r.nash.equilibria.length, 1);
  assert.deepEqual([r.nash.equilibria[0].row, r.nash.equilibria[0].col], [2, 2]);
  assert.ok(Math.abs(r.lp.value - 50) < 1e-9);
});
test("Середній і високий бюджети: чистої рівноваги немає, перевірка LP пройдена", () => {
  for (const m of [mid, high]) {
    const r = analyze({ matrix: m });
    assert.equal(r.nash.equilibria.length, 0);
    assert.ok(r.lp.valid);
    assert.ok(Math.abs(r.lp.sumP - 1) < 1e-6 && Math.abs(r.lp.sumQ - 1) < 1e-6);
  }
});
test("Від’ємні платежі обробляються коректно", () => {
  const r = analyze({ matrix: [[-3,2],[1,-4]] });
  assert.ok(r.lp.valid); assert.ok(Math.abs(r.lp.value + 1) < 1e-9);
});
test("Прямокутна матриця 2x3", () => {
  assert.ok(analyze({ matrix: [[2,4,1],[3,1,5]] }).lp.valid);
});
test("Некоректні дані викликають зрозумілу помилку", () => {
  assert.throws(() => validateMatrix([]), /два рядки/);
  assert.throws(() => validateMatrix([[1,2]]), /два рядки/);
  assert.throws(() => validateMatrix([[1],[2]]), /два стовпці/);
  assert.throws(() => validateMatrix([[1,2],[3]]), /прямокутною/);
  assert.throws(() => validateMatrix([[1,"a"],[3,4]]), /числовою/);
  assert.throws(() => validateMatrix([[1,NaN],[3,4]]), /числовою/);
  assert.throws(() => validateMatrix([[1,Infinity],[3,4]]), /числовою/);
  assert.throws(() => analyze({ matrix: low, total: 0 }), /додатним/);
  assert.throws(() => analyze({ matrix: low, methods: [] }), /метод/);
});
test("Вибір одного методу повертає лише його результат", () => {
  const r = analyze({ matrix: low, methods: ["nash"] });
  assert.ok(r.nash && !r.lp);
});
