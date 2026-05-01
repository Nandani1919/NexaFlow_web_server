import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  return mongoose.connection;
}

export function getDatabaseHealth() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const readyState = mongoose.connection.readyState;
  return {
    status: readyState === 1 ? "ok" : "degraded",
    readyState,
    state: states[readyState] || "unknown",
    name: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
}
