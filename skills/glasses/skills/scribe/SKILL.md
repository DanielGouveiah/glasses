---
name: scribe
description: Captures approved session notes, project documentation, handoffs, ADRs, and visible project memory from conversations or repository inspection. Use when the user invokes /glasses:scribe, asks to take notes, document decisions, create or update project notes, map a project into docs, preserve context, write a handoff, update visible memory, or when Glasses identifies durable context worth recommending for documentation.
---

# Scribe

The nerd takes notes only after consent.

`$ARGUMENTS` optionally provides the note target, scope, or output format.
Scribe may inspect and recommend documentation from the current session, but it
must not create or update notes, docs, handoffs, ADRs, project memory, or agent
memory unless the user explicitly requested that write or approved the specific
Scribe documentation plan.

Never manage hidden AI memory. Durable memory must be visible, reviewable files
inside the project.

## Language preservation

Respond in the language of the user's latest request unless they explicitly
request another language. Localize all workflow prose, including headings,
labels, question subjects, options, recommendations, approval prompts, and
completion reports. Any English examples in this skill specify meaning, not
literal output.

Preserve source code, identifiers, commands, file paths, configuration keys,
tool names, and error or log output without translation. When creating or
editing files, keep the repository's programming language, naming, terminology,
and comment conventions. Applicable repository instructions override the
general conversation-language preference for file content.

## Establish scope

Classify the request before writing:

- `session notes`: a conversation, design discussion, debugging pass, or task.
- `decision record`: a durable decision with rationale and consequences.
- `handoff`: continuation context for another agent or future session.
- `project notes`: repository-level documentation derived from code and docs.
- `visible memory`: canonical project or agent context files such as
  `CONTEXT.md`, `AGENTS.md`, or `docs/agents/*.md`.

If the user already asked to take notes or update a specific file, that is the
write authorization for that named scope. If the user only asks whether
something is worth documenting, recommends notes, or asks Scribe to inspect the
project, do not write yet.

When missing information changes the note scope or target artifact, ask one
decision-changing question at a time. Label questions sequentially with a short
subject (`Q1 â€” ...`, `Q2 â€” ...`) and preserve answers in the note or plan.
Prefer the platform's native question tool (`AskUserQuestion` in Claude Code or
`request_user_input` in Codex) when available. Ask exactly one question, stop
immediately, and continue only after the user answers. If no native question
tool is available, put the question on the final line and stop. Keep the entire
question turn under 120 words.

## Session notes workflow

Use for explicit requests such as "take notes", "document what we decided", or
"make a handoff".

1. Inspect existing note, ADR, handoff, and agent-context conventions.
2. Capture only durable content: decisions, rationale, constraints, open
   questions, accepted next actions, commands worth reusing, and verified facts.
3. Exclude transient debugging noise, unsupported speculation, private details
   not approved for recording, and hidden reasoning.
4. Mark important claims as `observed`, `user-confirmed`, `inferred`, or `gap`
   when traceability matters.
5. Create or update only the requested artifact. If no target exists, prefer
   the smallest conventional location already used by the project, otherwise
   propose `docs/notes/YYYY-MM-DD-topic.md`.
6. Report the file changed and the remaining gaps. Do not produce a feature
   tour.

## Project notes workflow

Use for broad requests such as "map this project", "create project notes",
"document this codebase", or "update project memory".

Project mode always requires an approved documentation plan before writing,
even when the user asked Scribe to inspect the repository.

1. Inspect existing docs and memory surfaces: `README.md`, `AGENTS.md`,
   `CONTEXT.md`, `CLAUDE.md`, `GEMINI.md`, `docs/`, ADRs, manifests, commands,
   hooks, tests, and major source directories.
2. Map the project surface: purpose, entry points, workflows, module boundaries,
   runtime commands, test strategy, existing decisions, and documentation gaps.
3. Build a claim ledger. Tie important claims to source files and label each as
   `observed`, `user-confirmed`, `inferred`, or `gap`. Do not turn inference
   into certainty.
4. Present a documentation plan with:
   - files to create or update;
   - why each file is needed;
   - evidence sources;
   - confidence and gaps;
   - excluded areas.
5. End the plan by asking, in the user's language, whether to create or update
   the notes.

Ask this approval through the platform's native question tool when available,
with localized options for creating or updating the notes, or revising the
plan. Invoke the tool and stop. Otherwise put the localized question on the
final line and stop. Wait for explicit approval.

After approval, write only the approved artifacts. Default proposed locations
are:

- `docs/scribe/project-map.md` for repository structure and workflows;
- `docs/scribe/architecture.md` for architecture and boundaries;
- `docs/scribe/domain-glossary.md` for project vocabulary;
- `docs/scribe/gaps.md` for unknowns and validation questions;
- `CONTEXT.md` for canonical project memory, only when requested or approved;
- `AGENTS.md` or `docs/agents/*.md` for agent operating context, only when
  requested or approved.

## Documentation quality

Keep notes concise and operational. A future agent or engineer should know what
is true, where the evidence is, what remains unknown, and what action is next.
Target 250 words for a straightforward session note and expand only when the
project evidence, gaps, or approved artifact count requires it. Do not repeat
the same claim under several sections.

Use source-linked bullets over narrative when documenting a codebase. Prefer
short sections named:

- **Purpose**
- **Observed**
- **Decisions**
- **Workflows**
- **Gaps**
- **Next Actions**

Do not overwrite existing documentation style without reason. Update existing
canonical docs instead of creating duplicates when the project already has a
clear home for the information.

## Handoffs

Invoke Homework when documentation depends on an unsupported external claim
about a framework, provider, standard, or technical practice. Preserve sources,
confidence, and gaps in the resulting notes after approval.

Invoke Pointer when a documentation request uncovers a concrete contradiction
between docs, tests, and implementation that needs focused diagnosis before the
note can be truthful.

Invoke Glasses when a documentation decision becomes an implementation plan,
ADR, architecture proposal, dependency strategy, or service-boundary decision.
Do not hand back to the same workflow for the same evidence or decision.
