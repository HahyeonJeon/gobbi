---
name: coding-execution
description: "Coding Execution is an operation for implementing and verifying one accepted code task."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Coding Execution

Coding Execution implements, verifies, and hands off one accepted code task.
Use it when the task leaves no material code-design choice open and its writer frontier includes code, whether or
not `coding-ideation` ran. It grants no Review authority.

## Principles

### Own the implementation lifecycle

Coding Execution owns project study, bottom-up construction, verification, repair, and handoff for one accepted
task. Its result is proven code, not a plan or a new design.

### Write code at a world-best standard

Write code as a world-best code designer and programmer. Before and while coding, use the question “How would a
world-best programmer design and implement this?” to guide code craft inside the accepted design and task.

### Apply the principles while writing code

The coding principles judge real units, parameters, and callers, so apply them as code is written and simplified,
not before it exists. Simplicity comes first: the task adds only mechanism that a current caller needs.

### Trace the actual code reach

Definitions, callers, dependencies, tests, supporting surfaces, failures, recovery, and consumers determine the
affected set. Repository type or file extension alone does not.

## Rules

- **MUST complete study, implementation, verification, repair, and the checklist pass in this operation.** Bind
  the full direct task contract; do not delegate the lifecycle to another execution skill.
- **MUST commit when the caller grants commit authority, and use the caller’s retained-state policy
  when authority is none.** Under no authority, the exact verified uncommitted tree is a completed Coding
  Execution result; do not stage or commit it.
- **MUST map affected reach before writing the thinking guide, then keep that map current through handoff.** When
  generated material applies, name its canonical source, generator owner, regeneration path, and consistency
  check instead of treating generated output as an ordinary edit target.
- **MUST bind each smallest complete slice to accepted behavior, affected surfaces, proof, and a stop condition
  within one short local thinking guide.** This guide is not Planning or Coding Ideation; when the accepted task
  or design leaves a material design choice open, stop and return to the caller without loading or following
  either operation.
- **MUST load each applicable language, framework, platform, tool, and domain owner before making its code
  choices.** Keep one selected lifecycle operation primary and do not copy specialist procedures.
- **NEVER run Coding Review, write its report, claim reviewer independence, create a review working
  checklist, issue a verdict, accept the work, or change mode state.** Preserve out-of-scope findings and return
  them to their owner without implementing them.

## Procedure

### Phase 1 — Define the Code Task

#### 1.1 Bind the direct task contract

- Bind the complete task contract, accepted design, exact worktree, scope, writer frontier, commit authority,
  retained-state policy, acceptance evidence, verification requirements, and handoff.
- Identify the design record: the Ideation design, or this operation’s handoff when there was no Ideation. With
  no Ideation, the task contract is the accepted design, and Step 3.1 records the units you create.
- Stop and return to the caller when the accepted task or design leaves a material design choice open, or when
  writer isolation, authority, or proof is incomplete. A missing Ideation design or missing commit authority
  alone is not a stop.

#### 1.2 Establish the pre-edit baseline

- Inspect the current repository state before production edits. For a defect, reproduce the original symptom;
  for a feature or refactor, characterize the relevant caller-visible behavior and run the narrow existing checks
  that distinguish pre-existing failures.
- When direct reproduction is unavailable, record why and use only a caller-accepted diagnostic baseline.
  Otherwise stop rather than guess about the original behavior or cause.
- Preserve the baseline subject, command or observation, environment, result, and limit so later failures can be
  compared with the state that existed before this task.

#### 1.3 Map affected reach and select owners

- Trace definitions, callers, dependencies, public contracts, state and schemas, configuration, tests, documents,
  build and consumer paths, observable failures, recovery, and consumers that can change the result or evidence.
- Mark canonical and generated ownership where it applies, and classify each surface as in-scope, justified
  no-op, or an owned stop. Load each specialist owner the map exposes, including
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) when the change creates
  or changes classes, interfaces, or inheritance.
- Stop before changing an out-of-scope or unowned surface, and return its effect, owner, and required next action.

### Phase 2 — Make a Short Local Thinking Guide

#### 2.1 Order the implementation and proof slices

- After the reach map is current, write the thinking guide that Rule 4 defines, with one entry per smallest
  complete slice.
- Order the minimum foundation first, then caller-visible slices from their lowest dependency through consumers.
- Stop per Step 1.1 when the accepted inputs cannot determine a slice or its proof.

### Phase 3 — Implement and Reconcile the Code Reach

#### 3.1 Write each slice to the design and principles

- Write each slice from its lowest dependency through its caller-visible result, including consistency-bound tests
  and supporting surfaces. As you write each unit, apply the [Simplicity](../principles.md#simplicity) inline test
  and current-caller test first, then the other [Coding Principles](../principles.md).
- With an Ideation design, build each class and function to its Class and Function Design and caller contract.
  Read only the `coding-object-oriented-programming` entries that design names, and add no pattern it does
  not name.
- When there was no Ideation, design each unit you create with the Coding Principles, and with
  `coding-object-oriented-programming` when Step 1.3 loaded it. Before you create a directory, file, public class,
  or public function, write its four [Modularization](../principles.md#modularization) terms and any added
  abstraction’s force for the handoff, not in source comments.

#### 3.2 Prove each slice

- Run the slice’s narrow and downstream proof before you start the next slice.
- For a testable defect, preserve or add a regression check that fails for the original reason before the fix and
  passes afterward. A feature check may be written before or with its slice.
- When a discovery adds reach, update the map and regenerate generated output from its canonical owner. Stop
  before unplanned reach expands the accepted scope or writer frontier.

#### 3.3 Reconcile and simplify the implementation

- Apply the Simplicity inline test and current-caller test again to every unit, parameter, option, and hook this
  task added, and remove each one that fails. Also remove task-introduced placeholders, temporary diagnostics, and
  stale paths.
- When accepted-design mechanism fails those tests, keep it as designed and record it as a handoff concern.
- Map every scope item to a completed result and every affected surface to a change or justified no-op, and
  resolve any unexplained entry. Recheck canonical and generated consistency, caller and consumer paths, failures,
  recovery, and the accepted contract against the completed implementation.

### Phase 4 — Verify and Repair the Final Identity

#### 4.1 Verify the final identity

- Verify the exact tree after the last edit: focused checks first, then required affected or project checks, and
  the original reproducer last when one exists.
- Record each verification command or observation, configuration and environment, subject identity, result,
  skips or unavailable checks, and claim limits.

#### 4.2 Run the checklist pass

- Select the [Coding Review checklist](../coding-review/checklist.md) categories whose subject the change
  touches, and answer their items against the verified identity under the checklist’s Context conditions.
- Record, for the handoff, the categories answered and each item whose problem is present or that the evidence
  cannot decide, with its evidence.
- Treat each in-scope present problem as a task-introduced failure in Step 4.3. Record an out-of-scope one as a
  handoff concern for its owner.

#### 4.3 Classify failures and repair causes

- Classify each failure against the baseline as task-introduced, pre-existing, flaky, or out-of-scope. Do not
  repair a pre-existing, flaky, or out-of-scope result as though this task caused it.
- Repair only an in-scope cause, then rerun the exposing check, affected downstream checks, Step 4.1, and the
  Step 4.2 categories the repair touches. When a premise of the thinking guide fails, return to Step 2.1, and stop
  per Step 1.1 if a material design choice opens.
- Stop on missing authority, unsafe scope expansion, or repeated unexplained failure, and return the stop handoff
  in Step 5.1.

### Phase 5 — Deliver the Verified Identity

#### 5.1 Deliver and return the handoff

- When the caller grants commit authority, commit the exact verified result. When authority is none, do not stage
  or commit, and retain the exact verified tree under the caller’s retained-state policy.
- Return the [Delegation Handoff](../../delegation/SKILL.md#handoff-content) with these Execution fields: commit or
  retained-tree identity and caller policy, verification record, reach account, checklist-pass result, principles
  and `coding-object-oriented-programming` entries applied, and, when there was no Ideation, the design record.
  Put the Step 3.3 and Step 4.2 concerns in its concerns.
- On any stop, preserve the exact worktree identity and return the earliest owner, first failed obligation and
  its evidence, safe retained state, prohibited next action, and resume condition.

## References

| Name | Description |
|---|---|
| [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) | Rules and entries for code that creates or changes classes, interfaces, or inheritance. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API, applied while code is written and simplified. |
| [Coding Review checklist](../coding-review/checklist.md) | Baseline for the Step 4.2 checklist pass. |
| [Delegation](../../delegation/SKILL.md) | Handoff Content that Step 5.1 returns with the Execution fields. |
