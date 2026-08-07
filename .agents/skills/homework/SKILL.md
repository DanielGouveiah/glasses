---
name: homework
description: Researches external technical evidence for a decision using source-quality assessment, claim-level citations, contradiction checks, evidence-sufficiency gates, and bounded validation. Use when the user invokes /glasses:homework, asks Homework to research a technical choice, requests deep or thesis-grade technical research, or when a Glasses plan or Pointer diagnosis depends on unsupported external claims about models, frameworks, hardware, providers, standards, or operational behavior.
---

# Homework

The nerd does the homework and brings receipts.

`$ARGUMENTS` optionally provides a research question or target. Support three
depths. Treat source counts as planning ranges, not proof of completeness:

- `skim`: check a narrow claim with the fewest decisive sources, usually 1-3.
- `study`: compare a decision with primary evidence and independent
  cross-checking, usually 4-10 sources. This is the default.
- `thesis`: build an auditable evidence notebook, search for counterevidence,
  and continue until every decision-changing question is sufficiently supported
  or explicitly unresolved. Do not substitute a larger source count or longer
  report for this workflow.

Honor an explicit depth. Infer `thesis` when the user asks for deep,
comprehensive, exhaustive, or thesis-grade research. Depth controls evidential
work, not response verbosity.

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
   `Q1 - <localized subject>: <localized question>`
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

Q1 - <subject>: <question>
```

Do not prefix options with bullets or hyphens. Keep the localized recommendation
label separate from the options. Offer only materially different options and
stop after the final question line.

## Research plan

Before external research, present a plan containing:

- the decision to support;
- confirmed requirements, constraints, and exclusions;
- numbered research questions mapped to the clarification answers;
- depth and why it fits;
- evidence standards, preferred sources, and comparison criteria;
- search waves, source/time/token/cost ceilings, and stopping conditions;
- for `thesis`, the evidence-notebook fields and required audits.

Keep a straightforward research plan under 200 words. Combine related
constraints and criteria instead of creating a section for every list item.
Do not repeat assignment context already confirmed in the conversation.

End by asking, in the user's language, whether to run the research plan.

Ask this approval through the platform's native question tool when available,
with localized options for running or revising the plan. Invoke the tool and
stop. Otherwise put the localized question on the final line and stop. Wait for
explicit approval. Do not treat an unrelated reply as consent.

## Evidence notebook

For `thesis`, maintain an evidence notebook as working state. Do not create a
repository file unless the user asks. Keep it compact but auditable:

- **Question map:** research question, dependencies, and decision impact.
- **Source ledger:** source ID, type, relevant claims, authority for those
  claims, directness, methodology, currency, independence, limitations, and
  include/exclude status.
- **Claim ledger:** one material atomic claim, exact supporting passage or
  location, supporting and contradicting source IDs, status, and confidence.
- **Search log:** search wave, query or route, useful results, exclusions, and
  remaining gaps.

Assess reliability relative to the claim. Official documentation is strong for
documented product behavior but not automatically for comparative superiority.
A peer-reviewed paper is not automatically current or applicable. Multiple
pages repeating one underlying report are one evidence lineage, not independent
corroboration. Record material source limitations rather than hiding them in a
generic confidence score.

## Research pass

After approval:

1. Inspect applicable local context before searching so evidence is evaluated
   against the actual environment.
2. Search in waves:
   1. **Anchor:** specifications, official documentation, original datasets,
      and primary papers that define the subject.
   2. **Expansion:** follow references, terminology, implementations, and
      adjacent questions exposed by the anchors.
   3. **Corroboration:** seek independent evidence for decision-changing
      claims and operational reports for real-world behavior.
   4. **Adversarial:** search explicitly for failures, contrary findings,
      limitations, retractions, version drift, and plausible alternatives.
   5. **Closure:** target only unresolved claims and evidence gaps.
3. For `skim`, stop after decisive anchor evidence unless it conflicts. For
   `study`, run only applicable waves. For `thesis`, run every applicable wave;
   never skip the adversarial wave.
4. Prefer specifications and official documentation for defined behavior, then
   original papers, raw data, and reproducible benchmarks. Use maintainer or
   implementation reports for operational detail and community reports only
   for experience or leads.
5. Evaluate authority, directness, methodology, currency, independence, and
   applicability before relying on a source. Do not use popularity or search
   rank as a reliability proxy.
6. Decompose compound findings into atomic claims. Attach citations to the
   narrowest claim they support and retain enough passage context to detect
   qualification or reversal.
7. Record contradictions. Resolve them using claim-relative authority,
   methodology, applicability, date, and independence; do not decide by simple
   source majority. Preserve unresolved disagreement in the final brief.
8. Mark each research question `sufficient`, `partial`, or `insufficient`:
   - `sufficient`: a diligent reader can derive the decision-relevant answer
     from the evidence without filling a material gap from model memory;
   - `partial`: useful evidence exists, but a missing fact or unresolved
     contradiction could change the decision;
   - `insufficient`: the evidence cannot support a bounded answer.
9. Continue searching while a feasible query can resolve a decision-changing
   `partial` or `insufficient` question. Distinguish absence of evidence from
   evidence of absence. Abstain from unsupported conclusions.
10. Compare viable options against the confirmed constraints. Do not produce a
    generic web summary or manufacture alternatives.

### Stopping conditions

Stop when the applicable condition is met:

- `skim`: the narrow claim has decisive evidence or a material conflict has
  escalated the task beyond skim.
- `study`: the decision is supported, material claims are cross-checked, and
  remaining uncertainty is visible and unlikely to reverse the recommendation.
- `thesis`: every decision-changing question is sufficient or explicitly
  unresolved; the adversarial search found no unaddressed decisive evidence;
  new searches are yielding duplicate evidence lineages; and the approved
  ceiling is reached or further searching cannot change the recommendation.

Do not stop merely because a plausible recommendation appeared early. Do not
keep searching to meet a source-count target after evidential saturation.

## Citation and coverage audit

Before writing the decision brief:

1. Split material conclusions into atomic claims.
2. Check **correctness**: each citation entails the attached claim.
3. Check **completeness**: every externally verifiable, decision-changing claim
   has support or is labeled inference/unknown.
4. Check **source quality**: the cited source is appropriate for that claim and
   material limitations are disclosed.
5. Check **coverage**: every research question has a sufficiency status and all
   material contradictions are resolved or visible.
6. Remove unsupported decoration, redundant citations, and claims that exceed
   the evidence.

## Decision brief

Lead with the recommendation. Include only decision-relevant, non-empty
sections from:

- **Question**
- **Constraints**
- **Method and coverage**
- **Evidence**
- **Options and trade-offs**
- **Recommendation**
- **Confidence**
- **Contradictions and unknowns**
- **Smallest decisive validation**
- **Sources**

Do not repeat the same claim under evidence, trade-offs, and recommendation.
Combine sections when only one viable option remains. For `study`, target about
400 words plus source links; expand only for material uncertainty, severe risk,
or multiple viable trade-offs. For `thesis`, let evidential complexity determine
length, but keep the main recommendation scannable and move ledger detail into
compact tables or appendices only when it helps verification.

For `thesis`, report source lineages considered, material exclusions, research
question sufficiency, unresolved contradictions, and which evidence could still
change the recommendation. Distinguish sourced facts, measurements, reports,
and inference.

## Validation

Recommend the smallest bounded validation that could change the decision, not
the cheapest experiment regardless of evidential value. Prefer a cheaper test
when it is equally decisive. Permit a larger validation in `thesis` when no
smaller experiment can resolve the decision boundary.

Define:

- the experiments and their execution order;
- the expected evidence from each;
- the time, token, monetary, and hardware budget;
- stopping and early-exit conditions;
- resources or actions required from the user;
- the result that would reverse or materially revise the recommendation.

End by asking, in the user's language, whether to run the validation plan.

Ask this approval through the platform's native question tool when available,
with localized options for running or revising validation. Invoke the tool and
stop. Otherwise put the localized question on the final line and stop.

Run only after explicit approval. Execute every approved experiment available
within the stated budget until a stopping condition is reached, then audit and
report the combined evidence. Do not request separate approval for each matrix
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
answered Q-labels, confidence, and acceptance boundary. Do not hand back for
the same evidence or decision. This prevents recursive bouncing.
