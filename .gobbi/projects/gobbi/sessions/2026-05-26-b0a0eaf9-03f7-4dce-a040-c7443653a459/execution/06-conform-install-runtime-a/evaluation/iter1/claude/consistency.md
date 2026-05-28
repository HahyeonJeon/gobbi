# Consistency perspective — T6 conform install-runtime

Lens: is T6 internally consistent, consistent with §4, and consistent with sibling campaign tasks (T5/T4/T3)?

## Checks
- **Internal consistency (24 docs)** — PASS. Uniform 9-key block, uniform type-per-subdir, uniform S-strip. No file treated differently from its peers within a subdir.
- **Commit-message ↔ artifact consistency** — PARTIAL FAIL (see F-CONS-1). The commit message item (3) claims "T0X task codes, W3-TX sprint task codes ... all replaced" and "COD-* finding IDs replaced with descriptive" — but `T1`/`T3`/`T04` survive in titles+headings and `F-OVERALL-01`/`F-CONS-04` survive in bodies.
- **Cross-task consistency vs T5 (sibling, 8e6ae25)** — DIVERGENT (see F-CONS-1). This is the load-bearing comparison.

## Finding

### F-CONS-1 — T6 title/heading de-crypt diverges from the T5 sibling standard + overclaims completeness
- **Type:** checklist_gap · **Domain:** consistency · **Disposition:** open · **Confidence:** 90 · **Severity:** High
- **Evidence:**
  - T5 (guardrails, 8e6ae25) produced fully concept-first titles: `# Goodhart risk: agents[] population metric becomes target...`, `# Cross-layer drift gate — ...`, `# Claude Code lifecycle events for hooks`. ZERO `T#`/`iter#`/`Decisions Log` leading coordinates; T5 body-heading scan = clean.
  - T6 left `# T1 Decisions Log`, `# T04 —`, `# T3 dual hook registration`, `# T3 mechanism`, `# T3 schema gap check`, `# D-3-3 —`, plus `## Dual-system EVAL iter1` / `## Post-iter3 manager polish`.
  - Both tasks conform the SAME campaign to the SAME §4 standard in the SAME session. T6's commit message item (3) claims comprehensive task-code/finding-ID replacement, but the artifact retains them at the title/heading/some-body layer.
- **Why it matters:** two sibling passes of one campaign now hold docs to two different bars — T5 docs are concept-first, T6 docs are not. A drift detector or a future maintainer sees inconsistent dev-doc quality across install-runtime vs guardrails. Compounding it, the commit message asserts a completeness the diff does not support (Iron Law 7 — completion claim outruns evidence). High because the inconsistency is campaign-wide and the claim is verifiable-false at the title layer.
- **Suggested direction:** align T6 to the T5 bar (de-crypt titles + the two iter-headings) OR, if the user rules title de-crypt out of scope for BOTH, retro-document that T5 over-delivered and T6 is the intended floor — and correct the T6 commit-message completeness claim either way.

## Note on scope ambiguity (honest calibration)
T6's own executor draft (operation 3) enumerated only specific *inline body anchor codes* (CP-D-1, T3-I-T3.X, D-3-X cross-refs), NOT titles. Read narrowly, titles were never in T6's self-defined scope. Read against §4.1 + the T5 precedent, they were. This is a genuine scope-boundary question for the user — flagged, not unilaterally resolved.

VERDICT: REVISE
