---
name: reversa
description: Recovers business rules, especially undeclared ("restricted") ones, from an existing codebase one part at a time, guided by the user, with file:line evidence, a decimal confidence score, and an enforcement axis for systems that use LLMs. Use when the user invokes /glasses:reversa, asks to extract, recover, or map the business rules hidden in existing code, or wants to know what a legacy module or prompt actually enforces; do not use for full system documentation, architecture diagrams, or specs.
---

# Reversa

The nerd digs through the code for the rules nobody wrote down.

`$ARGUMENTS` optionally names the part to dig (module, folder, feature,
handler, prompt) and the target project. Without it, ask which part before
reading anything. One part per run; the user picks the part.

Reversa recovers business rules from existing code, focused on **restricted**
rules: the ones the system enforces but nobody declared in an ADR, spec, or
doc. It is not full documentation: no architecture, diagrams, Gherkin, SDD
specs, or narrative. It distills the Reversa method (Macedo & Costa,
arXiv 2605.18684) into one short pass guided by someone who knows the business.

## Rule 0 — read-only

Do not change the target project: no file created, edited, moved, or
formatted; no state-changing command (`git checkout`, `npm install`,
migrations, builds that emit artifacts). Findings go in the conversation.
Write a file only when the user asks, at the path they give.

## Language preservation

Respond in the language of the user's latest request, determined only from
user-authored natural-language task content, unless they explicitly request
another language. Do not infer the response language from slash-command
scaffolding, injected hooks, skill text, or a system or developer instruction.
Short acknowledgements and command invocations do not change the task language.
Localize all workflow prose, including headings, labels, question subjects,
options, rule descriptions, table headers, and completion reports. Any English
examples in this skill specify meaning, not literal output.

Preserve source code, identifiers, commands, file paths, configuration keys,
tool names, and error or log output without translation. The markers stay in
English in every language: `[CODE]`, `[PROMPT]`, `[POC]`, `[SIMULATION]`,
`restricted`, the Type, Declared, Severity, and Outcome values below, and the
decimal confidence format (`0.00` to `100.00`, dot separator).

## Confidence score

Every claim carries a confidence from `0.00` to `100.00`, two decimals. No
exceptions. The number is a judgment anchored to the bands below, not a
calibrated probability: two decimals are format, not precision.

| Band | Meaning | Requires |
|---|---|---|
| `90.00`–`100.00` | Confirmed: direct evidence in code or a verifiable artifact (test, migration, versioned config) | `file:line`; `100.00` only with a test or run that proves it |
| `50.00`–`89.99` | Inferred: deduced from patterns, names, structure, or partial evidence. Never written as certainty ("seems", "suggests", "likely") | cited hint |
| `0.00`–`49.99` | Gap: the code cannot answer; needs human validation | goes to the gap table, not the rule table |

Caps no judgment can exceed:

- no `file:line` → at most `89.99`;
- `[PROMPT]` without a behavior test → at most `70.00`;
- `[POC]`/`[SIMULATION]` not validated by the user → at most `50.00`.

## Enforcement axis

In LLM systems, a rule that exists is not a rule that holds. Mark who
enforces it:

- `[CODE]` — the system enforces it; the model cannot bypass it (validation,
  guard, filter, schema, permission).
- `[PROMPT]` — only asked of the model in an instruction or prompt; it can
  fail. Confirming it takes a behavior test, not code reading.
- `[POC]` or `[SIMULATION]` — exists only in a mock, fixture, stub, or
  simulated code. Not a product rule until the user validates it.

Systems without an LLM use only `[CODE]` and `[POC]`.

## Steps per part

### 1. Map

Find where the part starts and where it decides: entry points (routes,
handlers, jobs, commands, system prompts), per-tenant or per-environment
config and flags, services called from them. Do not read the whole project.
Output: a short list of target files (aim for 5 to 15), one line each on why
it is in. If the part is too big for one pass, say so and propose a cut; the
user decides.

### 2. Dig

Read the target files looking for signals:

- conditionals with business terms;
- validations, numeric limits, timeouts, max sizes, quotas;
- status enums and fields, and the transitions the code allows;
- allow and deny lists, roles, feature flags;
- prompt text that requires, forbids, or prioritizes something;
- `git log` and `git blame` on the target files: fix, hotfix, and revert
  commits reveal expected behavior, and the message explains why;
- `TODO`, `FIXME`, `HACK`, and old comments: evidence of intent.

Output: a list of signals, each with `file:line` and the relevant snippet.
No interpretation yet.

### 3. Interpret

Turn each signal into a rule in business language, as if explaining to a PO:
"orders above $5,000 require manager approval", not
"`if amount > 5000 then requireApproval()`". Set the Type: `restriction`,
`permission`, `state`, `limit`, or `routing`.

A signal below `50.00` does not become a rule: it becomes a question in the
gap table. Never write a claim the code does not support; omitting beats
inventing.

### 4. Cross-check

Compare each rule with what was declared: ADRs, decision logs, specs, repo
docs, tickets, or any source the user provides. Ask once which sources exist;
do not search beyond what was named.

- Declared and matches the code → `yes`.
- Declared but differs from the code → `diverges`, plus a `critical` gap.
- Declared nowhere → **`restricted`**. This is the main finding.

### 5. Review

A separate pass after the other four are closed. Go back to the code for every
rule between `50.00` and `89.99` and reassess: direct evidence found → move up
to the confirmed band; none found and the code cannot answer → drop below
`50.00` and turn it into a question. Log each change (`62.00→93.00`). Recheck
confirmed rules too: without `file:line`, apply the `89.99` cap; verify the
`[PROMPT]` and `[POC]` caps.

## Output

### Rules

| # | Rule | Type | Enforcement | Evidence | Declared | Conf. |
|---|---|---|---|---|---|---|

Type: `restriction`, `permission`, `state`, `limit`, `routing`. Enforcement:
`[CODE]`, `[PROMPT]`, `[POC]`. Evidence: `file:line` or commit; never empty
(no evidence means gap). Declared: `yes`, `diverges`, or **`restricted`**.
Conf.: decimal from `50.00` to `100.00`, e.g. `87.50`.

### Gaps

| # | Question | Severity | Owner | Outcome |
|---|---|---|---|---|

Severity: `critical` (blocks understanding or reimplementing the part),
`moderate`, `cosmetic`, or `out-of-scope`. Owner: who can answer (business,
dev, infra). Outcome: `open`, `resolved`, `residual`, or `out-of-scope`,
updated as the user answers.

### Part close

In at most 120 words beyond the tables:

- count per band (`≥ 90.00` / `50.00–89.99` / gaps) and how many rules are
  `restricted`;
- open `critical` gaps;
- target files covered over mapped;
- reclassifications made in review.

State explicitly that these numbers measure **coverage, not correctness**. The
paper itself admits its 97% confidence index was self-assessed, not audited;
precision comes from the user's review. Rules that live in data (parameter
tables, config in a database) or only appear at runtime need other
instruments: list them as gaps and do not pretend to have extracted them. Do
not sum or average confidences into a single index: that repeats the paper's
self-assessed index mistake.

## Interaction

Ask little, at the right time:

1. At the start, if `$ARGUMENTS` does not say: which part, and which declared
   sources exist (`Q1 — ...`).
2. During the steps, only if a `critical` gap blocks mapping. Other questions
   wait for the gap table.
3. At the close: walk the `critical` gaps with the user if they want, then
   ask which part comes next.

Label questions in sequence (`Q1 — ...`, `Q2 — ...`) and keep the answers
within the part. Prefer the native question tool (`AskUserQuestion` in Claude
Code, `request_user_input` in Codex) with exactly one question; invoke it and
stop. Without a native tool, put the question on the last line and stop. Keep
each question under 120 words.

Do not move to another part on your own, even if the next one looks obvious.
Do not turn findings into a fix plan: a bug found while digging becomes a gap
with an owner; if the user wants a diagnosis, invoke Pointer with the
evidence. If they want the result saved to a file, invoke Scribe with the
tables and the close; Reversa does not write.
