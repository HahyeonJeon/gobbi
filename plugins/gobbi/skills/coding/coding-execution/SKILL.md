---
name: coding-execution
description: "Coding Execution is an operation for implementing and verifying one accepted code task."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Coding Execution

Coding Execution composes Generic Execution with code-specialist selection, affected-code reach, a short local
thinking guide for slice order and proof, and the commit-or-retain completion seam.
Use it when one accepted task has a settled code design and a writer frontier that includes code.
It grants no Review or Evaluation authority.

## Principles

### Let Generic Execution own implementation

Generic Execution owns project study, bottom-up construction, verification, repair, and handoff. It owns the
commit step when the caller grants authority; Coding Execution otherwise completes under the caller’s
retained-state policy.

### Write code at a world-best standard

Write code as a world-best code designer and programmer. Before and while coding, use the question “How would a
world-best programmer design and implement this?” to guide code craft inside the accepted task, not a Coding
Ideation pass.

### Implement the accepted task without reopening it

Accepted design and task boundaries are already decided before this operation starts. Do not run Coding Ideation
or Planning; use only a short local thinking guide, and stop for the caller if the accepted inputs cannot determine
the implementation.

### Trace the actual code reach

Definitions, callers, dependencies, tests, supporting surfaces, failures, recovery, and consumers determine the
affected set. Repository type or file extension alone does not.

## Rules

- **MUST load and apply [Execution](../../execution/SKILL.md) as the complete lifecycle procedure, including its
  final verification and applicable checklist pass.** Bind the full direct task contract; if Execution’s
  checklist pass is missing, return to Execution instead of duplicating it.
- **MUST let Execution commit when the caller grants commit authority, and use the caller’s retained-state policy
  when authority is none.** Under no authority, the exact verified uncommitted tree is a completed Coding
  Execution result; do not stage or commit it.
- **MUST map affected reach before writing the short local thinking guide, then keep that map current through
  handoff.** When generated material applies, name its canonical source, generator owner, regeneration path, and
  consistency check instead of treating generated output as an ordinary edit target.
- **MUST bind each smallest complete slice to accepted behavior, affected surfaces, proof, and a stop condition
  within one short local thinking guide.** This guide is not Planning or Coding Ideation; if the accepted design or
  task cannot determine the implementation, stop and return to the caller without loading or following either
  operation.
- **MUST load each applicable language, framework, platform, tool, and domain owner before making its code
  choices.** Keep one selected lifecycle operation primary and do not copy specialist procedures.
- **NEVER run Coding Review, write its report, claim reviewer independence, create an Evaluation working
  checklist, issue a verdict, accept the work, or change mode state.** Preserve out-of-scope findings and return
  them to their owner without implementing them.

## Procedure

### Phase 1 — Compose Execution and Define the Code Task

#### 1.1 Bind the direct task contract

- Load [Execution](../../execution/SKILL.md) and bind its complete task contract, accepted design, exact
  worktree, scope, writer frontier, authority, acceptance evidence, verification requirements, and handoff.
- When commit authority is granted, keep Execution’s commit step. When it is none, bind the caller’s
  retained-state policy and forbid staging and committing.
- Stop and return to the caller when the accepted task or design cannot determine the implementation, or when
  writer isolation, authority, or proof is incomplete. Do not load or follow Coding Ideation or Planning; lack of
  commit authority alone is not a stop when the retained-state policy is complete.

#### 1.2 Establish the pre-edit baseline

- Apply Execution Steps 1.1–1.2 and inspect the current repository state before production edits. For a defect,
  reproduce the original symptom; for a feature or refactor, characterize the relevant caller-visible behavior
  and run the narrow existing checks that distinguish pre-existing failures.
- When direct reproduction is unavailable, record why and use only a caller-accepted diagnostic baseline.
  Otherwise stop rather than guess about the original behavior or cause.
- Preserve the baseline subject, command or observation, environment, result, and limit so later failures can be
  compared with the state that existed before this task.

#### 1.3 Map affected reach and select owners

- Trace definitions, callers, dependencies, public contracts, state and schemas, configuration, tests, documents,
  build and consumer paths, observable failures, recovery, and consumers that can change the result or evidence.
- Mark canonical and generated ownership where it applies, load each specialist owner exposed by the map, and
  classify each surface as in-scope, justified no-op, or an owned stop. Keep the map live as new reach appears.
- Stop before changing an out-of-scope or unowned surface, and return its effect, owner, and required next action.

### Phase 2 — Make a Short Local Thinking Guide

#### 2.1 Order the implementation and proof slices

- Apply Execution Steps 2.1–2.2 after the reach map is current. Ask, “How would a world-best programmer design and
  implement this within the accepted design and task?”
- Write only a short thinking guide: for each smallest complete slice, note accepted behavior, affected surfaces,
  narrow and downstream proof, and the stop condition. This guide is neither Planning nor Coding Ideation and
  creates no new design or task.
- Order the minimum foundation first, then caller-visible slices from their lowest dependency through consumers.
  If the accepted design or task cannot determine the implementation or proof, stop and return to the caller
  without loading or following Coding Ideation or Planning.

### Phase 3 — Implement and Reconcile the Code Reach

#### 3.1 Implement and prove each slice

- Apply Execution Steps 3.1–3.2 to implement one slice from its lowest dependency through its caller-visible
  result, including consistency-bound tests and supporting surfaces. Run its proof before continuing, and keep the
  world-best programmer question active before and while coding only as code craft within the accepted design and
  task.
- For a testable defect, preserve or add a regression check that fails for the original reason before the fix and
  passes afterward. A feature check may be written before or with its slice.
- Update the live reach map after every discovery, and regenerate from the canonical owner when generated output
  changes. Stop before unplanned reach expands the accepted scope or writer frontier.

#### 3.2 Reconcile and simplify the implementation

- Apply Execution Step 3.3 and remove task-introduced placeholders, temporary diagnostics, stale paths, needless
  indirection, and unsupported flexibility.
- Map every scope item to a completed result and every affected surface to an implemented change or justified
  no-op. Resolve any unexplained map entry before final verification.
- Recheck canonical and generated consistency, caller and consumer paths, failures, recovery, and the accepted
  contract against the exact completed implementation.

### Phase 4 — Verify and Repair the Final Identity

#### 4.1 Verify once through Execution

- Apply Execution Step 4.1 against the exact tree after the last edit: focused checks first, then required affected
  or project checks, and the original reproducer last when one exists.
- Use Execution’s one applicable Coding Review checklist pass on that identity. If it is missing, return to
  Execution instead of running a separate Coding Execution review or checklist walk.
- Record each verification command or observation, configuration and environment, subject identity, result,
  skips or unavailable checks, and claim limits.

#### 4.2 Classify failures and repair causes

- Classify each failure against the baseline as task-introduced, pre-existing, flaky, or out-of-scope. Do not
  repair a pre-existing, flaky, or out-of-scope result as though this task caused it.
- Apply Execution Step 4.2 only to an in-scope cause, then rerun the exposing check, affected downstream checks,
  and final verification. Return to the short local thinking guide when a premise fails; if the accepted design or
  task no longer determines the implementation, stop and return to the caller without loading or following Coding
  Ideation or Planning.
- Stop on missing authority, unsafe scope expansion, or repeated unexplained failure, preserving the first failed
  obligation, evidence, safe state, owner, and resume condition.

### Phase 5 — Deliver the Verified Identity

#### 5.1 Return the Execution handoff

- Apply Execution Step 5.1, with delivery controlled by the caller’s commit-or-retain authority. Let Execution
  commit the exact verified result when authority is granted; otherwise do not stage or commit and retain the
  exact verified tree under the caller’s policy.
- Return Generic Execution’s handoff with the commit or retained-tree identity, verification identity, live reach
  account, caller policy, authority limits, concerns, and evidence limits.
- On a stop, preserve the exact worktree identity and return the earliest owner, failed obligation, safe retained
  state, prohibited next action, and resume condition.

## References

| Name | Description |
|---|---|
| [Execution](../../execution/SKILL.md) | Owns study, implementation, verification, repair, the authorized commit step, and the handoff procedure. |
| [Coding Ideation](../coding-ideation/SKILL.md) | Prior owner that settled material code-design choices before this operation; Coding Execution does not load or follow it. |
| [Planning](../../planning/SKILL.md) | Prior owner that settled multi-task decomposition and writer frontiers before this operation; Coding Execution does not load or follow it. |
