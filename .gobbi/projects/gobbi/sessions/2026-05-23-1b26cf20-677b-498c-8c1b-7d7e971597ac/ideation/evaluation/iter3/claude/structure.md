# Structure — iter3 Claude

## Stage 0 — Target read

Structural lens: does iter3's surgical 3-fix preserve the iter2 design's coherence? Are the inserted sections (D-3-3-resolver step (i) annotation, T3-I-T3.h, F-Fix-A/B/C) well-placed and load-bearing without breaking neighboring sections?

## Stage 1 — Inheritance

| Finding | Source | iter3 disposition |
|---|---|---|
| iter1 S1 (DRY inline jq) | claude | preserved as deferred (iter2 disposition unchanged) |
| iter1 S2 (partial-deploy safety) | claude | preserved as deferred (Confidence 50) |
| iter1 S3 (decimal row 5.5) | claude | preserved as deferred (aesthetic for Planning) |
| iter1 COD-STRUCT-001 (resolver underspec) | codex | addressed iter2 D-3-3-resolver; iter3 Fix C augments dormant-precondition |
| iter1 COD-STRUCT-002 (lost-update race) | codex | addressed iter2 D-3-5 flock |
| iter1 COD-STRUCT-003 (correlation key) | codex | addressed iter2 D-3-6 jq paths |
| iter2 S1 (flock+mv inode replacement) | iter2 claude | preserved as deferred (Medium 50) |

## Stage 2 — Structural walk

### S-A — Document architecture preserved

iter3 retains the iter2 outline verbatim: Scope Contract → Framed Problem → Research Insights → Scenarios → Implementation Checklist → Design (T1 D-1..D-5, T3 D-3-1..D-3-6, validation strategy table) → Decisions Log (incl. iter2 fix-decisions + new iter3 fix-decisions subsection) → iter3 WORK exit checklist (new tail section).

The new iter3 WORK exit checklist (line 541-553) is appended cleanly as a final tail section, not interleaved. The Decisions Log iter3-fix-decisions subsection (line 517-537) follows the iter2-fix-decisions subsection — chronological order maintained.

### S-B — Fix A propagation (locality check)

iter3 Fix A modifications confined to:
- D-1 narrative (line 308-313)
- T1-I-T1.a (line 274)
- T1-I-T1.h smoke-test regex (line 281)
- G-1 scenario (line 221)
- E-2 scenario (line 227)
- F-4 scenario (line 235)
- Validation strategy table row for D-1 (line 424)
- Decisions Locked bullet (line 68)
- F-Fix-A narrative + grep audit (line 521-526)

This is the structurally minimal propagation set. Cross-referencing the diff (8 inline changes + 1 historical-context bullet in Decisions Locked + 1 new fix-decision entry) — **no orphan citations, no dangling references**.

### S-C — Fix B verbatim insertion (locality check)

Fix B modifications confined to:
- T3-E-5 research insight (line 205) — verbatim quotes added inline
- D-3-3 design narrative (line 366) — verbatim quotes added inline
- T3-I-T3.c checklist (line 289) — citations added
- Staged reference `claude-code-posttooluse-hook-schema.md` — new "PostToolUseFailure — verbatim verification" subsection (line 25-75)
- Validation table row for D-3-3 (line 431)
- F-Fix-B narrative (line 528-533)

No drift into other sections. The Staged reference file's added section integrates cleanly above the "Why it applies" section. The augmentation does NOT contradict the iter2 reference-file content; it adds depth.

### S-D — Fix C dormant-precondition insertion (locality check)

Fix C modifications confined to:
- D-3-3-resolver step (i) annotation (line 377) — new sub-bullet "Dormant precondition (iter3 Fix C)"
- Step (ii) header updated to "currently the only working path" (line 378)
- T3-I-T3.h new checklist item (line 294)
- Out-of-Scope list new bullet (line 53)
- Deferred list new bullet (line 89)
- Backlog promotion log extended to 9 entries (line 493)
- New staged backlog file `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` (57 lines)
- F-Fix-C narrative (line 535-537)

Structurally clean: backlog file follows the same shape as the existing `schema-extension-agents-status-field.md` peer.

### S-E — Adjacent decisions untouched

Spot-checked D-2 (line 315-320), D-3 (line 322-327), D-4 (line 329-334), D-5 (line 336-340), D-3-1 (line 344-351), D-3-2 (line 353-360), D-3-4 (line 388-399), D-3-5 (line 401-406), D-3-6 (line 408-418) — all preserved verbatim from iter2 (confirmed via diff). No orthogonal-edit propagation contamination.

### S-F — Karpathy mode-3 check

iter2 was a Karpathy mode-3 victim (F-4 fix introduced regex violation while addressing COD-PROJ-001). iter3 must not repeat that pattern.

Fix A: changes confined to branch-prefix tokens. No design-mechanism implications. Smoke-test regex updated consistently in T1-I-T1.h. No mode-3.

Fix B: adds verbatim quotes only; D-3-3 dual-event design unchanged. The single-script handles-both-events claim was already locked in iter2 (CP-D-1). Does the official-doc enforce anything that contradicts "single script" claim? Re-read of the staged reference — the doc says PostToolUseFailure is non-blocking (exit code 2 surfaces stderr but does not block tool failure); does not restrict single vs multi-script registration. **No contradiction, no mode-3.**

Fix C: backlog file says "Either path is valid". Does it introduce a hidden Execution dependency? Re-read: "the hook is functional without step (i); step (ii) is sufficient for the current single-project repo." Backlog explicitly notes the file creation is optional. **No new precondition forced on Execution. No mode-3.**

## Stage 3 — Findings

### F-STRUCT-iter3-1 — Surgical 3-fix structural locality preserved (POSITIVE)
- type: `general`
- domain: `process`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- evidence: 311-line diff localized to D-1 / T1-I-T1.a/.h / G-1 / E-2 / F-4 / D-3-3 / T3-E-5 / T3-I-T3.c / D-3-3-resolver / T3-I-T3.h / Out-of-Scope / Deferred / Backlog log / Decisions Log (iter2 + iter3 subsections) + tail WORK exit checklist + staged reference + new backlog file. No collateral edits to D-2/D-3/D-4/D-5/D-3-1/D-3-2/D-3-4/D-3-5/D-3-6.
- why it matters: iter3 is a successful Karpathy-mode-3-free surgical revision.
- suggested direction: no change needed.

### F-STRUCT-iter3-2 — Inherited Structure findings from iter1/iter2 carry forward (DEFERRED)
- type: `general`
- domain: `process`
- disposition: `deferred`
- confidence: 75
- severity: Low
- inherited-from: `iter1/claude/structure-S1` (DRY inline jq), `iter1/claude/structure-S2` (partial-deploy safety), `iter1/claude/structure-S3` (decimal row 5.5), `iter2/claude/structure-S1` (flock+mv inode replacement Medium 50)
- evidence: iter3 brief explicitly scopes ONLY 3 fixes. These deferred items were not in scope and remain deferred status (iter2 dispositions unchanged).
- why it matters: not a blocker; just inheritance tracking discipline.
- suggested direction: revisit at Planning sub-step decomposition (S3 row 5.5 is the most likely candidate for Planning-time renumbering; S1 DRY-jq is candidate for Execution-time shared-library extraction).

## Preserve list (carry to Planning)

1. The iter3 surgical-fix discipline as a template: explicit WORK exit checklist with empirical confirmations.
2. The "currently the only working path" update to D-3-3-resolver step (ii) — it makes the algorithm's runtime behavior explicit.
3. The two-tier inheritance documentation (iter2 fix-decisions retained, iter3 fix-decisions appended as separate subsection) — preserves the audit chain.
4. Adjacent design decisions (D-2/D-3/D-4/D-5/D-3-1..D-3-6) preserved without modification.

## Verdict

**PASS** — No structural regressions introduced. Karpathy mode-3 risk specifically checked and found absent. Inherited deferred items remain deferred per iter3 scope contract; no new structural High findings.
