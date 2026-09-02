---
name: execution
description: "Execution is an operation for implementing and verifying one defined task, then returning a focused local commit or an exact stopped state."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Execution

Execution implements one defined task and returns either a focused local commit with verification evidence or
an exact stopped state. Use it after the outcome, scope, design, authority, and acceptance proof are defined;
it does not publish, merge, clean up, or rewrite history.

## Principles

### Understand the project before implementing the task

Project vision, philosophy, design, and architecture define what a fitting implementation looks like. Study
them before choosing the strategy so the task strengthens the project instead of becoming a locally correct
exception.

### Let evidence determine the implementation

Accepted design, live project behavior, established project patterns, and applicable primary sources reveal
the constraints the implementation must satisfy. Use that evidence instead of habit, assumptions, or the task
summary alone.

### Build from foundation to dependent layers

Start with the smallest foundation that supports one complete required path. Grow interfaces, behavior,
integrations, and supporting details one verified unit at a time in dependency order instead of building the
largest anticipated form at once.

### Prefer the simplest complete implementation

Use direct structures, ordinary control flow, clear names, and plain prose. Apply “you aren't gonna need it”
(YAGNI): add an abstraction, layer, option, or mechanism only when a current requirement or observed failure
justifies it.

## Rules

- **MUST keep every change within the task's defined outcome, boundaries, and authority.** Preserve unrelated
  work and stop when the task-owned change cannot be isolated safely.
- **MUST study the implementation evidence before choosing a strategy or editing task-owned files.** Read the
  project vision, philosophy, design, architecture, governing decisions, live implementation, established
  patterns, applicable skills, and necessary primary sources.
- **NEVER add speculative behavior, abstractions, extension points, options, configuration, compatibility,
  migration, or prose for a possible future need.** Simplification must preserve current behavior, contracts,
  safety information, and necessary context.
- **MUST implement from the foundation through the dependent layers in the smallest complete units.** Verify
  each unit before expanding the implementation, and stop growing it when the task is complete.
- **MUST keep affected surfaces consistent and verify the exact tree after the final edit.** Code, documents,
  tests, types, schemas, configuration, examples, and runtime surfaces that express the same behavior must
  agree.
- **MUST return a local handoff for every terminal state and one focused local commit for every completed
  implementation.** Follow Git for a completed result; do not push, merge, publish, remove the worktree, or
  rewrite history.

## Procedure

### Phase 1 — Understand and Study the Task

#### 1.1 Understand the task context

- Read the task's required outcome, purpose, affected actors, included and excluded work, accepted design,
  constraints, acceptance criteria, verification requirements, authority, and expected handoff.
- Inspect the exact repository, worktree, branch, status, existing diff, target files, neighboring
  implementation, callers, consumers, tests, documents, configuration, schemas, build paths, and relevant
  history.
- Define the smallest complete result, explicit non-goals, open assumptions, and evidence that will prove the
  task is done. Stop for the caller when a material outcome, boundary, or design choice is unresolved;
  missing implementation strategy, file-level edit set, or verification method is not an unresolved design
  choice when the plan recorded outcome, boundary, and writer frontier.

#### 1.2 Study before implementation

- Load the governing project rules and applicable implementation, language, framework, platform, and tool
  skills before making decisions in those domains.
- Study the project's vision, philosophy, design, architecture, and governing decisions. Trace how the
  accepted design, research, project memory, and history position the task within the project's direction and
  constraints.
- Study source definitions, call sites, tests, documents, configuration, schemas, runtime behavior, prior
  attempts, and established patterns. Use current primary external sources only when the project does not
  settle a mechanism, and verify them before choosing the strategy or editing task-owned files.

### Phase 2 — Design and Order the Implementation

#### 2.1 Choose the simplest implementation strategy

- Use the task, accepted design, live implementation context, and study evidence to choose the simplest
  strategy that satisfies correctness, testability, compatibility, safety, resource use, maintenance, and
  reversibility.
- Resolve algorithms, data structures, interfaces, internal seams, naming, error handling, and verification
  seams only to the depth the current task needs. Prefer concrete, local, established patterns.
- Challenge every proposed abstraction, layer, option, configuration point, fallback, compatibility path,
  migration, and document section with the current requirement or observed failure that needs it.

#### 2.2 Order the implementation from bottom to top

- Identify the smallest skeleton or foundation that follows the accepted design and supports the first
  complete required path. Do not create speculative stubs, empty layers, unused options, or imagined seams.
- Order the required units from bottom to top: foundation, contracts and interfaces, core behavior,
  integration and dependent surfaces, then final verification.
- Make each unit the smallest complete increment that keeps the whole coherent. Delay the details of later
  units until the preceding unit passes and the later work remains necessary.

### Phase 3 — Implement from Bottom to Top

#### 3.1 Establish the minimal foundation

- Implement only the foundation needed for the accepted design and first complete path. Keep it consistent
  with the whole task without building anticipated behavior.
- For code or projects, establish only the required structure and contracts before their dependent behavior.
- For documentation, create the necessary hierarchy and core sections before examples, cross-references, and
  supporting detail. Do not add placeholder sections for possible future content.

#### 3.2 Implement the ordered units

- Implement one complete unit at a time in dependency order. Use direct code, existing project patterns,
  plain prose, and the least structure that satisfies the current unit.
- Update every affected caller, integration, test, type, schema, configuration, document, example, and runtime
  surface, then run the narrow checks that prove the unit before continuing.
- Continue only while an in-scope requirement remains. Name that requirement or an observed failure before
  adding complexity, then add the least mechanism that satisfies it.

#### 3.3 Simplify the completed implementation

- Make the completed code and documents as simple and compact as the task allows. Use plain, precise,
  context-appropriate names, comments, docstrings, and prose.
- Remove duplication, needless indirection, unused flexibility, dead code, filler, stale content, and
  redundant explanation.
- Inline, merge, or specialize a structure when the simpler form preserves required behavior, meaning,
  safety, consistency, and maintainability.

### Phase 4 — Self-Verify and Repair

#### 4.1 Verify the complete result

- Run the task's required checks on the exact tree after the last edit and add targeted checks for risks found
  during study or implementation. Use only the tests, builds, type checks, validation, inspection, benchmarks,
  or security checks that apply.
- Apply the [Coding Review checklist](../coding/coding-review/checklist.md) to code work and the
  [Documentation checklist](docs/checklist.md) to documentation work. Read and apply the Coding Review checklist's
  Coverage Account before reviewing its items, and consume the Coding Review source directly without running the
  full operation or writing its report; checklist use grants no report or formal decision authority.
- Review the complete implementation and diff for task alignment, consistency, unsupported complexity, stale
  or unsafe content, unexpected churn, and undocumented compatibility changes, then inspect affected behavior
  and unrelated work directly.

#### 4.2 Repair and repeat verification

- Trace each failed check or self-review finding to the earliest incorrect assumption, strategy, foundation,
  interface, implementation unit, integration point, document claim, or verification method. Explain why that
  cause produced the failure.
- Repair the smallest complete in-scope unit at the cause and propagate it through every affected surface.
  Refine only what the task's acceptance, maintainability, safety, or quality contract requires.
- Run the narrow check that exposed the failure and every affected downstream check, then repeat Step 4.1.
  Continue until the result passes or reaches a named stop condition.

### Phase 5 — Finalize and Hand Off

#### 5.1 Finalize and hand off

- Confirm that the worktree has not changed since verification. Review the branch, status, changed paths, and
  task ownership, preserve unrelated work, and stop when safe isolation is no longer provable.
- For a completed implementation, load [Git](../git/SKILL.md), stage only task-owned paths, inspect the staged
  diff, and create one focused local commit. Confirm its tree contains the exact verified result; for a stopped
  task, retain and report the local state without committing incomplete work.
- After any caller-required prefix, render the [Execution handoff template](templates/handoff.md) as the
  response body and complete every field. Do not write it as a tracked task artifact; a caller may add fields
  without replacing its core meanings.

## References

| Name | Description |
|---|---|
| [Coding Review checklist](../coding/coding-review/checklist.md) | Coding Review-owned reusable unchecked source for self-reviewing and evaluating general code-work quality. |
| [Documentation checklist](docs/checklist.md) | Reusable unchecked source for self-reviewing and evaluating general documentation-work quality. |
| [Execution handoff template](templates/handoff.md) | Response-only format for the task result, changes, verification, local delivery, concerns, and limits. |
| [Git](../git/SKILL.md) | Preferences for staging, focused commits, verification, and retained local state. |
