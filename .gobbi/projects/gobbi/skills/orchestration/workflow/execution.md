# Workflow — Execution (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager orchestrates the Execution Loop — when to spawn each specialist,
REVISE / PASS / FAIL routing, the iteration cap, and Plan-cursor advancement. It runs the
four sub-phases DISCUSSION → WORK → EVALUATION → RECORD, then the ITER / EXIT decision; it
does NOT perform the executor / evaluator / assistant procedures. The Execution Loop runs
once **per planned task** — the entire loop body repeats for each task in the Plan.

---

## DISCUSSION Orchestration

**Manager's job**: construct the executor delegation prompt for the current task — manager +
user directly, with no leader spawned (the design is already locked in `3-planning/outputs/`).

For each task in the loop's task list (`3-planning/outputs/`), the manager:
1. Identifies the task's scope boundary (which files to touch, which to avoid).
2. Locates the relevant Step 3 reference (or `novel` marker) from the Ideation insights.
3. Confirms with the user through the active runtime's user-decision primitive any contribution points the task requires.
4. Constructs the executor delegation prompt per [delegation prompt requirements](../../delegation/SKILL.md#what-every-delegation-prompt-contains) with:
   - The task description and acceptance criteria
   - Scope boundary (in-scope files, out-of-scope files)
   - Reference materials (skills to load, mistakes to respect)
   - Verification criteria (how the executor will know it's done)

---

## WORK Orchestration

**Manager's job**: spawn a `executor` agent for the task. The **default is a fresh executor per task** — fresh context is what makes scope discipline reliable. **Continuation is a Claude Code Agent Teams exception** (see [Executor continuation](#executor-continuation-shared-subsystem-under-cap) below): when the next task shares the current task's subsystem and the chain is under the saturation cap, the manager may continue the same executor teammate instead of re-spawning. Native Codex uses fresh executor spawns with full Load Directives. Default stays fresh; continuation is opt-in where it is safe and saves re-reading.

Manager-side responsibilities:
- Ensure the executor commits to the worktree (per `git` skill), not pushes
- Collect the work artifact (code/doc diff + verification evidence)
- Stage executor notes in the task's `4-execution/task-{NN}-{slug}/working/`; transcripts are copied to the session-root `transcripts/` (one `{role}-{agentId}.jsonl` per agent, all loops)
- On re-entry, pass prior evaluator findings as additional delegation prompt input

### Executor continuation (shared subsystem, under cap)

The decision rule, the F1 predicate, the delta-brief shape, and the evaluator-FORBIDDEN wall live in [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh); this section states only the Execution-specific choreography. Continuation needs Claude Code Agent Teams enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, v2.1.32+); it is preferred-where-safe with a fresh-spawn fallback, never a hard dependency. Native Codex does not use this continuation path.

The manager **continues the same executor teammate from task NN to NN+1 iff BOTH hold**:

- **Shared subsystem** — task NN+1's `files:`/feature scope OVERLAPS the files task NN touched, OR the two tasks are in the same feature directory. If neither holds, the subsystem is disjoint → fresh-spawn.
- **Under the saturation cap** — the chain has continued fewer than **3 consecutive tasks**. At 3 consecutive continued tasks the manager forces a fresh spawn even when the subsystem still matches, to bound context-rot. Break early — fresh-spawn before the cap — if the context budget is strained.

When either test fails, the manager **fresh-spawns** the next executor with a full brief (the default path). When both hold, the manager sends a delta-brief (next task's goal + new inputs + changed-rule/mistake/scope re-anchor + re-stated scope + status) instead of a full re-paste.

**Continuation write-discipline.** Each continuation turn that writes MUST use the absolute worktree path on every Write/Edit and `git -C <worktree-abs>` for all git ops — a re-`cd` does not persist across tool boundaries. After each continuation turn that writes, the manager runs a post-turn tree-check to confirm the write landed on the worktree branch, not the main tree. Full discipline: [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh) and the executor agent spec.

**Compaction kills the teammate.** After `/compact`, `/clear`, or resume, the in-process teammate is gone. The manager MUST spawn a FRESH executor and re-prime it from durable session record (the task's `outputs/`, prior `working/`, `state.json`) — never message a dead teammate.

### Executor lifecycle

> **Procedure owner:** [`execution/SKILL.md`](../../execution/SKILL.md) owns the executor's
> WORK lifecycle — the five phases (Study → Plan → Execute → Verify → Commit), per-task
> memory access, and the status contract. This doc keeps only the manager orchestration; do
> not restate the phase table. The manager collects the executor's final response as the
> work artifact (per the WORK Manager-side responsibilities above).

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Execution WORK may run dual-system production (`propose.mode: dual`, default), spawned
> **per task** — the proposal lands at `task-{NN}-{slug}/working/proposals/codex/`. Do not
> restate proposer spawn, freeze, selective integration, gap classification, or
> degraded-mode rules.

---

## EVALUATION Orchestration

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Execution-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract)
- **Output path**: per-task, per-iter scoped under `sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/` — nine files per system: `{perspective}.md` (seven), `overall.md`, and the filled `checklist.md`
- Phase-specific focus is built from [`execution/evaluation.md`](../../execution/evaluation.md) — implementation match, build/test status (verified via tools), security, mistake compliance, scope discipline, supply-chain, observability, privacy
- **Tool verification is critical at Execution** — evaluators run tests, type checks, and `grep`/`rg` to anchor confidence ≥ 75 (subject to the verification preflight in [`evaluation/SKILL.md`](../../evaluation/SKILL.md))

---

## RECORD Orchestration

**Manager's job**: spawn the `assistant` agent. For Execution, the assistant integrates the executor's work artifact, both systems' evaluator findings, and the discussion log into the task's `4-execution/task-{NN}-{slug}/outputs/` files. The Execution Loop iterates per-task — each task produces its own `outputs/` directory under its task subdirectory.

### Per-task value telemetry

Because the Execution Loop is per-task, its value telemetry is per-task too. At RECORD, the assistant parses the task's dual-system integration log `4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md` and appends one element to `session.json.workflow.execution.integration.tasks[]`: `{ taskNo, slug, iter, changing_rows, kept_own_rows, total_rows, escalated_rows }` (`taskNo` + `slug` identify the task, `iter` is the task's final loop count, then the four counts). The four counts follow the same rule as every loop (see [`record/SKILL.md` § Value-telemetry integration counts](../../record/SKILL.md#value-telemetry-integration-counts)). The append is idempotent — keyed by `taskNo`, so a re-run overwrites rather than duplicates. The loop-level `workflow.execution.integration` counts roll up the dual-mode tasks; a `single`-mode task contributes no integration log and leaves its per-task counts `0`. This per-task array is what answers D4.3 (per-task value — which task the Codex proposer actually moved).

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure. Execution keeps only the executor's own task-implementation
> commit (below).

The session-record commit boundary (above) is separate from the executor's own task-implementation commit (the "Commit" lifecycle phase above). That commit **is real**: it ships the code/doc change per the task's contract into **tracked** workspace files (not under gitignored `sessions/`), and it is absorbed into the PR at merge. Only the session-record audit-trail commit is the no-op; the implementation commit always stands.

---

## ITER / EXIT

Per task:

| Verdict | Action |
|---|---|
| `PASS` | Move to next task in the Plan |
| `REVISE` | Re-enter `DISCUSSION` for THIS task with eval findings |
| `FAIL` | Escalate; user decides revise / abort / skip |

Iteration cap is `workflow.execution.maxIterations` per task (Auto 5; Chat 3).

When all tasks `PASS`, the loop exits and the Wrap-up Loop begins.

---

## Output Pointers

Execution's loop dir is `4-execution/`, with per-task subdirs `task-{NN}-{slug}/` (each a
recursive 4-slot interior) plus loop-level cross-task `4-execution/staging/`. Per-task
loop-specific files: WORK draft `task-{NN}-{slug}/working/draft-iter{n}.md`; optional Codex
proposal `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md` + Integration Log
`task-{NN}-{slug}/working/reconciliation-iter{n}.md`; evaluation
`task-{NN}-{slug}/evaluation/iter{n}/{system}/{perspective}.md` + `overall.md` + `checklist.md`; PASS outputs
`task-{NN}-{slug}/outputs/{free-filename}.md`; per-task staging
`task-{NN}-{slug}/staging/{type}/{slug}.md`. Every agent's transcript lives in the single
session-root `transcripts/` — there is no per-task `transcripts/`.

> **Path owner:** [`record/record-map.md`](../../record/record-map.md). The full session tree
> and 4-slot interior live there — never redrawn here.

---

## Cross-references

- Execution Loop phase contracts (executor lifecycle, memory access, status enum) → [`execution/SKILL.md`](../../execution/SKILL.md)
- Execution-phase evaluation seed scenarios → [`execution/scenario.md`](../../execution/scenario.md); seed checks → [`execution/checklist.md`](../../execution/checklist.md); procedure / tool-verification → [`execution/evaluation.md`](../../execution/evaluation.md)
- Executor behavioral discipline → [`principles`](../../principles/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Executor delegation template → [`delegation/templates/executor.md`](../../delegation/templates/executor.md)
- Git/worktree workflow → [`git` skill](../../git/SKILL.md)
