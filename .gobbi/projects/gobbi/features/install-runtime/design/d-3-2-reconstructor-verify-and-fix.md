---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: install-runtime
design-id: D-3-2
slug: d-3-2-reconstructor-verify-and-fix
status: locked
iter: 2
---

# D-3-2 — Reconstructor algorithm: verify-and-fix (upsert by id, idempotent, orphan-report only)

## Decision

`.claude/scripts/reconstruct-agents.sh` algorithm:
1. Takes session-dir path as argument
2. Acquires `flock -x` on `session.json` (D-3-5) BEFORE reading
3. Walks transcript JSONL; for each Task spawn (`tool_input.subagent_type` non-null), finds the corresponding `toolUseResult` by `tool_use_id` correlation (D-3-6)
4. Upserts `agents[]` by `id` with last-write-wins on non-null transcript values; first-write-wins on `startedAt` + `id`
5. Reports orphan entries (entries in `agents[]` with no transcript match) as warnings only — does NOT delete
6. Writes merged `agents[]` back atomically (temp file + mv)
7. Releases lock on script exit

**Idempotent**: N runs converge to the same result.

## Rationale

T3-DQ-2: (c) verify-and-fix is robust to empty-and-rebuild + partial-population; idempotent. Orphan-report-only preserves manager seed + user hand-edits. D-3-5 flock ensures reconstructor's read-modify-write does not race against an in-flight PostToolUse hook.

## Anchored insights

T3-DQ-2, T3-I-1, T3-I-2, D-3-5.

## Trade-offs considered

- Scan-and-replace — rejected: deletes manager seed
- Append-only — rejected: cannot fix partial-field entries

## Validation

Single-script verifier on 2-state fixture (empty agents[] + partial agents[]); idempotency double-run; reconstructor-during-hook-fire smoke test (D-3-5).

## Implementation checklist anchor

T3-I-T3.b

## Source

`rawdata/draft-iter3.md:353-360` (D-3-2 narrative)
