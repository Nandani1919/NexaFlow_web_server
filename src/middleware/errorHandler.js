import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found." });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "A record with that value already exists." });
  }

  const status = Number(error.status || error.statusCode || 500);
  res.status(status).json({
    message: status === 500 ? "Internal server error." : error.message,
    ...(env.nodeEnv === "development" ? { detail: error.message, stack: error.stack } : {}),
  });
}
