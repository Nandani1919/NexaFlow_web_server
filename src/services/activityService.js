import { Activity } from "../models/Activity.js";

export async function recordActivity({ userId, action, target, projectId }) {
  if (!userId || !action || !target) return null;
  return Activity.create({ userId, action, target, projectId: projectId || null });
}
