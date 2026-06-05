# Auto Mode

Sub-document of the `orchestration` skill. Owns the **full** Auto-Mode specification: mode
posture, the Always-Ask interrupt contract, the per-loop defaults (maxIterations, evaluate.mode,
discuss.mode, Preparation, MEMORIZATION), the banner-conditioning note, and the maxIterations
exhaustion silence contract.

For the workflow governor and the global 6-step state machine, see
[`orchestration/SKILL.md`](SKILL.md). For the user-driven mode that runs a per-task slice loop
instead of the linear sequence, see [`orchestration/chat-mode.md`](chat-mode.md).

---

## §1 — Mode posture

Auto Mode is the **autonomous, end-to-end orchestration mode**. The manager runs the linear
6-step state machine (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up)
from start to finish with minimal user intervention.

**Structural invariant.** Auto Mode's runtime shape is unchanged by this redesign. The 6-step
state machine runs linearly; all loops run their full contract (DISCUSSION → WORK → EVALUATION →
MEMORIZATION → ITER/EXIT). Nothing about the sequence, the loop structure, or the phase ordering
changes in Auto Mode. This document codifies discipline that was implicit; it does not introduce
new runtime behavior.

**When the manager auto-proceeds.** The manager initiates each step, runs subagents, and proceeds
through the loop without pausing the user for decisions in the **Auto-decide** class
(see `discussion/SKILL.md § Decision Classification`). Auto-decide decisions are resolved by the
codebase, project memory, rules, mistakes, or a clearly recommended approach; they are logged
silently for auditability.

**When the manager MUST interrupt.** The manager pauses and calls `AskUserQuestion` when:

1. A decision falls in an **Always-Ask category** (Design / Scope / Destructive) — see §3.
2. An eval finding implies a scope change the manager cannot resolve under existing authority.
3. A step fails in a way the manager cannot resolve (e.g., `BLOCKED` status from a subagent
   that has exhausted its 3-strike rule).
4. The user explicitly intervenes mid-session.

The manager does NOT pause for any other reason. "I'm not sure" and "this might be surprising"
are not sufficient — if the decision is Auto-decide class, proceed.

---

## §2 — Workflow

Auto Mode runs the linear 6-step state machine: Configuration → Ideation → Preparation
→ Planning → Execution → Wrap-up. Each step runs **once per session in sequence**. Steps
2-6 are bounded loops; their shared phase mechanics, iteration rule, and gates are
specified in [`orchestration/SKILL.md § Workflow State Machine`](SKILL.md#workflow-state-machine).

This section is the canonical home of the Auto-Mode SOP — for each step: Definition,
Inputs, Output, Loop iteration (for steps 2-6), and the procedure to execute.

### Step 1 — Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json` covering all session policies.

**Procedure.** See [`orchestration/SKILL.md § Step 1 — Workflow Configuration`](SKILL.md#step-1--workflow-configuration) for the full procedure table (rows 1-7 + Direct-mode opt-out + 3-tier bootstrap detection). The procedure is identical in Auto and Chat modes; SKILL.md holds the canonical table.

### Step 2 — Ideation Loop

**Definition.** Explore the problem space. Surface assumptions, constraints, and options. Produce a recommended Idea concrete enough to plan against.

**Inputs.** The user's prompt (or eval findings on re-entry).

**Output.** An `Idea` document containing the problem statement, surfaced assumptions, options considered, and the recommendation with rationale.

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.ideation.maxIterations` (Auto default = 5) until `PASS`, `Skipped`, or cap exhausted.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "user"` in Auto default — manager + user converge on the delegation prompt. Construct per [Delegation skill § What Every Delegation Prompt Needs](../delegation/SKILL.md#what-every-delegation-prompt-contains). | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Collect the leader's draft Idea. | [ideation.md](workflow/ideation.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.ideation.evaluate.mode` (default `always`). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | **Full PASS path** (unmodified base procedure) — stages typed findings per [Routing Findings to MEMORIZATION](workflow/evaluation.md#routing-findings-to-memorization). | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | `PASS` or `Skipped` → exit. `REVISE`/`FAIL` with budget → return to row 1 with findings appended. Budget exhausted → exit with abort. | — | manager |

### Step 3 — Preparation Loop

**Definition.** Verify that project memory and workspace skills are ready for Planning and Execution. Surface every gap and resolve them per user decision before Planning begins.

**Inputs.** The Idea from Step 2 + the current state of `.gobbi/projects/{project-name}/` and `.gobbi/projects/{project-name}/skills/`.

**Output.** A `preparation.md` documenting the readiness assessment, the user's per-gap decisions, and the artifacts generated this loop.

**Loop iteration.** 5-row loop; cap from `workflow.preparation.maxIterations` (Auto default = 5). A `RE-IDEATE` verdict in row 5 re-enters Ideation.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "user"` — manager + user + leader-spawned scans identify readiness gaps. | [discussion](../discussion/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Leader writes preparation draft AND executes approved gap fixes. | [preparation.md](workflow/preparation.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.preparation.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Full PASS path. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | `PASS` or `Skipped` → promote generated skills + exit. `RE-IDEATE` → re-enter Step 2. `REVISE`/`FAIL` with budget → row 1. Budget out → abort. | — | manager |

### Step 4 — Planning Loop

**Definition.** Decompose the Idea into ordered, scoped tasks each with success criteria.

**Inputs.** The Idea + the readiness report.

**Output.** A `Plan` document: ordered task list, scope per task, success criteria per task, deferred items.

**Loop iteration.** 5-row loop; cap from `workflow.planning.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"` in Auto default — manager constructs delegation prompt without per-step user gate; Always-Ask categories still fire per §3. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `PLAN_DRAFT` | Spawn `leader` subagent(s). Collect the draft Plan. | [planning.md](workflow/planning.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.planning.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Full PASS path. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Same exit semantics as Step 2. | — | manager |

### Step 5 — Execution Loop

**Definition.** Implement each planned task. Runs once per task in the Plan.

**Inputs.** A single task from the Plan (or eval findings on re-entry).

**Output.** Code or doc changes plus verification evidence — the task's `Result`. The Plan's full `Results` is the integrated set.

**Loop iteration.** 5-row loop per task; cap from `workflow.execution.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"`. Manager constructs executor delegation prompt. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `EXECUTION` | Spawn a fresh `executor` subagent. Collect work artifact + verification evidence per Principle 7. | [execution.md](workflow/execution.md) | executor |
| 3 | `EVALUATION` | Run per `workflow.execution.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Full PASS path. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Task complete → next task; all tasks complete → advance to Step 6. | — | manager |

### Step 6 — Wrap-up Loop

**Definition.** Consolidate prior loops' artifacts; archive closed backlogs; promote staged mistakes; write handoff; open PR.

**Inputs.** `Idea`, `Plan`, `Results` from prior loops + cumulative session-staging.

**Output.** Doc updates (per Principle 8), session report, project memory updates, handoff summary, opened PR.

**Loop iteration.** 5-row loop; cap from `workflow.wrap-up.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"`. Manager constructs assistant delegation prompt. | [discussion](../discussion/SKILL.md), [delegation](../delegation/SKILL.md) | manager |
| 2 | `WRAPUP` | Spawn `assistant` subagent. Consolidate artifacts; archive backlogs; promote mistakes; write handoff. | [wrap-up.md](workflow/wrap-up.md) | assistant |
| 3 | `EVALUATION` | Run per `workflow.wrap-up.evaluate.mode`. | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Full PASS path — write session and project memory for this iteration. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | `PASS` → session closed. `REVISE` → re-enter `DISCUSSION` (up to `max=5` remediation iterations). `FAIL` or cap exhausted → escalate to user per [Workflow State Machine § Iteration Caps](SKILL.md#iteration-rule). | — | manager |

---

## §3 — Always-Ask codification

### 3.1 Authoritative source

The full Always-Ask matrix lives in
[`discussion/SKILL.md § Always-Ask categories (override auto-decide; the user decides)`](../discussion/SKILL.md).
`auto-mode.md` references that section as the authoritative source and restates the contract in
Auto-Mode-specific language so an Auto-mode manager cannot rationalize past the gate.

### 3.2 Auto-Mode restatement

> **In Auto Mode, the manager auto-decides everything in the Auto-decide class without pausing.
> The manager MUST NOT auto-decide anything in the Always-Ask class (Design / Scope /
> Destructive). For those three categories, `AskUserQuestion` fires exactly as it would in Chat
> Mode — regardless of any per-step `discuss.mode: agent` setting.**

The `discuss.mode: agent` default in Planning / Execution / Wrap-up (see §4) controls whether
DISCUSSION rows are user-driven or agent-driven. It does **not** suppress Always-Ask interrupts.
Always-Ask overrides `discuss.mode` unconditionally.

### 3.3 Always-Ask categories with Auto-Mode examples

| Category | Definition | Auto-Mode example |
|---|---|---|
| **Design** | Architecture choice, library selection, design pattern, API shape, persistence model, error-handling strategy, concurrency model. Anything that locks future code into a structural commitment. | The leader's mid-Planning research surfaces a new library not in the Ideation scope — e.g., the leader proposes `zod` for runtime schema validation when no validator was discussed in Ideation. This is a library selection (Design). The manager MUST ask before adopting it, regardless of `discuss.mode: agent`. |
| **Scope** | In/out of scope of the Scope Contract, extending the contract to absorb adjacent work, narrowing to defer items mid-workflow, marking items as backlog vs in-this-workflow. | A mid-Execution executor's diff touches a file not in the plan's `files:` list — e.g., an executor editing `orchestration/SKILL.md` while scoped to `auto-mode.md` only. The manager detects the out-of-scope path and MUST ask before allowing it to proceed. |
| **Destructive** | File deletion outside an explicit `files:` scope, `git reset --hard`, force-push, package downgrade, schema migration that drops data, modification of shared state outside the worktree, large-scale rename or move. | Mid-Wrap-up, an agent proposes `git reset --hard` to clean a branch after a merge conflict. This is destructive and irreversible. The manager MUST ask before issuing the command — even in Auto Mode with `discuss.mode: agent` active. |

### 3.4 USER CHALLENGE cross-reference

When the Planning leader's research-backed analysis substantively disagrees with the user's stated
Ideation direction, the manager escalates via the USER CHALLENGE primitive in
[`planning/SKILL.md § Core Principles § USER CHALLENGE`](../planning/SKILL.md). The 5-field card
(What the user said / What the leader recommends / Why / What we might be missing / If we're
wrong, the cost is) fires as a `AskUserQuestion` call. USER CHALLENGE is **never auto-decided**.
The user's original direction is the default; the leader's recommendation only wins if the user
explicitly accepts.

---

## §4 — Auto-Mode defaults

The following defaults are locked for Auto Mode. They apply to every session that starts with
`mode: "auto"` and are not overridden at the session level.

| Setting | Auto default | Notes |
|---|---|---|
| `workflow.ideation.maxIterations` | `5` | Full exploration budget. |
| `workflow.preparation.maxIterations` | `5` | Preparation runs — `skip: false`, `maxIterations: 5` (contrast Chat's `skip: true` / `maxIterations: 0` → Skipped). |
| `workflow.planning.maxIterations` | `5` | Full planning budget. |
| `workflow.execution.maxIterations` | `5` | Full execution budget. |
| `workflow.wrap-up.maxIterations` | `5` | Wrap-up runs once per session; up to 5 remediation iterations on `REVISE` before abort. |
| `evaluate.mode` (all loops) | `"always"` | Evaluation runs every loop, no mode-driven skip. `"skip"` is a power-user per-session override; the redesign does not change this, but documenting it preempts future drift. **Note:** `evaluate.mode: skip` skips only the EVALUATION phase; the step-level `skip: true` boolean (new) skips the WHOLE step. Distinct signals. |
| `workflow.ideation.discuss.mode` | `"user"` | Ideation DISCUSSION is user-driven — user confirms approach before leader works. |
| `workflow.preparation.discuss.mode` | `"user"` | Preparation DISCUSSION is user-driven — user confirms readiness gaps before prep work. |
| `workflow.planning.discuss.mode` | `"agent"` | Planning DISCUSSION is agent-driven — manager proceeds without a gate per loop entry. Always-Ask categories still fire (§3). |
| `workflow.execution.discuss.mode` | `"agent"` | Execution DISCUSSION is agent-driven. Always-Ask categories still fire (§3). |
| `workflow.wrap-up.discuss.mode` | `"agent"` | Wrap-up DISCUSSION is agent-driven. Always-Ask categories still fire (§3). |

**Preparation runs.** Auto Mode does not skip Preparation. The `skip: false` + `maxIterations: 5`
values mean the standard loop contract runs (DISCUSSION → WORK → EVALUATION → MEMORIZATION →
ITER/EXIT). This is the structural contrast with Chat Mode, where preparation carries
`skip: true` + `maxIterations: 0` → `state: Skipped` (either signal alone suffices).

**Full per-loop MEMORIZATION.** Auto Mode uses the **unmodified** `memorization/SKILL.md` PASS
path, including Steps 6–7 (typed-finding staging). There is no "narrowed" PASS path in Auto Mode.
Every loop's MEMORIZATION runs the full base procedure, including mistake-candidate staging at
moment-of-capture per `mistake/SKILL.md § P2`.

**Single mode question at session start.** The mode question fires once at Configuration (per
PR #267 lock). The two retired setup questions stay retired.

---

## §5 — Banner conditioning

The session-start system-reminder banner reads:

> "Auto Mode Active — bias toward working without stopping for clarifying questions."

**The banner's bias is conditioned by the Always-Ask matrix (§3).** The phrase "make the
reasonable call and keep going" applies to the **Auto-decide class only**. It does not extend
to Always-Ask categories (Design / Scope / Destructive). A manager reading the banner's
"keep going" language and using it to rationalize past an Always-Ask category is violating the
Always-Ask contract, not following the banner.

Operationally: when the manager faces a decision, the first question is not "should I ask?" but
"which class is this?" If the decision is Auto-decide, proceed. If the decision is Always-Ask,
ask — the banner is irrelevant.

The banner text is injected by the harness (currently not modified by this redesign). The
conditioning is a semantic note, not a code change.

---

## §6 — maxIterations exhaustion

When a loop reaches `maxIterations` without a PASS verdict, the loop exits with `state: Aborted`
and the `Aborted` verdict is stamped on the loop's record. In Auto Mode this does **not**
interrupt the user mid-session. The manager notes the abort, continues to the next step (if
continuing is safe), and the failure surfaces explicitly in the Wrap-up Loop's MEMORIZATION and
the session handoff.

This is by design — per `orchestration/SKILL.md` line 405 contract. The silence is not a bug;
it is Auto Mode's autonomy contract: the user reviews outcomes at session end (Wrap-up), not
mid-step. This note exists so a future reader does not mistake the mid-session silence for a
missing interrupt.

**Exception.** If a Planning or Execution abort makes the remaining steps unsound (e.g., Planning
aborted with no deliverable plan), the manager MUST surface this via `AskUserQuestion` before
proceeding to the next step — proceeding on a broken foundation is a step failure, not a
recoverable abort.

---

## Cross-references

- [`orchestration/SKILL.md`](SKILL.md) — workflow governor; `§ Auto Mode` brief description;
  `§ Mode-specific gates within a loop` for the three per-loop user gates; `§ Workflow Status
  Display` for the Auto rendering (6-row table); line 405 for the maxIterations exhaustion
  silence contract.
- [`orchestration/chat-mode.md`](chat-mode.md) — the symmetric Chat-Mode specification; R1 lock +
  `skip: true` (`preparation = {skip: true, maxIterations: 0} → state: Skipped`) and the narrowed
  MEMORIZATION PASS path are Chat-only; they do not apply in Auto Mode.
- [`discussion/SKILL.md § Decision Classification`](../discussion/SKILL.md) — authoritative
  Always-Ask matrix (Design / Scope / Destructive categories, full table with examples and
  why-always-ask rationale). §3 of this doc references and restates it; `discussion/SKILL.md`
  is the single source of truth.
- [`planning/SKILL.md § Core Principles § USER CHALLENGE`](../planning/SKILL.md) — 5-field
  escalation card for leader-user disagreement. Referenced in §3.4.
- [`memorization/SKILL.md`](../memorization/SKILL.md) — the unmodified base MEMORIZATION
  procedure. Auto Mode runs this base procedure in full (no local override).
- [`mistake/SKILL.md § P2`](../mistake/SKILL.md) — moment-of-capture discipline for
  mistake-candidates; runs in Auto Mode regardless of loop or discuss.mode setting.
- `mistakes/skills-mirror-symlinks-not-copies.md` — editing the canonical file at
  `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` reflects automatically via the
  `.claude/skills/orchestration/auto-mode.md` mirror symlink; do not double-edit.
