---
name: conformance-first-then-prose
description: User chose conformance-first sequence for the retrofit waves (mechanical conformance wave before prose-quality wave).
type: discussions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [sequence, conformance, prose, wave-based]
loop: ideation
outcome: Write the standard; then retrofit in waves — mechanical conformance wave first, then prose-quality wave.
---

# Scope sequencing — conformance-first then prose

## Context

After locking the three-tier scope, the leader proposed a conformance-first sequencing to de-risk
the large retrofit: do the mechanical, verifiable frontmatter normalization before the subjective
prose rewrite. The question was whether to accept this reframe.

## Question

Accept the conformance-first reframe / prose-first / standard-only.

## Options considered

- **Conformance-first (recommended):** write the standard → mechanical conformance wave (frontmatter
  normalization + staging-key strip + body de-crypt) → prose-quality wave. Each wave verifiable.
- **Prose-first:** start with prose rewrite immediately. Risk: harder to verify progress; mixes
  structural and quality changes.
- **Standard-only:** write the standard but defer all retrofit. Risk: standard exists but no docs
  conform to it.

## User decision

"Standard + conformance-first, then prose."

## Implication

- Locked Decision 1: write standard → retrofit in waves; conformance wave (mechanical) FIRST,
  then prose wave, then the light tier-3 nav wave.
- The conformance wave absorbs the existing backlog
  `backlogs/feature-dir-frontmatter-full-normalization.md` (Locked Decision 7).
- Each wave is verified with a grep command before the next begins (Locked Decision 3).

## Related

- `ideation/rawdata/discussion-log.md` Q5 (scope sequencing)
- `ideation/artifacts/scope-contract.md` §Decisions Locked (1, 3, 7)
