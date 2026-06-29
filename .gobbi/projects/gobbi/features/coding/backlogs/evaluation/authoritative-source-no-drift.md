---
name: authoritative-source-no-drift
description: Deferred risk — authoritative-source rule between review.md and evaluation.md has no automated drift-detection
type: backlogs
scope: feature
feature: coding
status: open
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, evaluation]
keywords: [authoritative-source, drift-detection, review-md, evaluation-md, CONSIST-2]
author: claude
priority: low
project-scope: false
supersedes: null
superseded_by: null
shipped_in: null
---

# Accept deferred risk: review.md / evaluation.md docs-sync has no drift-detection

## Context

`skills/coding/review.md` and `skills/coding/evaluation.md` both derive their underlying rules from `skills/coding/SKILL.md`. The authoritative-source rule states: if the two docs ever diverge on a shared check, `coding/SKILL.md` is authoritative and both docs are reconciled to it. However, there is no automated mechanism to detect when prose in `review.md` and `evaluation.md` drifts apart. The check that they are currently consistent was performed manually during review. Claude evaluator iter1 F-CONSIST-1 surfaced this as `assumption_risk/docs-sync/Low/50`.

## Decision

Accept the risk for now. Do not add drift-detection in this task. The docs-sync gap between `review.md` and `evaluation.md` is a deferred follow-up item.

## Rationale

- Severity is Low / Confidence 50. No immediate user impact; this is a future maintainability concern.
- The authoritative-source rule already assigns resolution priority to `coding/SKILL.md` in case of divergence — there is a stated owner, no ambiguity.
- Drift-detection (automated cross-doc consistency checks) is out of scope for this task; the scope contract covers only authoring `review.md`.
- User-accepted in Ideation (CONSIST-2 residual carried from Ideation evaluation).

## Alternatives considered

- Add a manual reconciliation checklist to `review.md` or `evaluation.md` — rejected as in-scope creep for this task; surfaced as a backlog item instead.
- Run a grep-based diff check on shared points at Wrap-up — not a durable mechanism; deferred to the coding-wiring campaign when the docs are formally linked.

## Consequences

- Future maintainers editing either `review.md` or `evaluation.md` must manually verify consistency with `coding/SKILL.md` and with each other.
- When the coding-wiring campaign ships (Load Directives, evaluation-phase integration), the reconciliation step should include a docs-sync check.
- This risk should be re-evaluated when the wiring ships or when a divergence is found.
