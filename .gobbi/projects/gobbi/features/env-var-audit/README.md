---
feature: env-var-audit
title: "Env-Var Audit + SessionStart Hook Registration"
status: shipped
first-session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
last-session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
pr: 265
commit: 159eb21
---

# Feature: Env-Var Audit + SessionStart Hook Registration

Repaired the env-var contract that gobbi's skills assumed but never delivered. Three concrete defects fixed in a single coordinated PR (#265, merged 159eb21 on 2026-05-22).

## What was shipped

1. **`$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` rename** — 13 occurrences across 12 skill files. The old name (`CLAUDE_SESSION_ID`) was a hook-only var, empty in all subagent contexts. `CLAUDE_CODE_SESSION_ID` is the correct runtime-auto-set var (Claude Code v2.1.132+). Drop was clean — no fallback dual-name.

2. **SessionStart hook installed** — `.claude/hooks/session-start.sh` (bash + jq) persists 8 hook-only vars + `CLAUDE_HOOK_SOURCE` + 3 env passthroughs to `$CLAUDE_ENV_FILE` at session start, resume, clear, and compact. Values are shell-safe-serialized via `jq -r @sh`. Registered in `.claude/settings.json`.

3. **`session.json.transcriptPath` field added** — tilde-form path stamped by the manager during Configuration Step 1 row 6. Schema updated in `session.template.json` + `orchestration/SKILL.md`. All 9 prior `$CLAUDE_TRANSCRIPT_PATH` references in 6 skill files reworded to cite `session.json.transcriptPath` as primary source.

4. **`gobbi/SKILL.md § Session env vars arrive automatically` rewritten** — two-gate health model, updated env-var table (new `CLAUDE_HOOK_SOURCE` row), new "Runtime-set env vars" sub-section.

## Session activity

| Session | Loop | Action |
|---|---|---|
| 2026-05-22-bac669ad | Ideation | 3-iter dual-system eval; 8 FIX-iter1 + 3 FIX-iter2 remediations; F-STRUCT-01 + F-RISK-01 deferred to backlog |
| 2026-05-22-bac669ad | Preparation | 2-iter dual-system eval; 4 findings resolved (α/β/γ/δ) |
| 2026-05-22-bac669ad | Planning | 3-iter dual-system eval + manager polish; 10 actions (M0+T1-T7+M2+M1) |
| 2026-05-22-bac669ad | Execution | T1-T7 all PASS; M2 squash-merged PR #265 at 159eb21; M1 manager stamp local at 00a11ae |
| 2026-05-22-bac669ad | Wrap-up | Staging promoted; handoff written; 2 mistakes + 2 backlogs written to project memory |

## Open follow-ups

- `backlogs/f-struct-01-jq-sh-env-passthrough.md` — passthrough env-var quoting illustration gap
- `backlogs/f-risk-01-subagent-ccsi-semantics.md` — subagent CCSI path-construction semantics (cross-feature)
- CLI automation of `transcriptPath` stamping deferred to a future session
- TS+bun port of `.claude/hooks/session-start.sh` deferred to a future session
