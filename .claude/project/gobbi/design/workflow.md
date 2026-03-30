# Workflow

## Core Principle: The Logic of Good Work

Every non-trivial task follows a cycle of creation and evaluation:

```
ideate → evaluate → improve → plan → evaluate → improve → execute → evaluate → fix or next
```

Each stage produces output, each evaluation catches problems before they propagate, and each improvement refines before moving forward. Never skip evaluation between stages.

## The Four Steps

The orchestrator tracks progress using TaskCreate. Each step loads specific skills.

| Step | Purpose | Skills Loaded |
|------|---------|---------------|
| Step 1: Ideation Loop | Discuss, evaluate, improve the idea | gobbi-discuss, gobbi-ideation, gobbi-ideation-evaluation |
| Step 2: Plan Loop | Plan, discuss, evaluate, improve the plan | gobbi-plan, gobbi-discuss, gobbi-plan-evaluation |
| Step 3: Execution | Delegate subtasks, evaluate each output | gobbi-delegation, gobbi-execution-evaluation |
| Step 4: Collection | Write notes, persist workflow trail | gobbi-collection, gobbi-note |

### Step 1: Ideation Loop

Loop until the idea is solid:

1. **Discuss** — use AskUserQuestion to refine the idea with the user
2. **Evaluate** — spawn 3 evaluator agents (positive, moderate, critical) to assess
3. **Improve or loop** — if evaluators find issues, refine and loop back

### Step 2: Plan Loop

Loop until the plan is solid:

1. **Plan** — decompose the approved idea into narrow, specific, ordered tasks
2. **Discuss** — review the plan with the user via AskUserQuestion
3. **Evaluate** — spawn 3 evaluator agents to assess the plan
4. **Improve or loop** — if evaluators find issues, refine and loop back

### Step 3: Execution

1. Delegate each subtask to a specialist subagent with fresh context
2. After each subtask, spawn 3 evaluator agents to assess the output
3. If evaluation fails, fix and re-evaluate before next subtask

### Step 4: Collection

1. Write all notes (ideation, plan, execution) to the work directory
2. Record any gotchas discovered during execution
3. Ask the user: FEEDBACK, REVIEW, or FINISH?

## Three Phases of Work

### Phase 1: TASK

The main implementation phase. Run the full workflow (Step 1 → Step 2 → Step 3 → Step 4).

After TASK completes: ask FEEDBACK, REVIEW, or FINISH?

### Phase 2: FEEDBACK

The user inspects results and provides iterative feedback. Optimized for speed:
- Skip planning — the architecture is established
- Fix directly or delegate small scoped tasks
- Record gotchas from corrections

After FEEDBACK completes: ask REVIEW or FINISH?

### Phase 3: REVIEW

Full workflow again (Step 1 → Step 2 → Step 3 → Step 4) focused on quality verification. Creates a separate work directory.

After REVIEW completes: ask FEEDBACK or FINISH?

### FINISH

When selected: ask commit and compact, commit only, or compact only.

## Discussion at Every Stage

Discussion (gobbi-discuss) is not a separate phase — it happens at every step. Agents must be critical discussants: challenge vague thinking, surface hidden problems, give opinions, recommend approaches. AskUserQuestion is the primary tool.

## Notes at Every Step

Notes (gobbi-note) are written at every workflow step — ideation, plan, execution, feedback, review. Notes record decisions, outcomes, and context. Never deferred, never skipped.

## Evaluation Model

Evaluation uses 3 independent agents with different stances:
- **Positive** — finds strengths and what to preserve
- **Moderate** — checks completeness and balance
- **Critical** — stress-tests assumptions and finds hidden flaws

Verdicts: PASS, REVISE (max 3 cycles), or ESCALATE to user. Stance disagreements are surfaced as valuable signal.
