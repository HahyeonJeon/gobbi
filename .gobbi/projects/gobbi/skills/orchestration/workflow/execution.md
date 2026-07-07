# Workflow — Execution

**Doc kind:** loop-orchestration.

How the **manager** orchestrates the Execution Loop. The leader / executor / evaluator / assistant participants that own the loop's phases load [`execution/SKILL.md`](../../execution/SKILL.md) (executor's WORK lifecycle, per-task memory access, status contract), [`evaluation/SKILL.md`](../../evaluation/SKILL.md) (evaluator's stages), and [`record/SKILL.md`](../../record/SKILL.md) (assistant's persistence). This document covers the **orchestration choreography** — when to spawn each specialist, REVISE/PASS/FAIL routing, iteration cap, and Plan-cursor advancement. The substantive discipline is in [`principles`](../../principles/SKILL.md).

The Execution Loop runs once **per planned task** — the loop body is the four-phase iteration shape, and the entire loop body repeats for each task in the Plan.

---

## DISCUSSION Phase (manager + user, direct)

**Manager's job**: construct the executor delegation prompt for the current task.

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

## WORK Phase (delegated to `executor`)

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

The executor follows a five-phase lifecycle inside its WORK phase. Each phase depth scales with task complexity. `principles` provides the underlying discipline (Think and Study Before Acting, Bottom-Up Construction, Scope = Contract, Fresh Verification, etc.) — the lifecycle is the executor-specific sequence.

| Phase | What happens |
|---|---|
| **Study** | Load the project skill, project mistakes (`.gobbi/projects/{project-name}/mistakes/`, read recursively — they nest under `{area}/` subdirs, so descend into every area subdirectory) and any feature-specific mistakes, domain skills per the delegation prompt, and the relevant existing code. The codebase is the source of truth for patterns; the delegation prompt tells you *what* to do, the codebase tells you *how* it fits. |
| **Plan** | Outline the approach before coding: which files to modify, which patterns to follow, which mistakes apply, what the deliverable looks like when done. Non-trivial tasks fail when this is skipped. |
| **Execute** | Implement per the plan. Follow existing patterns. Keep changes minimal and focused. Do not introduce new patterns when existing ones work. Do not add error handling, abstractions, or features beyond what the delegation prompt specifies. |
| **Verify** | Before reporting back: implementation meets the acceptance criteria; existing tests pass; mistakes respected; change is minimal (no scope creep); if `.claude/` was touched, related docs are still accurate. Re-verify the precondition: correct branch is checked out and no unexpected state changes occurred. |
| **Commit** (when git is active) | Commit only after verification passes — never unverified work. One focused commit per subtask. Conventional Commits format. Subagents commit but never push; the manager owns pushing and PR creation. |

The final response the executor returns is captured as the work artifact: what was done, what changed, what was learned, any open items. Self-contained — the manager and downstream agents read it as the permanent record of this task.

**Dual-system production (proposer spawn).** When `propose.mode: dual` (per-loop; default `dual`), the manager also orchestrates the dual-system **proposer** spawn per [`workflow/production.md`](production.md) during WORK — a Codex proposer runs in parallel with the executor; the executor selectively integrates the frozen proposal and Codex never writes the canonical artifact. Execution spawns the proposer **per task** (`task-{NN}-{slug}/working/proposals/codex/`).

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Execution-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract)
- **Output path**: per-task, per-iter scoped at `sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus is built from [`execution/evaluation.md`](../../execution/evaluation.md) — implementation match, build/test status (verified via tools), security, mistake compliance, scope discipline, supply-chain, observability, privacy
- **Tool verification is critical at Execution** — evaluators run tests, type checks, and `grep`/`rg` to anchor confidence ≥ 75 (subject to the verification preflight in [`evaluation/SKILL.md`](../../evaluation/SKILL.md))

---

## RECORD Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. For Execution, the assistant integrates the executor's work artifact, both systems' evaluator findings, and the discussion log into the task's `4-execution/task-{NN}-{slug}/outputs/` files. The Execution Loop iterates per-task — each task produces its own `outputs/` directory under its task subdirectory.

### Per-task value telemetry

Because the Execution Loop is per-task, its value telemetry is per-task too. At RECORD, the assistant parses the task's dual-system integration log `4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md` and appends one element to `session.json.workflow.execution.integration.tasks[]`: `{ taskNo, slug, iter, changing_rows, kept_own_rows, total_rows, escalated_rows }` (`taskNo` + `slug` identify the task, `iter` is the task's final loop count, then the four counts). The counts follow the same rule as every loop — `changing_rows` = `took-codex` + `merged-selective` rows, `kept_own_rows` = `kept-own` rows, `escalated_rows` = `escalated` rows, `total_rows` = all rows (see [`record/SKILL.md` § Value-telemetry integration counts](../../record/SKILL.md#value-telemetry-integration-counts)). The append is idempotent — keyed by `taskNo`, so a re-run overwrites rather than duplicates. The loop-level `workflow.execution.integration` counts roll up the dual-mode tasks; a `single`-mode task contributes no integration log and leaves its per-task counts `0`. This per-task array is what answers D4.3 (per-task value — which task the Codex proposer actually moved).

### Per-iteration session record is NOT committed (gitignored)

There is **no** per-iteration session-record commit. The whole `sessions/` tree is gitignored (`.gitignore:21`), worktree-local, and removed at worktree cleanup (D7 — see [`record/record-map.md`](../../record/record-map.md)). A `git commit` aimed at the task's `working/`, `evaluation/iter{n}/`, or `outputs/` content captures **nothing**: `git add` of a `sessions/` path is refused (`paths are ignored ... Use -f`), and a bare `git commit` reports `nothing to commit, working tree clean` and exits non-zero. So the manager does **not** run a `chore(session): record ...` commit after RECORD.

Per-task iteration boundaries are recorded in `session.json.workflow.execution.iterations[]` (keyed by `{task-id, iter}`), not in git. Durable memory exists **only** via Wrap-up promotion of `staging/` content into tracked `features/`, `mistakes/`, etc.

This is separate from the executor's own task-implementation commit (the "Commit" lifecycle phase above). That commit **is real**: it ships the code/doc change per the task's contract into **tracked** workspace files (not under gitignored `sessions/`), and it is absorbed into the PR at merge. Only the session-record audit-trail commit is the no-op; the implementation commit always stands.

---

## ITER / EXIT Decision

Per task:

| Verdict | Action |
|---|---|
| `PASS` | Move to next task in the Plan |
| `REVISE` | Re-enter `DISCUSSION` for THIS task with eval findings |
| `FAIL` | Escalate; user decides revise / abort / skip |

Iteration cap is `workflow.execution.maxIterations` per task (Auto 5; Chat 3).

When all tasks `PASS`, the loop exits and the Wrap-up Loop begins.

---

## Output

The canonical tree is [`record/record-map.md`](../../record/record-map.md); Execution's loop dir is `4-execution/`, with per-task subdirs `task-{NN}-{slug}/` (recursive 4-slot interior). Every agent's transcript lives in the single session-root `transcripts/` — there is no per-task `transcripts/`.

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/
├── transcripts/                ← single session-root surface; {role}-{agentId}.jsonl per agent, all loops
└── 4-execution/
    ├── staging/                ← loop-level (cross-task) staging
    └── task-{NN}-{slug}/        ← e.g. task-01-add-cache-layer
        ├── outputs/            ← per-task PASS-iter output files
        ├── working/
        ├── staging/
        └── evaluation/
            └── iter{n}/
                ├── claude/{perspective}.md
                └── codex/{perspective}.md
```

---

## Cross-references

- Execution Loop phase contracts (executor lifecycle, memory access, status enum) → [`execution/SKILL.md`](../../execution/SKILL.md)
- Execution-phase evaluation seed scenarios → [`execution/evaluation.md`](../../execution/evaluation.md)
- Executor behavioral discipline → [`principles`](../../principles/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Executor delegation template → [`delegation/templates/executor.md`](../../delegation/templates/executor.md)
- Git/worktree workflow → [`git` skill](../../git/SKILL.md)
