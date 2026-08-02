# Design Mistakes

## Writing a guard as the negation of one case, not the full state space

**Context:** Writing a condition that gates behavior on a specific input state, such as "when the brief
supplies neither root."

**Mistake:** A guard phrased as the negation of a single named case reads as complete but implies every other
state is valid by omission. A partial-pair state — one root supplied, one missing — fell between "both
supplied" and "neither supplied" and bypassed every check built around that guard. It survived four rounds of
review before an independent evaluator caught it.

**Correction:** When a guard's condition is the negation of a single case, enumerate the full input state
space before accepting it, not just the one case the author had in mind.

## Prose that names no operation reads as an instruction

**Context:** Writing a procedure step for an agent to follow.

**Mistake:** A sentence with the grammar of an instruction — "Resolve this canonical skill directory through
the active entrypoint" — can survive design, planning, execution, and acceptance review without anyone
noticing it names no concrete mechanism. Grammatically it reads as a step; operationally it is unexecutable.

**Correction:** For every procedure step, confirm it names a concrete operation — a tool call, a check, a
comparison — not just a verb phrase shaped like one.
