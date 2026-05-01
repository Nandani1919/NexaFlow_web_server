import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { app } from "./app.js";
import { seedDatabase } from "./services/seed.js";

try {
  await connectDatabase();
  if (env.autoSeed) await seedDatabase();

  app.listen(env.port, () => {
    console.log(`Harmony server listening on http://localhost:${env.port}`);
  });
} catch (error) {
  console.error("Failed to start Harmony server:", error);
  process.exit(1);
}
