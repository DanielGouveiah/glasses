import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = relative => JSON.parse(readFileSync(path.join(root, relative), "utf8"));
const text = relative => readFileSync(path.join(root, relative), "utf8");

test("marketplace and plugin manifests are consistent", () => {
  const marketplace = json(".claude-plugin/marketplace.json");
  const plugin = json("skills/glasses/.claude-plugin/plugin.json");
  const packageManifest = json("package.json");
  assert.equal(marketplace.name, "daniskills");
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, plugin.name);
  assert.equal(marketplace.plugins[0].version, plugin.version);
  assert.equal(marketplace.version, plugin.version);
  assert.equal(packageManifest.version, plugin.version);
  assert.equal(marketplace.plugins[0].source, "./skills/glasses");
  assert.equal(plugin.license, "MIT");
});

test("portable skill metadata and manual command are present", () => {
  const skill = text("skills/glasses/skills/glasses/SKILL.md");
  assert.match(skill, /^---[\s\S]*name: glasses[\s\S]*description:/);
  assert.match(skill, /medium.*high.*ultra.*off/s);
  assert.match(skill, /one\s+decision-changing question at a time/i);
  assert.match(skill, /acceptance tests/i);
  assert.match(skill, /correctness|security/i);
  assert.match(skill, /\$ARGUMENTS/);
  assert.match(skill, /no arguments[\s\S]*high/i);
  assert.match(skill, /user.*language[\s\S]*mode.*high/i);
});

test("automatic context routes users to all four Glasses workflows", () => {
  const sessionStart = text("skills/glasses/scripts/session-start.mjs");
  const routing = text("skills/glasses/scripts/workflow-routing.mjs");
  assert.match(sessionStart, /workflowRoutingPolicy/);
  assert.match(routing, /planning.*architecture.*apply Glasses/is);
  assert.match(routing, /concrete defect.*failing test.*Skill tool.*glasses:pointer/is);
  assert.match(routing, /external technical choice.*Skill tool.*glasses:homework/is);
  assert.match(routing, /notes.*documentation capture.*Skill tool.*glasses:scribe/is);
  assert.match(routing, /never create or update notes unless the user requested or approved/is);
  assert.match(routing, /Skill calls are mandatory/i);
  assert.match(routing, /Name Pointer, Homework, or Scribe and explain its purpose in one sentence/i);
});

test("explicit general scope takes precedence over project context", () => {
  const glasses = text("skills/glasses/skills/glasses/SKILL.md");
  const homework = text("skills/glasses/skills/homework/SKILL.md");
  const routing = text("skills/glasses/scripts/workflow-routing.mjs");
  const command = text("commands/homework.toml");

  assert.match(glasses, /explicit.*scope.*project.*context/i);
  assert.match(homework, /general.*project.*context/i);
  assert.match(routing, /general.*informational.*directly/i);
  assert.match(command, /explicit.*general.*scope/i);
});

test("all workflows answer in the user language without translating code", () => {
  const names = ["glasses", "pointer", "homework", "scribe"];
  const skills = names.map(name => text(`skills/glasses/skills/${name}/SKILL.md`));
  const commands = names.map(name => text(`commands/${name}.toml`));
  const routing = text("skills/glasses/scripts/workflow-routing.mjs");

  for (const [index, skill] of skills.entries()) {
    assert.match(
      skill,
      /language of the user's latest request/i,
      `${names[index]} must preserve the user's language`
    );
    assert.match(
      skill,
      /localize.*workflow prose/i,
      `${names[index]} must localize workflow prose`
    );
    assert.match(
      skill,
      /preserve source code[\s\S]*identifiers[\s\S]*commands[\s\S]*file paths[\s\S]*error/i,
      `${names[index]} must preserve code and technical literals`
    );
    assert.doesNotMatch(
      skill,
      /End with exactly:\s*\n+\s*`Should I/i,
      `${names[index]} must not require an English closing question`
    );
  }

  for (const [index, command] of commands.entries()) {
    assert.match(
      command,
      /language of the user's latest request/i,
      `${names[index]} command must preserve the user's language`
    );
    assert.doesNotMatch(
      command,
      /ask exactly:\s*"Should I/i,
      `${names[index]} command must not require an English closing question`
    );
  }

  assert.match(routing, /language of the user's latest request/i);
  assert.match(
    routing,
    /preserve source code[\s\S]*identifiers[\s\S]*commands[\s\S]*file paths[\s\S]*error/i
  );
});

test("Glasses independently constrains planning and implementation", () => {
  const skill = text("skills/glasses/skills/glasses/SKILL.md");
  assert.match(skill, /complexity budget/i);
  assert.match(skill, /re-enter the evidence gate/i);
  assert.match(skill, /existing.*standard library.*native.*installed dependenc/is);
  assert.match(skill, /unrelated refactor/i);
  assert.match(skill, /run.*acceptance/i);
});

test("Pointer reaches an evidence-backed correction plan before editing", () => {
  const pointer = text("skills/glasses/skills/pointer/SKILL.md");
  assert.match(pointer, /^---[\s\S]*name: pointer[\s\S]*description:/);
  assert.match(pointer, /one bounded diagnostic pass/i);
  assert.match(pointer, /one decision-changing question at a time/i);
  assert.match(pointer, /options.*trade-offs.*recommend/is);
  assert.match(pointer, /accepted correction plan/i);
  assert.match(pointer, /explicit approval/i);
  assert.match(pointer, /apply only.*accepted.*plan/is);
  assert.match(pointer, /run.*targeted.*once/is);
  assert.match(pointer, /user's language[\s\S]*apply this\s+correction plan/i);
  assert.match(pointer, /evidence/i);
  assert.match(pointer, /smallest targeted fix/i);
  assert.match(pointer, /do not.*another diagnostic pass/is);
  assert.match(pointer, /\$ARGUMENTS/);
});

test("Homework clarifies, plans, researches, and validates only after approval", () => {
  const homework = text("skills/glasses/skills/homework/SKILL.md");
  const command = text("commands/homework.toml");
  assert.match(homework, /^---[\s\S]*name: homework[\s\S]*description:/);
  assert.match(homework, /always ask.*Q1.*before.*research/i);
  assert.match(homework, /confirm[\s\S]*objective[\s\S]*scope[\s\S]*exclusions/i);
  assert.match(command, /mandatory.*Q1.*before.*research/i);
  assert.match(homework, /recent conversation/i);
  assert.match(homework, /Q1.*Q2/s);
  assert.match(homework, /ask as many as needed/i);
  assert.match(homework, /\(a\).*\(b\).*\(c\)/s);
  assert.match(homework, /localized recommendation label/i);
  assert.match(homework, /do not prefix options with bullets or hyphens/i);
  assert.match(homework, /user's language[\s\S]*run the research plan/i);
  assert.match(homework, /explicit approval/i);
  assert.match(homework, /specifications.*official documentation/is);
  assert.match(homework, /options and trade-offs/i);
  assert.match(homework, /cheapest bounded validation plan/i);
  assert.match(homework, /multiple experiments.*matrix cells/is);
  assert.match(homework, /budget.*stopping/is);
  assert.match(homework, /user's language[\s\S]*run the validation plan/i);
  assert.match(homework, /every approved experiment/i);
  assert.match(homework, /new approval before adding experiments/i);
  assert.match(homework, /\$ARGUMENTS/);
});

test("Scribe captures documentation only after request or approval", () => {
  const scribe = text("skills/glasses/skills/scribe/SKILL.md");
  assert.match(scribe, /^---[\s\S]*name: scribe[\s\S]*description:/);
  assert.match(scribe, /\/glasses:scribe/);
  assert.match(scribe, /take notes|document decisions|project notes/i);
  assert.match(scribe, /must not create or update notes[\s\S]*unless the user explicitly requested/is);
  assert.match(scribe, /Never manage hidden AI memory/i);
  assert.match(scribe, /session notes/i);
  assert.match(scribe, /project notes workflow/i);
  assert.match(scribe, /always requires an approved documentation plan before writing/i);
  assert.match(scribe, /claim ledger/i);
  assert.match(scribe, /observed.*user-confirmed.*inferred.*gap/is);
  assert.match(scribe, /user's language[\s\S]*create or update[\s\S]*notes/i);
  assert.match(scribe, /write only the approved artifacts/i);
  assert.match(scribe, /docs\/scribe\/project-map\.md/);
  assert.match(scribe, /\$ARGUMENTS/);
});

test("clarification questions are traceable across all skills", () => {
  for (const name of ["glasses", "pointer", "homework", "scribe"]) {
    const skill = text(`skills/glasses/skills/${name}/SKILL.md`);
    assert.match(skill, /Q1.*Q2/s, `${name} must label questions`);
    assert.match(skill, /preserve.*answer/is, `${name} must preserve answers`);
    assert.match(skill, /AskUserQuestion/);
    assert.match(skill, /request_user_input/);
    assert.match(skill, /exactly one\s+question/i);
    assert.match(skill, /stop immediately|final line.*stop/is);
    assert.match(skill, /question turn under 120 words/i);
  }
});

test("all skills default to concise decision-complete output", () => {
  const glasses = text("skills/glasses/skills/glasses/SKILL.md");
  const pointer = text("skills/glasses/skills/pointer/SKILL.md");
  const homework = text("skills/glasses/skills/homework/SKILL.md");
  const scribe = text("skills/glasses/skills/scribe/SKILL.md");
  assert.match(glasses, /200 words/);
  assert.match(pointer, /180 words/);
  assert.match(homework, /400\s+words/);
  assert.match(scribe, /250 words/);
  for (const skill of [glasses, pointer, homework, scribe]) {
    assert.match(skill, /do not repeat/i);
  }
});

test("Glasses, Pointer, Homework, and Scribe hand off without recursive bouncing", () => {
  const glasses = text("skills/glasses/skills/glasses/SKILL.md");
  const pointer = text("skills/glasses/skills/pointer/SKILL.md");
  const homework = text("skills/glasses/skills/homework/SKILL.md");
  const scribe = text("skills/glasses/skills/scribe/SKILL.md");
  assert.match(glasses, /invoke Pointer/i);
  assert.match(glasses, /invoke Homework/i);
  assert.match(text("skills/glasses/scripts/workflow-routing.mjs"), /glasses:scribe/);
  assert.match(glasses, /invoke Scribe/i);
  assert.match(glasses, /concrete\s+implementation diagnosis/i);
  assert.match(pointer, /invoke Glasses/i);
  assert.match(pointer, /invoke Homework/i);
  assert.match(homework, /invoke Glasses/i);
  assert.match(homework, /invoke Pointer/i);
  assert.match(scribe, /Invoke Homework/i);
  assert.match(scribe, /Invoke Pointer/i);
  assert.match(scribe, /Invoke Glasses/i);
  assert.match(pointer, /architecture|dependency|service boundary/i);
  assert.match(glasses, /do not hand back/i);
  assert.match(pointer, /do not hand back/i);
  assert.match(homework, /do not hand back/i);
  assert.match(scribe, /Do not hand back/i);
});

test("hook uses exec form and portable plugin-root path", () => {
  const hooks = json("skills/glasses/hooks/hooks.json");
  assert.deepEqual(Object.keys(hooks), ["hooks"]);
  const handler = hooks.hooks.SessionStart[0].hooks[0];
  assert.equal(handler.command, "node");
  assert.deepEqual(handler.args, [
    "${CLAUDE_PLUGIN_ROOT}/scripts/session-start.mjs",
    "SessionStart"
  ]);
  const subagent = hooks.hooks.SubagentStart[0].hooks[0];
  assert.equal(subagent.command, "node");
  assert.deepEqual(subagent.args, [
    "${CLAUDE_PLUGIN_ROOT}/scripts/session-start.mjs",
    "SubagentStart"
  ]);
});

test("mode parser accepts supported modes and rejects other values", async () => {
  const { parseMode } = await import("../skills/glasses/scripts/mode.mjs");
  for (const mode of ["medium", "high", "ultra", "off"]) assert.equal(parseMode(mode), mode);
  assert.equal(parseMode(" HIGH "), "high");
  assert.equal(parseMode("maximum"), null);
});

test("configuration falls back to high for absent, malformed, and invalid files", async () => {
  const { loadDefaultMode } = await import("../skills/glasses/scripts/mode.mjs");
  const dir = mkdtempSync(path.join(tmpdir(), "glasses config "));
  assert.equal(loadDefaultMode(path.join(dir, "missing.json")), "high");
  const config = path.join(dir, "config.json");
  writeFileSync(config, "{");
  assert.equal(loadDefaultMode(config), "high");
  writeFileSync(config, JSON.stringify({ defaultMode: "maximum" }));
  assert.equal(loadDefaultMode(config), "high");
  writeFileSync(config, JSON.stringify({ defaultMode: "medium" }));
  assert.equal(loadDefaultMode(config), "medium");
});

test("session hook handles Windows-style paths containing spaces", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "glasses home "));
  const configDir = path.join(dir, ".config", "glasses");
  mkdirSync(configDir, { recursive: true });
  writeFileSync(path.join(configDir, "config.json"), JSON.stringify({ defaultMode: "ultra" }));
  const result = spawnSync(process.execPath, [
    path.join(root, "skills/glasses/scripts/session-start.mjs"),
    "SessionStart"
  ], { env: { ...process.env, HOME: dir, USERPROFILE: dir }, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.match(output.hookSpecificOutput.additionalContext, /ultra/);
  assert.match(output.hookSpecificOutput.additionalContext, /PLAN THROUGH IMPLEMENTATION/);
  assert.match(output.hookSpecificOutput.additionalContext, /Inspect relevant code/);
  assert.match(output.hookSpecificOutput.additionalContext, /EXPLICIT USER SCOPE TAKES PRECEDENCE/);
  assert.match(output.hookSpecificOutput.additionalContext, /general informational or learning request: answer directly/i);
});

test("off mode does not inject the Glasses review rules", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "glasses off "));
  const configDir = path.join(dir, ".config", "glasses");
  mkdirSync(configDir, { recursive: true });
  writeFileSync(path.join(configDir, "config.json"), JSON.stringify({ defaultMode: "off" }));
  const result = spawnSync(process.execPath, [
    path.join(root, "skills/glasses/scripts/session-start.mjs"),
    "SessionStart"
  ], { env: { ...process.env, HOME: dir, USERPROFILE: dir }, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.hookSpecificOutput.additionalContext, "GLASSES MODE OFF");
});

test("behavior fixtures contain excess and necessary complexity", () => {
  const cases = json("tests/fixtures/behavior-cases.json");
  assert.ok(cases.some(item => item.expectedRemoved.length > 0));
  assert.ok(cases.some(item => item.expectedRetained.some(value =>
    /security|validation|integrity|accessibility|correctness|test/i.test(value))));
});

test("repository validator passes", () => {
  execFileSync(process.execPath, [path.join(root, "scripts/validate.mjs")], {
    cwd: root,
    stdio: "pipe"
  });
});

test("Codex plugin reuses the canonical skill and lifecycle hooks", () => {
  const manifest = json("skills/glasses/.codex-plugin/plugin.json");
  assert.equal(manifest.version, json("package.json").version);
  assert.equal(manifest.name, "glasses");
  assert.equal(manifest.skills, "./skills/");
  assert.equal(manifest.hooks, undefined);
  const marketplace = json(".agents/plugins/marketplace.json");
  assert.equal(marketplace.plugins[0].source.path, "./skills/glasses");
});

test("Copilot plugin reuses the canonical skill and hooks", () => {
  const manifest = json("skills/glasses/plugin.json");
  assert.equal(manifest.name, "glasses");
  assert.deepEqual(manifest.skills, ["skills/"]);
  assert.equal(manifest.hooks, "hooks/copilot-hooks.json");
  const hooks = json("skills/glasses/hooks/copilot-hooks.json");
  assert.ok(hooks.hooks.sessionStart);
  assert.ok(hooks.hooks.subagentStart);
});

test("Gemini extension loads an always-on Glasses context and manual command", () => {
  const manifest = json("gemini-extension.json");
  assert.equal(manifest.name, "glasses");
  assert.equal(manifest.contextFileName, "skills/glasses/skills/glasses/SKILL.md");
  const context = text(manifest.contextFileName);
  assert.match(context, /planning through\s+implementation/i);
  assert.match(context, /Workflow routing/i);
  assert.match(context, /invoke Scribe/i);
  assert.match(text("commands/glasses.toml"), /{{args}}/);
  assert.match(text("commands/pointer.toml"), /bounded diagnostic pass/i);
  assert.match(text("commands/pointer.toml"), /explicit approval/i);
  assert.match(text("commands/homework.toml"), /research plan/i);
  assert.match(text("commands/homework.toml"), /validation plan/i);
  assert.match(
    text("commands/scribe.toml"),
    /user's language[\s\S]*create or update these notes/i
  );
  assert.match(text("commands/scribe.toml"), /Never create or update notes/i);
});

test("README documents CLI harness support for all routes", () => {
  const readme = text("README.md");
  assert.match(readme, /CLI harness support/);
  assert.match(readme, /Language behavior/);
  assert.match(readme, /does not translate[\s\S]*source code[\s\S]*identifiers/i);
  for (const harness of [
    "Claude Code plugin",
    "GitHub Copilot plugin",
    "Codex plugin",
    "Gemini CLI extension",
    "OpenCode adapter"
  ]) {
    assert.match(readme, new RegExp(harness));
  }
  assert.match(readme, /Stepped questions/);
  assert.match(readme, /Approval gates/);
  assert.match(readme, /Scribe notes/);
  assert.match(readme, /workflow-routing\.mjs/);
});

test("OpenCode adapter injects the canonical policy", () => {
  const adapter = text("adapters/opencode/glasses.mjs");
  assert.match(adapter, /experimental\.chat\.system\.transform/);
  assert.match(adapter, /skills.*glasses.*SKILL\.md/s);
  assert.match(adapter, /workflowRoutingPolicy/);
  assert.match(adapter, /EVERY IMPLEMENTATION PLAN/);
});
