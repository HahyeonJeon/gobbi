---
name: env-file-load-semantics-decisions
description: All locked design decisions from the env-var audit Ideation loop — 7 primary decisions plus 11 evaluation-remediation fixes covering SessionStart hook contract, env-var rename, transcriptPath stamping, and health-check design.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [env-var-audit, session-start-hook, transcript-path, decisions]
supersedes: null
superseded_by: null
---

# Ideation Decisions — Env-Var Audit + SessionStart Hook

## Context

The env-var-audit + SessionStart-hook feature needed a single, durable record of every locked design decision from its Ideation loop. The decisions came from two sources: the initial design discussion (the primary decisions P1–P7) and the evaluation-remediation rounds (the FIX entries accepted across the first and second evaluation rounds). This record consolidates all of them so a future reader can see what was locked and why without replaying the loop.

## Decision

The locked decisions are enumerated in the table below, in source order. The primary decisions (P1–P7) came from the design discussion; the FIX entries (FIX 1–8, FIX A–C) are the evaluation-remediation locks. The "Source" column records which round produced each.

### Decision Table

| Decision ID | Locked Decision | Source | Date | Status |
|---|---|---|---|---|
| **P1** | Rename all 13 occurrences of `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` across 12 skill files under `.gobbi/projects/gobbi/skills/`. Drop the old name entirely — no dual-name fallback, no export from hook. | DISCUSSION | 2026-05-22 | accepted |
| **P2** | Create `.claude/hooks/session-start.sh` in bash + jq. Register via `.claude/settings.json` `hooks.SessionStart` block with matcher `"startup|resume|clear|compact"`. Hook is purely append-to-env-file; idempotency via "last-writer-wins" on re-source. Future TS+bun port is deferred. | DISCUSSION | 2026-05-22 | accepted |
| **P3** | Hook persists 7 stdin-JSON-sourced hook-only vars (renamed: `CLAUDE_CODE_SESSION_ID` not `CLAUDE_SESSION_ID`) + new `CLAUDE_HOOK_SOURCE` + 3 passthrough env vars if present (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`). | DISCUSSION | 2026-05-22 | accepted |
| **P4** | Rewrite `gobbi/SKILL.md § Session env vars arrive automatically`: replace speculative "A SessionStart hook fires" sentence with concrete citation of `.claude/hooks/session-start.sh`; rename row 1 (`CLAUDE_SESSION_ID` → `CLAUDE_CODE_SESSION_ID`); add `CLAUDE_HOOK_SOURCE` row; reword line-66 warning to two-gate model; do NOT rename line-56 `CLAUDE_TRANSCRIPT_PATH` var name. | DISCUSSION | 2026-05-22 | accepted |
| **P5** | Insert new "Runtime-set env vars" sub-section in `gobbi/SKILL.md` listing 4 runtime-set vars (`CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE`, `CLAUDE_CODE_REMOTE`) + docs-vs-empirical discrepancy note for 3 docs-claimed-but-empirically-unset vars. Cite v2.1.132 as `CLAUDE_CODE_SESSION_ID` introduction version. | DISCUSSION | 2026-05-22 | accepted |
| **P6** | Add top-level `transcriptPath: string \| null` to `session.json` + `session.template.json` + `orchestration/SKILL.md` Step 1 row 6 + `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list (~line 371). Storage is tilde-form (manager tilde-substitutes `$HOME` before stamping; consumers tilde-expand on read). | DISCUSSION | 2026-05-22 | accepted |
| **P7** | Reword 9 `$CLAUDE_TRANSCRIPT_PATH` references across 6 skill files to cite `session.json.transcriptPath` (tilde-expand on read) as primary source; `$CLAUDE_TRANSCRIPT_PATH` env var noted as secondary fallback. | DISCUSSION | 2026-05-22 | accepted |
| **FIX 1** | Hook exports ONLY `CLAUDE_CODE_SESSION_ID` from stdin `session_id`. `CLAUDE_SESSION_ID` is NOT exported. The "in-hook consumer compatibility" hedge (dual-export) removed entirely. | First evaluation round — Claude High consistency finding | 2026-05-22 | accepted |
| **FIX 2** | `gobbi/SKILL.md:56` (`CLAUDE_TRANSCRIPT_PATH` row) DO NOT RENAME constraint moved from § Open questions into P4 main constraint block. Hard constraint: the var name on line 56 is already correct and stays. | First evaluation round — Claude High usage finding | 2026-05-22 | accepted |
| **FIX 3** | Exit criterion 7 reworded: `transcriptPath` IS stamped this session by the manager at Configuration Step 1 row 6. The "deferred" wording removed. Note: this fix required a second remediation (FIX A) to add the manager-vs-CLI disambiguation. | First evaluation round — Claude Medium consistency finding | 2026-05-22 | accepted |
| **FIX 4** | Two-gate health check redesign. Gate 1: `$CLAUDE_CODE_SESSION_ID` absent → runtime/install broken. Gate 2: `$CLAUDE_TRANSCRIPT_PATH` unset or target file missing → SessionStart hook may not have fired. Both gates emit user-visible warnings. Gate 2 catches silent hook failures that Gate 1 misses (since CCSI is runtime-auto-set independently of the hook). | First evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX 5** | New `CLAUDE_HOOK_SOURCE=$source` export added to hook contract. Sourced from stdin JSON `source` field (one of `startup` / `resume` / `clear` / `compact`), distinct from `CLAUDE_HOOK_EVENT_NAME` (always `"SessionStart"`). Added to hook contract table, P2/P3/P4 decisions, and env-var table in `gobbi/SKILL.md`. | First evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX 6** | Every `v2.1.128+` mention corrected to `v2.1.132` per official Claude Code changelog. The old version number was wrong (wrong patch version). | First evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX 7** | `orchestration/SKILL.md` around line 371 ("Top-level fields (in serialization order)" list under § Session metadata) added to P6's edit set and the file inventory. Adding `transcriptPath` to `session.json` requires this canonical field list to document it. | First evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX 8** | `transcriptPath` stamped as tilde-form path (`~/.claude/projects/{pwd-encoded}/{session-id}.jsonl`). Manager performs tilde-substitution against `$HOME` before stamping. Downstream consumers tilde-expand on read. Prevents leaking `$HOME` (username portion) into git-tracked `session.json`. | First evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX A** | Stamping mechanism disambiguation: added dedicated `§ Stamping mechanism disambiguation` section + updated Out-of-Scope, Pre-resolved, Deferred bullets. Two mechanisms named: (1) manager-agent stamping (IN-SCOPE — docs-driven, this session, LLM manager follows updated `orchestration/SKILL.md` Step 1 row 6); (2) CLI automation (DEFERRED — future `gobbi session init` or equivalent). Exit criterion and success criterion 8 are satisfied by mechanism (1). | Second evaluation round — dual-system convergence High finding | 2026-05-22 | accepted |
| **FIX B** | Removed literal `/home/jeonhh0061/...` absolute-path example from P6's tilde-form storage paragraph. Replaced with `$HOME`-prefixed generic illustration. No literal home prefix (username) appears in P6 instruction examples. | Second evaluation round — Codex High overall finding | 2026-05-22 | accepted |
| **FIX C** | Shell-safe serialization mandatory for hook: every `export VAR=value` line written to `$CLAUDE_ENV_FILE` uses `jq -r @sh` (or equivalent POSIX-shell-safe quoting). `@sh` wraps values in single quotes and escapes embedded single quotes. Robust against paths with spaces, quotes, metacharacters, empty strings, Unicode. Canonical pattern illustrated in hook contract. Success criterion 4 verifies round-trip safety. | Second evaluation round — Codex High overall finding | 2026-05-22 | accepted |

## Rationale

The primary decisions (P1–P7) follow from the user's answers in the design discussion: drop the incorrect `$CLAUDE_SESSION_ID` name entirely (no dual-name hedge); author the hook in bash + jq to match the existing precedent; add only `transcriptPath` to `session.json` (other hook fields stay env-only); and reword the affected skill docs to cite the new source-of-truth. The FIX entries are evaluation-driven corrections: each cites the round and perspective that surfaced it (the "Source" column), and each closes a concrete defect — a consistency hedge, an incorrect version number, a missing canonical field list, a `$HOME` leak, or a shell-safety gap.

## Alternatives considered

- Keep `$CLAUDE_SESSION_ID` as a fallback alias — rejected (P1): the name is incorrect and preserving it in any form perpetuates the defect.
- Author the hook in TypeScript + bun for codebase consistency — deferred (P2): bash + jq matches the existing `session-start.sh` precedent and ships immediately; the TS+bun port is a future-session item.
- Add `startCwd` / `hookEventName` / `hookSource` to `session.json` alongside `transcriptPath` — rejected (P6): only `transcriptPath` is added to `session.json`; the other hook fields are `$CLAUDE_ENV_FILE` writes only.
- Single-command `jq -e` health check — rejected (FIX 4 / FIX β lineage): a single command cannot distinguish present-with-null from absent, so the design uses a two-gate / two-step check instead.

## Consequences

- The rename touches 13 occurrences across 12 skill files; downstream docs (`gobbi/SKILL.md`, `orchestration/SKILL.md`) gain the new env-var rows and the `transcriptPath` field documentation.
- `session.json` and `session.template.json` gain `transcriptPath: string | null`, stored in tilde-form to avoid leaking `$HOME` into git-tracked files.
- The hook must use `jq -r @sh` shell-safe quoting for every `$CLAUDE_ENV_FILE` write (FIX C), and the health check uses the two-gate model (FIX 4).
- Stamping is performed by the manager agent this session (docs-driven); CLI automation of `transcriptPath` stamping is deferred (FIX A).

## Related

- `discussions/env-var-audit-scope-discussion.md` — the Ideation loop AskUserQuestion log that produced these decisions.
- `decisions/pre-planning-readiness-decisions.md` — the Preparation readiness decision that protected this work.
- `notes/2026-05-22-env-var-audit-sessionstart-hook.md` — the project session journal for this work.
