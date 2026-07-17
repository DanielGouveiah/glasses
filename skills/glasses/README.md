# Glasses

Put your glasses on before you pay for the code. Glasses challenges
implementation plans, removes complexity that lacks evidence, and keeps the
resulting implementation inside the approved plan.

Glasses is self-contained and has no companion-skill dependency.

Use `/glasses:pointer [target]` for one bounded evidence conversation over an
implementation. Pointer asks one question at a time, presents correction
options, and applies the accepted plan once without an autonomous loop.

Use `/glasses:homework [research target]` to clarify and research an external
technical claim. Homework asks numbered questions, gets approval for its
research plan, and separately requests approval before one validation
experiment.

Use `/glasses:scribe [note target]` to capture approved notes, handoffs,
project documentation, and visible project memory. Scribe may recommend notes
from session context, but it never writes notes or memory files unless the user
requested or approved that specific write.

Glasses, Pointer, Homework, and Scribe use guarded handoffs between planning,
implementation diagnosis, external research, and documentation capture.

See the [full documentation](https://github.com/DanielGouveiah/glasses).
