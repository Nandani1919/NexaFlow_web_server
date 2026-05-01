import { env } from "../config/env.js";

export const AUTH_COOKIE = "orbit_auth";

const isProduction = env.nodeEnv === "production";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, authCookieOptions);
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: authCookieOptions.httpOnly,
    secure: authCookieOptions.secure,
    sameSite: authCookieOptions.sameSite,
    path: authCookieOptions.path,
  });
}
