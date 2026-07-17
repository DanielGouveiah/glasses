import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { workflowRoutingPolicy } from "../../skills/glasses/scripts/workflow-routing.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const skillPath = path.join(root, "skills", "glasses", "skills", "glasses", "SKILL.md");
const configPath = path.join(os.homedir(), ".config", "glasses", "config.json");
const modes = new Set(["medium", "high", "ultra", "off"]);

function mode() {
  try {
    const value = JSON.parse(readFileSync(configPath, "utf8")).defaultMode;
    return modes.has(value) ? value : "high";
  } catch {
    return "high";
  }
}

export const Glasses = async () => ({
  "experimental.chat.system.transform": async (_input, output) => {
    const activeMode = mode();
    if (activeMode === "off") return;
    const skill = readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?---\s*/, "");
    output.system.push(
      `GLASSES MODE ACTIVE — level: ${activeMode}\n\n` +
      workflowRoutingPolicy() + "\n\n" +
      "ACTIVE FOR EVERY IMPLEMENTATION PLAN. Complete the Glasses review before " +
      "presenting, accepting, or implementing any plan, ADR, design, or architecture.\n\n" +
      skill
    );
  }
});
