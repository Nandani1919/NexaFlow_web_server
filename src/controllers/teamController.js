import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memberInviteSchema, memberRoleSchema } from "../validators/schemas.js";

const colors = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-blue-400",
];

export const inviteMember = asyncHandler(async (req, res) => {
  const payload = memberInviteSchema.parse(req.body);
  const passwordHash = await User.hashPassword("demo1234");
  const user = await User.create({
    ...payload,
    passwordHash,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
  res.status(201).json({ user });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const payload = memberRoleSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, { role: payload.role }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user });
});

export const removeMember = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot remove yourself." });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.status(204).send();
});
