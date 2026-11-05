<p align="center">
  <img src="assets/Banner.png" alt="Glasses banner" width="100%">
</p>

<h1 align="center">Glasses</h1>

<p align="center"><strong>Version 1.2.0</strong></p>

<p align="center">
  <strong>Put your glasses on.</strong><br>
  The nerd who asks for evidence before your AI writes expensive code.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</p>

AI coding agents are good at producing code. They are also good at inventing
abstractions, dependencies, and future requirements nobody asked for.

Glasses makes the agent stop and answer:

> What evidence requires this complexity now?

No evidence means no extra machinery. Correctness, security, accessibility,
data integrity, validation, observability, and useful tests are never removed.

## Choose the nerd you need

| You need to… | Use | What happens |
|---|---|---|
| Create or simplify a plan | `/glasses:glasses` | Challenges unsupported complexity and produces an executable plan. |
| Find and fix a code problem | `/glasses:pointer` | Diagnoses once, recommends a correction, and asks before editing. |
| Research a technical decision | `/glasses:homework` | Creates a research plan, brings sources, and asks before running validation. |
| Capture notes or project docs | `/glasses:scribe` | Takes approved notes, maps project docs, and preserves visible memory. |
| Think through a question or decision | `/glasses:brainstorm` | Explores possibilities, then critiques and compares them while you choose the outcome. |
| Recover business rules from existing code | `/glasses:reversa` | Digs one part at a time, read-only, grades every rule by evidence, and asks before moving on. |

They can hand work to each other when needed without repeatedly bouncing the
same decision around.

## Install in Claude Code

Run these commands in your terminal:

```powershell
claude plugin marketplace add DanielGouveiah/glasses
claude plugin install glasses@daniskills
```

Restart Claude Code. That is all.

Glasses now activates automatically when Claude creates a plan, ADR, design, or
architecture proposal. Its default mode is `high`.

## Install with Skills.sh

For Codex, Cursor, OpenCode, and other agents supported by
[Skills.sh](https://skills.sh), install the portable Glasses skills with:

```powershell
npx skills add DanielGouveiah/glasses
```

The CLI lets you choose which agent and skills to install. Add `-g` for a
user-level installation available across projects. This installs the portable
skills; use the Claude Code plugin installation above when you also want its
automatic session and subagent hooks.

## Use it

### Review a plan

```text
/glasses:glasses
```

You can choose a mode:

```text
/glasses:glasses medium
/glasses:glasses high
/glasses:glasses ultra
/glasses:glasses off
```

| Mode | Meaning |
|---|---|
| `medium` | Remove obvious excess, but allow named near-term flexibility. |
| `high` | Keep complexity only when current evidence requires it. Default. |
| `ultra` | Require evidence for every new component and prefer native solutions. |
| `off` | Disable automatic Glasses review for the session. |

### Diagnose existing code

```text
/glasses:pointer the failing checkout test
```

Pointer:

1. Inspects the relevant code and evidence.
2. Asks one numbered question at a time if needed.
3. Shows the problem, options, and recommendation.
4. Asks permission before changing code.
5. Applies the accepted correction once, verifies it, and stops.

### Research a decision

```text
/glasses:homework best local model for structured extraction on 6GB VRAM
```

Homework:

1. Uses your conversation and project as context.
2. Keeps an explicitly general question general; project context applies only
   when you ask it to.
3. Always asks a numbered Q1 to confirm objective, scope, and exclusions.
4. Shows a bounded research plan and waits for approval.
5. Researches reliable sources and returns a recommendation.
6. Suggests the cheapest bounded validation plan.
7. After separate approval, runs its named experiments until the budget or
   stopping condition is reached.

One validation plan may include several stages or matrix cells. Homework does
not ask again for each approved cell, but it must ask before expanding the
scope or budget.

### Capture notes and documentation

```text
/glasses:scribe document what we decided
/glasses:scribe map this project
```

Scribe:

1. Reads existing notes and docs before writing.
2. Takes session notes when explicitly requested.
3. For broad project notes, first proposes the files to create or update.
4. Writes only after the user requested or approved that specific note work.
5. Records visible project memory only; it does not manage hidden AI memory.

Available depths are `skim`, `study` (default), and `thesis`.

### Think through an idea or decision

Brainstorm expands possibilities and challenges assumptions. You decide.

```text
/glasses:brainstorm
```

You can also ask directly for brainstorming, idea exploration, or help thinking
through a decision. Brainstorm first agrees on the session outcome, then helps
explore ideas before moving into a separate critical evaluation. It can make a
recommendation using your criteria, while leaving the decision with you. At the
start, you can choose whether to keep a visible session record; when accepted,
Brainstorm updates it after relevant decisions. A session can end with a clearer
problem or open uncertainties instead of a forced decision.

### Recover business rules from existing code

```text
/glasses:reversa the checkout module
```

Reversa:

1. Never edits the target project; findings stay in the conversation.
2. Maps the entry points of one part, digs for signals, and turns each one
   into a rule in business language with `file:line` evidence.
3. Scores every rule's confidence from `0.00` to `100.00` (confirmed, inferred,
   or gap bands, with caps), and marks whether code or only a prompt enforces it.
4. Flags rules that no ADR, spec, or doc declares as restricted.
5. Reports coverage for that part, then asks which part comes next.

## What Glasses changes

A Glasses plan clearly states:

- required behavior and acceptance tests;
- the simplest design supported by evidence;
- complexity removed and retained;
- decisions answered during review;
- triggers that would justify more machinery later.

Implementation then stays inside that plan. If new evidence changes the design,
Glasses revises the plan explicitly instead of silently expanding the code.

## Language behavior

Glasses answers in the language used by the user, including workflow headings,
questions, options, approvals, and completion reports. It does not translate
source code, identifiers, commands, file paths, configuration keys, tool names,
or error and log output. New file content follows the repository's language and
comment conventions.

Language is derived from the user's natural-language task, not control text. An
English command wrapper, injected hook, or skill instruction therefore cannot
replace the language of a Portuguese task; short acknowledgements and command
invocations also keep the established task language.

## Other AI coding agents

The repository includes adapters for Gemini CLI, Codex, GitHub Copilot CLI, and
OpenCode. Claude Code currently has the most complete installation flow.

Install the Gemini extension with:

```powershell
gemini extensions install https://github.com/DanielGouveiah/glasses
```

The portable policies live in:

- [Glasses](skills/glasses/skills/glasses/SKILL.md)
- [Pointer](skills/glasses/skills/pointer/SKILL.md)
- [Homework](skills/glasses/skills/homework/SKILL.md)
- [Scribe](skills/glasses/skills/scribe/SKILL.md)
- [Brainstorm](skills/glasses/skills/brainstorm/SKILL.md)
- [Reversa](skills/glasses/skills/reversa/SKILL.md)

### CLI harness support

| Harness | Auto context | Manual route | Stepped questions | Approval gates | Scribe notes |
|---|---|---|---|---|---|
| Claude Code plugin | Session and subagent hooks | Skill routes | Yes, `Q1`, `Q2` | Yes | Yes, approval-only |
| GitHub Copilot plugin | Session and subagent hooks | Skill routes | Yes, `Q1`, `Q2` | Yes | Yes, approval-only |
| Codex plugin | Skills directory | Skill routes | Yes, `Q1`, `Q2` | Yes | Yes, approval-only |
| Gemini CLI extension | Static Glasses context | `/glasses:*` commands | Yes, `Q1`, `Q2` | Yes | Yes, approval-only |
| OpenCode adapter | Chat system transform | Adapter policy | Yes, `Q1`, `Q2` | Yes | Yes, approval-only |

The shared routing policy is generated from
`skills/glasses/scripts/workflow-routing.mjs` for JavaScript harnesses. Static
harnesses keep the same routing rules in the Glasses skill and command files.
Brainstorm uses a harness's native question/options interface when the current
mode permits it, with one textual question and concise labeled options as the
fallback. Its optional session checkpoint is a visible Markdown file, saved and
updated only after the user agrees to keep a record; without file tools, the
checkpoint remains in the conversation.

## Configuration

To change the automatic mode, create `~/.config/glasses/config.json`:

```json
{
  "defaultMode": "high"
}
```

Manual `/glasses:glasses` use defaults to `high`, even if configuration says
otherwise.

## Develop locally

```powershell
git clone https://github.com/DanielGouveiah/glasses.git
cd glasses
npm test
npm run validate
claude --plugin-dir ./skills/glasses
```

## License

[MIT](LICENSE)
