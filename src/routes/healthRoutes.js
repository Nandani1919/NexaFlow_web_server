import { Router } from "express";
import { getDatabaseHealth } from "../config/db.js";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  const db = getDatabaseHealth();
  res.status(db.status === "ok" ? 200 : 503).json({
    status: db.status,
    service: "nexaflow-server",
    timestamp: new Date().toISOString(),
    database: db,
  });
});

healthRoutes.get("/db", (_req, res) => {
  const db = getDatabaseHealth();
  res.status(db.status === "ok" ? 200 : 503).json(db);
});
