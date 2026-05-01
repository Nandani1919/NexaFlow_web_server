import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { Comment } from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activityService.js";
import { projectCreateSchema, projectUpdateSchema } from "../validators/schemas.js";

export const createProject = asyncHandler(async (req, res) => {
  const payload = projectCreateSchema.parse(req.body);
  const memberIds = Array.from(new Set([req.user.id, ...payload.memberIds]));
  const project = await Project.create({
    ...payload,
    ownerId: payload.ownerId || req.user.id,
    memberIds,
  });
  await recordActivity({ userId: req.user.id, action: "created project", target: project.name, projectId: project.id });
  res.status(201).json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const payload = projectUpdateSchema.parse(req.body);
  const project = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ message: "Project not found." });
  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.id }).select("_id");
  await Comment.deleteMany({ taskId: { $in: tasks.map((task) => task._id) } });
  await Task.deleteMany({ projectId: req.params.id });
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found." });
  res.status(204).send();
});
