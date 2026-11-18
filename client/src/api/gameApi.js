// client/src/api/gameApi.js — запит до Node.js API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function analyzeGame(matrix, methods, total = 100) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix, methods, total })
    });
  } catch {
    throw new Error("Немає з’єднання із сервером. Запустіть його: cd server && npm run dev.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) throw new Error(data.message || "Помилка аналізу");
  return data.results;
}
