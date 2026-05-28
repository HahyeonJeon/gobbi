# Project perspective — T6 conform install-runtime (4 subdirs)

**Target:** commit 9f8562c — conform 24 docs in features/install-runtime/{discussions,design,decisions,changelogs} to §4 dev-doc standard.
**Contract:** §4 of memorization rules.md (added be43c43; reconciled a258f4b) + T6 executor draft scope (3 ops: 9 base keys, S-strip both spellings, inline coord de-crypt). T6 = those 4 subdirs only (T7 does the rest).

## What the brief asked for
Conform the 4 subdirs to §4: 9 base frontmatter keys, strip illegitimate staging keys (§4.4/§4.5), de-crypt load-bearing inline session coordinates (§4.3), without reshaping bodies or losing content.

## Verified against the contract
- **9 base keys on all 24 docs** — PASS. Tooled check (awk-extracted frontmatter, grep each key) = 0 missing.
- **§4.5 leak gate over 24 docs** — PASS. Zero leaks. The 6 before-files (1 hyphen `promoted-from/at`, 5 underscore `promoted_from/at`) all cleared. Underscore spellings specifically confirmed caught.
- **type normalization** — PASS. 3 `decisions-log` files (pre-planning-readiness, session-start-hook-script, task-decomposition) → `decisions`. Sensible per §2.1 enum (decisions-log is not an enum value; decisions is).
- **No content lost** — PASS. Body-line delta ≤0 on 4 files; every reduction is a coordinate-substitution (e.g. 4 iter-path bullets → 2 descriptive bullets), not narrative deletion. Verified by reading each negative-delta diff.

## Finding

### F-PROJ-1 — §4.1 positive bar not met: titles/section headings retain session coordinates
- **Type:** design_flaw · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 90 · **Severity:** Medium
- **Evidence:** After 9f8562c, H1 titles still lead with session coords that §4.1 forbids ("# Title states the concept, not a session coordinate"):
  `# T1 Decisions Log` (session-start-hook-script-decisions.md:17), `# T04 — ...` (2026-05-25-gobbi-hook-authoring-skill-shipped.md:15), `# T3 dual hook registration ...` (dual-hook-registration-confirm.md:18), `# T3 mechanism — ...` (hook-plus-reconstructor-mechanism.md:18), `# T3 schema gap check ...` (scope-contract-lock.md:18), `# D-3-3 — ...` (dual-hook-registration-resolver.md:16). Section headings `## Dual-system EVAL iter1` (session-start-hook-script-decisions.md:24) and `## Post-iter3 manager polish` (task-decomposition-decisions.md:53) also carry iteration coords. Residual finding-IDs `F-OVERALL-01` and `F-CONS-04` survive in body prose.
- **Why it matters:** §4.1 defines the deliverable's *positive bar* — a zero-context reader meets a concept-first title. Leading a doc with `T1`/`T04`/`D-3-3` is the exact "trapped" pattern §1.3/§4.1 names. The conformance is frontmatter-complete but the body-prose half of §4 (§4.1 title rule + §4.3 load-bearing-coord rule) is only partially delivered.
- **Suggested direction (not a prescription):** confirm with the user whether title/heading de-crypt is in T6's scope; if so, re-decrypt titles + the two iter-headings to concept-first form (the T5 sibling pass already does this).

## Verdict
The mechanical conformance (frontmatter, S-strip, scope, type) is complete and correct. The §4.1/§4.3 body-prose conformance is incomplete at the title/heading layer. Whether that blocks acceptance depends on T6 scope (see consistency.md — T5 sibling met the bar; overall.md adjudicates).

VERDICT: REVISE
