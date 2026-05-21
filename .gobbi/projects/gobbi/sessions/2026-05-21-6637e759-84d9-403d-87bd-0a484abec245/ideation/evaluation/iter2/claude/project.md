# Ideation iter2 — Project perspective (claude)

## Artifact Summary + Memory reads

**What**: A 535-line iter2 Ideation rawdata draft replacing iter1 (408 lines). Adds an explicit deltas block (lines 7-16) calling out the iter2 changes — H-1/H-2/H-3/H-4 + M-1/M-2/M-3 + L-1. Preserves the 15 locks verbatim from iter1; adds 2 iter2-round user answers (Scope Contract → Decisions Log → "iter2 round"); splits Stage E into E.1 (in-commit) + E.2 (terminal post-commit) with a concrete SHA gate; adds a narrow Stage B edit of `.claude/CLAUDE.md` lines 61-62; adds a post-merge `git branch -d <sweep-branch>` step in Stage G; adds `-mindepth 1` to the `find -empty -delete` in Stage F; explicitly names `2026-05-21-c676684d-...` in Stage E.1's delete-set.

**Why**: REVISE remediation for iter1's 4 High findings (F-P-01, F-R-02, F-S-01/F-U-01, F-OV-01) plus 4 Medium/Low surgical fixes (F-C-01, F-C-02, F-S-02, F-P-03).

**How**: Surgical edits to the iter1 narrative plus a new Stage E split with a two-condition SHA gate. All preserved must-preserves from iter1 overall.md are still in place (verified item-by-item in iter2 Decisions Log → Preserve list, lines 500-510).

**Memory reads**
- `draft-iter1.md` (full) and `draft-iter2.md` (full)
- iter1 evaluator files at `<session-dir>/ideation/evaluation/iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md` (all 8)
- `discussion-log.md` (full — 15 user locks; the 2 iter2-round answers are NOT in this log but are asserted in the brief)
- `.claude/CLAUDE.md` lines 61-62 (verified the two design table rows still exist pre-edit)
- `.gobbi/projects/gobbi/mistakes/{executor-rationalized-failing-verification-gate,session-dir-naming-convention-uses-date-prefix,manager-mispec-grep-c-for-occurrence-count}.md` (frontmatter only)
- Repo state: `git status --short`, `git worktree list`, `git merge-base --is-ancestor` for all 4 branches (confirmed: fix-257 + refactor-257 are ancestors of develop; pr-fin-2 + redesign-v050 are not), `git rev-parse 487fc35`, `ls .gobbi/projects/gobbi/sessions/` (54 dirs), `cat staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`

## Locked Frame (Stage 1) — iter2 inheritance + new gaps

**Inherited from iter1/claude/project.md:**

- F-P-01 (High/100, open at iter1) — `.claude/CLAUDE.md:61-62` dangling-link risk.
- F-P-02 (Medium/75, open at iter1) — "Steel-man is a do-less, not a true do-nothing."
- F-P-03 (Medium/100, open at iter1) — Second date-prefixed session dir `c676684d-...` not named in delete-set.

**Inherited scenario gaps:** S-PROJ-NEW-1 (inventory completeness), S-PROJ-NEW-2 (cross-ref validity), S-PROJ-NEW-3 (`c676684d-` named in delete set).

**New gaps surfaced at iter2:**

- **S-PROJ-NEW-4** (adversarial): "The iter2-round user answers (the 'fix citations, don't expand survivor set' lock + the E.1/E.2 split lock) are reflected verbatim in the audit trail." Required by Iron Law 4 (scope is a contract) + Decisions Log traceability.
- **S-PROJ-NEW-5** (adversarial): "The Decisions Log's iter2 § AskUserQuestion outcomes documents these 2 new locks alongside the original 15; the discussion-log.md is updated accordingly."

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Root cause + framed problem unchanged | Iter2 inherits cleanly | YES | Lines 116-145 identical in shape to iter1 lines 102-130 |
| Scope Contract sharp enough | Out-of-Scope updated to acknowledge H-1 carveout | YES | Line 62 explicitly states "Note: `.claude/CLAUDE.md` is now in scope under H-1..." |
| F-P-01 (CLAUDE.md links) remediation | Stage B has explicit `.claude/CLAUDE.md` edit step | YES — line 253-254 plus In-Scope line 40 | Verified iter2 Stage B: line 253 `git rm ...` then "(iter2 H-1) Edit `.claude/CLAUDE.md`: remove lines 61-62". Post-edit verification command at line 253 + Success #12 at line 105 |
| F-P-03 (`c676684d-` naming) remediation | Explicit name in delete-set | YES — line 282 | Stage E.1 line 282 explicitly bullets `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/` |
| F-P-02 (steel-man) remediation | True "do-nothing" articulated | **NO** — same wording as iter1 | Lines 137-138 identical to iter1's counterfactual block. The "do less" critique is not addressed |
| **S-PROJ-NEW-4** (iter2 user-answer audit trail) | iter2 round answers documented inside iter2 draft | YES | Lines 469-478 explicitly enumerate the 2 iter2-round answers verbatim |
| **S-PROJ-NEW-5** (discussion-log.md updated) | Same answers landed in discussion-log | **NO** — see F-P-04 |

## Typed findings

### F-P-01 — Re-judged as `addressed`

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: High
- **Evidence**: iter2 line 40 ("iter2 H-1 — Edit `.claude/CLAUDE.md` to remove lines 61-62"), line 62 (Out-of-Scope updated with carveout), lines 253-254 (Stage B step + post-edit verification), Scope Contract Success #12 (line 105: post-sweep grep returns empty), D2 #16 (line 358), D10 (lines 426-430). Pre-edit `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` empirically returns 2 hits (verified by this evaluator at iter2 authoring time — lines 61-62 still present in the working tree, which is correct since the sweep has not yet executed).
- **Resolution**: surgical 2-line excision is in-scope, sequenced in Stage B (same commit as the rest of Stage B), with a concrete grep-empty post-condition. Honors user lock "fix citations, don't expand survivor set."

### F-P-02 — Re-judged as `open` (NOT addressed)

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: iter2 Framed Problem § Counterfactual / steel-man (lines 137-138) is verbatim from iter1 lines 122-124. The genuine "no reset at all, live with the debt" counterfactual is still not articulated. iter2 acknowledges no remediation here — F-P-02 was not in the manager's iter2 brief (only the 4 High + 4 Medium/Low surgical fixes were tasked).
- **Why it matters**: Unchanged from iter1. Per Iron Law 1 (think before acting) the artifact retains a "feature absorbed by Q-F" framing rather than a genuine adversarial counterfactual. Medium severity, not a verdict driver.
- **Suggested direction**: optional — iter3 or rebuild-session can add a one-paragraph "no-reset counterfactual" with concrete pain estimate.

### F-P-03 — Re-judged as `addressed`

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: iter2 line 282 (Stage E.1 explicit bullet `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/`); iter2 I5 (lines 174-178) explicitly identifies it as "the PRIOR session that promoted today's three project mistakes"; deltas block line 16 (M-3) cites this.
- **Resolution**: surgical naming addition; mistake-file provenance dangling is consciously acknowledged in I5 (lines 178) and tied back to the H-2 trade-off.

### F-P-04 — `discussion-log.md` is not updated with the 2 iter2-round user answers (NEW)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: `tail -120 .../ideation/rawdata/discussion-log.md` shows the log ends with the 15-lock summary table from rounds 1/2/3a/3b. No iter2 round entry exists. The iter2 draft (lines 467-478) records the 2 new locks inside the draft's Decisions Log, but per the canonical Decisions Log shape ("AskUserQuestion outcomes — Verbatim in the manager's brief... reproduced as Decisions Locked above"), the source of truth is the discussion-log, not the draft. iter2 draft's claim "All 15 verbatim in `discussion-log.md`" (line 465) is correct *for the 15*, but the 2 iter2-round answers are only in the draft, not the log.
- **Why it matters**: Per Iron Law 8 (every implementation change reflected in documentation), the audit trail for the user's iter2-round decisions lives only in the draft, not in the dedicated AskUserQuestion log. A future read of the discussion-log alone (e.g., during Wrap-up reconstruction) would not surface that the user accepted the H-2 trade-off or the E.1/E.2 split. Low severity because the iter2 draft is itself preserved (in the surviving session dir).
- **Suggested direction**: append a "## 2026-05-21 iter2 round" section to `discussion-log.md` capturing the 2 user answers verbatim, parallel to the existing "Round 1 / Round 2 / Round 3a / Round 3b" entries. Not a verdict driver.

### F-P-05 — Counterfactual section unchanged but trade-off rationale strengthened (cross-cutting clarification)

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open (informational)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: iter2's Decisions Log iter2-round § entry (line 472) supplies fresh rationale for the H-2 mistake-file deletion trade-off ("iter2 evaluator findings already absorbed their lessons; the iter2 draft applies those lessons via H-3 SHA gate / D2 / M-3"). That's a strong rationale and matches Iron Law 10 (witness-bound). But the iter1 F-P-02 steel-man critique remains structurally unaddressed in the Counterfactual block at lines 137-138.
- **Why it matters**: Informational; the audit trail is split across two locations (Counterfactual block + Decisions Log iter2 round). Not a blocker.

## Low-confidence appendix

- (25) — Scope Contract `final-iter:` field still present (line 28) — F-A-02 from iter1/aesthetics. Out of scope for Project perspective.

## Must-preserve list

- The 15-decision enumeration in Scope Contract → Decisions Locked is preserved verbatim (lines 70-90).
- Branch ancestry verification (I2) matches `git merge-base --is-ancestor` ground truth exactly (verified fresh by this evaluator).
- The mixed `git rm` vs `rm -rf` discipline per item is preserved in Stage B/C/E.
- iter2 H-1 surgical edit is the right level: 2-line excision only, no broader CLAUDE.md changes (honors Iron Law 4 — scope is a contract).
- iter2 explicit acknowledgement of the c676684d → mistake-files dangling-frontmatter chain (line 178) is intellectually honest about the trade-off.

## Verdict

PASS — F-P-01 addressed (was the iter1 High/100 driver); F-P-03 addressed. F-P-02 carried open at Medium/75 (below High≥50 REVISE threshold from this perspective alone; was not in the iter2 brief). F-P-04 new but Low/100. No High≥50 open findings → PASS.
