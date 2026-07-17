export const WORKFLOW_ROUTING_LINES = Object.freeze([
  // Glasses: Keep workflow replies localized without translating technical literals.
  "RESPOND IN THE LANGUAGE OF THE USER'S LATEST REQUEST unless the user explicitly requests another language.",
  "Localize all workflow prose, including headings, labels, options, questions, approvals, and completion reports. Preserve source code, identifiers, commands, file paths, configuration keys, tool names, and error or log output without translation; code edits follow repository language and conventions.",
  "EXPLICIT USER SCOPE TAKES PRECEDENCE OVER PROJECT OR CONVERSATION CONTEXT.",
  "If the user requests a general, technology-only, or context-free answer or research, keep it general; do not infer a project-specific objective.",
  "ROUTE TO THE MATCHING GLASSES WORKFLOW BEFORE ACTING:",
  "- Planning, architecture, ADRs, or design proposals: apply Glasses.",
  "- A concrete defect, failing test, violated contract, suspicious existing implementation, or focused code diagnosis: before inspecting code, call the Skill tool with `glasses:pointer`.",
  "- A general informational or learning request: answer directly; do not call Homework merely because the topic is technical.",
  "- An external technical choice or unsupported claim that supports a concrete decision about a model, framework, hardware platform, provider, standard, or operational behavior: before researching, call the Skill tool with `glasses:homework`.",
  "- Notes, documentation capture, handoffs, project memory, or preserving durable context: call the Skill tool with `glasses:scribe`, but never create or update notes unless the user requested or approved that write.",
  "These Skill calls are mandatory when their conditions match. Name Pointer, Homework, or Scribe and explain its purpose in one sentence. Do not force those requests through the Glasses planning workflow first."
]);

export function workflowRoutingPolicy() {
  return WORKFLOW_ROUTING_LINES.join("\n");
}
