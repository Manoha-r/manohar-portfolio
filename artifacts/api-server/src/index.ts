import fs from "fs";
import path from "path";

// Load environment variables from .env file if it exists (checks multiple fallback paths)
const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(import.meta.dirname, "../.env"),
  path.resolve(import.meta.dirname, "../../../.env"),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const parts = trimmed.split("=");
        const key = parts[0].trim();
        const val = parts.slice(1).join("=").trim().replace(/(^['"]|['"]$)/g, "");
        process.env[key] = val;
      }
    });
    break; // Load from the first matching .env file found
  }
}

import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
