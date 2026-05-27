# Evaluation — Project Perspective (Claude) — T9c iter1

**Target:** commit `14041db` — conform 28 project-tier-remainder docs to dev-doc standard §4.
**Method:** adversarial diff-read of `14041db` against parent `82a5137`; own verification commands; reports not trusted.

## Contract recap
T9c = `{references,reviews,rules,plans,mistakes}/*.md` (maxdepth 1) + `features/README.md` + `README.md`. 28 files. Add 9 base keys, strip S-set, de-crypt 2 titles, §4.5 gate = 0, preserve all KEEP keys + bodies.

## Gate results
- **§4.5 gate over T9c scope:** 0 leaks. Verified per-file at `14041db` and across full `P_live` tree (HEAD). No `mistake-candidate`/`finding-id`/`severity`/`confidence`/`promoted-*`/`loop`/`iter`/`slug`/`task`/`session-id`/`surfaced-by`/`addressed-in`/`finding-type` survive in any T9c frontmatter. Conditional `disposition` leak check on non-backlogs: 0.
- **9 base keys:** all 28 files carry `name`/`description`/`type`/`scope`/`feature`/`status`/`created`/`session`/`tags`. Verified programmatically — zero missing.
- **scope/feature:** `scope: project` on all 28 (correct). `feature` non-null only where feature-bound (10 mistakes carry a real feature slug; task explicitly permits feature-bound mistakes). No `scope: feature` mis-set on a project doc, no wrong feature slug observed — EXCEPT `features/README.md` (see finding PROJ-1).
- **Scope (paths):** only T9c paths touched. Zero out-of-scope file edits.

## Findings

### PROJ-1 — `features/README.md` carries `scope: feature` with `feature: null` (internal contract inconsistency)
- **Type:** design_flaw · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 75 · **Severity:** Low
- **Evidence:** `14041db:.gobbi/projects/gobbi/features/README.md` frontmatter: `scope: feature` + `feature: null`. `memorization/rules.md` §2.1: "feature: required when scope=feature ... null when scope=project". §3 structure rule: a feature README "carries base frontmatter with `scope: feature` + `feature: {own-slug}` (self-referential)".
- **Why it matters:** the `features/` directory *index/registry root* is not itself a feature, so it has no own-slug — yet it was stamped `scope: feature`. Per the §2.1 contract this is an inconsistent pair (scope=feature demands a non-null feature). Either it should be `scope: project` (it is the registry index, a project-tier pointer doc like the other READMEs which were all stamped `scope: project`) or it needs a self-slug. The sibling `mistakes/README.md`, `plans/README.md`, `references/README.md`, `reviews/README.md`, `README.md` were all stamped `scope: project` — `features/README.md` is the lone divergent one.
- **Suggested direction:** user decides — most likely `scope: project` + `feature: null` to match the other registry-root READMEs, since this placeholder is not a feature identity document. (Not prescriptive.)

### PROJ-2 — `features/README.md` typed `type: features` while sibling registry READMEs typed `type: notes`
- **Type:** general · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 50 · **Severity:** Low
- **Evidence:** `features/README.md` → `type: features`; `mistakes/README.md`/`plans/README.md`/`references/README.md`/`reviews/README.md` → `type: notes`; root `README.md` → `type: notes`. All six are one-line "Placeholder — populated post-reset" stubs.
- **Why it matters:** `type: features` is reserved for a feature's identity README (`features/{slug}/README.md`), not the registry index. Stamping the index `type: features` is arguably a type-confusion (P13 type-purity); the four other directory-index READMEs chose `type: notes`. This is a judgment call — the registry root could legitimately be argued either way — hence Confidence 50.
- **Suggested direction:** align with the sibling READMEs (`type: notes`) OR document why the features index uniquely deserves `type: features`. User decides.

## Verdict reasoning
No Critical/High project-perspective defects. The conformance is mechanically correct: gate 0, all base keys present, scope clean, only T9c paths touched. The two findings are Low-severity consistency nits on the `features/README.md` placeholder. Project perspective: PASS.

VERDICT: PASS
