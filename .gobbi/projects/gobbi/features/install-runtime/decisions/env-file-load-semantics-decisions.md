---
date: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: ideation
status: accepted
scope: feature
feature: install-runtime
supersedes: null
superseded_by: null
promoted_from: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/decisions/ideation-decisions.md
promoted_at: 2026-05-22
---

# Ideation Decisions Log — Env-Var Audit + SessionStart Hook

Captures all locked design decisions from the env-var audit Ideation loop. Sources: DISCUSSION (5 primary decisions P1-P5), iter1 evaluation remediations (8 locks), iter2 evaluation remediations (3 locks). Decisions are listed in source order.

## Decision Table

| Decision ID | Locked Decision | Source | Date | Status |
|---|---|---|---|---|
| **P1** | Rename all 13 occurrences of `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` across 12 skill files under `.gobbi/projects/gobbi/skills/`. Drop the old name entirely — no dual-name fallback, no export from hook. | DISCUSSION | 2026-05-22 | accepted |
| **P2** | Create `.claude/hooks/session-start.sh` in bash + jq. Register via `.claude/settings.json` `hooks.SessionStart` block with matcher `"startup|resume|clear|compact"`. Hook is purely append-to-env-file; idempotency via "last-writer-wins" on re-source. Future TS+bun port is deferred. | DISCUSSION | 2026-05-22 | accepted |
| **P3** | Hook persists 7 stdin-JSON-sourced hook-only vars (renamed: `CLAUDE_CODE_SESSION_ID` not `CLAUDE_SESSION_ID`) + new `CLAUDE_HOOK_SOURCE` + 3 passthrough env vars if present (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`). | DISCUSSION | 2026-05-22 | accepted |
| **P4** | Rewrite `gobbi/SKILL.md § Session env vars arrive automatically`: replace speculative "A SessionStart hook fires" sentence with concrete citation of `.claude/hooks/session-start.sh`; rename row 1 (`CLAUDE_SESSION_ID` → `CLAUDE_CODE_SESSION_ID`); add `CLAUDE_HOOK_SOURCE` row; reword line-66 warning to two-gate model; do NOT rename line-56 `CLAUDE_TRANSCRIPT_PATH` var name. | DISCUSSION | 2026-05-22 | accepted |
| **P5** | Insert new "Runtime-set env vars" sub-section in `gobbi/SKILL.md` listing 4 runtime-set vars (`CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE`, `CLAUDE_CODE_REMOTE`) + docs-vs-empirical discrepancy note for 3 docs-claimed-but-empirically-unset vars. Cite v2.1.132 as `CLAUDE_CODE_SESSION_ID` introduction version. | DISCUSSION | 2026-05-22 | accepted |
| **P6** | Add top-level `transcriptPath: string \| null` to `session.json` + `session.template.json` + `orchestration/SKILL.md` Step 1 row 6 + `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list (~line 371). Storage is tilde-form (manager tilde-substitutes `$HOME` before stamping; consumers tilde-expand on read). | DISCUSSION | 2026-05-22 | accepted |
| **P7** | Reword 9 `$CLAUDE_TRANSCRIPT_PATH` references across 6 skill files to cite `session.json.transcriptPath` (tilde-expand on read) as primary source; `$CLAUDE_TRANSCRIPT_PATH` env var noted as secondary fallback. | DISCUSSION | 2026-05-22 | accepted |
| **FIX 1** | Hook exports ONLY `CLAUDE_CODE_SESSION_ID` from stdin `session_id`. `CLAUDE_SESSION_ID` is NOT exported. The "in-hook consumer compatibility" hedge (dual-export) removed entirely. | iter1 eval (F-CONS-01 / Claude High/100) | 2026-05-22 | accepted |
| **FIX 2** | `gobbi/SKILL.md:56` (`CLAUDE_TRANSCRIPT_PATH` row) DO NOT RENAME constraint moved from § Open questions into P4 main constraint block. Hard constraint: the var name on line 56 is already correct and stays. | iter1 eval (F-USAGE-01 / Claude High/75) | 2026-05-22 | accepted |
| **FIX 3** | Exit criterion 7 reworded: `transcriptPath` IS stamped this session by the manager at Configuration Step 1 row 6. The "deferred" wording removed. Note: this fix required a second remediation (FIX A) in iter3 to add the manager-vs-CLI disambiguation. | iter1 eval (F-CONS-02 / Claude Medium/75) | 2026-05-22 | accepted |
| **FIX 4** | Two-gate health check redesign. Gate 1: `$CLAUDE_CODE_SESSION_ID` absent → runtime/install broken. Gate 2: `$CLAUDE_TRANSCRIPT_PATH` unset or target file missing → SessionStart hook may not have fired. Both gates emit user-visible warnings. Gate 2 catches silent hook failures that Gate 1 misses (since CCSI is runtime-auto-set independently of the hook). | iter1 eval (COD-OVERALL-001 / Codex High/100) | 2026-05-22 | accepted |
| **FIX 5** | New `CLAUDE_HOOK_SOURCE=$source` export added to hook contract. Sourced from stdin JSON `source` field (one of `startup` / `resume` / `clear` / `compact`), distinct from `CLAUDE_HOOK_EVENT_NAME` (always `"SessionStart"`). Added to hook contract table, P2/P3/P4 decisions, and env-var table in `gobbi/SKILL.md`. | iter1 eval (COD-OVERALL-002a / Codex High/100) | 2026-05-22 | accepted |
| **FIX 6** | Every `v2.1.128+` mention corrected to `v2.1.132` per official Claude Code changelog. The old version number was wrong (wrong patch version). | iter1 eval (COD-OVERALL-002b / Codex High/100) | 2026-05-22 | accepted |
| **FIX 7** | `orchestration/SKILL.md` around line 371 ("Top-level fields (in serialization order)" list under § Session metadata) added to P6's edit set and the file inventory. Adding `transcriptPath` to `session.json` requires this canonical field list to document it. | iter1 eval (COD-OVERALL-003 / Codex High/100) | 2026-05-22 | accepted |
| **FIX 8** | `transcriptPath` stamped as tilde-form path (`~/.claude/projects/{pwd-encoded}/{session-id}.jsonl`). Manager performs tilde-substitution against `$HOME` before stamping. Downstream consumers tilde-expand on read. Prevents leaking `$HOME` (username portion) into git-tracked `session.json`. | iter1 eval (COD-OVERALL-004 / Codex High/100) | 2026-05-22 | accepted |
| **FIX A** | Stamping mechanism disambiguation: added dedicated `§ Stamping mechanism disambiguation` section + updated Out-of-Scope, Pre-resolved, Deferred bullets. Two mechanisms named: (1) manager-agent stamping (IN-SCOPE — docs-driven, this session, LLM manager follows updated `orchestration/SKILL.md` Step 1 row 6); (2) CLI automation (DEFERRED — future `gobbi session init` or equivalent). Exit criterion and success criterion 8 are satisfied by mechanism (1). | iter2 eval (F-CONS-03 / COD-OVERALL-ITER2-001 / dual-system convergence / High/100) | 2026-05-22 | accepted |
| **FIX B** | Removed literal `/home/jeonhh0061/...` absolute-path example from P6's tilde-form storage paragraph. Replaced with `$HOME`-prefixed generic illustration. No literal home prefix (username) appears in P6 instruction examples. | iter2 eval (COD-OVERALL-ITER2-002 / Codex High/75) | 2026-05-22 | accepted |
| **FIX C** | Shell-safe serialization mandatory for hook: every `export VAR=value` line written to `$CLAUDE_ENV_FILE` uses `jq -r @sh` (or equivalent POSIX-shell-safe quoting). `@sh` wraps values in single quotes and escapes embedded single quotes. Robust against paths with spaces, quotes, metacharacters, empty strings, Unicode. Canonical pattern illustrated in hook contract. Success criterion 4 verifies round-trip safety. | iter2 eval (COD-OVERALL-ITER2-003 / Codex High/75) | 2026-05-22 | accepted |

## Related

- Idea artifact: `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- Iter1 evaluation findings: `sessions/.../ideation/evaluation/iter1/{claude,codex}/`
- Iter2 evaluation findings: `sessions/.../ideation/evaluation/iter2/{claude,codex}/`
- Iter3 evaluation findings: `sessions/.../ideation/evaluation/iter3/{claude,codex}/`
