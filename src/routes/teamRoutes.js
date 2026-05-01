import { Router } from "express";
import { inviteMember, removeMember, updateMemberRole } from "../controllers/teamController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const teamRoutes = Router();

teamRoutes.post("/invite", requireAuth, requireAdmin, inviteMember);
teamRoutes.patch("/:id/role", requireAuth, requireAdmin, updateMemberRole);
teamRoutes.delete("/:id", requireAuth, requireAdmin, removeMember);
