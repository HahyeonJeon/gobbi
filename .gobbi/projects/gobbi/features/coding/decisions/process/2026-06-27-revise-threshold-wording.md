---
name: revise-threshold-wording
description: Fix REVISE outcome wording — threshold is High-severity with Confidence>=50, not "High-confidence issue" (conflation of Severity and Confidence fields)
type: decisions
scope: feature
feature: coding
status: proposed
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process, validation]
keywords: [REVISE, severity, confidence, threshold, schema-precision, verdict-wording]
author: claude
supersedes: null
---

# Decision: fix REVISE outcome wording — severity threshold not confidence label (codex-aesthetics-003)

## Context

iter2 Codex finding `codex-aesthetics-003` (design_flaw/process, Low/100, open): the review outcomes summary in the design doc states `REVISE` means ">=1 High-confidence issue requires a change." The immediately adjacent threshold statement correctly says: REVISE = High severity with Confidence >= 50.

The wording "High-confidence issue" conflates Confidence (the 0–100 scale) with Severity (Critical/High/Medium/Low). The canonical threshold is High **Severity** + Confidence >= 50 — not High Confidence. While the correct threshold appears one line above the summary, the summary's loose wording could mislead a reader who reads only the outcome description.

Finding confidence is 100 (concrete evidence of wrong text) but severity is Low (context sufficient for correction; unlikely to mislead if Phase 5 remains adjacent).

## Decision

**Status: proposed** — Low/100 finding; not a blocker. The correction is clear and precise.

**Proposed fix in `review.md` Review Outcomes section:**

| Verdict | Correct canonical statement |
|---|---|
| FAIL | Critical finding with Confidence >= 75 (or explicitly marked Critical by the manager) |
| REVISE | >=1 High-**severity** finding with Confidence >= 50 |
| PASS | Only Medium/Low severity findings |

The word "confidence" must not appear as the threshold descriptor for REVISE — only "severity" is the threshold field. Confidence is an orthogonal scale that must be >= 50 for a High-severity finding to trigger REVISE, but the trigger is the Severity field, not a high Confidence score.

## Rationale

Schema precision is required because `review.md` teaches the canonical finding schema and verdict thresholds to practitioners. A one-field confusion in the outcomes table would propagate: practitioners filling out finding fields would mix up Severity and Confidence. The mistake is minor in a side-by-side reading (the correct statement is adjacent) but non-trivial in isolation.

## Alternatives considered

- **Leave as-is (context sufficient)**: The Codex evaluator accepted this as Low severity. Acceptable if the outcomes table always appears adjacent to the Phase 5 threshold table.
- **Add parenthetical to clarify**: E.g., "High-severity issue (Confidence >= 50)" — a one-word fix.

## Consequences

- If accepted: the Review Outcomes section in `review.md` states the canonical threshold precisely.
- If deferred: a Low/100 wording ambiguity persists in the outcomes summary; not a blocker.
