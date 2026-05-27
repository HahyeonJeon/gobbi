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
supersedes: null
superseded_by: null
---

# Sidecar lock file refinement — flock on session.json.lock vs session.json directly

## Context

The PostToolUse hook acquires `flock -x` on `session.json` itself rather than on a separate `session.json.lock` sidecar file. Locking the file being mutated works (POSIX `flock(1)` locks on the file descriptor), and it addresses the primary lost-update race: two concurrent PostToolUse hooks clobbering each other's `agents[]` append. A dedicated sidecar would be a cleaner separation of concerns — the lock file would have a known lifecycle independent of the data file's atomic-rename cycle — but it is a refinement, not a correctness fix.

## Why deferred

The primary race is fully addressed by the current locking design, so the sidecar is hardening rather than correctness. The one concern a sidecar would address — if the hook used `mv` (atomic rename), a new inode would get a new file descriptor and the old lock fd would go stale — does not apply to the current implementation, which uses an `exec {fd}>>"$session_json"; flock -x "$fd"` pattern that holds the same fd open through the write cycle. With the inode concern moot, the sidecar adds no correctness value today.

## When to pick up

When the flock design is revisited for any reason — for example a new concurrent-access edge case, or a change to the atomic-write pattern. In particular, if the executor's atomic-write implementation ever deviates from the fd-based pattern (e.g. switches to rewrite-by-rename), the stale-fd concern returns and the sidecar becomes worth adding.

## Suggested approach

Switch the lock target from `session.json` to a dedicated `session.json.lock` sidecar: acquire `flock -x` on the sidecar fd, perform the read-modify-write on `session.json` under that lock, and never tie the lock's lifecycle to the data file's inode. This survives a rewrite-by-rename write pattern.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Source

Surfaced as a structure/risk finding during install-runtime design evaluation (session 1b26cf20); deferred as non-blocking hardening since the fd-based locking pattern already addresses the primary race.
