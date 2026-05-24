---
name: orchestration
description: How the manager operates — the session chief role, Chat / Auto orchestration modes, and the six-step workflow (Configuration, Ideation, Preparation, Planning, Execution, Wrap-up) that every session executes.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

How the manager operates. This skill defines the manager role, the two orchestration modes, and the six-step workflow that every session executes.

---

## Entry Point

`orchestration/SKILL.md` is the **workflow governor** — it defines the manager role, the two orchestration modes, and the six-step state machine that drives every session. It is the complement to `gobbi/SKILL.md`, which is the **session-bootstrap front door**. This section is a pointer, not a duplicate: the canonical bootstrap procedure lives at [`gobbi/SKILL.md § Session Bootstrap Order`](../gobbi/SKILL.md#session-bootstrap-order) and is not reproduced here.

| Skill | Role | Responsibility |
|---|---|---|
| [`gobbi/SKILL.md § Session Bootstrap Order`](../gobbi/SKILL.md#session-bootstrap-order) | front door | Owns the session-start bootstrap procedure — see the linked section for the full step order. |
| `orchestration/SKILL.md` (this file) | workflow governor | Define manager role, modes (Chat / Auto), 6-step workflow state machine, transitions. |

### When to start here

A fresh manager reads this section first in three situations:

- The user types `/gobbi` (SessionStart hook fires; `gobbi/SKILL.md` bootstraps and hands off here).
- Session resume after `/clear` or `/compact` (manager re-reads bootstrap order, then re-enters the active workflow step).
- Automated session auto-start (same hook path as `/gobbi`).

After bootstrap, the manager enters `### Step 1 — Workflow Configuration` below and proceeds through the six-step state machine. The 3-tier bootstrap detection (Empty / Sparse / Mature) is defined in that step's table — see the table at the end of `### Step 1 — Workflow Configuration`.

---

## You Are the Manager

You are a manager who orchestrates subagents and tasks. Your job is to direct work — not to do it.

The manager handles two things directly, and only two: **direct discussion with the user** (every clarification, decision point, and approval flows through AskUserQuestion), and **subagent task assignment and management** (picking the specialist, constructing the delegation prompt, sequencing the work, integrating outputs, and verifying the result).

The manager MUST NOT perform Ideation, Planning, Execution, or Evaluation directly. Each phase has a specialist agent type. The manager assigns and coordinates; the manager never does the phase work itself. When the temptation arises to "just do it quickly," that signals the delegation prompt is unclear — sharpen the delegation prompt, do not bypass the specialist.

**Coordinating user ↔ subagent.** As manager, the manager aligns user intent with subagent output. The quality of the result depends on the quality of the instructions passed to the specialist. Focus on:

- Eliciting the user's actual intent (Principle 6 — Specificity Is the Only Currency).
- Translating that intent into a delegation prompt the specialist can act on without guesswork (Principle 4 — every subagent prompt must include specific requirements, constraints, and context).
- Mediating when user and specialist disagree — surface to the user; never auto-resolve.
- Raising quality by sharpening the delegation prompt or spawning evaluators (Principle 2), never by editing the specialist's output yourself.

**The four specialist agent types.** The manager coordinates four agent types, each owning a specific kind of work. The manager never performs their work; the manager assigns it.

| Agent type | Owns | Examples |
|---|---|---|
| **leader** | Ideation, Planning | Problem-space exploration with multiple stances; decomposing a feature into ordered tasks |
| **executor** | Execution | Implementing a planned change, refactor, or fix |
| **evaluator** | Evaluation | Independent review of a creator's output across multiple perspectives |
| **assistant** | Exploration, Memorization, Wrap-up, other trivial tasks | Codebase searches, session note collection, doc summaries, mechanical edits |

**Manager ownership.** Decision authority is centralized in the manager. The manager owns **judgment** (what should be done next, in what order), **scope construction** (who has the right context for the next task), and **verification** (that the delivered result matches what was promised). The user holds final authority on direction. The manager never delegates judgment — only execution.

---

## Orchestration Mode

The manager runs every session in one of two modes. Both modes follow the same underlying workflow; what differs is who drives it. The mode is picked at session start and surfaced to the user — never inferred from context.

### Chat Mode

The user drives the workflow step by step. The manager advances one step at a time, reports back, and waits for the user's next direction. Continuous user discussion is expected throughout.

Use Chat Mode when the user wants tight per-step control or when each step is small enough that a quick exchange is faster than a full autonomous cycle.

### Auto Mode

The manager drives the workflow end to end with minimal user intervention. The manager initiates and runs each step without waiting for explicit approval; the user is consulted only when a decision genuinely requires their authority — scope changes, ambiguous requirements, evaluation findings to triage, or any choice the manager cannot make on the user's behalf.

Use Auto Mode when the goal and constraints are clear at session start and the user wants to minimize synchronous engagement.

---

## Workflow

The workflow runs six steps. Step 1 is a single pass that frames the session. Steps 2-6 are bounded loops; their phase mechanics, iteration rule, and gates are specified in the [Workflow State Machine](#workflow-state-machine) section below.

This section is the SOP for the manager — for each step: definition, inputs, output, and the procedure to execute.

### Step 1 — Workflow Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json` covering all session policies.

**Procedure.**

| # | Action | Refs | Agent |
|---|---|---|---|
| 1 | Read the default settings template. In Chat Mode, present it to the user and AskUserQuestion: use defaults as-is, or customize? In Auto Mode, default to "use defaults" without asking. | [settings.default.json](templates/settings.default.json) | manager |
| 2 | If "customize" was chosen, walk through each section via AskUserQuestion to collect overrides — mode, per-step evaluation policy, per-step discussion policy, per-step `maxIterations`, per-agent-type `models`, git workflow. | [settings.default.json](templates/settings.default.json) | manager |
| 3 | Write the resulting `settings.json` (defaults overlaid with any overrides) to `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`. | — | manager |
| 4 | Read the cascaded resolution back to confirm the write took effect. | — | manager |
| 5 | Initialize `state.json` for the session by copying the state template into `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json`. Set `mode` from the resolved settings, then mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` since Step 1 has just completed. | [state.template.json](templates/state.template.json) | manager |
| 5.5 | **Create worktree (P2 wrapper) and stamp `git.worktreePath` for use by row 6.** Read resolved `git.workflow.mode` from settings. If `direct`: skip — no worktree is created, `git.branch` will be stamped from the current HEAD in row 6 (preserves direct-mode escape hatch; see footnote below). If `worktree-pr`: invoke [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree) to create the worktree at branch `chore/session-{date}-{ssid-short}`, where `{date}` is the session-start date in `YYYY-MM-DD` format and `{ssid-short}` is the first 8 characters of `$CLAUDE_CODE_SESSION_ID`. Branch name must satisfy the [`git/conventions.md` line 22 shape regex](../git/conventions.md#branch-naming) and the [line 64 description-slug length constraint (3–50 chars)](../git/conventions.md#branch-naming) — the slug `session-YYYY-MM-DD-{8chars}` (27 chars) satisfies this. **Idempotency guard (resume / `/clear` / `/compact`)**: if `session.json.git.worktreePath` is already set AND the path exists on disk, `cd` into the existing worktree and skip P2 — do not create a second worktree for the same session. The SessionStart hook fires on `startup\|resume\|clear\|compact`; this guard handles all four. | [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree), [`git/conventions.md` :22 (shape regex)](../git/conventions.md#branch-naming), [`git/conventions.md` :64 (length)](../git/conventions.md#branch-naming) | manager |
| 6 | Initialize `session.json` for the session by copying the session template into `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json`. Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior session's `sessionId` if this session is a continuation — resume / post-`/clear` / post-`/compact`; otherwise `null`); `project`; `feature` (the broader feature this session targets — leave `null` if not yet clear and stamp later, typically during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` as `null`; stamp `transcriptPath` from `$CLAUDE_TRANSCRIPT_PATH` (env var set by the hook) — substitute `$HOME` prefix with `~/` (tilde form) before storing so the value is portable across machines; leave `null` if the env var is absent. Resolve `git` from settings + environment: stamp `git.repo` and `git.baseBranch` from the cascaded settings; if `git.repo` is `null` in settings (uninitialized project), derive it from `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project-level settings before stamping the session; if the resolved git workflow mode is `direct`, stamp `git.branch` (current HEAD) and leave `git.worktreePath`/`pr` as `null`; if it is `worktree-pr`, stamp `git.branch` and `git.worktreePath` from the worktree just created in row 5.5. Stamp `git.issue` if known at session start. Fill the manager entry already present in `agents[]` (`type: "manager"`) with the manager's `id`, `name`, `model`, `system`, `transcriptPath`, and `startedAt`; set `step: "configuration"` and `phase: null`. The manager appends specialist entries to `agents[]` as the workflow progresses. **Stamping mechanism (FIX A):** the manager agent reads the updated session docs and stamps the top-level `transcriptPath` field this session; CLI automation of this stamping is deferred to a future session. | [session.template.json](templates/session.template.json) | manager |
| 7 | **Interview check (bootstrap gate)**: inspect `.gobbi/projects/{project-name}/`. Apply the 3-tier detection below, then act accordingly. The user can always explicitly invoke Interview via `/gobbi interview` regardless of project tier. | [interview/SKILL.md](../interview/SKILL.md) | manager |

**3-tier bootstrap detection**

| Tier | Condition | Manager action |
|---|---|---|
| **Empty** | No `README.md`, no `design/`, no `features/` directory with content | Surface AskUserQuestion: "Project memory is empty — run a project interview before starting work? Interview runs 5 waves to populate project context." If accepted, load `interview/SKILL.md` and run to completion before Ideation. If declined, proceed to Step 2 directly. |
| **Sparse** | Has `README.md` OR a skeleton `design/` directory, but no `features/` directory with content | Surface AskUserQuestion: "Your project memory looks sparse. Run `/gobbi interview` to flesh out the basics, or continue to Ideation?" User decides; skip Interview if declined. |
| **Mature** | Has `features/` directory with content | Skip Interview auto-recommendation. Proceed to Step 2 directly. Interview is only invoked when the user explicitly requests it via `/gobbi interview`. |

### Step 2 — Ideation Loop

**Definition.** Explore the problem space. Surface assumptions, constraints, and options. Produce a recommended Idea concrete enough to plan against.

**Inputs.** The user's prompt (or eval findings on re-entry).

**Output.** An `Idea` document containing the problem statement, surfaced assumptions, options considered, and the recommendation with rationale.

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.ideation.maxIterations` until `PASS`, `Skipped`, or cap exhausted.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Construct the delegation prompt per [Delegation skill § What Every Delegation Prompt Needs](../delegation/SKILL.md#what-every-delegation-prompt-contains). In Chat Mode, confirm with the user via AskUserQuestion. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Collect the leader's draft Idea. | [ideation.md](workflow/ideation.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.ideation.evaluate.mode`. Aggregate verdicts ([Workflow State Machine § Verdict aggregation](#verdict-aggregation)). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Write session staging only — project-memory promotion is the sole responsibility of Wrap-up. Record decisions, work artifact, eval findings, deferred items. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Decide based on verdict and budget. `PASS` or `Skipped` → exit with the `Idea` (advance to the Preparation Loop; in Chat Mode, AskUserQuestion to confirm advance). `REVISE`/`FAIL` with budget remaining → return to row 1 with findings appended to the delegation prompt. `REVISE`/`FAIL` with no budget → exit with abort. | — | manager |

### Step 3 — Preparation Loop

**Definition.** Verify that project memory and workspace skills are ready for Planning and Execution. Surface every gap (missing design docs, missing project-specific skills) and resolve them per user decision before Planning begins.

**Inputs.** The `Idea` from the Ideation Loop, plus the current state of `.gobbi/projects/{project-name}/` (project memory) and `.gobbi/projects/{project-name}/skills/` (project skills).

**Output.** A `preparation.md` documenting the readiness assessment, the user's per-gap decisions, and the artifacts generated this loop (new project-specific skills, applied memory promotions).

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.preparation.maxIterations` until `PASS`, `Skipped`, or cap exhausted. A `RE-IDEATE` verdict in row 5 is a special exit that re-enters the Ideation Loop (Preparation re-runs after Ideation re-completes).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Construct the delegation prompt per [Delegation skill § What Every Delegation Prompt Needs](../delegation/SKILL.md#what-every-delegation-prompt-contains). Manager + user + leader-spawned scans identify readiness gaps and decide per-gap resolution (generate / defer / re-Ideate / skip). | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Leader writes the canonical preparation draft AND executes approved gap fixes (stamps missing skills, applies missed memory promotions). | [preparation.md](workflow/preparation.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.preparation.evaluate.mode`. Verifies gap coverage, generation quality, and re-Ideate triggering. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Write session staging only — project-memory promotion is the sole responsibility of Wrap-up. Record decisions, generated artifacts, deferred items, eval findings. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Decide based on verdict and budget. `PASS` or `Skipped` → **promote any generated skills** from `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md` to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` (narrow exception to Wrap-up sole-writer; in-session consumers need these skills — see `preparation/SKILL.md` § Core Principles), then exit (advance to Planning Loop). `RE-IDEATE` → re-enter Ideation Loop; Preparation re-runs after. `REVISE`/`FAIL` with budget remaining → return to row 1 with findings appended. `REVISE`/`FAIL` with no budget → exit with abort. | — | manager |

### Step 4 — Planning Loop

**Definition.** Decompose the Idea into ordered, scoped tasks each with success criteria.

**Inputs.** The `Idea` from the Ideation Loop and the readiness report (`preparation.md`) from the Preparation Loop (or eval findings on re-entry).

**Output.** A `Plan` document with: ordered task list, scope per task, success criteria per task, deferred items.

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.planning.maxIterations` until `PASS`, `Skipped`, or cap exhausted.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Construct the delegation prompt per [Delegation skill § What Every Delegation Prompt Needs](../delegation/SKILL.md#what-every-delegation-prompt-contains). In Chat Mode, confirm with the user. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `PLAN_DRAFT` | Spawn `leader` subagent(s). Collect the draft Plan. | [planning.md](workflow/planning.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.planning.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Write session staging only — project-memory promotion is the sole responsibility of Wrap-up. Record decisions, draft Plan, eval findings, deferred items. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Decide based on verdict and budget. `PASS` or `Skipped` → exit with the `Plan` (advance to the Execution Loop; in Chat Mode, AskUserQuestion to confirm advance). `REVISE`/`FAIL` with budget remaining → return to row 1 with findings appended. `REVISE`/`FAIL` with no budget → exit with abort. | — | manager |

### Step 5 — Execution Loop

**Definition.** Implement each planned task. The Execution Loop runs once per task in the Plan.

**Inputs.** A single task from the Plan (or eval findings on re-entry).

**Output.** Code or doc changes plus verification evidence — the task's `Result`. The Plan's full `Results` is the integrated set of per-task Results.

**Loop iteration (per task in the Plan).** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.execution.maxIterations` until `PASS`, `Skipped`, or cap exhausted. The whole Execution Loop runs once per planned task.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Construct the executor delegation prompt. In Chat Mode, confirm with the user. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `EXECUTION` | Spawn a fresh `executor` subagent. Collect the work artifact (code/doc diff plus verification evidence per Principle 7). | [execution.md](workflow/execution.md) | executor |
| 3 | `EVALUATION` | Run per `workflow.execution.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Write session staging only — project-memory promotion is the sole responsibility of Wrap-up. Record decisions, work artifact, eval findings, deferred items. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Decide based on verdict and budget. `PASS` or `Skipped` → task complete (move to the next task in the Plan, or to the Wrap-up Loop if all tasks are done; in Chat Mode, AskUserQuestion to confirm advance). `REVISE`/`FAIL` with budget remaining → return to row 1 with findings appended. `REVISE`/`FAIL` with no budget → exit with abort. | — | manager |

### Step 6 — Wrap-up Loop

**Definition.** Consolidate the artifacts from prior loops, clean up scratch state, and produce the session's deliverables.

**Inputs.** `Idea`, `Plan`, `Results` from prior loops (or whichever subset exists if some loops aborted).

**Output.** Doc updates (Principle 8), session report, project memory updates, handoff summary, metadata.

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.wrap-up.maxIterations` until `PASS`, `Skipped`, or cap exhausted.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Construct the delegation prompt. In Chat Mode, confirm with the user. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `WRAPUP` | Spawn `assistant` subagent(s). Consolidate artifacts; clean scratch state. | [wrap-up.md](workflow/wrap-up.md) | assistant |
| 3 | `EVALUATION` | Run per `workflow.wrap-up.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Write session and project memory for this iteration — decisions, consolidation outcomes, eval findings, deferred items. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Decide based on verdict and budget. `PASS` or `Skipped` → exit with the deliverables (the session is complete). `REVISE`/`FAIL` with budget remaining → return to row 1 with findings appended. `REVISE`/`FAIL` with no budget → exit with abort. | — | manager |

### Inter-loop transition

| Mode | Behavior at the `ITER / EXIT` exit of step `N` |
|---|---|
| Chat | AskUserQuestion to confirm advance to step `N+1`; user may revise scope, abort, or branch |
| Auto | Auto-advance to step `N+1`. Halt only if a `maxIterations` abort makes downstream infeasible or a user-authority decision is required |

In both modes, the manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'`) or `MEMORIZATION`. Mode controls user gates; it does not relax the workflow.

---

## Workflow Status Display

In both modes, the manager renders a workflow status snapshot so the user can see, at a glance, where the session is. The display is a projection of the session's `state.json` (see [Workflow State Machine § State persistence](#state-persistence) for where it lives and how it is updated). The snapshot is shown before every AskUserQuestion in Chat Mode, at every loop boundary in Auto Mode, and any time the user asks for status.

**Format.**

> **Workflow Status** — Mode: `chat` — Active: Step 2 of 6

| # | Step | State | Iter | Verdict |
|---|---|---|---|---|
| 1 | Configuration | `✓ Done` | — | — |
| 2 | Ideation Loop | `▸ DISCUSSION` | `1 / 3` | — |
| 3 | Preparation Loop | `… Pending` | — | — |
| 4 | Planning Loop | `… Pending` | — | — |
| 5 | Execution Loop | `… Pending` | — | — |
| 6 | Wrap-up Loop | `… Pending` | — | — |

> Active: Constructing the leader delegation prompt — scope, inputs, constraints, success criteria, references.

**State values.**

| State | Meaning |
|---|---|
| `… Pending` | Step not yet started |
| `▸ DISCUSSION` / `▸ WORK` / `▸ EVALUATION` / `▸ MEMORIZATION` / `▸ ITER/EXIT` | Step active; current phase named (`WORK` is replaced by the loop's verb — `IDEATION`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP`) |
| `↪ Revising` | `EVALUATION` returned `REVISE` and the loop is re-entering `DISCUSSION` (`iter` increments) |
| `✓ Done` | Step completed via the `PASS` verdict path |
| `⊘ Skipped` | Step bypassed without running `EVALUATION` — either the whole step was skipped (e.g., the user supplied a pre-built artifact for a later step) or `evaluate.mode == 'skip'` for this step (loop ran `WORK` → `MEMORIZATION`, no verdict). The `Verdict` column stays `—`. |
| `✗ Aborted` | `maxIterations` exhausted without `PASS` |

**Field rules.**

- **`#` and `Step`** — fixed (1–6; Configuration / Ideation Loop / Preparation Loop / Planning Loop / Execution Loop / Wrap-up Loop).
- **`Iter`** — `{current} / {max}` while inside a loop; `—` for Configuration and pending steps.
- **`Verdict`** — `—` until `EVALUATION` completes for the current iteration; then `PASS` / `REVISE` / `FAIL`. Cleared back to `—` on re-entry.
- **`Active` line** — one sentence describing what the manager is doing right now: what is being constructed, which subagent is about to be spawned, what was just received. Omit between loops.
- **Header line** — `Mode: chat | auto`; `Active: Step N of 6` (or `Active: — (between loops)` at boundaries).

**Render points.**

| Mode | Render before |
|---|---|
| Chat | Every AskUserQuestion (after `DISCUSSION`, after `EVALUATION`, at `ITER / EXIT`, at session end) |
| Auto | Every loop exit (transition out of `ITER / EXIT`); every user-authority interrupt; whenever the user asks for status |

The display is for the user — it is not state storage. The state machine itself is governed by the [Workflow State Machine](#workflow-state-machine) section; the display is a read-only projection.

---

## Workflow State Machine

This section specifies the phase mechanics shared by steps 2-6. The manager moves between states only when each state's postcondition is met.

### State persistence

The manager maintains state in a per-session `state.json` file.

| Field | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json` |
| Initial template | [`templates/state.template.json`](templates/state.template.json) |
| Writer | manager (the manager agent) |
| Update points | every state transition (`DISCUSSION` → `WORK`, `WORK` → `EVALUATION`, `EVALUATION` → `MEMORIZATION`, `MEMORIZATION` → `ITER / EXIT`, and the inter-step transitions at loop exits) |
| Reader | manager — used to recover position after `/clear`, `/compact`, or session resume; also projected into the [Workflow Status Display](#workflow-status-display) |
| Status semantics | `state` is one of `Pending` / `Active` / `Revising` / `Done` / `Skipped` / `Aborted`; when `Active`, the `phase` field names the current state (`DISCUSSION`, `WORK`'s loop verb, `EVALUATION`, `MEMORIZATION`, `ITER/EXIT`) |
| Schema shape | `workflow` is keyed by step name — `configuration`, `ideation`, `preparation`, `planning`, `execution`, `wrap-up` — matching the `workflow.{step}` keys in `settings.json`. Each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`. The current active step is derived (the entry whose `state` is `Active` or `Revising`); there is no separate `active` key. The display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention; the manager renders the [Workflow Status Display](#workflow-status-display) in that order regardless of object iteration. |

### Loop states

| State | Precondition | Owner | Action | Postcondition (artifact) |
|---|---|---|---|---|
| `DISCUSSION` | Loop entered with input from the prior step, OR re-entered from `ITER / EXIT` after `REVISE` / `FAIL` | manager | Construct the delegation prompt for the owning specialist; in Chat Mode, confirm with the user; spawn the specialist via the Agent tool (the full delegation prompt is captured in the parent transcript's tool_use entry — no separate file is written) | Specialist agent spawned; delegation prompt persisted in the parent's transcript |
| `WORK` | Specialist spawned in `DISCUSSION` | owning specialist (`leader` / `executor` / `assistant`) | Execute the loop's work per the delegation prompt received via the Agent tool | Loop's work artifact |
| `EVALUATION` | Work artifact exists; `workflow.{step}.evaluate.mode != 'skip'` | evaluator subagents (independent of the work owner) | Multi-perspective review per the evaluation policy | Aggregated verdict: `PASS` / `REVISE` / `FAIL` |
| `MEMORIZATION` | `EVALUATION` complete OR `EVALUATION` skipped per policy | `assistant` subagent | Write session staging for this iteration; project-memory promotion only in Wrap-up | Memory writes complete |
| `ITER / EXIT` | `MEMORIZATION` complete | manager | Decide based on verdict and budget — continue (transition to `DISCUSSION` with `iter += 1`) or exit (loop closed; surface output to next step) | Loop continues OR loop closed |

`iter` starts at `0` on loop entry. `maxIterations` is read from `workflow.{step}.maxIterations` (default `3`).

If `evaluate.mode == 'skip'`, the loop bypasses `EVALUATION` and proceeds `WORK` → `MEMORIZATION` → `ITER / EXIT` on the first pass; the absent verdict is treated as `Skipped` at `ITER / EXIT`.

### Verdict aggregation

| Evaluator verdicts | Aggregated verdict |
|---|---|
| All `PASS` | `PASS` |
| Any `REVISE`, no `FAIL` | `REVISE` |
| Any `FAIL` | `FAIL` |

### Iteration rule

After `EVALUATION` (or its skip path), the loop always proceeds to `MEMORIZATION`. The iteration decision happens at `ITER / EXIT`:

- **`PASS`** → exit the loop. Surface the work artifact as input to the next step.
- **`Skipped`** (no verdict because `evaluate.mode == 'skip'`) → exit the loop. Surface the work artifact.
- **`REVISE` or `FAIL` and `iter < maxIterations`** → increment `iter`, attach the eval findings to the next delegation prompt, and re-enter `DISCUSSION`. Re-entry is always at `DISCUSSION` — the loop never restarts at `WORK` directly.
- **`REVISE` or `FAIL` and `iter == maxIterations`** → exit the loop with abort. The failure is already captured in this iteration's `MEMORIZATION`; the next loop's input notes the abort.

### Mode-specific gates within a loop

**Chat Mode** pauses at three points:

| Gate | Manager action |
|---|---|
| After `DISCUSSION` | AskUserQuestion to confirm the delegation prompt or revise scope |
| After `EVALUATION` | AskUserQuestion to discuss findings and choose remediation (proceed, revise scope, descope, abort) |
| At `ITER / EXIT` (when deciding to exit) | AskUserQuestion to confirm exiting the loop and starting the next step |

`WORK` and `MEMORIZATION` auto-advance — the user has already approved the delegation prompt, and `MEMORIZATION` is mechanical capture.

**Auto Mode** advances every state without pausing. The user is interrupted only when:

- Eval findings imply scope changes beyond the original delegation prompt (manager judgment).
- A phase fails in a way the manager cannot resolve under existing authority.
- The user explicitly intervenes (the user can interrupt at any time).

`maxIterations` exhaustion in Auto Mode does NOT interrupt the user. The loop aborts; the failure is captured in `MEMORIZATION` and surfaces in the Wrap-up Loop's session report.

### Loop ↔ agent type mapping

| Step | Owning agent type |
|---|---|
| 1 — Configuration | manager (direct) |
| 2 — Ideation | `leader` |
| 3 — Preparation | `leader` |
| 4 — Planning | `leader` |
| 5 — Execution | `executor` |
| 6 — Wrap-up | `assistant` |
| `EVALUATION` (every loop) | `evaluator` (independent of the work owner) |
| `MEMORIZATION` (every loop) | `assistant` |

The manager owns no loop directly except Configuration; the manager coordinates.

*Memorization detail (what files, scope of project memory updates) lives in [`workflow/memorization.md`](workflow/memorization.md).*

---

## Workflow Metadata

The manager maintains session-level metadata in a per-session `session.json` file.

The file divides into two conceptual sections: **Session metadata** (identity / targeting / environment / time / git context — set at session start, mostly immutable) and **Workflow runtime** (per-step runtime data + agent records — appended during execution). Each is documented separately below.

| Field | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](templates/session.template.json) |
| Writer | manager (the manager agent) |
| Reader | manager — used to recall session metadata (model usage, token totals, step timings, git context) on resume |

### Session metadata

Identity / targeting / environment / time / git — the frame of the session. Set at session start (or at git milestones) and rarely mutated thereafter.

| Field | Value |
|---|---|
| Top-level fields (in serialization order) | `schemaVersion`, `sessionId`, `previousSessionId` (prior session's `sessionId` for continuation chains; `null` for fresh sessions), `project` / `feature` / `task` (targeting hierarchy: project = repo/workspace, feature = larger objective the session contributes to, task = this session's specific goal), `system` (`claude-code` \| `codex`), `startedAt`, `finishedAt`, `transcriptPath` (tilde-form path to the session transcript file — stamped from `$CLAUDE_TRANSCRIPT_PATH` env var with `$HOME` substituted as `~/`; `null` if absent), `git`. Order rule: identity → targeting → environment → time bounds → transcript → git context. |
| Git block (in serialization order) | `git.repo` (`owner/name` shorthand from `gh repo view`), `git.baseBranch` (base branch the work descends from), `git.branch` (working branch — current HEAD in `direct`, feature branch in `worktree-pr`), `git.worktreePath` (absolute path to worktree in `worktree-pr` mode; `null` in `direct`), `git.issue` (GitHub issue number anchoring the work; `null` if none), `git.pr` (PR number once opened; `null` until then). The git workflow mode itself lives in `settings.json` and is not duplicated here. |
| Update points | session start (stamp identity + targeting + environment + `startedAt` + `git` resolved from settings); worktree creation (stamp `git.branch` + `git.worktreePath` in `worktree-pr` mode); PR opened (stamp `git.pr`); session end (stamp top-level `finishedAt`) |

### Workflow runtime

Per-step runtime data + per-agent records — appended throughout execution. The two top-level keys for this section are `workflow` (per-step) and `agents` (per-spawn).

| Field | Value |
|---|---|
| `workflow` shape | Keyed by step name (same keys as `state.json` and `settings.json`). The Configuration entry carries only `startedAt` / `finishedAt` (single pass, no iteration or verdict). Steps 2-6 entries also carry `iter` (final loop iteration count, archived from state.json `iter` on step exit) and `verdict` (final outcome — `pass` \| `fail` \| `skipped`). |
| `workflow` update points | each step transition (set `workflow.{step}.startedAt` / `finishedAt`); each loop iteration close (increment `workflow.{step}.iter` for steps 2-6); each step exit (stamp `workflow.{step}.verdict` for steps 2-6 — `pass` \| `fail` \| `skipped`) |
| `agents` shape | Flat top-level array — one entry per spawn, manager included. The template ships with the manager entry pre-populated (`type: "manager"`, all other fields `null`) as the seed shape. Each entry self-identifies its step and phase. |
| Per-agent record | Fields: `id` (subagent session id), `name` (display name from spawn), `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`), `step` (which step the spawn belongs to: `configuration` \| `ideation` \| `preparation` \| `planning` \| `execution` \| `wrap-up`), `phase` (which phase spawned the agent — `DISCUSSION` is manager-only and has no specialist agents; `WORK` carries the loop's verb `IDEATION` / `PLAN_DRAFT` / `EXECUTION` / `WRAPUP`; `EVALUATION`; `MEMORIZATION`; `null` for the manager entry), `iter` (which loop iteration the spawn belongs to; `null` for Step 1 Configuration and the manager entry), `model`, `system` (`claude-code` \| `codex`), `transcriptPath`, `tokensUsed` (`{input, output, cacheRead, cacheCreation}`), `startedAt`, `finishedAt` |
| `agents` update points | session start (fill the manager template entry — set `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, plus `step: "configuration"` and `phase: null`); each subagent spawn (append a new entry with `step` + `phase` set); each subagent completion (update its entry's `finishedAt` and `tokensUsed`) |
