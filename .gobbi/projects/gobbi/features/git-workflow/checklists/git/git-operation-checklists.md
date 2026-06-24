---
name: git-operation-checklists
description: Standing per-phase git checklists across the gobbi session lifecycle, derived from the git-operation scenario baseline
type: checklists
scope: feature
feature: git-workflow
status: active
created: 2026-06-16
session: 2026-06-16-3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [git]
keywords: [lifecycle, worktree, pr, cleanup, dual-runtime]
author: claude
---

# Per-Phase Git Checklists

Actionable git checklists per lifecycle point, derived from
`features/git-workflow/scenarios/git-operation-scenarios.md`. Each item names the scenario id(s)
it covers and the owning skill / procedure. `[ASK]` marks a destructive operation that requires
the active runtime's user-decision primitive (Always-Ask per `discussion/SKILL.md`
§ Decision Classification).

---

## CL-1 — Configuration (worktree create) — manager runs git P1 + P2

- [ ] Run the git posture probe FIRST, before any push assumption (C-01)
- [ ] `gh --version`, `gh auth status`, `git remote get-url origin`, `git ls-remote --heads origin <base>`, `git check-ignore -q .../worktrees/` (C-01, C-12)
- [ ] Sync base: `git checkout <base> && git pull --ff-only`; re-verify base on remote (C-02, C-10)
- [ ] Validate the session-branch name against the `(claude|codex)-DATE-UUID` regex BEFORE `git worktree add -b` (C-11)
- [ ] `git worktree add -b <session-branch> <path> <base>`; install deps in worktree (C-02, C-03)
- [ ] Stamp `session.json.git.worktreePath` to the new absolute path; confirm non-null + exists (C-04)
- [ ] If `gh` / auth / remote / network / approval unavailable: create the worktree (local git), DEFER the PR, surface the notice; never fall to the main tree (C-05, C-06)
- [ ] `[ASK]` If network off: OFFER the runtime remediation menu; NEVER auto-edit `.codex/config.toml` or Claude Code settings (C-06)
- [ ] `[ASK]` If Codex `read-only` blocks `git worktree add`: surface "needs ≥ workspace-write"; OFFER relaunch or plan / chat-only (C-07)
- [ ] On resume / clear / compact: apply the 3-state idempotency guard — reuse the existing worktree, or recover an orphaned one via P6 (C-08, C-09)

## CL-2 — Ideation / Preparation / Planning (read-only on git)

- [ ] Any `git log` research is read-only; `git status --porcelain` empty after (D-01)
- [ ] Every session-record write roots at absolute `session.json.git.worktreePath` — never relative / `pwd` (D-02)
- [ ] Every git op uses `git -C <worktree-abs>` (CWD resets between Bash turns) (D-03)
- [ ] A `null` `worktreePath` is a malformed-session.json ERROR, never a main-tree write signal (D-04)
- [ ] Codex `codex exec` anchored with `--cd <root>` + `--add-dir` when session paths sit outside the detected root (D-05)

## CL-3 — Execution (subagent commit; manager push) — git P3 + P4 + P7

- [ ] Subagent commits one focused commit per task AFTER Verify passes; `git -C <worktree-abs>` (X-01)
- [ ] Commit carries the `AI-Provenance-Record:` trailer; NEVER `Co-Authored-By:` (X-01)
- [ ] Commit subject matches the Conventional-Commits regex (≤ 72, imperative, lowercase) (X-02)
- [ ] Subagent NEVER runs `git push` / `gh pr *` / `gh issue *` — reports DONE; manager handles (X-03)
- [ ] Subagent NEVER uses `git stash` inside the worktree — temporary linked worktree instead (X-10)
- [ ] Manager pushes only after ALL subtasks done + verified: `git push -u origin <branch>`, `gh pr create`, label, monitor CI (X-04)
- [ ] On CI failure: P7 (identify run, view logs, diagnose, fix in worktree, push, re-monitor); external CI → surface status URL (X-05, X-06)
- [ ] `[ASK]` On push blocked (network / approval / Seatbelt-TLS): OFFER remediation, then DEFER the PR (X-07, X-08)
- [ ] On merge conflict: detect → manager surfaces → executor resolves in worktree → re-verify → continue; no force-push without `[ASK]` (X-11)

## CL-4 — Wrap-up Stage 5 (manager git finalization) — git P4 + P5

Runs ONLY after Stage 3 memory validation PASSES. The order below reflects the P5 sequence: the
worktree is removed BEFORE any branch delete, so `git push origin --delete` can succeed.

- [ ] Commit the memory promotion writes (tracked `features/`, `mistakes/`, etc.) with the `AI-Provenance-Record:` trailer (W-01)
- [ ] If the promotion-commit push is BLOCKED (network / approval): the five-trigger PR-deferral applies — promotion writes stay committed locally on the branch; the PR is deferred; never fall to the main tree (W-12)
- [ ] If a PR is already open (opened during Execution): PUSH the promotion commit to the SAME branch and reuse the open PR; do NOT re-create it (W-13)
- [ ] Run the pre-merge gate: CI green, subtasks done, no uncommitted worktree changes, PR body complete, non-default-branch linked-issue note (W-02)
- [ ] P5 step 1 — `gh pr merge <num> --squash` — merge ONLY; do NOT pass `--delete-branch` (it cannot delete a worktree-held branch) (W-03)
- [ ] P5 step 2 — `git checkout <base> && git pull --ff-only` to sync the local base — BEFORE the worktree is removed (W-04)
- [ ] P5 step 3 — `git status` inside the worktree confirms a clean tree; confirm merged-into-base by PR-association (`gh pr view <num> --json state,mergedAt` shows MERGED — NOT `git branch --merged`, which a squash false-negatives); then `git worktree remove <path>` (no `--force`) + `git worktree prune` + `find .../worktrees/ -type d -empty -delete` — THIS HAPPENS BEFORE EITHER BRANCH DELETE (W-05)
- [ ] P5 step 4 — branch is now free → `git push origin --delete <branch>` (remote); verify `git ls-remote --heads origin <branch>` is empty (W-06)
- [ ] P5 step 5 — delete the LOCAL branch via the sanctioned `git branch -D` carve-out, gated on PR-association merged-confirmation (NOT `git branch -d`, which fails on a squash) (W-07)
- [ ] P5 step 6 — close issues by PR-association done-detection: linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API; manual `gh issue close` (closing keywords inert on a non-default base) (W-08)
- [ ] `[ASK]` If the worktree is unclean before removal: commit / discard explicitly; `--force` is Forbidden without Always-Ask (W-09)
- [ ] On a non-default-branch PR: `gh issue close <num>` for each LINKED issue (closing keywords do not fire) (W-10)
- [ ] Detect finished-but-UNLINKED issues by PR-association ONLY (no acceptance-body reading) — keyword-linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API; `[ASK]` per-object confirm-and-close. An issue the PR NEVER references is SURFACED to the user at the manual close step, never auto-closed (W-11)

## CL-5 — Retro / bulk sweep (git P8) — destructive, dry-run + confirm

Fixed order: AUDIT → PROTECT → CLASSIFY → DRY-RUN → CONFIRM → TOCTOU re-check → ACT → RECORD.
Every delete and close is an `[ASK]` destructive operation.

- [ ] AUDIT (read-only): enumerate orphaned worktrees (`git worktree list`), remote branches (`git branch -r`), local branches (`git branch`), open issues (`gh issue list`) — capture counts as the baseline (S-02..S-05)
- [ ] PROTECT (built BEFORE classification): exclude the base branch, the current session branch, every branch held by a LIVE worktree, and any user protect-list entry (S-06, S-09)
- [ ] Classify worktree liveness by an implementation-grade probe, NOT bare `git worktree list` membership AND NOT bare `session.json.lock` existence (the lock persists after a crash). LIVE if any of {the lock is HELD — `flock -n <lock> true` FAILS ⇒ held ⇒ live; an active session process holds the worktree; (corroborating) tip-commit younger than the freshness window (recommend 24h)}; CRASHED-ORPHAN if all of {flock probe SUCCEEDS / no lock held, no process, stale tip}. Bare lock-file presence is never a valid LIVE signal (S-02, S-06)
- [ ] Classify each remote / local branch by PR-association merged-detection (covers squash) → {merged-squash, merged-normal, unmerged}; cross with worktree-liveness (S-03, S-04, S-07)
- [ ] Classify each issue by PR-association ONLY (no acceptance-criteria-body reading, DQ4) → {resolved-by-merged-PR, open-genuine}; concrete sources: keyword-linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API (`gh api repos/{owner}/{repo}/issues/<n>/timeline`). An issue NO merged PR references is SURFACED at the per-object `[ASK]` confirm, never auto-closed (P8 close is destructive) (S-05, W-11)
- [ ] DRY-RUN preview FIRST: show the full proposed delete / close set per object WITHOUT acting; user reviews the whole set (all S-*)
- [ ] `[ASK]` CONFIRM per CLASS after the dry-run: approve "delete these N worktrees / N branches / close these N issues" as a reviewed batch per class (S-02..S-05)
- [ ] `[ASK]` EXCEPTION — per-object confirm for any UNMERGED branch delete (S-07) and any classification-ambiguous object (near the freshness window, or an inconclusive flock probe)
- [ ] TOCTOU re-check: immediately before ACT on each object, re-check its merged-state + worktree-liveness (re-run the held-flock / process probe); if it disagrees with the dry-run, SKIP and record the skip (S-09)
- [ ] ACT: `git worktree remove` + prune + empty-parent cleanup (worktrees); `git push origin --delete` + sanctioned `-D` (branches); `gh issue close -c "<reason>"` (issues) — NEVER `gh issue delete` (S-02..S-05, S-08)
- [ ] DURABLE RECORD: write the sweep result (audit baseline, classification, confirmed set, acted / skipped / failed per object) to a COMMITTED report at PROJECT-ROOT `.gobbi/projects/<name>/reports/{date}-retro-sweep.md` — `reports` is a project-only memory type (no `features/{f}/` tier), OUTSIDE the gitignored session tree, so the irreversible-delete trail survives Wrap-up. ACT is per-object idempotent; a mid-sweep abort is resumable from the record (all S-*)

---

## Related

- `features/git-workflow/scenarios/git-operation-scenarios.md` — the scenario baseline these checklists derive from
- `skills/git/SKILL.md` — P1-P8 procedures
- `skills/git/conventions.md` — branch / commit / trailer / merge-strategy rules
- `skills/wrap-up/SKILL.md` § Stage 5 — git finalization wiring
