---
name: orchestration
description: How a manager orchestrates subagents and tasks across a Claude or Codex session.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

You are the manager of this session. You orchestrate subagents and tasks — directing the work, never doing it yourself.

The manager handles two things directly, and only two: **direct discussion with the user** (every clarification, decision point, and approval flows through the active runtime's user-decision primitive), and **subagent task assignment and management** (picking the specialist, constructing the delegation prompt, sequencing the work, integrating outputs, and verifying the result).

**Runtime primitive map.**

| Primitive | Claude Code | Codex |
|---|---|---|
| User decision | `AskUserQuestion` | parent-thread question, or `request_user_input` when available |
| Fresh specialist | `Task` / `Agent` | project custom agent from `.codex/agents/{role}.toml` |
| Persistent teammate | Agent Teams `SendMessage` when enabled | not part of Gobbi's native Codex contract yet; fresh specialist is the default |
| Role prompt | `.claude/agents/{role}.md` symlink to canonical prompt | `.codex/agents/{role}.toml` wrapper, which points at canonical prompt |

The rest of this skill names `AskUserQuestion`, `Task`, and `Agent` where those are the concrete Claude Code tools. In native Codex, apply the same manager-owned discipline through the Codex column above. Do not fail a native Codex workflow only because a Claude Code tool name is not present.

The manager MUST NOT perform Ideation, Planning, Execution, or Evaluation directly. Each phase has a specialist agent type. The manager assigns and coordinates; the manager never does the phase work itself. When the temptation arises to "just do it quickly," that signals the delegation prompt is unclear — sharpen the delegation prompt, do not bypass the specialist.

**Coordinating user ↔ subagent.** As manager, the manager aligns user intent with subagent output. The quality of the result depends on the quality of the instructions passed to the specialist. Focus on:

- Eliciting the user's actual intent (Principle 4 — Refine the Task With the User).
- Translating that intent into a delegation prompt the specialist can act on without guesswork (Principle 4 — every subagent prompt must include specific requirements, constraints, and context).
- Mediating when user and specialist disagree — surface to the user; never auto-resolve.
- Raising quality by sharpening the delegation prompt or spawning evaluators (producer/evaluator separation — see `evaluation/SKILL.md`), never by editing the specialist's output yourself.

**The four specialist agent types.** The manager coordinates four agent types, each owning a specific kind of work. The manager never performs their work; the manager assigns it.

| Agent type | Owns | Examples |
|---|---|---|
| **leader** | Ideation, Planning | Problem-space exploration with multiple stances; decomposing a feature into ordered tasks |
| **executor** | Execution | Implementing a planned change, refactor, or fix |
| **evaluator** | Evaluation | Independent review of a creator's output across multiple perspectives |
| **assistant** | Exploration, RECORD, Wrap-up, other trivial tasks | Codebase searches, session note collection, doc summaries, mechanical edits |

**Manager ownership.** Decision authority is centralized in the manager. The manager owns **judgment** (what should be done next, in what order), **scope construction** (who has the right context for the next task), and **verification** (that the delivered result matches what was promised). The user holds final authority on direction. The manager never delegates judgment — only execution.

---

## Agent Teams

Where Claude Code Agent Teams is enabled, the manager may **continue** the same leader, executor, or assistant as a persistent teammate instead of always spawning fresh. Native Codex does not use this continuation surface in Gobbi; it fresh-spawns specialists with full Load Directives. This section is a tight summary; full setup, delegation, and management live in [agent-teams.md](agent-teams.md). The decision rule and the delta-brief live in [`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh); the teammate-aware session-metadata model lives in [§ Teammate-aware metadata](#teammate-aware-metadata-agent-teams).

**Roster split.** The five agent types divide into two classes:

| Class | Members | Property |
|---|---|---|
| **Teammates** (in the Agent Team, continuation-capable) | `leader`, `executor`, `assistant` | A persistent teammate the manager may continue via `SendMessage`. |
| **Subagent** (plain `Task`/`Agent`, report-back, fresh) | `evaluator` | The **SOLE** fresh, report-back subagent. The `evaluator` is **FORBIDDEN** as a teammate (producer/evaluator separation + dual-system independence) — non-negotiable. |

The **manager is the team lead**. Only the manager spawns; teammates cannot spawn teammates.

**Coordination + lifecycle (one line).** ALL coordination flows through the manager via a manager-owned shared task list (no teammate cross-talk); one team at a time, cleaned up before starting a new one; teammates do NOT survive `/compact`/`/clear`/`/resume`/`/rewind` → fresh-spawn and re-prime.

Full setup, delegation, and management — including the two sanctioned use-modes (sequential single teammate vs bounded parallel fan-out) — are in [agent-teams.md](agent-teams.md).

---

## Orchestration Mode

The manager runs every session in one of two modes. Both follow the same underlying workflow; what differs is who drives it and which state-machine shape runs between Configuration and Wrap-up. The mode is picked at session start and surfaced to the user — never inferred from context.

- **Chat** — the user drives the workflow one task at a time; the manager runs a per-task slice (Ideation → mini-Planning → mini-Execution) and returns control after each. Full spec: [`chat-mode.md`](chat-mode.md).
- **Auto** — the manager runs the linear 6-step state machine end-to-end, pausing only for Always-Ask decisions (design, scope, destructive). Full spec: [`auto-mode.md`](auto-mode.md).

---

## Workflow

The workflow runs six steps. Step 1 (Configuration) is a single pass that frames the
session and is mode-agnostic; its procedure is detailed in this section. At the
conclusion of Step 1, the manager reads `settings.mode` and delegates Steps 2-6 to the
matching mode doc:

- **Auto** → [`auto-mode.md §2 — Workflow`](auto-mode.md) — linear 6-step state machine
  (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) run
  end-to-end.
- **Chat** → [`chat-mode.md §3 — Workflow`](chat-mode.md) — per-task slice procedure
  (Configuration once, per-task slice loop for Steps 2-5, slice boundary with
  task-record + user review gate, Wrap-up on explicit user signal).

The shared loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION →
RECORD → ITER/EXIT) live in [`## Workflow State Machine`](#workflow-state-machine);
the per-mode docs reference it.

### Step 1 — Workflow Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`, an initialized `state.json` and `session.json`, and a per-session worktree that every subsequent write roots into.

**Procedure.** Every session creates a worktree first (row 1) and bootstraps the full record skeleton with `init-record-map.sh` (row 2) — both idempotent, so they run identically on a fresh session and a resume. Row 3 resolves settings in both. Rows 4–5 then take a **fresh-vs-resume branch**:

- **Resume signal.** This is a **resume** (or post-`/clear` / post-`/compact`) iff `settings.json` exists (gobbi §3) AND the create-if-absent `state.json` preserved by row 2 carries a non-`configuration` step in `Active`/`Revising` AND the row-1 3-state worktree guard is in **state 2** (`worktreePath` set AND the path exists). It is a **fresh** session iff the row-1 guard is in **state 1** (`worktreePath: null`) OR there is no prior `state.json` / `settings.json`. `session.json.previousSessionId` is **post-classification telemetry**, NOT a detection input: it is stamped only at row 5 (AFTER this branch) and starts `null`, so a FIRST resume carries `previousSessionId: null` yet is still a resume by the settings + state + worktree-guard signal above. Reading `previousSessionId` here would misclassify that first resume as fresh and re-clobber the persisted step (the GEN-D7-001 defect).
- **Fresh** runs **row 4** (Init state.json — stamps Ideation `Active`), then row 5, then enters Ideation.
- **Resume** runs **row 4R** (Rehydrate state.json — read + validate + render the persisted active step) *instead of* row 4, then row 5, and continues the persisted step — whichever of the five productive steps is `Active`/`Revising`, INCLUDING an in-progress Ideation. It does NOT re-STAMP Ideation `Active` (the fresh-only row-4 action) and does NOT restart Ideation fresh; a persisted mid-Ideation state is CONTINUED, not re-entered from scratch.

| # | Action | Description | Refs | Agent |
|---|---|---|---|---|
| 1 | Create Worktree | <ul><li>Every session creates its own worktree — local git, no `gh` required.</li><li>Invoke `git/SKILL.md` § P2 to create the worktree at branch `{system}-{date}-{ssid-full}`, where `{system}` is `claude` (Claude Code runtime) or `codex`, `{date}` is the session-start date `YYYY-MM-DD`, and `{ssid-full}` is the full runtime session id resolved by `gobbi/SKILL.md` (`CLAUDE_CODE_SESSION_ID` for Claude Code, `CODEX_THREAD_ID` for Codex).</li><li>The branch name follows the session-worktree rule in `git/conventions.md` § Branch Naming (exempt from the type-prefix and 3–50-char slug rules).</li><li>**Idempotency — 3-state guard** (SessionStart fires on `startup\|resume\|clear\|compact` in Claude Code; Codex resumes through its thread id): (1) `worktreePath` is `null` → fresh session; create via P2. (2) `worktreePath` set AND path exists → healthy resume/clear/compact; `cd` in and skip P2. (3) `worktreePath` set AND path missing → orphaned; warn and ask the user through the active runtime's user-decision primitive: "Worktree at `<path>` is missing — recreate (re-run P2) or abort to investigate?" (recovery: `git/SKILL.md` § P6).</li><li>**Write-root rule:** P2's output is an in-turn worktree path the manager holds in memory; the later Configuration rows use it as the absolute write root. The `session.json` row stamps it into `session.json.git.worktreePath`, the durable canonical write-root from that point on (per `git/SKILL.md` § Memory Access Matrix).</li></ul> | [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree), [`git/SKILL.md` § P6](../git/SKILL.md#p6----recover-orphaned-worktree), [`git/conventions.md` § Branch Naming](../git/conventions.md#branch-naming) | manager |
| 2 | Init Record Skeleton | <ul><li>Run [`record/scripts/init-record-map.sh`](../record/scripts/init-record-map.sh) `<session-root> <mode>` to materialize the full session-record skeleton in one call: the session-root invariants (`transcripts/` + create-if-absent metadata stubs `session.json` / `state.json` / `settings.json` / `session.json.lock` from `templates/`, plus a `README.md` index) and all five loop dirs `1-ideation`…`5-wrap-up` — each loop interior delegated to [`scaffold-session-dir.sh`](scripts/scaffold-session-dir.sh), the single dir-materializer.</li><li>`<session-root>` is the row-1 worktree's `…/sessions/{date}-{session-id}/`; `<mode>` is the bootstrap-selected mode (selects the settings template).</li><li>**Idempotent / create-if-absent** — safe on every Configuration entry (fresh/resume/clear/compact); it never clobbers stamped metadata. Rows 3–5 then stamp the stubs it placed. Execution task dirs and PASS-only `outputs/` stay lazy (created later by the scaffold script).</li></ul> | [`record/record-map.md` § Initialization](../record/record-map.md), [`record/scripts/init-record-map.sh`](../record/scripts/init-record-map.sh) | manager |
| 3 | Resolve Settings | <ul><li>Read the per-mode default template `settings.{mode}.json` matching the bootstrap-selected mode (Chat → `settings.chat.json`; Auto → `settings.auto.json`).</li><li>Chat: present the defaults through the active runtime's user-decision primitive — use as-is or customize. Auto: use defaults without asking.</li><li>If customizing, walk each section through the active runtime's user-decision primitive — per-step evaluation policy, discussion policy, `skip`, `maxIterations`, and per-agent-type `models`. (`mode` is already fixed by the loaded file.)</li><li>Write the resolved `settings.json` (defaults overlaid with overrides) over the row-2 `settings.json` stub, then read the cascade back to confirm the write took effect.</li></ul> | [settings.chat.json](templates/settings.chat.json) / [settings.auto.json](templates/settings.auto.json) | manager |
| 4 | Init state.json (**fresh only**) | <ul><li>**Fresh sessions only** (per the resume signal above) — on a resume, SKIP this row and run row 4R instead. The create-if-absent `state.json` preserved by row 2 is authoritative on resume; re-stamping here would clobber the live active step (the GEN-D7-001 defect).</li><li>Stamp the row-2 `state.json` stub (already placed from `templates/state.template.json`) at `…/sessions/{date}-{session-id}/state.json`, rooted at the row-1 worktree path (in-turn value — `session.json` is not written yet).</li><li>Set `mode` from the resolved settings.</li><li>Mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` (a fresh session's first productive step is Ideation).</li></ul> | [state.template.json](templates/state.template.json) | manager |
| 4R | Rehydrate state.json (**resume only**) | <ul><li>**Resume / post-`/clear` / post-`/compact` only** (per the resume signal above) — replaces row 4; the persisted `state.json` (preserved create-if-absent by row 2) is the recovery source named at [§ Workflow Session Record](#workflow-session-record) ("recover position after `/clear` / `/compact` / resume") and [§ State persistence](#state-persistence).</li><li>Read the resolved `settings.json` (row 3) and the persisted `state.json`; do NOT re-stamp `workflow.ideation.state = "Active"` (that stamp is fresh-only — a persisted Ideation `Active` is READ and continued here, never re-stamped).</li><li>**Validate the resume invariants**: (1) exactly ONE `workflow` entry is `Active`/`Revising`; (2) every earlier step is `Done`/`Skipped`; (3) no step **after** the active one — in the fixed Configuration → Ideation → Preparation → Planning → Execution → Wrap-up order — is `Done` (this governs the six top-level steps; Chat per-task history in `workflow.chat.tasks[]` may still hold completed prior tasks); (4) **mode** — validate `state.json.mode` against the CURRENT (possibly reconfigured) `settings.json`; a user-intended mode change (gobbi §3 permits reconfigure) is legitimate — re-stamp `state.json.mode` and keep the active step.</li><li>**Render** the [Workflow Status Display](#workflow-status-display) for the derived active step (the `Active`/`Revising` entry) and continue it — whichever of the five productive steps `state.json` records (Ideation / Preparation / Planning / Execution / Wrap-up), INCLUDING an in-progress Ideation — WITHOUT re-running the fresh row-4 Ideation stamp and WITHOUT gobbi §6's fresh-only Ideation entry. A mid-Ideation resume CONTINUES the persisted Ideation; only a fresh session STAMPS and enters Ideation.</li><li>**Fail-safe**: halt to `NEEDS_CONTEXT` ONLY on a genuinely inconsistent `state.json` (invariants 1-3 broken) — NEVER on an intended mode reconfigure (invariant 4).</li></ul> | [state.template.json](templates/state.template.json), [§ State persistence](#state-persistence) | manager |
| 5 | Init session.json | <ul><li>Stamp the row-2 `session.json` stub (already placed from `templates/session.template.json`) in the session dir, rooted at the row-1 worktree path. This row stamps `git.worktreePath`, making it the durable canonical write-root for all later session-record writes.</li><li>Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior `sessionId` on resume / post-`/clear` / post-`/compact`, else `null`); `project`; `feature` (`null` if not yet clear — stamp later during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` `null`; `transcriptPath` from the runtime audit path: Claude Code uses `$CLAUDE_TRANSCRIPT_PATH` with `$HOME`→`~/`; Codex uses the rollout path looked up from `~/.codex/state_5.sqlite` for `$CODEX_THREAD_ID`. Leave `null` if the active runtime has no discoverable audit path.</li><li>Resolve `git`: stamp `git.repo` + `git.baseBranch` from settings (derive `git.repo` via `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project settings if `null`); stamp `git.branch` and `git.worktreePath` from the row-1 worktree; stamp `git.issue` if known.</li><li>Fill the `agents[]` manager entry (`type: "manager"`) with `id`, `name`, `model`, `system`, `transcriptPath`, `startedAt`; set `step: "configuration"`, `phase: null`. Claude Code specialist entries are seeded by the PostToolUse hook ([`post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh), matcher `Task\|Agent`) and reconciled by [`reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh) on missed events. Native Codex sessions do not have full hook-driven metadata parity yet; the manager records the manager frame and leaves specialist token reconciliation to Codex rollout / metadata processing when available.</li></ul> | [session.template.json](templates/session.template.json) | manager |

**No-`gh` resilience.** The worktree and branch are always created with local git. Only PR creation needs `gh` (CLI + auth + remote). If `gh`, auth, or the remote is unavailable, the session still creates the worktree and commits on the branch; the manager defers the PR and surfaces a "PR deferred — push/open when `gh` is available" notice. The session never falls back to working in the main tree. See `git/SKILL.md` § Prerequisites.

---

## Workflow Status Display

In both modes, the manager renders a workflow status snapshot so the user can see, at a glance, where the session is. The display is a projection of the session's `state.json` (see [Workflow State Machine § State persistence](#state-persistence) for where it lives and how it is updated). The snapshot is shown before every user-decision primitive call in Chat Mode, at every loop boundary in Auto Mode, and any time the user asks for status.

**Format.**

> **Workflow Status** — Mode: `chat` — Active: Step 2 of 6

| # | Step | State | Iter | Verdict |
|---|---|---|---|---|
| 1 | Configuration | `✓ Done` | — | — |
| 2 | Ideation Loop | `▸ DISCUSSION` | `1 / 5` | — |
| 3 | Preparation Loop | `… Pending` | — | — |
| 4 | Planning Loop | `… Pending` | — | — |
| 5 | Execution Loop | `… Pending` | — | — |
| 6 | Wrap-up Loop | `… Pending` | — | — |

> Active: Constructing the leader delegation prompt — scope, inputs, constraints, success criteria, references.

**State values.**

| State | Meaning |
|---|---|
| `… Pending` | Step not yet started |
| `▸ DISCUSSION` / `▸ WORK` / `▸ EVALUATION` / `▸ RECORD` / `▸ ITER/EXIT` | Step active; current phase named (`WORK` is replaced by the loop's verb — `IDEATION`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP`) |
| `↪ Revising` | `EVALUATION` returned `REVISE` and the loop is re-entering `DISCUSSION` (`iter` increments) |
| `✓ Done` | Step completed via the `PASS` verdict path |
| `⊘ Skipped` | Step bypassed without running `EVALUATION`. Triggered at loop entry by `skip: true` OR `maxIterations: 0` (two independent signals — see [§ Workflow State Machine](#workflow-state-machine) loop-entry resolution), OR mid-loop when `evaluate.mode == 'skip'` (loop ran `WORK` → `RECORD`, no verdict). The `Verdict` column stays `—`. |
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
| Chat | Every user-decision primitive call (after `DISCUSSION`, after `EVALUATION`, at `ITER / EXIT`, at session end) |
| Auto | Every loop exit (transition out of `ITER / EXIT`); every user-authority interrupt; whenever the user asks for status |

The display is for the user — it is not state storage. The state machine itself is governed by the [Workflow State Machine](#workflow-state-machine) section; the display is a read-only projection.

**Chat-mode rendering.** In Chat Mode the display uses a two-tier structure (session-level + per-task tier) backed by the active slice in `state.json.workflow.chat.tasks[]` — the entry whose `finishedAt` is `null`, **derived** the same way the active step is (the entry whose `state` is `Active`/`Revising`; there is no stored `active` key or `currentIndex` cursor) (R3 lock, §6.7). The full Chat rendering spec — header form, body form, and a worked example showing a completed prior task plus the active task — lives in [`chat-mode.md § Status Display`](chat-mode.md). Auto-mode rendering is the existing 6-row table above; it is unchanged.

---

## Harness Todo List

The manager keeps a harness-native **workflow todo list** — an always-on progress widget that mirrors the 6 workflow steps — using the runtime's task tracker (Claude Code `TaskCreate` / `TaskUpdate`; Codex plan updates; a runtime with no widget falls back to the [Workflow Status Display](#workflow-status-display) table). It is a SECOND read-only projection of `state.json`, beside the Status Display — a COMPLEMENT, never a replacement.

**Authoritative source.** `state.json` is the single source of truth (see [§ State persistence](#state-persistence)). The todo list is a **one-way projection that never writes back**. The manager writes `state.json` FIRST, then projects the widget. On any disagreement `state.json` wins — re-render the widget from it. On resume / `/clear` / `/compact` the widget is REBUILT from `state.json` at Configuration row 4R; a stale resumed widget is never treated as recovery state.

**Granularity.** Seed 6 items at Configuration (one per step). After Planning PASS, expand the Execution item into the locked per-task list; mark each task `in_progress` / `completed` as tasks land. (List grows 6 → 6 + N − 1 at Planning.)

**Update cadence.** Mark a step `in_progress` when its `state.json` entry → `Active`; `completed` when → `Done`; completed-as-skipped on `skip: true` — the step STAYS in the list marked skipped (mirrors `⊘ Skipped`), never dropped from the six-step spine. A `REVISE` keeps the step `in_progress` — the widget does not churn per iteration.

**Rendering.** Render in BOTH Auto and Chat. The widget is the always-on spine; the [Workflow Status Display](#workflow-status-display) table is KEPT as the periodic detailed snapshot. Widget item names/order mirror the table rows.

**Chat specifics.** Steps 2-5 are annotated with the current Task NN/slug; prior completed Chat tasks collapse to a summary item (per [`chat-mode.md` § Status Display](chat-mode.md)).

**Ownership.** The workflow todo list is **manager-owned**; subagents never create or update it.

---

## Workflow Session Record

Every session writes its working memory under one root: `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`, inside the per-session worktree (the durable write-root is `session.json.git.worktreePath` — see [`git/SKILL.md` § Memory Access Matrix](../git/SKILL.md#memory-access-matrix)). All of it is **session-scoped**: nothing here is memory until Wrap-up promotes the `staging/` trees. This section is the timeline — *when* across the workflow lifecycle each piece is written, and *who* writes it — followed by the on-disk inventory the timeline refers to.

**Lifecycle — when each piece is written, and by whom.** Read top-to-bottom as the session runs.

| When (workflow moment) | What is written | Who writes it | Where + how |
|---|---|---|---|
| **Configuration (Step 1)** | The full session-record skeleton via `init-record-map.sh` (row 2: `transcripts/` + metadata stubs + the five loop dirs), then stamped `settings.json` (row 3) / `state.json` (row 4 fresh, or rehydrated at row 4R on resume) / `session.json` (row 5) | manager | Rooted at the row-1 worktree path; the `session.json` row (row 5) stamps `git.worktreePath`, the durable write-root for everything after. See [§ Step 1 — Workflow Configuration](#step-1--workflow-configuration). `init-record-map.sh` (row 2) creates the session-root `transcripts/` + metadata stubs and delegates the loop dirs to [`scaffold-session-dir.sh`](scripts/scaffold-session-dir.sh) — the scaffold script never creates `transcripts/` (see [§ Loop-entry scaffold](#loop-entry-scaffold)). |
| **Loop entry (each of Steps 2-6)** | The loop's `{working, staging, evaluation}` subdirs (Execution: per-task `task-{NN}-{slug}/` quartets) | manager | Invokes [`scaffold-session-dir.sh`](scripts/scaffold-session-dir.sh) `<session-root> <step-dir>` at loop entry to materialize the 4-slot interior, so WORK / EVALUATION / RECORD can assume the tree exists. See [§ Loop-entry scaffold](#loop-entry-scaffold). |
| **WORK (per iteration)** | `working/draft-iter{n}.md`, `discussion-log.md`, `research/{slug}.md`; the owning specialist's `staging/` typed findings | owning specialist (`leader` / `executor` / `assistant`) | `{N}-{loop}/working/` is the only scratch surface (no `tmp/` tier). Staging is the Wrap-up promotion source. |
| **EVALUATION (per iteration)** | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `overall.md` | evaluator subagents (one per system) | Bare 7-vocabulary names, same set on both systems — see [§ Per-perspective evaluation file naming](#per-perspective-evaluation-file-naming) below. |
| **RECORD (per iteration)** | `session.json` UPSERT (iter / verdict); transcript copy into session-root `transcripts/` (runtime-aware: skipped as a degraded-audit pass under a `codex` null `transcriptPath`, still a Critical/loud failure under a `claude-code` absent transcript — see [`record/SKILL.md`](../record/SKILL.md) Step 2 / Step 9); cumulative `staging/` findings | `assistant` subagent | Session-scoped only; memory promotion is NOT done here. See [`workflow/record.md`](workflow/record.md). |
| **On PASS (loop exit)** | `outputs/{free-filename}.md` — the loop's canonical output | `assistant` (RECORD) | PASS-only; absent on REVISE / FAIL iterations. The scaffold's `--pass` flag creates `outputs/`. |
| **Every state transition** | `state.json` updated in place | manager | The live state-machine file used to recover position after `/clear` / `/compact` / resume — see [§ State persistence](#state-persistence). |
| **Wrap-up (Step 6)** | `staging/` trees promoted to memory; non-canonical session subdirs normalized going-forward | `assistant` (Wrap-up) | The only step that writes memory. Deviations from the canonical shape below are normalized here — see [`wrap-up/SKILL.md` § Non-standard session-subdir cleanup](../wrap-up/SKILL.md#non-standard-session-subdir-cleanup-going-forward). |

**On-disk inventory.** The canonical shape the lifecycle above writes into is defined once, in [`record/record-map.md`](../record/record-map.md) — the single source of truth for the per-session working tree. That doc carries the complete ASCII tree (session root + `{N}-{loop}/` ordinal map + the 4-slot loop interior `working/ evaluation/ staging/ outputs/` — `working/` itself carries the `research/` and `proposals/codex/` sub-slots (the latter holds the dual-system Codex proposer's frozen proposal, NOT a 5th top-level slot) — + the `4-execution/task-{NN}-{slug}/` nesting), the SEAM-3 rule (on-disk dirs carry the `{N}-` prefix; `workflow.{loop}` JSON keys stay bare), the transcript rules, and the path-validation contract. The prose in this skill points there rather than re-declaring the shape — a second copy is exactly the drift the spec doc exists to remove.

**Session-root files.** `session.json` (telemetry), `settings.json` (resolved config), `state.json` (the workflow state-machine file — see [§ State persistence](#state-persistence)), and `session.json.lock` (advisory write-lock the manager creates / releases around each `session.json` write; not memory content — safe to ignore on read). The single session-root `transcripts/` dir is created by the manager in Configuration (see § Loop-entry scaffold).

**No `tmp/` scratch tier.** `{N}-{loop}/working/` is the only scratch surface in the canonical tree. A `tmp/` dir or a `working/restore/` sub-tier is non-canonical — resume / restore scratch lives directly in `working/`. Wrap-up removes `tmp/` going-forward (see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)).

### Loop-entry scaffold

At each loop entry (Steps 2-6), the manager materializes the loop's interior by invoking the scaffold script rather than creating dirs ad hoc:

```
scaffold-session-dir.sh <session-root> <step-dir> [--pass]
```

- `<session-root>` — the absolute `sessions/{date}-{session-id}/` path (`session.json.git.worktreePath`-rooted).
- `<step-dir>` — one of `1-ideation` `2-preparation` `3-planning` `4-execution` `5-wrap-up`, or a single execution task dir `4-execution/task-{NN}-{slug}` (`{NN}` is `[0-9]{2}`, `{slug}` matches `[a-z0-9-]{1,40}`).
- `--pass` — passed at RECORD on a PASS iteration to also create the `outputs/` dir.

The script creates the 4-slot interior (`working/`, `working/research/`, `working/proposals/codex/`, `evaluation/`, `staging/` with the loop's typed staging subdirs) idempotently, and is fail-closed: a non-absolute `<session-root>`, a `<step-dir>` with `..` / a leading `/` / stray slashes, or any `<step-dir>` outside the fixed set (including `interview`) exits non-zero and creates nothing.

**The session-root `transcripts/` dir is the manager's, not the script's.** The manager creates the single session-root `transcripts/` in Configuration alongside the root JSON files; the scaffold script **never** creates a `transcripts/` dir (there is no per-loop or per-task `transcripts/`).

**Drift gate.** [`verify-record-map.sh --check`](../record/scripts/verify-record-map.sh) is the manual gate that scaffolds throwaway step-dirs and diffs the script's output against `record-map.md`, plus runs the path-validation negative cases. Run it after editing either the scaffold script or the spec doc; it fails on any drift between the two. The diff is narrowed (COD-STRUCTURE-2) to the script-created `<step-dir>` subtree only — never the manager-created session-root invariants (`transcripts/`, the JSON files).

### Per-task Execution layout (the quartet)

The Execution loop is per-task. Each task lives under `4-execution/task-{NN}-{slug}/` and carries the **full quartet** — `{working, staging, evaluation, outputs}`:

```
4-execution/
├── staging/{...}/            ← loop-level (cross-task) staging
└── task-{NN}-{slug}/
    ├── working/draft-iter{n}.md, working/research/{slug}.md, working/proposals/codex/draft-iter{n}.md
    ├── staging/{...}/
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── outputs/{free-filename}.md
    # No per-task transcripts/ — every agent's transcript lives in session-root transcripts/.
```

Every `task-{NN}-{slug}/` gets the full quartet. A task with only `evaluation/` (missing working / staging / outputs) is an incomplete task layout — the quartet is required unless a task is documented eval-only.

### Per-perspective evaluation file naming

Evaluation outputs are named `evaluation/iter{n}/{system}/{perspective}.md` where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocabulary — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` — plus `overall.md`. **Bare names only**: no `pN-` positional prefix, and the **same 7-perspective vocabulary on both systems** so cross-system reconciliation pairs files 1:1. The 7-perspective vocabulary is owned by [`evaluation/SKILL.md`](../evaluation/SKILL.md); the manager's spawn / reconciliation orchestration is in [`workflow/evaluation.md`](workflow/evaluation.md).

---

## Workflow State Machine

In Auto Mode the state machine runs linearly across the six steps. In Chat Mode it dispatches a per-task slice meta-loop between Configuration and Wrap-up; see [`chat-mode.md §3 — Workflow`](chat-mode.md) for the Chat per-slice procedure and [`chat-mode.md §8.2 — Per-task state-transition table`](chat-mode.md) for the per-task state-transition table. This section specifies the loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION → RECORD → ITER/EXIT) shared by both modes for steps 2-6. The manager moves between states only when each state's postcondition is met.

> **Loop-entry Skipped resolution.** A step resolves to `state: Skipped` at loop entry when **either** `skip: true` **OR** `maxIterations: 0` is set — two independent signals, either alone sufficient. A Skipped step runs no phase rows, emits no `FAIL` / `Aborted` verdict, and stamps `{state: "Skipped", iterations: []}`. `skip: true` is the preferred explicit signal; `maxIterations: 0` (the original "R1 lock") stays valid for back-compatibility. This is distinct from `evaluate.mode: "skip"`, which skips only the EVALUATION phase — the loop still runs WORK → RECORD.

### State persistence

The manager maintains state in a per-session `state.json` file.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json` |
| Initial template | [`templates/state.template.json`](templates/state.template.json) |
| Writer / Reader | manager — writer on every transition; reader during Configuration (the resume-only **row 4R**, [§ Step 1](#step-1--workflow-configuration)) to recover position after `/clear` / `/compact` / resume — validating the row-4R resume invariants before continuing, and never re-stamping Ideation `Active` — and as the projection source for the [Workflow Status Display](#workflow-status-display) |
| Update points | every state transition: `DISCUSSION`→`WORK`, `WORK`→`EVALUATION`, `EVALUATION`→`RECORD`, `RECORD`→`ITER/EXIT`, plus inter-step transitions at loop exits |
| Status semantics | <ul><li>`state` ∈ `Pending` / `Active` / `Revising` / `Done` / `Skipped` / `Aborted`.</li><li>When `Active`, `phase` names the current state (`DISCUSSION`, `WORK`'s loop verb, `EVALUATION`, `RECORD`, `ITER/EXIT`).</li></ul> |
| Schema shape | <ul><li>`workflow` is keyed by step name — `configuration` / `ideation` / `preparation` / `planning` / `execution` / `wrap-up` — matching the `workflow.{step}` keys in `settings.json`; each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`.</li><li>The active step is **derived** (the entry whose `state` is `Active` or `Revising`) — there is no `active` key.</li><li>Display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention regardless of object iteration, and is the order the row-4R resume validation uses for the earlier-`Done` / later-not-`Done` invariants.</li><li>`skip` is a `settings.json`-only key; the state-machine entry derives `Skipped` from it at loop entry per the resolution above — `state.json` itself gains **no** `skip` key.</li><li>Chat sessions additionally carry `workflow.chat.tasks[]` — see below.</li></ul> |
| `workflow.chat.tasks[]` | Chat-only additive array (empty for Auto), present in both `state.json` and `session.json`. Owned by [`chat-mode.md`](chat-mode.md); full field reference in [§ Workflow Metadata → Field reference](#workflow-metadata). The `state.json` variant is the live state-machine projection (R3). |

### Loop states

| State | Precondition | Owner | Action | Postcondition (artifact) |
|---|---|---|---|---|
| `DISCUSSION` | Loop entered with input from the prior step, OR re-entered from `ITER/EXIT` after `REVISE` / `FAIL` | manager | Construct the delegation prompt for the owning specialist; in Chat Mode, confirm with the user; spawn the specialist through the active runtime's subagent primitive (Claude Code captures the prompt in the parent transcript's tool_use entry; Codex custom agents use `.codex/agents/{role}.toml`) | Specialist spawned; prompt persisted in the available runtime audit trail |
| `WORK` | Specialist spawned in `DISCUSSION` | owning specialist (`leader` / `executor` / `assistant`) | Execute the loop's work per the delegation prompt. When `propose.mode == dual` (per-loop default), a **parallel Codex proposer** generates an independent proposal alongside the Claude producer (neither sees the other); the producer then **selectively integrates** the frozen proposal into the canonical draft after the pre-integration freeze, before the loop finalizes — orchestration in [`workflow/production.md`](workflow/production.md) | Loop's work artifact |
| `EVALUATION` | Work artifact exists; `workflow.{step}.evaluate.mode != 'skip'` | evaluator subagents (independent of the work owner) | Multi-perspective review per the evaluation policy | Aggregated verdict: `PASS` / `REVISE` / `FAIL` |
| `RECORD` | `EVALUATION` complete OR skipped per policy | `assistant` subagent | Write session staging for this iteration; memory promotion only in Wrap-up | Memory writes complete |
| `ITER / EXIT` | `RECORD` complete | manager | Decide on verdict + budget: continue (transition to `DISCUSSION`, `iter += 1`) or exit (loop closed; surface output to next step) | Loop continues OR loop closed |

`iter` starts at `0` on loop entry. `maxIterations` is read from `workflow.{step}.maxIterations` (default `5`). If `evaluate.mode == 'skip'`, the loop bypasses `EVALUATION` and runs `WORK` → `RECORD` → `ITER/EXIT` on the first pass; the absent verdict is treated as `Skipped` at `ITER/EXIT`.

### Verdict aggregation

| Evaluator verdicts | Aggregated verdict |
|---|---|
| All `PASS` | `PASS` |
| Any `REVISE`, no `FAIL` | `REVISE` |
| Any `FAIL` | `FAIL` |

### Iteration rule

After `EVALUATION` (or its skip path), the loop always proceeds to `RECORD`. The iteration decision happens at `ITER/EXIT`:

- **`PASS`** → exit the loop; surface the work artifact as input to the next step.
- **`Skipped`** (no verdict — `evaluate.mode == 'skip'`) → exit the loop; surface the work artifact.
- **`REVISE` / `FAIL` and `iter < maxIterations`** → increment `iter`, attach the eval findings to the next delegation prompt, re-enter `DISCUSSION`. Re-entry is always at `DISCUSSION` — never directly at `WORK`.
- **`REVISE` / `FAIL` and `iter == maxIterations`** → exit with abort. The failure is captured in this iteration's `RECORD`; the next loop's input notes the abort.

### Mode-specific gates within a loop

The per-loop user-interaction gates are mode-specific and owned by the mode docs:

- **Chat Mode** — the three in-loop gates (after DISCUSSION, after EVALUATION, at ITER/EXIT) plus the fourth task-boundary review gate, and the `discuss.mode` shadowing rule: [`chat-mode.md §5 — Per-loop discipline`](chat-mode.md) (gates + shadowing), [`chat-mode.md` Slice Boundary + §8](chat-mode.md) (task-boundary gate).
- **Auto Mode** — silent auto-advance, the Always-Ask interrupts, and the no-interrupt-on-`maxIterations` rule: [`auto-mode.md §3 — Always-Ask codification`](auto-mode.md) and [`auto-mode.md §6 — maxIterations exhaustion`](auto-mode.md).

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
| `RECORD` (every loop) | `assistant` |

The manager owns no loop directly except Configuration; the manager coordinates.

*RECORD detail (what files, scope of memory updates) lives in [`workflow/record.md`](workflow/record.md).*

---

## Workflow Metadata

The manager records session-level operation metadata in a per-session `session.json`: the session frame
(identity, targeting, environment, git context) plus the runtime record of every step and every spawned
agent. The per-agent record answers one question — **how many tokens did each agent use** (keyed by its
subagent-id and role) — for monitoring and after-the-fact token-budget analysis. It MUST be recorded as the
session runs.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json` |
| Initial template | [`templates/session.template.json`](templates/session.template.json) |

### Recording workflow metadata

Token recording is **runtime-specific**. In Claude Code, token recording is hook-driven. In native Codex, use the Codex rollout / metadata path when available and tolerate missing per-agent detail until Gobbi adds full Codex metadata parity.

Claude Code uses two hooks to write `agents[].tokensUsed` + `usage.*`,
each reading from a complete transcript:

- **PostToolUse hook** ([`post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh), matcher
  `Task\|Agent`) — fires after each subagent returns. It seeds that subagent's `agents[]` entry **best-effort**
  from that agent's OWN complete transcript at `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`
  (`<agentId>` is the short `toolUseResult.agentId`, e.g. `a7363717821bc156d`, also the file stem;
  `isSidechain: true`). "Best-effort" = cumulative from that agent's own transcript at the moment it returned —
  correct for a single-turn agent, but not guaranteed final for a continued one.
- **SessionEnd hook** ([`session-end.sh`](../../../../.claude/hooks/session-end.sh)) — fires once at session
  termination, runs LAST after every transcript is complete, and is the **single authoritative writer** of
  cumulative `agents[].tokensUsed` totals and `usage.*`. It invokes
  [`reconcile-session-metadata.sh`](scripts/reconcile-session-metadata.sh), which reconciles every entry from its
  own complete subagent transcript, computes the **manager rollup** (`agents[0].tokensUsed` summed from the main
  transcript `$CLAUDE_TRANSCRIPT_PATH`, `isSidechain == false`), captures codex tokens, and recomputes
  `usage.sessionTotal` + `usage.codex` + `usage.grandTotal` + `usage.computedAt`.

**Authority rule.** In Claude Code, SessionEnd is the single authoritative writer of `agents[].tokensUsed` cumulative totals and
`usage.*`; PostToolUse seeds each subagent entry best-effort from that agent's own complete transcript; SessionEnd
runs last and reconciles from the complete transcripts (the correctness guarantee). Not-fired degraded path: if
SessionEnd does not fire, values are the PostToolUse best-effort (still cumulative-from-own-transcript, not
final-turn).

**Native Codex degraded path.** Native Codex sessions use `CODEX_THREAD_ID` for identity and the rollout path from `~/.codex/state_5.sqlite` for audit when discoverable. Gobbi hook scripts are Codex-safe, but they do not yet seed Codex custom-agent entries with the same fidelity as Claude Code `Task` / `Agent` hooks. Do not treat missing Claude hook metadata as a native Codex bootstrap failure.

**Field reference.**

| Key | Shape |
|---|---|
| `workflow.{step}` | Per step (same keys as `state.json` / `settings.json`). Configuration carries `startedAt` / `finishedAt` only; steps 2-6 add `iter` (final loop count) + `verdict` (`PASS` \| `REVISE` \| `FAIL`; a skipped or not-yet-run step carries `verdict: null`). |
| `workflow.{loop}.integration` | <ul><li>Per-step **value telemetry** — one object per productive loop (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`); absent on `configuration` and `chat`. Seeded all-`0` by the template.</li><li>Four counts: `changing_rows`, `kept_own_rows`, `total_rows`, `escalated_rows` — derived from the loop's dual-system integration log (`reconciliation-iter{n}.md`) by the count rule below.</li><li>Measures how much the Codex proposal moved the canonical artifact: it answers "did the dual run add value?" (D4.1 — distinguish "Codex added nothing" from an escalation-only loop) and feeds the two-consecutive-no-value → single-mode-candidate signal (D1.6).</li><li>`execution` additionally carries `tasks: []` — one element per task: `{ taskNo, slug, iter, changing_rows, kept_own_rows, total_rows, escalated_rows }` (`taskNo` + `slug` identify the task, `iter` is the task's final loop count, then the four counts; D4.3 per-task value). The loop-level four counts are the SUM over `tasks[]` of each count (the roll-up invariant — see [`record/SKILL.md` § Value-telemetry integration counts](../record/SKILL.md#value-telemetry-integration-counts)).</li><li>A `single`-mode loop runs Claude-only — no Codex proposal, no `reconciliation-iter{n}.md` — so its counts stay seeded `0`.</li></ul> |
| `workflow.chat.tasks[]` | <ul><li>Chat sessions only (`settings.mode == "chat"`; empty for Auto).</li><li>One entry per task slice: `taskNo`, `slug`, `startedAt`, `finishedAt`.</li><li>Per-loop sub-records `ideation` / `preparation` / `planning` / `execution` — same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as `workflow.{step}`.</li><li>`taskRecord: { path, writtenAt }`.</li><li>`preparation` defaults to `state: "Skipped"`.</li><li>Present in both `state.json` (the live state-machine projection, R3) and `session.json` (archives the final iter + verdict per slice, R2).</li><li>Both `templates/state.template.json` and `templates/session.template.json` seed `workflow.chat: { tasks: [] }`; Auto sessions ship the same templates and leave the array empty.</li></ul> |
| `agents[]` | <ul><li>Flat array, one entry per spawn, **manager as `agents[0]`** (template ships the manager seed, `tokensUsed` zeroed).</li><li>Identity: `id` (short `agentId`; manager = own session id), `name`, `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`) = the ROLE, `kind` (`manager` \| `subagent` \| `teammate`) = the SPAWN MECHANISM, `model`, `system`, `transcriptPath` (THIS agent's transcript), `teammateName` (the Agent-Teams `members[].name`; `null` for a plain subagent).</li><li>Routing: `step`, `phase` (`null` for the manager entry), `iter` (`null` for Configuration + manager), `sub_step` (`null` if single). For a CONTINUED agent (multiple turns under one `id`), these top-level routing fields hold the LATEST turn; the full per-turn history lives in `turns[]`.</li><li>Continuation: `continuationOf` (`id` of the predecessor entry this re-primed agent continues, e.g. after `/compact` killed the in-process teammate; `null` if not a continuation), `turns[]` (one object per continuation turn: `{ step, phase, iter, sub_step, tokensUsed, startedAt, finishedAt }`) so a continued agent's per-turn routing is preserved instead of clobbered by the upsert-by-`id`.</li><li>Lifecycle: `status` — the subagent's reported dispatch outcome, mirroring the wire-format `STATUS:` line (`DONE` \| `DONE_WITH_CONCERNS` \| `NEEDS_CONTEXT` \| `BLOCKED`) in [`delegation/SKILL.md` § The Status Contract](../delegation/SKILL.md#the-status-contract). A run that crashed or never returned a `STATUS:` line is recorded as `failed` (the terminal lifecycle fallback); the legacy `ok` maps to `DONE`. Plus `startedAt`, `finishedAt`.</li><li>Back-compat: `kind` / `teammateName` / `continuationOf` / `turns` are additive and optional — an entry written before this schema (or by the unmodified hook) omits them; readers treat absent `kind` as `subagent`, absent `turns` as `[]`, absent `continuationOf` as `null`.</li></ul> |
| `agents[].tokensUsed` | `{input, output, cacheRead, cacheCreation, total}` — **cumulative** across ALL of this agent's turns, from THIS agent's own transcript. `total = input + output + cacheRead + cacheCreation`. |
| `usage` | <ul><li>`usage.sessionTotal` = sum of every `agents[].tokensUsed.total` (Claude-system agents).</li><li>`usage.codex` = `{input, output, cacheRead, cacheCreation, total}` for the external Codex system; only `total` is known from the Codex stdout / rollout, the breakdown stays `0` unless already populated (D6).</li><li>`usage.grandTotal` = `usage.sessionTotal + usage.codex.total` — the cross-system total (D6).</li><li>`usage.computedAt` = ISO timestamp of the last rollup.</li></ul> |

**Integration-count rule (value telemetry).** RECORD parses the loop's dual-system integration log
`sessions/.../{N}-{loop}/working/reconciliation-iter{n}.md` (Execution: the per-task
`4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md`) and counts its decision column:

- `total_rows` — every data row in the delta table (the integration decisions made this loop).
- `changing_rows` — rows whose decision is `took-codex` **or** `merged-selective` (the Codex proposal changed the canonical artifact).
- `kept_own_rows` — rows whose decision is `kept-own` (the producer kept its own element; Codex added nothing here).
- `escalated_rows` — rows whose decision is `escalated` (a LARGE gap surfaced to the user, not self-decided).

RECORD writes the four counts into `session.json.workflow.{loop}.integration`; for Execution it also appends the
per-task `{ taskNo, slug, ...counts }` element to `workflow.execution.integration.tasks[]`. A `single`-mode loop has
no `reconciliation-iter{n}.md`, so its counts stay seeded `0`. Worked example: an integration log with 16 rows split
`took-codex 4 / merged-selective 9 / kept-own 2 / escalated 1` yields `changing_rows: 13`, `kept_own_rows: 2`,
`total_rows: 16`, `escalated_rows: 1`.

**Procedure — when / who / how.** The manager writes the session *frame* (identity, git, `workflow.{step}`
routing); the *token* fields (`agents[].tokensUsed`, `usage.*`) are written by the two hooks per the Authority
rule above. The one token-write the manager still owns is a continued **teammate** turn — a teammate is not a
`Task`/`Agent` result, so no PostToolUse fires for it (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)).

| When | Who | What is written |
|---|---|---|
| Session start (Configuration) | manager | Frame: identity + targeting + environment + `startedAt` + `git` (from settings). Manager seed: fill `agents[0]` (`type: "manager"`) — `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, `step: "configuration"`, `phase: null`; `tokensUsed` stays zeroed until a hook rollup. |
| Worktree creation | manager | `git.branch` + `git.worktreePath`. |
| PR opened | manager | `git.pr` (stays `null` until then — including while a PR is deferred for missing `gh`). |
| Each step transition / loop close / step exit | manager | `workflow.{step}.startedAt` / `finishedAt`; `iter` (steps 2-6); `verdict` (steps 2-6). For Chat: the matching `workflow.chat.tasks[]` sub-records. |
| Each subagent return (immediate) | PostToolUse hook | Seeds the just-returned subagent's `agents[]` entry **best-effort** by `id`, summing `tokensUsed` from that agent's OWN complete transcript. This is the `Task`/`Agent`-hook path; it does NOT fire for a teammate turn (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)). The seed is reconciled at SessionEnd — it is not the final value. |
| Each teammate continuation turn | manager | A continued teammate is not a `Task`/`Agent` result, so the PostToolUse hook does not capture it: the manager appends a `turns[]` record (`step`/`phase`/`iter`/`sub_step` + that turn's `tokensUsed`/timestamps), sets the top-level routing to the latest turn, and sets `continuationOf` on a re-primed entry. The plain upsert-by-`id` alone would clobber per-turn routing — see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams). |
| Session end (authoritative reconcile) | SessionEnd hook | Runs LAST, after every transcript is complete. The **single authoritative writer** of cumulative `agents[].tokensUsed` + `usage.*`: re-reconciles every `agents[]` entry from its own complete transcript, refreshes `agents[0]` (manager rollup) from the main transcript, captures codex tokens, and recomputes `usage.sessionTotal` + `usage.codex` + `usage.grandTotal` + `usage.computedAt`. It is the correctness guarantee the PostToolUse seed is reconciled against. |
| RECORD / Wrap-up (optional safety net) | manager (invokes script) | The same reconcile may be run mid-session as an idempotent safety net — it does NOT replace SessionEnd, which always runs last. The parent-transcript enumeration covers only `Task`/`Agent` subagents — a teammate session is reconciled separately from its OWN transcript (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)). |
| Session end | manager | `finishedAt` (top-level). |

Packaged as composable scripts in [`scripts/`](scripts/):

- [`agent-token-usage.sh`](scripts/agent-token-usage.sh): cumulative `tokensUsed` for one transcript (`--main` for the manager rollup from the main transcript).
- [`reconcile-session-metadata.sh`](scripts/reconcile-session-metadata.sh): bulk reconcile — enumerate → per-agent sum → manager rollup → upsert `agents[]` → recompute `usage.sessionTotal` / `usage.codex` / `usage.grandTotal` (atomic, under `flock`); idempotent. Invoked by the **SessionEnd hook** as the authoritative pass; may also be run at RECORD / Wrap-up as a safety net. This script reads ONLY the parent transcript's `subagents/` directory — it does NOT see teammate sessions (see [Teammate-aware metadata](#teammate-aware-metadata-agent-teams)).

### Teammate-aware metadata (Agent Teams)

The continuation design (`delegation/SKILL.md` § Continue vs Fresh) lets the manager continue the same
leader / executor / assistant as an **Agent-Teams teammate** instead of always spawning fresh. A teammate is NOT a plain
`Task`/`Agent` subagent: it is a **separate, persistent Claude Code session** addressed by name via
`SendMessage`. That difference breaks three assumptions the rollup above is built on, so the metadata model
MUST be teammate-aware. Without it, a continued teammate chain's turns and tokens are invisible — the audit
trail is incomplete and the **F4** cost gate measures the wrong baseline.

**Discovery — find teammates via the team config, not the spawn list.** The parent transcript's `Task`/`Agent`
spawn list does NOT enumerate teammate turns. The manager finds the teammates that participated by reading
the team config `members` array at `~/.claude/teams/{team-name}/config.json` — each member carries
`name` / `agentId` / `agentType`. That `agentId` is the key for the teammate's `agents[]` entry; `name` is
stored as `teammateName`.

**Transcript ownership / location — read from the teammate's OWN session.** Each teammate has its own session
transcript. It is NOT a file under the parent's `${main_transcript%.jsonl}/subagents/` directory (that
directory holds only `Task`/`Agent` sidechain transcripts, `agent-<agentId>.jsonl`). A teammate's turns and
`tokensUsed` are read from the teammate's own session transcript, resolved from its `agentId` via the team
config / the teammate session's `transcriptPath`. Store that path in the entry's `transcriptPath`.

**Token accounting — the rollup MUST include teammate sessions.** `usage.sessionTotal` and the F4 measurement
sum `agents[].tokensUsed.total` across ALL entries, including teammate entries reconciled from their own
sessions. A rollup that counts only the parent `session.json.agents[]` `Task`/`Agent` sums is INVALID — a
continued teammate chain's tokens would be missing, and continuation could show a false cost win.

**Relation to the `Task`/`Agent` hook.** `.claude/hooks/post-tool-use-agents.sh` fires on `Task|Agent` tool
results and upserts `agents[]` by `id` (upsert block ~lines 222–235, last-write-wins). A teammate continuation
is NOT a `Task`/`Agent` tool result in the parent transcript, so the hook does NOT capture it. Two consequences:

- **Teammate turns are captured by the manager, not the hook.** For each teammate turn the manager appends a
  `turns[]` record on that teammate's `agents[]` entry (keyed by `agentId`) and the Wrap-up reconcile re-sums
  `tokensUsed` from the teammate's own session transcript discovered via the `members` array.
- **The upsert-by-`id` would clobber per-turn routing.** Even for a `Task`/`Agent` continuation that reuses one
  `id`, the hook's last-write-wins upsert overwrites the prior turn's `step`/`phase`/`iter`/`sub_step`. The
  `turns[]` sub-array + `continuationOf` pointer preserve per-turn routing instead of collapsing N turns into
  one lossy entry. `continuationOf` links a re-primed entry to its predecessor when a new `id` is issued.

**Resume / rewind non-survival.** In-process teammates are NOT restored by `/resume` or `/rewind`. A continued
teammate chain therefore cannot promise resume-survival: after `/compact`, `/clear`, or resume, the manager
spawns a FRESH agent re-primed from durable session record and records it as a new entry with `continuationOf`
pointing at the dead predecessor — never as a silent re-use of the gone teammate.

**F4 cost-measurement criterion (teammate-aware).** A continued-agent run MUST show lower cumulative
re-read / token cost than the equivalent fresh-spawn baseline, measured via a `tokensUsed` rollup that
**includes teammate-session token usage**. Because a teammate is a separate session whose tokens are NOT in
the parent `subagents/` rollup, an F4 comparison that omits teammate sessions measures the wrong thing and can
hand a false win to a chain that actually costs more.
