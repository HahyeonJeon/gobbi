---
name: 8-seed-depth-parity-split
description: Split combined taxonomy points #3 and #6 into sub-points (3a/3b, 6a/6b) with full depth parity for each seed
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [design, process]
keywords: [taxonomy, depth-parity, sub-points, seed-coverage, 8-seeds]
author: claude
supersedes: null
---

# Decision: split combined taxonomy points into sub-points with full depth parity for all 8 seeds

## Context

iter1 Claude finding `PROJ-1` (scenario_gap/process, Med/50) identified that combining seeds 1+2 into point #3 and seeds 5+8 into point #6 in the taxonomy reduced depth for each sub-seed. The concern: a combined point might give the general claim without giving each seed its own check, signal table, and false-positive — collapsing 8 seeds into 6 points instead of ensuring depth parity.

iter1 Claude finding `AES-1` (general/process, Low/50) reinforced this from an aesthetics angle: the presentation should make depth parity legible, not buried in combined point names.

## Decision

Combined taxonomy points #3 (naming) and #6 (file/dir/import) are each split into **two explicit sub-points with full depth parity**:

**Point #3 Naming & vocabulary (seeds 1+2):**
- `3a. Naming consistency (seed 1)`: same concept → same name; no overloaded name for different concepts. Own Check, own Signals row, own false-positive.
- `3b. Naming quality / industry-consensus terms (seed 2)`: prefer the domain's established term; intention-revealing; least astonishment. Own Check, own Signals row, own false-positive.

**Point #6 File, directory & import structure (seeds 5+8):**
- `6a. Import consistency (seed 5)`: grouped/ordered imports at module top; no wildcard; type-only imports separated (TS). Own Check, own Signals row, own false-positive.
- `6b. File & directory structure (seed 8)`: new files where a reader would look; conventional entry points. Own Check, own Signals row, own false-positive.

**Depth parity requirement**: each sub-point must carry the full per-point authoring shape:
- Check (what the reviewer inspects for this sub-concern specifically)
- Why (why it matters + principle trace)
- Signals table (property-led: General | Python | TypeScript)
- Finding mapping (likely Type + Domain; when it blocks)
- False positive to avoid (the over-eager rejection specific to this sub-concern)

8-seed coverage map with depth parity: seed 1→#3a, seed 2→#3b, seed 3→#2, seed 4→#4, seed 5→#6a, seed 6→#11, seed 7→#5, seed 8→#6b.

## Rationale

Depth parity was a user-side concern (seeds are first-class requirements, not afterthoughts). A combined point that gives 3a and 3b their own full authoring shape satisfies this without expanding the total point count (staying at 13 top-level points with #3 and #6 each having two sub-points). The alternative — splitting into 15 points — would change the taxonomy structure without clear benefit.

## Alternatives considered

- **Leave as combined with a note**: Rejected. "Depth parity" is only achieved if each sub-concern has its own Check/Signals/False-positive — a note does not enforce this in Execution.
- **Split to 15 top-level points**: Rejected. The user's 13-point breadth base is preserved; sub-points within #3 and #6 are the right granularity.

## Consequences

- Implementation Checklist item 1 enforces: each combined point's sub-seeds get their own Check, Signals row, and false-positive.
- The taxonomy design in `design/review-md-points-taxonomy.md` reflects the 3a/3b and 6a/6b structure.
- Execution authors know to write two sub-checks within #3 and #6, not one combined paragraph.
