---
name: merging-two-seed-bullets-narrows-broader-scope
description: Consolidating two seed sub-bullets into one check silently narrowed the broader bullet's scope, losing coverage of the cases only the broad bullet covered
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-09
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [docs-sync]
keywords: [seed-faithfulness, merge, scope-narrowing, consolidation]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [over-scrub-drops-idea-level-seed-condition, usage-context-check-narrowed-to-inputs-only]
---

# Merging two seed bullets narrowed the broader bullet's scope

## What happened

When re-framing the preparation evaluation seed into scenario / checklist families, two seed sub-bullets under one scenario were consolidated into a single check. The two bullets were "A missing skill is not listed in both sections" (narrow) and "Each gap is categorized in exactly one sub-step section" (broad — covers memory-readiness and design-reference gaps, not just skills). The merged `PREP-CONS-SCENARIO-01-CHECK-03` was keyed on "each missing skill", so it inherited the NARROW subject and silently dropped the broad bullet's wider scope: a non-skill readiness gap dual-filed across both sub-step sections would pass. The scenario's Good half said "skill" while its Bad half already said "a gap", so the two halves also disagreed on scope. The dual-system evaluation (Codex, High/100) caught the narrowing.

## Why it happens

When merging bullets, the writer takes the more concrete / first-read bullet's subject as the merged check's subject and treats the second bullet as a restatement. But when one bullet is a SPECIAL CASE of the other (skill ⊂ readiness gap), the special-case subject silently narrows the union scope. The merge reads complete because the narrow case is the most salient example, so the lost breadth is not obvious.

## Correct approach

When merging seed bullets into one check, the merged check MUST carry the UNION / broadest scope of the bullets it replaces — name the general subject and, where useful, enumerate the special cases in parentheses ("each readiness gap (missing skill, memory, or design-reference item)"). Keep the scenario Good half, Bad half, and the checklist check scope-consistent. This is the same seed-faithfulness-via-consolidation family as [[over-scrub-drops-idea-level-seed-condition]] — both lose seed coverage when several seed sub-conditions are folded into one line.

## How to detect

Two seed bullets under one scenario where one subject is a subset of the other (e.g. "skill" ⊂ "gap", "external call" ⊂ "operation"). A merged check that uses the special-case (narrower) subject. And/or a scenario whose Good and Bad halves name different scopes for the same condition (Bad says "gap", Good says "skill") — that internal disagreement is the tell that a merge narrowed one half.

## Related

- [[over-scrub-drops-idea-level-seed-condition]] — sibling consolidation-loss trap (a scrubbed keyword dropped a sub-dimension); this one narrowed a merged bullet's scope
- [[usage-context-check-narrowed-to-inputs-only]] — same family, a later witness (three context dimensions narrowed to one)
</content>
