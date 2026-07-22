---
name: session-memory-tree
description: Flat, number-ordered, 4-slot per-loop session-memory directory structure with a single session-root transcripts/ surface and one idempotent scaffold script.
type: design
scope: feature
feature: workflow
status: retired
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, directory-structure, scaffold, workflow]
author: claude
supersedes: null
superseded_by: null
related: [flat-granular-loop-interior, number-prefixed-loop-dirs, single-root-transcripts, scaffold-script-mechanism, session-tree-spec-doc, interview-bootstrap-exception]
archived_at: 2026-07-20
archive_reason: retired
---

# Session-memory directory structure

## Problem

The gobbi per-session working tree (`sessions/{date}-{session-id}/...`) was defined by prose convention spread across roughly 16 skill docs, not by a single spec an init script could enforce. The shape drifted because it was inferred at write time. Three root drivers: (1) the per-loop interior was non-uniform and documented only in prose — no init script could scaffold something that varied by loop; (2) `rawdata/` mixed four different data roles (mutable drafts, immutable transcripts, append-only journal, pre-staging references) with no separation; (3) there was no scaffold script — the manager created dirs ad hoc.

## Scope

**In scope:** per-loop directory redesign (4-slot flat interior), single session-root `transcripts/` surface, CREATE `orchestration/templates/session-tree.md` + `orchestration/scripts/scaffold-session-dir.sh` + `orchestration/scripts/verify-session-tree.sh`, ADD `memorization/rules.md` §1.3 carve-out, lifecycle correction (D7), doc sweep across all loop/orchestration/memorization skills, `codex/SKILL.md` authoritative reconciliation, `agents/assistant.md` addition.

**Out of scope:** `interview/` interior (bootstrap exception), `[FLAG-1]` project-`skills/`-is-memory classification, changing Wrap-up promotion routing, changing `workflow.{loop}` JSON keys, runtime TypeScript changes, new cross-session retention store.

## Approach

### Session tree (canonical)

```
sessions/{date}-{session-id}/
├── session.json
├── state.json
├── settings.json
├── session.json.lock
├── transcripts/                  ← single surface: {role}-{agentId}.jsonl per agent run,
│                                    accumulating across all loops, gitignored, never promoted
└── {N}-{loop}/                   1-ideation 2-planning 3-execution 4-wrap-up
    ├── working/                  ← drafts + discussion-log + research/ (only scratch surface)
    ├── evaluation/               ← iter{n}/{claude,codex}/{perspective}.md (unchanged interior)
    ├── staging/                  ← typed-finding stagings (Wrap-up promotion source, unchanged interior)
    └── outputs/                  ← PASS-only (renamed from artifacts/)
```

Per-task nesting (3-execution/):
```
3-execution/
├── staging/                      ← cross-task findings
└── task-{NN}-{slug}/
    ├── working/
    ├── evaluation/
    ├── staging/
    └── outputs/
```

`interview/` keeps its own bootstrap shape (not swept).

### Key rename/move deltas

| # | Delta |
|---|---|
| D1 | `{loop}/` → `{N}-{loop}/` (JSON keys stay bare) |
| D2 | `{loop}/rawdata/` → `{N}-{loop}/working/` |
| D3 | Per-iter `transcript-iter{n}.jsonl` → root `transcripts/{role}-{agentId}.jsonl` per-agent accumulating |
| D4 | `{loop}/artifacts/` → `{N}-{loop}/outputs/` |
| D5 | Root `debug-transcripts/` dropped; root `transcripts/` carries the ephemeral/gitignored behavior |
| D6 | `task-{NN}/` → `task-{NN}-{slug}/`; no per-task transcripts/ |
| D7 | Lifecycle correction: sessions/ gitignored; correct per-iter commit-cadence docs |
| D8 | Loop interior = 4 slots only (transcripts/ removed from every loop/task dir) |
| C1 | CREATE orchestration/templates/session-tree.md |
| C2 | CREATE orchestration/scripts/scaffold-session-dir.sh + verify-session-tree.sh |
| C3 | ADD memorization/rules.md §1.3 carve-out |

### Scaffold script

`orchestration/scripts/scaffold-session-dir.sh <session-root> <step-dir> [--pass]`

- At loop/task entry: creates `<step-dir>/{working,working/research,evaluation,staging}/` + per-loop typed staging subdirs. Never creates `transcripts/` (root only — manager creates it in Configuration).
- On `--pass`: also creates `<step-dir>/outputs/`.
- Fail-closed path validation: rejects `..`, absolute `<step-dir>`, unexpected slashes; exits non-zero and creates nothing on failure.
- Idempotent: pure `mkdir -p` — re-run is a no-op.
- Script embeds the per-loop dir manifest; `orchestration/templates/session-tree.md` is the human-readable source of truth; `verify-session-tree.sh --check` diffs script output against the spec tree.

### Spec doc

`orchestration/templates/session-tree.md` — the single source of truth that closes the ~16-prose-definition drift root cause. All loop/orchestration docs point here for shape; per-loop docs state only their own write rows.

## Scenarios

- Manager runs scaffold script at loop entry → correct dirs created idempotently.
- Re-running scaffold on an existing tree → no-op (byte-identical).
- Invalid `<step-dir>` supplied → script exits non-zero, creates nothing.
- MEMORIZATION copies agent transcripts to session-root `transcripts/` → accumulates, never overwrites.
- Wrap-up reads `{N}-{loop}/staging/` → promotes to project memory; never touches `transcripts/` or `working/`.

## Validation

- D1: scaffold script produces byte-identical tree on re-run; spec-to-script sync-check passes; invalid step-dir rejected fail-closed.
- D2: `working/` / `evaluation/` / `staging/` / `outputs/` are distinct named loop dirs; root metadata JSON + single root `transcripts/` are visually distinct from loop dirs.
- Lifecycle accuracy: no doc claims session content is made durable by a per-iter commit.

## Trade-offs

Optimizes for: determinism (one spec → one script, no agent-inferred shape), debuggability (flat named roles per loop, ordered top level), simplicity (R1 collapses two transcript surfaces into one root dir).

Sacrifices: minimal churn — the doc sweep touched ~45 files (2 new scripts + 1 spec + ~46 existing). Accepted because project memory was wiped so there is no data migration, only doc updates.

## Open issues

- `[FLAG-1]`: resolved in v0.5.3 — project `skills/` is a source-authoring surface; Planning schedules a missing project skill as the first Execution task.
- `[FLAG-2]`: `claude` doc-authoring skill — deferred.
- F-P2: Wrap-up exclusion wording must preserve `interview/staging/` as a valid promotion source; only `transcripts/` is excluded, not all non-`staging/` dirs. Addressed in the shipped doc sweep.
  > **Superseded 2026-07-13:** the `interview` skill was replaced by `startup`; `interview/staging/` no longer exists and startup self-promotes at startup-close — Wrap-up now EXCLUDES `startup/` from its promotion inventory. See `decisions/workflow/2026-07-13-startup-session-shape-and-promotion.md`.
