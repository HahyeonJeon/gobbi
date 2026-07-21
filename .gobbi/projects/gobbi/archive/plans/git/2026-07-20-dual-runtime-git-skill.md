---
name: dual-runtime-git-skill
description: Make the gobbi git skill cover git/GitHub ops across Claude Code + Codex, safe-by-default under each runtime sandbox/approval model
type: plans
scope: feature
feature: git-workflow
status: completed
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex]
keywords: [dual-runtime, claude-code, plan]
author: claude
task: Improve the git skill to fully cover git/GitHub operations across Claude Code and Codex runtimes
supersedes: null
superseded_by: null
task_count: 7
archived_at: 2026-07-20
archive_reason: completed
---

# Plan — Dual-Runtime git skill (Claude Code + Codex)

Make the gobbi git skill correctly cover git/GitHub operations across both agent runtimes, safe-by-default
under each runtime's sandbox/approval model. Seven Execution tasks, ordered bottom-up. The two hooks
(DD-6) are NOT scheduled — deferred pending user confirmation (default recommendation: defer to backlog).

## Locked decisions baked in

- **OQ-1** — ONE dedicated "Runtime git environment" section (CC + Codex subsections) referenced by
  P1–P7; runtime-tag column on the Scenario + Failure tables. Not inline tags.
- **OQ-5** — read-only Codex policy = detect + surface "needs ≥ workspace-write" + offer re-launch OR
  explicit read-only plan/chat-only mode.
- **OQ-7** — "runtime git posture" (concept); "git posture probe" (script).
- **PIN-1** — probe reports network reliably; sandbox-mode + approval-policy as explicit "unknown".

## Task list (execution order)

| # | id | What | Files | Anchors |
|---|---|---|---|---|
| T01 | 01-runtime-git-environment-section | Add "Runtime git environment" section (CC + Codex subsections), cross-ref codex/SKILL.md | `skills/git/SKILL.md` | C01-C04, C06-C08, DD-1 |
| T02 | 02-git-posture-probe-script | Create read-only git posture probe (network reliable; sandbox/approval = "unknown") | `skills/git/scripts/git-posture-probe.sh` (create) | C11, C18, DD-3, PIN-1 |
| T03 | 03-wire-probe-and-five-trigger-deferral | Wire probe into P1; flag P2 install as network-needing; five-trigger PR-deferral + Always-Ask remediation menu | `skills/git/SKILL.md` | C09, C11-C13, C19, DD-2 |
| T04 | 04-sandbox-boundary-merge-conflicts-runtime-tags | Tie split to sandbox boundary + .git OS-denial; merge-conflict handling in P5/P7; runtime-tag column on tables | `skills/git/SKILL.md` | C10, C14-C16, DD-4, DD-5 |
| T05 | 05-worktree-cwd-discipline-section | Add "Worktree CWD discipline" section so codex/SKILL.md:254 resolves | `skills/git/SKILL.md` | C20, DD-7, S31 |
| T06 | 06-codex-skill-alignment | Repoint/confirm codex/SKILL.md:254 to the new section heading; no git-procedure duplication | `skills/codex/SKILL.md` | C20, DD-1, S31 |
| T07 | 07-runtime-wiring-conventions-agents-config | Runtime-wiring note in conventions + manager/executor prompts + Codex config/agent wrappers; no default sandbox-loosening | `skills/git/conventions.md`, `agents/manager.md`, `agents/executor.md`, `.codex/config.toml`, `.codex/agents/{leader,executor,manager}.toml` | C13, C14, C17, C19, S32 |

## Dependencies

- T01, T02 → foundation (no deps).
- T03 requires T01 + T02.
- T04 requires T03; T05 requires T04 (single `git/SKILL.md` lane, strict sequential).
- T06 requires T05 (link target must exist first).
- T07 requires T03 (points at the deferral/remediation logic); disjoint files from the SKILL.md lane.

## Conflict flags

- T01/T03/T04/T05 all touch `skills/git/SKILL.md` — sequential, NOT parallel-safe; each owns a distinct
  section-set.
- T05 → T06 strictly ordered (target-before-link).
- No cross-lane file overlap otherwise.

## Agent assignments

All tasks: executor / opus (default). Mandatory skills: `principles`, `mistake`, `git`, `codex`,
`execution`. Per-task additions: `discussion` (T03 — Always-Ask classification); conditional `claude`
(T07 — only if `test -f` confirms it exists; it is a known dangling ref). Required mistakes:
`planning-asserted-skill-without-verifying` (T01/T03/T07), `file-move-needs-link-resolution-check`
(T05/T06), `plan-rename-must-enumerate-all-ref-classes` (T06/T07).

## Verification (anchored, not authored)

Each task's `verifies` is a runnable grep / file-existence / link-resolution check (see
`3-planning/working/draft-iter1.md § Tasks`). Notably T05/T06 use
`skills/orchestration/scripts/check-markdown-links.sh` to prove `codex/SKILL.md:254` resolves (per the
`file-move-needs-link-resolution-check` mistake), and T02 verifies the probe runs read-only + exits 0 +
mutates nothing.

## Out of scope

DD-6 hook edits (deferred, user-confirmation gated — default: defer to backlog); any default
sandbox-loosening; `features/git-workflow/` bootstrap (Wrap-up owns it); test-writing tasks.

## Readiness gaps (Preparation skipped — flagged, non-blocking)

1. `features/git-workflow/` absent (only `features/workflow/`) — expected per R5; Wrap-up bootstraps;
   does not block Planning.
2. `.codex/config.toml` worktree HEAD is `[agents]`-only (matches INT-5); the main-tree working copy has
   uncommitted `network_access = true` drift. T07 MUST target the worktree HEAD and MUST NOT inherit
   that drift (D2 safe-by-default).
