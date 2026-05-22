---
loop: planning
iter: 4
artifact_type: dependencies
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/task-list.md
  - planning/rawdata/draft-iter4.md
---

# Dependencies — Repo Reset (Planning iter4 PASS)

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01-create-pre-reset-tag | (none) | Manager pre-Task-02 §1b (tag push), then 02-cleanup-sweep | local `refs/tags/pre-reset-2026-05-21` only — no working-tree files |
| 02-cleanup-sweep | 01-create-pre-reset-tag (+ manager tag-push pre-Task-02 §1b + manager worktree create §2-4) | (none — terminal executor task; manager picks up at Stage F + Stage G) | Stage A through E.2 file set (~30 tracked paths + ~52 FS-only session dirs + 1 terminal FS delete) |

**Dependency rationale**:
- 01 → manager-push §1b → 02 chain per Scope Contract § Q-F: tag must exist locally + on origin before the sweep branch opens. Per Fix 1 iter2, the push is manager-scope, sitting between Task 01 and Task 02.
- 02 is the terminal executor task; commits ready when 02 returns DONE; manager performs Stage F and Stage G post-Task-02.

**File-overlap check**: Task 01 touches only the tag ref (no working-tree files); Task 02 touches the broad workspace (no ref operations). No overlap, no conflict.

## Parallel lanes table

| Lane | Tasks | Order |
|---|---|---|
| L1 (sole) | 01 → 02 | sequential |

**Lane rationale**: Task 01's local tag must exist before manager-push §1b runs; manager-push §1b must complete before Task 02 starts because Task 02's eventual PR (manager-created post-Task-02) cites the tag.

**Conflict flags**: None.

## Manager-injected operations between tasks

The following manager-direct operations form a bridge between the two executor tasks:

1. **Pre-Task-01**: `gh issue create` (issue number drives branch name)
2. **Post-Task-01 / Pre-Task-02 §1b**: `git push origin pre-reset-2026-05-21` (tag push — manager scope per D-PLAN-04)
3. **Pre-Task-02 §2-4**: `git worktree add -b <sweep-branch> ...` + deps install (no-op) + Task 02 delegation with explicit scope boundary
4. **Post-Task-02 §5a-13**: Stage F (worktree-remove + branch cleanup) + Stage G (push/PR/CI/atomic-merge/post-merge cleanup/issue close)
