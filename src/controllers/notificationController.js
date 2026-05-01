import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  res.json({ notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ $or: [{ userId: null }, { userId: req.user.id }] }, { read: true });
  const notifications = await Notification.find({ $or: [{ userId: null }, { userId: req.user.id }] }).sort({ createdAt: -1 });
  res.json({ notifications });
});
