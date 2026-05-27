---
loop: ideation
iter: 2
artifact_type: scope-contract
created_at: 2026-05-26
status: final
supersedes: []
related:
  - ideation/artifacts/idea.md
  - ideation/rawdata/draft-iter2.md
---

# Scope Contract — dev-doc-level project-memory standard

## Project / Feature / Task

- **Project:** gobbi
- **Feature:** project-memory
- **Task:** Author a dev-doc-level memory standard and retrofit live docs in waves
  (conformance first, then prose). Builds on PR #272 branch; merge deferred.

## In-Scope

**Tier 1 — Standard + content rewrite (PRIMARY; Q4 priority 1):**
- A dev-doc-level standard added as a NEW section inside `memorization/rules.md`
  (canonical: `.gobbi/projects/gobbi/skills/memorization/rules.md`).
- Conformance wave (wave 1, mechanical): type-aware frontmatter base-schema normalization
  + FIX-1 type-aware allowlist strip of illegitimate staging-routing keys + de-crypt
  cryptic session-internal coordinates from doc bodies. Absorbs backlog
  `backlogs/feature-dir-frontmatter-full-normalization.md`.
- Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar.

**Tier 2 — skills/principles (Q4 priority 2 "optional, not mandatory"):**
- IN-SCOPE only as the minimal mechanical grep gate extended to `features/` — a
  verification command, NOT a behavior change. Heavier enforcement (dedicated eval
  perspective, full Principle-13 encoding) is DEFERRED.

**Tier 3 — organization & navigation (Q4 priority 3):**
- IN-SCOPE as a light final wave (tertiary priority): verify each feature `README.md`'s
  Subdirectories section lists the subdirs that actually exist; optionally add a top-level
  index pointer. Runs LAST; must not block tier-1.

## Out-of-Scope

- Re-homing memory docs or re-litigating PR #272's 7-capability re-home + naming standard.
- Big-bang single-pass rewrite of all docs.
- Heavy self-enforcement: a new evaluation perspective or full Principle-13 encoding
  (deferred — see backlog `evaluation-perspective-for-dev-doc-quality`).
- Frozen `archive/` docs — excluded from the standard, the retrofit, and the grep gate.
- Stripping `disposition` from `backlogs/` files, or any frontmatter key that is legitimate
  for that doc's type/dir (FIX-1 safety invariant).

## Decisions Locked

1. **Sequence:** write standard → retrofit in waves; conformance wave (mechanical) FIRST,
   then prose wave, then the light tier-3 nav wave (Principle 3, de-risked).
2. **Taxonomy:** keep gobbi's locked 13 memory doc types; import Diátaxis type-purity as
   PROSE guidance only — no re-home.
3. **Rollout:** wave-based, conformance first, each wave verified before the next.
4. **Enforcement (minimal):** at most a mechanical, type-aware grep gate extended to
   `features/`; no Principle-13 surgery / new eval perspective unless trivially warranted.
5. **Standard's home:** new section inside `memorization/rules.md` (canonical path).
6. **Narrative content:** reclassify mislabeled session-journal docs to `notes/`; NEVER delete.
7. **Backlog absorption:** fold `backlogs/feature-dir-frontmatter-full-normalization.md`
   into conformance wave 1.
8. **Scope edge:** EXCLUDE frozen `archive/` docs from standard, retrofit, and gate.

## Success Criteria

1. A written dev-doc-quality standard exists that an evaluator can score a memory doc
   against (objective checklist, not vibes).
2. (recomputed against HEAD d2b5b37, type-aware) Frontmatter conformance is measurable
   with a stated, type-aware target: 100% of P_live_all (208 files) carry the full base
   schema (baseline: 50 / 208 conformant today); and 0 illegitimate staging-key leaks
   outside `archive/` where "leak" is defined type-aware (baseline: 59 leak files under
   FIX-1 predicate). The "0 leaks" target EXCLUDES legitimately-placed keys — e.g.
   `disposition` on `backlogs/` (27 legitimate files under P_live, not stripped).
3. Every doc TYPE has a required intra-doc section contract (what sections, in what order,
   what each holds).
4. The standard leads with POSITIVE guidance + good/bad examples (per the naming-standard
   mistake), not prohibitions only.

## Deferred

- Heavier self-enforcement — a dedicated dev-doc-quality evaluation perspective and/or a
  full Principle-13 quality-facet encoding — deferred to backlog
  `staging/backlogs/project/evaluation-perspective-for-dev-doc-quality.md`.
  Witness: AskUserQuestion #8 (F3 enforcement depth: "avoid unnecessary change").
