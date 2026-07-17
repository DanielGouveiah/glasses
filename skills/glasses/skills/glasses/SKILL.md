---
name: glasses
description: Challenges implementation plans before code exists, then keeps implementation inside the evidence-backed plan while preserving mandatory quality. Use automatically when planning or implementing a coding task, ADR, technical design, service boundary, data model, dependency strategy, or architecture; use manually when the user invokes /glasses with an optional medium, high, ultra, or off mode.
---

# Glasses

When automatically activated, apply this workflow from planning through
implementation. Do not skip it because the user did not mention Glasses.

Review the proposed work before implementation. `$ARGUMENTS` optionally sets the
mode for this conversation. Supported modes are `medium`, `high`, `ultra`, and
`off`. For a manual invocation with no arguments, always use `high`, regardless
of the configured automatic mode. Begin every manual invocation by telling the
user, in their language, that Glasses is active and identifying the mode. With
no arguments, identify the mode as `high`.

A valid explicit mode replaces the configured mode for the rest of this
conversation. Reject invalid modes with the supported list. If mode is `off`, do
not activate automatically.

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

## Scope precedence

Explicit user scope takes precedence over project context. If the user asks for
a general, technology-only, or context-free explanation or research, answer at
that level and do not reinterpret it through the repository, company, or recent
conversation. Use project context only when the user asks to apply the answer
to that project or when it is necessary to answer the stated question. If scope
is genuinely ambiguous and the answer would materially differ, ask one scope
question; otherwise answer directly.

## Workflow routing

Before acting, route to the matching Glasses workflow:

- Planning, architecture, ADRs, or design proposals: apply Glasses.
- Concrete defects, failing tests, violated contracts, suspicious existing
  implementations, or focused code diagnosis: invoke Pointer.
- General informational questions or learning requests: answer directly; do not
  invoke Homework or add approval gates merely because the topic is technical.
- External technical choices or unsupported claims that must support a concrete
  decision about models, frameworks, hardware platforms, providers, standards,
  or operational behavior: invoke Homework.
- Notes, documentation capture, handoffs, project memory, or preserving durable
  context: invoke Scribe, but never create or update notes unless the user
  requested or approved that write.

Name Pointer, Homework, or Scribe and explain its purpose in one sentence when
handoff conditions match. Do not force those requests through the Glasses
planning workflow first.

## Evidence thresholds

- `medium`: remove obvious excess; allow named, near-term flexibility.
- `high`: retain complexity only for current requirements, repository decisions,
  measured constraints, or mandatory invariants.
- `ultra`: require evidence for every new component and strongly prefer existing,
  platform-native, or standard-library solutions.

## Plan review

1. Inspect relevant code, tests, documentation, dependency manifests, and
   recorded decisions. Do not judge a plan from its prose alone.
2. Restate the actual requirements, constraints, invariants, and exclusions.
3. Inventory every proposed abstraction, dependency, service, datastore,
   background process, layer, configuration surface, and extension point.
4. For each item, cite its evidence or challenge it under the active threshold.
5. Never trade away correctness, security, accessibility, data integrity,
   validation, observability needed to operate safely, or useful testing.
6. When evidence is missing and the answer changes the design, ask one
   decision-changing question at a time. Label them sequentially with a short
   subject (`Q1 — ...`, `Q2 — ...`), preserve their answers in the replacement
   plan, and do not batch or repeat questions. Prefer the platform's native
   question tool (`AskUserQuestion` in Claude Code or `request_user_input` in
   Codex) when available. Ask exactly one question, stop immediately, and
   continue only after the user answers. If no native question tool is
   available, put the question on the final line of the response and stop.
   Keep the entire question turn under 120 words: no preamble beyond one
   decision-relevant sentence, short options, and one recommendation sentence.
7. Continue until the design is decision-complete, then replace the original
   plan.

## Replacement plan

Lead with the decision-complete plan. Include only decision-relevant,
non-empty sections:

- required behavior and acceptance tests;
- the simplified design and implementation sequence;
- complexity removed, with reasons;
- complexity retained, with evidence;
- explicit upgrade triggers that would justify deferred machinery;
- unresolved decisions, if user input is still required.

Make the replacement executable by another engineer without inventing design
decisions. See [review rubric](references/review-rubric.md) for detailed tests.

Keep the default response concise and adaptive:

- use one line for each straightforward requirement, design decision, test, or
  upgrade trigger;
- combine removed and retained complexity into the design when the reason is
  obvious;
- do not repeat the same fact under multiple headings;
- target 200 words for a simple plan, expanding only for real ambiguity,
  severe risk, or multiple evidenced trade-offs;
- provide expanded rationale when the user asks for full detail.

## Implementation discipline

After the review, treat the replacement plan as a **complexity budget**:

1. Implement only required behavior and retained complexity. Prefer the
   smallest existing project seam that satisfies the plan.
2. Before adding machinery, check in order: existing code, standard library,
   native platform capability, and an already-installed dependency. Add a new
   component only when those do not satisfy evidenced requirements.
3. Keep changes localized. Do not perform an unrelated refactor, introduce
   optional configuration, or prepare extension points for hypothetical use.
4. If implementation reveals a requirement or constraint that changes the
   design, re-enter the evidence gate. Revise the plan explicitly instead of
   silently expanding the diff.
5. Add or update the smallest useful acceptance coverage for changed behavior.
   Run the relevant acceptance tests and repository checks before completion.
6. Finish when the approved behavior passes. Report what changed, verification,
   and deferred machinery only when it has a real upgrade trigger; do not add a
   feature tour. Target 150 words for a straightforward completion report.

Never reduce correctness, security, accessibility, data integrity, validation,
safe observability, or testing merely to reduce files or lines.

## Pointer handoff

Invoke Pointer when an existing implementation has a concrete failure, violated
contract, failing test, or log signal that needs focused implementation
diagnosis before the plan can be completed. Use this only for concrete
implementation diagnosis, not speculative risks or a routine second review.

When invoked by Pointer because a correction changes architecture, a dependency,
the data model, or a service boundary, complete the Glasses workflow for that
decision. Mark the handoff in the response and do not hand back to Pointer for
the same evidence or decision. The user may invoke Pointer later against the
implemented result.

## Homework handoff

Invoke Homework when a plan depends on an unsupported external claim about a
model, framework, hardware constraint, provider, standard, or operational
behavior. Do not use Homework for facts already established in the repository.

When invoked by Homework with researched evidence, complete the Glasses workflow
for that decision. Preserve its evidence, answered Q-labels, confidence, and
validation boundary. Do not hand back to Homework for the same evidence or
decision.
