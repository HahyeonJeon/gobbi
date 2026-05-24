# Consistency — iter3 Claude

## Stage 0 — Target read

Consistency lens: does iter3 preserve internal cross-file consistency, and do the three fixes leave neighboring claims undisturbed?

## Stage 1 — Inheritance

| Finding | Source | iter3 disposition |
|---|---|---|
| iter1 C1 (invented trailer) | claude | addressed iter2 F-2; preserved |
| iter1 C2 (delegation grep) | claude | addressed iter2 T1-I-T1.i; preserved |
| iter1 COD-CONS (D-3-4 vs T3-I-3) | codex | addressed iter2 F-6 input/result split; preserved |
| iter1 COD-CONS-003 (status extra-property) | codex | deferred (schema bump) |
| iter2 C1 (F-4 regex violation) | iter2 claude | **addressed iter3 Fix A** |

## Stage 2 — Consistency walk

### C-A — Cross-file branch-prefix consistency (Fix A)

Active design statements referencing the row-5.5 branch prefix all use `chore/session-{date}-{ssid-short}`:
- D-1 (line 308, 310, 313)
- T1-I-T1.a (line 274)
- T1-I-T1.h smoke-test regex (line 281)
- G-1 scenario (line 221)
- E-2 scenario (line 227)
- F-4 scenario (line 235)
- Validation strategy table row for D-1 (line 424)
- Decisions Locked summary bullet (line 68)
- F-Fix-A entry (line 521-526)

Independent `grep -nE "session/" draft-iter3.md` returns 15 hits; cross-checked against active vs historical:
- 9 hits are `gobbi://session/{session-id}/task/...` AI-Provenance-Record URI templates — NOT branch names, different namespace.
- 5 hits are iter3 Fix A narrative / historical citation referencing the iter2 form.
- 1 hit is iter2 F-4 retention entry in Decisions Log subsection.

No active design statement uses the bare `session/{date}-...` branch form. **Cross-file consistency PASS.**

### C-B — Type-registry citation consistency

D-1 cites `git/conventions.md:22` (regex), `:64` (length), `:261` (label-color). Independent whole-file read of `git/conventions.md` (this evaluator):
- Line 22: `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$` — exact match to the regex cited in D-1.
- Line 64: "Description length 3–50 chars (post-`/`)" — matches the cited length rule.
- Line 261: `| `chore` | `#e4e669` |` — confirmed (label color is correct, type-label table header is at row 259-260).

All three citations are accurate. **No drift between draft-iter3.md and the spec file.**

### C-C — Verbatim-quote consistency (Fix B)

The two verbatim quotes appear in three places — checked for byte-identity:

T3-E-5 (line 205): `Verbatim quote from the lifecycle table: \`| PostToolUseFailure | After a tool call fails |\`. Verbatim quote from the exit-code behavior table: \`| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |\`.`

D-3-3 (line 366): `Verbatim quote from the lifecycle table: \`| PostToolUseFailure | After a tool call fails |\`. Verbatim quote from the exit-code-behavior table: \`| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |\`.`

F-Fix-B (line 530-531): `Lifecycle table: \`| PostToolUseFailure | After a tool call fails |\` ... Exit-code-behavior table: \`| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |\``

Staged reference file (lines 33, 39): same block-quoted forms.

Inter-section consistency: byte-identical except for minor leading-text differences ("exit-code-behavior" vs "exit-code behavior" hyphenation — minor; does not change the quoted content). **Consistent.**

### C-D — Dormant-precondition consistency (Fix C)

D-3-3-resolver step (i) annotation (line 377) says: "this file **does not exist** in the repo today (verified empirically: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns 'No such file or directory' as of 2026-05-23)."

Backlog file (line 19): "Empirical verification on 2026-05-23 (iter3, `ls .gobbi/project.json` from the repo root): the file **does not exist** in this repo."

F-Fix-C (line 535): "Empirical verification on 2026-05-23 (`ls -la /playinganalytics/git/gobbi/.gobbi/project.json`) returns 'No such file or directory'."

All three statements agree. **Consistent.**

This evaluator independently verified `ls -la .gobbi/project.json` returns "No such file or directory" — matches the claim.

### C-E — Decisions-Locked bullet consistency

Line 68 (Scope Contract Decisions Locked):
- States `chore/session-{date}-{ssid-short}` as the locked form.
- Cites `git/conventions.md:22` regex, `:21-29,64` length rule.

Cross-check vs D-1 narrative (line 308-313): the cited line numbers match (line 22 regex, line 64 length, line 261 label-color). The "21-29" range citation in line 68 corresponds to D-1's "line 22 regex + surrounding context" — slightly imprecise but not inconsistent.

### C-F — Backlog promotion log consistency

Line 493: "Feature-level (2): `schema-extension-agents-status-field`, `dot-gobbi-project-json-bootstrap` (NEW iter3 Fix C)" — matches the empirical `ls staging/backlogs/feature/`:
- `dot-gobbi-project-json-bootstrap.md` (created iter3)
- `schema-extension-agents-status-field.md` (created iter2 / prior)

**Consistent.**

Out-of-Scope list (line 53), Deferred list (line 89), Backlog promotion log (line 493): all three reference `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` with the same Fix C attribution. **Consistent.**

### C-G — iter3 fix-decisions ↔ iter2 fix-decisions cross-references

F-4 entry in iter2-fix-decisions subsection (line 505) explicitly says "**iter3 Fix A supersedes** ... See iter3 fix-decision F-Fix-A below for the corrected lock."

F-3 entry (line 503) cross-references F-Fix-B: "**iter3 Fix B re-verifies + preserves verbatim quote** (see iter3 fix-decision F-Fix-B below)."

F-5 entry (line 507) cross-references F-Fix-C: "**iter3 Fix C augments** with the dormant-precondition note on step (i) — file does not exist in repo today (see F-Fix-C)."

Bidirectional cross-referencing intact. **Consistent.**

## Stage 3 — Findings

### F-CONS-iter3-1 — Fix A cross-file consistency restored (POSITIVE)
- type: `general`
- domain: `docs-sync`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- inherited-from: `iter2/claude/consistency-C1` (Critical 100 mirror of P1)
- evidence: 9-site active-statement grep clean; cross-file `git/conventions.md` citations match the spec (re-read by this evaluator).
- why it matters: closes the iter2 Critical convergent finding.

### F-CONS-iter3-2 — Verbatim-quote inter-section consistency (POSITIVE)
- type: `general`
- domain: `docs-sync`
- disposition: `addressed`
- confidence: 100
- severity: Low
- evidence: Quotes appear in T3-E-5, D-3-3, F-Fix-B, and staged reference file — all byte-identical (modulo minor hyphenation of leading prose).
- suggested direction: preserve.

### F-CONS-iter3-3 — Dormant-precondition cross-statement consistency (POSITIVE)
- type: `general`
- domain: `docs-sync`
- disposition: `addressed`
- confidence: 100
- severity: Low
- evidence: D-3-3-resolver, backlog file, F-Fix-C — three statements all agree; `ls -la` empirically confirmed.
- suggested direction: preserve.

### F-CONS-iter3-4 — Inherited COD-CONS-003 deferred (carry-forward)
- type: `general`
- domain: `process`
- disposition: `deferred`
- confidence: 75
- severity: Low
- inherited-from: `iter1/codex/consistency-COD-CONS-003`
- evidence: `status` field schema bump remains backlogged at `staging/backlogs/feature/schema-extension-agents-status-field.md`; iter3 did not change this.

## Preserve list (carry to Planning)

1. The 3-place verbatim-quote propagation pattern (insight + design + fix-decision-log) — preserves auditability.
2. The bidirectional iter2 ↔ iter3 fix-decision cross-references — preserves chronological audit trail.
3. The grep-audit clean-status (15 `session/` hits, all benign) — documented in WORK exit checklist.

## Verdict

**PASS** — All iter3 fixes cross-file consistent. iter2 Critical convergent C1 finding closed. No new High consistency findings; inherited deferred items remain deferred per scope.
