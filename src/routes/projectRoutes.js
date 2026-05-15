import { Router } from "express";
import { createProject, deleteProject, updateProject } from "../controllers/projectController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const projectRoutes = Router();

projectRoutes.post("/", requireAuth, requireAdmin, createProject);
projectRoutes.patch("/:id", requireAuth, requireAdmin, updateProject);
projectRoutes.delete("/:id", requireAuth, requireAdmin, deleteProject);
