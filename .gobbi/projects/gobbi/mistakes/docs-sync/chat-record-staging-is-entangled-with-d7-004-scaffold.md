---
name: chat-record-staging-is-entangled-with-d7-004-scaffold
description: Chat-mode RECORD staging (GEN-D1-003) depends on the not-yet-built chat/tasks scaffold + drift-gate materialization (GEN-D7-004)
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, docs-sync]
keywords: [chat-mode, GEN-D1-003, GEN-D7-004, scaffold-session-dir, verify-record-map, drift-gate]
author: claude
priority: high
domain: docs-sync
---

# Chat RECORD staging is entangled with the (deferred) chat/tasks scaffold + drift-gate

## What happened

GEN-D1-003 documents Chat-mode RECORD as running the unmodified base RECORD procedure per slice,
writing typed findings to real staging under `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/...`. The
canonical directory materializer (`scaffold-session-dir.sh`) and the drift-gate
(`verify-record-map.sh`) only recognize the fixed top-level loop set plus
`4-execution/task-{NN}-{slug}` — neither accepts nor validates the `chat/tasks/...` subtree, so the
documented Chat staging path was not actually creatable or drift-checked by the existing tooling.
This exact dependency surfaced three separate times across this feature's lifecycle: Ideation iter1
(finding F-PROJ-1), Planning (finding G2), and Execution iter1 (Codex finding O2, High, plus the
per-perspective echoes P2/S1/S2/R2/C2). Each time it was re-discovered rather than recognized as
the same pre-existing gap.

## Why it happens

GEN-D1-003 (Chat per-slice RECORD staging) and GEN-D7-004 (the chat/tasks scaffold + drift-gate
extension) look independent on paper — one is a documentation/procedure fix, the other is a tooling
extension — but D1-003's documented staging destination only becomes real once D7-004's
materializer exists. Because the two were tracked as separate backlog items, each review pass that
touched D1-003 re-derived the dependency from scratch instead of citing a single, already-known
cross-reference. A dependency that is not written down as a first-class link between two backlog
items will keep re-surfacing as if it were new every time either item is reviewed.

## Correct approach

Before shipping a fix that documents a new staging destination (or any new on-disk path a workflow
procedure writes to), check whether the path is covered by the current scaffold/verify contract. If
it is not, and building that coverage is out of scope for the current fix, do NOT silently leave the
documentation pointing at an uncreatable path — either (a) narrow the current fix to state the path
is manager-materialized in the interim (what this session did: `chat-mode.md` + `record-map.md` +
`wrap-up/SKILL.md` now document manager-created materialization, with the scaffold/drift-gate
extension explicitly deferred to GEN-D7-004), or (b) pull the scaffold work into the current session's
scope. Whichever is chosen, write the cross-reference down explicitly (backlog-to-backlog link, or a
design-doc note) so a future reviewer sees the known dependency instead of re-discovering it.

## How to detect

A fix that adds or changes a documented staging/output PATH should always be checked against
`scaffold-session-dir.sh`'s allowed-set and `verify-record-map.sh`'s covered subtree before being
called complete. If a probe scaffold call for the new path exits non-zero, the fix is documentation
ahead of tooling — either close that gap in the same session or explicitly document the interim
materialization path and file (or cite) the tooling backlog item, so the same gap is not
re-discovered as a fresh finding next time.

## Related

- [[resume-detection-must-read-only-pre-branch-persisted-facts]] — the sibling design-flaw fix from
  the same Execution loop's iter1→iter2 correction cycle
- [[d1-003-chat-staging-wrapup-inventory-extension-shipped]] — the design this dependency was documented against
