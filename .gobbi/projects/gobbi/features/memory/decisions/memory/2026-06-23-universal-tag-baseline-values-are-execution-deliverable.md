---
name: universal-tag-baseline-values-are-execution-deliverable
description: Codex COD2-OVERALL-2 (High): exact universal tag baseline values are WS-A A-8/A-9 Execution deliverables, not Ideation artifacts. Accepted.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [universal-tag-baseline, execution-criteria, codex-finding, altitude, COD2-OVERALL-2]
author: claude
supersedes: null
superseded_by: null
---

# Universal tag baseline values are Execution deliverables (COD2-OVERALL-2)

## Context

Codex iter2 evaluation (COD2-OVERALL-2, checklist_gap, High, Confidence 100) found that draft-iter2.md promises "every project inherits a universal tag baseline" but no line enumerates the baseline values. Codex flagged this as blocking implementation and testing for minimal projects.

The user honored PASS (Claude=PASS / Codex=FAIL), reclassifying this as an altitude finding: the Ideation design locks the DIRECTION (universal tag baseline exists, parallel to Q2's universal area base; its values are enumerated in WS-A A-8). The exact values are determined by examining gobbi's current tag set and filtering for genuinely domain-agnostic tags — an Execution activity (WS-A A-8/A-9).

## Decision

COD2-OVERALL-2 is an accepted/deferred Execution acceptance criterion, not an Ideation defect.

**Execution acceptance criteria (WS-A A-8/A-9):**
- Enumerate the universal tag baseline: the subset of gobbi's current tag vocabulary (rules.md:292-300) that is genuinely domain-agnostic (usable by any project: CLI tool, web app, gobbi).
- Declare gobbi's own tags = universal baseline + gobbi project-specific additions.
- The combined project config must include the universal baseline + project additions as separate declared sections so inheritance is explicit.
- Validation: the non-gobbi golden scenario uses only universal tags and passes the tag gate.

## Rationale

Ideation locks: (a) universal baseline EXISTS (Q6 decision), (b) it is inherited by every project (parallel to Q2 universal area base), (c) the mechanism (config-as-data, same combined config as areas). The exact VALUES require walking the current tag set and applying the domain-agnostic test — this is Execution work. Doing it at Ideation would require materializing a full tag enumeration before Planning verifies the approach.

## Alternatives considered

- Enumerate baseline now: requires walking rules.md:292-300 and applying a domain-agnostic filter — Execution-level work that prematurely commits to specific values before Planning scope review.
- Remove the universal baseline promise: weakens the Q6 design (a project with no config should still get useful defaults).

## Consequences

WS-A A-8/A-9 must explicitly enumerate the universal tag baseline as the first deliverable of the tag de-hardcoding workstream. The Preparation loop should verify the tag vocabulary at rules.md:292-300 is still current. Planning must include A-8/A-9 as explicit tasks.

## Related

- [[universal-base-layer]] — the area-side of the same two-tier model
- [[tag-area-map-combined-config]] — the combined config that holds the tag baseline
