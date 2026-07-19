---
name: git-operation-scenarios
description: Standing scenario baseline for every git operation across the gobbi session lifecycle (Configuration → Wrap-up), both runtimes
type: scenarios
scope: feature
feature: git-workflow
status: active
created: 2026-06-16
session: 2026-06-16-3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [git]
keywords: [lifecycle, worktree, pr, cleanup, dual-runtime]
author: claude
---

# Git-Operation Scenarios — session lifecycle baseline

The standing baseline of every git operation across the gobbi session lifecycle
(Configuration → Ideation → Planning → Execution → Wrap-up), for BOTH
runtimes (Claude Code + Codex). Each scenario records: id, lifecycle phase, trigger,
expected behavior, owning skill + procedure, runtime, and verification signal.

This is the standing reference for how git operations CORRECTLY behave. Use it as the
eval baseline for any future git-workflow change. The git skill (`git/SKILL.md`) owns
every procedure (P1-P8); other skills INVOKE those procedures by section number
(orchestration Configuration → P2; wrap-up Stage 5 → P4/P5; retro cleanup → P6/P8).

Runtime legend: `both` = runtime-neutral; `cc` = Claude Code only; `codex` = Codex only.
Type legend: G = golden path; F = failure mode; E = edge case; A = adversarial.

---

## Phase 1 — Configuration (worktree creation; invokes git P1 + P2)

| id | type | trigger | expected behavior | owner | runtime | verify signal |
|---|---|---|---|---|---|---|
| C-01 | G | Session start, "Git workflow" selected | Run posture probe (P1.1) THEN `gh --version` / `gh auth status` / remote / base-branch / gitignore checks | git P1 | both | probe stdout has 4 fields; gh checks exit 0 |
| C-02 | G | Prereqs pass | Sync base (`git checkout <base> && git pull --ff-only`), re-verify base on remote, `git worktree add -b <session-branch>` | git P2.1-3 | both | `git worktree list` shows the new worktree |
| C-03 | G | Worktree created | Install deps in worktree (`bun install`) | git P2.4 | both | install exits 0 |
| C-04 | G | session.json stamped | `git.worktreePath` set to the new worktree absolute path | orchestration row 5 | both | `session.json.git.worktreePath` non-null + path exists |
| C-05 | F | `gh` missing / unauth / no remote | Worktree still created (local git); PR deferred with notice; session never falls to main tree | git P1 + Prerequisites (5-trigger) | both | worktree exists; "PR deferred" surfaced |
| C-06 | F | Network off (Codex default `workspace-write`; CC no `allowedDomains`) | Probe reports network; remediation menu OFFERED (Always-Ask); if declined → PR deferred | git Prerequisites trigger 4 | both | probe `network: disabled/unknown`; no auto-edit of config |
| C-07 | F | Codex `read-only` session | First write op (`git worktree add`) blocked → surface "needs ≥ workspace-write"; OFFER relaunch or plan/chat-only | git Prerequisites read-only | codex | worktree add blocked → behavioral detection, not probe field |
| C-08 | E | Resume / `/clear` / `/compact`, worktreePath set AND path exists | Skip P2; `cd` into existing worktree (3-state idempotency guard) | orchestration row 1 | both | no second `git worktree add`; reuses path |
| C-09 | E | worktreePath set AND path MISSING (orphaned) | Warn + ask user: recreate (re-run P2) or abort; recovery via P6 | orchestration row 1 → git P6 | both | user-decision surfaced; no silent recreate |
| C-10 | E | Base branch deleted on remote between start and P2 | P2 step 2 re-verification catches it; surface to user; switch / recreate base | git P2.2 | both | `git ls-remote` empty → surfaced |
| C-11 | A | Branch name fails session-worktree regex | Precondition violation; surface + re-derive (session branches use the fixed `(claude\|codex)-DATE-UUID` shape) | git conventions § Session-Worktree Branches | both | regex match before `git worktree add -b` |
| C-12 | E | `.gobbi/.../worktrees/` not gitignored | Warning prereq; worktree contents would appear in main `git status`; inform + continue | git P1.6 | both | `git check-ignore -q` exit code |

## Phase 2 — Ideation / Planning (no git mutation; read-only on git)

These loops do NOT push, branch, merge, or touch issues. They read `git log` for prior-attempt
research and write session-record files rooted at `worktreePath`. The only git-relevant risk is
the write-path / CWD discipline.

| id | type | trigger | expected behavior | owner | runtime | verify signal |
|---|---|---|---|---|---|---|
| D-01 | G | Leader researches prior attempts (Ideation Sub-step A step 5) | `git log` grep read-only; no mutation | git Memory Access Matrix | both | `git status --porcelain` empty after |
| D-02 | G | Any loop writes a session-record file | Path roots at absolute `session.json.git.worktreePath`, never relative / cwd | git § Worktree CWD discipline | both | written file resolves under worktree |
| D-03 | F | CWD reset between Bash turns | Use `git -C <worktree-abs>` for any git op; absolute path for any write | git § Worktree CWD discipline | both | no write lands in main tree |
| D-04 | E | `worktreePath` is `null` in session.json | Surface as malformed-session.json ERROR; never treat as main-tree write signal | git Memory Access Matrix critical rule | both | error surfaced, not silent main-tree write |
| D-05 | E | Codex bridge / evaluator launched via `codex exec` | `--cd <root>` anchors codex; `--add-dir` extends writable set when session paths sit outside the detected root | git § Codex CWD inheritance | codex | codex writes land under worktree |

## Phase 3 — Execution (subagent commits; manager pushes; invokes git P3 + P4 + P7)

| id | type | trigger | expected behavior | owner | runtime | verify signal |
|---|---|---|---|---|---|---|
| X-01 | G | Subagent finishes a verified task | One focused commit in worktree (`git -C`), `AI-Provenance-Record:` trailer, never `Co-Authored-By:` | git P3 + conventions | both | commit present; trailer matches; subject regex passes |
| X-02 | G | Commit grammar | Subject matches Conventional-Commits regex; ≤ 72 chars; imperative | git conventions § Commit Messages | both | subject regex match |
| X-03 | A | Subagent attempts `git push` / `gh pr` / `gh issue` | BLOCKED — subagent reports DONE; manager owns push | git Forbidden Ops + Role Boundaries | both | no push from subagent context |
| X-04 | G | All subtasks done + verified | Manager `cd`s to worktree, `git push -u origin <branch>`, `gh pr create`, label, monitor CI | git P4 | both | branch on remote; PR open; CI watched |
| X-05 | F | CI fails on PR | P7: identify run, view logs, diagnose, fix in worktree (executor commits), push fix, re-monitor | git P7 | both | failed run id found; fix commit pushed |
| X-06 | F | External CI (CircleCI / Jenkins) | `gh run view` returns nothing useful → surface the status-check URL for the user | git P7.2 | both | URL surfaced |
| X-07 | F | `git push` blocked (network off / approval declined) | Remediation menu OFFERED, then PR deferred (triggers 4-5) | git Failure Modes | both | "PR deferred" surfaced; config unchanged |
| X-08 | F | `gh pr create` fails TLS under macOS Seatbelt | `gh` is a Go CLI blocked by Seatbelt TLS; remedy = `excludedCommands`; OFFER it | git Runtime § Claude Code | cc | `gh --version` may pass yet `gh pr create` fails |
| X-09 | E | Subagent tries to write `.git/hooks` or `.git/config` | OS-denied by sandbox (not just gobbi rule); commit (refs + index) unaffected | git Role Boundaries | both | write fails at OS layer |
| X-10 | A | Subagent considers `git stash` to defer work across delegation | Forbidden — use a temporary linked worktree instead | git Forbidden Ops | both | no stash inside worktree |
| X-11 | F | Merge conflict on base sync / PR branch during fix loop | Detect → surface to manager → executor resolves in worktree → re-verify → continue; no force-push without Always-Ask | git P5 merge-conflict recovery | both | conflict resolved by executor; re-verified |

## Phase 4 — Wrap-up (manager git finalization; invokes git P4 + P5)

Wrap-up Stage 5 is the LAST stage; it runs only after Stage 3 memory validation PASSES.
It commits the memory promotion writes (tracked `features/`, `mistakes/`, etc.), then runs
git P4 (push / PR — reuse the open one) + P5 (land PR + cleanup). The whole `sessions/` tree is
gitignored, so only promotion writes are committed.

| id | type | trigger | expected behavior | owner | runtime | verify signal |
|---|---|---|---|---|---|---|
| W-01 | G | Stage 3 memory validation PASS | Manager commits promotion writes with `AI-Provenance-Record:` trailer | wrap-up Stage 5 + git P4 | both | promotion commit on session branch |
| W-02 | G | Pre-merge gate | All CI green, all subtasks done, no uncommitted worktree changes, PR body complete, non-default-branch linked-issue note | git P5 pre-merge gate | both | every gate item checked |
| W-03 | G | Gate passes (P5 step 1) | `gh pr merge <num> --squash` — merge ONLY; `--delete-branch` is NOT passed (it cannot delete a worktree-held branch). This begins the fixed P5 sequence: merge → sync base → remove worktree → delete remote → delete local → close issues | git P5.1 | both | PR merged |
| W-04 | G | PR merged (P5 step 2) | `git checkout <base> && git pull --ff-only` to sync the local base to the merge commit — BEFORE the worktree is removed | git P5.2 | both | local base at merge commit |
| W-05 | G | Local base synced (P5 step 3) | `git status` inside the worktree confirms a clean tree; the branch is confirmed merged-into-base by PR-association (`gh pr view <num> --json state,mergedAt` MERGED — NOT `git branch --merged`, which a squash false-negatives); then `git worktree remove <path>` (no `--force`) + `git worktree prune` + `find ... -type d -empty -delete`. Worktree removal happens BEFORE any branch delete | git P5.3 | both | worktree removed; clean + PR-association merged confirmed first; no stale refs / empty parents |
| W-06 | G | Worktree removed (P5 step 4) | `git push origin --delete <branch>` deletes the REMOTE branch — now succeeds because the worktree no longer holds the branch. `--delete-branch` at merge would have failed for exactly this reason | git P5.4 | both | remote branch gone after worktree removal |
| W-07 | G | Remote branch deleted (P5 step 5) | Delete the LOCAL branch via the sanctioned `git branch -D` carve-out, gated on PR-association merged-confirmation. `git branch -d` cannot recognize a squash-merge (new commit, no history overlap), so `-D` is the only path AFTER merge is confirmed; the tip stays in the reflog | git P5.5 (`-D` carve-out) | both | local branch gone after merge; reflog retains tip |
| W-08 | G | Local branch deleted (P5 step 6) | Close issues by PR-association done-detection: linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API; non-default base makes closing keywords inert so all closing is manual (`gh issue close`) | git P5.6 | both | PR-associated issues closed manually; closing-keyword auto-fire not relied on |
| W-09 | F | Worktree removal fails — unclean tree or locked refs | `git status` first; if unclean, commit / discard explicitly; `--force` is Forbidden without Always-Ask | git Failure Modes | both | no silent `--force` |
| W-10 | F | Non-default-branch PR (e.g. targets `develop`) | Closing keywords do NOT auto-fire; manager `gh issue close <num>` for each LINKED issue | git P5.6 | both | linked issues closed manually |
| W-11 | F | Finished-but-UNLINKED issue (resolved by the session's work but no `Closes #` link) | PR-association done-detection from two concrete sources: keyword-linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API (`gh api repos/{owner}/{repo}/issues/<n>/timeline`); per-object confirm-and-close — no acceptance-body reading. HONEST BOUNDARY: an issue the PR NEVER references (linked or mentioned) cannot be auto-detected — the open-issue list is SURFACED to the user at the manual close step to identify it; never auto-closed | git P5.6 | both | PR-referenced issues detected + confirmed-closed; unreferenced done issues surfaced for user identification, not auto-closed |
| W-12 | F | Wrap-up Stage 5 promotion-commit push BLOCKED (network off / approval declined) | The five-trigger PR-deferral applies: promotion writes stay committed locally on the branch; the PR is deferred (opened later when the blocker clears); never fall to main tree | wrap-up Stage 5 + git Prerequisites | both | promotion commit local; "PR deferred" surfaced; no main-tree fallback |
| W-13 | E | PR already open (Execution opened it at P4); Wrap-up adds the promotion commit | Idempotent path: PUSH the promotion commit to the same branch; reuse the open PR; do NOT re-create it | git P4 (idempotent reuse) | both | second commit lands on the existing PR; no duplicate PR |

## Phase 5 — Cross-session / retro (accumulated cruft; invokes git P8)

P6 recovers a SINGLE orphaned worktree mid-session. P8 is the BULK companion: it sweeps
accumulated cruft across all four object classes (worktrees, remote branches, local branches,
open issues) in one audited, confirmed, liveness-protected pass.

| id | type | trigger | expected behavior | owner | runtime | verify signal |
|---|---|---|---|---|---|---|
| S-01 | G | Single orphaned worktree surfaced mid-session | P6: inspect (`git log -3`), surface to user (recover / resume / cleanup), act | git P6 | both | user-decision; one worktree handled |
| S-02 | F | N accumulated orphaned worktrees | P8: audit → protect-by-liveness → classify → dry-run → confirm → TOCTOU re-check → act → durable record | git P8 | both | each worktree classified by liveness criterion (not bare list membership), then confirmed |
| S-03 | F | N accumulated stale REMOTE branches | P8 classify: merged-detection via `gh pr` PR-association (covers squash) → confirm per class | git P8 | both | each remote branch classified merged / unmerged before delete |
| S-04 | F | N accumulated LOCAL branches (some active-worktree) | P8: squash-merged local branches use the sanctioned `-D` path in batch; active-worktree branches protected | git P8 | both | active-worktree branches protected; merged ones deleted after confirm |
| S-05 | F | N accumulated OPEN issues (many done but unlinked) | P8 classify by PR-association ONLY (no acceptance-body reading, DQ4) from two concrete sources — keyword-linked via `gh pr view <num> --json closingIssuesReferences`, mentioned-but-unlinked via the timeline / cross-reference API → `{resolved-by-merged-PR, open-genuine}`; confirm-and-close per class. An issue NO merged PR references is surfaced at the per-object `[ASK]`, never auto-closed (P8 close is destructive) | git P8 | both | each issue classified by merged-PR association before close; unreferenced done issues surfaced, never swept |
| S-06 | A | Bulk sweep would touch a branch checked out in a LIVE worktree | MUST protect — classify by an implementation-grade liveness probe (held-flock: `flock -n <lock> true` FAILS ⇒ held ⇒ live / active process / fresh-commit window), NOT bare `git worktree list` membership and NOT bare lock-file existence (the lock persists after a crash) | git P8 PROTECT | both | live-worktree branches excluded by the held-flock liveness probe; bare lock presence never classifies LIVE |
| S-07 | A | Bulk sweep would delete an UNMERGED branch | MUST NOT delete without explicit per-object Always-Ask; unmerged = unique work at risk | git P8 CONFIRM | both | unmerged branches gated behind per-object confirm |
| S-08 | A | `gh issue delete` considered for cleanup | Forbidden (no undelete); use `gh issue close` + comment | git Forbidden Ops | both | no `gh issue delete` |
| S-09 | E | Concurrent session holds a worktree / branch DURING the sweep; state changes between dry-run and act | TOCTOU re-check immediately before ACT — re-run the held-flock / process probe; exclude live-worktree branches by the liveness criterion | git P8 TOCTOU | both | re-check skips any object whose state changed; live-worktree branches excluded |

---

## Coverage summary

| Lifecycle phase | scenarios |
|---|---|
| Configuration | 12 (C-01..C-12) |
| Ideation / Planning | 5 (D-01..D-05) |
| Execution | 11 (X-01..X-11) |
| Wrap-up | 13 (W-01..W-13) |
| Cross-session / retro | 9 (S-01..S-09) |
| **Total** | **50** |

Runtime split: **47 `both`, 1 `cc` (X-08), 2 `codex` (C-07, D-05)** = 50. Most scenarios are
runtime-neutral because the commit-vs-push boundary lines up with BOTH sandboxes (git skill
§ Role Boundaries); the runtime-specific ones are the network / approval / Seatbelt failure legs.

## Related

- `features/git-workflow/checklists/git/git-operation-checklists.md` — the actionable per-phase checklists derived from these scenarios
- `skills/git/SKILL.md` — owns every procedure (P1-P8) referenced here
- `skills/git/conventions.md` — branch / commit / trailer / merge-strategy rules
- `skills/wrap-up/SKILL.md` § Stage 5 — git finalization wiring (W-01, W-12, W-13)
