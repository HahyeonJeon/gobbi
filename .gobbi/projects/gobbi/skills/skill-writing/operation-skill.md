# Writing an Operation Skill

Type-owned procedure for an outcome-focused SOP. Load only after the parent skill-writing procedure classifies
the target as `skill-type: operation`.

## Contents

- [Boundary](#boundary)
- [Required artifact set](#required-artifact-set)
- [Procedure](#procedure)
- [Completion checks](#completion-checks)

## Boundary

An operation skill tells an actor what to do, in what order, to produce one observable work outcome. It owns
triggers, preconditions, inputs, decisions, branches, failures, recovery, evidence, and completion.

An operation may carry preferences and named-tool facts, but they remain subordinate. Preferences live in
Principles and Rules. Only step-local tool facts live beside a step; larger reference material moves to a
direct child or separate tool skill. A skill with no ordered outcome returns to the parent classifier.

## Required artifact set

Every new or substantively revised operation ships four siblings:

```text
SKILL.md
scenarios.md
checklists.md
evaluation.md
```

`SKILL.md` uses this fixed shape:

```text
Frontmatter
Intro
Principles
Rules
Procedure
References
```

The parent is the sole policy owner. The companions exercise and verify parent clauses; they add no policy.

## Procedure

### S1 — Specify the operational contract

Write down:

- actor and trigger;
- preconditions and required authority;
- inputs and their trust boundaries;
- ordered state changes or decisions;
- outputs and side effects;
- failure and recovery expectations;
- observable completion evidence;
- non-goals and handoff boundaries.

If the outcome cannot be stated in one sentence, narrow the operation or split independent outcomes.

### S2 — Model the flow before prose

Lay out the happy path, branches, boundary conditions, failure paths, retry or rollback behavior, and terminal
states. Mark irreversible or externally visible actions as pause points. Identify which decisions require user
authority and which the operating agent may make from evidence.

### S3 — Write Frontmatter and Intro

Use the four-key frontmatter contract from the parent and stamp `skill-type: operation`. The Intro states the
outcome and load trigger in one or two short paragraphs. It does not contain procedure steps or owner links.

### S4 — Write Principles and Rules

Principles explain the durable operating model. Rules state invariants that every completed run must satisfy,
including authority, safety, evidence, recovery, and scope boundaries. Keep ordered actions out of Rules.

Place operational preferences here only when they help the actor choose between valid paths. Do not create a
second preference manual inside the procedure.

### S5 — Write Procedure as the dominant section

Write the actions in execution order. Every step states:

- its input or precondition;
- the action and any decision rule;
- the evidence or state change it produces;
- the next branch on success, failure, or missing context.

Use exact commands only where fragility requires them. Keep judgment steps in plain language. Name files as
actions only when the actor must read, write, or run them. If the operation writes session or durable state,
include its access matrix and output paths inside Procedure or in a directly loaded operation child.

### S6 — Integrate supporting tool material without losing the SOP

Keep a tool fact inline only when the actor needs it to execute that step correctly and it can be stated
compactly. Route larger syntax, capability, setup, or troubleshooting material to:

1. an existing tool skill;
2. a direct lookup child owned by this operation; or
3. a new tool skill when the manual has independent consumers.

Do not add a top-level Manual beside Procedure. A reader must be able to follow the SOP without searching a
large embedded tool catalog.

### S7 — Write References and close the parent

Map every borrowed fact to its one owner. Re-read `SKILL.md` alone and confirm it owns the full operational
contract: outcome, order, branches, failures, recovery, evidence, and completion. The companions written next
may not repair a missing parent requirement.

### S8 — Load scenario and write `scenarios.md`

Load [`../scenario/SKILL.md`](../scenario/SKILL.md) completely. Derive scenario families from the parent flow,
disposition the full coverage frame, and include ordinary, alternative-valid, boundary, failure/recovery,
adversarial, change, and counterfactual cases when their triggers apply.

Every non-exploratory case produces an observable design obligation that traces to a parent clause. Give cases
stable IDs and reserve checklist-ID slots. A cosmetically conformant but non-working run must fail at least one
case.

### S9 — Load checklist and write `checklists.md`

Load [`../checklist/SKILL.md`](../checklist/SKILL.md) completely. Convert every scenario obligation into one or
more atomic binary checks. Declare operational mode, keep the source unchecked, identify real pause points,
and give every gate or required item a pass condition, evidence method, and on-fail route.

Map every check to its parent clause and at least one scenario. Pilot the source on passing, failing,
non-applicable, boundary, and adversarial runs. Coverage closure is not acceptance; every applicable gate and
required item must pass for acceptance.

### S10 — Load evaluation and write `evaluation.md`

Load [`../evaluation/SKILL.md`](../evaluation/SKILL.md) completely. Make `evaluation.md` the entrypoint that
loads the two sibling sources, selects applicable cases and checks, and contributes them to the active phase
evaluation.

Define operation-specific perspective lenses, recommended verifications, anti-patterns, Overall anchors, and a
rule-key crosswalk back to `SKILL.md`. Reuse the general Evaluation method's perspectives, causal finding
content, completed checks, and verdicts. The caller owns any machine shape, output path, or storage mechanics;
the plural bundle adds no extra result and does not replace the caller's evaluation contract.

### S11 — Close traceability and run the operation

Prove both directions:

- every load-bearing parent clause is exercised by a scenario and check;
- every scenario and check resolves to a live parent clause;
- every scenario obligation has a checklist ID;
- every checklist ID is selected by `evaluation.md` when its applicability trigger holds.

Run a pre-handoff self-check through the plural bundle, then route independent evaluation through
`evaluation.md`. Fix the parent first when a companion exposes missing policy; never patch only the companion.

## Completion checks

- `skill-type` is `operation` and appears after `allowed-tools`.
- Procedure is present and dominant; no top-level Manual competes with it.
- Actor, trigger, preconditions, inputs, outputs, branches, failures, recovery, evidence, and completion are explicit.
- Preferences and tool facts remain subordinate to the SOP.
- `scenarios.md`, `checklists.md`, and `evaluation.md` all exist as direct siblings.
- The three companions were written in scenario → checklist → evaluation order using their owning skills.
- The parent is the sole policy owner and the four-file trace closes in both directions.
- A passing, failing, boundary, recovery, adversarial, and cosmetic-compliance probe was dispositioned.
