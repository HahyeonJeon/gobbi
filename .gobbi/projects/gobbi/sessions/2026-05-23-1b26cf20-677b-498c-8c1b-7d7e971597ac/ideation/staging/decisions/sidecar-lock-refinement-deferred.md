---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: session-foundations-bundle-b
finding-id: CLAUDE-STRUCT-S1
type: design_flaw
domain: process
disposition: open
confidence: 50
severity: Medium
supersedes: null
superseded_by: null
---

# Sidecar lock file refinement deferred (flock on session.json vs session.json.lock)

## Context

iter2 Claude Risk finding R4 / iter3 Codex Structure CLAUDE-STRUCT-S1: D-3-5 acquires `flock -x` on `session.json` itself, rather than on a separate `session.json.lock` sidecar file. Using the file being mutated as the lock file works (POSIX `flock(1)` locks on the file descriptor), but using a dedicated sidecar would be a cleaner separation of concerns — the lock file would have a known lifecycle independent of the data file's atomic-rename cycle.

## Decision

Deferred. D-3-5's `flock -x` on `session.json` addresses the primary lost-update race (iter1 R1 / COD-STRUCT-002). The sidecar refinement is hardening, not correctness.

## Rationale

The primary race condition — two concurrent PostToolUse hooks clobbering each other's `agents[]` append — is fully addressed by D-3-5. The sidecar concern is that if the hook uses `mv` (atomic rename), a new inode gets a new file descriptor and the old lock file descriptor becomes stale. The current design uses an `exec {fd}>>"$session_json"; flock -x "$fd"` pattern that keeps the same fd open through the write cycle, so the inode concern does not apply to the current implementation.

## Alternatives considered

- Use `session.json.lock` sidecar: acceptable; deferred as non-blocking hardening.

## Consequences

Execution-time: if the executor's atomic-write implementation deviates from the fd-based pattern, revisit D-3-5 to use a sidecar lock.

## Related

- `evaluation/iter2/claude/risk.md` R4
- `evaluation/iter3/codex/structure.md` CLAUDE-STRUCT-S1
- `evaluation/iter3/codex/risk.md` CLAUDE-R4
- `rawdata/draft-iter3.md` D-3-5 (line 401-406)
