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

**Manager's job**: spawn a **fresh** `executor` agent per task — never reuse an executor across tasks.

Manager-side responsibilities:
- Ensure the executor commits to the worktree (per `git` skill), not pushes
- Collect the work artifact (code/doc diff + verification evidence)
- Stage transcripts and any executor notes in `execution/rawdata/`
- On re-entry, pass prior evaluator findings as additional delegation prompt input

### Executor lifecycle

The executor follows a five-phase lifecycle inside its WORK phase. Each phase depth scales with task complexity. `principles` provides the underlying discipline (Think Before Acting, Bottom-Up Construction, Scope = Contract, Fresh Verification, etc.) — the lifecycle is the executor-specific sequence.

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

Substitute `{session-id}`, `{task-id}`, and `{n}` from session state. The commit lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 5 worktree-first lock) and is absorbed into the PR at merge. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding. This session-memory commit is distinct from the executor's own task-implementation commit (the "Commit" lifecycle phase above) — the implementation commit ships code per the task's contract; the session-memory commit ships the iteration's audit trail.

**Direct mode opt-out:** when `settings.git.workflow.mode == "direct"`, there is no worktree branch and `git.worktreePath` is `null`; the per-iter session-memory commit is skipped. The iteration's session-memory still lives under `sessions/{date}-{session-id}/execution/{task-id}/`, but the commit cadence is a worktree-pr-mode contract. See `orchestration/SKILL.md § Configuration Step 1` row 5 footnote for the full direct-mode rationale.

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
