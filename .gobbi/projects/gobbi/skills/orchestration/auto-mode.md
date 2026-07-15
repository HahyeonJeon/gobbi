# Auto Mode

Sub-document of the `orchestration` skill. Owns the **full** Auto-Mode specification: mode
posture, the Always-Ask interrupt contract, the per-loop defaults (maxIterations, evaluate.mode,
discuss.mode, Preparation, RECORD), the banner-conditioning note, and the maxIterations
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
RECORD → ITER/EXIT). Nothing about the sequence, the loop structure, or the phase ordering
changes in Auto Mode. This document codifies discipline that was implicit; it does not introduce
new runtime behavior.

**When the manager auto-proceeds.** The manager initiates each step, runs subagents, and proceeds
through the loop without pausing the user for decisions in the **Auto-decide** class
(see `discussion/SKILL.md § Decision Classification`). Auto-decide decisions are resolved by the
codebase, memory, rules, mistakes, or a clearly recommended approach; they are logged
silently for auditability.

**When the manager MUST interrupt.** The manager pauses and uses the active runtime's user-decision primitive when:

1. A decision falls in an **Always-Ask category** (Design / Scope / Destructive) — see §3.
2. An eval finding implies a scope change the manager cannot resolve under existing authority.
3. A step fails in a way the manager cannot resolve (e.g., a `BLOCKED` status from a subagent).
4. The user explicitly intervenes mid-session.

The manager does NOT pause for any other reason. "I'm not sure" and "this might be surprising"
are not sufficient — if the decision is Auto-decide class, proceed.

---

## §2 — Workflow

Auto Mode runs the linear 6-step state machine: Configuration → Ideation → Preparation
→ Planning → Execution → Wrap-up. Each step runs **once per session in sequence**. Steps
2-6 are bounded loops; their shared phase mechanics, iteration rule, and gates are
specified in [`orchestration/SKILL.md § Workflow State Machine`](workflow/state-machine.md#workflow-state-machine).

This section is the canonical home of the Auto-Mode SOP — for each step: Definition,
Inputs, Output, Loop iteration (for steps 2-6), and the procedure to execute.

The EVALUATION phase (row 3) in every step follows [§7 — Evaluation discipline (Auto Mode)](#7--evaluation-discipline-auto-mode).

### Step 1 — Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json` covering all session policies.

**Procedure.** See [`orchestration/SKILL.md § Step 1 — Workflow Configuration`](SKILL.md#step-1--workflow-configuration) for the full procedure table, including the fresh-vs-resume branch (a fresh session stamps Ideation `Active` and enters Ideation; a resume rehydrates `state.json` and continues the persisted active step). The procedure is identical in Auto and Chat modes; SKILL.md holds the canonical table.

### Step 2 — Ideation Loop

**Definition.** Explore the problem space. Surface assumptions, constraints, and options. Produce a recommended Idea concrete enough to plan against.

**Inputs.** The user's prompt (or eval findings on re-entry).

**Output.** An `Idea` document containing the problem statement, surfaced assumptions, options considered, and the recommendation with rationale.

**Loop iteration.** Rows 1-5 form one iteration. Row 5 decides whether to iterate (back to row 1) or exit the loop. Repeats up to `workflow.ideation.maxIterations` (Auto default = 5) until `PASS`, `Skipped`, or cap exhausted.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "user"` in Auto default — manager + user converge on the delegation prompt. Construct per [Delegation skill § What Every Delegation Prompt Needs](delegation.md#what-every-delegation-prompt-contains). | manager orchestration: [discussion](../discussion/SKILL.md), [delegation](delegation.md); specialist phase load: — | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Collect the leader's draft Idea. | manager orchestration: [ideation.md](workflow/ideation.md); specialist phase load: [../ideation/SKILL.md](../ideation/SKILL.md) (+ [../research/SKILL.md](../research/SKILL.md) at Sub-step C) | leader |
| 3 | `EVALUATION` | Run per `workflow.ideation.evaluate.mode` (default `always`). | manager orchestration: [evaluation.md](workflow/evaluation.md); specialist phase load: [../evaluation/SKILL.md](../evaluation/SKILL.md) | evaluator |
| 4 | `RECORD` | **Full PASS path** (unmodified base procedure) — stages typed findings per [Routing Findings to RECORD](workflow/evaluation.md#routing-findings-to-record). | manager orchestration: [record.md](workflow/record.md); specialist phase load: [../record/SKILL.md](../record/SKILL.md) (+ [../memory/memory-map.md](../memory/memory-map.md)) | assistant |
| 5 | `ITER / EXIT` | `PASS` or `Skipped` → exit. `REVISE` with budget → return to row 1 with findings appended. Any `FAIL` → escalate to the user (safety gate, never auto-re-entered). Budget exhausted → exit with abort. | manager orchestration: —; specialist phase load: — | manager |

### Step 3 — Preparation Loop

**Definition.** Verify that memory and workspace skills are ready for Planning and Execution. Surface every gap and resolve them per user decision before Planning begins.

**Inputs.** The Idea from Step 2 + the current state of `.gobbi/projects/{project-name}/` and `.gobbi/projects/{project-name}/skills/`.

**Output.** A `preparation.md` documenting the readiness assessment, the user's per-gap decisions, and the artifacts generated this loop.

**Loop iteration.** 5-row loop; cap from `workflow.preparation.maxIterations` (Auto default = 5). A user-confirmed `re-ideate` decision during `DISCUSSION` (row 1) halts Preparation and re-enters Ideation — it is a DISCUSSION exit, not a row-5 verdict.

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "user"` — manager + user + leader-spawned scans identify readiness gaps. | manager orchestration: [discussion](../discussion/SKILL.md); specialist phase load: — | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Leader writes preparation draft AND executes approved gap fixes. | manager orchestration: [preparation.md](workflow/preparation.md); specialist phase load: [../preparation/SKILL.md](../preparation/SKILL.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.preparation.evaluate.mode`. | manager orchestration: [evaluation.md](workflow/evaluation.md); specialist phase load: [../evaluation/SKILL.md](../evaluation/SKILL.md) | evaluator |
| 4 | `RECORD` | Full PASS path. | manager orchestration: [record.md](workflow/record.md); specialist phase load: [../record/SKILL.md](../record/SKILL.md) (+ [../memory/memory-map.md](../memory/memory-map.md)) | assistant |
| 5 | `ITER / EXIT` | `PASS` → promote generated skills + exit. `Skipped` → exit (no generated skills exist on a skipped loop, so nothing to promote). `REVISE` with budget → row 1. Any `FAIL` → escalate to the user (safety gate, never auto-re-entered). Budget out → abort. (A `re-ideate` decision is handled in row 1 `DISCUSSION`, not here — it is not a row-5 verdict.) | manager orchestration: —; specialist phase load: — | manager |

### Step 4 — Planning Loop

**Definition.** Decompose the Idea into ordered, scoped tasks each with success criteria.

**Inputs.** The Idea + the readiness report.

**Output.** A `Plan` document: ordered task list, scope per task, success criteria per task, deferred items.

**Loop iteration.** 5-row loop; cap from `workflow.planning.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"` in Auto default — manager constructs delegation prompt without per-step user gate; Always-Ask categories still fire per §3. | manager orchestration: [discussion](../discussion/SKILL.md), [delegation](delegation.md); specialist phase load: — | manager |
| 2 | `PLAN_DRAFT` | Spawn `leader` subagent(s). Collect the draft Plan. | manager orchestration: [planning.md](workflow/planning.md); specialist phase load: [../planning/SKILL.md](../planning/SKILL.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.planning.evaluate.mode`. | manager orchestration: [evaluation.md](workflow/evaluation.md); specialist phase load: [../evaluation/SKILL.md](../evaluation/SKILL.md) | evaluator |
| 4 | `RECORD` | Full PASS path. | manager orchestration: [record.md](workflow/record.md); specialist phase load: [../record/SKILL.md](../record/SKILL.md) (+ [../memory/memory-map.md](../memory/memory-map.md)) | assistant |
| 5 | `ITER / EXIT` | Same exit semantics as Step 2. | manager orchestration: —; specialist phase load: — | manager |

### Step 5 — Execution Loop

**Definition.** Implement each planned task. Runs once per task in the Plan.

**Inputs.** A single task from the Plan (or eval findings on re-entry).

**Output.** Code or doc changes plus verification evidence — the task's `Result`. The Plan's full `Results` is the integrated set.

**Loop iteration.** 5-row loop per task; cap from `workflow.execution.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"`. Manager constructs executor delegation prompt. | manager orchestration: [discussion](../discussion/SKILL.md), [delegation](delegation.md); specialist phase load: — | manager |
| 2 | `EXECUTION` | Spawn a fresh `executor` subagent by default. In Claude Code only, the manager may continue the same executor teammate per the bounded rule — shared subsystem, under the saturation cap (`orchestration/delegation.md § Continue vs Fresh`). Native Codex uses fresh executor spawns. Collect work artifact + verification evidence per the Execution Verify phase (`execution/SKILL.md`). | manager orchestration: [execution.md](workflow/execution.md); specialist phase load: [../execution/SKILL.md](../execution/SKILL.md) | executor |
| 3 | `EVALUATION` | Run per `workflow.execution.evaluate.mode`. | manager orchestration: [evaluation.md](workflow/evaluation.md); specialist phase load: [../evaluation/SKILL.md](../evaluation/SKILL.md) | evaluator |
| 4 | `RECORD` | Full PASS path. | manager orchestration: [record.md](workflow/record.md); specialist phase load: [../record/SKILL.md](../record/SKILL.md) (+ [../memory/memory-map.md](../memory/memory-map.md)) | assistant |
| 5 | `ITER / EXIT` | Task complete → next task; all tasks complete → advance to Step 6. | manager orchestration: —; specialist phase load: — | manager |

### Step 6 — Wrap-up Loop

**Definition.** Consolidate prior loops' artifacts; archive closed backlogs; promote staged mistakes; write handoff; open PR.

**Inputs.** `Idea`, `Plan`, `Results` from prior loops + cumulative session-staging.

**Output.** Doc updates (per Principle 6), session report, memory updates, handoff summary, opened PR.

**Loop iteration.** 5-row loop; cap from `workflow.wrap-up.maxIterations` (Auto default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | `discuss.mode = "agent"`. Manager constructs assistant delegation prompt. | manager orchestration: [discussion](../discussion/SKILL.md), [delegation](delegation.md); specialist phase load: — | manager |
| 2 | `WRAPUP` | Spawn `assistant` subagent. Consolidate artifacts; archive backlogs; promote mistakes; write handoff. | manager orchestration: [wrap-up.md](workflow/wrap-up.md); specialist phase load: [../wrap-up/SKILL.md](../wrap-up/SKILL.md) | assistant |
| 3 | `EVALUATION` | Run per `workflow.wrap-up.evaluate.mode`. | manager orchestration: [evaluation.md](workflow/evaluation.md); specialist phase load: [../evaluation/SKILL.md](../evaluation/SKILL.md) | evaluator |
| 4 | `RECORD` | Full PASS path — write session and memory for this iteration. | manager orchestration: [record.md](workflow/record.md); specialist phase load: [../record/SKILL.md](../record/SKILL.md) (+ [../memory/memory-map.md](../memory/memory-map.md)) | assistant |
| 5 | `ITER / EXIT` | `PASS` → session closed. `REVISE` → re-enter `DISCUSSION` (up to `max=5` remediation iterations). `FAIL` or cap exhausted → escalate to user per [Workflow State Machine § Iteration Caps](workflow/state-machine.md#iteration-rule). | manager orchestration: —; specialist phase load: — | manager |

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
> Destructive). For those three categories, the active runtime's user-decision primitive fires exactly as it would in Chat
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
wrong, the cost is) fires through the active runtime's user-decision primitive. USER CHALLENGE is **never auto-decided**.
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
| `evaluate.mode` (all loops) | `"always"` | Evaluation runs every loop, no mode-driven skip. The manager never asks whether/how to evaluate — see §7. `"skip"` is a power-user per-session override; the redesign does not change this, but documenting it preempts future drift. **Note:** `evaluate.mode: skip` skips only the EVALUATION phase; the step-level `skip: true` boolean (new) skips the WHOLE step. Distinct signals. |
| `propose.mode` (all loops) | `"dual"` | The mirror of `evaluate.mode` on the creation side: the Codex proposer runs alongside the Claude producer every WORK sub-phase (dual-system production) — see §7.5. `"single"` is a deliberate Claude-only override — a configured Claude-only run that is NOT degraded mode and does NOT stamp the degraded-mode label. The distinct **degraded** case is a missing or timed-out proposer under `dual`: it falls back to Claude-only WITH the degraded-mode label and is NOT a safety gate. Orchestration: [`workflow/production.md`](workflow/production.md). |
| `workflow.ideation.discuss.mode` | `"user"` | Ideation DISCUSSION is user-driven — user confirms approach before leader works. |
| `workflow.preparation.discuss.mode` | `"user"` | Preparation DISCUSSION is user-driven — user confirms readiness gaps before prep work. |
| `workflow.planning.discuss.mode` | `"agent"` | Planning DISCUSSION is agent-driven — manager proceeds without a gate per loop entry. Always-Ask categories still fire (§3). |
| `workflow.execution.discuss.mode` | `"agent"` | Execution DISCUSSION is agent-driven. Always-Ask categories still fire (§3). |
| `workflow.wrap-up.discuss.mode` | `"agent"` | Wrap-up DISCUSSION is agent-driven. Always-Ask categories still fire (§3). |

**Preparation runs.** Auto Mode does not skip Preparation. The `skip: false` + `maxIterations: 5`
values mean the standard loop contract runs (DISCUSSION → WORK → EVALUATION → RECORD →
ITER/EXIT). This is the structural contrast with Chat Mode, where preparation carries
`skip: true` + `maxIterations: 0` → `state: Skipped` (either signal alone suffices).

**Full per-loop RECORD.** Auto Mode uses the **unmodified** `record/SKILL.md` PASS
path, including Steps 6–7 (typed-finding staging). Chat Mode now runs the same unmodified base RECORD (see [`chat-mode.md` §4](chat-mode.md)), so neither mode narrows the PASS path.
Every loop's RECORD runs the full base procedure, including mistake-candidate staging at
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
continuing is safe), and the failure surfaces explicitly in the Wrap-up Loop's RECORD and
the session handoff.

This is by design — per `orchestration/SKILL.md` § Mode-specific gates within a loop contract. The silence is not a bug;
it is Auto Mode's autonomy contract: the user reviews outcomes at session end (Wrap-up), not
mid-step. This note exists so a future reader does not mistake the mid-session silence for a
missing interrupt.

**Exception.** If a Planning or Execution abort makes the remaining steps unsound (e.g., Planning
aborted with no deliverable plan), the manager MUST surface this through the active runtime's user-decision primitive before
proceeding to the next step — proceeding on a broken foundation is a step failure, not a
recoverable abort.

This section's no-mid-loop-interrupt contract feeds §7.3 — see [§7 — Evaluation discipline (Auto Mode)](#7--evaluation-discipline-auto-mode).

---

## §7 — Evaluation discipline (Auto Mode)

The Auto manager's single home for how EVALUATION runs in Auto Mode. Evaluation rules are otherwise
scattered across the §2 per-loop tables (row 3) and the §4 defaults `evaluate.mode` row; this section
states the contract so the manager cannot rationalize past it. §7.5 extends the same discipline to the
creation-time counterpart — the dual-system **production**-integration gate (`propose.mode`, §4).

### §7.1 — Evaluation is mandatory and never a question.

The manager runs dual-system EVALUATION on every loop. `evaluate.mode = "always"` is locked (§4
defaults). **The manager MUST NOT ask the user whether to evaluate, which systems to use, or whether
to skip.** There is no "dual-system / claude-only / skip" choice in Auto Mode. "claude-only" is NOT a
pre-evaluation option; it exists only as the documented post-failure degraded-mode fallback in
[`workflow/evaluation.md § Degraded-mode policy`](workflow/evaluation.md#degraded-mode-policy-single-system-fallback),
reached only after a system fails and its one retry fails, and only via that section's own
stop-the-line user-decision primitive.

### §7.2 — The manager MUST NOT evaluate; it spawns exactly two evaluators.

The manager is the producer/orchestrator, never the evaluator — producer/evaluator separation per
[`evaluation/SKILL.md`](../evaluation/SKILL.md) and the "Evaluation is a mandatory sub-phase" block
in `.claude/CLAUDE.md`. For every EVALUATION phase the manager **spawns exactly two evaluator
subagents — one per system (Claude + Codex)** — per [`workflow/evaluation.md`](workflow/evaluation.md).
The manager **MUST NOT** write evaluation findings itself, stamp a verdict without two evaluator
outputs, or substitute "manager-verification" for the evaluators. The manager aggregates the two
systems' verdicts; it does not produce them. See `mistakes/manager-skipped-dual-system-eval.md`.

### §7.3 — On REVISE, auto-iterate; do not run routine triage mid-loop; keep the safety gates.

When EVALUATION returns `REVISE`, the manager re-enters `DISCUSSION` with the findings appended and
re-delegates the fix, up to `maxIterations` (default 5) — automatically, without pausing the user.
**The manager MUST NOT run any routine-triage escalation mid-loop and MUST NOT idle after
EVALUATION.** Routine-triage escalations are the mode-agnostic "ask the user" paths in
[`workflow/evaluation.md`](workflow/evaluation.md) — **maxIterations exhaustion
([§ Iteration Caps](workflow/evaluation.md#iteration-caps)), a stuck finding
([§ Stuck detection](workflow/evaluation.md#stuck-detection-manager-side-post-reconciliation)), and a
regression ([§ Regression marking](workflow/evaluation.md#regression-marking-manager-side-post-reconciliation))**.
In Auto mode the manager handles each by auto-iterating within budget, recording the tag/finding, and
surfacing it in the Wrap-up finding set — never interrupting. The user reviews the **full finding set
at Wrap-up** (§6), not mid-loop.

**Safety-gate carve-out (these still interrupt in Auto — do NOT silence them).** The manager DOES
interrupt for the genuine dual-system safety gates, which are not routine triage: a **major
dual-system divergence** (`PASS`↔`FAIL` / `REVISE`↔`FAIL`,
[`evaluation.md § Severity-gated divergence handling`](workflow/evaluation.md#severity-gated-divergence-handling)),
the **degraded-mode / single-system fallback** and **both systems failing**
([`evaluation.md § Degraded-mode policy`](workflow/evaluation.md#degraded-mode-policy-single-system-fallback)).
These fall under [§1](#1--mode-posture)'s "a step fails in a way the manager cannot resolve."
Always-Ask findings (Design / Scope / Destructive per [§3](#3--always-ask-codification)) and findings
implying an unresolvable scope change ([§1](#1--mode-posture) interrupt #2) also still interrupt. A
minor divergence (`PASS`↔`REVISE`) auto-proceeds, as today. Any aggregate `FAIL` verdict always
escalates per [`SKILL.md § Iteration rule`](SKILL.md#iteration-rule) — a `FAIL` is always either a
dual-system divergence or a both-systems-fail, so it always hits one of these named gates and is never
auto-re-entered as a `REVISE`.

This is the Auto-mode counterpart to the Chat-scoped finding-discussion rule in `.claude/CLAUDE.md`
and to the Chat branches of `evaluation.md`'s routine-triage sections.

### §7.4 — "manager never" quick-guard (scannable).

Scan this at any EVALUATION boundary:

| The manager NEVER… | Instead… |
|---|---|
| asks whether/how to evaluate, or offers skip/claude-only | runs dual-system EVALUATION every loop (`evaluate.mode: always`) |
| performs the evaluation itself | spawns exactly 2 evaluator subagents (one per system) |
| runs routine triage mid-loop — defer/accept, **Iteration Caps**, **Stuck detection**, **Regression marking** | auto-iterates within budget; records the tag/finding; surfaces it at Wrap-up |
| idles after EVALUATION | proceeds: PASS → next step; REVISE → re-enter DISCUSSION |
| **silences a dual-system safety gate** (major divergence, degraded-mode/single-system fallback, both-systems-fail) | **interrupts** — these are §1 "cannot resolve" gates, not routine triage |

### §7.5 — Production integration discipline (Auto Mode)

The creation-time counterpart to §7.3. When `propose.mode == dual` (§4), every WORK sub-phase runs a
**parallel Codex proposer** alongside the Claude producer; the Claude producer is the **default
integrator** and **selectively integrates** the frozen proposal (SELECT, never naive-blend), recording
each delta in the **Integration Log** (`working/reconciliation-iter{n}.md`). The full orchestration —
spawn, two-phase freeze, gap classification — is in [`workflow/production.md`](workflow/production.md);
this section states only the Auto-mode interrupt contract for an unresolved integration gap.

**A small gap is producer-local — no interrupt.** A **small gap** (additive / refinement / stylistic /
clearly principle-decided) is integrated by the producer and logged to the Integration Log. In Auto Mode
it is recorded and surfaced in the **Wrap-up finding set** (§6), never mid-loop — the same auto-proceed
contract a minor divergence gets in §7.3.

**A large-gap production escalation is a safety-gate — it interrupts in Auto (do NOT silence it).** A
**large gap** — ANY of an Always-Ask category (Design / Scope / Destructive, §3), a mutually-exclusive
fork at the artifact's core, or principle-equipoise the producer cannot resolve (per
[`workflow/production.md § Gap classification`](workflow/production.md#gap-classification)) — is surfaced
by the producer, adjudicated by the manager, and escalated to the user. It interrupts in BOTH Auto and
Chat, exactly like the §7.3 dual-system safety gates (major divergence, degraded-mode/single-system
fallback). A missing or timed-out Codex **proposer** is NOT a safety gate — it degrades to Claude-only
with a durable label (per [`workflow/production.md § Degraded-mode policy`](workflow/production.md#degraded-mode-policy-claude-only-fallback)),
in contrast to a missing Codex evaluator, which is.

Scan this at any production-integration boundary:

| The manager NEVER… | Instead… |
|---|---|
| lets the producer synthesize / naive-blend the two drafts | the producer SELECTS per principle and records the Integration Log |
| silences a **large-gap** production escalation (Always-Ask / fork / equipoise) | **interrupts** — a large-gap is a production **safety-gate** in Auto, like §7.3's dual-system gates |
| interrupts mid-loop on a **small gap** | producer integrates locally + logs it; surfaced at Wrap-up (§6) |
| treats a missing Codex proposer as a safety gate | proceeds Claude-only with the degraded-mode label (production.md) |

---

## Cross-references

- [`orchestration/SKILL.md`](SKILL.md) — workflow governor; `§ Auto Mode` brief description;
  `§ Workflow State Machine` for the shared loop mechanics (it points back to this doc's §3/§6
  for the Auto gate behavior); `§ Workflow Status Display` for the Auto rendering (6-row table).
  The maxIterations-exhaustion silence contract lives in this doc's §6.
- [`orchestration/chat-mode.md`](chat-mode.md) — the symmetric Chat-Mode specification; R1 lock +
  `skip: true` (`preparation = {skip: true, maxIterations: 0} → state: Skipped`) is Chat-only and
  does not apply in Auto Mode. Both modes run the unmodified base RECORD — the Chat-vs-Auto
  difference is preparation-skip, not RECORD narrowing.
- [`discussion/SKILL.md § Decision Classification`](../discussion/SKILL.md) — authoritative
  Always-Ask matrix (Design / Scope / Destructive categories, full table with examples and
  why-always-ask rationale). §3 of this doc references and restates it; `discussion/SKILL.md`
  is the single source of truth.
- [`planning/SKILL.md § Core Principles § USER CHALLENGE`](../planning/SKILL.md) — 5-field
  escalation card for leader-user disagreement. Referenced in §3.4.
- [`record/SKILL.md`](../record/SKILL.md) — the unmodified base RECORD
  procedure. Auto Mode runs this base procedure in full (no local override).
- [`mistake/SKILL.md § P2`](../mistake/SKILL.md) — moment-of-capture discipline for
  mistake-candidates; runs in Auto Mode regardless of loop or discuss.mode setting.
- [`.claude/CLAUDE.md` § Evaluation is a mandatory sub-phase](../../../../../.claude/CLAUDE.md) —
  the mode-split Evaluation block: Chat discusses findings with the user; Auto auto-iterates on
  REVISE and reviews the full finding set at Wrap-up. §7 is the Auto-mode counterpart.
- [`workflow/evaluation.md § Degraded-mode policy`](workflow/evaluation.md#degraded-mode-policy-single-system-fallback) —
  the only home of the "claude-only" single-system fallback (a safety gate; interrupts in Auto too).
  Cited by §7.1 and §7.3.
- [`workflow/production.md`](workflow/production.md) — dual-system production orchestration (spawn,
  two-phase freeze, selective integration, gap classification, degraded-mode). §4's `propose.mode` row
  and §7.5's production-integration safety gate cite it; a large-gap escalation interrupts in Auto.
- [`workflow/evaluation.md § Iteration Caps`](workflow/evaluation.md#iteration-caps),
  [`§ Stuck detection`](workflow/evaluation.md#stuck-detection-manager-side-post-reconciliation),
  [`§ Regression marking`](workflow/evaluation.md#regression-marking-manager-side-post-reconciliation) —
  the three routine-triage sections, mode-split so Auto records and surfaces at Wrap-up. Cited by §7.3/§7.4.
- `mistakes/skills-mirror-symlinks-not-copies.md` — editing the canonical file at
  `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` reflects automatically via the
  `.claude/skills/orchestration/auto-mode.md` mirror symlink; do not double-edit.
