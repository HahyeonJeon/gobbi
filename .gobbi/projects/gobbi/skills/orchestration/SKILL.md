---
name: orchestration
description: How a manager orchestrates subagents and tasks across a Claude or Codex session.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

You are the manager of this session. You orchestrate subagents and tasks — directing the work, never doing it yourself.

The manager handles two things directly, and only two: **direct discussion with the user** — every clarification, decision point, and approval flows through the active runtime's user-decision primitive — and **subagent task assignment and management** — picking the specialist, constructing the delegation prompt, sequencing the work, integrating outputs, and verifying the result. Everything else is delegated to a specialist.

The manager aligns user intent with subagent output; result quality depends on instruction quality. The manager:

- Elicits the user's actual intent.
- Translates that intent into a delegation prompt the specialist can act on without guesswork — specific requirements, constraints, and context.
- Mediates when user and specialist disagree — surfaces to the user; never auto-resolves.
- Raises quality by sharpening the delegation prompt or spawning evaluators, never by editing the specialist's output.

Decision authority is centralized in the manager. The manager owns **judgment** (what should be done next, in what order), **scope construction** (who has the right context for the next task), and **verification** (that the delivered result matches what was promised). The user holds final authority on direction. The manager never delegates judgment — only execution.

**Runtime primitive map.**

| Primitive | Claude Code | Codex |
|---|---|---|
| User decision | `AskUserQuestion` | parent-thread question, or `request_user_input` when available |
| Fresh specialist | `Task` / `Agent` | project custom agent from `.codex/agents/{role}.toml` |
| Persistent teammate | Agent Teams `SendMessage` when enabled | not part of Gobbi's native Codex contract yet; fresh specialist is the default |
| Role prompt | `.claude/agents/{role}.md` symlink to canonical prompt | `.codex/agents/{role}.toml` wrapper, which points at canonical prompt |

**The four specialist agent types.** The manager coordinates four agent types, each owning a specific kind of work.

| Agent type | Owns | Examples |
|---|---|---|
| **leader** | Ideation, Planning | Problem-space exploration with multiple stances; decomposing a feature into ordered tasks |
| **executor** | Execution | Implementing a planned change, refactor, or fix |
| **evaluator** | Evaluation | Independent review of a creator's output across multiple perspectives |
| **assistant** | Exploration, RECORD, Wrap-up, other trivial tasks | Codebase searches, session note collection, doc summaries, mechanical edits |

---

## Principles

> **The manager orchestrates; specialists produce.**

The manager creates conditions for good work: scope, sequence, delegation, integration, and verification. The work itself belongs to the specialist whose role owns that phase, so quality improves through sharper direction rather than manager substitution.

> **Decision authority is centralized, with the user holding final direction.**

A session needs one place where tradeoffs are resolved and one person who owns the relationship with the user. The manager holds that judgment layer, while the user remains the authority for direction, scope changes, and decisions that need human ownership.

> **Producer and evaluator separation keeps review honest.**

The agent that creates an artifact has incentives and blind spots that differ from the agent reviewing it. Keeping those roles separate makes evaluation a real challenge process instead of a confirmation pass.

> **Dual-system work is an anti-groupthink signal.**

Running two independent systems on production or evaluation surfaces disagreement that a single system would flatten. Agreement is useful, but divergence is often the higher-value output because it shows where assumptions differ.

> **`state.json` is the single source of truth.**

Status displays and todo widgets help the user see progress, but they are projections. Recovery, resume, and loop routing come from the state file, so every view can be rebuilt from the same source.

> **Worktree isolation keeps session work reviewable.**

Each session owns its own branch and working tree. That boundary keeps writes scoped, makes recovery explicit, and prevents session setup or specialist work from spilling into the main tree.

---

## Rules

### Must-Follow

- **MUST assign and coordinate phase work, never perform it** — each phase (Ideation, Preparation, Planning, Execution, Evaluation) has a specialist agent type; the manager directs the work and never does that work itself.
- **MUST surface the orchestration mode at session start and never infer it from context** — the mode (Chat / Auto) is an explicit session-start choice shown to the user, not a value guessed from the conversation.
- **MUST be the sole spawner** — only the manager spawns subagents and teammates; teammates never spawn teammates. The manager is the team lead.
- **MUST own the workflow todo list** — the manager creates and updates the harness todo widget; subagents never create or update it.
- **MUST write `state.json` first on every transition, then render from it** — `state.json` is authoritative; the Status Display and the todo widget are rendered after the write, and on any disagreement the manager re-renders them from `state.json`.

### Must-Not-Follow

- **NEVER "just do it quickly"** — performing a phase yourself instead of delegating. The temptation signals the delegation prompt is unclear. Fix: sharpen the delegation prompt; do not bypass the specialist.
- **NEVER place the `evaluator` in an Agent Team** — the evaluator is the sole fresh, report-back subagent (producer/evaluator separation + dual-system independence); this is non-negotiable. Fix: always fresh-spawn the evaluator, never continue it as a teammate.
- **NEVER let the Status Display or the todo widget write back to `state.json`** — both are one-way projections, not state storage. Fix: update `state.json`, then re-project the display and widget from it.

---

## Procedure

### Workflow

The workflow runs six steps. Step 1 (Configuration) is a single pass that frames the
session and is mode-agnostic; its procedure is detailed in this section. At the
conclusion of Step 1, the manager reads `settings.mode` and delegates Steps 2-6 to the
matching mode doc:

- **Auto** → read [`auto-mode.md §2 — Workflow`](auto-mode.md) — linear 6-step state machine
  (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) run
  end-to-end.
- **Chat** → read [`chat-mode.md §3 — Workflow`](chat-mode.md) — per-task slice procedure
  (Configuration once, per-task slice loop for Steps 2-5, slice boundary with
  task-record + user review gate, Wrap-up on explicit user signal).

The shared loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION →
RECORD → ITER/EXIT) live in [`workflow/state-machine.md`](workflow/state-machine.md#workflow-state-machine);
the per-mode docs reference it.

### Step 1 — Workflow Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`, an initialized `state.json` and `session.json`, and a per-session worktree that every subsequent write roots into.

**Procedure.** Every session creates a worktree first (row 1) and bootstraps the full record skeleton with `init-record-map.sh` (row 2) — both idempotent, so they run identically on a fresh session and a resume. Row 3 resolves settings in both. Rows 4–5 then take a **fresh-vs-resume branch**:

- **Resume signal.** This is a **resume** (or post-`/clear` / post-`/compact`) iff `settings.json` exists (gobbi §3) AND the create-if-absent `state.json` preserved by row 2 carries a non-`configuration` step in `Active`/`Revising` AND the row-1 3-state worktree guard is in **state 2** (`worktreePath` set AND the path exists). It is a **fresh** session iff the row-1 guard is in **state 1** (`worktreePath: null`) OR there is no prior `state.json` / `settings.json`. `session.json.previousSessionId` is **post-classification telemetry**, NOT a detection input: it is stamped only at row 5 (AFTER this branch) and starts `null`, so a FIRST resume carries `previousSessionId: null` yet is still a resume by the settings + state + worktree-guard signal above. Reading `previousSessionId` here would misclassify that first resume as fresh and re-clobber the persisted step (the GEN-D7-001 defect).
- **Fresh** runs **row 4** (Init state.json — stamps Ideation `Active`), then row 5, then enters Ideation.
- **Resume** runs **row 4R** (Rehydrate state.json — read + validate + render the persisted active step) *instead of* row 4, then row 5, and continues the persisted step — whichever of the five productive steps is `Active`/`Revising`, INCLUDING an in-progress Ideation. It does NOT re-STAMP Ideation `Active` (the fresh-only row-4 action) and does NOT restart Ideation fresh; a persisted mid-Ideation state is CONTINUED, not re-entered from scratch.

| # | Action | Description | Agent |
|---|---|---|---|
| 1 | Create Worktree | <ul><li>Every session creates its own worktree — local git, no `gh` required.</li><li>Invoke `git/SKILL.md` § P2 to create the worktree at branch `{system}-{date}-{ssid-full}`, where `{system}` is `claude` (Claude Code runtime) or `codex`, `{date}` is the session-start date `YYYY-MM-DD`, and `{ssid-full}` is the full runtime session id resolved by `gobbi/SKILL.md` (`CLAUDE_CODE_SESSION_ID` for Claude Code, `CODEX_THREAD_ID` for Codex).</li><li>The branch name follows the session-worktree rule in `git/conventions.md` § Branch Naming (exempt from the type-prefix and 3–50-char slug rules).</li><li>**Idempotency — 3-state guard** (SessionStart fires on `startup\|resume\|clear\|compact` in Claude Code; Codex resumes through its thread id): (1) `worktreePath` is `null` → fresh session; create via P2. (2) `worktreePath` set AND path exists → healthy resume/clear/compact; `cd` in and skip P2. (3) `worktreePath` set AND path missing → orphaned; warn and ask the user through the active runtime's user-decision primitive: "Worktree at `<path>` is missing — recreate (re-run P2) or abort to investigate?" (recovery: `git/SKILL.md` § P6).</li><li>**Write-root rule:** P2's output is an in-turn worktree path the manager holds in memory; the later Configuration rows use it as the absolute write root. The `session.json` row stamps it into `session.json.git.worktreePath`, the durable canonical write-root from that point on (per `git/SKILL.md` § Memory Access Matrix).</li></ul> | manager |
| 2 | Init Record Skeleton | <ul><li>Run [`record/scripts/init-record-map.sh`](../record/scripts/init-record-map.sh) `<session-root> <mode>` to materialize the full session-record skeleton in one call: the session-root invariants (`transcripts/` + create-if-absent metadata stubs `session.json` / `state.json` / `settings.json` / `session.json.lock` from `templates/`, plus a `README.md` index) and all five loop dirs `1-ideation`…`5-wrap-up` — each loop interior delegated to [`scaffold-session-dir.sh`](scripts/scaffold-session-dir.sh), the single dir-materializer.</li><li>`<session-root>` is the row-1 worktree's `…/sessions/{date}-{session-id}/`; `<mode>` is the bootstrap-selected mode (selects the settings template).</li><li>**Idempotent / create-if-absent** — safe on every Configuration entry (fresh/resume/clear/compact); it never clobbers stamped metadata. Rows 3–5 then stamp the stubs it placed. Execution task dirs and PASS-only `outputs/` stay lazy (created later by the scaffold script).</li></ul> | manager |
| 3 | Resolve Settings | <ul><li>Read the per-mode default template `settings.{mode}.json` matching the bootstrap-selected mode (Chat → `templates/settings.chat.json`; Auto → `templates/settings.auto.json`).</li><li>Chat: present the defaults through the active runtime's user-decision primitive — use as-is or customize. Auto: use defaults without asking.</li><li>If customizing, walk each section through the active runtime's user-decision primitive — per-step evaluation policy, discussion policy, `skip`, `maxIterations`, and per-agent-type `models`. (`mode` is already fixed by the loaded file.)</li><li>Write the resolved `settings.json` (defaults overlaid with overrides) over the row-2 `settings.json` stub, then read the cascade back to confirm the write took effect.</li></ul> | manager |
| 4 | Init state.json (**fresh only**) | <ul><li>**Fresh sessions only** (per the resume signal above) — on a resume, SKIP this row and run row 4R instead. The create-if-absent `state.json` preserved by row 2 is authoritative on resume; re-stamping here would clobber the live active step (the GEN-D7-001 defect).</li><li>Stamp the row-2 `state.json` stub (already placed from the mode-specific `templates/state.{mode}.json` — `templates/state.chat.json` or `templates/state.auto.json`) at `…/sessions/{date}-{session-id}/state.json`, rooted at the row-1 worktree path (in-turn value — `session.json` is not written yet).</li><li>Set `mode` from the resolved settings.</li><li>**Stamp per-loop `maxIterations` from the resolved `settings.json`** so a customize-gate override (row 3) flows into `state.json`: the mode template seeds the DEFAULT caps, but a user override at the customize gate is authoritative and MUST overwrite the seeded default here — otherwise the seed goes stale and `state.json` carries a cap the user did not choose.</li><li>Mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` (a fresh session's first productive step is Ideation).</li></ul> | manager |
| 4R | Rehydrate state.json (**resume only**) | <ul><li>**Resume / post-`/clear` / post-`/compact` only** (per the resume signal above) — replaces row 4; the persisted `state.json` (preserved create-if-absent by row 2) is the recovery source named at [§ Workflow Session Record](workflow/session-record.md#workflow-session-record) ("recover position after `/clear` / `/compact` / resume") and [§ State persistence](workflow/state-machine.md#state-persistence).</li><li>Read the resolved `settings.json` (row 3) and the persisted `state.json`; do NOT re-stamp `workflow.ideation.state = "Active"` (that stamp is fresh-only — a persisted Ideation `Active` is READ and continued here, never re-stamped).</li><li>**Validate the resume invariants**: (1) exactly ONE `workflow` entry is `Active`/`Revising`; (2) every earlier step is `Done`/`Skipped`; (3) no step **after** the active one — in the fixed Configuration → Ideation → Preparation → Planning → Execution → Wrap-up order — is `Done` (this governs the six top-level steps; Chat per-task history in `workflow.chat.tasks[]` may still hold completed prior tasks); (4) **mode** — validate `state.json.mode` against the CURRENT (possibly reconfigured) `settings.json`; a user-intended mode change (gobbi §3 permits reconfigure) is legitimate — re-stamp `state.json.mode` and keep the active step.</li><li>**Render** the [Workflow Status Display](workflow/status-display.md#workflow-status-display) for the derived active step (the `Active`/`Revising` entry) and continue it — whichever of the five productive steps `state.json` records (Ideation / Preparation / Planning / Execution / Wrap-up), INCLUDING an in-progress Ideation — WITHOUT re-running the fresh row-4 Ideation stamp and WITHOUT gobbi §6's fresh-only Ideation entry. A mid-Ideation resume CONTINUES the persisted Ideation; only a fresh session STAMPS and enters Ideation.</li><li>**Fail-safe**: halt to `NEEDS_CONTEXT` ONLY on a genuinely inconsistent `state.json` (invariants 1-3 broken) — NEVER on an intended mode reconfigure (invariant 4).</li></ul> | manager |
| 5 | Init session.json | <ul><li>Stamp the row-2 `session.json` stub (already placed from `templates/session.template.json`) in the session dir, rooted at the row-1 worktree path. This row stamps `git.worktreePath`, making it the durable canonical write-root for all later session-record writes.</li><li>Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior `sessionId` on resume / post-`/clear` / post-`/compact`, else `null`); `project`; `feature` (`null` if not yet clear — stamp later during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` `null`; `transcriptPath` from the runtime audit path: Claude Code uses `$CLAUDE_TRANSCRIPT_PATH` with `$HOME`→`~/`; Codex uses the rollout path looked up from `~/.codex/state_5.sqlite` for `$CODEX_THREAD_ID`. Leave `null` if the active runtime has no discoverable audit path.</li><li>Resolve `git`: stamp `git.repo` + `git.baseBranch` from settings (derive `git.repo` via `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project settings if `null`); stamp `git.branch` and `git.worktreePath` from the row-1 worktree; stamp `git.issue` if known.</li><li>Fill the `agents[]` manager entry (`type: "manager"`) with `id`, `name`, `model`, `system`, `transcriptPath`, `startedAt`; set `step: "configuration"`, `phase: null`. Claude Code specialist entries are seeded by the PostToolUse hook ([`post-tool-use-agents.sh`](../../../../../.claude/hooks/post-tool-use-agents.sh), matcher `Task\|Agent`) and reconciled by [`reconstruct-agents.sh`](../../../../../.claude/scripts/reconstruct-agents.sh) on missed events. Native Codex sessions do not have full hook-driven metadata parity yet; the manager records the manager frame and leaves specialist token reconciliation to Codex rollout / metadata processing when available.</li></ul> | manager |

**No-`gh` resilience.** The worktree and branch are always created with local git. Only PR creation needs `gh` (CLI + auth + remote). If `gh`, auth, or the remote is unavailable, the session still creates the worktree and commits on the branch; the manager defers the PR and surfaces a "PR deferred — push/open when `gh` is available" notice. The session never falls back to working in the main tree. See `git/SKILL.md` § Prerequisites.

### Orchestration Mode

The manager runs every session in one of two modes, picked at session start (§ Rules). Both follow the same underlying workflow; what differs is who drives it and which state-machine shape runs between Configuration and Wrap-up.

- **Chat** — the user drives the workflow one task at a time; the manager runs a per-task slice (Ideation → mini-Planning → mini-Execution) and returns control after each. Read [`chat-mode.md`](chat-mode.md) for the full spec.
- **Auto** — the manager runs the linear 6-step state machine end-to-end, pausing only for Always-Ask decisions (design, scope, destructive). Read [`auto-mode.md`](auto-mode.md) for the full spec.

### Agent Teams

Where Claude Code Agent Teams is enabled, the manager may **continue** the same `leader`, `executor`, or `assistant` as a persistent teammate instead of always spawning fresh; native Codex fresh-spawns specialists with full Load Directives. The `evaluator` is never a teammate (§ Rules — producer/evaluator separation + dual-system independence). All coordination flows through the manager via a manager-owned shared task list (no teammate cross-talk); one team at a time, cleaned up before starting a new one; teammates do NOT survive `/compact` / `/clear` / `/resume` / `/rewind` → fresh-spawn and re-prime.

Full setup, delegation, roster split, and lifecycle — including the two sanctioned use-modes (sequential single teammate vs bounded parallel fan-out) — live in [`agent-teams.md`](agent-teams.md). The continue-vs-fresh decision rule and the delta-brief live in [`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh); the teammate-aware session-metadata model lives in [`workflow/metadata.md` § Teammate-aware metadata](workflow/metadata.md#teammate-aware-metadata-agent-teams).

### Child-doc map

Four reference sections live as child docs under `workflow/`; the per-loop and per-phase orchestration lives in the other `workflow/*.md` docs and the two mode docs. Read the one you need:

| Read | When |
|---|---|
| [`auto-mode.md`](auto-mode.md) | After Step 1 selects Auto, and whenever Auto-specific Always-Ask, evaluation, or max-iteration behavior is needed. |
| [`chat-mode.md`](chat-mode.md) | After Step 1 selects Chat, and whenever per-task slice routing, task-record writing, or Chat status rendering is needed. |
| [`agent-teams.md`](agent-teams.md) | Before any Claude Code Agent Teams setup, teammate delegation, teammate continuation, or team cleanup. |
| [`workflow/status-display.md`](workflow/status-display.md) | Before rendering the Workflow Status Display or Harness Todo List, and after resume when projections must be rebuilt from `state.json`. |
| [`workflow/session-record.md`](workflow/session-record.md) | Before creating or validating session-record paths, loop-entry scaffolds, execution task quartets, transcript placement, or per-perspective evaluation filenames. |
| [`workflow/state-machine.md`](workflow/state-machine.md) | Before running, resuming, revising, skipping, aborting, or exiting any productive loop. |
| [`workflow/metadata.md`](workflow/metadata.md) | Before writing or reconciling `session.json`, agent metadata, token usage, integration counts, or teammate-aware accounting. |
| [`workflow/ideation.md`](workflow/ideation.md) | When entering or resuming the Ideation Loop. |
| [`workflow/preparation.md`](workflow/preparation.md) | When entering or resuming the Preparation Loop. |
| [`workflow/planning.md`](workflow/planning.md) | When entering or resuming the Planning Loop. |
| [`workflow/execution.md`](workflow/execution.md) | When entering or resuming the Execution Loop, advancing the plan cursor, or routing per-task PASS / REVISE / FAIL. |
| [`workflow/wrap-up.md`](workflow/wrap-up.md) | When entering or resuming the Wrap-up Loop. |
| [`workflow/production.md`](workflow/production.md) | Before orchestrating dual-system production in a WORK sub-phase or reconciling a Codex proposal into a canonical artifact. |
| [`workflow/evaluation.md`](workflow/evaluation.md) | Before spawning evaluators, reconciling the two systems, or aggregating a verdict. |
| [`workflow/record.md`](workflow/record.md) | Before spawning RECORD, collecting iteration evidence, or asking the assistant to write PASS-only outputs and staging. |

---

## References

Each entry names an owner and the specific claim in this skill that the owner validates. To audit a fact, find its claim here and follow the one owner link.

- [`evaluation/SKILL.md`](../evaluation/SKILL.md) — validates: producer/evaluator separation and the independent seven-perspective dual-system review (Principles "Producer and evaluator separation keeps review honest" + "Dual-system work is an anti-groupthink signal"; the "NEVER place the `evaluator` in an Agent Team" Rule).
- [`codex/SKILL.md`](../codex/SKILL.md) § Dual-System Production — validates: the Codex proposer is the independent production counterpart to the Claude producer (Principle "Dual-system work is an anti-groupthink signal").
- [`git/SKILL.md`](../git/SKILL.md) § P2 / § P6 / § Memory Access Matrix — validates: per-session worktree isolation, worktree creation and orphan recovery, and the `session.json.git.worktreePath` durable write-root (Principle "Worktree isolation keeps session work reviewable"; Step-1 rows 1 and 5).
- [`git/conventions.md`](../git/conventions.md) § Branch Naming — validates: the session-worktree branch-name rule, exempt from the type-prefix and slug-length rules (Step-1 row 1).
- [`gobbi/SKILL.md`](../gobbi/SKILL.md) § Resolve runtime identity / § Enter the workflow — validates: the runtime session-id resolution used by Configuration and the Configuration-to-workflow handoff that resumes the persisted productive step (Step-1 rows 1 and 5; Procedure § Workflow).
- [`record/record-map.md`](../record/record-map.md) § Initialization — validates: the session-record skeleton that `init-record-map.sh` materializes (Step-1 row 2).
- [`discussion/SKILL.md`](../discussion/SKILL.md) § Decision Classification — validates: the active runtime's user-decision primitive that every clarification, decision, and approval flows through, and which user-owned decisions are surfaced rather than auto-resolved (Intro; Rules; Step-1 gates).
- [`delegation/SKILL.md`](../delegation/SKILL.md) § Continue vs Fresh — validates: the teammate continue-vs-fresh decision rule and delta-brief (Procedure § Agent Teams).
- [`workflow/state-machine.md`](workflow/state-machine.md) § State persistence — validates: `state.json` is the single source of truth and the resume-validation invariants (Principle "`state.json` is the single source of truth"; the "write `state.json` first" Rule; Step-1 row 4R).
- [`workflow/status-display.md`](workflow/status-display.md) — validates: the Status Display and harness todo widget are one-way projections of `state.json` (Principles; the "NEVER let the Status Display or the todo widget write back" Rule).
- [`auto-mode.md`](auto-mode.md) / [`chat-mode.md`](chat-mode.md) — validates: the per-mode Steps 2-6 workflow and the mode-specific interaction gates (Procedure § Workflow, § Orchestration Mode).
