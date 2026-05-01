import { Router } from "express";
import { addComment, createTask, deleteTask, updateTask } from "../controllers/taskController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const taskRoutes = Router();

taskRoutes.post("/", requireAuth, createTask);
taskRoutes.patch("/:id", requireAuth, updateTask);
taskRoutes.delete("/:id", requireAuth, requireAdmin, deleteTask);
taskRoutes.post("/:id/comments", requireAuth, addComment);
