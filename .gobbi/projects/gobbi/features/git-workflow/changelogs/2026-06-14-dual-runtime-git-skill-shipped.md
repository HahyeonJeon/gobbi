---
name: dual-runtime-git-skill-shipped
description: The dual-runtime git skill shipped — Runtime git environment section, read-only posture probe, five-trigger deferral, sandbox-boundary split, Worktree CWD discipline, Codex config/agent wiring
type: changelogs
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex]
keywords: [dual-runtime, claude-code, probe, sandbox]
author: claude
shipped_in: 9d522168..ab25dce0 (9 commits; HEAD ab25dce0)
---

# Dual-runtime git skill shipped (Claude Code + Codex)

**Task:** Improve the git skill to fully cover git/GitHub operations across Claude Code and Codex
runtimes — 7-task plan (`features/git-workflow/plans/2026-06-14-dual-runtime-git-skill.md`),
executed bottom-up, both Execution evaluators PASS.

## Summary

The gobbi git skill was single-runtime-in-disguise: it read as a Claude-Code document with Codex
present only as a branch-name prefix, and had zero coverage of Codex sandbox / approval / network
constraints. This change makes the skill correctly cover git/GitHub operations across BOTH agent
runtimes, safe-by-default under each runtime's sandbox/approval model, and resolves a dangling
`codex/SKILL.md:254` cross-reference into the git skill.

## What changed

Nine commits on the session branch (`9d522168..ab25dce0`, HEAD `ab25dce0`):

| Commit | What shipped |
|---|---|
| `18f7e784` | Add "Runtime git environment" section (dual-runtime sandbox/approval model) — `skills/git/SKILL.md` (DD-1, T01) |
| `ab4962a6` | Add read-only git posture probe (network reliable; sandbox/approval = "unknown") — `skills/git/scripts/git-posture-probe.sh` (DD-3, T02) |
| `a6c5d0a6` | Wire probe into P1 + 5-trigger PR-deferral + Always-Ask remediation menu (DD-2, T03) |
| `56bdc133` | Tie commit/push split to sandbox boundary + merge-conflict handling + runtime-tagged failure modes (DD-4/DD-5, T04) |
| `bf6e1975` | Add "Worktree CWD discipline" section (resolves codex/SKILL.md cross-reference) (DD-7, T05) |
| `59d131a6` | Link the git Worktree CWD discipline cross-reference (machine-checkable) — `skills/codex/SKILL.md:254` (T06) |
| `edb5d039` | Wire runtime git posture into conventions, agent prompts, and Codex config (safe-by-default) — `skills/git/conventions.md`, `agents/manager.md`, `agents/executor.md`, `.codex/config.toml`, `.codex/agents/*.toml` (T07) |
| `11a3eefb` | R1 remediation: correct codex cross-reference ownership + behavioral read-only detection + probe runtime order (fixes F1/F2/F3) |
| `ab25dce0` | R2 remediation: attribute approval-not-granted to its behavioral source, not the probe (fixes CONSISTENCY-1) |

## Verification

Both Execution iter2 evaluators returned **PASS** (no Critical/High open):
- F1-F4 (round-1 dual-system findings) all resolved + verified, not trusted.
- Probe honesty contract held: `git status --porcelain` empty after every probe run; network
  reported disabled only on a reliable signal (`CODEX_SANDBOX_NETWORK_DISABLED=1`); sandbox-mode +
  approval-policy report `unknown` rather than guessing.
- Safe-by-default held: `git show HEAD:.codex/config.toml | grep -v '^#' | grep network_access` →
  EMPTY (no active `network_access = true`).
- `CODEX_THREAD_ID=x CLAUDECODE=1 probe | grep runtime` → `codex` (mixed-env precedence correct).
- Markdown link checker: ALL LINKS RESOLVE (24 relative links across 5 files); the previously
  dangling `codex/SKILL.md:254` now resolves to `git/SKILL.md#worktree-cwd-discipline`.
- `git diff --check 9d522168 HEAD` → no output (no whitespace errors).

## Deferred

- DD-6 hook edits (git-lifecycle telemetry in `session-end.sh` / `post-tool-use-agents.sh`) —
  deferred at Planning by user decision. See
  `features/git-workflow/backlogs/git-lifecycle-telemetry-in-hooks.md`.

## Related

- Plan: `features/git-workflow/plans/2026-06-14-dual-runtime-git-skill.md`
- Design: `features/git-workflow/design/` (DD-1 … DD-7)
- Decisions: `features/git-workflow/decisions/{codex-skill-prior-art-not-engaged,probe-data-source-reliability,leader-md-git-discipline-claim-wrong}.md`
- Session journal: `notes/2026-06-14-dual-runtime-git-skill.md`
