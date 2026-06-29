---
name: o1-blanket-acceptance-overreach
description: Draft attributes O-1 (A/B scenarios inline) disposition to "blanket user acceptance" but O-1 was not one of the 7 enumerated dispositions in the discussion log.
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [o1, scenarios, blanket-acceptance, authority-attribution, preparation]
author: claude
supersedes: null
---

# O-1 Blanket Acceptance Overreach

## Context

The Preparation iter3 draft (lines 55 and 130) says that Observation O-1 — "A/B scenarios inline rather than per-file" — is "covered by the user's blanket 2026-06-28 acceptance." However, O-1 is NOT one of the 7 dispositions enumerated in `discussion-log.md`. The discussion-log lists 7 specific named gaps and their dispositions; O-1 (a leader classification that A/B scenarios are content of `review.md`, not a memory-staging gap) was not separately surfaced as an enumerated item. The same draft concedes: "O-1 was not a separately-enumerated gap."

## Decision

Accept this as a Low precision nit. The substance is correct: O-1 is not a real staging gap (the one true `scenario_gap` PROJ-1 IS staged; A1-A6/B1-B6 are doc content, not memory artifacts). The attribution to "blanket acceptance" is technically imprecise — but the conclusion (no staging write needed for O-1) is right regardless of whether the user explicitly named it.

## Rationale

The draft is self-mitigating: it acknowledges O-1 "was not a separately-enumerated gap" and explains why it is a leader classification, not a true staging gap. The `scenario_gap` finding PROJ-1 IS properly staged at `features/coding/scenarios/process/8-seed-depth-parity-risk.md`. No actual staging miss exists. The error is an over-attribution of user lock to an item the user never saw named.

## Alternatives considered

Remove the "covered by blanket acceptance" phrasing and instead say "O-1 is a leader determination (A/B scenarios are doc content, not staging gaps) and requires no disposition." This would be more precise. Not fixed in iter3 because the iter3 scope was restricted to the Codex High/100 authority fix; the O-1 phrasing is a Low precision point below REVISE threshold.

## Consequences

The authority attribution for O-1 is slightly overreached. A reader who checks the discussion-log against the draft's claimed "blanket acceptance" will see O-1 is absent from the log and might doubt whether O-1 was handled. The draft's own concession ("not a separately-enumerated gap") and its explanation (leader classification) are the correct mitigating text. Future readiness drafts should not attribute leader classifications to user lock unless the user explicitly confirmed them.
