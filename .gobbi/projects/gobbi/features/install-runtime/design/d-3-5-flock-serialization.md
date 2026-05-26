---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: install-runtime
design-id: D-3-5
slug: d-3-5-flock-serialization
status: locked
iter: 2
---

# D-3-5 — Serialization primitive: POSIX flock -x on session.json

## Decision

Every read-modify-write cycle in both hook and reconstructor MUST:

```bash
exec {fd}>>"$session_json"
flock -x "$fd"
# ... read, modify, write session.json atomically ...
# lock released automatically on script exit
```

`flock -x` on `session.json` itself (not a sidecar). Lock is released automatically when the script's process exits (POSIX `flock(2)` semantics — releases on process death, including SIGKILL).

**Sidecar refinement** (iter2 Claude R4): using `session.json.lock` as a dedicated sidecar would be cleaner separation, but is deferred as non-blocking hardening (see `staging/decisions/sidecar-lock-refinement-deferred.md`).

## Rationale

iter1 R1 + COD-STRUCT-002: concurrent PostToolUse hooks (e.g., dual-system evaluator spawns) cause lost-update race when both read `session.json` before either writes. Three options: (a) `flock -x`, (b) per-spawn file pattern, (c) accept lost-update. Picked **(a)** because: smallest change (one `exec {fd}>>"$session_json"` line per script); serializes both hook AND reconstructor; no consolidation step.

## Anchored insights

iter1 R1, iter1 COD-STRUCT-002, `delegation/SKILL.md:51` + `:220` (parallel evaluator topology), `session-start.sh` (bash-precedent host capabilities).

## Trade-offs considered

- (b) Per-spawn files — rejected: adds consolidation step + cross-file ordering semantics; data lives in N files until Wrap-up consolidates, breaking real-time `session.json` reads
- (c) Accept lost-update — rejected: defeats T3's premise; running reconstructor at every Task return is wasteful and the same race re-occurs between reconstructor and concurrent hook

## Validation

Smoke test: spawn two Task tools in parallel (dual-system evaluator pattern); after both complete, `jq '.agents | length'` returns N+2 (manager + both subagents), not N+1 or N. Lock-release-on-exit: intentionally `kill -9` a hook process mid-run; subsequent hook fire should acquire the lock cleanly.

## Implementation checklist anchor

T3-I-T3.a, T3-I-T3.b, T3-I-T3.g (documentation)

## Source

`rawdata/draft-iter3.md:401-406` (D-3-5 narrative)
