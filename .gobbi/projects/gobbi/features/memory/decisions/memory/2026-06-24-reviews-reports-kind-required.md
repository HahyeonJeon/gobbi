---
name: reviews-reports-kind-required
description: review_kind and report_type are REQUIRED extension fields; area resolves from the kind value; tag-fallback maps dropped.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, schema, validation]
keywords: [review_kind, report_type, kind-required, area-axis, reviews, reports]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Make `review_kind` and `report_type` REQUIRED; resolve area from kind value; drop tag-fallback maps

## Context

The memory rules §2.2 previously listed `review_kind` (reviews) and `report_type` (reports) as optional extension fields. The area-selection logic for reviews and reports used a thin tag-fallback map as a secondary path. This left ambiguity: without a required kind, a record with only generic tags could silently reach a different area than one with an explicit kind, and the tag-fallback maps had no-route gaps (reviews pool tags like `process`/`git`/`memory` did not route via the fallback map). The iter1 evaluators (both Claude F-U1/Codex USE-1) flagged "required-ish" as an unresolved contract.

## Decision

`review_kind` (reviews) and `report_type` (reports) are REQUIRED extension fields (L16). Because the kind is always present, the area ALWAYS resolves from the kind value via the explicit-area path (selection-rule step 1 — `area:` override). No tag-fallback map exists for reviews or reports; `tagAreaMap.reviews` and `tagAreaMap.reports` are absent from `memory-vocabulary.json`. The area set for each type equals its kind enum, so every valid kind is a valid area by construction. `other` is added to `REPORT_TYPE_ENUM` (L7) as the kind catch-all for reports (parity with reviews, which already had `other`).

## Rationale

Making kind required removes the ambiguous case. When kind is always present, the area always resolves cleanly from it. The tag-fallback maps were thin (reviews pool tags like `process`/`git` did not route anywhere via the fallback) and unnecessary once kind is required. Dropping them reduces the risk of a "dead fallback" silently mis-routing a record. This is the simplest correct approach: required field → always resolves → no fallback needed.

## Alternatives considered

1. **Keep kind optional + keep tag-fallback map** — rejected. Leaves the "required-ish" gap; the tag-fallback maps had no-route entries that the iter1 evaluators correctly flagged as an accepted-no-match gap not called out as intentional.
2. **Kind optional, no fallback, no-match → user-decision** — rejected. The result is a frequent user-decision on any reviews/reports record without a kind, which defeats the purpose of having a kind field at all. Making kind required is more direct.

## Consequences

- `rules.md §2.2` Required-vs-optional extensions (line 210) adds `reviews → review_kind` + `reports → report_type`.
- `rules.md §2.2` extension table rows for reviews (224) and reports (225) mark `review_kind`/`report_type` **(required)**.
- `rules.md §2.2` `report_type` enum (line 239) gains `other`.
- `validate-frontmatter.sh` `required_ext_for` gains `reviews) echo "review_kind"` and `reports) echo "report_type"`.
- `validate-frontmatter.sh` `REPORT_TYPE_ENUM` gains `other`.
- `memory-vocabulary.json` has no `tagAreaMap.reviews` or `tagAreaMap.reports` entry.
- `reviews.md` and `reports.md` templates show kind fields as REQUIRED.
- Any reviews or reports record that omits the kind field is a validator failure.
