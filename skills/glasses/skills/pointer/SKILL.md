---
name: pointer
description: Runs a bounded evidence conversation over an existing implementation, asks one decision-changing question at a time, presents correction options, and applies the accepted correction plan once. Use when the user invokes /glasses:pointer, asks Pointer to inspect or correct an implementation, or wants a focused diagnosis without an autonomous loop.
---

# Pointer

The nerd points at what does not add up.

Use one bounded diagnostic pass. `$ARGUMENTS` optionally identifies a diff,
file, feature, failure, or other target. If no target is supplied, inspect the
current implementation relevant to the user's request. Use the active Glasses
evidence threshold; default to `high` when none is active.

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

## Diagnostic pass

1. Read the requirements, changed code, nearby callers, tests, and recorded
   decisions needed to understand the target.
2. Run only focused existing checks needed to confirm or reject a suspected
   problem. Do not launch a broad exploratory test campaign.
3. Point out only problems supported by code, test output, logs, contracts, or a
   violated mandatory invariant. Do not report speculative risks or style taste.
4. Prioritize correctness, security, accessibility, data integrity, validation,
   and broken requirements before maintainability or unsupported complexity.
5. Do not edit code during diagnosis, redesign unrelated areas, or repeat the
   diagnosis autonomously.

## Evidence conversation

When missing evidence changes the diagnosis or correction:

1. Ask one decision-changing question at a time and wait for the answer. Label
   questions sequentially with a short subject (`Q1 — ...`, `Q2 — ...`) and
   preserve each answer in the accepted correction plan. Prefer the platform's
   native question tool (`AskUserQuestion` in Claude Code or
   `request_user_input` in Codex) when available. Invoke it with exactly one
   question, stop immediately, and continue only after the user answers. If no
   native question tool is available, put the question on the final line and
   stop.
   Keep the entire question turn under 120 words: no preamble beyond one
   decision-relevant sentence, short options, and one recommendation sentence.
2. Do not ask for information already available in the repository or supplied
   by the user.
3. Continue only until the problem and acceptance boundary are decision-complete.

Then present the real correction options, their trade-offs, and one recommended
option. Do not manufacture alternatives when only one evidenced fix exists.
Prefer the smallest targeted fix through an existing project seam.

## Output

Start with a localized finding count that retains the `Pointer` name.

For each finding, lead with its location, concrete problem, evidence, and
recommended fix. Use one compact paragraph or table row when the impact and fix
are obvious. Expand into separate impact, options, and trade-offs only when
they change the decision. Do not repeat the same fact under several labels.
Target 180 words for one straightforward finding and about 60 words per
additional straightforward finding.

After incorporating the user's answers, provide a localized heading for the
accepted correction plan containing the selected fixes and targeted acceptance
checks. Order findings by severity and omit praise, feature tours, and
low-value nits. End by asking, in the user's language, whether to apply this
correction plan.

Ask this approval through the platform's native question tool when available,
with localized options for applying or revising the plan. Invoke the tool and
stop. Otherwise put the localized question on the final line and stop. Wait for
explicit approval. Do not treat an unrelated follow-up as consent.

## Correction pass

After explicit approval:

1. Apply only the accepted correction plan. Do not expand scope when another
   possible improvement appears.
2. Preserve repository conventions and use the smallest targeted fix described
   in the finding.
3. Run the relevant targeted checks once.
4. Report applied corrections and verification results. If verification fails,
   point to the remaining failure and stop; do not start another diagnostic pass
   or correction loop automatically.

## Glasses handoff

Invoke Glasses instead of creating the correction plan when the smallest valid
correction changes architecture, adds or replaces a dependency, changes a data
model or service boundary, or requires a broader implementation plan. Pass the
evidence, answered questions, options, and acceptance boundary into that
handoff.

When invoked by Glasses for concrete implementation diagnosis, finish the
Pointer workflow for that decision and do not hand back to Glasses. If the
finding exceeds Pointer's correction boundary, report the escalation and stop;
the user decides the next handoff. This prevents recursive bouncing.

## Homework handoff

Invoke Homework when the diagnosis depends on unsupported external behavior of
a model, framework, hardware platform, provider, or standard. Pass the concrete
symptom, local evidence, answered Q-labels, and correction boundary.

When invoked by Homework because research indicates a concrete implementation
defect, finish the Pointer workflow for that finding. Do not hand back to
Homework for the same evidence or decision.
