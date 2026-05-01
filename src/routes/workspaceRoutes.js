import { Router } from "express";
import { getWorkspace } from "../controllers/workspaceController.js";
import { requireAuth } from "../middleware/auth.js";

export const workspaceRoutes = Router();

workspaceRoutes.get("/", requireAuth, getWorkspace);
