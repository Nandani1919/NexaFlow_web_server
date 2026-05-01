import { Router } from "express";
import { markAllNotificationsRead, markNotificationRead } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationRoutes = Router();

notificationRoutes.patch("/read-all", requireAuth, markAllNotificationsRead);
notificationRoutes.patch("/:id/read", requireAuth, markNotificationRead);
