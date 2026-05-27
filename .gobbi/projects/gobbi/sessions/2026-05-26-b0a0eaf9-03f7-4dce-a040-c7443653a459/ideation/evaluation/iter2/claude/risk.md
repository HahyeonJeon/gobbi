# Risk — Ideation eval (iter2, claude)

## Frame
Rollback, blast radius, irreversible-step gating, never-delete/never-strip-valid-field discipline, #272 merge risk, OOS file touches.

## iter1 finding closure (re-run, not trusted)
- **R-2 (grep gate false-positive-strips legitimate frontmatter) → CLOSED.** This was the load-bearing High/Critical-class risk (= Codex F1/95). iter2 adds Design "D6 — FIX-1" (lines 167-187): an explicit file-selection predicate P, an illegitimate-key set S, a CONDITIONAL `disposition` membership (in S only when NOT under backlogs/), and a locked safety invariant "never strip a key legitimate for that doc's type/dir." Grounding re-verified: rules.md §2.2 line 110 declares `disposition: open|deferred` legitimate on backlogs/; §2.3 line 122 strips it only "when used purely as eval routing." The Out-of-Scope list (line 48) now forbids the strip, the grep-gate checklist item (line 146) mandates the predicate, and a dedicated "Edge (legitimate-key backlog)" scenario (line 133) names the witness file. I confirmed the witness `features/git-workflow/backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md` carries BOTH `disposition: open` AND `finding-id`/`severity`/`confidence` — a blanket strip WOULD corrupt it; the predicate provably prevents that.
- **R-1 (#272 merge-back reconciliation unstated) → CLOSED.** Checklist line 148 + F5 crosswalk (line 259) flag that P13 + 13-type taxonomy + re-home exist only on the #272 branch until merge, mandate keeping the rules.md edit additive to minimize conflict surface, and name the merge-back-to-develop reconciliation a Planning/handoff item.

## Per-check results
- Rollback: YES — all doc rewrites under git; `git revert`. No schema/data migration.
- Blast radius: bounded to 208 P_live docs + the rules.md additive section + (new) two AGENTS.md narrative edits. archive/ excluded.
- Never-delete (S4/S8): YES — D9 reclassify-to-notes, anchored to `design-literal-retire-instruction-without-replacement`. iter2 extends the discipline to never-strip-a-legitimate-key (INT-4 line 120, FIX-1 safety invariant) — exemplary.
- OOS file touches: the AGENTS.md edits are NEW touch-targets (see Project PR-1); risk is low (additive count fix), reversible, and motivated by a real verified drift.

## Typed findings
(none new — both iter1 Risk findings closed; the FIX-1 never-strip invariant directly neutralizes the R-2 blast radius)

## Per-perspective verdict: PASS
The single highest-severity iter1 risk (false-positive strip of valid backlog frontmatter) is closed with a locked predicate + safety invariant, grounded in rules.md and witnessed by a real file. Merge-back risk flagged.
