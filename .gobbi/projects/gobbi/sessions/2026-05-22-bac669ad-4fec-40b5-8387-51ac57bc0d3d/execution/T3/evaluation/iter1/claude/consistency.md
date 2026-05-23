# Consistency Perspective — T3 iter1

**Evaluator:** Claude (Sonnet 4.6)
**Phase:** Execution
**Target:** commit `e2b2382` on `feat/env-var-audit-sessionstart-hook` — `gobbi/SKILL.md § Session env vars arrive automatically` rewrite (sub-edits a-f)
**Iter:** 1

---

## Artifact Summary

**What:** A 6-part rewrite of the "Session env vars arrive automatically" section in `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`. Changes: (a) renames `CLAUDE_SESSION_ID` → `CLAUDE_CODE_SESSION_ID` in the table row, (b) adds a `CLAUDE_HOOK_SOURCE` table row, (c) rewrites the two-gate health warning to name both gates with CCSI and transcript-path tests, (d) adds version citation `v2.1.132`, (e) adds a new `§ 2a. Runtime-set env vars` sub-section listing four runtime vars, (f) adds a docs-vs-empirical discrepancy note.

**Why:** The env-var audit identified `CLAUDE_SESSION_ID` as stale (actual name is `CLAUDE_CODE_SESSION_ID` since v2.1.132); the entry-point skill was the canonical source of truth for session bootstrap vars.

**How:** Direct edits to `gobbi/SKILL.md`; single commit; scope bounded to this one file.

**Scope Contract source:** Execution loop T3 task contract (6 sub-edits a-f; scope = `gobbi/SKILL.md` only).

**Memory reads:**
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/README.md`
- `/playinganalytics/git/gobbi/.claude/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md`

---

## W/W/H Gate

- **What:** Clear — rewrite of 6-part env-vars section in `gobbi/SKILL.md`. Present.
- **Why:** Clear — stale var name `CLAUDE_SESSION_ID` vs actual `CLAUDE_CODE_SESSION_ID` since v2.1.132. Present.
- **How:** Clear — 6 named sub-edits (a–f), single file, single commit. Present.

Gate: all three clear. Proceed to Stage 1.

---

## Locked Frame (Stage 1)

### Scenario 1: Rename propagated everywhere the old name appeared in this file
Checklist:
- [ ] Zero occurrences of bare `CLAUDE_SESSION_ID` in `gobbi/SKILL.md`
- [ ] `CLAUDE_CODE_SESSION_ID` present ≥ 1 time in `gobbi/SKILL.md`
- [ ] Table row for `CLAUDE_CODE_SESSION_ID` preserved (not moved or deleted)

### Scenario 2: Rename NOT propagated to other skills (out-of-scope consistency leak — adversarial)
Checklist:
- [ ] Other skill files (`evaluation/SKILL.md`, `preparation/SKILL.md`, `memorization/SKILL.md`, etc.) still reference old `$CLAUDE_SESSION_ID` in path-convention sections
- [ ] Whether this is a known deferred item or unrecognized gap

### Scenario 3: Two-gate warning names both gates correctly
Checklist:
- [ ] Gate 1 names `CCSI` / `CLAUDE_CODE_SESSION_ID` (not the old name)
- [ ] Gate 2 names `CLAUDE_TRANSCRIPT_PATH` + `test -f` file-presence check
- [ ] Warning text includes specific next-step diagnostic (not vague "check the hook")

### Scenario 4: `CLAUDE_HOOK_SOURCE` row is internally consistent
Checklist:
- [ ] Values documented (`startup` / `resume` / `clear` / `compact`) match the hook matcher in `settings.json`
- [ ] Row does not conflict with `CLAUDE_HOOK_EVENT_NAME` semantics

### Scenario 5: Runtime-set vars sub-section does not duplicate hook table rows (adversarial overlap)
Checklist:
- [ ] `CLAUDE_CODE_SESSION_ID` appears in both tables (hook passthrough + runtime-set); distinction explained
- [ ] No other runtime-only var silently added to the hook table
- [ ] `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA` correctly categorized as passthrough (not runtime-set)

### Scenario 6: Version citation `v2.1.132` is factually consistent
Checklist:
- [ ] `v2.1.132` cited as the introduction version for CCSI
- [ ] No contradiction between the version cited in Gate 1 warning and the Runtime-set table

not-applicable: no adversarial scenario for licensing/IP or i18n — these are not applicable to an env-var doc section.

---

## Stage 2 — Per-Scenario Evaluation

### Scenario 1: Rename propagated within gobbi/SKILL.md

- `rg -n 'CLAUDE_SESSION_ID' gobbi/SKILL.md` — **EMPTY** (0 occurrences). PASS.
- `rg -n 'CLAUDE_CODE_SESSION_ID' gobbi/SKILL.md` — 3 occurrences (lines 55, 69, 80). PASS.
- Table row at line 55 confirmed present. PASS.

All checks: YES.

### Scenario 2 (adversarial): Rename NOT propagated to other skills

- Checked all 10+ skill files and `orchestration/workflow/evaluation.md`.
- Result: **11 files still contain `$CLAUDE_SESSION_ID`** in their path-convention "Output paths" sections:
  - `evaluation/SKILL.md:563`, `preparation/SKILL.md:375`, `memorization/SKILL.md:227`, `interview/SKILL.md:324`, `wrap-up/SKILL.md:325`, `execution/SKILL.md:255`, `ideation/SKILL.md:465`, `planning/SKILL.md:462`, `mistake/SKILL.md:129`, `research/SKILL.md:145`, `orchestration/workflow/evaluation.md:292`
- These are all `"Claude Code session ID from \`$CLAUDE_SESSION_ID\`"` references in path-convention bullet points — they name the env var a reader should use to derive `{session-id}`.
- The T3 scope contract bounded edits to `gobbi/SKILL.md` only, so this is out-of-scope for this commit. However, the rename is now **inconsistent** cross-skill: `gobbi/SKILL.md` teaches `$CLAUDE_CODE_SESSION_ID` while 11 other skills still instruct readers to use `$CLAUDE_SESSION_ID`.
- This is a pre-existing inconsistency that the T3 commit made worse (gobbi/SKILL.md diverged from the rest), not one it introduced from zero — but the net effect is a newly visible cross-skill conflict.

Finding F-CON-01 (design_flaw / docs-sync / open / Confidence 100 / Medium):
The T3 rename is complete within `gobbi/SKILL.md` but 11 other skill files still name `$CLAUDE_SESSION_ID` in their "Output paths" sections. After this commit, the canonical entry-point skill contradicts 11 dependent skills on the env var name for session-directory construction. A user or agent reading any of those skills would use the wrong variable name to derive `{session-id}`.
Evidence: `evaluation/SKILL.md:563`, `preparation/SKILL.md:375`, `memorization/SKILL.md:227` and 8 others — see rg output above.
Severity justification: Medium (not Critical/High) because (a) these are doc references, not runtime code; (b) `{session-id}` is passed as a harness input, not usually derived from the env var by agents at runtime; (c) a competent reader recognizes the cross-reference inconsistency. However, it should be addressed in a follow-up commit to close the consistency gap.

### Scenario 3: Two-gate warning quality

- Gate 1 (line 69): names `$CLAUDE_CODE_SESSION_ID` (correct new name). Names `v2.1.132`. Names specific diagnostic: "install may be broken or runtime is older." Distinguishes runtime-set vs hook-set. PASS.
- Gate 2 (line 70): names `$CLAUDE_TRANSCRIPT_PATH`. Includes `test -f "$CLAUDE_TRANSCRIPT_PATH"`. Names specific diagnostics: "executable bit, `jq` availability, `hooks.SessionStart` registration." PASS.
- Gate 2 condition "If either condition fails while Gate 1 passes" — correctly scoped to avoid noise when CCSI itself is absent. PASS.
- Warning surfaces to user (not silent). PASS.

All checks: YES. Warning text is specific and actionable.

### Scenario 4: CLAUDE_HOOK_SOURCE row internal consistency

- Line 59: `startup / resume / clear / compact` values documented.
- Commit `6a575f2` registered `startup|resume|clear|compact` matcher in `settings.json` (per commit message).
- Values match. PASS.
- Line 58: `CLAUDE_HOOK_EVENT_NAME` = `"SessionStart"` — explicitly noted as distinct from `CLAUDE_HOOK_SOURCE`. PASS.

All checks: YES.

### Scenario 5: Runtime-set vars sub-section overlap

- `CLAUDE_CODE_SESSION_ID` appears in BOTH the hook table (line 55, as a hook-exported var) AND the runtime table (line 80, as a runtime-set var). Line 80 explains: "Also exported by the SessionStart hook as a belt-and-suspenders fallback." Distinction is clear. PASS.
- `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`: in the hook table as "passthrough" rows (lines 63–65); NOT in the runtime-set table. The discrepancy note (line 85) correctly explains they are docs-only runtime vars, empirically unset. PASS.
- No runtime-only var silently in the hook table. PASS.

All checks: YES.

### Scenario 6: Version citation consistency

- Line 69 (Gate 1 warning): `v2.1.132`. Line 80 (runtime-set table): `v2.1.132`. Consistent. PASS.
- No contradiction. PASS.

---

## Findings Summary

| ID | Type | Domain | Disposition | Confidence | Severity |
|----|------|--------|-------------|------------|---------|
| F-CON-01 | design_flaw | docs-sync | open | 100 | Medium |

**F-CON-01 detail:**
- Evidence: 11 skill files reference `$CLAUDE_SESSION_ID` (old name) in "Output paths" path-convention bullets. `gobbi/SKILL.md` now uses the correct name `CLAUDE_CODE_SESSION_ID`.
- Why it matters: An agent or user following any of the 11 affected skills to construct `{session-id}` from the env var will read the wrong variable name. The entry-point doc contradicts the dependent skills.
- Suggested direction: Follow-up commit to rename `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` in the "Output paths" / path-convention sections of all 11 skills. Scope is mechanical — one grep-replace pattern per file; no semantic change.

---

## Per-Perspective Verdict

Any `Critical` ≥ 75 → FAIL. Any `High` ≥ 50 → REVISE. F-CON-01 is Medium/100.

**Consistency verdict: PASS** (with one recorded Medium finding for follow-up).

---

## Must-Preserve List

- Two-gate structure with named gate labels (Gate 1 / Gate 2) — clear, actionable, and specific.
- Version citation `v2.1.132` in both Gate 1 warning and runtime-set table — factually grounded.
- Docs-vs-empirical discrepancy note for `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` — genuinely useful operational knowledge.
- `CLAUDE_HOOK_SOURCE` row — correctly documents the `source` field distinct from `hook_event_name`.
- Belt-and-suspenders explanation for `CLAUDE_CODE_SESSION_ID` in the runtime-set table.

## Low-confidence appendix

None. All findings are high-confidence (tool-verified via rg).
