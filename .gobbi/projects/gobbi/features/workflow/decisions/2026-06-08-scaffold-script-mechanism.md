---
name: scaffold-script-mechanism
description: Manager-invoked idempotent orchestration/scripts/scaffold-session-dir.sh with embedded dir manifest, fail-closed path validation, and a spec-to-script sync-check.
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [session-memory, scaffold-script, determinism]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Manager-invoked idempotent scaffold-session-dir.sh (Mech-1)

## Context

The previous init mechanism was prose-only: `orchestration/SKILL.md` said the manager "bootstraps empty at entry," but there was no script. gobbi already shipped idempotent shell helpers (`reconcile-session-metadata.sh`, `reconstruct-agents.sh`) for telemetry operations. The user confirmed the init-script mechanism in the design gates (D-script decision). Evaluation raised that "the script reads the staging vocabulary from the spec doc" was structurally impossible for a `mkdir -p` script, and that the path-validation contract was unspecified.

## Decision

Create `orchestration/scripts/scaffold-session-dir.sh` — a manager-invoked, idempotent `mkdir -p` shell script in the existing `orchestration/scripts/` home.

Interface: `scaffold-session-dir.sh <session-root> <step-dir> [--pass]`

The script embeds the per-loop dir manifest in a `case "$step_loop" in` block — it does NOT parse the spec doc at runtime. `orchestration/templates/session-tree.md` is the human-readable single source of truth; a sync-check (`verify-session-tree.sh --check`) diffs script output against the spec-declared tree to catch drift.

Path-validation contract (fail-closed): `<session-root>` must be absolute and under the worktree; `<step-dir>` must match the fixed allowed set (`1-ideation` … `5-wrap-up`, `4-execution/task-{NN}-{slug}`); reject `..`, leading `/` on `<step-dir>`, unexpected slashes; exit non-zero and create nothing on any failure.

Idempotency: pure `mkdir -p` — re-run is a no-op.

## Rationale

Mech-1 fits the existing house style exactly: the reconcile and reconstruct scripts are idempotent by construction, flock/atomic/pure operations. The directory scaffold follows the same pattern. Manager-controlled timing matches the lifecycle (create loop dirs at entry; `outputs/` only on PASS).

A hook (Mech-2) was rejected: SessionStart fires on startup/resume/clear/compact, not at loop entry, so it has the wrong granularity for loop subdirs, and hooks must stay lean for the latency gate. A template-copy approach (Mech-3) was rejected because `.gitkeep` placeholders pollute the real tree and `cp -r` is less idempotent than `mkdir -p`.

## Alternatives considered

- Mech-2 (SessionStart/loop-entry hook): rejected — wrong granularity; hook latency gate.
- Mech-3 (template-copy with `cp -r`): rejected — `.gitkeep` pollution; less idempotent.
- Script parses spec doc at runtime: impossible for a `mkdir -p` shell script; replaced by embedded manifest + sync-check.

## Consequences

- `orchestration/SKILL.md` "bootstrap empty at entry" step is replaced with a scaffold-script invocation.
- `ideation/SKILL.md` Sub-step B step is replaced with a scaffold-script invocation.
- Per `task-{NN}-{slug}` at Execution task entry: manager calls the script with `4-execution/task-{NN}-{slug}`.
- Manager calls with `--pass` at MEMORIZATION on PASS (or MEMORIZATION calls it before writing to `outputs/`).

## Related

- design/session-memory-tree.md
- decisions/2026-06-08-session-tree-spec-doc.md
