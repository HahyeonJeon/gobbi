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

All 5 were user-confirmed via AskUserQuestion during the Planning DISCUSSION phase. They are non-negotiable during Execution — executors must not re-litigate them.

## LOCK #1 — T1→T3 strict wave ordering

**Decision**: T1 wave (Tasks 01-06) completes before T3 wave (Tasks 07-10). No interleaving.

**Rationale**: coherent commit history per the per-iter cadence rule; T1 doc edits land as one wave commit before the T3 wave starts. Avoids interleaving ambiguity on `orchestration/SKILL.md` (touched by both waves).

**Mechanism**: dependency edges `05 → 07` AND `06 → 07` graph-enforce the gate. Both terminal T1 leaves must complete.

## LOCK #2 — Tasks 07+08 shared executor

**Decision**: One executor delegation covers both Task 07 (hook script) and Task 08 (reconstructor) back-to-back.

**Rationale**: Task 08 consumes jq snippets and the hook stdin contract established by Task 07. A shared execution context avoids requiring Task 08 to re-derive that contract.

**Mechanism**: Manager issues one delegation prompt covering both tasks; executor completes Task 07 first, then Task 08, within the same context window.

## LOCK #3 — T3 mistake bundle limited to Iron Law 7 procedural mistake

**Decision**: T3 task briefs (Tasks 07-10) cite only `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. The other two T1 mistakes (cwd routing, rm -rf safety) are NOT extended to T3.

**Rationale**: T3 tasks do not write to session paths (cwd-routing mistake is inapplicable) and do not remove files (rm -rf safety is inapplicable). T3 tasks DO involve verbatim citation of hook stdin contract, structured-header regexes, and JSON schema field names — exactly the Iron Law 7 failure mode.

## LOCK #4 — T1.j rollback semantics home: preparation/SKILL.md

**Decision**: Rollback semantics for the `generate-now` promote-now path live co-located with the narrow-exception text in `preparation/SKILL.md`. NOT in `git/SKILL.md`.

**Rationale**: single-source-of-truth — the rollback applies to the promote-now procedure in preparation/SKILL.md; co-locating preserves readability. `git/SKILL.md` retains the general critical-rule paragraph only.

**Rollback sequence (per Ideation:283)**: on `git commit` failure post-copy: `git -C "$worktreePath" rm <copied-paths>` → AskUserQuestion → re-attempt or abort. REMOVES the copied file (not `git checkout`; file did not pre-exist).

## LOCK #5 — T1.g direct-mode opt-out home: orchestration/SKILL.md row 5.5 footnote

**Decision**: Direct-mode opt-out ("if `workflow.git.mode = 'direct'`, row 5.5 is skipped and `worktreePath` remains null") is documented as a row 5.5 footnote in `orchestration/SKILL.md`. NOT in `git/SKILL.md`.

**Rationale**: co-locates the opt-out flag with the row it opts out of; avoids a third cross-skill reference.
