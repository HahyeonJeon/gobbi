# Collaborative design and delegated results

## Intent

Gobbi treats every choice of structure, meaning, or contract as design work. This includes architecture,
strategy, naming, vocabulary, functions, classes, interfaces, data shapes, and small local choices. Cowork
uses Fast only when no design or decomposition choice remains; Light applies Ideation and Planning to bounded
remaining choices. Workflow applies the same definition to every design-bearing productive step.

## Design participation

- Map every design choice to bounded, independent, read-only local evidence, alternatives, or critique from
  available active-runtime participants.
- Batch related minor choices only in a named assignment that lists every included choice.
- Keep one local creator as the sole writer and synthesizer. That creator receives the selected inputs,
  produces and self-reviews the draft, and completes the synthesis.
- When the session policy is enabled, obtain at least one independent Partner draft and one Partner
  cross-review over frozen input before synthesis. Each Partner prompt names the exact session directory and
  one exact writing path for its result; when the policy is disabled, invoke no external runtime.

## Delegated result contract

Every specialist brief names one authoritative result, exact locator or response subject, and acceptance proof.
The owning operation defines whether the result is a durable file, commit, or response without a result-kind
field. Durable design, evaluation, and Partner results use exact caller-named absolute paths with containment
and rereading checks; a printed Handoff references but never replaces a durable result.

## Delegation brief

The base brief order is Metadata, Context, Task, Instructions, Materials, Return.

- Context sits above Task. It holds working state and accepted decisions only.
- Materials is required and replaces Resources. It lists required skills-to-load with exact paths and read
  order, remaining sources, purpose, and conflict precedence.
- The Partner prompt template uses the same section names.

Do not rely on conversation history or inherited skill loads. The canonical
[Delegation](../../../skills/delegation/SKILL.md) and
[Partner](../../../skills/gobbi/partner/SKILL.md) skills own these section names.

## Ownership and protection

The canonical [Cowork](../../../skills/cowork/SKILL.md),
[Workflow](../../../skills/workflow/SKILL.md), and
[Delegation](../../../skills/delegation/SKILL.md) skills own these semantics. Workflow Phase 1 is now a section
of the main Workflow skill. Generated plugin skills are projections of the canonical sources and must remain
byte-equal.
