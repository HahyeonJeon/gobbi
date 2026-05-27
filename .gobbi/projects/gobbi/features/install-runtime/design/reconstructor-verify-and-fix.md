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
slug: reconstructor-verify-and-fix
iter: 2
---

# Reconstructor algorithm: verify-and-fix, idempotent upsert by id, orphan-report only (D-3-2)

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

## Anchored insights

Verify-and-fix robustness rationale; transcript inspection confirming toolUseResult fields available; `flock-serialization-on-session-json.md`.

## Trade-offs considered

- Scan-and-replace — rejected: deletes manager seed
- Append-only — rejected: cannot fix partial-field entries

## Validation

Single-script verifier on 2-state fixture (empty agents[] + partial agents[]); idempotency double-run; reconstructor-during-hook-fire smoke test (D-3-5).

## Implementation checklist anchor

Reconstructor script authoring (reconstruct-agents.sh)

## Source

`rawdata/draft-iter3.md:353-360` (D-3-2 narrative)
