import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDefaultMode } from "./mode.mjs";
import { workflowRoutingPolicy } from "./workflow-routing.mjs";

const mode = loadDefaultMode();
const requestedEvent = process.argv[2] ?? "SessionStart";
const event = requestedEvent === "SubagentStart" ? "SubagentStart" : "SessionStart";
let policy = "GLASSES MODE OFF";

if (mode !== "off") {
  const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const skillPath = path.join(pluginRoot, "skills", "glasses", "SKILL.md");
  const skill = readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?---\s*/, "");
  policy = [
    `GLASSES MODE ACTIVE — level: ${mode}`,
    workflowRoutingPolicy(),
    "ACTIVE FROM PLAN THROUGH IMPLEMENTATION. Do not create, present, accept, or begin implementing a plan, ADR, technical design, or architecture proposal until it has completed the Glasses workflow below. Then keep implementation inside the approved complexity budget. Apply this even when the user does not mention Glasses.",
    `Use the ${mode} evidence threshold. If the workflow requires a decision-changing answer, ask exactly one question and wait. Otherwise produce the decision-complete replacement plan, implement only that plan, and run its acceptance checks.`,
    skill
  ].join("\n\n");
}

const output = requestedEvent.startsWith("Copilot")
  ? { additionalContext: policy }
  : {
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: policy
      }
    };

process.stdout.write(JSON.stringify(output));
