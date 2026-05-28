# Usage Perspective — T3 conform git-workflow (commit 2d01316)

## Frame
Can a zero-context reader (future agent / the user) open these 20 docs cold and understand them? Are the de-crypted refs self-contained (probe 5: spot-check 3-4)? Does the `## Source` footer give a usable provenance path?

## Verified (own commands) — spot-checked self-containment
1. **decisions/2026-05-24-rollback-semantics-drift-from-ideation.md**: "Ideation iter3 draft line 283 (T1-I-T1.j)" → "The Ideation rollback contract (T1-I-T1.j and Design Decision D-3, 'Partial-failure rollback')". Reader now learns WHAT the contract requires (git rm before AskUserQuestion) without the line-coord. Self-contained. ✓
2. **decisions/2026-05-24-session-commit-storage-bounds.md**: "iter1/iter2/iter3 Codex Performance finding COD-PERF-002" → "Each loop's MEMORIZATION phase ends with a git commit (Design Decision D-4)… No formal storage budget was locked during Ideation." Subject + estimate stated in own words. ✓
3. **decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md**: "Codex T02 iter1 flagged F-PROJ-01 (High/100)" → "During Execution of Task 02 (memorization moment-of-capture), the Codex evaluator raised a High-severity finding". Reader follows without resolving F-PROJ-01. ✓
4. **discussions/worktree-first-vs-collapsing-strategies.md**: cryptic `discussion-id: CP-1-3-beta`/`sub-step: A-round-2` dropped; body is clean Question/Answer/Impact prose naming worktree-first vs two-surface vs symlink. ✓
- **`## Source` footer**: every de-crypted doc points at `…/sessions/<date>-<ssid>/…/` — a resolvable canonical provenance path for a reader who wants full detail. Matches §4.3 (single `## Source` footer permitted).

## Findings

### USAGE-1 — workflow-phase-doc-set body still requires session context in parts
- **Type**: checklist_gap · **Domain**: docs-sync · **Disposition**: open · **Confidence**: 85 · **Severity**: Low
- **Evidence**: `design/workflow-phase-doc-set-for-per-iter-cadence.md` Scope/Scenarios/Excluded sections retain `T1-I-T1.f`, `G-1`, `E-1`, `iter2` (see CONS-1). A reader meets these labels without resolution.
- **Why it matters**: Marginal — surrounding prose explains each (e.g., line 81 states the substance "contains 7 files, not 5" so `iter1`/`iter2` are narrative-historical, not load-bearing). Reader can still extract the deliverable (the 5-file set + the 2-file exclusion rationale). This is a §4.3-advisory residue, not a hard-gate failure; full prose rewrite is plan-DEFERRED.
- **Suggested direction**: Roll into the deferred P-series rewrite. No T3 re-work needed.

## Must-preserve
- Self-contained, zero-context-readable bodies on the decisions + discussions docs and most design docs; usable `## Source` footers.

VERDICT: PASS
