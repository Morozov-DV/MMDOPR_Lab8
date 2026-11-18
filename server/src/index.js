// server/src/index.js — точка входу Express-сервера
import express from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", gameRoutes);
// Обробка некоректного JSON у тілі запиту
app.use((err, req, res, next) => res.status(400).json({ ok: false, message: "Некоректний JSON у запиті." }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API працює на порту ${PORT}`));
