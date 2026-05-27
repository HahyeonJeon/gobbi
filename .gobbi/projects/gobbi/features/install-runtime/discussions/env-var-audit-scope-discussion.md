---
name: env-var-audit-scope-discussion
description: Ideation loop discussion log capturing all AskUserQuestion exchanges for the env-var audit and SessionStart hook feature — 7 primary design decisions plus finding triage across all evaluation iterations.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [env-var-audit, session-start-hook, ideation]
loop: ideation
topic: env-var audit scope and design decisions
outcome: 7 primary design decisions (P1-P7) + mode/git/eval settings locked; 11 finding remediations accepted across evaluation triage
---

# Ideation Discussion Log — Env-Var Audit + SessionStart Hook

Captures every AskUserQuestion exchange across the Ideation loop: initial DISCUSSION (~7 design questions) plus finding-triage questions at iter1 (8 findings) and iter2 (3 findings). Ordered chronologically.

No discussion-log.md rawdata file was written in this session (the file was absent from `rawdata/`). This log is reconstructed from the Idea artifact's `§ Pre-resolved decisions`, `§ Decisions Log (P1-P7)`, `§ Iter2 Changelog`, and `§ Iter3 Changelog` sections.

---

## DISCUSSION Phase (~7 questions)

### Q1 — Session mode + evaluation policy + git mode

- **Question topic:** Confirm session mode (Chat vs API), evaluation policy (always/on-demand/off), and git workflow mode (worktree-PR, branch-PR, direct) for this session.
- **User's answer:** Chat mode; evaluation = always; git = worktree + PR base develop.
- **Decision class:** `ask: design` (session configuration)
- **Decision locked:** Mode = Chat; evaluation policy = always; git = worktree + PR base develop.

### Q2 — Env-var rename: drop `$CLAUDE_SESSION_ID` entirely vs keep as fallback alias

- **Question topic:** The 13 occurrences of `$CLAUDE_SESSION_ID` in skills are wrong (hook-only var, not runtime-set). Should the rename drop the old name entirely, or keep it as a fallback alias for backward compatibility?
- **User's answer:** Drop `$CLAUDE_SESSION_ID` entirely. No fallback, no dual-name. The name is incorrect and should not be preserved in any form.
- **Decision class:** `ask: design`
- **Decision locked:** P1 — `$CLAUDE_SESSION_ID` dropped entirely (no fallback dual-name).

### Q3 — Hook language: bash + jq vs TS + bun

- **Question topic:** The hook script could be written in bash + jq (simpler, immediate) or TypeScript + bun (consistent with the rest of the codebase). Which approach for this session?
- **User's answer:** Bash + jq for this session. TS+bun port is a future-session item.
- **Decision class:** `ask: design`
- **Decision locked:** P2 — hook is bash + jq; TS+bun port deferred to future session.

### Q4 — Plugin mirror: include or exclude

- **Question topic:** The `.claude/skills/` directory symlinks to `.gobbi/projects/gobbi/skills/`. The `plugins/gobbi/skills/` mirror is a separate copy. Should the plugin mirror receive the same rename edits?
- **User's answer:** Exclude the plugin mirror. Only the `.gobbi/projects/gobbi/skills/`-rooted skill docs and the new hook script are in scope.
- **Decision class:** `ask: scope`
- **Decision locked:** `plugins/` mirror excluded.

### Q5 — Runtime CLI code: include or exclude

- **Question topic:** `packages/cli/src/` runtime code contains no direct env-var refs per grep, but the hook script and `session.json` schema change could warrant matching CLI changes. Should `packages/cli/src/` be in scope?
- **User's answer:** Exclude `packages/cli/src/`. CLI automation of `transcriptPath` stamping is deferred to a future session; this session delivers the docs-driven contract that the manager agent follows.
- **Decision class:** `ask: scope`
- **Decision locked:** `packages/cli/src/` excluded; CLI automation deferred.

### Q6 — `session.json` field additions: `transcriptPath` only vs broader schema expansion

- **Question topic:** The hook makes `$CLAUDE_TRANSCRIPT_PATH` available at session start. Should `session.json` add only `transcriptPath`, or also add `startCwd`, `hookEventName`, and `hookSource` to capture the full hook payload?
- **User's answer:** Only `transcriptPath` is added to `session.json`. The new `CLAUDE_HOOK_SOURCE` is a `$CLAUDE_ENV_FILE` write only, NOT a `session.json` field.
- **Decision class:** `ask: design`
- **Decision locked:** P6 — only `transcriptPath: string | null` added; other hook fields are env-only.

### Q7 — P7 `$CLAUDE_TRANSCRIPT_PATH` reword scope: include or exclude `.claude/agents/*.md`

- **Question topic:** The grep for `$CLAUDE_TRANSCRIPT_PATH` refs turned up 9 lines across 6 skill files (P7 scope). The `.claude/agents/*.md` files were also checked. Should the agent docs be updated as part of P7?
- **User's answer:** No edits to `.claude/agents/*.md` — the grep confirmed no env-var refs there. Agent docs are clean.
- **Decision class:** `ask: scope`
- **Decision locked:** `.claude/agents/*.md` out of scope.

---

## Iter1 Finding Triage (~8 questions, 2026-05-22)

See `decisions/env-file-load-semantics-decisions.md` entries FIX 1-FIX 8 for the full triage dispositions.

---

## Iter2 Finding Triage (~3 questions, 2026-05-22)

See `decisions/env-file-load-semantics-decisions.md` entries FIX A-FIX C for the full triage dispositions.

---

## Iter3 Finding Triage (inline)

The third evaluation iteration returned PASS (dual-system). Two findings deferred to backlog (jq @sh env-passthrough quoting example + subagent CCSI semantics). No user AskUserQuestion required for that triage.
