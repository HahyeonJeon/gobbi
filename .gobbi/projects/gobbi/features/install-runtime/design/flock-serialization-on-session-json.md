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
---

# Serialization primitive: POSIX flock -x on session.json

## Context

The PostToolUse hook and the reconstructor both perform read-modify-write cycles on `session.json`. When two Task tools are spawned in parallel (the dual-system evaluator pattern fires two hooks concurrently), both can read `session.json` before either writes — a lost-update race that drops one subagent's record. A serialization primitive was needed that is correct, minimal, and safe against abnormal process death.

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

Supporting evidence anchored at decision time: the first-iteration evaluation finding (the concurrent-hook race); the parallel evaluator topology documented in `delegation/SKILL.md` (the dual-system pattern that triggers concurrent hooks); and `session-start.sh` (the bash precedent plus host-capability confirmation that flock is available).

## Alternatives considered

- (b) Per-spawn files — rejected: adds a consolidation step plus cross-file ordering semantics; data lives in N files until Wrap-up consolidates, breaking real-time `session.json` reads.
- (c) Accept lost-update — rejected: defeats the reconstructor's premise; running the reconstructor at every Task return is wasteful and the same race re-occurs between the reconstructor and a concurrent hook.

## Consequences

- Both the hook script and the reconstructor script must wrap every read-modify-write cycle in the `flock -x` block above; documentation for both scripts must state the requirement.
- A cleaner `session.json.lock` sidecar refinement is deferred as non-blocking hardening (backlog `sidecar-lock-refinement-deferred`).
- Validation obligations: a parallel-spawn smoke test (spawn two Task tools; `jq '.agents | length'` returns N+2, not N+1 or N) and a lock-release-on-exit test (`kill -9` a hook process mid-run; the next hook fire acquires the lock cleanly).

## Related

- `hook-bash-jq-stack.md` — the authoring stack whose read step this serialization protects.
- `reconstructor-verify-and-fix.md` — the reconstructor whose read-modify-write cycle is the other side of the race.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
