---
name: d1-003-recommended-b-false-noop-rationale
description: iter1 finding F-PROJ-1 (Critical) — D1-003 recommended (b) staged into an un-inventoried subtree; corrected at iter2
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, wrap-up]
keywords: [f-proj-1, f-risk-2, false-premise, no-op]
author: claude
related: [d1-003-chat-staging-wrapup-inventory-extension-shipped]
---

# D1-003 recommended (b) staged into the un-inventoried `chat/tasks/` subtree — corrected

## Context

The iter1 draft's recommended (b) for GEN-D1-003 stated: "Each Chat slice's PASS RECORD stages typed
findings into `{N}-{loop}/staging/` exactly like Auto mode; Wrap-up's existing `inventory staging/
ONLY` promotes them," with `wrap-up/SKILL.md` marked UNCHANGED, and a decisive selection rationale
"(b) ... no D7-004 dependency." The iter1 Claude evaluator (Project perspective, finding F-PROJ-1,
Critical/75; cross-refs Risk F-RISK-2 Critical/75 and Consistency S4) found this false: Chat's actual
per-slice loop dirs live under `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{1-ideation,3-planning,
4-execution}/{working,evaluation,staging,outputs}/` (`chat-mode.md:356-367`, Decision D-B) — NOT at
top-level `sessions/{date}-{ssid}/1-ideation/staging/`. Wrap-up's promotion inventory
(`wrap-up/SKILL.md:172` + `:73`) enumerated only the top-level loop `staging/` dirs (+ per-task +
`interview/staging/`) — it never reached `chat/tasks/`. Under (b) as originally written, Chat-slice
findings would remain unpromotable, and the current design's Wrap-up-mining promise
(`chat-mode.md:427`) exists precisely because the base inventory doesn't reach `chat/tasks/` — so
removing the mining without extending the inventory would have left D1-003 unfixed while marking it
"addressed."

## Decision

The design was corrected at iter2: `chat-mode.md` §4 removes the Steps 6-7 skip and the
mine/reconstruct promise; `wrap-up/SKILL.md`'s promotion inventory is EXTENDED to also glob
`chat/tasks/*/{N}-{loop}/staging/` and `chat/tasks/*/4-execution/task-*/staging/`. The user's original
(b) choice is preserved; only the mechanism under it changed.

## Rationale

Extending the inventory is a bounded 2-file fix that promotes REAL staging files RECORD already
writes per slice — no transcript-mining, no reconstruction, and no dependency on the deferred
GEN-D7-004 record-map/scaffold documentation (Wrap-up globs an already-existing subtree; it does not
need that subtree formally documented or scaffolded). The non-Chat exclusion invariant ("Wrap-up
inventories `staging/` ONLY" and F-P2's "do not over-narrow to workflow-loop staging only") is
preserved — the extension only ADDS a source class, never narrows the existing one.

## Alternatives considered

- **Re-open (a)** — a Chat-specific Wrap-up reconstruction sub-step that mines transcripts/
  task-records. Rejected: fights the load-bearing "inventory `staging/` ONLY" invariant AND
  hard-depends on GEN-D7-004 for reliable enumeration; transcript-mining is lossy.
- **Fold GEN-D7-004 into this cluster's scope** — rejected as unnecessary once the bounded inventory
  extension was found to work without it; avoids scope creep into a documented, deliberately deferred
  follow-up.
- **Redirect Chat's per-slice staging layout to top-level loop dirs** — a distinct chat-mode layout
  change requiring new cross-task collision handling; not designed and not needed once the inventory
  extension resolves the defect at the Wrap-up side.

## Consequences

At FIX time, `wrap-up/SKILL.md` gains the two `chat/tasks/*/...staging/` globs alongside its existing
enumeration; `chat-mode.md` loses its narrowed-PASS-path optimization (Chat now runs full base RECORD
per slice — the honest cost this correction accepts). A dual-system evaluation (iter2 Claude
verification) tool-confirmed the extension actually reaches the previously-unreachable subtree.

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension]] — the corrected design this decision documents
- [[2026-07-03-d1-003-false-premise-correction]] — the discussion capturing this correction
- [[manager-must-verify-scope-dependency-claims-before-user-gate]] — the mistake-candidate this false rationale produced
