---
name: homework
description: Researches external technical evidence for a decision, clarifies an unclear research target, produces an approved research plan, and recommends a bounded validation plan. Use when the user invokes /glasses:homework, asks Homework to research a technical choice, or when a Glasses plan or Pointer diagnosis depends on unsupported external claims about models, frameworks, hardware, providers, standards, or operational behavior.
---

# Homework

The nerd does the homework and brings receipts.

`$ARGUMENTS` optionally provides a research question or target. Support three
depths: `skim` for a narrow evidence check, `study` for balanced cross-checking
and the default, and `thesis` for explicitly broad research.

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

## Establish the assignment

Explicit general scope overrides project context. When the user asks to
research a topic generally or without applying it to their project, keep the
research and recommendation general; do not use the repository, company, or
recent conversation as hidden decision criteria. Use local context only when
the user requests a project-specific application or it is required by the
stated assignment.

1. Identify the supplied target and, only for an explicitly project-specific
   assignment, inspect the relevant conversation and local project context.
2. Infer the likely objective, scope, constraints, and exclusions, but treat
   them as unconfirmed.
3. Always ask Q1 before proposing a research plan or performing research, even
   when the assignment appears clear. Confirm the inferred objective, scope,
   and exclusions with the user, who can correct them. Do not replace this
   question with the research-plan approval.
4. After the Q1 answer, ask further decision-changing clarification questions
   one at a time only until the research target is clear. Ask as many as needed,
   but do not repeat resolved questions or ask for facts available locally.
5. Label questions sequentially with a short subject. The mandatory Q1 must
   name the inferred objective, scope, and exclusions; for example:
   `Q1 — <localized subject>: <localized question>`
   Continue with Q2, Q3, and so on. Preserve the labels and answers in the plan.
6. Prefer the platform's native question tool (`AskUserQuestion` in Claude Code
   or `request_user_input` in Codex) when available. Invoke it with exactly one
   question, stop immediately, and continue only after the user answers. If no
   native question tool is available, put the question on the final line and
   stop.
7. Keep the entire question turn under 120 words: no preamble beyond one
   decision-relevant sentence, short options, and one recommendation sentence.

When no native question tool is available and a question has multiple viable
answers, format it as:

```text
(a) <option and consequence>
(b) <option and consequence>
(c) <option and consequence>

<localized recommendation label>: <preferred option and concise evidence-based reason>

Q1 — <subject>: <question>
```

Do not prefix options with bullets or hyphens. Keep the localized recommendation
label separate from the options. Offer only materially different options and
stop after the final question line.

## Research plan

Before external research, present a plan containing:

- the decision to support;
- confirmed requirements, constraints, and exclusions;
- numbered research questions mapped to the clarification answers;
- evidence standards and preferred sources;
- depth, search budget, and comparison criteria;
- stopping conditions.

Keep a straightforward research plan under 200 words. Combine related
constraints and criteria instead of creating a section for every list item.
Do not repeat assignment context already confirmed in the conversation.

End by asking, in the user's language, whether to run the research plan.

Ask this approval through the platform's native question tool when available,
with localized options for running or revising the plan. Invoke the tool and
stop. Otherwise put the localized question on the final line and stop. Wait for
explicit approval. Do not treat an unrelated reply as consent.

## Research pass

After approval:

1. Inspect local context before searching so evidence is evaluated against the
   actual environment.
2. Prefer specifications and official documentation, then papers and
   reproducible benchmarks, then maintainer or implementation reports. Use
   community reports only for operational experience.
3. Cross-check material claims. Distinguish sourced facts, measurements,
   reports, and inference.
4. Compare viable options against the confirmed constraints. Do not produce a
   generic web summary or manufacture alternatives.
5. Stop when the decision is supported, the budget is exhausted, or remaining
   uncertainty cannot change the recommendation.

## Decision brief

Lead with the recommendation. Include only decision-relevant, non-empty
sections from:

- **Question**
- **Constraints**
- **Evidence**
- **Options and trade-offs**
- **Recommendation**
- **Confidence**
- **Unknowns**
- **Cheapest validation plan**
- **Sources**

Do not repeat the same claim under evidence, trade-offs, and recommendation.
Combine sections when only one viable option remains. For `study`, target 400
words plus source links; expand only for material uncertainty, severe risk, or
multiple viable trade-offs. Provide expanded rationale when the user asks for
full detail.

Recommend the cheapest bounded validation plan that could change the decision.
It may contain multiple experiments, stages, or matrix cells when the decision
requires comparative evidence. Define:

- the experiments and their execution order;
- the expected evidence from each;
- the time, token, monetary, and hardware budget;
- stopping and early-exit conditions;
- resources or actions required from the user.

End by asking, in the user's language, whether to run the validation plan.

Ask this approval through the platform's native question tool when available,
with localized options for running or revising validation. Invoke the tool and
stop. Otherwise put the localized question on the final line and stop.

Run only after explicit approval. Execute every approved experiment available
within the stated budget until a stopping condition is reached, then report the
combined evidence and stop. Do not request separate approval for each matrix
cell or stage already named in the approved plan.

Pause when required hardware, credentials, or user action is unavailable.
Request new approval before adding experiments, increasing the budget, changing
the decision boundary, or otherwise expanding the approved scope. Do not begin
an open-ended autonomous experimentation loop.

## Handoffs

Invoke Glasses after research when the evidence is ready to become or revise an
implementation plan. Invoke Pointer when the evidence identifies a concrete
defect in an existing implementation.

When invoked by Glasses or Pointer, preserve the passed decision, evidence,
answered Q-labels, and acceptance boundary. Do not hand back for the same
evidence or decision. This prevents recursive bouncing.
