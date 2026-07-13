# Workflow — Session Record (Orchestration)

**Doc kind:** reference-orchestration.

The manager's-eye lifecycle of the per-session working tree: when each piece of session record is written across the workflow, who writes it, and the loop-entry scaffold that materializes it. Loaded by the manager; the canonical on-disk shape is deferred to `record/record-map.md`.

---

## Workflow Session Record

Every session writes its working memory under one root: `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`, inside the per-session worktree (the durable write-root is `session.json.git.worktreePath` — see [`git/SKILL.md` § Memory Access Matrix](../../git/SKILL.md#memory-access-matrix)). All of it is **session-scoped**: nothing here is memory until Wrap-up promotes the `staging/` trees. This section is the timeline — *when* across the workflow lifecycle each piece is written, and *who* writes it — followed by the on-disk inventory the timeline refers to.

**Lifecycle — when each piece is written, and by whom.** Read top-to-bottom as the session runs.

| When (workflow moment) | What is written | Who writes it | Where + how |
|---|---|---|---|
| **Configuration (Step 1)** | The full session-record skeleton via `init-record-map.sh` (row 2: `transcripts/` + metadata stubs + the five loop dirs), then stamped `settings.json` (row 3) / `state.json` (row 4 fresh, or rehydrated at row 4R on resume) / `session.json` (row 5) | manager | Rooted at the row-1 worktree path; the `session.json` row (row 5) stamps `git.worktreePath`, the durable write-root for everything after. See [§ Step 1 — Workflow Configuration](../SKILL.md#step-1--workflow-configuration). `init-record-map.sh` (row 2) creates the session-root `transcripts/` + metadata stubs and delegates the loop dirs to [`scaffold-session-dir.sh`](../scripts/scaffold-session-dir.sh) — the scaffold script never creates `transcripts/` (see [§ Loop-entry scaffold](#loop-entry-scaffold)). |
| **Loop entry (each of Steps 2-6)** | The loop's `{working, staging, evaluation}` subdirs (Execution: per-task `task-{NN}-{slug}/` quartets) | manager | Invokes [`scaffold-session-dir.sh`](../scripts/scaffold-session-dir.sh) `<session-root> <step-dir>` at loop entry to materialize the 4-slot interior, so WORK / EVALUATION / RECORD can assume the tree exists. See [§ Loop-entry scaffold](#loop-entry-scaffold). |
| **WORK (per iteration)** | `working/draft-iter{n}.md`, `discussion-log.md`, `research/{slug}.md`; the owning specialist's `staging/` typed findings | owning specialist (`leader` / `executor` / `assistant`) | `{N}-{loop}/working/` is the only scratch surface (no `tmp/` tier). Staging is the Wrap-up promotion source. |
| **EVALUATION (per iteration)** | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `overall.md` + the filled `checklist.md` | evaluator subagents (one per system) | Bare 7-vocabulary names, same set on both systems — see [§ Per-perspective evaluation file naming](#per-perspective-evaluation-file-naming) below. |
| **RECORD (per iteration)** | `session.json` UPSERT (iter / verdict); transcript copy into session-root `transcripts/` (runtime-aware: skipped as a degraded-audit pass under a `codex` null `transcriptPath`, still a Critical/loud failure under a `claude-code` absent transcript — see [`record/SKILL.md`](../../record/SKILL.md) Step 2 / Step 9); cumulative `staging/` findings | `assistant` subagent | Session-scoped only; memory promotion is NOT done here. See [`workflow/record.md`](record.md). |
| **On PASS (loop exit)** | `outputs/{free-filename}.md` — the loop's canonical output | `assistant` (RECORD) | PASS-only; absent on REVISE / FAIL iterations. The scaffold's `--pass` flag creates `outputs/`. |
| **Every state transition** | `state.json` updated in place | manager | The live state-machine file used to recover position after `/clear` / `/compact` / resume — see [§ State persistence](state-machine.md#state-persistence). |
| **Wrap-up (Step 6)** | `staging/` trees promoted to memory; non-canonical session subdirs normalized going-forward | `assistant` (Wrap-up) | The only workflow-loop step that writes memory. Deviations from the canonical shape below are normalized here — see [`wrap-up/SKILL.md` § Non-standard session-subdir cleanup](../../wrap-up/SKILL.md#non-standard-session-subdir-cleanup-going-forward). |

**On-disk inventory.** The canonical shape the lifecycle above writes into is defined once, in [`record/record-map.md`](../../record/record-map.md) — the single source of truth for the per-session working tree. That doc carries the complete ASCII tree (session root + `{N}-{loop}/` ordinal map + the 4-slot loop interior `working/ evaluation/ staging/ outputs/` — `working/` itself carries the `research/` and `proposals/codex/` sub-slots (the latter holds the dual-system Codex proposer's frozen proposal, NOT a 5th top-level slot) — + the `4-execution/task-{NN}-{slug}/` nesting), the SEAM-3 rule (on-disk dirs carry the `{N}-` prefix; `workflow.{loop}` JSON keys stay bare), the transcript rules, and the path-validation contract. The prose in this skill points there rather than re-declaring the shape — a second copy is exactly the drift the spec doc exists to remove.

**Session-root files.** `session.json` (telemetry), `settings.json` (resolved config), `state.json` (the workflow state-machine file — see [§ State persistence](state-machine.md#state-persistence)), and `session.json.lock` (advisory write-lock the manager creates / releases around each `session.json` write; not memory content — safe to ignore on read). The single session-root `transcripts/` dir is created by the manager in Configuration (see § Loop-entry scaffold).

**No `tmp/` scratch tier.** `{N}-{loop}/working/` is the only scratch surface in the canonical tree. A `tmp/` dir or a `working/restore/` sub-tier is non-canonical — resume / restore scratch lives directly in `working/`. Wrap-up removes `tmp/` going-forward (see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)).

### Loop-entry scaffold

At each loop entry (Steps 2-6), the manager materializes the loop's interior by invoking the scaffold script rather than creating dirs ad hoc:

```
scaffold-session-dir.sh <session-root> <step-dir> [--pass]
```

- `<session-root>` — the absolute `sessions/{date}-{session-id}/` path (`session.json.git.worktreePath`-rooted).
- `<step-dir>` — one of `1-ideation` `2-preparation` `3-planning` `4-execution` `5-wrap-up`, or a single execution task dir `4-execution/task-{NN}-{slug}` (`{NN}` is `[0-9]{2}`, `{slug}` matches `[a-z0-9-]{1,40}`).
- `--pass` — passed at RECORD on a PASS iteration to also create the `outputs/` dir.

The script creates the 4-slot interior (`working/`, `working/research/`, `working/proposals/codex/`, `evaluation/`, `staging/` with the loop's typed staging subdirs) idempotently, and is fail-closed: a non-absolute `<session-root>`, a `<step-dir>` with `..` / a leading `/` / stray slashes, or any `<step-dir>` outside the fixed set (including `startup`) exits non-zero and creates nothing.

**The session-root `transcripts/` dir is the manager's, not the script's.** The manager creates the single session-root `transcripts/` in Configuration alongside the root JSON files; the scaffold script **never** creates a `transcripts/` dir (there is no per-loop or per-task `transcripts/`).

**Drift gate.** [`verify-record-map.sh --check`](../../record/scripts/verify-record-map.sh) is the manual gate that scaffolds throwaway step-dirs and diffs the script's output against `record-map.md`, plus runs the path-validation negative cases. Run it after editing either the scaffold script or the spec doc; it fails on any drift between the two. The diff is narrowed (COD-STRUCTURE-2) to the script-created `<step-dir>` subtree only — never the manager-created session-root invariants (`transcripts/`, the JSON files).

### Per-task Execution layout (the quartet)

The Execution loop is per-task. Each task lives under `4-execution/task-{NN}-{slug}/` and carries the **full quartet** — `{working, staging, evaluation, outputs}`:

```
4-execution/
├── staging/{...}/            ← loop-level (cross-task) staging
└── task-{NN}-{slug}/
    ├── working/draft-iter{n}.md, working/research/{slug}.md, working/proposals/codex/draft-iter{n}.md
    ├── staging/{...}/
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md + checklist.md
    └── outputs/{free-filename}.md
    # No per-task transcripts/ — every agent's transcript lives in session-root transcripts/.
```

Every `task-{NN}-{slug}/` gets the full quartet. A task with only `evaluation/` (missing working / staging / outputs) is an incomplete task layout — the quartet is required unless a task is documented eval-only.

### Per-perspective evaluation file naming

Evaluation outputs are named `evaluation/iter{n}/{system}/{perspective}.md` where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocabulary — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` — plus `overall.md`. **Bare names only**: no `pN-` positional prefix, and the **same 7-perspective vocabulary on both systems** so cross-system reconciliation pairs files 1:1. The 7-perspective vocabulary is owned by [`evaluation/SKILL.md`](../../evaluation/SKILL.md); the manager's spawn / reconciliation orchestration is in [`workflow/evaluation.md`](evaluation.md).
