# Chat Mode

Sub-document of the `orchestration` skill. Owns the **full** Chat-Mode specification: mode posture,
the per-task slice workflow shape, per-loop discipline, the locally-overridden Chat MEMORIZATION
procedure (R5 lock — see §4 for the canonical statement), the per-task `task-record.md` artifact
contract, the explicit end-of-session Wrap-up trigger, the Workflow Status Display rendering spec,
and the per-task state-transition table.

For the workflow governor and the global 6-step state machine, see
[`orchestration/SKILL.md`](SKILL.md). For the unmodified base MEMORIZATION procedure that §4
locally overrides, see [`memorization/SKILL.md`](../memorization/SKILL.md).

---

## §1 — Overview

Chat Mode is the user-driven, conversational orchestration mode. The manager runs **one per-task
slice** per user-typed task and returns control to the user after each slice. There is no upfront
task list; the session's shape is the union of all per-task slices the user types between session
start and an explicit end-of-session signal.

**Why this doc exists.** The global orchestration mode contract in `orchestration/SKILL.md` (lines
241–242) originally stated "Mode controls user gates; it does not relax the workflow." That lock has
been superseded by the mode-dispatched state-machine design ratified in session
`2026-05-28-8eed14fb`. Chat Mode now controls *which state machine runs*, not just gate density —
it dispatches a per-task slice loop, not the linear Ideation → Preparation → Planning → Execution
→ Wrap-up sequence. See the CORRECTION annotation in `orchestration/SKILL.md §
Orchestration Mode` for the ADR record.

---

## §2 — Mode posture

Chat Mode is the user-driven, conversational orchestration mode. **The user types one task at a
time; the manager runs a full per-task slice and returns to the user.** No upfront task list. No
autonomous multi-task runway. The session's shape is the union of all per-task slices the user
types between session start and the user's explicit end-of-session signal.

**Term lock — "per-task slice."** The single canonical term for the unit Chat dispatches is
**per-task slice**. Synonyms ("per-user-typed-task slice", "task slice", "Chat task") are
non-canonical — use "per-task slice" consistently in all downstream prose.

This re-frames the 6-step state machine:

- **Configuration** (Step 1) runs once per session — unchanged.
- **Wrap-up** (Step 6) runs once per session, triggered only on explicit user signal — see §7;
  up to 5 remediation iterations on `REVISE` before abort (`wrap-up.maxIterations: 5`).
- Between them, the manager runs **per-task slices**, not a linear Ideation → Preparation →
  Planning → Execution → Wrap-up sequence.
- Each per-task slice contains its own Ideation loop, its own Preparation loop (which resolves to
  `state: Skipped` at loop entry — chat preparation carries `skip: true` AND `maxIterations: 0`;
  either signal alone suffices), its own mini Planning loop, its own mini Execution loop,
  and its own task-record boundary.

This is the structural change that supersedes the original SKILL.md 241–242 lock. Mode no longer
just controls whether the manager pauses for `AskUserQuestion`; mode now controls which state
machine runs between Configuration and Wrap-up.

---

## §3 — Workflow

Chat Mode dispatches a **per-task slice** loop between Configuration (Step 1) and
Wrap-up (Step 6). Each slice runs Steps 2-5 inline, exits at the slice boundary
(task-record + user review gate), and the manager either enters the next slice or
exits to Step 6 on the user's explicit end-of-session signal.

```
Step 1 — Configuration (once per session)
   │
   ▼
┌──────── Per-task slice ───────────────────────────────────────────┐
│  user types a task                                                 │
│   │                                                                │
│   ▼                                                                │
│  Step 2 — Full Ideation Loop  (maxIter=5)                          │
│      DISCUSSION (forced user-driven, regardless of discuss.mode)   │
│           ↓                                                        │
│      WORK     (leader; full 4 sub-steps A–D)                       │
│           ↓                                                        │
│      EVALUATION (always)                                           │
│           ↓                                                        │
│      MEMORIZATION  — Chat narrowed PASS path (see §4 canonical)    │
│           ↓                                                        │
│      ITER / EXIT (PASS → next; REVISE → back to DISCUSSION)        │
│   │                                                                │
│   ▼                                                                │
│  Step 3 — Preparation Loop  ⊘  state: Skipped at loop entry        │
│      (R1 + skip: settings.workflow.preparation =                   │
│       {skip: true, maxIterations: 0} — either signal alone         │
│       suffices → manager skips DISCUSSION+WORK+EVAL+MEMO rows      │
│       entirely; stamps state: Skipped; no FAIL or Aborted verdict; │
│       persists workflow.chat.tasks[i].preparation =                │
│       {state: "Skipped", iterations: []}.)                         │
│      The user MAY opt in for a complex task by typing an explicit  │
│      prep override; opt-in runs the standard contract.             │
│   │                                                                │
│   ▼                                                                │
│  Step 4 — mini Planning Loop  (maxIter=5)                          │
│      Same 5-row loop, scope = this one task's worth of plan        │
│      (one or a few sub-steps, ordered).                            │
│      MEMORIZATION = Chat narrowed PASS path (§4).                  │
│   │                                                                │
│   ▼                                                                │
│  Step 5 — mini Execution Loop per Plan sub-step  (maxIter=5)       │
│      Same 5-row loop per sub-step (fresh executor by default);     │
│      sub-steps sequence as the mini-Plan ordered them.             │
│      MEMORIZATION = Chat narrowed PASS path (§4).                  │
│   │                                                                │
│   ▼                                                                │
│  Task boundary: per-task task-record.md (5–10 lines)               │
│   │                                                                │
│   ▼                                                                │
│  USER REVIEW GATE (AskUserQuestion):                               │
│      ▸ Next task                                                   │
│      ▸ Revise this task                                            │
│      ▸ Wrap up the session                                         │
└────────────────────────────────────────────────────────────────────┘
   │ (user signals "wrap up")
   ▼
Step 6 — Wrap-up Loop  (maxIter=5)
   FULL MEMORIZATION consolidation:
   - mine the session transcript
   - read every per-task task-record.md
   - promote staged mistakes (Layer 1 + Layer 2)
   - archive shipped backlogs (move-on-terminal)
   - write the session handoff
```

Per-slice procedure follows the SKILL.md pattern: each step has Definition / Inputs /
Output / Loop iteration / procedure table. Steps 2-5 are bounded loops scoped to one
slice's worth of work.

### Step 1 — Configuration (session-level)

**Definition.** Same as Auto Mode's Step 1. See [`orchestration/SKILL.md § Step 1 — Workflow Configuration`](SKILL.md#step-1--workflow-configuration) for the canonical procedure. Chat Mode performs configuration once per session before any slice runs.

### Step 2 — Slice Full Ideation Loop

**Definition.** Explore the user-typed task's problem space; produce a slice-scoped Idea.

**Inputs.** The user-typed task (plain text).

**Output.** A slice-local Idea covering Scope Contract + Design recommendation.

**Loop iteration.** 5-row loop; cap from `settings.workflow.ideation.maxIterations` (Chat default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Forced user-driven per the discuss-first contract (§9) — overrides any per-step `discuss.mode` setting. Manager + user converge on the slice intent. | [discussion](../discussion/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent. Leader runs the full 4-substep procedure (Frame → Lock Scope → Research → Design Recommendation) scoped to this one slice. | [ideation.md](workflow/ideation.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.ideation.evaluate.mode` (default `always`). Aggregate verdicts per [Workflow State Machine § Verdict aggregation](SKILL.md#verdict-aggregation). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Narrowed PASS path per §4: preserve transcript + session.json upsert + PASS-iter `outputs/`; skip typed-finding staging. Mistake stage moment-of-capture always live. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | `PASS` → advance to Step 3. `REVISE`/`FAIL` with budget → return to row 1 with findings appended. Budget exhausted → escalate to user via AskUserQuestion. | — | manager |

### Step 3 — Slice Preparation Loop (Skipped at loop entry)

**Definition.** Slice-level readiness verification — does the slice need project-memory or workspace-skill gap fixes before Planning?

**Inputs.** Locked slice Idea.

**Output.** Confirmed readiness — by default, `state: Skipped` (no work performed).

**Loop iteration.** None. Chat preparation is `{skip: true, maxIterations: 0}`; either signal resolves to `state: Skipped` at loop entry (loop-entry Skipped resolution, two independent signals) — no DISCUSSION / WORK / EVALUATION / MEMORIZATION rows execute; no FAIL or Aborted verdict is emitted.

**Opt-in.** A complex slice can opt back in by setting `skip: false` AND raising `workflow.preparation.maxIterations` above 0 via the customize gate (Step 1 row 2) — both signals must be cleared. The standard loop contract then runs.

### Step 4 — Slice Mini Planning Loop

**Definition.** Lightweight decomposition of the slice into ordered sub-steps with verification anchors.

**Inputs.** Locked slice Idea (from Step 2).

**Output.** A slice-local Plan — typically 1-4 sub-steps with success criteria each.

**Loop iteration.** 5-row loop; cap from `settings.workflow.planning.maxIterations` (Chat default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Forced user-driven per §9. Manager + user agree on decomposition shape. | [discussion](../discussion/SKILL.md) | manager |
| 2 | `WORK` | Spawn the `leader` subagent for light decomposition. Output = ordered sub-step list with success criteria. | [planning.md](workflow/planning.md) | leader |
| 3 | `EVALUATION` | Run per `workflow.planning.evaluate.mode` (default `always`). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Narrowed PASS path per §4. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Same exit semantics as Step 2. | — | manager |

### Step 5 — Slice Mini Execution Loop (per sub-step)

**Definition.** Implement each Plan sub-step in sequence. Runs once per sub-step in the slice Plan.

**Inputs.** A single sub-step from the slice Plan (or eval findings on re-entry).

**Output.** Code or doc changes plus verification evidence — the sub-step's `Result`. The slice's full `Results` is the integrated set.

**Loop iteration.** 5-row loop per sub-step; cap from `settings.workflow.execution.maxIterations` (Chat default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Manager constructs the executor delegation prompt; in Chat, forced user-driven per §9 (override discuss.mode). | [discussion](../discussion/SKILL.md) | manager |
| 2 | `EXECUTION` | Spawn a fresh `executor` subagent per the slice's inline-paste-per-task discipline (no cross-task subagent memory unless the executor is continued per `delegation/SKILL.md § Continue vs Fresh` — shared subsystem, under the saturation cap). Collect work artifact + verification evidence. | [execution.md](workflow/execution.md) | executor |
| 3 | `EVALUATION` | Run per `workflow.execution.evaluate.mode` (default `always`). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Narrowed PASS path per §4. | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | Same exit semantics. Sub-step complete → next sub-step (or slice boundary if last). | — | manager |

### Slice Boundary — task-record + user review gate

**Definition.** Capture the slice outcome and prompt the user to choose the next move.

**Inputs.** Outputs of Steps 2-5 (slice Idea + slice Plan + slice Results).

**Output.** A per-task `task-record.md` written (per §6 spec) AND a user decision via AskUserQuestion: next task / revise / wrap up.

**Procedure.** Sequential — not a loop.

| # | Action | Refs | Agent |
|---|---|---|---|
| 1 | Write the per-task `task-record.md` to `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/task-record.md` per §6. | [§6 task-record spec](#6--task-record-artifact-spec) | assistant |
| 2 | Render the [Workflow Status Display](#8--workflow-status-display-chat-rendering) showing the just-completed task. | [§8](#8--workflow-status-display-chat-rendering) | manager |
| 3 | AskUserQuestion: Next task / Revise this task / Wrap up the session. | [discussion](../discussion/SKILL.md) | manager |
| 4 | On `Next task`: enter the next slice (Step 2 of new slice). On `Revise`: re-enter Step 2 of current slice with the user-stated revision focus. On `Wrap up`: advance to Step 6. | — | manager |

### Step 6 — Session Wrap-up Loop

**Definition.** Consolidate the session's artifacts; archive closed backlogs; promote staged mistakes to project memory; write the handoff; open PR.

**Inputs.** All per-slice `task-record.md` files + session transcript + Configuration-time settings + cumulative session-staging (mistakes only, under the Chat narrowed contract).

**Output.** Session handoff doc; project-memory updates (mistakes promoted); archived backlogs (move-on-terminal); opened PR.

**Loop iteration.** 5-row loop; cap from `settings.workflow.wrap-up.maxIterations` (Chat default = 5).

| # | Phase | Action | Refs | Agent |
|---|---|---|---|---|
| 1 | `DISCUSSION` | Forced user-driven per §9. Manager + user confirm consolidation scope. | [discussion](../discussion/SKILL.md) | manager |
| 2 | `WORK` | Spawn `assistant` subagent. Consolidate: archive backlogs, mine task-records + transcript, promote staged mistakes, write handoff. | [wrap-up.md](workflow/wrap-up.md) | assistant |
| 3 | `EVALUATION` | Run per `workflow.wrap-up.evaluate.mode` (default `always`). | [evaluation.md](workflow/evaluation.md) | evaluator |
| 4 | `MEMORIZATION` | Full PASS path — `Wrap-up MEMORIZATION runs the unmodified base procedure` per the §4 base-unmodified clause. This is where typed-finding staging from prior slices is promoted (none under the Chat narrowed contract since per-slice staging was skipped — Wrap-up mines transcripts + task-records instead). | [memorization.md](workflow/memorization.md) | assistant |
| 5 | `ITER / EXIT` | `PASS` → close session. `REVISE` → re-enter `DISCUSSION` (up to `max=5` remediation iterations). `FAIL` or cap exhausted → escalate to user per [Workflow State Machine § Iteration Caps](SKILL.md#iteration-rule). | — | manager |

---

## §4 — Chat MEMORIZATION — canonical statement (R5 lock)

**Single canonical statement (no other section in any doc may state Chat MEMORIZATION otherwise;
all cross-references in §3, §5, and `orchestration/SKILL.md` point here):**

> **In Chat Mode, every loop's MEMORIZATION sub-phase runs after every EVALUATION verdict (PASS /
> REVISE / FAIL) — it is never skipped.** Locally in this `chat-mode.md`, the PASS path is
> **narrowed** relative to the base `memorization/SKILL.md` procedure:
>
> - **Steps preserved:** Step 5 (CREATE `outputs/{free-filename}.md`) and Step 8 (UPDATE
>   `session.json.workflow.{loop}.finishedAt` + `verdict: PASS`). Plus every-iter Step 2 (CREATE
>   the session-root `transcripts/{role}-{agentId}.jsonl` copy) and Step 3 (UPSERT
>   `session.json.workflow.{loop}.iterations[]`) — every-iter steps are not Chat-specific.
> - **Steps skipped:** Step 6 (CREATE typed-finding stagings under
>   `staging/{scenarios,checklists,decisions,references,…}/`) and Step 7 (CREATE
>   `staging/{design,discussions,reviews,reports}/`). These are deferred — the staging surface is
>   mined from the session transcript and the per-task `task-record.md` files by the Wrap-up
>   Loop's MEMORIZATION at session end.
> - **Moment-of-capture preserved.** The `mistake/SKILL.md § P2` discipline — stage a
>   mistake-candidate at the moment a correction is detected, not at end-of-loop — is **NOT** part
>   of Steps 6–7's deferred typed-finding staging. Mistake-candidates are written immediately to
>   `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true` per
>   `mistake/SKILL.md § P2` regardless of Chat's narrowed PASS path. This exception holds because
>   the moment-of-capture discipline is governed by the `mistake` skill, not by
>   `memorization/SKILL.md`.
> - **`memorization/SKILL.md` is unmodified.** The narrowed PASS path is a Chat-Mode local
>   override, declared in this `chat-mode.md` and cross-linked to `memorization/SKILL.md` for the
>   unmodified base procedure. A reader of `memorization/SKILL.md` sees the full base; a reader of
>   this `chat-mode.md` sees the base plus the Chat override.

**Wrap-up's input under Chat narrowed staging.** Because Steps 6–7 don't run per-loop in Chat,
Wrap-up MEMORIZATION must: (a) mine the session transcript, (b) walk every
`chat/tasks/{NN}-{slug}/task-record.md`, and (c) reconstruct typed findings from the per-loop
evaluation files (`{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` — which DO get written
every iter regardless of Chat's narrowing). Wrap-up's procedure extension is
`wrap-up/SKILL.md`-side and is separately tracked. The `task-record.md` body shape (§6) is
designed to make this reconstruction tractable — it surfaces decisions taken, open threads, and
artifact pointers.

This is the single statement. Any reference to "MEMORIZATION runs every loop with a narrowed PASS
path" or "Chat narrowed staging" anywhere in the `orchestration/` skill or downstream docs is a
short-form pointer to this section.

---

## §5 — Per-loop discipline

Inside any Chat-Mode loop slice (Ideation / Preparation when not skipped / mini Planning / mini
Execution):

- **DISCUSSION is forced user-driven**, regardless of the resolved `discuss.mode`. The leader
  proposes (research-backed); the user decides via `AskUserQuestion`. This is the discuss-first
  Chat-Mode property; it does not override `discuss.mode` in settings (settings still resolve to
  `"user"` everywhere in the Chat defaults), but it is documented here so a future settings change
  cannot accidentally regress it.
- **Three mode-specific gates within a loop** still apply (the shared mechanics in
  `orchestration/SKILL.md § Workflow State Machine` point here): after DISCUSSION → confirm
  delegation prompt; after EVALUATION → discuss findings and remediation; at ITER/EXIT → confirm
  exit. WORK and MEMORIZATION auto-advance — the delegation prompt is already user-approved and
  MEMORIZATION is mechanical capture.
- **Iteration cap is 5** for Ideation / Planning / Execution (Auto's default is also 5). A
  user-typed task that exhausts the budget without `PASS` is a signal to reframe or split, not
  iterate further.
- **Evaluation always runs.** `evaluate.mode: always` across all loops in Chat.
- **MEMORIZATION runs every loop with the §4 narrowed PASS path.**
- **Fresh subagent context per slice.** Every leader / executor / evaluator spawn pastes its
  context inline — no cross-task subagent memory unless the executor is continued per
  `delegation/SKILL.md § Continue vs Fresh` (shared subsystem, under the saturation cap). The
  manager is the only durable cross-task agent. Governance: `delegation/SKILL.md § Inline-Paste Rule` (the discipline) and Principle 1
  (the underlying behavioral law — "no action without thinking and studying it through first"; iter1's Principle
  4 citation was a wrong-number reference, corrected per §8 L-P1/L-C2/L-U1 of the Idea doc for
  this redesign).
- **Mistake-stage moment-of-capture.** Every correction the manager or any subagent identifies in
  a Chat per-task slice is staged immediately at
  `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true`, per
  `mistake/SKILL.md § P2`. This is the explicit exception to §4's "Steps 6–7 skipped" narrowing
  — the moment-of-capture is governed by the `mistake` skill, not by `memorization/SKILL.md`.

---

## §6 — task-record artifact spec

Per Chat task, the per-task slice's MEMORIZATION assistant writes one `task-record.md` at the
task boundary (after the mini Execution Loop's last sub-step exits, or after mini Planning if
mini Execution was skipped); the manager verifies its presence before the user review gate. See
§6.4 for owner details.

### 6.1 Path and layout

**Decision D-A (session-local only):** the task-record is session-scope only. It is NOT a
project-memory type, NOT a feature-memory entry, and NOT routed to `notes/` (project-level
`notes/` is a session-journal type per `memorization/rules.md`). It lives under the session tree:

```
sessions/{date}-{session-id}/chat/tasks/{NN}-{slug}/task-record.md
```

where:

- `{date}` — session start date `YYYY-MM-DD`
- `{session-id}` — session UUID
- `{NN}` — zero-padded ordinal within the session (chronological aid only)
- `{slug}` — subject-descriptive kebab-case slug per `memorization/rules.md § 1.3`; names the
  task's deliverable concept, NOT the ordinal (e.g., `03-chat-mode-redesign-idea-doc`, not
  `03-task-3`)

**Decision D-B (per-task slice layout):** the full per-task slice session layout is:

```
sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/
    task-record.md
    1-ideation/
        {working,evaluation,staging,outputs}/
    3-planning/
        {working,evaluation,staging,outputs}/
    4-execution/
        {working,evaluation,staging,outputs}/
```

The per-task sub-loop dirs carry the same `{N}-{loop}` number prefix and the same
4-slot interior (`working/ evaluation/ staging/ outputs/`) as the main session
tree — see [`templates/session-tree.md`](templates/session-tree.md) for the
canonical shape. Preparation is not present in the directory tree for tasks where
`state: Skipped` (the default — chat preparation is `{skip: true, maxIterations: 0}`).
If a user opts into Preparation for a specific task, a `2-preparation/` subdirectory
appears with the same 4-slot interior.

### 6.2 Frontmatter type — deferred to Planning

**Frontmatter type for `task-record.md` is deferred.** The iter1 ideation draft proposed `type:
notes` but that collides with the project-level chronological journal convention in
`memorization/templates/notes.md` (project-only type, one entry per session — see
`mistakes/prose-reclassification-target-is-project-level-notes.md`). Planning will resolve this
by choosing one of:

(a) `artifact_type: task-record` aligned to the `outputs/` Artifact frontmatter schema in
`memorization/SKILL.md § Artifact frontmatter schema`, or

(b) a new dedicated `task-record` template under `memorization/templates/task-record.md`.

Either way the per-task record is **session-scope only** (D-A). Until Planning makes this choice,
agents authoring a task-record should use the `outputs/` Artifact frontmatter schema as a default
(carrying `loop`, `iter`, `artifact_type: task-record`, `created_at`, `status`).

### 6.3 Body structure

5–10 lines, five sections:

```markdown
## What the user asked
(1–2 lines — verbatim or paraphrased ask; prefer paraphrase if the ask contains secrets or PII)

## What shipped
(1–3 lines — the concrete deliverable + path)

## Decisions taken
(1–3 lines — citing decisions staged during the per-task slice)

## Open threads
(1–2 lines — anything deferred or flagged)

## Pointers
(1–2 lines — paths to the per-task slice's outputs/ files)
```

### 6.4 Writer

The task-record is written by:

- The mini Execution Loop's MEMORIZATION assistant on PASS of the last sub-step, OR
- The mini Planning Loop's MEMORIZATION assistant on PASS, if mini Execution was skipped.

Either way it is the **assistant role**. The manager verifies presence of the task-record at the
user review gate before presenting `AskUserQuestion` options.

### 6.5 Wrap-up role

Wrap-up's MEMORIZATION reads every `task-record.md` in the session (path pattern:
`chat/tasks/*/task-record.md`), plus the session transcript, and consolidates into project-memory
promotions per `wrap-up/SKILL.md`. Wrap-up may reclassify task-record body narrative into
project-level `notes/` per `mistakes/prose-reclassification-target-is-project-level-notes.md`
(project-tier, not feature-tier).

---

## §7 — Wrap-up trigger (explicit end-of-session)

In Chat Mode, Wrap-up runs **only when the user explicitly signals end-of-session**. The signal is
one of:

- The user selects "Wrap up the session" at the per-task user review gate (AskUserQuestion).
- The user types an explicit end-of-session message (e.g., "we're done", "wrap up", "end
  session").
- The user invokes `/gobbi wrap-up` (if such a command exists; otherwise the message form above).

The manager does **NOT** auto-trigger Wrap-up on any other signal:

- No auto-trigger on "no more tasks for now".
- No auto-trigger on idle.
- No auto-trigger after N tasks.

The discipline is symmetric to the Always-Ask Destructive category in
`discussion/SKILL.md § Decision Classification`: ending the session changes durable memory
(mistake promotion, archive moves, handoff write) — that decision is the user's, always.

**Partial session survival.** If the user closes the session without an explicit Wrap-up signal
(terminal hang-up), the partial session-memory survives: every loop's MEMORIZATION ran (per §4),
transcript + session.json + per-loop artifacts are all written, and the per-task task-records are
written. A future session can resume per the existing 3-state worktree idempotency guard in
`orchestration/SKILL.md § Step 1` row 1.

---

## §8 — Workflow Status Display (Chat rendering)

### 8.1 Rendering shape

Chat's per-task slice structure requires a **two-tier** status display, backed by
`state.json.workflow.chat.tasks[currentIndex]` (R3 lock from the `workflow.chat.tasks[]`
array-of-slices schema).

**Header form (Chat):**

```
Workflow Status — Mode: chat — Active: Task {NN} — {step-name}
```

where `{step-name}` is one of: `Step 2 Full Ideation`, `Step 3 Preparation ⊘ Skipped`, `Step 4 mini Planning`, `Step 5 mini Execution`, `task-record`. The step name identifies the current row in the per-task tier of the body form below; Step 3 renders as ⊘ Skipped when default.

**Body form (Chat) — two-tier:**

Top tier (session-level):

| Phase | Status |
|-------|--------|
| Configuration | ✓ Done |
| Current task | ▸ Task {NN} — {slug} |
| Wrap-up | … Pending — awaiting user signal |

Per-task tier (current task sub-table):

| Step | Loop | State | Iter | Verdict |
|------|------|-------|------|---------|
| 2 | Ideation | {state} | {n} | {verdict} |
| 3 | Preparation | ⊘ Skipped | — | — |
| 4 | mini Planning | {state} | {n} | {verdict} |
| 5 | mini Execution | {state} | {n} | {verdict} |
| — | task-record | {written\|pending} | — | — |

**Render points:** unchanged — every `AskUserQuestion` call in Chat; every loop boundary.

**Auto Mode rendering:** unchanged — the existing 6-row table in `orchestration/SKILL.md §
Workflow Status Display` is the canonical Auto view.

### 8.2 Per-task state-transition table (F-S2)

Parallel to `orchestration/SKILL.md § Loop states`. This table covers the per-task slice's
state-transition contract for Chat Mode.

| From state | Event | To state | Guard / Notes |
|------------|-------|----------|---------------|
| `(none)` | user types a task | `ideation.state: InProgress` | manager enters per-task slice; Configuration already `Done` |
| `ideation.state: InProgress` | EVALUATION → PASS | `ideation.state: Done` | §4 narrowed PASS path runs; move to Step 3 |
| `ideation.state: InProgress` | EVALUATION → REVISE | `ideation.state: InProgress` | re-enter DISCUSSION with evaluator findings; iter++ |
| `ideation.state: InProgress` | iter == maxIter (5) + REVISE | `ideation.state: Aborted` | manager escalates to user via AskUserQuestion |
| `ideation.state: Done` | loop-entry guard reads `skip: true` OR `maxIterations: 0` | `preparation.state: Skipped` | R1 lock + skip signal (two independent signals); no DISCUSSION/WORK/EVAL/MEMO rows run; stamps `{state: "Skipped", iterations: []}` |
| `preparation.state: Skipped` | (auto-advance) | `planning.state: InProgress` | no user gate for the Skipped transition |
| `preparation.state: Skipped` | user opts in for complex task | `preparation.state: InProgress` | user sets `skip: false` AND raises `maxIterations` explicitly (both signals cleared); standard loop contract runs |
| `planning.state: InProgress` | EVALUATION → PASS | `planning.state: Done` | §4 narrowed PASS path runs; move to Step 5 |
| `planning.state: InProgress` | EVALUATION → REVISE | `planning.state: InProgress` | re-enter DISCUSSION; iter++ |
| `planning.state: InProgress` | iter == maxIter (5) + REVISE | `planning.state: Aborted` | manager escalates to user |
| `planning.state: Done` | (auto-advance to first sub-step) | `execution.state: InProgress` | fresh executor per sub-step (default); may continue per `delegation/SKILL.md § Continue vs Fresh` |
| `execution.state: InProgress` | EVALUATION → PASS (last sub-step) | `execution.state: Done` | §4 narrowed PASS path runs; write task-record |
| `execution.state: InProgress` | EVALUATION → PASS (not last sub-step) | `execution.state: InProgress` | advance plan cursor to next sub-step; fresh executor by default, or continue per `delegation/SKILL.md § Continue vs Fresh` |
| `execution.state: InProgress` | EVALUATION → REVISE | `execution.state: InProgress` | re-enter DISCUSSION for same sub-step; iter++ |
| `execution.state: InProgress` | iter == maxIter (5) + REVISE | `execution.state: Aborted` | manager escalates to user |
| `execution.state: Done` | task-record written | `taskRecord: written` | manager presents user review gate |
| `taskRecord: written` | user selects "Next task" | `(new per-task slice begins)` | manager re-enters per-task slice loop for task {NN+1} |
| `taskRecord: written` | user selects "Revise this task" | `ideation.state: InProgress` (same task, new per-task slice) | manager re-enters per-task slice at Step 2 |
| `taskRecord: written` | user selects "Wrap up the session" | `wrapUp.state: InProgress` | manager exits per-task slice loop; enters Step 6 Wrap-up |

### 8.3 Worked example — Status Display (§6.3 spec)

The following example shows the Workflow Status Display mid-session, after two completed per-task
slices and during the third (mini Execution in progress):

```
Workflow Status — Mode: chat — Active: Task 03 — Step 5 mini Execution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session-level
  Configuration          ✓ Done
  Current task           ▸ Task 03 — chat-mode-spec-draft
  Wrap-up                … Pending — awaiting user signal

Completed tasks
  Task 01 — project-memory-layout           ✓ Done (task-record written)
  Task 02 — skill-frontmatter-standard      ✓ Done (task-record written)

Task 03 — chat-mode-spec-draft
  Step 2  Ideation          ✓ Done          iter 1   PASS
  Step 3  Preparation       ⊘ Skipped       —        —
  Step 4  mini Planning     ✓ Done          iter 1   PASS
  Step 5  mini Execution    ▸ InProgress    iter 1   …
          task-record       … pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Notes on the example:

- The backing data for the per-task tier comes from
  `state.json.workflow.chat.tasks[2]` (0-indexed; Task 03 = index 2).
- Completed prior tasks (01 and 02) are shown in a "Completed tasks" summary row — their
  per-task sub-table is collapsed to one line each to keep the display scannable.
- Task 03's slug (`chat-mode-spec-draft`) is subject-descriptive per `memorization/rules.md §
  1.3`.

---

## §9 — Discuss-first contract

In Chat Mode, **every loop entry forces user-driven DISCUSSION**, regardless of the resolved
`discuss.mode` setting. The leader proposes (with research-backed evidence); the user decides via
`AskUserQuestion`. This is the Chat-Mode-level discuss-first contract.

This contract is binding at the mode level: even if a future settings change flips a per-step
`discuss.mode` to `"agent"`, the mode-level contract documented here still forces user-driven
DISCUSSION at every Chat loop entry. Documenting at both settings-level (`"user"` everywhere in
[`templates/settings.chat.json`](templates/settings.chat.json)) and mode-level (this section) prevents silent regression.

---

## Cross-references

- [`orchestration/SKILL.md`](SKILL.md) — workflow governor; CORRECTION annotation at `§
  Orchestration Mode` supersedes the original 241–242 lock; `§ Workflow State Machine` for the
  shared loop mechanics (it points here for the Chat gates); `§ Workflow Metadata` for
  the `workflow.chat.tasks[]` array-of-slices schema (R2/R3 lock).
- [`orchestration/auto-mode.md`](auto-mode.md) — the symmetric Auto-Mode specification.
- [`memorization/SKILL.md`](../memorization/SKILL.md) — the unmodified base MEMORIZATION
  procedure that §4 locally overrides (R5 lock). A reader of that SKILL sees the full base; a
  reader of this doc sees the base plus the Chat override.
- [`memorization/rules.md`](../memorization/rules.md) — slug-naming standard for
  `task-record.md` filenames.
- [`mistake/SKILL.md § P2`](../mistake/SKILL.md) — moment-of-capture discipline preserved in
  Chat regardless of §4's narrowed PASS path.
- [`delegation/SKILL.md § Inline-Paste Rule`](../delegation/SKILL.md) — governs fresh-subagent
  context per per-task slice; cited alongside Principle 1.
- [`discussion/SKILL.md § Decision Classification`](../discussion/SKILL.md) — Always-Ask matrix
  (Design / Scope / Destructive); the Wrap-up trigger in §7 is symmetric to the Destructive
  category.
- `mistakes/skills-mirror-symlinks-not-copies.md` — editing the canonical file at
  `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` reflects automatically via the
  `.claude/skills/orchestration/chat-mode.md` mirror symlink; do not double-edit.
- `mistakes/prose-reclassification-target-is-project-level-notes.md` — task-record is
  session-scope (D-A); Wrap-up reclassification targets project-level `notes/`, never
  feature-level.
