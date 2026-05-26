---
loop: ideation
iter: 2
artifact_type: design-options
created_at: 2026-05-26
status: final
supersedes: []
related:
  - ideation/artifacts/idea.md
  - ideation/artifacts/scope-contract.md
  - ideation/rawdata/draft-iter2.md
---

# Design Decisions — dev-doc-level project-memory standard

Ten locked directional decisions. Mechanism deferred to Execution. Each carries an anchored
insight and a validation method.

| # | Decision point | Chosen direction | Anchored insight | Validation method |
|---|---|---|---|---|
| D1 | Taxonomy | Keep 13 types; import Diátaxis type-purity as prose guidance only — no re-home. | EXT-1, INT-1 | Manual demo: an evaluator scores a sample doc for single-type-job; type-bleed flagged. |
| D2 | Standard's home | New section inside `memorization/rules.md` (canonical: `.gobbi/projects/gobbi/skills/memorization/rules.md`; `.claude/...` is a symlink mirror). | INT-1 | Section exists in canonical `rules.md`; `.claude/skills/...` symlink reflects it. |
| D3 | Positive quality bar | A dev-doc = a doc a zero-context reader understands end-to-end without the originating session; lead with "what good looks like" + real before/after table from this tree. | INT-3, EXT-2 | Standard contains a positive definition + before/after examples; no prohibition-only section. |
| D4 | Per-type section contract | ADR-shaped for decisions/design; What-happened/Why-it-happens/Correct-approach/How-to-detect for mistakes; Insight/Context/Why/How-to-apply/Counter-cases for learnings; the canonical notes contract (string-identical to standard §4.2 and `templates/notes.md`) is `## What happened` / `## What shipped` / `## What got stuck` / `## What shifted` / `## Decisions to respect` / `## Next session` for notes. *(reconciled 2026-05-26 per T0 iter2 dual-eval divergence — the three sources, standard §4.2, `templates/notes.md`, and this D4, now carry one canonical notes contract that merges the original D4 set (What-happened/What-shipped/Deferred/Decisions-to-respect) with the notes-template set (What-happened/What-shipped/What-got-stuck/What-shifted/Next-session); `Deferred` folds into `What got stuck`, and `mistakes` labels align to the template wording.)* | INT-2, EXT-2 | Evaluator runs the section checklist on 3 sample docs → pass/fail per item. |
| D5 | Self-contained prose | No load-bearing vanished-session coordinates in bodies; provenance → frontmatter + one optional "Source" footer. | INT-1, INT-3 | Grep-assistable: `grep -nE 'T[0-9]+-\|iter[0-9]\|draft-iter\|COD-\|row-[0-9]'` on promoted bodies returns 0. |
| D6 | Frontmatter conformance — TYPE-AWARE (FIX-1) | 100% base schema on P_live_all (208 files); 0 illegitimate staging-key leaks outside `archive/`; one spelling per key. Strip is a type-aware allowlist, NOT a blanket grep. | EXT-3, INT-5 | Type-aware grep gate (D6-predicate); target counts measured. |
| D7 | Rollout | Wave-based; mechanical conformance wave FIRST (absorbs normalization backlog), then per-type prose waves, then the light tier-3 nav wave; each wave verified. | INT-5, EXT-1 | Each wave's verification command passes before the next wave begins. |
| D8 | Enforcement depth | Minimal — at most a mechanical, type-aware grep gate extended to `features/`; no Principle-13 surgery / new eval perspective. Heavier enforcement deferred. | EXT-5 | Next-session smoke: a freshly authored doc passes the gate with no manual fix. |
| D9 | Narrative handling | Reclassify mislabeled session-journals to `notes/`; never delete; strip inline session-coords from evergreen types only. | INT-4 | Reclassified doc lands in `notes/`; no file deleted. |
| D10 | Scope edge | Exclude frozen `archive/` docs from standard, retrofit, and gate. | (scope ruling) | Grep gate and retrofit waves explicitly skip `archive/`. |

## D6 — FIX-1: the type-aware allowlist strip

**Illegitimate staging-routing key-set S:**
`S = { finding-id, confidence, severity, surfaced-by, promoted-from, promoted-at, mistake-candidate }` +
conditional member: `disposition` is in S ONLY when the file is NOT under a `backlogs/` directory.

**File-selection predicate P:**
> Operate on files in P_live (NOT under `archive/`, NOT under `sessions/`/`skills/`/`agents/`/`tmp/`).
> For each file F:
> - strip every key in `S \ {disposition}` unconditionally;
> - strip `disposition` from F only if F is NOT under a `backlogs/` directory.

**Safety invariant (locked):** never strip a key that is legitimate for that doc's type/dir.

**Legitimate-per-type frontmatter (from `rules.md` §2.2):**
- Base keys (all types): `name/description/type/scope/feature/status/created/session/tags`.
- `disposition: open|deferred` is a LEGITIMATE extension on `backlogs/` (`rules.md` §2.2 line 110).
  NOT a leak on `backlogs/`; MUST NOT be stripped there.
- `verdict`, `review_kind`, `subject` legitimate on `reviews/`; `priority`, `domain` on `mistakes/`.

**Measured baseline (HEAD d2b5b37):** under predicate P:
- 59 files carry ≥1 illegitimate key and need the strip.
- 62 files carry `disposition` total; 28 legitimate backlog files (preserved, or 27 under strict P_live);
  35 non-backlog leak candidates (stripped).
- 13 of the 59 leak files are under `backlogs/` but carry non-`disposition` illegitimate keys.

## Research Insights Summary

### Internal
- **INT-1:** `memorization/rules.md` §intro+§2.2+§2.3 covers naming/frontmatter/structure but NOT prose quality — confirms new section extends (not competes). Anchors D2.
- **INT-2:** `memorization/templates/*.md` already encode per-type section contracts for STAGING; promoted docs don't obey them. Standard promotes template contracts to a doc-quality rule. Anchors D4.
- **INT-3:** `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md` — the standard MUST lead with positive guidance + before/after examples. Anchors D3.
- **INT-4:** `mistakes/design-literal-retire-instruction-without-replacement.md` — never delete narrative; reclassify to `notes/`. Anchors D9.
- **INT-5:** `backlogs/feature-dir-frontmatter-full-normalization.md` — frontmatter retrofit already scoped and de-risked; absorb into conformance wave 1. Anchors D7.

### External (staged as reference files)
- **EXT-1:** Diátaxis — four types, two axes, "don't mix types in one doc." Anchors D1 (prose guidance) + D7 (wave approach). → `staging/references/diataxis-type-purity.md`
- **EXT-2:** ADR (Nygard) — Title/Status/Context/Decision/Consequences canonical decision-doc shape. Anchors D4. → `staging/references/adr-decision-record-shape.md`
- **EXT-3:** Frontmatter as type signatures; conformance enables filter-before-read. Anchors D6. → `staging/references/frontmatter-as-schema.md`
- **EXT-4:** Karpathy/A-Mem markdown-wiki + Zettelkasten atomicity — confirms gobbi's plain-markdown-tree shape is correct; job is to raise quality within it. Anchors D7 tier-3. → `staging/references/markdown-memory-atomicity.md`
- **EXT-5:** Docs-as-code: mechanical lint catches schema/staging-key violations; prose-quality stays an evaluation seed. Shapes D8 + Deferred backlog. → `staging/references/docs-as-code-linting.md`

## Cross-system divergence summary (iter2 — both PASS, convergent)

Both Claude and Codex evaluators reached PASS at iter2 with identical core verdicts:
- All 5 iter1 findings (F1/F2/F3/F4/F5) independently verified CLOSED by both systems.
- Both surfaced the same 2 Low findings (no disagreement):
  - **CN-1 / N1 (Consistency/Low/100):** FIX-1 disposition sub-count cross-foot — "28+35=63" uses a looser filter; under single P_live filter it is 27+35=62. Cosmetic; the 59-file leak set and the D6 predicate reproduce exactly.
  - **PR-1 / N2 (Project/Low/50-60):** AGENTS.md 12→13 edit is evaluator-recommended (Codex F4) not directly user-ratified; surface as Planning confirm/defer decision.
- Divergence: none. Both systems used the same finding-ids, same disposition assignments, same severity ratings. The sub-count discrepancy (28 vs 27) was flagged by both with identical characterization.
