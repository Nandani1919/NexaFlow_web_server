import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";
import { signToken } from "../utils/tokens.js";
import { loginSchema, signupSchema } from "../validators/schemas.js";

const colors = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-blue-400",
];

export const signup = asyncHandler(async (req, res) => {
  const payload = signupSchema.parse(req.body);
  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    role: "member",
    passwordHash,
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  setAuthCookie(res, signToken(user));
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select("+passwordHash");

  if (!user || !(await user.comparePassword(payload.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  setAuthCookie(res, signToken(user));
  res.json({ user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});
