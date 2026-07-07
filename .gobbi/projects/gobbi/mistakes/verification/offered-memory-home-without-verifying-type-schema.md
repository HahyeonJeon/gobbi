---
name: offered-memory-home-without-verifying-type-schema
description: Before offering the user a memory home/area (or naming one in a plan), verify it is valid for that memory type's schema — reviews route by kind (area == review_kind), so an invented sub-collection name fails the validator.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [process, verification, memory]
keywords: [type-schema, area-allowlist, review-kind]
author: claude
priority: medium
domain: process
---

# Offered a memory home without verifying the type's schema

## What happened
At session start the manager offered `reviews/skill-agent-review/` as the review-doc home and the user chose it. The `reviews` memory type routes by the KIND axis — its area allowlist IS the `review_kind` enum (`code-review`, `adversarial-review`, …) — so `skill-agent-review` is not a valid area. The wrap-up `validate-frontmatter.sh` (fail-closed) would have bounced it; the promotion assistant caught it and blocked, forcing a mid-wrap-up re-route to the kind-axis dirs.

## Why it happens
The manager proposed a memory home without checking the target memory type's area/naming schema. `reviews/{free-form-name}/` looked plausible, but reviews-type uses area == kind, not an arbitrary collection name. The schema was knowable up front (memory/rules.md + memory-vocabulary.json) but not checked before offering the option.

## Correct approach
Before offering a memory home/area, verify it against the type's schema: the area allowlist in `memory-vocabulary.json` and the type's rules in `memory/rules.md`. For `reviews`, area MUST be a `review_kind`. Offer only schema-valid homes; if a genuinely new area is wanted, flag up front that it needs an Always-Ask `memory-vocabulary.json` edit and may break a type invariant (e.g. reviews area == kind). Relates to [[clean-verdict-unreliable-without-edge-case-stress]] and the verify-don't-assume family.

## How to detect
Any time the manager offers the user a memory home/area — or names one in a plan or delegation brief — for a typed memory artifact (reviews, reports, mistakes, decisions, notes, …), especially a free-form-looking sub-collection.

## Related
- [[clean-verdict-unreliable-without-edge-case-stress]] — sibling verify-don't-assume discipline from this session
