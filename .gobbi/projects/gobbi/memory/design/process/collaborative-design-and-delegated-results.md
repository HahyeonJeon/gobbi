# Collaborative design and delegated results

## Intent

Gobbi treats every choice of structure, meaning, or contract as design work. This includes architecture,
strategy, naming, vocabulary, functions, classes, interfaces, data shapes, and small local choices. Cowork
may use Direct delivery only when its unresolved design-choice inventory is empty. Workflow applies the same
definition to every design-bearing productive step.

## Design participation

- Map every design choice to bounded, independent, read-only local evidence, alternatives, or critique from
  available active-runtime participants.
- Batch related minor choices only in a named assignment that lists every included choice.
- Keep one local creator as the sole writer and synthesizer. That creator receives the selected inputs,
  produces and self-reviews the draft, and completes the synthesis.
- When the session policy is enabled, obtain at least one independent Partner draft and one Partner
  cross-review over frozen input before synthesis. When it is disabled, invoke no external runtime.

## Delegated result contract

Every specialist brief names exactly one result kind: `file`, `commit`, or `response-only`. The owning
operation defines the locator and acceptance proof. Durable design and evaluation use an exact caller-named
absolute file, with containment and rereading checks; a printed response cannot replace that file. Commit and
response-only results remain valid only where their owning operation intentionally requires them.

## Ownership and protection

The canonical [Cowork](../../../skills/cowork/SKILL.md),
[Workflow](../../../skills/workflow/SKILL.md),
[Workflow Phase 1](../../../skills/workflow/phase-1/SKILL.md), and
[Delegation](../../../skills/delegation/SKILL.md) skills own these semantics. Generated plugin skills are
projections of those canonical sources and must remain byte-equal. The package synchronization validator and
its mutation tests protect both the semantic contract and canonical/generated ownership.
