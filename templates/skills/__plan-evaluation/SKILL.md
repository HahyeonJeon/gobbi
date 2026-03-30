---
name: __plan_evaluation
description: MUST load when evaluating a plan. Provides stage-specific criteria for assessing whether tasks are specific, correctly ordered, complete, and ready for delegation. Used by all 5 evaluator perspectives (Project, Architecture, Performance, Aesthetics, Overall).
allowed-tools: Read, Grep, Glob, Bash
---

# Gobbi Plan Evaluation

Stage-specific evaluation criteria for plan output. Load this skill alongside _evaluation when evaluating the result of a planning step.

A plan should be a set of narrow, specific, ordered tasks that a delegator can hand off to specialists without ambiguity. If a task requires the agent to guess, the plan isn't ready.

---

## What You're Evaluating

The plan should contain: a goal statement, numbered tasks with agent assignments and skill requirements, execution order with dependency reasoning, expected outcome, and collection plan. Evaluate against the criteria below.

---

## Evaluation Criteria

### Task Specificity

- **Deliverable clear?** — Does each task state exactly what to produce? "Improve the auth module" fails. "Add rate limiting middleware to /api/login with 5 req/min per IP, returning 429" passes.
- **Scope bounded?** — Does each task state what it should NOT touch? Without explicit boundaries, agents expand scope.
- **Agent assigned?** — Is each task assigned to a specific agent type with skills to load? Implicit agent selection leads to wrong agents.
- **Self-contained?** — Can the assigned agent understand the full scope from the task description alone, without reading other tasks?

### Dependency Ordering

- **Dependencies correct?** — Would executing tasks in the stated order actually work? If Task 3 needs Task 2's output, is that dependency stated?
- **Parallelism maximized?** — Are independent tasks marked for parallel execution? Serial execution of independent tasks wastes time.
- **No circular dependencies?** — Does Task A depend on Task B which depends on Task A?
- **File conflicts avoided?** — Do any parallel tasks modify the same files? If so, they need sequencing or merging.

### Completeness

- **Full scope covered?** — Does the plan address everything from the approved idea? Compare task list against the idea document point by point. Missing scope is the most common plan failure.
- **Verification criteria defined?** — Does each task specify what "done" looks like? Without criteria, evaluation has nothing to check against.
- **Collection plan included?** — Does the plan specify where work docs will be written and what subtask files will be created?
- **Nothing added beyond scope?** — Does the plan introduce tasks that weren't in the approved idea? Scope creep starts in planning.

### Feasibility

- **Tasks right-sized?** — Is each task small enough that a single agent can complete it without losing focus, but large enough to be worth the delegation overhead?
- **Agent capabilities matched?** — Does each assigned agent have the tools and domain knowledge for its task?
- **Wave size reasonable?** — No more than 8 parallel tasks per wave. Beyond that, coordination overhead exceeds parallelism benefit.
- **Gotchas respected?** — Does the plan account for known pitfalls in this domain? Check gotchas against planned approach.

---

## Stance-Specific Focus

| Stance | Primary Focus |
|--------|--------------|
| Positive | Which tasks are well-decomposed and clearly scoped? Which dependency decisions are sound? |
| Moderate | Is the plan complete against the idea? Are tasks proportionally sized? Are dependencies and parallelism balanced? |
| Critical | Which tasks are too vague to delegate? Where are dependencies wrong or missing? What scope was dropped or added without justification? |
