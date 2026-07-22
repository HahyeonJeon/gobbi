---
name: residual-vocab-substring-false-positive-cross-session
description: check-residual-vocab.sh flags the legitimate current phrase "cross-session memory" because its retired-term pattern "session memory" matches as a substring; a documented false-positive class that inflates the guard's hit count.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [verification, docs-sync]
keywords: [check-residual-vocab, substring-match, false-positive, cross-session-memory, session-memory, word-boundary]
author: claude
priority: low
project-scope: true
shipped_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# check-residual-vocab.sh substring-matches "cross-session memory"

## Context

`check-residual-vocab.sh` targets retired storage-tier vocabulary including the bare phrase `session memory`. The pattern matches as a SUBSTRING, so it also fires inside the legitimate current phrase **"cross-session memory"** — which is real, current gobbi vocabulary (CLAUDE.md describes "Cross-session durable memory") and the actual feature name of an external harness (claude-flow) referenced in this session's charter.

This session added 4 such hits (charter L921, the `claude-flow-swarm-memory` reference description, and the per-session journal), taking the guard from baseline 83 to 88. All 4 are false positives: the underlying content is correct and uses current vocabulary; the guard over-matches on the substring.

## Why deferred

Fixing the guard's matcher is a tooling change, out of scope for this review-only session. Recorded here so the next session (or a tooling-fix session) can harden the pattern.

## Suggested approach

Make the `session memory` pattern word-boundary / negative-lookbehind aware so `cross-session memory` (and any other legitimate `*-session memory` compound) does NOT match, while a bare `session memory` storage-tier reference still does. Add `cross-session memory` to the guard's Family-A allowlist as an interim measure if a full matcher fix is deferred. Re-run over the tree and confirm the 4 hits clear without suppressing genuine `session memory` occurrences.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303/` — surfaced at the Stage-3 dual-system memory-validation gate.

## Related

- [[wrapup-guard-gate-unsatisfiable-with-preexisting-failures]] — this false-positive was one of the two guard failures that tripped the unsatisfiable gate
- [[harden-skill-memory-residual-vocab-allowlist]] — sibling check-residual-vocab.sh hardening task
- [[extend-residual-vocab-guard-for-per-type-sweep]] — sibling check-residual-vocab.sh hardening task
