import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AUTH_COOKIE } from "../utils/cookies.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, bearerToken] = header.split(" ");
    const token = req.cookies?.[AUTH_COOKIE] || (scheme === "Bearer" ? bearerToken : null);

    if (!token) {
      return res.status(401).json({ message: "Authentication cookie is required." });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Authenticated user no longer exists." });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }
  next();
}
