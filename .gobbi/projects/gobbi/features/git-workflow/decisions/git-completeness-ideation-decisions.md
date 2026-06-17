---
name: git-completeness-ideation-decisions
description: Four locked design decisions from the git-completeness Ideation loop (DQ1-DQ4).
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-06-16
session: 3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [git, wrap-up, bulk-sweep, design]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Git-completeness Ideation — Locked Decisions (DQ1–DQ4)

## Context

The git-completeness session audited all git-touching skills and found four design questions that needed user direction before Planning could proceed. Each was discussed with the user on 2026-06-16 and locked. These decisions constrain the implementation shape for Planning and Execution.

## Decision DQ1 — Reorder P5 (root fix, not a fallback)

**Decision:** Fix the P5 finalization ordering bug by reordering the steps so that worktree removal happens BEFORE the branch delete. The `--delete-branch` flag is dropped from the `gh pr merge` call; the remote branch is deleted explicitly via `git push origin --delete <branch>` after the worktree is gone.

**Rationale:** `gh pr merge --delete-branch` cannot delete a branch while a worktree holds it — this was empirically witnessed in PR #302 (the remote delete failed with "branch used by worktree"). Adding a fallback alone would leave the root cause in place (Principle 8). Reordering removes the conflict at its source.

## Decision DQ2 — All four object classes in one audited pass

**Decision:** The bulk retro-sweep (P8) covers all four classes in a single pass: orphaned worktrees, remote branches, local branches, and open issues.

**Rationale:** The locked scope requires executing the full retro-cleanup this session. Splitting into separate passes per class would complicate coordination and leave partial state. A single audited pass with per-class confirm gates after a shared dry-run preview is cleaner and matches the `gh poi` model.

## Decision DQ3 — Dry-run preview before per-object confirm

**Decision:** P8 shows a full dry-run preview of the proposed action set (all objects, all classes) BEFORE entering any confirmation round. The user reviews the complete set first.

**Rationale:** With ~80+ objects, presenting per-object confirms without a prior overview would overload the user and make it impossible to catch cross-class conflicts (e.g., a branch checked out in a worktree being listed for deletion). The `gh poi --dry-run` model — show first, then confirm — provides the right safety/usability balance.

## Decision DQ4 — Issue done-detection via PR-association + per-object confirm only

**Decision:** Issue done-detection in P8 (and in the extended P5 step 6) uses PR-association only: an issue is considered done if it is referenced by a merged PR. No acceptance-criteria-body reading.

**Rationale:** Reading and evaluating issue body text for "acceptance criteria met" requires open-ended judgment that is not suitable for a mechanical sweep. PR-association is a reliable, API-queryable signal. Because gobbi targets `develop` (a non-default branch), GitHub closing keywords are ignored on merge, so all closing is manual — which makes the per-object confirm gate necessary regardless.

## Alternatives considered

- DQ1 alternative: Add a `git push origin --delete <branch>` fallback after the `--delete-branch` failure instead of reordering. Rejected: leaves the ordering root cause in place.
- DQ2 alternative: Run separate passes (worktrees first, then branches, then issues). Rejected: complicates the dry-run output and the per-class protect model.
- DQ3 alternative: Per-object confirm without a prior dry-run. Rejected: impractical at 80+ objects; no chance to review the full proposed set before acting.
- DQ4 alternative: Accept/reject based on issue body text analysis. Rejected: requires judgment outside mechanical scope; false positives on ambiguous bodies.

## Consequences

Planning must decompose the work against these locked shapes. The P8 design (D-G3) must implement held-flock liveness probing (not bare lock-file existence), the 7-stage P8 pipeline (AUDIT → CLASSIFY → PROTECT → DRY-RUN → CONFIRM → TOCTOU+ACT → RECORD), and durable report output at the project-root `reports/` tier.

## Related

- `1-ideation/working/discussion-log.md` — user decisions logged under "Ideation design decisions — RESOLVED"
- `1-ideation/working/design-direction.md` — directional design anchored to these decisions
- `1-ideation/outputs/ideation-output.md` — the Planning handoff
