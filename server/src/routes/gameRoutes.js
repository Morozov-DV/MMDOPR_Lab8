// server/src/routes/gameRoutes.js
import { Router } from "express";
import { analyze } from "../services/gameService.js";

const router = Router();
// POST /api/analyze  { matrix, methods, total } -> { ok, results }
router.post("/analyze", (req, res) => {
  try {
    res.json({ ok: true, results: analyze(req.body ?? {}) });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });   // зрозуміла помилка, сервер не падає
  }
});
export default router;
