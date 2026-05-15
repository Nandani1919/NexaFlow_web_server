import { Activity } from "../models/Activity.js";
import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWorkspace = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    const projects = await Project.find({ memberIds: req.user._id }).sort({ createdAt: -1 });
    const projectIds = projects.map((project) => project._id);
    const tasks = await Task.find({ assigneeId: req.user._id }).sort({ createdAt: -1 });
    const taskIds = tasks.map((task) => task._id);

    const [users, comments, activities, notifications] = await Promise.all([
      User.find({ _id: { $in: [req.user._id, ...projects.flatMap((project) => project.memberIds)] } }).sort({ createdAt: 1 }),
      Comment.find({ taskId: { $in: taskIds } }).sort({ createdAt: 1 }),
      Activity.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 }).limit(100),
      Notification.find({ $or: [{ userId: null }, { userId: req.user.id }] }).sort({ createdAt: -1 }),
    ]);

    return res.json({ users, projects, tasks, comments, activities, notifications });
  }

  const [users, projects, tasks, comments, activities, notifications] = await Promise.all([
    User.find().sort({ createdAt: 1 }),
    Project.find().sort({ createdAt: -1 }),
    Task.find().sort({ createdAt: -1 }),
    Comment.find().sort({ createdAt: 1 }),
    Activity.find().sort({ createdAt: -1 }).limit(100),
    Notification.find({ $or: [{ userId: null }, { userId: req.user.id }] }).sort({ createdAt: -1 }),
  ]);

  res.json({ users, projects, tasks, comments, activities, notifications });
});
