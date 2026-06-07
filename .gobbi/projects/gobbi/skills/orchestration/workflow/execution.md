# Workflow — Execution

How the **manager** orchestrates the Execution Loop. The leader / executor / evaluator / assistant participants that own the loop's phases load [`execution/SKILL.md`](../../execution/SKILL.md) (executor's WORK lifecycle, per-task memory access, status contract), [`evaluation/SKILL.md`](../../evaluation/SKILL.md) (evaluator's stages), and [`memorization/SKILL.md`](../../memorization/SKILL.md) (assistant's persistence). This document covers the **orchestration choreography** — when to spawn each specialist, REVISE/PASS/FAIL routing, iteration cap, and Plan-cursor advancement. The substantive discipline is in [`principles`](../../principles/SKILL.md).

The Execution Loop runs once **per planned task** — the loop body is the four-phase iteration shape, and the entire loop body repeats for each task in the Plan.

---

## DISCUSSION Phase (manager + user, direct)

**Manager's job**: construct the executor delegation prompt for the current task.

For each task in the loop's `artifacts/`, the manager:
1. Identifies the task's scope boundary (which files to touch, which to avoid).
2. Locates the relevant Step 3 reference (or `novel` marker) from the Ideation insights.
3. Confirms with the user (AskUserQuestion) any contribution points the task requires.
4. Constructs the executor delegation prompt per [delegation prompt requirements](../delegation/SKILL.md#what-every-delegation-prompt-contains) with:
   - The task description and acceptance criteria
   - Scope boundary (in-scope files, out-of-scope files)
   - Reference materials (skills to load, mistakes to respect)
   - Verification criteria (how the executor will know it's done)

---

## WORK Phase (delegated to `executor`)

**Manager's job**: spawn a `executor` agent for the task. The **default is a fresh executor per task** — fresh context is what makes scope discipline reliable. **Continuation is the one bounded exception** (see [Executor continuation](#executor-continuation-shared-subsystem-under-cap) below): when the next task shares the current task's subsystem and the chain is under the saturation cap, the manager may continue the same executor teammate instead of re-spawning. Default stays fresh; continuation is opt-in where it is safe and saves re-reading.

Manager-side responsibilities:
- Ensure the executor commits to the worktree (per `git` skill), not pushes
- Collect the work artifact (code/doc diff + verification evidence)
- Stage transcripts and any executor notes in `execution/rawdata/`
- On re-entry, pass prior evaluator findings as additional delegation prompt input

### Executor continuation (shared subsystem, under cap)

The decision rule, the F1 predicate, the delta-brief shape, and the evaluator-FORBIDDEN wall live in [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh); this section states only the Execution-specific choreography. Continuation needs Agent Teams enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, v2.1.32+); it is preferred-where-safe with a fresh-spawn fallback, never a hard dependency.

The manager **continues the same executor teammate from task NN to NN+1 iff BOTH hold**:

- **Shared subsystem** — task NN+1's `files:`/feature scope OVERLAPS the files task NN touched, OR the two tasks are in the same feature directory. If neither holds, the subsystem is disjoint → fresh-spawn.
- **Under the saturation cap** — the chain has continued fewer than **3 consecutive tasks**. At 3 consecutive continued tasks the manager forces a fresh spawn even when the subsystem still matches, to bound context-rot. Break early — fresh-spawn before the cap — if the context budget is strained.

When either test fails, the manager **fresh-spawns** the next executor with a full brief (the default path). When both hold, the manager sends a delta-brief (next task's goal + new inputs + changed-rule/mistake/scope re-anchor + re-stated scope + status) instead of a full re-paste.

**Continuation write-discipline.** Each continuation turn that writes MUST use the absolute worktree path on every Write/Edit and `git -C <worktree-abs>` for all git ops — a re-`cd` does not persist across tool boundaries. After each continuation turn that writes, the manager runs a post-turn tree-check to confirm the write landed on the worktree branch, not the main tree. Full discipline: [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh) and the executor agent spec.

**Compaction kills the teammate.** After `/compact`, `/clear`, or resume, the in-process teammate is gone. The manager MUST spawn a FRESH executor and re-prime it from durable session memory (the task's `artifacts/`, prior `rawdata/`, `state.json`) — never message a dead teammate.

### Executor lifecycle

The executor follows a five-phase lifecycle inside its WORK phase. Each phase depth scales with task complexity. `principles` provides the underlying discipline (Think and Study Before Acting, Bottom-Up Construction, Scope = Contract, Fresh Verification, etc.) — the lifecycle is the executor-specific sequence.

| Phase | What happens |
|---|---|
| **Study** | Load the project skill, project mistakes (`.gobbi/projects/{project-name}/mistakes/`) and any feature-specific mistakes, domain skills per the delegation prompt, and the relevant existing code. The codebase is the source of truth for patterns; the delegation prompt tells you *what* to do, the codebase tells you *how* it fits. |
| **Plan** | Outline the approach before coding: which files to modify, which patterns to follow, which mistakes apply, what the deliverable looks like when done. Non-trivial tasks fail when this is skipped. |
| **Execute** | Implement per the plan. Follow existing patterns. Keep changes minimal and focused. Do not introduce new patterns when existing ones work. Do not add error handling, abstractions, or features beyond what the delegation prompt specifies. |
| **Verify** | Before reporting back: implementation meets the acceptance criteria; existing tests pass; mistakes respected; change is minimal (no scope creep); if `.claude/` was touched, related docs are still accurate. Re-verify the precondition: correct branch is checked out and no unexpected state changes occurred. |
| **Commit** (when git is active) | Commit only after verification passes — never unverified work. One focused commit per subtask. Conventional Commits format. Subagents commit but never push; the manager owns pushing and PR creation. |

The final response the executor returns is captured as the work artifact: what was done, what changed, what was learned, any open items. Self-contained — the manager and downstream agents read it as the permanent record of this task.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Execution-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract)
- **Output path**: per-iter scoped at `sessions/{date}-{session-id}/execution/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus is built from [`execution/evaluation.md`](../../execution/evaluation.md) — implementation match, build/test status (verified via tools), security, mistake compliance, scope discipline, supply-chain, observability, privacy
- **Tool verification is critical at Execution** — evaluators run tests, type checks, and `grep`/`rg` to anchor confidence ≥ 75 (subject to the verification preflight in [`evaluation/SKILL.md`](../../evaluation/SKILL.md))

---

## MEMORIZATION Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. For Execution, the assistant integrates the executor's work artifact, both systems' evaluator findings, and the discussion log into the task's `execution/artifacts/` files. The Execution Loop iterates per-task — each task produces its own `artifacts/` directory under its task subdirectory.

### Per-iteration session-memory commit cadence

After every iteration's MEMORIZATION completes (`PASS`, `REVISE`, or `FAIL`) for the current task, the manager creates a session-memory commit on the worktree branch capturing the iteration's outputs (the task's `rawdata/`, `evaluation/iter{n}/`, `artifacts/`, and the `session.json` upsert). Because Execution iterates per task, the subject embeds the task id so each task's iters are independently identifiable. The commit subject is:

```
chore(session): record execution-{task-id} iter{n} memory
```

with the canonical `AI-Provenance-Record:` trailer in the commit body per `git/conventions.md:116-119`. Use the heredoc form so the trailer actually lands:

```
git -C "$worktreePath" commit -m "$(cat <<'EOF'
chore(session): record execution-{task-id} iter{n} memory

AI-Provenance-Record: gobbi://session/{session-id}/loop/execution/task/{task-id}/iter{n}
EOF
)"
```

Substitute `{session-id}`, `{task-id}`, and `{n}` from session state. The commit lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 1 (Create Worktree)) and is absorbed into the PR at merge. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding. This session-memory commit is distinct from the executor's own task-implementation commit (the "Commit" lifecycle phase above) — the implementation commit ships code per the task's contract; the session-memory commit ships the iteration's audit trail.

---

## ITER / EXIT Decision

Per task:

| Verdict | Action |
|---|---|
| `PASS` | Move to next task in the Plan |
| `REVISE` | Re-enter `DISCUSSION` for THIS task with eval findings |
| `FAIL` | Escalate; user decides revise / abort / skip |

Iteration cap is `workflow.execution.maxIterations` per task (default 5).

When all tasks `PASS`, the loop exits and the Wrap-up Loop begins.

---

## Output

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/execution/
└── {task-id}/
    ├── artifacts/           ← per-task PASS-iter output files
    ├── rawdata/
    └── evaluation/
        ├── claude/{perspective}.md
        └── codex/{perspective}.md
```

---

## Cross-references

- Execution Loop phase contracts (executor lifecycle, memory access, status enum) → [`execution/SKILL.md`](../../execution/SKILL.md)
- Execution-phase evaluation seed scenarios → [`execution/evaluation.md`](../../execution/evaluation.md)
- Executor behavioral discipline → [`principles`](../../principles/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Synthesis orchestration → [`workflow/memorization.md`](memorization.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Executor delegation template → [`delegation/templates/executor.md`](../../delegation/templates/executor.md)
- Git/worktree workflow → [`git` skill](../../git/SKILL.md)
