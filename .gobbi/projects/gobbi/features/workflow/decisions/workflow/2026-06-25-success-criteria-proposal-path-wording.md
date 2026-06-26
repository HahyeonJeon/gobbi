---
name: success-criteria-proposal-path-wording
description: Success Criteria 1 uses only the loop-root proposal path; D1/D5 name the Execution per-task exception — reconcile in Planning.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-26
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [docs-sync, codex, design]
keywords: [proposal-path, execution-per-task, success-criteria]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Reconcile Success Criteria 1 Proposal Path With Execution Per-Task Exception

## Context

During Ideation iter2 evaluation, the Codex evaluator found a path-wording mismatch. Success Criteria #1 in the Scope Contract stated the proposal is recorded at `{N}-{loop}/working/proposals/codex/draft-iter{n}.md` — a loop-root path. However D1 (Proposer mechanism, locked) and D5 (Per-step instantiation table, Execution row) correctly stated the Execution-specific exception: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`.

The design itself is correct and internally consistent in D1 and D5. Only the Success Criteria wording was missing the per-task exception clause. The finding was sub-threshold (Medium confidence, below the REVISE cutoff) and carried forward to Planning.

## Decision

Update Success Criteria #1 in the canonical Scope Contract to add the Execution per-task path exception. The updated criterion states both the general loop-root path and the Execution-specific per-task variant, so the criterion is verifiable against both forms.

## Rationale

Success Criteria drive Planning verification steps. A criterion that uses only the loop-root path can mislead a task author who uses Execution-specific paths. The fix is purely a wording addition — no design change is needed. D1 and D5 already carry the correct dual-path specification.

## Alternatives considered

- Leave the criterion as-is, annotating D1/D5 as the authoritative reference (rejected — a criterion that needs an annotation to be read correctly is a poorly written criterion; fix the text).
- Add a second separate success criterion for Execution (rejected — one criterion per outcome; the path is one outcome with a loop-type variant).

## Consequences

Planning included a task to carry the Execution per-task path variant through the implementation. The dual-path form reads `{N}-{loop}/working/proposals/codex/draft-iter{n}.md` (Execution: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`).

## Resolution

RESOLVED in-session (Execution). The Execution per-task proposal path is implemented in `skills/execution/SKILL.md` (the per-task `task-{NN}-{slug}/working/proposals/codex/` slot is carried in the loop's WORK phase, 2 occurrences). The decision was accepted and acted upon; nothing carries forward. The canonical session Scope Contract artifact lives in the gitignored session record (`1-ideation/outputs/`) and dies with the worktree — the durable carrier of the dual-path form is the design doc `design/workflow/codex-proposer-model.md` (D1/D5) plus `skills/execution/SKILL.md`.
