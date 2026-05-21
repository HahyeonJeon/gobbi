# Ideation iter2 — Consistency perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Consistency-specific: cross-checked iter2 Scope Contract claims (lines 31-67), Implementation Checklist bullets (lines 225-316), Success Criteria (lines 93-105), and D2 verification commands (lines 339-360). Re-ran each D2 grep mentally against the current and post-state.

## Locked Frame (Stage 1) — iter2 inheritance + new gaps

**Inherited from iter1/claude/consistency.md:**

- F-C-01 (Medium/100, open at iter1) — Success Criterion #2 internally contradicts the worktree-PR sweep model.
- F-C-02 (Medium/100, open at iter1) — D2 #5 expected output contradicts Success Criterion #5 (no post-merge sweep-branch delete).
- F-C-03 (Low/100, open at iter1) — `worktrees/` design says preserve / command says delete (same physical issue as F-S-02).
- F-C-04 (Low/50, open at iter1) — `.gitignore` cited by line numbers ("lines 9-18"), risk of staleness.

**Inherited scenario gaps:** S-CON-NEW-1 (bullets ↔ contract/success mapping), S-CON-NEW-2 (D2 commands accuracy).

**New gaps surfaced at iter2:**

- **S-CON-NEW-3**: "iter2 deltas (H-1, H-2, H-3, H-4, M-1, M-2, M-3, L-1) each map to: a Scope Contract update + an Implementation Checklist bullet + a Success Criterion / D2 / Critical Invariant entry — no orphans."

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Scope Contract / Framed / Design same problem | YES | unchanged |
| Design decisions cite real research insights | YES | D1-D10 cite I1-I10; D10 (new) cites I1b |
| Scenarios ↔ Checklist aligned | YES | S3b → CLAUDE.md edit; S6 → E.2 SHA gate; S13 → post-merge sweep-branch delete; S14 → -mindepth 1 |
| Glossary terms consistent | YES (TIGHTER) | "sweep-branch commit N" replaces iter1's ambiguous "sweep commit N" |
| External research justified-skip | YES | unchanged |
| **F-C-01 remediation: Success #2 rewrite** | "Exactly one new commit on `develop` post-merge" | YES — line 95 |
| **F-C-02 remediation: post-merge `git branch -d`** | Stage G has the step | YES — line 315 |
| **F-C-03 remediation: design ↔ command convergence** | Both say preserve `worktrees/` | YES — `-mindepth 1` applied |
| **F-C-04 remediation: cite by text not line number** | Stage D line 269 says "(Cite by text content per F-C-04)" | YES — line 269 |
| **S-CON-NEW-3** every iter2 delta is mapped end-to-end | YES — see audit below |

**iter2 deltas full traceability audit:**

| Delta | Scope Contract | Checklist | Success / D2 / Invariant |
|---|---|---|---|
| H-1 (F-P-01) | In-Scope line 40 + Out-of-Scope carveout line 62 | Stage B line 253-254 | Success #12 line 105 + D2 #16 line 358 + S3b line 210 |
| H-2 (F-R-02) | Decisions Log iter2 round line 472 | Stage C line 260 ("untracked stragglers... H-2 acknowledged") | I8 line 189 |
| H-3 (F-S-01/F-U-01) | Out-of-Scope unchanged; In-Scope line 46 references Stage E split | Stage E.1 + E.2 lines 275-297 | Critical Invariant #4 line 323 + D9 line 412-424 |
| H-4 (F-OV-01) | Decisions Log iter2 round line 473 + D8 line 410 | n/a (handoff narrative) | Deferred line 110 |
| M-1 (F-C-01) | Success #2 line 95 | Stage G line 314 | D2 #18 line 360 |
| M-2 (F-C-02) | In-Scope line 52 | Stage G line 315 | Critical Invariant #6 line 325 |
| M-3 (F-P-03) | I5 line 173-178 | Stage E.1 line 282 | n/a (operational) |
| L-1 (F-S-02) | Out-of-Scope unchanged | Stage F line 303 | Success #3 line 96 + S14 line 221 + D2 #17 line 359 |

All 8 deltas traced end-to-end. Excellent consistency.

## Typed findings

### F-C-01 — Re-judged as `addressed`

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: iter2 line 95 (Success #2): "Post-merge: `git log --oneline -2 develop` shows exactly one new commit on `develop` (the squashed PR) plus the prior `487fc35` SOP commit. The pre-merge sweep branch may carry multiple bisect-safe commits — only the post-merge develop count is the contract." iter2 line 227 preamble: "Commit labels ('sweep-branch commit N') refer to bisect-safe commits on the sweep branch; per M-1, the PR squash-merges them into ONE commit on `develop`." Renaming and clarification both applied.
- **Resolution**: the executor's mental model now distinguishes sweep-branch (multi-commit) from develop (one commit). D2 #18 confirms the post-merge expected output.

### F-C-02 — Re-judged as `addressed`

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: iter2 line 315 (Stage G): "Post-merge local cleanup: `git checkout develop && git pull && git branch -d <sweep-branch>` to remove the local sweep branch (`gh pr merge --delete-branch` handles remote only)." Critical Invariant #6 (line 325) restates. Success #5 (line 98) updated: "assumes the post-merge `git branch -d <sweep-branch>` step from M-2 has run."
- **Resolution**: the orphan-local-sweep-branch hole is filled.

### F-C-03 — Re-judged as `addressed`

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: Same physical fix as F-S-02 → `-mindepth 1`. iter2 line 303 + Success #3 unchanged. Design ↔ command now converge.

### F-C-04 — Re-judged as `addressed`

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: iter2 I6 (line 181) updated: "delete the line containing `.gobbi/projects/*/sessions/` from root `.gitignore` (cited by text content, not line number — F-C-04)." Stage D (line 269) now says "remove the line containing `.gobbi/projects/*/sessions/`. Keep `worktrees/`, `tmp/`, `settings.json` re-ignore lines. (Cite by text content per F-C-04.)" The stale "lines 9-18" anchor is gone.

### F-C-05 — D2 #15 `grep -c` audit comment is now embedded inline (NEW)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open (informational)
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: iter2 D2 #15 line 357 expanded with inline audit: "(`$` anchor + line-form output makes `grep -c` a line-count safely usable here; for occurrence counts where lines might collide, use `grep -o ... | wc -l` per `manager-mispec-grep-c-for-occurrence-count.md`.)" This is a good inline audit of the choice but mildly polite-redundant given iter2 line 496 already names `manager-mispec-grep-c` as load-bearing.
- **Why it matters**: Trivial polish; not a defect.

### F-C-06 — Success #5 grep pattern still uses ` ` between `^[* ]` and `(...)` (NEW)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: iter2 line 98 (Success #5): `git branch | grep -vE '^[* ] (main|develop)$'`. The pattern uses `[* ]` (asterisk-or-space) followed by a literal space, then the branch name. `git branch` outputs `* develop` for the current branch and `  main` for others (note the two-space prefix for non-current). So `^[* ] ` matches both `* d...` and `  m...` (the first space matched by `[* ]`, the second space matched by the literal). Pattern works. But Critical Invariant #6 says "Post-merge `git branch -d <sweep-branch>`" — what about the sweep branch's residual? Per M-2 it is deleted post-merge, so Success #5 should pass. **However**, if Success #5 is checked BEFORE M-2's `git branch -d <sweep-branch>` runs, the assertion fails. iter2 line 98 says "assumes the post-merge `git branch -d <sweep-branch>` step from M-2 has run" — caveat is explicit. Good.
- **Why it matters**: minor — caveat is in the spec; the executor will sequence M-2 before Success #5 verification.

## Low-confidence appendix

- (25) — D6 (Validation strategy summary, line 391-401) now lists 7 rows but the D-numbering enumeration in the table is non-sequential (D1, D2, D3, D4, D5, D7, D9 — D6 itself, D8, D10 missing). Cosmetic; D8/D10 are content-only rows that don't need a "validation method" entry.

## Must-preserve list

- The new "sweep-branch commit N" naming convention vs develop's single squashed commit — preserve in further iterations.
- The 8-row delta traceability matrix (above) confirms zero orphans across iter2's 8 changes — preserve this density.
- The cross-perspective consistency between F-C-01 / F-S-01 / F-U-01 (all 3 closed by the H-3 split) shows iter2 absorbed the cross-perspective signal from iter1 overall.md.

## Verdict

PASS — all 4 iter1 findings (F-C-01, F-C-02, F-C-03, F-C-04) addressed. New findings F-C-05/F-C-06 both Low. No High/Critical findings → PASS.
