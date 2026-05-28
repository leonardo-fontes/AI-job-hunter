import fs from "node:fs";
import path from "node:path";
import type { ProfileConfig } from "../types/profile";

export function loadProfileConfig(): ProfileConfig {
  const filePath = path.resolve("profile.config.json");

  if (!fs.existsSync(filePath)) {
    throw new Error("profile.config.json not found");
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(fileContent) as ProfileConfig;
}