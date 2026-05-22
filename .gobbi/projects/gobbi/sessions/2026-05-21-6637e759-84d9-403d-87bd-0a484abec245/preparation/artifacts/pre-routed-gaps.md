---
loop: preparation
iter: 2
artifact_type: pre-routed-gaps
created_at: 2026-05-21
status: final
supersedes: []
related:
  - preparation/rawdata/draft-iter2.md
  - preparation/artifacts/readiness-summary.md
  - ideation/artifacts/implementation-checklist.md
---

# Pre-routed Gaps for Planning

This section captures iter1 Codex evaluator findings (F-CX-PREP-O-01 + F-CX-PREP-O-02) that the iter1 Claude evaluator missed. Per user-authorized surgical iter2 routing, these are **not** re-litigated as Preparation gaps requiring `generate-now` (the underlying memory state is fine for Preparation); they are **binding constraints on Planning's decomposition** that Planning MUST honor when sequencing executor tasks. Stamping them here makes them inheritable by the Planning leader without forcing another full Preparation iter.

## F-CX-PREP-O-01 — Mistake-memory continuity gap (High / 75)

**Codex finding (verbatim relevance)**: The sweep deliberately wipes `mistakes/` at Stage C, but Execution requires fresh executors to load project mistakes per task. If Planning decomposes the Stages 0–G sweep into multiple executor tasks, then any executor task that runs AFTER Stage C wipes `mistakes/` will find an empty `.gobbi/projects/gobbi/mistakes/` directory — violating the `mistake` skill's P1 "Load mistakes before starting work" procedure for every post-Stage-C task.

**Why H-2 does not fully cover this**: The locked H-2 trade-off accepts that the **3 named** project mistakes' lessons (executor-rationalized-failing-verification-gate, session-dir-naming-convention-uses-date-prefix, manager-mispec-grep-c-for-occurrence-count) are encoded inline in the Implementation Checklist (Stage E.2 / Stage G NEEDS_CONTEXT clauses, M-3 naming, D2 #16 grep audit). H-2 says nothing about the **other ~37** project mistakes at `.gobbi/projects/gobbi/mistakes/` (general git-flow, worktree-pwd-drift, docs-sync, process-discipline patterns) — those would also be wiped by Stage C, and a post-Stage-C executor task that touches a domain those 37 cover would run blind.

**Planning constraint (binding)**: Planning MUST decompose the sweep such that **all `mistake`-skill LOADS happen BEFORE Stage C executes**. Two clean remediations:

- **(a) Single-executor sweep (RECOMMENDED)** — entire Stages 0–G run within ONE executor task. The executor loads project mistakes ONCE at task start (per the `mistake` skill's P1 load procedure, before Stage 0). After Stage C wipes `mistakes/`, the executor continues running but has already loaded the relevant patterns into its session context. No additional `mistake`-skill loads occur post-Stage-C because no additional executor tasks spawn. This matches the H-2 trade-off shape (one-time loss is acceptable in-session because the lessons are already in context) and requires zero new machinery. Simpler. Note: this means a single executor task spans Stages 0–G end-to-end (~672 lines of concrete commands, multi-stage destructive operations) — Planning's AskUserQuestion should present the task-size trade-off explicitly.

- **(b) Multi-task with snapshot** — if multi-task decomposition is preferred for bisectability / per-stage commit boundaries, then Planning MUST insert a session-scoped snapshot step BEFORE Stage C: snapshot `.gobbi/projects/gobbi/mistakes/` to a session-scoped path (e.g., `sessions/2026-05-21-6637e759-.../preparation/staging/mistakes-snapshot/`) at session start, then redirect every post-Stage-C executor task's `mistake`-skill load to read from the snapshot path instead of the wiped project-memory path. This requires (i) a delegation-prompt override for the `mistake` skill's P1 step path and (ii) a snapshot orchestration step in Planning. More machinery; only justified if bisectability per stage is required.

**Recommendation: (a)**. Citation for the H-2 trade-off already accepting the one-time-loss shape: see iter1 draft's Design + memory readiness row "Project mistakes covering the destructive-FS-ops domain" (Stage C deletion of the 3 named mistakes is documented as acceptable because lessons are encoded inline at Stage E.2 + Stage G + M-3 + D2 #16). Option (a) extends the same logic to the full mistakes bundle by loading once at task start; no additional encoding work needed.

**Out-of-scope for Preparation iter2**: choosing (a) vs (b) is a Planning decomposition decision, not a Preparation `generate-now` decision. This section pre-routes the constraint; Planning's Sub-step D AskUserQuestion picks the option.

## F-CX-PREP-O-02 — `project.json` deletion drift (Medium / 75)

**Codex finding (verbatim relevance)**: Current `git status` includes `D .gobbi/projects/gobbi/project.json`; the iter1 draft only acknowledged `.claude-plugin/marketplace.json` as already-deleted-in-tree. The iter1 Implementation Checklist Stage B / Stage F deletion inventory under-counts the existing on-disk deletion state by one file.

**Empirical confirmation**: The session-bootstrap git-status snapshot in the user's session context shows ` D .gobbi/projects/gobbi/project.json` (worktree-deleted, not yet staged) alongside ` D .claude-plugin/marketplace.json`. Both files are already deleted in the working tree (worktree deletions; `git add -A` or equivalent will pick them up automatically at commit time — no separate `rm` action needed).

**Planning constraint (binding)**: When Planning consumes the iter4 Ideation Implementation Checklist's Stage B (or wherever the inventory of already-deleted-in-tree manifests lives), the inventory MUST be augmented to acknowledge **BOTH** `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as already-deleted-in-worktree. The sweep commit will include both deletions automatically via `git add -A` (or whatever `git add` invocation the Stage B/F commit uses); no separate `rm` action is required.

**No new executor action needed**: this is purely a doc-sync correction on Planning's checklist inheritance — the sweep already handles the deletion via standard `git add` semantics. The risk is purely cognitive: if Planning's task description under-counts deletions, an executor verifying "all deletions accounted for" might flag the unannounced `project.json` deletion as out-of-scope drift and NEEDS_CONTEXT unnecessarily.

**Recommendation**: Planning's Stage B task description (or equivalent inventory line) explicitly enumerates both deletions in the "already-deleted-in-worktree" sub-bullet. One-line correction.
