# Evaluation — Consistency Perspective (Claude)

## Frame
Does every conformed doc obey the §2 frontmatter standard uniformly, and are derived values internally consistent across the 15 docs?

## Verified
- **Base key ordering / presence:** all 15 carry the 9 base keys; per-type extensions match §2.2 (features→`value_proposition`; decisions→`supersedes`/`superseded_by`/`decision_status`; design→`supersedes`/`superseded_by`/`related`(opt); references→`title`/`source`/`accessed`/`ref_type`; changelogs→feature-subdir type). PASS.
- **type enum:** every value is in the §2.1 enum or a documented feature-subdir exception (`changelogs`, `discussions`). No `design_flaw`/`general`/`design-flaw` survive. PASS.
- **session field normalization:** several docs upgraded bare ssid to dated `session: YYYY-MM-DD-{ssid}` form (e.g., eval-pass-loop-closed, eval-fail-revise-escalation, codex-skill-structure) — but NOT uniformly: `2026-05-24-codex-iter2-blocked-aggregation.md` keeps bare `session: 1b26cf20-...` and the changelogs keep bare `a10c82d6-...`. See F-CONS-1.

## Findings
**F-CONS-1 — `session:` field format is inconsistent across the conformed set** — Type: `general` · Domain: `consistency` · Severity: Low · Confidence: 100 · Disposition: open
Evidence: dated form `session: 2026-05-23-7ea62d36-...` on 7 docs vs bare form `session: 1b26cf20-...` (`discussions/2026-05-24-codex-iter2-blocked-aggregation.md:11`) and `session: a10c82d6-...` (`README.md:9`, both changelogs). §2.1 only says "session-id that created this" without mandating the dated prefix, so neither form violates the standard — but the mixed convention within one conformance pass is a cosmetic inconsistency. Why it matters: tooling that parses `session` may need to handle both shapes. Direction: pick one shape; not blocking.

**F-CONS-2 — `decision_status: accepted` paired with base `status: deferred`** — Type: `general` · Domain: `consistency` · Severity: Low · Confidence: 75 · Disposition: open
Evidence: `decisions/constraints-body-block-convention-deferred-to-planning.md` carries `status: deferred` + `decision_status: accepted`. §2.2 status model says the type-specific field "mirrors and narrows" base status and they "never disagree." `deferred` is also not in the decisions base-status enum (`active`/`superseded`). The doc records a deferral that was later resolved, so the pairing is arguably defensible, but it reads as a mild mismatch. Why it matters: the §2.2 "never disagree" invariant is the cited rule. Direction: confirm intended terminal state (active vs deferred); low priority.

## Must-preserve
- Uniform 9-base-key surface; correct per-type extension sets.

VERDICT: PASS
