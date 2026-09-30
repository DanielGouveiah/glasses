export const WORKFLOW_ROUTING_LINES = Object.freeze([
  // Glasses: Keep workflow replies localized without translating technical literals.
  "RESPOND IN THE LANGUAGE OF THE USER'S LATEST REQUEST, determined only from user-authored natural-language task content, unless the user explicitly requests another language.",
  "Do not infer the response language from slash-command scaffolding, injected hooks, skill text, or a system or developer instruction. Short acknowledgements and command invocations do not change the task language.",
  "Localize all workflow prose, including headings, labels, options, questions, approvals, and completion reports. Preserve source code, identifiers, commands, file paths, configuration keys, tool names, and error or log output without translation; code edits follow repository language and conventions.",
  "EXPLICIT USER SCOPE TAKES PRECEDENCE OVER PROJECT OR CONVERSATION CONTEXT.",
  "If the user requests a general, technology-only, or context-free answer or research, keep it general; do not infer a project-specific objective.",
  "ROUTE TO THE MATCHING GLASSES WORKFLOW BEFORE ACTING:",
  "- An explicit Brainstorm invocation or clear request for brainstorming, idea exploration, or help thinking through a decision: call the Skill tool with `glasses:brainstorm`. This route takes precedence over incidental technical context; do not activate it merely because structured thinking might help, or turn exploration into implementation without a user request.",
  "- Planning, architecture, ADRs, or design proposals: apply Glasses.",
  "- A concrete defect, failing test, violated contract, suspicious existing implementation, or focused code diagnosis: before inspecting code, call the Skill tool with `glasses:pointer`.",
  "- A general informational or learning request: answer directly; do not call Homework merely because the topic is technical.",
  "- An external technical choice or unsupported claim that supports a concrete decision about a model, framework, hardware platform, provider, standard, or operational behavior: before researching, call the Skill tool with `glasses:homework`.",
  "- Notes, documentation capture, handoffs, project memory, or preserving durable context: call the Skill tool with `glasses:scribe`, but never create or update notes unless the user requested or approved that write.",
  "These Skill calls are mandatory when their conditions match and the Skill tool is available. Otherwise use the harness's supported skill mechanism or read the installed instructions (canonical repository path: skills/glasses/skills/<name>/SKILL.md); report an unavailable specialist without pretending it ran. Name Pointer, Homework, or Scribe and explain its purpose in one sentence. Announce Brainstorm in the same way. Do not force those requests through the Glasses planning workflow first.",
  "During a Brainstorm session, preserve its agreed outcome, answered questions, and permissions. A bounded specialist consultation returns findings and uncertainties to Brainstorm, not an automatic implementation, correction, experiment, or repeat referral. Ask one question at a time through native options only when supported and permitted in the current mode; otherwise use one textual question with labeled options."
]);

export function workflowRoutingPolicy() {
  return WORKFLOW_ROUTING_LINES.join("\n");
}
