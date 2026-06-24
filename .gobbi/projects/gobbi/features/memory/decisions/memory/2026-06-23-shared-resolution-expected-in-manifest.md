---
name: shared-resolution-expected-in-manifest
description: Q5 claim "no obvious-home file forced to _shared" is optimistic; one flat mistake deterministically resolves to _shared. Accepted.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [_shared, Q5-validation, manifest, process-dissolved]
author: claude
supersedes: null
superseded_by: null
---

# _shared resolution expected in manifest (F-C3/F-R3)

## Context

Q5 validation method (draft-iter2.md:138) claims the WS-B B-1 manifest resolves every currently-flat gobbi file "with no ... obvious-home file forced to `_shared`." However, `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md` (tags: `[process, mistake-discipline, artifact-correction]`) has no match in the trap-class priority map (`process` dissolved; `mistake-discipline` and `artifact-correction` are unmapped) and deterministically resolves to `_shared`. This is the correct outcome per the selection rule, but it contradicts the Q5 validation claim.

## Decision

Accept as a low-priority consistency gap. The `_shared` resolution for that one file is CORRECT and expected per `rules.md:136` (the no-match terminal). Acknowledge in B-1/Q5 during Execution that process-only mistakes correctly resolve to `_shared` post-dissolution; this is not a dry-run failure.

## Rationale

Low severity (Consistency+Risk/Low per evaluation). The Q5 design itself is sound — only the validation method's wording is optimistic. The Executor must note in the manifest that this is an expected `_shared` case, not a gap in the area design.

## Alternatives considered

- Add `mistake-discipline` to the trap-class priority map: this would be an area invention to avoid `_shared`, which rules.md:136 explicitly guards against.
- Leave the Q5 wording as-is: risks a confused Executor treating the `_shared` resolution as a dry-run failure.

## Consequences

Executor annotates the B-1 manifest row for `staging-a-mistake-candidate-does-not-fix-the-artifact.md` as expected `_shared`. The Q5 validation method wording should be relaxed: "no file needs an undeclared area, and legitimate `_shared` resolutions are expected."

## Related

- [[project-defined-vocab-config-as-data]] — the config design
- [[mistakes-trap-class-axis]] — the trap-class axis that causes this resolution
