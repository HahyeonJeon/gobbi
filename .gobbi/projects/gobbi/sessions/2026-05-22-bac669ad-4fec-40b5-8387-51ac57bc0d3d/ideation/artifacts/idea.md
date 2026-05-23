---
name: env-var-audit-and-sessionstart-hook
description: Rename `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` across `.gobbi/projects/gobbi/skills/**`, register a real `.claude/hooks/session-start.sh` to persist the 7 stdin-JSON hook-only vars + the 3 runtime-passthrough vars to `$CLAUDE_ENV_FILE`, add `transcriptPath` to `session.json` + its template, and rewrite the `gobbi/SKILL.md § Session env vars arrive automatically` paragraph + table + warning + runtime-set sub-table.
phase: ideation
iter: 3
verdict: pending
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: ideation
artifact_type: idea
created_at: 2026-05-22
iter2_revised_at: 2026-05-22
iter3_revised_at: 2026-05-22
status: draft
feature: env-var-audit
related:
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/rawdata/draft-iter1.md
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/claude/
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter2/claude/
  - sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter2/codex/
---

## Iter3 Changelog

Surgical remediation of the 3 user-accepted findings from iter2 dual-system evaluation. Underlying design unchanged; disambiguation + privacy + shell-safety only. Each entry cites the originating finding ID.

- **FIX A (F-CONS-03 / COD-OVERALL-ITER2-001, dual-system convergence, High/100, docs-sync)** — Disambiguated the "stamping THIS session" vs "CLI deferred" tension. Added a clarifying sentence to P6's body (and reinforced exit criterion 7) explicitly distinguishing the **manager agent** stamping mechanism (in-scope, applies to this session's `session.json` via the updated skill docs) from the **CLI automation** mechanism (a future `gobbi session init` or equivalent auto-stamper — deferred). Reworded the Out-of-Scope, Pre-resolved decisions, and Deferred section bullets that previously read as "manager-side stamping is deferred" to specify "CLI automation of the stamping is deferred; manager-side stamping is in-scope this session via the updated docs".
- **FIX B (COD-OVERALL-ITER2-002, Codex High/75, privacy)** — Converted the literal `/home/jeonhh0061/...` absolute-path example in P6's tilde-form storage paragraph to a `$HOME`-prefixed generic illustration so the example no longer contradicts the rule it preaches. No literal home prefixes remain in P6 instruction examples.
- **FIX C (COD-OVERALL-ITER2-003, Codex High/75, security)** — Specified shell-safe serialization in the hook contract: the hook MUST use `jq -r @sh` (or equivalent POSIX-shell-safe quoting) when writing `export VAR=value` lines to `$CLAUDE_ENV_FILE`, so sourcing the file is robust against values with spaces, single quotes, shell metacharacters, empty strings, and Unicode. Added a new success criterion that verifies this serialization.

---

## Iter2 Changelog

Surgical remediation of the 8 user-accepted findings from iter1 dual-system evaluation (Claude + Codex). Underlying design unchanged; one design refinement (hook-health gate) + one schema extension (`CLAUDE_HOOK_SOURCE` export) + corrections. Each entry cites the originating finding ID.

- **FIX 1 (F-CONS-01, Claude High/100, docs-sync)** — The hook now uniformly exports ONLY `CLAUDE_CODE_SESSION_ID` from stdin `session_id`. `CLAUDE_SESSION_ID` is NOT exported. Hook-contract table row collapsed; P2 Decisions-Log text corrected; the "in-hook consumer compatibility" hedge deleted.
- **FIX 2 (F-USAGE-01, Claude High/75, docs-sync)** — Constraint that `gobbi/SKILL.md:56` (`CLAUDE_TRANSCRIPT_PATH` row, line 56) must NOT be renamed — moved from § Open questions into the P4 constraint block so Planning + Execution cannot miss it.
- **FIX 3 (F-CONS-02, Claude Medium/75, docs-sync)** — Exit criterion 7 reworded: `transcriptPath` IS stamped this session (by the manager at Configuration Step 1 row 6), not "deferred". The "deferred" wording removed.
- **FIX 4 (COD-OVERALL-001, Codex High/100, observability)** — Health-gate redesign. CCSI is runtime-auto-set independently of the hook, so its absence does NOT prove hook failure. Manager's Configuration Step 1 now adds a SECOND gate: verify `$CLAUDE_TRANSCRIPT_PATH` is set AND the file at that path exists; absence triggers a clear "SessionStart hook may not have fired — investigate `.claude/hooks/session-start.sh`" warning. CCSI absence check remains as the runtime-broken signal.
- **FIX 5 (COD-OVERALL-002a, Codex High/100, process)** — New `CLAUDE_HOOK_SOURCE=$source` export added to the hook contract (from stdin JSON `source` field — one of `startup` / `resume` / `clear` / `compact`, distinct from `hook_event_name` which is always `"SessionStart"`). Table row added to `gobbi/SKILL.md` env-var table alongside `CLAUDE_HOOK_EVENT_NAME`.
- **FIX 6 (COD-OVERALL-002b, Codex High/100, process)** — Every `v2.1.128+` mention corrected to `v2.1.132` per official changelog.
- **FIX 7 (COD-OVERALL-003, Codex High/100, docs-sync)** — `orchestration/SKILL.md` line 371 area (the "Top-level fields (in serialization order)" list under § Session metadata) added to P6's edit set + the file inventory. Adding `transcriptPath` to `session.json` requires this list to document it.
- **FIX 8 (COD-OVERALL-004, Codex High/100, privacy)** — `transcriptPath` is stamped as a **tilde-form path** (`~/.claude/projects/{pwd-encoded}/{session-id}.jsonl`) — manager performs tilde-substitution against `$HOME` before stamping; downstream consumers tilde-expand on read. Prevents leaking `$HOME` into git-tracked `session.json`.

---

# Idea — Fix Agents and Skills: Env-Var Audit + SessionStart Hook Registration (iter3)

## What

### Session focus

Repair the env-var contract that gobbi's skills (and the `session.json` schema that depends on it) assumed but never actually delivered. The `/gobbi` bootstrap exposed three concrete defects in this session:

1. `$CLAUDE_SESSION_ID` is **not** a runtime-set Claude Code variable — it is a hook-only var. The runtime-set name is `$CLAUDE_CODE_SESSION_ID` (added in Claude Code v2.1.132 per official changelog). Twelve skills under `.gobbi/projects/gobbi/skills/` reference the wrong name, so every "path conventions" snippet they emit is empirically broken outside a hook handler.
2. `.claude/settings.json` carries **no `hooks` block**. The SessionStart hook that the `gobbi/SKILL.md § Session env vars arrive automatically` paragraph claims fires — does not exist. The 7 stdin-JSON-sourced vars (`CLAUDE_SESSION_ID`, `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_CWD`, `CLAUDE_HOOK_EVENT_NAME`, `CLAUDE_AGENT_ID`, `CLAUDE_AGENT_TYPE`, `CLAUDE_PERMISSION_MODE`) are never persisted; their downstream consumers in skills are reading from a void.
3. `session.json` has no field that carries the transcript path forward across the lifecycle. Skills that say "read from `$CLAUDE_TRANSCRIPT_PATH`" assume that var is in env — it is not, unless a hook puts it there. Even if a hook puts it there, only the hook-firing session has it; subagents in the same workflow do not.

The session resolves all three defects in a single coordinated change to the `.claude/`-mirrored skills surface plus the SessionStart hook script. The runtime CLI under `packages/cli/src/` is out of scope; the `plugins/` mirror is out of scope; only the `.gobbi/projects/gobbi/skills/`-rooted skill docs (which `.claude/skills/` symlinks to) and the new `.claude/hooks/session-start.sh` + `.claude/settings.json` block are touched.

### File inventory (verified by grep on 2026-05-22)

**P1 — `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` rename (13 occurrences across 12 files; drop name entirely — no dual-name fallback):**

| # | File | Line | Pattern |
|---|---|---|---|
| 1 | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | 55 | bootstrap table row `\| CLAUDE_SESSION_ID \| stdin JSON session_id \|` |
| 2 | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | 66 | warning paragraph `If $CLAUDE_SESSION_ID is absent ... workflow cannot proceed` |
| 3 | `.gobbi/projects/gobbi/skills/mistake/SKILL.md` | 129 | path conventions sentence |
| 4 | `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | 325 | path conventions sentence |
| 5 | `.gobbi/projects/gobbi/skills/research/SKILL.md` | 145 | path conventions sentence |
| 6 | `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` | 292 | path conventions sentence |
| 7 | `.gobbi/projects/gobbi/skills/planning/SKILL.md` | 462 | path conventions sentence |
| 8 | `.gobbi/projects/gobbi/skills/execution/SKILL.md` | 255 | path conventions sentence |
| 9 | `.gobbi/projects/gobbi/skills/ideation/SKILL.md` | 465 | path conventions sentence |
| 10 | `.gobbi/projects/gobbi/skills/memorization/SKILL.md` | 227 | path conventions sentence |
| 11 | `.gobbi/projects/gobbi/skills/interview/SKILL.md` | 324 | path conventions sentence |
| 12 | `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | 563 | path conventions sentence |
| 13 | `.gobbi/projects/gobbi/skills/preparation/SKILL.md` | 375 | path conventions sentence |

**P7 — `$CLAUDE_TRANSCRIPT_PATH` references in 6 skill files (9 line numbers; reword to cite the manager-stamped `session.json.transcriptPath` field as the primary source, with `$CLAUDE_TRANSCRIPT_PATH` as the env-direct fallback):**

| File | Lines |
|---|---|
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | 280 |
| `.gobbi/projects/gobbi/skills/planning/SKILL.md` | 417 |
| `.gobbi/projects/gobbi/skills/execution/SKILL.md` | 208 |
| `.gobbi/projects/gobbi/skills/ideation/SKILL.md` | 407, 415 |
| `.gobbi/projects/gobbi/skills/memorization/SKILL.md` | 20, 146, 155 |
| `.gobbi/projects/gobbi/skills/preparation/SKILL.md` | 330 |

**P4 — `gobbi/SKILL.md § Session env vars arrive automatically` rewrites (same file as P1 rows 1+2; treat as one editing pass):**
- Line 51 paragraph: replace "A SessionStart hook fires..." with concrete prose citing `.claude/hooks/session-start.sh` and the `.claude/settings.json` `hooks.SessionStart` registration block.
- Line 55 table row: `CLAUDE_SESSION_ID` → `CLAUDE_CODE_SESSION_ID`.
- **Line 56 table row — DO NOT RENAME.** `CLAUDE_TRANSCRIPT_PATH` is the correct var name (it really is the hook-only env var of that name); the row sits adjacent to the line-55 row that IS renamed but the var name on line 56 stays as-is. Planning and Execution must touch line 56 only to update surrounding context if needed (e.g., the description column may mention the new `session.json.transcriptPath` mirror), but the var-name text on that row is untouched. **This is a hard constraint, not an open question.**
- Line 66 warning: trigger condition now follows the two-gate model (see Health Gate below).
- **Insert new row for `CLAUDE_HOOK_SOURCE`** (FIX 5) in the env-var table — sourced from stdin JSON `source` field, distinct from `CLAUDE_HOOK_EVENT_NAME` which is always `"SessionStart"`. Downstream skills do not currently consume it; documenting now keeps the artifact aligned with official Claude Code hook docs.
- **Insert new "Runtime-set env vars" sub-section** (P5) below the existing table, listing the 4 runtime-set vars: `CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE`, `CLAUDE_CODE_REMOTE`. Note the docs-vs-empirical discrepancy for `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` — docs claim runtime-set, empirical check on this session shows them unset in Bash subshells; the hook re-exports them if present.

**P2 — NEW `.claude/hooks/session-start.sh`** — bash + jq script that reads stdin JSON and appends `export VAR=value` lines to `$CLAUDE_ENV_FILE` for the 7 stdin-JSON-sourced vars + the renamed `CLAUDE_CODE_SESSION_ID` (mirror of `session_id`, redundant + harmless if runtime already set it) + the new `CLAUDE_HOOK_SOURCE` (from stdin `source`) + re-exports the 3 passthrough envs if present. **Values are shell-safe-serialized via `jq -r @sh` (FIX C) so sourcing `$CLAUDE_ENV_FILE` is robust against spaces, quotes, metacharacters, empty strings, and Unicode in any field value.**

**P2 — `.claude/settings.json` `hooks.SessionStart` block** registering the new script for the four trigger events (startup, resume, clear, compact).

**P6 — `transcriptPath: string | null` field** added to:
- `session.json` schema (top-level)
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` Step 1 row 6 procedure text (the "Initialize session.json" step in the Configuration phase)
- **`.gobbi/projects/gobbi/skills/orchestration/SKILL.md` around line 371** — the "Top-level fields (in serialization order)" list under § Session metadata. Adding `transcriptPath` requires this list to document the new field; otherwise the canonical session.json field set drifts from the schema. (FIX 7)

### In-scope vs out-of-scope

**In scope:**
- `.gobbi/projects/gobbi/skills/**/*.md` — all 12 skill files in the P1 inventory + `gobbi/SKILL.md` rewrites + the 6 P7 files + `orchestration/SKILL.md` Step 1 procedure text edit + `orchestration/SKILL.md` line 371 area top-level-fields list edit
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` — add `transcriptPath` field
- `.claude/hooks/session-start.sh` — NEW file (bash + jq, shell-safe serialization via `jq -r @sh` per FIX C)
- `.claude/settings.json` — add `hooks.SessionStart` block
- **Manager-agent stamping of this session's own `session.json.transcriptPath`** — performed by the manager following the updated `orchestration/SKILL.md` Step 1 row 6 procedure during the Configuration phase of this very session. This is a docs-driven behavior, not a CLI-driven one; see § Stamping mechanism disambiguation below.

**Out of scope:**
- `.claude/agents/*.md` (no env-var refs — clean per grep)
- `plugins/` mirror (excluded per user setup answer)
- `packages/cli/src/` runtime code (excluded per user setup answer; **CLI automation of `transcriptPath` stamping — e.g., a `gobbi session init` command that auto-stamps the field on session start without manager involvement — is deferred to a future session. Manager-side stamping driven by the updated `orchestration/SKILL.md` Step 1 row 6 procedure IS in-scope this session.**)
- TS+bun port of the hook (deferred to a future session per user answer)
- New skills, agents, runtime features beyond the env-var audit
- `.claude/skills/` directory itself — it is a symlink mirror of `.gobbi/projects/gobbi/skills/`; editing the source updates the mirror

### Exit criteria

The session is complete when all of the following hold:

1. `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty (zero hits — name fully removed, no dual-name fallback).
2. `.claude/hooks/session-start.sh` exists, is executable, and fires on next session start (verified by the next session's bootstrap finding `$CLAUDE_TRANSCRIPT_PATH` populated in env). **The hook serializes values via `jq -r @sh`** (FIX C) so sourcing `$CLAUDE_ENV_FILE` is robust against spaces, quotes, shell metacharacters, empty strings, and Unicode in any field value.
3. `.claude/settings.json` parses as JSON and has a `hooks.SessionStart` array entry pointing at `.claude/hooks/session-start.sh` with the four trigger events covered.
4. `session.template.json` carries `transcriptPath: null` at top level; the canonical example in `orchestration/SKILL.md` Step 1 row 6 mentions the stamping; the `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list (around line 371) lists `transcriptPath` in serialization order.
5. Each of the 6 P7 skill files cites the manager-stamped `session.json.transcriptPath` as the primary source (with `$CLAUDE_TRANSCRIPT_PATH` env as a secondary fallback) for transcript reads.
6. `gobbi/SKILL.md § Session env vars arrive automatically` paragraph, table (with the new `CLAUDE_HOOK_SOURCE` row), warning (two-gate model), and new "Runtime-set env vars" sub-section all reflect P3-P5 wording.
7. **This session's own `session.json` (and any new `session.json` files created after the merged PR is in effect) carries a populated `transcriptPath` field stamped by the manager agent during Configuration Step 1 row 6, by reading `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the new SessionStart hook). The stamp is performed by the manager agent following the updated `orchestration/SKILL.md` Step 1 row 6 procedure — NOT by automated CLI tooling (CLI automation is deferred per § In-scope vs out-of-scope). The criterion is satisfied when this session's own `session.json` has a non-null `transcriptPath` value populated by the manager's stamp. The field is stored as a tilde-form path (e.g., `~/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl`) — the manager performs tilde-substitution against `$HOME` before stamping; downstream consumers tilde-expand on read.** (FIX 3 + FIX 8 + FIX A)
8. Worktree PR opens against `develop` and squash-merges cleanly.

---

## Why

### Witness-bound trigger (Principle 10)

The trigger for this session is empirical, not speculative. During the `/gobbi` bootstrap of session `2026-05-22-bac669ad-...`:

- `$CLAUDE_SESSION_ID` was checked via `echo "${CLAUDE_SESSION_ID-UNSET}"` — returned `UNSET`.
- `$CLAUDE_CODE_SESSION_ID` was checked the same way — returned `bac669ad-4fec-40b5-8387-51ac57bc0d3d`, matching the on-disk session directory.
- `cat .claude/settings.json | jq '.hooks // "NO_HOOKS_BLOCK"'` returned `"NO_HOOKS_BLOCK"`.
- `find ~/.claude/projects -name '*.jsonl' -newer …` empirically located the transcript at `~/.claude/projects/{pwd-encoded}/{session-id}.jsonl` — confirming the path shape that `$CLAUDE_TRANSCRIPT_PATH` is supposed to surface.

The 12 skill files documenting `$CLAUDE_SESSION_ID` as the runtime var are therefore wrong; the `gobbi/SKILL.md` paragraph claiming a SessionStart hook exists is therefore unbacked by any registration. Both findings are **witnesses**, not speculation.

A prior assistant subagent dispatched to the `claude-code-guide` cross-checked these findings against Claude Code's docs and the changelog:
- `CLAUDE_CODE_SESSION_ID` is the runtime-auto-set var as of Claude Code v2.1.132 (per official changelog).
- Hook-only vars (only available inside hook handlers, populated from stdin JSON): `CLAUDE_SESSION_ID`, `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_CWD`, `CLAUDE_HOOK_EVENT_NAME`, `CLAUDE_AGENT_ID`, `CLAUDE_AGENT_TYPE`, `CLAUDE_PERMISSION_MODE` (the last three optional). Additionally, the stdin JSON carries a separate `source` field (one of `startup` / `resume` / `clear` / `compact`) which our hook now exports as `CLAUDE_HOOK_SOURCE` (FIX 5).
- Runtime-set in Bash subprocesses: `CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE=1`, `CLAUDE_CODE_REMOTE` (web only).
- Docs claim `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` are runtime-set, but empirical check on this session shows them unset in Bash subshells — flag the discrepancy in the new "Runtime-set env vars" sub-section.

### Motivation

Without the rename + hook + schema field:

- **Skills lie about reality.** Every skill that says "from `$CLAUDE_SESSION_ID`" is unactionable; the var is empty in 100% of subagent contexts. Following the skill literally produces a broken path.
- **Memorization cannot read the transcript.** `memorization/SKILL.md` line 155 says "if `$CLAUDE_TRANSCRIPT_PATH` is absent, record a Critical finding and continue" — this fires every iteration because the env var is empty. Either every memorization iteration silently logs a Critical finding, or the skill text drifts to ignore it. Both are bad.
- **The bootstrap warning is misdirection.** `gobbi/SKILL.md` line 66 tells the user "verify the SessionStart hook registration" — but the hook does not exist in the repo. The user has no remediation path because the thing they are asked to verify is absent.

After the change:

- Path conventions in all skills resolve correctly because `$CLAUDE_CODE_SESSION_ID` is genuinely runtime-set.
- The 7 hook-only vars (+ `CLAUDE_HOOK_SOURCE` from stdin `source`) are persisted to `$CLAUDE_ENV_FILE` by an installed `.claude/hooks/session-start.sh` script — subagents and follow-up shell commands actually see them. Values are shell-safe-quoted by `jq -r @sh` so sourcing the env file is robust against spaces, quotes, and metacharacters (FIX C).
- `transcriptPath` lives in `session.json` (as a tilde-form path, no `$HOME` leakage), so any subagent in the workflow can read it without depending on env-var inheritance.
- The two-gate health check (FIX 4) catches both runtime-broken installs (CCSI absent) AND silent hook failures (CCSI present but `$CLAUDE_TRANSCRIPT_PATH` / its target file absent).

### Principle anchors

- **Principle 10 (witness-bound work)** — every change in scope has a concrete witness: a grep line, an empirical bootstrap finding, a confirmed docs citation. No "for consistency," no "while we're here," no speculation.
- **Principle 8 (docs are a deliverable)** — the implementation and the docs ship together. The hook script and the rewrite of skills that reference it land in the same PR; skills that document the new contract are part of the deliverable, not a follow-up.
- **Principle 12 (every task has What / Why / How)** — this artifact provides the W/W/H for the Preparation Loop's readiness check and the Planning Loop's decomposition. Sub-tasks (the 13 P1 rename edits, the 9 P7 reword edits, the new hook script, the schema edit) all inherit a concrete witness from this Idea.
- **Principle 4 (scope is a contract)** — the four out-of-scope clauses (no `.claude/agents/` edits, no plugins mirror, no runtime CLI code, no TS+bun port) are binding. Adjacent improvements get backlog entries, not in-PR drift.

---

## How

### Execution shape

- **Preparation Loop** confirms readiness: every file in the inventory exists at the cited line, the line numbers still match (re-grep at Preparation entry to defend against drift between this Ideation session and Planning), no project-skill stamping needed (this is a skill-doc + hook edit, no new skill or agent introduced), no contradiction with any project rule (only `stub-redirect-format.md` exists, irrelevant to this scope).
- **Planning Loop** decomposes into narrow tasks. Candidate decomposition (Planning will finalize):
  1. Task A — write `.claude/hooks/session-start.sh` (bash + jq, shell-safe `jq -r @sh` serialization per FIX C) per the contract in § Hook contract below.
  2. Task B — register the hook in `.claude/settings.json` `hooks.SessionStart` block.
  3. Task C — rename row 1 + rewrite line-51 paragraph + line-66 warning (two-gate model) + add new `CLAUDE_HOOK_SOURCE` table row + insert "Runtime-set env vars" sub-section in `gobbi/SKILL.md` (P4 + P5; one focused edit pass). **Line 56 is touched only for surrounding context — its var name `CLAUDE_TRANSCRIPT_PATH` stays.**
  4. Task D — rename the 11 remaining `$CLAUDE_SESSION_ID` occurrences across the other 11 skill files (P1 rows 3-13; one bulk edit pass with per-file verification).
  5. Task E — add `transcriptPath: string | null` to `session.template.json`; update `orchestration/SKILL.md` Step 1 row 6 procedure text (P6) including the tilde-form stamping and the disambiguation that this is a manager-agent procedure (in-scope), not a CLI automation (deferred); add `transcriptPath` to the `orchestration/SKILL.md` line-371-area "Top-level fields (in serialization order)" list (FIX 7).
  6. Task F — reword the 9 `$CLAUDE_TRANSCRIPT_PATH` references across 6 skill files to cite `session.json.transcriptPath` as the primary source, noting consumers must tilde-expand the field when reading (P7).
  7. Task G — verification pass: `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty; `.claude/settings.json` parses; `.claude/hooks/session-start.sh` is executable; `session.template.json` has the new field; `orchestration/SKILL.md` § Session metadata top-level-fields list contains `transcriptPath`; this session's own `session.json` (after the manager's stamp during Configuration Step 1 row 6) carries a populated tilde-form `transcriptPath` value.
- **Execution Loop** applies each task as a focused commit on a single worktree branch off `develop`. Worktree + PR per session's `git.workflow=worktree-pr` setting.
- **Evaluation** runs at end of each loop per the always-on policy.

### Hook contract (P2 + P3)

**Location:** `.claude/hooks/session-start.sh`
**Shebang + interpreter:** `#!/usr/bin/env bash`
**Dependencies:** `jq` (already a system dependency in the broader project; verify in Preparation).
**Trigger events covered (registered in `.claude/settings.json`):** `startup`, `resume`, `clear`, `compact` (matcher: `"startup|resume|clear|compact"` per the rule established for PR #229 — covers all SessionStart events).

**Stdin contract:** Claude Code pipes a JSON object to the hook stdin with the following fields (per Claude Code hook docs at https://code.claude.com/docs/en/hooks). Note that `hook_event_name` (always `"SessionStart"` for this hook) and `source` (one of `startup` / `resume` / `clear` / `compact`) are **separate** fields:

```json
{
  "session_id": "<uuid>",
  "transcript_path": "<absolute path>",
  "cwd": "<absolute path>",
  "hook_event_name": "SessionStart",
  "source": "<startup|resume|clear|compact>",
  "agent_id": "<optional>",
  "agent_type": "<optional>",
  "permission_mode": "<optional>"
}
```

**Behavior:** for each stdin field present, append a single `export VAR=value` line to `$CLAUDE_ENV_FILE`:

| Stdin field | Exported var name |
|---|---|
| `session_id` | `CLAUDE_CODE_SESSION_ID` (the hook does NOT export `CLAUDE_SESSION_ID`; the runtime should already set `CLAUDE_CODE_SESSION_ID` — the hook fills it in if absent) |
| `transcript_path` | `CLAUDE_TRANSCRIPT_PATH` |
| `cwd` | `CLAUDE_CWD` |
| `hook_event_name` | `CLAUDE_HOOK_EVENT_NAME` (always `"SessionStart"`) |
| `source` | `CLAUDE_HOOK_SOURCE` (one of `startup` / `resume` / `clear` / `compact`) |
| `agent_id` (optional) | `CLAUDE_AGENT_ID` |
| `agent_type` (optional) | `CLAUDE_AGENT_TYPE` |
| `permission_mode` (optional) | `CLAUDE_PERMISSION_MODE` |

Then re-export the 3 runtime passthroughs **if already in env** (skip silently if unset; preserves the docs-vs-empirical-discrepancy noted above):

- `CLAUDE_PROJECT_DIR`
- `CLAUDE_PLUGIN_ROOT`
- `CLAUDE_PLUGIN_DATA`

**Shell-safe serialization (FIX C, mandatory).** Values are quoted via `jq`'s `@sh` filter when emitting each `export` line, so sourcing `$CLAUDE_ENV_FILE` is robust against paths with spaces (common on macOS — e.g., `Library Caches`), single quotes, shell metacharacters (`$`, backticks, `;`, `&`, etc.), empty strings, and Unicode. The canonical pattern (illustration only — do not treat as the full hook script; the script implements one such line per exported field):

```bash
# Use jq's @sh filter to produce POSIX-shell-safe quoted exports.
# @sh wraps the value in single quotes and escapes any embedded single quotes,
# so the resulting line is safe to source from any POSIX shell.
jq -r '@sh "export CLAUDE_TRANSCRIPT_PATH=\(.transcript_path)"' <<<"$payload" >> "$CLAUDE_ENV_FILE"
```

`@sh` produces output like `export CLAUDE_TRANSCRIPT_PATH='~/.claude/projects/foo bar/baz.jsonl'` even when the underlying value contains spaces or special characters. Empty values become `''` (a valid empty-string assignment). The same `@sh` pattern applies to every exported field above; equivalent POSIX-shell-safe quoting (e.g., a hand-rolled single-quote escaper) is acceptable as long as round-trip safety holds.

**Idempotency:** SessionStart fires on startup, resume, clear, and compact. The hook is purely append-to-env-file; Claude Code re-sources `$CLAUDE_ENV_FILE` after each fire, so duplicate `export` lines overwrite cleanly (last writer wins). No dedup logic, no truncate, no special idempotency code. This is the simplest correct behavior.

**Failure mode:** if `$CLAUDE_ENV_FILE` is unset or unwritable, the hook prints to stderr and exits non-zero. Claude Code's hook runner logs the failure; the next-session bootstrap will then surface the missing env-var defect via the two-gate health check (see Health Gate below).

**Future migration note:** a TypeScript + bun port of the hook is planned for a future session (deferred per user answer). The bash + jq implementation is the shippable artifact for this session.

### Health Gate (P4 line-66 warning — two-gate model, FIX 4)

The manager's Configuration Step 1 procedure (where session bootstrap reads env and stamps `session.json`) runs **two** independent health checks against the env-var contract. They protect against distinct failure modes:

**Gate 1 — Runtime check (CCSI presence).**
- Procedure: verify `$CLAUDE_CODE_SESSION_ID` is non-empty.
- If absent: surface a warning along the lines of: *"`$CLAUDE_CODE_SESSION_ID` is unset — the Claude Code runtime should set this automatically as of v2.1.132. The install may be broken or the runtime is older than v2.1.132. Investigate before continuing the workflow."*
- Why this gate alone is insufficient: CCSI is runtime-auto-set **independently of the hook**. Claude Code populates it whether the hook fires or not. So if the hook silently fails (e.g., `jq` missing, `$CLAUDE_ENV_FILE` unwritable, settings.json registration mistake), CCSI is still present → Gate 1 stays silent → no warning → the session proceeds with `$CLAUDE_TRANSCRIPT_PATH` unset → Memorization later fails with a confusing error far from the actual cause.

**Gate 2 — Hook check (transcript path + file presence).**
- Procedure: verify `$CLAUDE_TRANSCRIPT_PATH` is non-empty AND the file at that path exists on disk (`test -f "$CLAUDE_TRANSCRIPT_PATH"`).
- If either condition fails: surface a warning along the lines of: *"`$CLAUDE_TRANSCRIPT_PATH` is unset or its target file is missing — the SessionStart hook may not have fired. Investigate `.claude/hooks/session-start.sh` (check executable bit, `jq` availability, and `.claude/settings.json` `hooks.SessionStart` registration)."*
- This gate catches the silent-hook-failure mode that Gate 1 misses, and it points the user at the specific remediation surface.

Both warnings surface to the user (they are not silent log lines); the manager continues the workflow only after the user acknowledges or remediates. The `gobbi/SKILL.md` line-66 warning paragraph documents the two-gate model so the bootstrap behavior is discoverable from the skill docs.

### Stamping mechanism disambiguation (FIX A)

There are **two distinct mechanisms** that could populate `session.json.transcriptPath`. They are not the same thing; this artifact has historically blurred them, and iter2 evaluation flagged the resulting ambiguity. This sub-section locks the distinction:

- **Manager-agent stamping (IN-SCOPE this session).** The manager agent running this Ideation/Planning/Execution workflow reads the updated `orchestration/SKILL.md` Step 1 row 6 procedure during the Configuration phase, reads `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the new SessionStart hook), performs tilde-substitution against `$HOME`, and writes the result into this session's own `session.json.transcriptPath`. This is a docs-driven behavior: the skill docs are the source of truth, and the manager (an LLM agent) follows them. **This mechanism is in-scope and applies to THIS session's `session.json`.** Exit criterion 7 and success criterion 8 below are satisfied by this manager-agent stamp.
- **CLI automation (DEFERRED to a future session).** A separate, future change would teach `packages/cli/src/` runtime code — for example, a `gobbi session init` (or equivalent) command — to auto-stamp `transcriptPath` into `session.json` programmatically on session start, with no manager involvement. **This mechanism is out-of-scope this session.** The runtime CLI under `packages/cli/src/` is not edited.

The two are different mechanisms with different scopes. "Manager-side stamping is in-scope this session via the updated docs" and "CLI automation of the stamping is deferred" are both true and not contradictory. The references to "future session" / "docs-only contract this session" in § Out-of-Scope, § Pre-resolved decisions, and § Deferred refer specifically to the CLI-automation mechanism, not to the manager-agent stamping.

### Decisions Log (P1 — P7, locked verbatim from DISCUSSION; iter2 + iter3 remediations applied)

#### P1 — Env-var rename (locked)

- All references to `$CLAUDE_SESSION_ID` in `.gobbi/projects/gobbi/skills/**` (13 occurrences across 12 files) are renamed to `$CLAUDE_CODE_SESSION_ID`.
- `$CLAUDE_SESSION_ID` is **dropped entirely** from skill docs (no fallback dual-name).
- File inventory (verified by grep on 2026-05-22) — see the table in § File inventory above.

#### P2 — SessionStart hook (locked; iter2 FIX 1 + FIX 5 + iter3 FIX C applied)

- Location: `.claude/hooks/session-start.sh`.
- Language: bash + jq.
- Behavior: read stdin JSON; append `export VAR=value` lines to `$CLAUDE_ENV_FILE`. **The hook exports `CLAUDE_CODE_SESSION_ID` from stdin `session_id`; `CLAUDE_SESSION_ID` is NOT exported.** (FIX 1) The hook also exports the new `CLAUDE_HOOK_SOURCE` from stdin `source` (distinct from `CLAUDE_HOOK_EVENT_NAME`, which is sourced from `hook_event_name` and is always `"SessionStart"`). (FIX 5) Re-export the 3 passthrough envs (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) if they are already in env.
- **Shell-safe serialization (FIX C).** Every `export VAR=value` line is emitted via `jq -r @sh` (or equivalent POSIX-shell-safe quoting). `@sh` wraps each value in single quotes and escapes embedded single quotes, so sourcing `$CLAUDE_ENV_FILE` is robust against paths with spaces, single quotes, shell metacharacters, empty strings, and Unicode. See § Hook contract for the canonical pattern.
- Idempotency: SessionStart fires on startup, resume, clear, compact. The hook is purely append-to-env-file; Claude Code re-sources the file each fire, so duplicate exports overwrite cleanly — no special idempotency logic needed.
- Register via `.claude/settings.json` `hooks.SessionStart` block.
- Future migration: a TS+bun port is planned for a future session (not this one).

#### P3 — All hook-only vars + new `CLAUDE_HOOK_SOURCE` persisted via hook (locked)

- The hook persists the 7 documented hook-only vars (using `CLAUDE_CODE_SESSION_ID` rather than `CLAUDE_SESSION_ID`) + the new `CLAUDE_HOOK_SOURCE` to `$CLAUDE_ENV_FILE` using `jq -r @sh` for shell-safe quoting (FIX C). The 3 passthrough vars are re-exported if already in env. `gobbi/SKILL.md`'s table stays — the rename in P1 applies to row 1, the new `CLAUDE_HOOK_SOURCE` row is added per FIX 5, and the table loses its "non-existent var" risk because the hook now actually populates them.

#### P4 — `gobbi/SKILL.md § Session env vars arrive automatically` rewrite (locked; iter2 FIX 2 + FIX 4 + FIX 5 applied)

- Replace the speculative "A SessionStart hook fires" sentence with a concrete one citing the actual script path (`.claude/hooks/session-start.sh`) + the actual settings-block registration.
- Rename row 1 of the env-var table from `CLAUDE_SESSION_ID` to `CLAUDE_CODE_SESSION_ID`.
- **Line 56 (`CLAUDE_TRANSCRIPT_PATH` row) is NOT renamed.** The var name on line 56 is already correct. Planning + Execution must touch line 56 only to update surrounding context (e.g., the description column may reference the new `session.json.transcriptPath` mirror); the var-name text stays as-is. **(FIX 2 — moved out of § Open questions into this main constraint block.)**
- **Add a new row for `CLAUDE_HOOK_SOURCE`** sourced from stdin JSON `source` (distinct from `CLAUDE_HOOK_EVENT_NAME` which is always `"SessionStart"`). Downstream skills do not currently consume it; documenting it now keeps the artifact aligned with official Claude Code hook docs. **(FIX 5)**
- Reword the "workflow cannot proceed" warning to document the **two-gate model** described in § Health Gate above: Gate 1 (CCSI absent → runtime/install broken) AND Gate 2 (`$CLAUDE_TRANSCRIPT_PATH` unset or its target file missing → SessionStart hook may not have fired). Both gates surface user-visible warnings. **(FIX 4)**

#### P5 — Runtime-set env vars sub-table (locked; iter2 FIX 6 applied)

- Add a new "Runtime-set env vars" sub-section to `gobbi/SKILL.md § Session env vars arrive automatically`, listing:
  - `CLAUDE_CODE_SESSION_ID` (auto-set in Claude Code v2.1.132 per official changelog; the session UUID)
  - `CLAUDE_EFFORT` (current effort level: low / medium / high / xhigh / max)
  - `CLAUDECODE` (=1 inside Claude Code Bash subprocess; useful for "am I running inside Claude" detection)
  - `CLAUDE_CODE_REMOTE` (`"true"` in web/remote; unset locally)
- Note the docs-vs-empirical discrepancy: docs list `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` as runtime-set, but empirical check on session `bac669ad` shows them unset in Bash subshells. The hook re-exports them if present in env (P2) — but skills should not rely on their presence.

#### P6 — `session.json` schema extension (locked; iter2 FIX 3 + FIX 7 + FIX 8 + iter3 FIX A + FIX B applied)

- Add top-level `transcriptPath: string | null` field to `session.json` AND its template `templates/session.template.json`.
- The manager stamps `transcriptPath` during Configuration Step 1 row 6 (`Initialize session.json`) by reading `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the hook). **This stamping happens THIS session — it is NOT deferred.** (FIX 3)
- **Disambiguation (FIX A).** The **manager agent** running this session reads the updated `orchestration/SKILL.md` Step 1 row 6 procedure and stamps `transcriptPath` into this session's own `session.json` during the Configuration phase. This in-scope mechanism is docs-driven (the manager — an LLM agent — follows the updated skill docs). A future **CLI automation** (e.g., a `gobbi session init` command that auto-stamps `transcriptPath` on session start without manager involvement) is deferred to a separate session and is out-of-scope this PR. The two are different mechanisms with different scopes: manager-side stamping is in-scope this session via the updated docs; CLI automation of the stamping is deferred. See § Stamping mechanism disambiguation for the full statement.
- **Tilde-form storage (FIX 8 + iter3 FIX B).** The manager performs tilde-substitution against `$HOME` before stamping: an absolute path like `$HOME/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl` is rewritten to `~/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl` and stored in `session.json` in tilde form. Rationale: `session.json` is git-tracked; absolute paths leak the literal home prefix (the username under the home directory) into version control. Gobbi is currently a solo project but may go open-source; tilde-form is cheap insurance against accidental disclosure. Downstream skills that read `session.json.transcriptPath` must tilde-expand the value (substitute `$HOME` back in) when consuming. The P7 reword text documents this consumer responsibility.
- Update `orchestration/SKILL.md` Step 1 row 6 procedure text to describe the tilde-substitution + stamping, and to specify that the procedure is performed by the manager agent (docs-driven, in-scope this session) rather than by CLI automation (deferred).
- **Also update `orchestration/SKILL.md` around line 371** — the "Top-level fields (in serialization order)" list under § Session metadata — to include `transcriptPath` in serialization order. Without this, the canonical session.json field set drifts from the schema. **(FIX 7)**

#### P7 — Replace `$CLAUDE_TRANSCRIPT_PATH` references in 6 skill files (locked)

- Where skills currently say "from `$CLAUDE_TRANSCRIPT_PATH`" they will say "from the manager-stamped `session.json.transcriptPath` field (tilde-expand `$HOME` on read), or `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env".
- File list with line numbers (verified by grep 2026-05-22):
  - `wrap-up/SKILL.md:280`
  - `planning/SKILL.md:417`
  - `execution/SKILL.md:208`
  - `ideation/SKILL.md:407, 415`
  - `memorization/SKILL.md:20, 146, 155`
  - `preparation/SKILL.md:330`

### Pre-resolved decisions (do NOT re-open)

- Mode = Chat; evaluation policy = always; git = worktree + PR base develop.
- `$CLAUDE_SESSION_ID` is dropped from skills (not kept as fallback alias) AND the hook does NOT export it (FIX 1).
- Hook is bash + jq (not bun). Values are shell-safe-quoted via `jq -r @sh` (iter3 FIX C).
- Only `transcriptPath` is added to `session.json` (not `startCwd`, not `hookEventName`). The new `CLAUDE_HOOK_SOURCE` export (FIX 5) is a `$CLAUDE_ENV_FILE` write, NOT a `session.json` field.
- Plugin mirror is excluded — do not propose mirror sync.
- `.claude/agents/*.md` not edited — clean per grep.
- `packages/cli/src/` runtime code not edited — **CLI automation of `transcriptPath` stamping is deferred to a future session; manager-side stamping driven by the updated `orchestration/SKILL.md` Step 1 row 6 procedure IS in-scope this session and applies to this session's own `session.json`** (iter3 FIX A clarification).
- All 8 iter1 evaluator findings + 3 iter2 evaluator findings are user-locked per their accepted remediations — see § Iter2 Changelog and § Iter3 Changelog above; do not re-open.

### Success criteria (mapped to exit criteria)

1. `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty post-merge.
2. `rg -n 'CLAUDE_CODE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns ≥ 13 hits (the 13 rename targets), all at expected line numbers.
3. `.claude/hooks/session-start.sh` exists, is executable (`test -x`), and contains a shebang + jq pipeline. The script exports `CLAUDE_CODE_SESSION_ID` (not `CLAUDE_SESSION_ID`) and exports `CLAUDE_HOOK_SOURCE` from stdin `source`.
4. **Shell-safe serialization (FIX C).** The hook writes `$CLAUDE_ENV_FILE` lines using `jq -r @sh` (or equivalent shell-safe quoting) such that sourcing the file is robust against paths with spaces, quotes, shell metacharacters, empty strings, and Unicode. Verifiable by injecting a fixture transcript path containing spaces and quotes (e.g., `/tmp/foo bar's baz.jsonl`) through the hook and confirming `source "$CLAUDE_ENV_FILE"; printf '%s\n' "$CLAUDE_TRANSCRIPT_PATH"` round-trips the original value byte-for-byte.
5. `.claude/settings.json` parses via `jq` and has `.hooks.SessionStart` registered with matcher covering startup/resume/clear/compact.
6. Next-session bootstrap (manually triggered or naturally on `/clear`): `$CLAUDE_TRANSCRIPT_PATH` is present in env (proves the hook fires); `$CLAUDE_ENV_FILE` contains the `export CLAUDE_TRANSCRIPT_PATH=...` line; `$CLAUDE_HOOK_SOURCE` is also present.
7. `session.template.json` parses as JSON and has `"transcriptPath": null` at top level; `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list contains `transcriptPath`.
8. **This session's own `session.json` (post-stamping by the manager during Configuration Step 1 row 6) carries a populated `transcriptPath` in tilde form** (e.g., `~/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl`); no literal home prefix appears in the stamped value. The stamp is performed by the manager agent following the updated skill docs, NOT by CLI automation (which remains deferred).
9. The PR squash-merges to `develop` with a single commit; CI/lints (if any) pass.

---

## Scope Contract

```yaml
artifact_type: scope-contract
feature: env-var-audit
goal: Rename `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` across `.gobbi/projects/gobbi/skills/**`, register `.claude/hooks/session-start.sh` (with shell-safe `jq -r @sh` serialization) to persist the hook-only vars (including new `CLAUDE_HOOK_SOURCE`) + 3 passthroughs to `$CLAUDE_ENV_FILE`, add tilde-form `transcriptPath` to `session.json` + template + `orchestration/SKILL.md` Session-metadata field list (stamped this session by the manager agent following the updated docs; CLI automation deferred), and rewrite the `gobbi/SKILL.md § Session env vars arrive automatically` paragraph + table (with new `CLAUDE_HOOK_SOURCE` row) + two-gate warning + add a new "Runtime-set env vars" sub-section.
created-by: ideation-loop / session 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
created-at: 2026-05-22 (iter3)
```

### In-Scope

- P1 — rename 13 occurrences of `$CLAUDE_SESSION_ID` to `$CLAUDE_CODE_SESSION_ID` across 12 files under `.gobbi/projects/gobbi/skills/` (full inventory in § File inventory above). Drop the old name entirely; no dual-name fallback.
- P2 — create `.claude/hooks/session-start.sh` (bash + jq, shell-safe `jq -r @sh` serialization per FIX C), register it in `.claude/settings.json` `hooks.SessionStart` block with matcher covering startup/resume/clear/compact. Hook exports `CLAUDE_CODE_SESSION_ID` (not `CLAUDE_SESSION_ID`) and adds new `CLAUDE_HOOK_SOURCE` export from stdin `source`.
- P3 — hook persists the 7 documented hook-only vars (renamed to `CLAUDE_CODE_SESSION_ID`) + new `CLAUDE_HOOK_SOURCE` + 3 passthroughs to `$CLAUDE_ENV_FILE` with shell-safe quoting.
- P4 — rewrite `gobbi/SKILL.md § Session env vars arrive automatically` paragraph (line 51), table row 1 (line 55), warning (line 66 — two-gate model) to cite the actual installed hook; **line 56 var name `CLAUDE_TRANSCRIPT_PATH` is NOT renamed**; add new table row for `CLAUDE_HOOK_SOURCE`.
- P5 — insert new "Runtime-set env vars" sub-section in `gobbi/SKILL.md`, listing the 4 runtime-set vars + the docs-vs-empirical discrepancy note for the 3 docs-claimed-but-empirically-unset vars. Cite Claude Code v2.1.132 (per official changelog) as the introduction version for `CLAUDE_CODE_SESSION_ID`.
- P6 — add top-level `transcriptPath: string | null` to `session.json` schema, `templates/session.template.json`, `orchestration/SKILL.md` Step 1 row 6 procedure text, AND `orchestration/SKILL.md` § Session metadata "Top-level fields (in serialization order)" list (around line 371). Storage is tilde-form against `$HOME`.
- P7 — reword 9 references to `$CLAUDE_TRANSCRIPT_PATH` across 6 skill files to cite `session.json.transcriptPath` (tilde-expand on read) as primary source; env fallback noted.
- **Manager-agent stamping of this session's own `session.json.transcriptPath`** during Configuration Step 1 row 6 (per the updated `orchestration/SKILL.md` procedure). This is the in-scope mechanism for the stamping; CLI automation of the same stamping is deferred (iter3 FIX A).
- Single worktree, single atomic PR off `develop`; multiple bisect-safe commits permitted; squash-merge to develop.

### Out-of-Scope

- `.claude/agents/*.md` — no env-var refs per grep; no edits.
- `plugins/` mirror — excluded per user setup answer; no mirror sync.
- `packages/cli/src/` runtime code — excluded per user setup answer. **CLI automation of `transcriptPath` stamping (e.g., a `gobbi session init` command that auto-stamps on session start without manager involvement) is deferred to a future session.** Manager-side stamping driven by the updated `orchestration/SKILL.md` Step 1 row 6 procedure IS in-scope this session and applies to this session's own `session.json` (iter3 FIX A).
- TS+bun port of the hook — deferred to a future session per user answer.
- New skills, new agents, new runtime features beyond the env-var audit.
- Touching `.claude/CLAUDE.md`, `.claude/README.md`, `.claude/settings.local.json`, `.claude/.env` — neither in scope nor required.
- Touching `main` or `develop` branches directly; no history rewrites.
- New stdin-JSON-sourced exports beyond `CLAUDE_HOOK_SOURCE` (FIX 5); new `session.json` fields beyond `transcriptPath` (FIX 8); new skill targets.

### Decisions Locked

- **P1** — `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` rename; old name dropped entirely.
- **P2** — `.claude/hooks/session-start.sh` bash + jq with shell-safe `jq -r @sh` serialization (iter3 FIX C); matcher `startup|resume|clear|compact`; idempotency via "Claude Code re-sources env file each fire — last writer wins"; hook exports `CLAUDE_CODE_SESSION_ID` (not `CLAUDE_SESSION_ID`) per FIX 1, and adds `CLAUDE_HOOK_SOURCE` per FIX 5.
- **P3** — Hook-only vars + new `CLAUDE_HOOK_SOURCE` + 3 passthroughs persisted via the hook with shell-safe quoting.
- **P4** — `gobbi/SKILL.md` paragraph + table (with new `CLAUDE_HOOK_SOURCE` row; line 56 var name preserved) + two-gate warning rewrite per § Why → Motivation and § Health Gate.
- **P5** — New "Runtime-set env vars" sub-section in `gobbi/SKILL.md` listing the 4 runtime-set vars + docs-vs-empirical discrepancy note; CCSI introduction cited as Claude Code v2.1.132.
- **P6** — `transcriptPath: string | null` added to `session.json` schema + `session.template.json` + `orchestration/SKILL.md` Step 1 row 6 + `orchestration/SKILL.md` § Session metadata top-level-fields list (~line 371). Stored in tilde form. **Manager-agent stamping is the in-scope mechanism this session; CLI automation of the same is deferred (iter3 FIX A).**
- **P7** — 9 `$CLAUDE_TRANSCRIPT_PATH` references across 6 files reworded to cite `session.json.transcriptPath` (tilde-expand on read) first, env var second.

### Success Criteria

See § How → Success criteria above (9 numbered criteria mapped to exit criteria; criterion 4 covers shell-safe serialization per iter3 FIX C, criterion 8 covers manager-agent stamping per iter3 FIX A).

### Deferred

- TypeScript + bun port of `.claude/hooks/session-start.sh` — future session (P2 note).
- **CLI automation of manager-side `transcriptPath` stamping** in `packages/cli/src/` (e.g., a `gobbi session init` command or equivalent runtime auto-stamper that operates without manager involvement) — future session. This session ships the docs-driven contract that the manager agent follows; CLI implementation of that contract is the deferred item (iter3 FIX A).
- Any rationalization of docs-vs-empirical discrepancy for `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` — flagged in the new sub-section; investigation deferred.
- `.claude/agents/*.md` env-var audit — empirically clean; if a future agent adds an env-var ref, that change must self-include the rename.
- Downstream consumers of `CLAUDE_HOOK_SOURCE` — currently no skill consumes it; documenting it preserves the artifact's alignment with official Claude Code hook docs (FIX 5).

---

## Open questions

None remaining. All eight iter1 evaluator findings and all three iter2 evaluator findings have been applied per the user-accepted remediations recorded in § Iter2 Changelog and § Iter3 Changelog above. The previous iter1 "Minor inventory addendum" about `gobbi/SKILL.md:56` has been promoted into the P4 main constraint block (FIX 2); it is no longer an open item.
