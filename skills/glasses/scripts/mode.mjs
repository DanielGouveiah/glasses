import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const MODES = Object.freeze(["medium", "high", "ultra", "off"]);

export function parseMode(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return MODES.includes(normalized) ? normalized : null;
}

export function defaultConfigPath(home = os.homedir()) {
  return path.join(home, ".config", "glasses", "config.json");
}

export function loadDefaultMode(configPath = defaultConfigPath()) {
  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    return parseMode(config.defaultMode) ?? "high";
  } catch {
    return "high";
  }
}
