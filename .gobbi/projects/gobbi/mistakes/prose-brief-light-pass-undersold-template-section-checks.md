---
name: prose-brief-light-pass-undersold-template-section-checks
description: A prose-wave brief that calls for a "light pass" without requiring per-doc body-section checks against each type's template leads the executor to trust surface appearance, letting references and scenarios body-section gaps slip through to REVISE.
type: decisions
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, docs-conformance, prose-wave, executor-brief]
supersedes: null
superseded_by: null
decision_status: accepted
domain: process
---

# Prose-wave brief "light pass" framing undersells per-doc template-section checks

## Context

During execution task P1 (features/agents prose conformance), the brief told the executor that "most docs already conform — apply a light pass" and instructed it not to churn conforming docs. Iter 1 (commit `999a403`) correctly reshaped the two deviating design docs to ADR shape and de-crypted session coordinates throughout. However, it skipped per-doc body-section checks against each type's template for docs it deemed already-shaped. References docs (4 files) were missing the required body `## Related` section; the scenario doc was missing body `**Category:**` / `**Coverage:**` / `## Related`; the shared-executor discussion was missing `## Related`. These gaps slipped through to a dual-system REVISE.

## Decision

Record this framing as a mistake-candidate. Every future prose-wave brief MUST instruct the executor to perform an explicit per-doc check of each document's body against its type template's complete required-section list — not just "does it look shaped."

## Rationale

**What went wrong:** the P1 prose brief called for a light pass and discouraged churning conforming docs. This led the executor to skip explicit per-doc body-section checks against each type's template. Docs with clean-looking `##` headings were treated as conformant without verifying against the template's full required-section list.

**Why:** "looks conformant at a glance" (correct frontmatter, visible `##` sections in roughly the right order) is not the same as "matches the type template's complete required-section list." References docs had `related:` frontmatter, which appeared conformant. But the references template requires a body `## Related` section between `## Insight` and `## Why it applies` — frontmatter alone is not a substitute. A brief that de-emphasizes per-doc template-section verification creates the condition for the executor to trust surface appearance.

**How to recognize:** any prose/conformance brief that uses language such as "light pass," "don't touch conforming docs," or "only fix deviating docs" without also requiring an explicit per-doc check against each type template's full required-section list. Also: references or scenario docs that have the right frontmatter fields (`related:`, `category:`) but whose body sections have not been verified against the template — frontmatter keys and body sections are separate contracts.

**Corrected approach:** every prose-wave brief MUST include an instruction equivalent to: "For every doc in scope, verify the body against the complete required-section list in its type template — not just whether sections are present at a glance. Specifically: references docs require a body `## Related` section between `## Insight` and `## Why it applies` (frontmatter `related:` alone is not sufficient); scenario docs require body `**Category:**` and `**Coverage:**` fields before `## Situation` and a `## Related` section; discussions docs require a body `## Related` section. Do not skip this check for docs that appear shaped — the gap is invisible without template comparison." Link to related mistakes: `[[evaluator-false-pass-without-diffing]]` and `[[conformance-executor-pre-executed-prose-wave-reshape]]`.

## Alternatives considered

- Accept it as a one-off executor error, not a brief-design mistake. Rejected: the brief's "light pass" framing directly invited skipping the per-doc template check; the error is structural, not accidental.
- Add a template-section checklist to the conformance rules. Addressed: the templates already define the required body sections; the fix is in how briefs reference and mandate those templates, not in changing the templates themselves.

## Consequences

- Future prose-wave briefs must include explicit per-doc template-section verification instructions naming the specific sections each type requires.
- The mistake-candidate should be promoted to `features/project-memory/mistakes/` (feature-scoped, since it is specific to prose-wave execution under this feature).

## Related

- `mistakes/conformance-executor-pre-executed-prose-wave-reshape.md` — related: executor treating a prose-wave as already-completed and skipping reshape
- `mistakes/evaluator-false-pass-without-diffing.md` — related: evaluator granting PASS without diffing, similar surface-appearance trust failure
- `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md` — the plan that chartered P1
- `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P1-agents-prose/evaluation/iter1/claude/findings.md` — the REVISE that surfaced these gaps
- `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P1-agents-prose/evaluation/iter1/codex/findings.md` — corroborating REVISE
