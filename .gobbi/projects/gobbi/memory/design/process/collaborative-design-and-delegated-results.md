# Collaborative design and delegated results

## Intent

Gobbi treats every choice of structure, meaning, or contract as design work: architecture, strategy, naming,
vocabulary, functions, classes, interfaces, data shapes, and small local choices. The user decides a
consequential choice among options that independent participants studied and critiqued (Principle 3).
[Discussion](../../../skills/discussion/SKILL.md) owns that procedure, and Cowork and Workflow apply it in their
Ideation and Planning stages. Cowork has no Fast or Light depth; it runs Ideation when a request has an open
design choice and Planning when the work is too large for one task.

## Design participation

- Gather separate suggestions and critique from independent subagents, and from a read-only
  [Partner](../feature/partner.md) when the session policy allows one, scaled to the stakes of the choice.
- Keep one local creator as the sole writer and synthesizer of the design result.
- Resolve a gap before dependent work only when a wrong guess is costly to undo; otherwise state the
  assumption and continue. A user-owned decision goes through the runtime's structured-input tool, and a
  delegated agent sends it to the user-facing manager.
- After the user's design review in Workflow, and for a minor choice in Cowork, the manager rules each choice
  inside the accepted design itself and records `Ruling: <what> - <why> - <cost if wrong>`.

## Delegated work

- [Delegation](../../../skills/delegation/SKILL.md) is a general briefing skill for any project or field. A
  brief requires only a Goal and a Return; Role (one optional line), Context, Constraints, Taste and Preference,
  and Materials appear only when they have content. A Goal is an end state a reader can check, each Constraint
  carries a short reason, each taste names its source, and a brief is one self-contained task that points to
  paths instead of pasting history. New work goes to a fresh agent.
- The Handoff carries the evidence the caller needs. The caller accepts it only after reading the named result
  and rerunning the checks it relies on. Delegation defines the check outcomes passed, failed, and inconclusive,
  the measured-difference rule, and the Finding, Sources, and Limits return of a study result.
- Callers add their own required fields. Gobbi entry, Cowork, Workflow, the review skills, and the manager role
  hold role and phase choice, the skills and docs indexes in Materials, review independence, and report paths.
- Do not rely on conversation history or inherited skill loads.

## Ownership

The canonical [Cowork](../../../skills/cowork/SKILL.md), [Workflow](../../../skills/workflow/SKILL.md),
[Discussion](../../../skills/discussion/SKILL.md), and [Delegation](../../../skills/delegation/SKILL.md) skills
own these semantics. Generated plugin skills are projections of the canonical sources and must remain byte-equal.
