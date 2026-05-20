# Project Perspective — Batch 4 iter2 (Claude)

## Stage 0 — Fix verification

All 11 iter2 fix landings verified via grep (see briefing's verification queries). Notable for Project perspective:

- **Fix 3 (mistake bootstrap)** — `gobbi/SKILL.md` lines 45, 47, 174-179, 227 cohere: six core skills enumerated, mistake-promotion two-layer model present, Constraints line 227 says "principles + orchestration + discussion + delegation + git + mistake."
- **Fix 7 (mistake-promotion two layers)** — Layer 1 (in-session staging during MEMORIZATION → Wrap-up promotes to `mistakes/`) and Layer 2 (`gobbi mistake promote` cross-session) are explicit and distinct. Closes iter1 P-P-02 partial concern.
- **Fix 8 (Glossary)** — gobbi/SKILL.md line 15 adds 8-row Glossary (Phase / Loop / Sub-phase / Iter / Verdict / Disposition / Staging / Sole-writer). Closes the O-O-01 cross-perspective convergence finding and partially addresses P-P-02 discoverability.
- **Fix 10 (sanitization)** — line 72 blockquote at the `{project-name}` interpolation site routes to `packages/cli/src/lib/config/settings-io.ts`. Closes R-R-02-style concerns for Project too.

No partial-sweep regressions found in skill tree: grep for "5 skills | 6 skills | five skills | six skills" returns exactly one in-tree hit ("These six skills give the manager the floor to operate" at line 47) — consistent.

## Inheritance from iter1

iter1 Project verdict was PASS with 3 in-scope findings (1 Medium, 2 Low):

| Finding | iter1 severity | iter2 disposition |
|---|---|---|
| P-P-01 sparse-check predicate incomplete | Medium | **Persists** — gobbi/SKILL.md line 100 still uses the `README.md missing OR design/ empty OR features/ empty` check. The Fix-8 Glossary does not address this. Re-asserted at Low (downgraded from Medium because the briefing remediation suggested "pick one and document" — neither was done, but it is genuinely a low-frequency edge case for a solo-user system). |
| P-P-02 AI-Provenance discoverability | Low | **Addressed** — Glossary anchors the vocabulary; Fix 7's mistake-promotion section sits adjacent and surfaces git/conventions.md trailers via the broader docs flow. |
| P-P-03 Witness rule inconsistency | Low | **Persists** — no explicit Witness trailer added; iter2 did not target this. Re-asserted at Low. |

## New findings (iter2-introduced)

None. Fix 8's Glossary, Fix 10's sanitization blockquote, and Fix 7's two-layer mistake-promotion are clean additions without regressions.

## Typed findings (iter2)

### P-P-01 (carryover) — Sparse-check predicate covers 3 of 14 project-memory dirs

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open (persisted from iter1)
- **Confidence**: 60
- **Severity**: Low (downgraded from iter1 Medium — solo-user system, low frequency, not a correctness blocker)
- **Evidence**: gobbi/SKILL.md line 100: `README.md missing OR design/ empty OR features/ empty` — but the canonical project-memory shape spans 14 directories (line 219). A project with populated README/design/features but empty `mistakes/` or `rules/` skips the interview offer silently. The iter1 remediation ("pick one and document") was not applied — the predicate is unchanged.
- **Remediation**: Add a one-line rationale to line 100: "(README + design + features are the sparse-proxy: if those exist, Ideation ran at least once)." Or expand the predicate. Either closes the gap.

### P-P-03 (carryover) — Witness rule lacks explicit trailer or cross-cite

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open (persisted from iter1)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Principle 10's witness rule is not surfaced in git/conventions.md's trailer table. No `Witness:` trailer; the witness function is presumed to ride on `Closes/Refs/Fixes`. iter2 did not target this.
- **Remediation**: Same as iter1 — either add an explicit `Witness:` trailer to conventions.md or note that `Closes/Refs/Fixes` satisfies Principle 10. Pick one.

## Low-confidence appendix

- **L-P-01 (confidence 25)** — Glossary row "Sole-writer" defines Wrap-up's MEMORIZATION as the only writer to project memory but notes "Interview is the documented bootstrap exception." A pedantic reader might want an explicit listing of all documented exceptions (currently just Interview). Low confidence — the exception set is small and the singular phrasing reads fine.

## Verdict

**PASS** — Fix 7, 8, and 10 land cleanly. Two iter1 Low/Medium findings persist as carryovers (P-P-01 sparse-check, P-P-03 witness trailer) but neither is a Project-perspective blocker for the entry-tier skills. No new findings. The Project perspective converges PASS in iter2.
