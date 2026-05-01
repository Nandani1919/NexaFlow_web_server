import { Activity } from "../models/Activity.js";
import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWorkspace = asyncHandler(async (_req, res) => {
  const [users, projects, tasks, comments, activities, notifications] = await Promise.all([
    User.find().sort({ createdAt: 1 }),
    Project.find().sort({ createdAt: -1 }),
    Task.find().sort({ createdAt: -1 }),
    Comment.find().sort({ createdAt: 1 }),
    Activity.find().sort({ createdAt: -1 }).limit(100),
    Notification.find({ $or: [{ userId: null }, { userId: _req.user.id }] }).sort({ createdAt: -1 }),
  ]);

  res.json({ users, projects, tasks, comments, activities, notifications });
});
