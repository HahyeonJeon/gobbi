---
name: interview-bootstrap-exception
description: interview/ is a bootstrap exception — not a workflow loop — and is NOT swept to the flat-4-slot + number-prefix shape.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, interview, bootstrap-exception]
author: claude
supersedes: null
superseded_by: null
---

# interview/ is a bootstrap exception; its interior is not swept (R2)

## Context

The session-memory redesign touches all workflow loops: ideation, preparation, planning, execution, wrap-up. The `interview/` mode is a Socratic bootstrap that runs when project memory is empty. It has its own session shape (`interview/rawdata/`, `wave-{n}-summary.md`, a single `transcript.jsonl`) distinct from the workflow loop quartet. A Claude evaluation finding raised this as a scope ambiguity. The user confirmed R2 in the final-gate round 3.

## Decision

`interview/` is a bootstrap exception, not a workflow loop. Its interior is NOT swept to the flat-4-slot + number-prefix shape. `interview/` keeps its own bootstrap shape unchanged.

The spec doc (`orchestration/templates/session-tree.md`) explicitly notes the interview bootstrap exception so no future agent misapplies the flat-4-slot shape to it.

The doc-change map marks `interview/SKILL.md` as VERIFY-NO-CHANGE for interior shape. The only check: confirm that mentions of the session root (`sessions/.../interview/`) still resolve after D1 (`{N}-{loop}` prefix). Since `interview/` does not get a number prefix (it is not a workflow loop), its session path stays `sessions/{date}-{session-id}/interview/`.

Transcript interaction: if interview spawns sub-agents whose transcripts should accumulate in the root `transcripts/`, that is consistent with R1 (root-only `transcripts/`). Interview's own `transcript.jsonl` naming is part of its bootstrap shape and stays as-is.

## Rationale

`interview/` serves a different purpose than the 5 workflow loops — it is the one-time project setup mode (Socratic memory bootstrap), not an ongoing workflow phase. Applying the loop interior redesign to it would mean changing a working bootstrap that has no connection to the "deterministic loop scaffolding" problem. R2 keeps the scope tightly bounded.

## Alternatives considered

- Sweep `interview/` to flat-4-slot: rejected because interview is not a workflow loop, its shape is not the problem being solved, and changing it would expand scope without benefit.

## Consequences

- `interview/SKILL.md` is marked VERIFY-NO-CHANGE in the doc-change map (interior only; confirm session-root path references still resolve).
- The spec doc and the doc-change map both mark the interview bootstrap exception explicitly.
- The scaffold script does not support `0-interview` or `interview` as a `<step-dir>` argument — the fixed allowed set is `1-ideation` … `5-wrap-up` only.
- `interview/staging/` remains a valid Wrap-up promotion source in mature-project reruns (F-P2 nuance).

## Related

- design/workflow/session-memory-tree.md
