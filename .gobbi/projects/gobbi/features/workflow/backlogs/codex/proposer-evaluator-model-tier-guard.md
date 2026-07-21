---
name: proposer-evaluator-model-tier-guard
description: "Consider a different model or effort tier between a draft contributor and same-system evaluator when evidence shows residual self-preference."
type: backlogs
scope: feature
feature: workflow
status: deferred
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [process, codex]
keywords: [self-preference, contributor-evaluator-independence, model-tier, dual-system-work, hardening]
author: claude
priority: low
project-scope: false
shipped_in: null
---
# Draft-contributor and evaluator model-tier guard

## Context

Dual-system WORK uses independent Claude and Codex draft contributors, reciprocal cross-review, and active-runtime synthesis. EVALUATION then uses fresh Claude and Codex evaluators over the complete creation package.

A residual same-family preference risk remains when a system evaluator reviews canonical material derived from that system's draft. Fresh process identity and complete provenance reduce the risk but do not prove it is absent.

## Why deferred

The current structural controls are stronger than the retired one-way creation topology: independent frozen drafts, reciprocal review, active-runtime synthesis, fresh evaluators, and provenance-preserving finding ledgers. A separate configurable model tier adds settings surface without current evidence of a material failure.

## When to pick up

Revisit only when evaluation evidence shows one system repeatedly over-rating canonical material traceable to its own draft after controlling for finding quality and independent peer evidence.

## Suggested approach

If evidence justifies it, allow the user to configure distinct contributor and evaluator models within the existing role settings. Preserve two independent drafts, two reciprocal reviews, and two fresh complete evaluations. A tier change must never remove a system or reduce perspective coverage.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-25-6cf13813-a002-4e55-96b9-a5d65f619ef8/`

## Related

- [[llm-self-preference-bias]] — the residual bias this guard would address.
