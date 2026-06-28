---
name: 8-seed-depth-parity-risk
description: Scenario — a combined taxonomy point collapses seed depth; each sub-seed needs its own Check, Signals row, and false-positive
type: scenarios
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [verification, process]
keywords: [depth-parity, taxonomy, combined-points, sub-seeds, 3a-3b, 6a-6b]
author: claude
---

# Scenario: 8-seed depth parity risk

## Category

Design validation — taxonomy breadth vs. seed depth trade-off

## Coverage

**Covered** (addressed in iter2 via sub-point split).

## Situation

The taxonomy combines user seed concerns into fewer review points: seeds 1+2 → point #3 (naming); seeds 5+8 → point #6 (file/dir/imports). A practitioner using the taxonomy wants to check each seed concern with the same depth as an independent top-level point.

**Risk scenario**: a combined point collapses "naming consistency" (seed 1) and "naming quality/industry terms" (seed 2) into one paragraph with one Signal table and one false-positive. A practitioner reviewing a diff with a naming-consistency issue BUT good naming quality (or vice versa) misses one sub-concern because the combined point addresses them together.

## Inputs

- Taxonomy with combined points #3 and #6.
- A code diff where: `seed 1` (naming consistency) is violated but `seed 2` (naming quality) is fine. The reviewer reads point #3 as a single check.
- Alternatively: a code diff where `seed 8` (file/dir structure) is fine but `seed 5` (import structure) is violated. The reviewer reads point #6 as a single check.

## Expected behavior

Each seed concern has its own:
- Check (inspection target specific to that sub-concern)
- Signals table row (property-led: General | Python | TypeScript)
- False positive to avoid (specific to that sub-concern)

A reviewer can apply 3a and 3b independently, finding issues in one without triggering the other.

## Verification

- [ ] Point #3 in the finished `review.md` has two distinct sub-headings (#3a naming consistency, #3b naming quality) each with their own Check, Signals row, and false-positive.
- [ ] Point #6 in the finished `review.md` has two distinct sub-headings (#6a import consistency, #6b file/dir structure) each with their own Check, Signals row, and false-positive.
- [ ] A practitioner applying #3a to a diff with bad naming consistency but good naming quality can mark #3a as flagged and #3b as passing independently.
- [ ] Implementation Checklist item 1 enforces depth parity explicitly.
