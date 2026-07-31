# Writing an Operation Skill

Use this child document at Step 2.1 after the parent Skill Writing operation classifies the target as
`skill-type: operation`. It produces one outcome-focused skill whose standard operating procedure (SOP) owns
the complete executable result.

This document directs the authoring work, while the target `SKILL.md` owns the authored operation. The parent
owns this direct child's loading, type selection, and frontmatter contract.

## Principles

### Center one observable outcome

An operation skill earns its structure by producing a recognizable end state. Actor, trigger, authority,
inputs, order, branches, failures, recovery, evidence, and completion all exist to make that outcome
repeatable rather than merely plausible.

### Model the flow before writing prose

The happy path alone hides the decisions that make an operation reliable. Modeling boundary conditions,
alternative-valid paths, failure, retry, rollback, pause points, and terminal states exposes the real
operational contract before polished wording conceals gaps.

### Keep the target self-contained and supporting content subordinate

The target `SKILL.md` must state the complete operational contract. Preferences, tool facts, and direct
children may support the standard operating procedure (SOP), but they cannot replace or repair a missing
trigger, action, branch, authority boundary, failure, recovery path, or completion condition.

### Prove behavior rather than topology

Correct headings can still contain a broken operation. Direct review must show that ordinary, boundary,
failing, recovery, adversarial, and cosmetically compliant cases produce the intended result or fail for the
intended reason.

## Rules

- **MUST run this procedure only after Step 1.3 classifies the target as `operation`.** Return to Step 1.3
  when the target owns no ordered actions that produce one observable work outcome or only navigates a mixed
  domain child-skill family.
- **MUST produce the exact operation target shape.** Use Frontmatter → Intro → Principles → Rules → Procedure
  → References; inside Procedure, use numbered Phase headings, decimal Step headings, and bulleted step
  bodies; keep Procedure dominant and add no top-level Manual.
- **MUST make the target Procedure own the complete executable outcome.** State actor, trigger, preconditions,
  authority, inputs, outputs, ordered decisions and actions, branches, failures, recovery, evidence,
  completion, non-goals, and handoff boundaries.
- **MUST keep target `SKILL.md` self-contained and supporting material subordinate.** Place operational
  judgment in Principles, Rules, or step-local decisions; keep compact tool facts beside the step that needs
  them; route larger lookup material to an owned child or tool skill; and never use a child to repair missing
  parent policy.
- **MUST review behavior before returning the target.** Exercise ordinary, alternative-valid, boundary, failure,
  recovery, adversarial, change, and cosmetic-compliance cases when applicable, and return to the earliest
  responsible authoring step when any case fails.

## Procedure

### Phase 1 — Model the Operation

#### 1.1 Define the operational contract

- Use the approved design to state one observable outcome, its actor and trigger, and the evidence that proves
  completion.
- Record the preconditions, authority, inputs and trust boundaries, outputs and side effects, non-goals, and
  handoff boundaries.
- Narrow the operation or return to parent Phase 1 to split independent outcomes when the outcome cannot be
  stated as one coherent result.

#### 1.2 Model paths, authority, and recovery

- Map the happy path, alternative-valid paths, boundary conditions, failures, retries or rollback, recovery,
  and terminal states.
- Mark irreversible or externally visible actions as pause points and assign each decision to the user or
  operating agent.
- Require every path to reach observable completion, a recoverable state, or an explicit stop condition.

### Phase 2 — Write the Operation Skill

#### 2.1 Create the complete skeleton

- Render the approved frontmatter slots, required headings, and planned direct children in their exact order.
- Stamp `skill-type: operation` and use this exact shape for Principles, Rules, and Procedure:

```markdown
## Principles

### {Principle title}

{Explain one durable mental model. Repeat for no more than four Principles.}

## Rules

- **MUST {state one binding requirement}.** {State its self-contained pass condition.}

- **NEVER {state one prohibited behavior}.** {State its self-contained failure condition.}

## Procedure

### Phase 1 — {Phase outcome}

#### 1.1 {Step action}

- {State the input or precondition.}
- {State the action and any decision rule.}
- {State the evidence or state change.}
- {State the next branch for success, failure, or missing context.}
```

- Repeat entries only as the operation requires, include a `NEVER` Rule only for a real prohibition, and write
  no substantive prose until the skeleton is complete.

#### 2.2 Write Procedure as the core

- Organize the operation into outcome-based Phases, decimal-numbered Steps, and action bullets.
- Make each Step state its input or precondition, action and decision rule, resulting evidence or state
  change, and next branch for success, failure, or missing context.
- Cover the complete modeled flow, including authority boundaries, failure, recovery, completion, and
  handoff; use exact commands only where fragility requires them.
- Keep compact tool facts beside the consuming Step and route larger setup, syntax, capability, or
  troubleshooting material to an owned child or tool skill.
- Include access boundaries and output paths when the operation writes session or durable state.

#### 2.3 Complete Principles, Rules, Intro, and References

- Write Principles for the durable operating model and Rules for distinct binding invariants; keep ordered
  work in Procedure and apply the parent limits and normative expressions.
- Write the Intro from the completed body, orienting the reader to the actor, trigger, outcome, boundary, and
  operating model without adding new policy.
- Keep References limited to owned Markdown children, cite outside owners beside their claims, and leave the
  heading empty when no internal child applies.
- Re-read the target `SKILL.md` alone and confirm that it owns the complete operation without relying on a
  child to repair missing policy.

### Phase 3 — Review and Improve the Operation Skill

#### 3.1 Review the complete operation

- Confirm that the target has one aligned outcome, the exact operation shape, and a Procedure that owns every
  required action, branch, authority boundary, failure, recovery path, completion condition, and handoff.
- Walk ordinary, alternative-valid, boundary, failure, recovery, adversarial, change, and
  cosmetic-compliance cases; require each to succeed or fail for the intended reason.
- Verify operation-specific commands, examples, paths, schemas, permissions, and version-sensitive claims
  against their owners.
- Confirm that supporting preferences, tool facts, and direct children remain subordinate and that the
  complete target also passes parent Phase 3.

#### 3.2 Correct and re-review the operation

- Trace each finding to the earliest incorrect contract, flow model, skeleton, Procedure step, or supporting
  section and propagate the correction through every affected part.
- Repeat the affected behavioral checks and the complete operation review before returning the target.

## References
