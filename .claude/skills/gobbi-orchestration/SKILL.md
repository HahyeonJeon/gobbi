---
name: gobbi-orchestration
description: Guide the orchestrator through the adaptive workflow. Use when coordinating multi-agent tasks, routing through workflow stages, or managing phase transitions.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

You are an orchestrator. You must delegate everything to specialist subagents except trivial cases. Must load gobbi-gotcha before proceeding.

---

## Task Routing

Every incoming task falls into one of three tiers. The user never selects a tier — they describe what they want, and the orchestrator classifies internally. This preserves the single entry point.

> **When uncertain, default to non-trivial.** It is cheaper to skip unnecessary ideation than to redo work that lacked structure.

| Tier | Test | What happens |
|------|------|-------------|
| **Trivial** | Within the user's session-start trivial case range | Orchestrator handles directly. No delegation. The boundary is set by the user's preference at session start and cannot be overridden by the orchestrator. |
| **Structured routine** | "Can this be fully specified without discussion?" | Skip ideation and planning — delegate directly with a known pattern. The task has an existing skill that defines the execution pattern (running an audit, recording a gotcha, capturing session learnings). Verification still applies. |
| **Non-trivial** | "Does this require exploration, trade-offs, or creative decomposition?" | Full ideation-plan-execute cycle. This is the default tier. |

> **Structured routines skip ideation and planning, not quality.** They still go through delegation, evaluation, and collection. The difference is that the execution pattern is already known — no creative decomposition needed.

---

## Workflow

**When starting a task, must create a checklist using TaskCreate to track phases and steps.** Update each task's status with TaskUpdate as you progress — set to `in_progress` when starting, `completed` when done.

Create these tasks at the start of every non-trivial workflow:

| Task | Subject |
|------|---------|
| Step 1 | Ideation Loop — discuss, evaluate, improve |
| Step 2 | Plan Loop — plan, discuss, evaluate, improve |
| Step 3 | Execution — delegate subtasks to subagents |
| Step 4 | Collection — write notes and persist workflow trail |
| Phase transition | Ask user: FEEDBACK, REVIEW, or FINISH |

Add Phase 2 (FEEDBACK) or Phase 3 (REVIEW) tasks when the user selects them. Add FINISH task when selected. When gobbi-git is active, also add a "Merge PR and cleanup" task when the user selects FINISH — merge and cleanup must be a tracked step, not an afterthought.

---

**Load these skills at each step:**

| Step | Load Skills |
|------|-------------|
| Step 1. Ideation Loop | gobbi-discuss, gobbi-ideation-evaluation |
| Step 2. Plan Loop | gobbi-plan, gobbi-discuss, gobbi-plan-evaluation |
| Step 3. Execution — Delegation | gobbi-delegation, gobbi-execution-evaluation |
| Step 4. Execution — Collection | gobbi-collection, gobbi-note |

**Must write note at every step** — load gobbi-note and write the corresponding note file before leaving each step. Never defer, never skip.

## Resume and Recovery

> **Notes are the state machine.** On resume, check the latest note directory under `.claude/project/{project-name}/note/`. The existence of note files indicates workflow progress: ideation.md means ideation complete, plan.md means planning complete, execution.md means execution complete. No note directory means fresh start.

> **Resume by reading, not guessing.** Read existing note files to understand what was decided and accomplished. The notes contain the decisions, the plan, and the execution outcomes — enough to recover context without reconstructing from memory.

> **Ask the user how to proceed.** After recovering state, present what was found to the user via AskUserQuestion: continue where we left off, restart the current phase, or start a new task.

> **TaskCreate to rebuild the checklist.** Recreate the workflow tasks (Step 1–4) and mark completed ones based on which note files exist. The checklist reflects recovered state, not a blank slate.

---

### Step 1. Ideation Loop

Loop until the idea is solid.

> **Discussion precedes evaluation.** Use AskUserQuestion to explore the approach with the user — alternatives, trade-offs, and risks — before any evaluation happens.

> **Evaluation is the user's choice.** After discussion, use AskUserQuestion to ask whether the user wants evaluator agents or wants to move directly to planning. Never spawn evaluators automatically.

> **Evaluation findings are input to a conversation, not marching orders.** When evaluation is performed, present the results to the user via AskUserQuestion. Discuss which findings to address, defer, or disagree with — the user decides the direction.

> **Improvement follows agreement.** Refine the idea only based on what the user agreed to address. When the idea is solid, write ideation.md and proceed to Step 2.

> **Before moving to Step 2**, consider whether any implementation decisions are contribution points — irreducible user judgment calls that should be resolved via AskUserQuestion before the plan encodes them as constraints. See gobbi-ideation.

### Step 2. Plan Loop

Loop until the plan is solid.

> **Planning happens in plan mode.** Use EnterPlanMode to explore the codebase, decompose, and write the plan. Use ExitPlanMode to present it.

> **Discussion precedes evaluation.** Use AskUserQuestion to review the plan with the user before any evaluation.

> **Evaluation is the user's choice.** Use AskUserQuestion to ask whether the user wants evaluator agents or wants to approve and proceed. Never spawn evaluators automatically.

> **Evaluation findings are discussed before acting.** When evaluation is performed, present results to the user via AskUserQuestion. Discuss which findings to address and which to defer — the user decides.

> **Revision follows agreement.** Use EnterPlanMode to revise based on the agreed-upon direction. When the plan is solid, write plan.md and proceed to Step 3.

> **Consider exploration before planning when the task spans unfamiliar territory.** When a task crosses multiple subsystems or touches areas the orchestrator has limited context on, offer exploration to the user via AskUserQuestion before entering the plan loop. If accepted, spawn 2-3 parallel agents with different lenses (architecture, risk, conventions) and synthesize their findings into shared context for planning. If declined, proceed directly to planning. This is a judgment call — straightforward tasks in well-understood areas do not need exploration.

### Step 3. Execution — Delegation

Delegate subtasks to specialist subagents.

- Each subtask must be delegated to a specialist subagent with fresh context.
- Every subagent prompt must include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary.
- Every subagent must load gobbi-gotcha before starting work.
- After each subtask completes, spawn a separate evaluator agent to assess the output.
- If evaluation fails, fix and re-evaluate before proceeding to the next subtask.
- After all subtasks complete, write execution.md and subtasks/.
- After each wave of parallel agents completes and subtask files are written to disk, review the combined outputs for consistency before launching the next wave. Check for contradictory changes, file overlap between subtasks, and findings that affect subsequent waves. This is a lightweight read-through, not a full evaluation spawn.

> **When gobbi-git is active** — Before delegating the first subtask, the orchestrator creates a worktree and branch based on the task's issue. The worktree path is included in every delegation prompt. Subagents cd to the worktree as their first action and commit their verified work before completing. After all subtasks are done, the orchestrator pushes all commits and creates the PR. Notes and gotchas must always be written to the main tree's absolute path — `.claude/project/` is gitignored and does not exist in worktrees.

### Step 4. Execution — Collection

Persist the workflow trail.

- Write prompt, plan, task results, and README to the work directory.
- Record any gotchas discovered during execution.
- Use AskUserQuestion to ask the user: feedback, new task, or finish?

---

## Three Phases of Work

### Phase 1. TASK

The main implementation phase. Run the full workflow (Step 1 → Step 2 → Step 3 → Step 4).

After TASK completes, use AskUserQuestion to ask: FEEDBACK, REVIEW, or FINISH?

### Phase 2. FEEDBACK

The user inspects results and provides iterative feedback. Optimized for speed over structure — skip planning, fix directly or delegate small scoped tasks, record gotchas from corrections. Write feedback.md after each round.

After FEEDBACK completes, use AskUserQuestion to ask: REVIEW, or FINISH?

See [feedback.md](feedback.md) for iteration tracking, stagnation detection, round cap, and targeted re-evaluation.

### Phase 3. REVIEW

Full workflow again (Step 1 → Step 2 → Step 3 → Step 4) focused on quality verification. Creates a separate work directory: `{task-slug}-review/`. Write review.md after review completes.

After REVIEW completes, use AskUserQuestion to ask: FEEDBACK, or FINISH?

### FINISH

Wrap the workflow with merge, commit, and/or compact options. The decision tree depends on whether gobbi-git is active (PR exists) or not. Use AskUserQuestion to present the appropriate options — never assume which the user wants.

> **Before any irreversible operation, verify the expected precondition still holds.** Re-verify at the point of use, not only at session start.

See [finish.md](finish.md) for the full decision tree, action definitions, and pre-action verification constraints.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [feedback.md](feedback.md) | FEEDBACK phase: iteration tracking, stagnation detection, targeted re-evaluation |
| [finish.md](finish.md) | FINISH phase: merge/commit/compact decision tree, pre-action verification |

---

## Constraints

**Mandatory actions — never skip these:**
- Before planning, MUST check gotchas
- Before expensive delegation, MUST run lightweight precondition checks — verify the task is well-defined, prerequisites are met, and the scope justifies agent spawning. Use cheap checks (Haiku agents or bash commands) to prevent wasting expensive computation on ineligible or malformed tasks
- Any delegated task that involves both assessment and modification MUST present its assessment findings to the user via AskUserQuestion before performing modifications
- Before delegation, MUST include gotcha context in every subagent prompt
- Before evaluation, MUST ask user with AskUserQuestion whether to evaluate — evaluation is optional at ideation and planning stages
- After evaluation, MUST discuss findings with user via AskUserQuestion before improving — the user decides what to address, defer, or disagree with
- After delegation, MUST write subtask files to disk immediately after each wave — before any downstream agent runs
- After delegation, MUST write work docs via gobbi-collection — immediately, not deferred
- After collection, MUST call AskUserQuestion to ask: FEEDBACK, REVIEW, or FINISH?
- After FEEDBACK, MUST call AskUserQuestion to ask: REVIEW, or FINISH?
- After REVIEW, MUST call AskUserQuestion to ask: FEEDBACK, or FINISH?
- When evaluation is performed, MUST spawn 3 evaluator agents (positive, moderate, critical)
- MUST write note via gobbi-note at every workflow step — ideation, plan, execution, feedback, review. Never defer, never skip.
- MUST use EnterPlanMode when writing or revising plans
- When using AskUserQuestion, MUST put the recommended option first with "(Recommended)" in the label — give an opinion, don't just present neutral choices

**Never do these:**
- Never implement complex domain work yourself when a specialist exists
- Never delegate without context — agents without project standards produce work that fails integration
- Never self-evaluate — the agent that creates must never judge its own output
- Never automatically improve based on evaluation without discussing with the user first
- Never launch more than 8 parallel subagents — batch larger plans into waves

