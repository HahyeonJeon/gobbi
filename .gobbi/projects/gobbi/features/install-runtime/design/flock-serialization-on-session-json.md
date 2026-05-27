---
name: flock-serialization-on-session-json
description: POSIX flock -x on session.json serializes concurrent PostToolUse hook and reconstructor read-modify-write cycles; lock released automatically on process exit.
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [flock, serialization, session-json, concurrency]
design-id: D-3-5
slug: flock-serialization-on-session-json
iter: 2
---

# Serialization primitive: POSIX flock -x on session.json (D-3-5)

## Decision

Every read-modify-write cycle in both hook and reconstructor MUST:

```bash
exec {fd}>>"$session_json"
flock -x "$fd"
# ... read, modify, write session.json atomically ...
# lock released automatically on script exit
```

`flock -x` on `session.json` itself (not a sidecar). Lock is released automatically when the script's process exits (POSIX `flock(2)` semantics — releases on process death, including SIGKILL).

**Sidecar refinement**: using `session.json.lock` as a dedicated sidecar would be cleaner separation, but is deferred as non-blocking hardening (see backlog: `sidecar-lock-refinement-deferred`).

## Rationale

Concurrent PostToolUse hooks (e.g., dual-system evaluator spawns) cause lost-update race when both read `session.json` before either writes. Three options considered: (a) `flock -x`, (b) per-spawn file pattern, (c) accept lost-update. Picked **(a)** because: smallest change (one `exec {fd}>>"$session_json"` line per script); serializes both hook AND reconstructor; no consolidation step.

## Anchored insights

First-iteration evaluation finding (concurrent hook race); parallel evaluator topology documentation in `delegation/SKILL.md` (the dual-system pattern that triggers concurrent hooks); `session-start.sh` (bash precedent + host capabilities confirmation).

## Trade-offs considered

- (b) Per-spawn files — rejected: adds consolidation step + cross-file ordering semantics; data lives in N files until Wrap-up consolidates, breaking real-time `session.json` reads
- (c) Accept lost-update — rejected: defeats T3's premise; running reconstructor at every Task return is wasteful and the same race re-occurs between reconstructor and concurrent hook

## Validation

Smoke test: spawn two Task tools in parallel (dual-system evaluator pattern); after both complete, `jq '.agents | length'` returns N+2 (manager + both subagents), not N+1 or N. Lock-release-on-exit: intentionally `kill -9` a hook process mid-run; subsequent hook fire should acquire the lock cleanly.

## Implementation checklist anchor

Hook script authoring; reconstructor script authoring; documentation update (both scripts)

## Source

`rawdata/draft-iter3.md:401-406` (D-3-5 narrative)
