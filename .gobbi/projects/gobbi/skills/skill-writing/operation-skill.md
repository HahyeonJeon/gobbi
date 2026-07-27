# Writing an Operation Skill

Operation-shaped child procedure for producing one operation skill. Load it only at P5 after the parent Skill
Writing operation classifies the target as `skill-type: operation`. Its observable outcome is one complete,
outcome-focused standard operating procedure (SOP) plus the scenario, checklist, and evaluation evidence that
proves the procedure works.

Both this child document and the target it produces are operational, but they have different owners. This
file directs the authoring work; the target `SKILL.md` owns the authored operation. This file remains a direct
child document rather than an independently loadable skill, so the parent owns its loading and verification.

## Principles

### Center one observable outcome

An operation skill earns its structure by producing a recognizable end state. Actor, trigger, authority,
inputs, order, branches, failures, recovery, evidence, and completion all exist to make that outcome
repeatable rather than merely plausible.

### Model the flow before writing prose

The happy path alone hides the decisions that make an operation reliable. Modeling boundary conditions,
alternative-valid paths, failure, retry, rollback, pause points, and terminal states exposes the real
operational contract before polished wording conceals gaps.

### Keep supporting content subordinate to the SOP

Preferences and tool facts can improve an operation, but they do not replace its ordered outcome. Supporting
content belongs where the actor needs it and should never force the reader to search a competing manual before
continuing the procedure.

### Keep the parent as the sole policy owner

Scenarios, checks, and evaluation exercise the operation; they do not define it. A requirement discovered
through verification belongs in `SKILL.md` before a companion can test it.

### Prove behavior rather than topology

Correct headings and four expected filenames can still contain a broken operation. Evidence must show that
ordinary, boundary, failing, recovery, adversarial, and cosmetically compliant cases produce the intended
result or fail for the intended reason.

## Rules

### Must-Follow

- **MUST run this procedure only after P2 classifies the target as `operation`.** Return to P2 when the target
  owns no ordered actions that produce one observable work outcome.
- **MUST produce the exact operation target shape.** Use Frontmatter → Intro → Principles → Rules → Procedure
  → References; keep Procedure dominant; and add no top-level Manual.
- **MUST ship the complete four-sibling artifact set.** Place `SKILL.md`, `scenarios.md`, `checklists.md`, and
  `evaluation.md` together as direct siblings for every new or substantively revised operation.
- **MUST make the target Procedure own the complete executable outcome.** State actor, trigger, preconditions,
  authority, inputs, outputs, ordered decisions and actions, branches, failures, recovery, evidence,
  completion, non-goals, and handoff boundaries.
- **MUST keep every target Rule within the parent Rules contract.** Begin it with a bold normative lead, make
  it binding, self-contained, testable, and distinct from every Principle, and keep the complete Rules section
  to at most nine semantic items.
- **MUST keep preferences and tool facts subordinate to the target SOP.** Place operational judgment in
  Principles, Rules, or step-local decisions; keep compact tool facts beside the step that needs them; and
  route larger lookup material to an owned child or tool skill.
- **MUST keep target `SKILL.md` as the sole policy owner.** Every companion claim resolves to a live parent
  clause, and no scenario, check, or evaluator requirement repairs policy missing from the parent.
- **MUST author the companions in scenario → checklist → evaluation order through their owning skills.** Do
  not populate companion policy before the parent operation closes.
- **MUST close traceability in both directions before acceptance.** Every load-bearing parent clause has a
  scenario and check, every scenario and check resolves to a live parent clause, every scenario obligation
  has a checklist ID, and evaluation selects every applicable checklist ID.

## Procedure

### S1 — Specify the operational contract

Write down:

- actor and trigger;
- preconditions and required authority;
- inputs and their trust boundaries;
- ordered state changes or decisions;
- outputs and side effects;
- failure and recovery expectations;
- observable completion evidence; and
- non-goals and handoff boundaries.

If the outcome cannot be stated in one sentence, narrow the operation or split independent outcomes.

### S2 — Model the flow before prose

Lay out the happy path, branches, boundary conditions, failure paths, retry or rollback behavior, and terminal
states. Mark irreversible or externally visible actions as pause points. Identify which decisions require user
authority and which the operating agent may make from evidence.

### S3 — Create the complete skeleton

Render the four frontmatter slots and the required headings in their exact order. Stamp
`skill-type: operation` and create the sibling topology for `SKILL.md`, `scenarios.md`, `checklists.md`, and
`evaluation.md`. Add any planned direct child names. Use placeholders only to expose the planned structure;
do not write substantive prose, and do not put policy into the companions, until the skeleton is complete.

### S4 — Write Principles and Rules

Principles explain the durable operating model. Rules state invariants that every completed run must satisfy,
including authority, safety, evidence, recovery, and scope boundaries. Keep ordered actions out of Rules.

Apply the parent rule-count and non-duplication contract. Inventory semantic rule items rather than bullets.
Keep only binding, self-contained, testable invariants in Rules. A Rule may enforce a boundary motivated by a
Principle, but it must not repeat the Principle's claim. Begin every item with a bold `MUST`, `MUST NOT`,
`ALWAYS`, or `NEVER` lead.

Place operational preferences here only when they help the actor choose between valid paths. Do not create a
second preference manual inside the procedure.

### S5 — Write Procedure as the dominant section

Write the actions in execution order. Every step states:

- its input or precondition;
- the action and any decision rule;
- the evidence or state change it produces; and
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

### S7 — Finish Frontmatter, Intro, and References

Complete the four-key frontmatter contract from the parent. Begin the description with `MUST load`, state the
exact load condition, and identify the skill as an operation skill for its observable outcome.

Write the Intro from the completed body. In a little more detail than the description, explain the actor,
trigger, outcome, boundary, and operating model in one or two short paragraphs. It may summarize the body but
may not introduce procedure steps, authority, evidence, owner facts, or recovery policy absent from their
owning sections.

Keep the required References heading. Link only to Markdown child documents and child-skill entrypoints whose
resolved paths stay beneath the directory containing the target `SKILL.md`. Cite an outside owner beside the
claim it validates, never in References. Leave the heading empty when the skill has no allowed child material.

Read the whole skill as a cold reader. Use one stable term for each concept, expand unfamiliar abbreviations
at first use, keep one main claim per sentence, and replace vague, ornamental, or implied expressions with
literal actors, conditions, actions, branches, and evidence.

Re-read `SKILL.md` alone and confirm it owns the full operational contract. The companions written next may
not repair a missing parent requirement.

### S8 — Load scenario and write `scenarios.md`

Load [`../evaluation/scenario/SKILL.md`](../evaluation/scenario/SKILL.md) completely. Derive scenario families
from the parent flow, disposition the full coverage frame, and include ordinary, alternative-valid, boundary,
failure/recovery, adversarial, change, and counterfactual cases when their triggers apply.

Every non-exploratory case produces an observable design obligation that traces to a parent clause. Give
cases stable IDs and reserve checklist-ID slots. A cosmetically conformant but non-working run must fail at
least one case.

### S9 — Load checklist and write `checklists.md`

Load [`../evaluation/checklist/SKILL.md`](../evaluation/checklist/SKILL.md) completely. Convert every scenario
obligation into one or more atomic binary checks. Declare operational mode, keep the source unchecked,
identify real pause points, and give every gate or required item a pass condition, evidence method, and
on-fail route.

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

### S11 — Close traceability and accept the operation skill

Prove both directions:

- every load-bearing parent clause is exercised by a scenario and check;
- every scenario and check resolves to a live parent clause;
- every scenario obligation has a checklist ID; and
- every checklist ID is selected by `evaluation.md` when its applicability trigger holds.

Run a pre-handoff self-check through the plural bundle, then route independent evaluation through
`evaluation.md`. Fix the parent first when a companion exposes missing policy; never patch only the companion.

Inspect the complete artifact set. Confirm the frontmatter and description, skeleton-first record, aligned
Intro, exact section shape, semantic Rule inventory, Principle-to-Rule separation, complete executable
contract, subordinate supporting content, claim-owner citations, local References, cold-reader language,
four-sibling topology, companion authoring order, sole-parent policy ownership, and two-way trace all satisfy
the parent and child contracts. Disposition passing, failing, boundary, recovery, adversarial, and
cosmetic-compliance probes. Return to the owning step on any failure.

## References
