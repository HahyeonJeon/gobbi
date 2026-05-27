---
name: sidecar-lock-refinement-deferred
description: Deferred hardening — use session.json.lock sidecar instead of locking session.json directly
type: backlogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [flock, locking, sidecar, session-json, hardening]
disposition: open
---

# Sidecar lock file refinement — flock on session.json.lock vs session.json directly

## Context

The hook acquires `flock -x` on `session.json` itself, rather than on a separate `session.json.lock` sidecar file. Using the file being mutated as the lock file works (POSIX `flock(1)` locks on the file descriptor), but using a dedicated sidecar would be a cleaner separation of concerns — the lock file would have a known lifecycle independent of the data file's atomic-rename cycle.

## Decision

Deferred. The `flock -x` on `session.json` addresses the primary lost-update race (two concurrent PostToolUse hooks clobbering each other's `agents[]` append). The sidecar refinement is hardening, not correctness.

## Rationale

The current design uses an `exec {fd}>>"$session_json"; flock -x "$fd"` pattern that keeps the same fd open through the write cycle, so the inode concern (atomic rename creates a new inode, staling the lock) does not apply to the current implementation.

## Alternatives considered

- Use `session.json.lock` sidecar: acceptable; deferred as non-blocking hardening.

## Consequences

If the executor's atomic-write implementation deviates from the fd-based pattern, revisit this design to use a sidecar lock.

## When to pick up

When the flock design is revisited for any reason (e.g., new edge case in concurrent access or a change to the atomic-write pattern).

## Related

- `features/install-runtime/design/flock-serialization-on-session-json.md`
