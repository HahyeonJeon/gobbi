---
date: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: ideation
feature: env-var-audit
topic: env-var audit scope and design decisions
outcome: 7 primary design decisions (P1-P7) + mode/git/eval settings locked; 11 finding remediations accepted across iter1+iter2+iter3 triage
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

Iter1 dual-system evaluation returned REVISE (Claude: 2 REVISE perspectives; Codex: 4 High/100 findings). The manager presented 8 findings for user triage.

### Q8 — Accept FIX 1: resolve hook export contradiction (F-CONS-01 / High/100)

- **Question topic:** Three sections of the artifact contradict each other on whether `CLAUDE_SESSION_ID` is exported to `$CLAUDE_ENV_FILE`. Claude finding F-CONS-01 and Codex overall finding COD-OVERALL-001 both flag this. Accept the fix: hook exports ONLY `CLAUDE_CODE_SESSION_ID`; `CLAUDE_SESSION_ID` NOT exported?
- **User's answer:** Accept. Hook exports only `CLAUDE_CODE_SESSION_ID`.
- **Decision class:** `ask: design`

### Q9 — Accept FIX 2: move `gobbi/SKILL.md:56` DO-NOT-RENAME constraint to P4 (F-USAGE-01 / High/75)

- **Question topic:** The `CLAUDE_TRANSCRIPT_PATH` do-not-rename constraint is buried in § Open questions, where Planning may miss it. Move it into the P4 constraint block?
- **User's answer:** Accept. Constraint moved to P4 main block.
- **Decision class:** `ask: design`

### Q10 — Accept FIX 3: reword exit criterion 7 to say stamping is NOT deferred (F-CONS-02 / Medium/75)

- **Question topic:** Exit criterion 7 says `transcriptPath` stamping is deferred. The Scope Contract says this session delivers the docs-driven contract (manager stamps). Accept the fix: criterion 7 reworded to say stamping IS done this session?
- **User's answer:** Accept. Criterion 7 reworded; "deferred" wording removed.
- **Decision class:** `ask: design`

### Q11 — Accept FIX 4: two-gate health check redesign (COD-OVERALL-001 / High/100)

- **Question topic:** CCSI is runtime-auto-set regardless of whether the hook fires. Gate 1 (CCSI absent) does not catch silent hook failures. Accept adding Gate 2 (`$CLAUDE_TRANSCRIPT_PATH` present + file exists) to catch silent hook failures?
- **User's answer:** Accept. Two-gate model adopted.
- **Decision class:** `ask: design`

### Q12 — Accept FIX 5: add `CLAUDE_HOOK_SOURCE` export (COD-OVERALL-002a / High/100)

- **Question topic:** The stdin JSON has a `source` field (startup/resume/clear/compact) distinct from `hook_event_name`. Add `CLAUDE_HOOK_SOURCE` as a new export from this field?
- **User's answer:** Accept. `CLAUDE_HOOK_SOURCE` added to hook contract and `gobbi/SKILL.md` env-var table.
- **Decision class:** `ask: design`

### Q13 — Accept FIX 6: correct version number to v2.1.132 (COD-OVERALL-002b / High/100)

- **Question topic:** Every "v2.1.128+" mention is wrong — the official changelog says `CLAUDE_CODE_SESSION_ID` was added in v2.1.132. Accept the version correction?
- **User's answer:** Accept. All version refs corrected to v2.1.132.
- **Decision class:** `ask: design`

### Q14 — Accept FIX 7: add `orchestration/SKILL.md` line-371 area to P6 edit set (COD-OVERALL-003 / High/100)

- **Question topic:** Adding `transcriptPath` to `session.json` requires the `orchestration/SKILL.md` "Top-level fields (in serialization order)" list (~line 371) to document it. Otherwise the canonical session.json field set drifts from the schema. Accept adding this edit to P6?
- **User's answer:** Accept. `orchestration/SKILL.md` line-371 area added to P6 edit set and file inventory.
- **Decision class:** `ask: design`

### Q15 — Accept FIX 8: tilde-form storage for `transcriptPath` (COD-OVERALL-004 / High/100)

- **Question topic:** Storing `transcriptPath` as an absolute path would leak `$HOME` (the username) into git-tracked `session.json`. Tilde-form storage (manager substitutes `$HOME` → `~` before stamping; consumers expand back on read) prevents this. Accept?
- **User's answer:** Accept. Tilde-form storage adopted; consumer tilde-expand requirement documented in P7.
- **Decision class:** `ask: design`

---

## Iter2 Finding Triage (~3 questions, 2026-05-22)

Iter2 evaluation returned REVISE (Claude Consistency perspective REVISE; one new High/100 finding F-CONS-03). Three Codex findings also surfaced. Manager presented 3 findings for triage.

### Q16 — Accept FIX A: add stamping mechanism disambiguation section (F-CONS-03 / COD-OVERALL-ITER2-001 / dual-system / High/100)

- **Question topic:** FIX 3 (iter1) asserted "NOT deferred" for `transcriptPath` stamping without adding the disambiguating sentence distinguishing manager-agent stamping (in-scope, docs-driven) from CLI automation (deferred). Both Claude and Codex flagged this as a new contradiction. Accept adding the dedicated `§ Stamping mechanism disambiguation` section and updating Out-of-Scope/Pre-resolved/Deferred bullets?
- **User's answer:** Accept. FIX A applied: dedicated section added; two mechanisms explicitly named and scoped.
- **Decision class:** `ask: design`

### Q17 — Accept FIX B: replace literal home path in P6 example (COD-OVERALL-ITER2-002 / High/75)

- **Question topic:** P6's tilde-form storage paragraph used a literal `/home/jeonhh0061/...` example, contradicting the tilde-form rule it was explaining. Accept replacing with a `$HOME`-prefixed generic illustration?
- **User's answer:** Accept. `/home/jeonhh0061/...` replaced with `$HOME/.claude/projects/...` in P6 instruction text.
- **Decision class:** `ask: design`

### Q18 — Accept FIX C: mandate `jq -r @sh` for shell-safe serialization (COD-OVERALL-ITER2-003 / High/75)

- **Question topic:** The hook contract does not specify how to quote values when writing `export VAR=value` lines. Values with spaces, quotes, or metacharacters would break `source "$CLAUDE_ENV_FILE"`. Accept mandating `jq -r @sh` (or equivalent POSIX-shell-safe quoting) for all exported fields? This adds a new success criterion (criterion 4) for round-trip verification.
- **User's answer:** Accept. `jq -r @sh` mandated; canonical pattern added to hook contract; success criterion 4 added.
- **Decision class:** `ask: design`

---

## Iter3 Finding Triage (inline — no separate AskUserQuestion needed)

Iter3 evaluation returned PASS (dual-system: Claude 7 PASS / Codex 7 PASS). Two findings were surfaced (F-STRUCT-01 Medium/75; F-CONS-04 Medium/75) but neither met the REVISE threshold. Both deferred to backlog. F-CONS-04 received an inline fix (success criterion cross-reference corrected from "criterion 7" to "criterion 8" — a trivial one-word change). No user AskUserQuestion was required for iter3 triage.
