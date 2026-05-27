---
name: reconstructor-verify-and-fix
description: Reconstructor algorithm is verify-and-fix — upsert agents[] by id from transcript, idempotent, orphan-report only (no delete); protected by flock serialization.
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [reconstructor, agents, session-json, idempotent]
design-id: D-3-2
---

# Reconstructor algorithm: verify-and-fix, idempotent upsert by id, orphan-report only

## Context

The PostToolUse hook populates `session.json.agents[]` incrementally, but a session can start with an empty or partially-populated `agents[]` (e.g., after a resume, or if a hook fired before the field was seeded). A reconstructor script is needed to rebuild `agents[]` from the authoritative transcript without destroying manager-seeded entries or user hand-edits, and it must be safe to run repeatedly.

## Decision

`.claude/scripts/reconstruct-agents.sh` algorithm:
1. Takes session-dir path as argument
2. Acquires `flock -x` on `session.json` (see `flock-serialization-on-session-json.md`) BEFORE reading
3. Walks transcript JSONL; for each Task spawn (`tool_input.subagent_type` non-null), finds the corresponding `toolUseResult` by `tool_use_id` correlation (see `tool-use-id-correlation-key.md`)
4. Upserts `agents[]` by `id` with last-write-wins on non-null transcript values; first-write-wins on `startedAt` + `id`
5. Reports orphan entries (entries in `agents[]` with no transcript match) as warnings only — does NOT delete
6. Writes merged `agents[]` back atomically (temp file + mv)
7. Releases lock on script exit

**Idempotent**: N runs converge to the same result.

## Rationale

Verify-and-fix is robust to empty-and-rebuild + partial-population; idempotent. Orphan-report-only preserves manager seed + user hand-edits. The flock serialization design ensures the reconstructor's read-modify-write does not race against an in-flight PostToolUse hook.

Supporting evidence anchored at decision time: the verify-and-fix robustness rationale; transcript inspection confirming the `toolUseResult` fields are available; and the companion flock serialization design (`flock-serialization-on-session-json.md`).

## Alternatives considered

- Scan-and-replace — rejected: deletes the manager seed.
- Append-only — rejected: cannot fix partial-field entries.

## Consequences

- The reconstructor (`reconstruct-agents.sh`) takes a session-dir path, acquires the flock before reading, upserts by id, reports (never deletes) orphans, and writes back atomically.
- Because it is idempotent and orphan-report-only, it can be run at any time — including repeatedly — without corrupting manager-seeded or user-edited entries.
- Validation obligations: a single-script verifier on a two-state fixture (empty `agents[]` + partial `agents[]`); an idempotency double-run; and a reconstructor-during-hook-fire smoke test (shared with the flock serialization design).

## Related

- `flock-serialization-on-session-json.md` — the serialization the reconstructor acquires before reading.
- `tool-use-id-correlation-key.md` — the correlation key the transcript walk uses.
- `dual-hook-registration-resolver.md` — the hook the reconstructor backstops.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
