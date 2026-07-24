---
name: pacing-regex-residual-formulation-gaps
description: The iter3-widened T9 pacing candidate regex still misses several plausible pacing formulations; by design, mitigated by MC-T9's manual sweep
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, docs-sync]
keywords: [pacing-candidate-regex, mc-t9, concept-sweep, necessary-not-sufficient, f3-proj-02]
author: claude
supersedes: null
superseded_by: null
related: [prep-deferred-constraints-wired-into-plan]
---

# Accept the iter3 pacing candidate regex as necessary-not-sufficient, mitigated by manual sweep

## Context

Finding `F3-PROJ-02` (Planning iter3 evaluation, Project perspective, `assumption_risk`/`docs-sync`,
Confidence 50, Severity Low, disposition `open`). The T9 pacing candidate regex was widened at iter3 to reach
the locked `topics.md:38` site (17 hits, resolving the prior High `F2-PROJ-01`/`F3-PROJ-01`). An adversarial
probe against 17 hand-written pacing lines showed the widened regex still MISSES several plausible pacing
reintroduction forms: "Keep each branch to a maximum of four questions", "Limit yourself to at most 3 prompts",
"Restrict follow-ups to two per parent", "Ask a single question at a time", "One axis at a time", "Cap the
interview at 20 turns". It correctly HITS the six locked forms plus "per turn"/"per branch" and spelled ranges.

## Decision

Accept the residual gap as-is — no plan change. A hypothetical FUTURE pacing reintroduction in one of the missed
forms would pass the mechanical T9 regex sweep, but the Plan already frames that sweep as
necessary-not-sufficient and routes completeness to `MC-T9` step 5's manual concept/synonym sweep, which the
iter2 evaluator independently endorsed as the correct shape (iter2 Must-preserve #4: "widen the candidate set,
never re-add a polarity filter"). No task adds more regex alternatives as a Planning-time fix.

## Rationale

- **A polarity/coverage regex cannot be complete by construction.** The pacing-removal obligation (`IP-2`,
  Success Criterion 2 — "no pacing rule … source or grading layer") is a natural-language-classification
  problem, not a fixed-pattern-matching one; every prior fix round in this Plan (iter1 → iter2 → iter3) widened
  the SAME regex's candidate set without ever claiming completeness — the design choice is intentionally
  "mechanical gate proves coverage of the KNOWN set; the human MC-T9 sweep catches the unknown set", per
  `completeness-model-is-a-build-time-gate` and `sweep-must-grep-synonymous-phrasings-not-just-primary`.
- **The mitigation already exists and is load-bearing, not aspirational.** `MC-T9` (§ the plan's manual
  predicate for T9) is explicitly non-sample-based and is the plan's stated acceptance authority for exactly
  this class of semantic gap — not a future task, an existing one in the nine-task spine.
- **Widening the regex further at Planning time would not close the class.** Any finite regex enumeration is
  provably incomplete against natural-language pacing phrasing; the fix is a process control (the manual sweep),
  not a bigger pattern.

## Alternatives considered

- **Add more candidate alternatives to the regex now** (the finding's own suggested direction: "at most",
  "maximum of", "up to N", "restrict to") — considered but NOT required: this only shrinks the manual-sweep
  surface, it does not close the class, and Planning has no user directive to expand scope for a Low/50 finding
  that is already design-mitigated. Left as an optional Execution-time judgment call for the T9 executor, not a
  Planning-mandated task change.
- **Re-open the pacing task (T2/T9) as REVISE to author a "more complete" regex** — rejected: this Plan already
  went through two REVISE rounds fixing this exact gate (F2-PROJ-01 → F3-PROJ-01), and a third round chasing
  regex completeness would repeat the same unwinnable pattern-matching problem the design deliberately routes to
  a human sweep instead.

## Consequences

Execution's T9 executor MUST NOT treat a clean T9 pacing-regex run as sufficient completion evidence for the
whole-bundle pacing sweep — `MC-T9` step 5's manual concept/synonym sweep is the actual acceptance authority and
MUST be run in full, non-sampled, over all six migrated files. If T9 discovers the manual sweep catches a
pacing formulation the regex misses, that is the sweep working as designed, not a plan defect.

## Related

- [[prep-deferred-constraints-wired-into-plan]] — the sibling forward-looking decision staged alongside this one
