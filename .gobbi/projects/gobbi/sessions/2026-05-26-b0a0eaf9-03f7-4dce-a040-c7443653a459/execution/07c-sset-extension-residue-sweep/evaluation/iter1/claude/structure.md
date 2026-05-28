# Structure Perspective — T7c (commit 5630aa4)

**Evaluator:** Claude (adversarial).

## What structure must hold
1. Every deleted line is a frontmatter key, never body prose.
2. Base 9-key schema intact on swept docs; legit type-extensions intact.
3. rules.md change localized to §4.4/§4.5; §1-3 + rest of §4 untouched.

## Verification
- **No body touched:** `git show 5630aa4 --unified=0 -- ':!*memorization/rules.md'` → ZERO added lines (`+`); all `-` lines are `key: value` frontmatter. Filtering out residue keys leaves ZERO non-residue deletions. Pure frontmatter-line deletion. **PASS**
- **Base schema intact (3 spot-checks):**
  - `install-runtime/design/tool-use-id-correlation-key.md` → 9 base keys + `design-id` (legit §2.2). **PASS**
  - `install-runtime/decisions/session-start-hook-script-decisions.md` → base + `verdict` + `session-id`. **PASS**
  - `install-runtime/discussions/scope-contract-lock.md` → base + `discussion-id` + `phase`/`sub-step`/`loop-iter`. **PASS** (base intact; non-S siblings retained — see Consistency)
- **rules.md locality:** hunks at @@216, @@237, @@246, @@254 — all inside §4.4 (residue table + KEEP + safety invariant) and §4.5 (gate comment + regex). §1-3 and the §4 head are untouched. **PASS**

## Findings
None at Structure. Schema integrity preserved; deletions are surgical and frontmatter-only.

## Must-preserve
- The frontmatter-only deletion discipline — no body churn.

VERDICT: PASS
