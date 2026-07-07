---
name: point-03-change-set-c-shipped
description: Point-3 review change-set C shipped — one authoritative codex exec launch runtime matrix replaces the contradictory foreground timeout-1200 guidance
type: notes
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf-p3
tags: [codex, process]
keywords: [runtime-matrix, codex-exec, production, evaluation, c-high-4, source-read-only-gate, dual-system]
author: claude
features_touched: []
loops_completed: [execution, wrap-up]
shipped: [git-gate-blind-to-gitignored-writes]
---

# Point 3 change-set C shipped

## What happened

This session implemented change-set C from the locked Point-3 orchestration adversarial review (`reviews/adversarial-review/2026-07-06-point-03-orchestration-adversarial-review.md`): reconcile all `codex exec` launch guidance to one authoritative "`codex exec` launch runtime matrix" in `codex/SKILL.md`, replacing a real contradiction — foreground `timeout 1200` guidance versus the ~600s Claude Code Bash foreground cap — that had silently degraded dual-system production and evaluation to single-system in prior sessions. The runtime matrix became the single source of truth (SSOT); `production.md` and `evaluation.md` now point to it instead of restating launch mechanics. The work also added the DONE invariant (files-as-truth: a wrapper is done only when it has validated its contracted output files in the same turn) and the C-HIGH-4 proposer source-read-only gate for the Codex proposer's `--sandbox workspace-write` boundary. Execution ran two dual-system evaluation rounds; both rounds caught real correctness defects in the gate design, and both were fixed before this Wrap-up. The change landed in commit `9b723897` (3 files: `codex/SKILL.md`, `orchestration/workflow/production.md`, `orchestration/workflow/evaluation.md`).

## What shipped

- One authoritative `codex exec` launch runtime matrix in `codex/SKILL.md` (foreground-under-cap vs background, ~600s Claude Code Bash foreground cap / ~540s safety margin, a note to re-verify the cap before relying on it, and native Codex uses its own cap).
- `orchestration/workflow/production.md` and `orchestration/workflow/evaluation.md` updated to point at the matrix as SSOT instead of restating launch mechanics.
- The foreground `timeout 1200` guidance is marked superseded by the runtime matrix.
- The DONE invariant (files-as-truth, same-turn output validation) stated at `codex/SKILL.md` § Files-as-truth.
- The C-HIGH-4 proposer source-read-only gate in `production.md`: after the proposer completes and before the producer integrates, `git status --porcelain` on the worktree confirms no tracked source/skill file changed (the proposer runs under `--sandbox workspace-write`, so the prompt-only "write only your proposal" instruction is not mechanically enforced).
- One project mistake: `mistakes/verification/git-gate-blind-to-gitignored-writes.md` — the fail-open gate design that the two evaluation rounds caught (a git-based confinement claim inside a gitignored path can never be observed by git, and `git diff --stat` is not a safe substitute for `git status --porcelain` because it misses untracked files).

## What got stuck

Nothing stuck in this session's own scope (change-set C). The remaining four change-sets from the same review were out of this session's scope by the user-confirmed priority order, not stuck — see Next session.

## What shifted

The C-HIGH-4 gate went through two corrections during dual-system evaluation before it was correct: the first draft claimed a `git status --porcelain` OR `git diff --stat` check would show "changes confined to `working/proposals/codex/`" — both evaluation rounds caught that this can never be true, because the session tree is gitignored (git cannot observe writes inside it at all) and `git diff --stat` separately misses untracked new files. The gate now correctly asserts "no tracked source/skill file changed," which is what `git status --porcelain` can actually verify, and the noted residual limitation (a proposer writing a sibling gitignored session file, e.g. its own canonical draft, is not caught by any git-based check) is documented in `production.md` rather than papered over.

## Decisions to respect

- The `codex exec` launch runtime matrix in `codex/SKILL.md` is the SSOT for launch mode. Do not restate foreground/background/timeout mechanics in `production.md` or `evaluation.md` — point to the matrix.
- Threshold: Claude Code Bash foreground cap is ~600s; background any `codex exec` invocation that may exceed ~540s (the safety margin under the cap); native Codex uses its own cap, not the Claude Code Bash cap. Re-verify the ~600s figure before relying on it — it is not independently pinned to a versioned source in this session's work.
- A git-based gate must never claim to observe a confinement/absence property inside a gitignored path, and must never treat `git diff --stat` as equivalent to `git status --porcelain` (see the shipped mistake above).
- Priority order for the Point-3 review's five change-sets is user-confirmed: C (this session, done) → A → B → D → E.
- `production.md` was edited here (change-set C) and is also targeted for compaction by a separate PR's design (Point 2) — coordinate the two before either lands, to avoid one overwriting the other's edit to the same file. Also still open: a combined dead-cross-reference cleanup across the two efforts.

## Next session

Pick up change-set A next (user-confirmed priority order): shell `lib/common.sh` extraction, the fail-closed `canon()` fix (C-BUG-1), the agent-token bugs, and bash-4 compatibility guards, all from the same Point-3 review. After A: change-set B (record-map manifest single-source; retire the frozen residual-vocabulary baseline), then D (Agent Teams currency refresh), then E (scenario suite + `workflow/configuration.md`). Before starting A, check whether the Point-2 `production.md` compaction PR has landed, since both efforts touch that file.

## Related

- [[point-03-orchestration-adversarial-review]] — the locked review this change-set implements; findings C-HIGH-2/3 (runtime matrix) and C-HIGH-4 (source-read-only gate) resolved here.
- [[git-gate-blind-to-gitignored-writes]] — the mistake promoted from this session's dual-system evaluation catch.
