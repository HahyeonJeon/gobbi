# Consistency — iter3

**Perspective:** Consistency
**Verdict:** PASS

## Stage 1 inheritance

- iter1 F-CONS-1 (T3 "line 241 (second sentence)" wording) — `addressed (carried)`. Confirmed in T3 `what:`, T3 `pre-resolved-decisions:`, T3 `success-criteria:`, T3 `risk-rationale:`, and §5 P-R1.

## Stage 2 — naming + cross-reference checks

- **`workflow.chat.tasks[]` term.** Used identically in T3 (line 399), T5 (lines 327-328, 332), §4 #6 (lines 548-549), §6 G-row references. No drift.
- **`per-task slice` term.** T1 success-criteria + §5 P-R2 + T1 verification (`grep -c 'per-task slice'`). Identical phrasing across.
- **`PRE_T4_REV` / `PRE_T5_REV` symbol family.** 14 hits, used identically across T4 (lines 271, 275-280), T5 (lines 323, 330, 332), §5 P-R8 (line 576), §6 G4 row (line 603), §5 self-review (line 656).
- **`Fn=/Mn=` variable naming.** T1→F1/M1, T2→F2/M2, T3→F3F/M3 (note F3F to avoid colliding with "Finding F3" prose convention used in iter3's §3 head), T4→F4, T5→F5_STATE/F5_SESSION, T6→OLD_CHAT/OLD_AUTO/ARCHIVE_DIR, T7→F7. Internally consistent within each task block.
- **`develop..HEAD` baseline.** §4 #7 and #8 use `develop..HEAD` (lines 552, 555). The single `main..HEAD` mention (§4 preamble line 520) is the F7-correction note explaining the change. No residual `main..HEAD` in commands.
- **G5 FLAG-2 NOTE.** Identical prose, identical `(G5)` tag, identical placement (immediately above YAML fence) for T1/T2/T3/T4/T5. T6 + T7 lack the note — correct, those tasks do not list `claude` in any pre-G5 form.
- **Disposition table.** 15 rows in §6; each iter1 F-finding (F1-F8) and each iter2 G-finding (G1-G6) is enumerated with anchor pointer. Appendix items grouped into three "acknowledged" rows. Consistent with Stage-1 inheritance discipline.

## Findings

None.

## Must-preserve

- `F3F` naming choice — don't rename to `F3` in a future iteration without scanning for the prose-convention collision first.

Verdict: **PASS**.
