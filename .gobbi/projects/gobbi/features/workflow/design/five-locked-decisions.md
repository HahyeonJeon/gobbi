---
name: five-locked-decisions
description: Five user-confirmed locked decisions for session-foundations-bundle-b Execution — non-negotiable during task execution.
type: design
scope: feature
feature: workflow
status: accepted
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, locked-decisions, execution, wave-ordering]
title: 5 locked decisions for session-foundations-bundle-b execution
related:
  - planning/artifacts/plan.md
  - ideation/artifacts/bundle-b-ideation-pass.md
---

# 5 locked decisions for Execution

## Context

Before the session-foundations-bundle-b Execution loop began, five design choices needed to be settled and held fixed so executors would not re-open them mid-implementation: the wave ordering, the hook/reconstructor delegation shape, which mistakes each task brief cites, and where two pieces of documentation live (rollback semantics and the direct-mode opt-out). Each was surfaced to the user via AskUserQuestion during the Planning DISCUSSION phase.

## Decision

Lock the five choices below. All five were user-confirmed; they are non-negotiable during Execution — executors must not re-litigate them.

### Strict wave ordering: T1 completes before T3 (LOCK #1)

**Decision**: T1 wave (Tasks 01-06) completes before T3 wave (Tasks 07-10). No interleaving.

**Rationale**: coherent commit history per the per-iter cadence rule; T1 doc edits land as one wave commit before the T3 wave starts. Avoids interleaving ambiguity on `orchestration/SKILL.md` (touched by both waves).

**Mechanism**: dependency edges `05 → 07` AND `06 → 07` graph-enforce the gate. Both terminal T1 leaves must complete.

### Shared-executor delegation for hook and reconstructor (LOCK #2)

**Decision**: One executor delegation covers both Task 07 (hook script) and Task 08 (reconstructor) back-to-back.

**Rationale**: Task 08 consumes jq snippets and the hook stdin contract established by Task 07. A shared execution context avoids requiring Task 08 to re-derive that contract.

**Mechanism**: Manager issues one delegation prompt covering both tasks; executor completes Task 07 first, then Task 08, within the same context window.

### Mistake-bundle scope: Iron Law 7 only for T3 tasks (LOCK #3)

**Decision**: T3 task briefs (Tasks 07-10) cite only `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. The other two T1 mistakes (cwd routing, rm -rf safety) are NOT extended to T3.

**Rationale**: T3 tasks do not write to session paths (cwd-routing mistake is inapplicable) and do not remove files (rm -rf safety is inapplicable). T3 tasks DO involve verbatim citation of hook stdin contract, structured-header regexes, and JSON schema field names — exactly the Iron Law 7 failure mode.

### Rollback semantics home: preparation/SKILL.md (LOCK #4)

**Decision**: Rollback semantics for the `generate-now` promote-now path live co-located with the narrow-exception text in `preparation/SKILL.md`. NOT in `git/SKILL.md`.

**Rationale**: single-source-of-truth — the rollback applies to the promote-now procedure in preparation/SKILL.md; co-locating preserves readability. `git/SKILL.md` retains the general critical-rule paragraph only.

**Rollback sequence**: on `git commit` failure post-copy: `git -C "$worktreePath" rm <copied-paths>` → AskUserQuestion → re-attempt or abort. This REMOVES the copied file (not `git checkout`, since the file did not pre-exist).

### Direct-mode opt-out home: orchestration/SKILL.md row 5.5 footnote (LOCK #5)

**Decision**: Direct-mode opt-out ("if `workflow.git.mode = 'direct'`, row 5.5 is skipped and `worktreePath` remains null") is documented as a row 5.5 footnote in `orchestration/SKILL.md`. NOT in `git/SKILL.md`.

**Rationale**: co-locates the opt-out flag with the row it opts out of; avoids a third cross-skill reference.

## Rationale

Each lock removes a degree of freedom that, left open, would let an executor make an incompatible choice mid-flight: the wave order keeps the commit history coherent and avoids interleaving ambiguity on shared files; the shared-executor delegation preserves the jq/stdin context Task 08 needs from Task 07; the narrowed mistake-bundle cites only the Iron Law 7 mistake on T3 because the cwd-routing and rm-rf mistakes are inapplicable to script-authoring tasks; and the two documentation-home choices co-locate each rule with the procedure it governs to keep a single source of truth.

## Alternatives considered

- **Interleaved waves / advisory ordering (vs LOCK #1).** Rejected: interleaving the doc-edit and script waves blurs commit history and creates ordering ambiguity on `orchestration/SKILL.md`.
- **Separate executors for hook and reconstructor (vs LOCK #2).** Rejected: the second executor would have to re-derive the jq snippets and stdin contract.
- **Extending all three T1 mistakes to T3 briefs (vs LOCK #3).** Rejected: the cwd-routing and rm-rf mistakes do not apply to T3 tasks; only the Iron Law 7 verbatim-citation mistake does.
- **Documenting rollback and the direct-mode opt-out in `git/SKILL.md` (vs LOCK #4/#5).** Rejected: that splits each rule from the procedure it governs and adds cross-skill references.

## Consequences

Execution proceeds with these five choices fixed. The wave gate is graph-enforced (`05 → 07`, `06 → 07`); the manager issues one delegation for Tasks 07-08; T3 briefs cite only the Iron Law 7 mistake; rollback semantics live in `preparation/SKILL.md` and the direct-mode opt-out lives as a row-5.5 footnote in `orchestration/SKILL.md`.

## Related

- `design/dependency-graph-strict-wave-ordering.md` — the graph that enforces LOCK #1.
- `decisions/2026-05-24-lock1-wave-ordering-not-graph-enforced.md` — the decision record for the LOCK #1 edges.
- `backlogs/lock2-shared-executor-mega-task-risk.md` — the deferred context-budget risk from LOCK #2.
