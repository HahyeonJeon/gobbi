---
name: _orchestration
description: Deprecated in v0.5.0 — historical reference for the v0.4.x skill-based 7-step workflow. Workflow control now lives in the CLI's step specs (see ARCHIVED.md and design/v050-overview.md).
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

> **⚠ Deprecated in v0.5.0** — see [ARCHIVED.md](ARCHIVED.md) for historical reference.
> Workflow control now lives in the CLI's step specs; see [`design/v050-overview.md`](../../project/gobbi/design/v050-overview.md).

You are an orchestrator. You must delegate everything to specialist subagents except trivial cases. Must load _gotcha before proceeding. When loading this skill, also load _note, _evaluation, _discuss, and _delegation — they are needed at every workflow step.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [feedback.md](feedback.md) | FEEDBACK phase: lightweight fix cycle after Review, iteration tracking, stagnation detection |
| [finish.md](finish.md) | FINISH phase: merge/commit/compact decision tree, pre-action verification |
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _orchestration |

---

## Task Routing

Every incoming task falls into one of three tiers. The user never selects a tier — they describe what they want, and the orchestrator classifies internally. This preserves the single entry point.

> **When uncertain, default to non-trivial.**

It is cheaper to skip unnecessary ideation than to redo work that lacked structure.

| Tier | Test | What happens |
|---|---|---|
| **Trivial** | Within the user's session-start trivial case range | Orchestrator handles directly. No delegation. The boundary is set by the user's preference at session start and cannot be overridden by the orchestrator. |
| **Structured routine** | "Can this be fully specified without discussion?" | Skip Ideation, Planning, and Research — delegate directly with a known pattern. The task has an existing skill that defines the execution pattern (running an audit, recording a gotcha, capturing session learnings). Verification still applies. May skip Research if the execution pattern is fully known. |
| **Non-trivial** | "Does this require exploration, trade-offs, or creative decomposition?" | Full 7-step workflow. This is the default tier. |

> **Structured routines skip Ideation, Planning, and Research — not quality.**

They still go through Execution, Collection, Memorization, and Review. The difference is that the execution pattern is already known — no creative decomposition or research needed.

---

## Workflow

**When starting a task, must initialize notes and create a checklist.** Run `gobbi note init {project-name} {task-slug}` immediately after classifying a task as non-trivial. This creates the note directory with all subdirectories before any work begins. The returned path is the **note directory** — pass it to every subagent so they can write directly to it. Then create a checklist using TaskCreate to track steps. Update each task's status with TaskUpdate as you progress — set to `in_progress` when starting, `completed` when done.

Create these tasks at the start of every non-trivial workflow:

| Task | Subject |
|---|---|
| Step 1 | Ideation — discuss, spawn PI agents (innovative + best), synthesize |
| Step 2 | Planning — plan, discuss, evaluate, improve |
| Step 3 | Research — spawn researchers (innovative + best), synthesize |
| Step 4 | Execution — delegate subtasks to executors |
| Step 5 | Collection — write notes, verify, record gotchas |
| Step 6 | Memorization — save context for session continuity |
| Step 7 | Review — spawn PI agents (innovative + best), verdict + docs |
| Phase transition | Ask user: FEEDBACK or FINISH? |

Add FEEDBACK tasks when the user selects FEEDBACK after Review. Add FINISH task when selected. When _git is active, also add a "Merge PR and cleanup" task when the user selects FINISH — merge and cleanup must be a tracked step, not an afterthought.

---


**Must load at workflow start — these are needed at every step:** _note, _evaluation, _discuss, _delegation

**Load at each step:**

| Step | Load Skills |
|---|---|
| Step 1. Ideation | _ideation + project-specific evaluation skills |
| Step 2. Planning | _plan + project-specific evaluation skills |
| Step 3. Research | _research + project-specific evaluation skills |
| Step 4. Execution | _delegation |
| Step 5. Collection | _collection |
| Step 6. Memorization | _memorization |
| Step 7. Review | _ideation (for context) |

**Project-specific evaluation skills** — each step that supports evaluation needs the project's evaluation skills loaded into evaluator agents. Projects define their own evaluation criteria tailored to their domain, tech stack, and quality standards. The orchestrator loads the project's evaluation skills for each step.

**Must write note at every step** — write the corresponding note file before leaving each step. Never defer, never skip.

---

## Resume and Recovery

> **Notes are the state machine.**

On resume, check the latest note directory under `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/note/`. The existence of subdirectories and note files indicates workflow progress: `ideation/` means Ideation complete, `plan/` means Planning complete, `research/` means Research complete, `execution/` means Execution complete, `review/` means Review complete. No note directory means fresh start.

> **Resume by reading, not guessing.**

Read existing note files to understand what was decided and accomplished. The notes contain the decisions, the plan, the research findings, and the execution outcomes — enough to recover context without reconstructing from memory.

> **Ask the user how to proceed.**

After recovering state, present what was found to the user via AskUserQuestion: continue where we left off, restart the current step, or start a new task.

> **TaskCreate to rebuild the checklist.**

Recreate the workflow tasks (Step 1–7) and mark completed ones based on which note subdirectories exist. The checklist reflects recovered state, not a blank slate.

---


### Evaluation

Evaluation is delegation — the orchestrator **never** evaluates directly. Spawn independent evaluator subagents, each loaded with the appropriate stage-specific evaluation skill and domain-relevant skills for the task.

> **At least 2 evaluators with different perspectives.**

A single evaluator catches the problems it is trained to see. Multiple perspectives catch the problems that fall between any single viewpoint. Select perspectives based on the task's domain and the project's needs — the right perspectives vary by project and task type.

> **Each evaluator gets domain context, not just evaluation criteria.**

An evaluator with only an evaluation perspective skill lacks the context to judge whether the work fits the project. Include domain-relevant skills, project-specific rules, gotchas, and conventions in the evaluator's prompt so it can assess quality against the standards that actually matter for this project.

> **MUST ask evaluation via AskUserQuestion at Steps 1–4.**

The orchestrator MUST call AskUserQuestion to ask whether to evaluate or skip at every evaluation point. This is mandatory — never skip the question, never ask in prose. Recommend evaluating (put it first with '(Recommended)'). Only skip evaluation if the user explicitly chooses to. Catching problems early is cheaper than catching them late. Each step loops if evaluation finds issues.

---


### Step 1. Ideation

Loop until the idea is solid.

> **Discussion precedes PI agents.**

Use AskUserQuestion to explore the approach with the user — alternatives, trade-offs, and risks — before spawning any agents. The orchestrator discusses first, then delegates.

> **Spawn PI agents with innovative + best stances in parallel.**

After discussion, spawn two PI agents: one with the innovative stance and one with the best stance. Each writes their perspective independently. The orchestrator synthesizes their outputs into `ideation.md`.

> **MUST ask evaluation via AskUserQuestion — default is evaluate.**

After synthesis, MUST call AskUserQuestion to ask whether the user wants to **skip** evaluation or proceed with evaluation (recommended). This call is mandatory — never skip, never ask in prose. Spawn evaluators unless the user explicitly opts out.

> **Evaluation findings are input to a conversation, not marching orders.**

When evaluation is performed, present the results to the user via AskUserQuestion. Discuss which findings to address, defer, or disagree with — the user decides the direction. If issues are found, loop back and refine.

> **Improvement follows agreement.**

Refine the idea only based on what the user agreed to address. When the idea is solid, write `ideation.md` to the `ideation/` subdirectory and proceed to Step 2.

> **Write notes before leaving this step.**

Write ideation.md (orchestrator synthesis), innovative.md and best.md (PI agent outputs) to ideation/. If evaluation was performed, evaluation files go to ideation/evaluation/. Notes must contain full content — complete ideas, trade-offs, and evaluation findings — not summaries.

> **Before moving to Step 2**, consider whether any implementation decisions are contribution points — irreducible user judgment calls that should be resolved via AskUserQuestion before the plan encodes them as constraints. See _ideation.

### Step 2. Planning

Loop until the plan is solid.

> **Planning happens in plan mode.**

Use EnterPlanMode to explore the codebase, decompose, and write the plan. Use ExitPlanMode to present it.

> **Discussion precedes evaluation.**

Use AskUserQuestion to review the plan with the user before any evaluation.

> **MUST ask evaluation via AskUserQuestion — default is evaluate.**

MUST call AskUserQuestion to ask whether the user wants to **skip** evaluation or proceed with evaluation (recommended). This call is mandatory — never skip, never ask in prose. Spawn evaluators unless the user explicitly opts out.

> **Evaluation findings are discussed before acting.**

When evaluation is performed, present results to the user via AskUserQuestion. Discuss which findings to address and which to defer — the user decides. If issues are found, loop back and revise.

> **Revision follows agreement.**

Use EnterPlanMode to revise based on the agreed-upon direction. When the plan is solid, write `plan.md` with the full plan content — context, root cause, every change with rationale, files affected, and verification criteria. Copy the complete plan from the plan file into the note, not a summary. Then proceed to Step 3.

> **Consider exploration before planning when the task spans unfamiliar territory.**

When a task crosses multiple subsystems or touches areas the orchestrator has limited context on, offer exploration to the user via AskUserQuestion before entering the plan loop. If accepted, spawn 2-3 parallel agents with different lenses (architecture, risk, conventions) and synthesize their findings into shared context for planning. If declined, proceed directly to planning. This is a judgment call — straightforward tasks in well-understood areas do not need exploration.

> **Write notes before leaving this step.**

Write `plan.md` to `plan/` — the Revision follows agreement principle above specifies the content requirements. If evaluation was performed, evaluation files go to `plan/evaluation/`.

### Step 3. Research

Investigate "how to do" for the approved plan. Research is mandatory for non-trivial tasks but may be skipped for structured routines where the execution pattern is fully known.

> **Spawn researcher agents with innovative + best stances in parallel.**

Each researcher investigates the approved plan from their stance. The innovative researcher explores novel approaches, alternative implementations, and creative solutions. The best researcher investigates proven patterns, established conventions, and reliable methods. Each writes their findings to the `research/` subdirectory.

> **Collect before synthesizing.**

After both researchers complete, run `gobbi note collect` with the `research` phase argument to extract their outputs. The orchestrator then synthesizes both researcher outputs into `research.md` in the `research/` subdirectory.

> **MUST ask evaluation via AskUserQuestion — default is evaluate.**

After synthesis, MUST call AskUserQuestion to ask whether the user wants to **skip** evaluation or proceed with evaluation (recommended). This call is mandatory — never skip, never ask in prose. If evaluation finds issues, loop back and refine the research. Research quality directly determines execution quality.

> **Write notes before leaving this step.**

Write research.md (orchestrator synthesis), innovative.md and best.md (researcher outputs) to research/. If evaluation was performed, evaluation files go to research/evaluation/. Notes must contain full research findings — approaches investigated, trade-offs analyzed, recommendations — not summaries.

When the research is solid, proceed to Step 4. Executors MUST read the research materials before implementing.

### Step 4. Execution

Delegate subtasks to specialist subagents.

> **Executors must read research materials before implementing.**

Every executor delegation prompt must include a directive to read the `research/` subdirectory contents before starting implementation. Research findings contain the investigated approaches, trade-offs, and recommended patterns that inform execution decisions.

> **Delegate Claude Code tasks to gobbi-agent.**

Any subtask involving `.claude/` documentation — creating or improving skills, agents, rules, CLAUDE.md, hooks, settings, or project docs — MUST be delegated to `gobbi-agent` with the appropriate skills loaded (_claude, _skills, _agents, _rules, etc.). `gobbi-agent` is the Claude Code specialist. The `__executor` handles code implementation; `gobbi-agent` handles Claude Code configuration.

> **Tell specialists what to do, not how to do it.**

Define the goal, constraints, and what to avoid. Detailed "how" instructions suppress specialist agents' ability and potential. Provide guardrails about what not to do, and message that promotes the specialist's best work — project rules, gotchas, conventions, domain knowledge. See _delegation for the full briefing model.

- Each subtask must be delegated to a specialist subagent with fresh context.
- Every subagent prompt must include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary.
- Every subagent must load _gotcha before starting work.
- After each subtask completes, run `gobbi note collect` with the `--phase execution` flag to extract the subagent's record from its transcript. The orchestrator extracts the agent-id from the Agent tool result (returned as `agentId` at the end of the result).
- If evaluation is performed and fails, fix and re-evaluate before proceeding to the next subtask.
- After all subtasks complete, write `execution.md` to the `execution/` subdirectory. Subtask JSON files are already on disk from the per-subtask `gobbi note collect` calls.
- After each wave of parallel agents completes and subtask files are written to disk, review the combined outputs for consistency before launching the next wave. Check for contradictory changes, file overlap between subtasks, and findings that affect subsequent waves. This is a lightweight read-through, not a full evaluation spawn.

> **When _git is active**

Before delegating the first subtask, the orchestrator creates a worktree and branch based on the task's issue. The worktree path is included in every delegation prompt. Subagents cd to the worktree as their first action and commit their verified work before completing. After all subtasks are done, the orchestrator pushes all commits and creates the PR. Notes and gotchas must always be written to the main tree's absolute path — `$CLAUDE_PROJECT_DIR/.claude/project/` is gitignored and does not exist in worktrees.

> **MUST ask evaluation via AskUserQuestion after each subtask — default is evaluate.**

After each subtask completes and gobbi note collect extracts the output, MUST call AskUserQuestion to ask whether to evaluate or skip. Spawn evaluator agents unless the user explicitly opts out. If evaluation fails, fix and re-evaluate before proceeding to the next subtask.

> **Write notes before leaving this step.**

Write execution.md to execution/ with per-subtask results, issues encountered, and deviations from plan. If evaluation was performed, evaluation files go to execution/evaluation/. Notes must contain full execution outcomes, not summaries.

### Step 5. Collection

Persist the workflow trail.

- Verify all note subdirectories are populated: `ideation/`, `plan/`, `research/`, `execution/` should each contain their respective note files.
- Write the task `README.md` summarizing the workflow: what was decided, what was researched, what was executed, and the outcome.
- Record any gotchas discovered during execution.

### Step 6. Memorization

Save context that enables the user to continue this work in a new session.

- Memorize details of the completed task — what was done, what decisions were made, what remains open.
- If the task is part of a larger user plan, memorize the broader plan context and where this task fits.
- Update gotchas from any corrections discovered during the workflow.
- Update project docs in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/` if the workflow revealed new architectural knowledge, conventions, or decisions worth persisting.

### Step 7. Review

Independent quality review by PI agents.

> **Spawn PI agents with innovative + best stances in parallel, using sonnet model.**

Review is assessment, not creation. Use the Agent tool's `model: "sonnet"` parameter to override PI agents to sonnet tier for all review tasks — both Step 7 Review and any other review-type delegation. This applies to every review task, not just Step 7. Sonnet provides rigorous analytical assessment at max effort without the cost of opus. Each PI agent reviews the completed work from their stance. The innovative reviewer looks for missed opportunities and creative improvements. The best reviewer assesses against established quality standards and correctness. Each writes their review to the `review/` subdirectory — `innovative.md` and `best.md`.

> **Each review includes a verdict: pass, fail, or needs-work.**

The verdict is a clear signal. "pass" means the work meets quality standards. "fail" means fundamental issues require rework. "needs-work" means targeted fixes can bring the work to standard. After both PI agents complete, the orchestrator synthesizes their verdicts into `review/review.md` — a combined verdict and summary presented to the user.

> **Reviews produce documentation for future sessions.**

Beyond the verdict, each reviewer documents patterns observed, decisions worth preserving, and lessons learned. This documentation persists in the `review/` subdirectory and informs future work on the same codebase.

> **Write notes before leaving this step.**

After both PI agents complete, write review.md (orchestrator synthesis of verdicts) to review/. PI agent outputs go to review/innovative.md and review/best.md. Notes must contain full review findings and verdicts, not summaries.

After Review completes, use AskUserQuestion to ask the user: FEEDBACK or FINISH?

If either verdict is "fail" or "needs-work", recommend FEEDBACK. If both verdicts are "pass", recommend FINISH.

---

## After Review

### FEEDBACK

Lightweight fix cycle. FEEDBACK happens after Review when the user wants to address issues found by reviewers or provide their own corrections.

FEEDBACK skips Ideation, Planning, and Research — the architecture and research are established. Delegate small, scoped fixes to executors. Record gotchas from corrections.

After FEEDBACK fixes are applied, return to Review (Step 7). PI agents re-review the updated work. After the new Review, ask the user again: FEEDBACK or FINISH?

The cycle is: FEEDBACK → Review → (FEEDBACK or FINISH).

See [feedback.md](feedback.md) for iteration tracking, stagnation detection, round cap, and targeted re-evaluation.

### FINISH

Wrap the workflow with merge, commit, and/or compact options. The decision tree depends on whether _git is active (PR exists) or not. Use AskUserQuestion to present the appropriate options — never assume which the user wants.

> **Before any irreversible operation, verify the expected precondition still holds.**

Re-verify at the point of use, not only at session start.

See [finish.md](finish.md) for the full decision tree, action definitions, and pre-action verification constraints.

---

## Next Task Guidance

> **After FINISH completes, guide the user toward a clean start for the next task.**

A completed workflow leaves accumulated context that degrades the orchestrator's performance on the next task. The user should start fresh — either with `/clear` in the same session or by opening a new session.

After all FINISH actions are done, present the user with a structured handoff. The output has two parts: a workflow summary and a next-session prompt.

> **The workflow summary is for the user to read now.**

Include: what was completed (task slug and one-line outcome), what was deferred (explicitly deferred items from discussion or review), and what changed (files modified, PRs merged, branches affected). Keep it scannable — bullet points, not paragraphs.

> **The next-session prompt is for the new orchestrator to read later.**

The new session has zero context. The prompt must contain everything the orchestrator needs to orient without re-discovery. Structure it with labeled sections so the new orchestrator can parse each dimension independently.

The next-session prompt must include these sections, each on its own line with a label prefix:

- **Project:** project name — so the orchestrator loads the right project context.
- **Previous task:** task slug and one-line summary — what was just completed.
- **Note path:** full path to the note directory — so the orchestrator can read decisions, plan, and review.
- **Key decisions:** important design or architectural choices made during this task — things the next task should not contradict.
- **Gotchas discovered:** new gotchas recorded this session — so the next orchestrator checks them immediately.
- **Git state:** current branch, open PRs, merge status — so the orchestrator knows where the codebase stands.
- **Deferred items:** what was explicitly deferred during discussion or review — these are candidates for the next task.
- **Next step:** what the user stated they want to do next, if known — gives the orchestrator a head start on classification.

Omit sections that have nothing to report (e.g., no deferred items, no gotchas). Never fill a section with "none" — just drop it. The prompt should be concise but complete.

---

## Constraints

**Mandatory actions — never skip these:**

- Before planning, MUST check gotchas
- Before expensive delegation, MUST run lightweight precondition checks — verify the task is well-defined, prerequisites are met, and the scope justifies agent spawning. Use cheap checks (Haiku agents or bash commands) to prevent wasting expensive computation on ineligible or malformed tasks
- Any delegated task that involves both assessment and modification MUST present its assessment findings to the user via AskUserQuestion before performing modifications
- Before delegation, MUST include the note directory path in every subagent prompt — subagents write their output directly to the appropriate subdirectory (e.g., PI agents write to `ideation/`, researchers write to `research/`, executors write to `execution/`)
- Before delegation, MUST include gotcha context in every subagent prompt
- Before evaluation, MUST ask user with AskUserQuestion whether to **skip** evaluation — evaluation is the default at Steps 1–4, the user opts out, not in
- After evaluation, MUST discuss findings with user via AskUserQuestion before improving — the user decides what to address, defer, or disagree with
- After EVERY subagent completes, MUST run `gobbi note collect` with the agent-id and --phase flag to extract output to `subtasks/`. Then VERIFY the JSON file was actually created by reading it. Directory existence is NOT collection — directories are empty at init. Only `gobbi note collect` populates them.
- After delegation, MUST write work docs via _collection — immediately, not deferred
- After Step 7 (Review), MUST call AskUserQuestion to ask: FEEDBACK or FINISH?
- After FEEDBACK, MUST return to Review (Step 7) — PI agents re-review
- After FEEDBACK → Review, MUST call AskUserQuestion to ask: FEEDBACK or FINISH?
- When evaluation is performed, MUST spawn at least 2 perspective evaluators (Project + Overall minimum). Select additional perspectives (Architecture, Performance, Aesthetics) based on task type.
- MUST write note via _note at every workflow step — ideation, plan, research, execution, review. Never defer, never skip.
- MUST use EnterPlanMode when writing or revising plans
- When using AskUserQuestion, MUST put the recommended option first with "(Recommended)" in the label — give an opinion, don't just present neutral choices
- Executors MUST read research materials from the `research/` subdirectory before implementing

**Gobbi vs project boundary — understand what gobbi provides vs what the user's project needs:**

- Gobbi provides workflow orchestration, `.claude/` documentation standards, evaluation framework, and gotcha recording. Users do NOT need to create skills or agents for these — gobbi serves them.
- Users SHOULD create project-specific skills and agents that are tailored to their language, framework, and domain. For example, a project evaluation skill for a Python FastAPI project should know about Python-specific patterns, SQLAlchemy conventions, and FastAPI middleware — not just generic "check quality."
- When the user asks to create skills, agents, or rules, determine whether gobbi already covers the need (redirect to the existing gobbi skill) or whether a project-specific artifact is needed (help create one with domain-specific content).
- Project evaluation perspectives should be concrete and domain-aware — "check for N+1 queries in SQLAlchemy" is useful; "check performance" is not.

**Never do these:**

- Never implement complex domain work yourself when a specialist exists
- Never delegate without context — agents without project standards produce work that fails integration
- Never self-evaluate — the agent that creates must never judge its own output
- Never automatically improve based on evaluation without discussing with the user first
- Never launch more than 8 parallel subagents — batch larger plans into waves
