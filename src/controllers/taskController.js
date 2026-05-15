import { Comment } from "../models/Comment.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activityService.js";
import { commentCreateSchema, taskCreateSchema, taskUpdateSchema } from "../validators/schemas.js";

export const createTask = asyncHandler(async (req, res) => {
  const payload = taskCreateSchema.parse(req.body);
  const task = await Task.create({ ...payload, assigneeId: payload.assigneeId || null });
  await recordActivity({ userId: req.user.id, action: "created task", target: task.title, projectId: task.projectId });
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const payload = taskUpdateSchema.parse(req.body);
  if (payload.assigneeId === undefined) delete payload.assigneeId;
  if (payload.assigneeId === "") payload.assigneeId = null;

  const previous = await Task.findById(req.params.id);
  if (!previous) return res.status(404).json({ message: "Task not found." });

  if (req.user.role !== "admin") {
    if (previous.assigneeId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Members can only update tasks assigned to them." });
    }

    const allowedKeys = new Set(["status"]);
    const blockedKeys = Object.keys(payload).filter((key) => !allowedKeys.has(key));
    if (blockedKeys.length > 0) {
      return res.status(403).json({ message: "Members can only update task status." });
    }
  }

  const task = await Task.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (payload.status && payload.status !== previous.status) {
    await recordActivity({
      userId: req.user.id,
      action: `moved to ${payload.status.replace("_", " ")}`,
      target: task.title,
      projectId: task.projectId,
    });
  }

  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  await Comment.deleteMany({ taskId: task.id });
  res.status(204).send();
});

export const addComment = asyncHandler(async (req, res) => {
  const payload = commentCreateSchema.parse(req.body);
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  const comment = await Comment.create({ taskId: task.id, authorId: req.user.id, text: payload.text });
  await recordActivity({ userId: req.user.id, action: "commented on", target: task.title, projectId: task.projectId });
  res.status(201).json({ comment });
});
