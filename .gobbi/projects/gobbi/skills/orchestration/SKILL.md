---
name: orchestration
description: How a manager orchestrates subagents and tasks across a Claude or Codex session.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
---

# Orchestration

You are the manager of this session. You orchestrate subagents and tasks — directing the work, never doing it yourself.

The manager handles two things directly, and only two: **direct discussion with the user** (every clarification, decision point, and approval flows through AskUserQuestion), and **subagent task assignment and management** (picking the specialist, constructing the delegation prompt, sequencing the work, integrating outputs, and verifying the result).

The manager MUST NOT perform Ideation, Planning, Execution, or Evaluation directly. Each phase has a specialist agent type. The manager assigns and coordinates; the manager never does the phase work itself. When the temptation arises to "just do it quickly," that signals the delegation prompt is unclear — sharpen the delegation prompt, do not bypass the specialist.

**Coordinating user ↔ subagent.** As manager, the manager aligns user intent with subagent output. The quality of the result depends on the quality of the instructions passed to the specialist. Focus on:

- Eliciting the user's actual intent (Principle 6 — Refine Vague Requirements Before Acting).
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
MEMORIZATION → ITER/EXIT) live in [`## Workflow State Machine`](#workflow-state-machine);
the per-mode docs reference it.

### Step 1 — Workflow Configuration

**Definition.** Frame the session before any work runs. Configuration is the only step the manager performs without delegating.

**Inputs.** The user's intent; the cascaded workspace and project settings.

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`, an initialized `state.json` and `session.json`, and a per-session worktree that every subsequent write roots into.

**Procedure.** Every session creates a worktree first, then resolves settings, then initializes `state.json` and `session.json` inside that worktree.

| # | Action | Description | Refs | Agent |
|---|---|---|---|---|
| 1 | Create Worktree | <ul><li>Every session creates its own worktree — local git, no `gh` required.</li><li>Invoke `git/SKILL.md` § P2 to create the worktree at branch `{system}-{date}-{ssid-full}`, where `{system}` is `claude` (claude-code runtime) or `codex`, `{date}` is the session-start date `YYYY-MM-DD`, and `{ssid-full}` is the full `$CLAUDE_CODE_SESSION_ID` UUID.</li><li>The branch name follows the session-worktree rule in `git/conventions.md` § Branch Naming (exempt from the type-prefix and 3–50-char slug rules).</li><li>**Idempotency — 3-state guard** (SessionStart fires on `startup\|resume\|clear\|compact`): (1) `worktreePath` is `null` → fresh session; create via P2. (2) `worktreePath` set AND path exists → healthy resume/clear/compact; `cd` in and skip P2. (3) `worktreePath` set AND path missing → orphaned; warn and AskUserQuestion "Worktree at `<path>` is missing — recreate (re-run P2) or abort to investigate?" (recovery: `git/SKILL.md` § P6).</li><li>**Write-root rule:** P2's output is an in-turn worktree path the manager holds in memory; rows 3 and 4 use it as the absolute write root. Row 4 stamps it into `session.json.git.worktreePath`, the durable canonical write-root from that point on (per `git/SKILL.md` § Memory Access Matrix).</li></ul> | [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree), [`git/SKILL.md` § P6](../git/SKILL.md#p6----recover-orphaned-worktree), [`git/conventions.md` § Branch Naming](../git/conventions.md#branch-naming) | manager |
| 2 | Resolve Settings | <ul><li>Read the per-mode default template `settings.{mode}.json` matching the bootstrap-selected mode (Chat → `settings.chat.json`; Auto → `settings.auto.json`).</li><li>Chat: present the defaults and AskUserQuestion — use as-is or customize. Auto: use defaults without asking.</li><li>If customizing, walk each section via AskUserQuestion — per-step evaluation policy, discussion policy, `skip`, `maxIterations`, and per-agent-type `models`. (`mode` is already fixed by the loaded file.)</li><li>Write the resolved `settings.json` (defaults overlaid with overrides) to the session dir, then read the cascade back to confirm the write took effect.</li></ul> | [settings.chat.json](templates/settings.chat.json) / [settings.auto.json](templates/settings.auto.json) | manager |
| 3 | Init state.json | <ul><li>Copy `templates/state.template.json` into `…/sessions/{date}-{session-id}/state.json`, rooted at the row-1 worktree path (in-turn value — `session.json` is not written yet).</li><li>Set `mode` from the resolved settings.</li><li>Mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` (Step 1 has just completed).</li></ul> | [state.template.json](templates/state.template.json) | manager |
| 4 | Init session.json | <ul><li>Copy `templates/session.template.json` into the session dir, rooted at the row-1 worktree path. This row stamps `git.worktreePath`, making it the durable canonical write-root for all later session-memory writes.</li><li>Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior `sessionId` on resume / post-`/clear` / post-`/compact`, else `null`); `project`; `feature` (`null` if not yet clear — stamp later during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` `null`; `transcriptPath` from `$CLAUDE_TRANSCRIPT_PATH` with `$HOME`→`~/` (leave `null` if absent).</li><li>Resolve `git`: stamp `git.repo` + `git.baseBranch` from settings (derive `git.repo` via `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project settings if `null`); stamp `git.branch` and `git.worktreePath` from the row-1 worktree; stamp `git.issue` if known.</li><li>Fill the `agents[]` manager entry (`type: "manager"`) with `id`, `name`, `model`, `system`, `transcriptPath`, `startedAt`; set `step: "configuration"`, `phase: null`. Specialist entries are appended automatically by the PostToolUse hook ([`post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh), matcher `Task\|Agent`); the reconstructor ([`reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh)) reconciles on missed events. The manager seeds only its own entry and never hand-appends specialist entries.</li></ul> | [session.template.json](templates/session.template.json) | manager |

**No-`gh` resilience.** The worktree and branch are always created with local git. Only PR creation needs `gh` (CLI + auth + remote). If `gh`, auth, or the remote is unavailable, the session still creates the worktree and commits on the branch; the manager defers the PR and surfaces a "PR deferred — push/open when `gh` is available" notice. The session never falls back to working in the main tree. See `git/SKILL.md` § Prerequisites.

**Project-memory / interview gate.** The project-memory baseline check and the interview auto-recommendation are owned by `gobbi/SKILL.md` (session bootstrap) — see its project-memory baseline check. Configuration does not re-run that gate.

---

## Workflow Status Display

In both modes, the manager renders a workflow status snapshot so the user can see, at a glance, where the session is. The display is a projection of the session's `state.json` (see [Workflow State Machine § State persistence](#state-persistence) for where it lives and how it is updated). The snapshot is shown before every AskUserQuestion in Chat Mode, at every loop boundary in Auto Mode, and any time the user asks for status.

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
| `▸ DISCUSSION` / `▸ WORK` / `▸ EVALUATION` / `▸ MEMORIZATION` / `▸ ITER/EXIT` | Step active; current phase named (`WORK` is replaced by the loop's verb — `IDEATION`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP`) |
| `↪ Revising` | `EVALUATION` returned `REVISE` and the loop is re-entering `DISCUSSION` (`iter` increments) |
| `✓ Done` | Step completed via the `PASS` verdict path |
| `⊘ Skipped` | Step bypassed without running `EVALUATION`. Triggered at loop entry by `skip: true` OR `maxIterations: 0` (two independent signals — see [§ Workflow State Machine](#workflow-state-machine) loop-entry resolution), OR mid-loop when `evaluate.mode == 'skip'` (loop ran `WORK` → `MEMORIZATION`, no verdict). The `Verdict` column stays `—`. |
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

**Chat-mode rendering.** In Chat Mode the display uses a two-tier structure (session-level + per-task tier) backed by `state.json.workflow.chat.tasks[currentIndex]` (R3 lock, §6.7). The full Chat rendering spec — header form, body form, and a worked example showing a completed prior task plus the active task — lives in [`chat-mode.md § Status Display`](chat-mode.md). Auto-mode rendering is the existing 6-row table above; it is unchanged.

---

## Canonical session tree

The on-disk layout every session materializes under `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`. The manager bootstraps each loop's `{rawdata, staging, evaluation, artifacts}` subdirs at loop entry; the assistant and evaluator write into them per their skills. This is the canonical shape; deviations are normalized going-forward by Wrap-up (see [`wrap-up/SKILL.md` § Non-standard session-subdir cleanup](../wrap-up/SKILL.md)).

```
sessions/{date}-{session-id}/
├── session.json              ← per-session telemetry (manager init row 6 + assistant UPSERT)
├── settings.json             ← resolved session config (cascade)
├── state.json                ← per-session workflow state-machine file (manager init row 5.5; see § State persistence)
├── session.json.lock         ← advisory write-lock guarding concurrent session.json writes (manager; safe to ignore on read)
└── {loop}/                   ← loop ∈ ideation | preparation | planning | execution | wrap-up
    ├── rawdata/              ← draft-iter{n}.md, transcript-iter{n}.jsonl, discussion-log.md, research/{slug}.md
    │                            (the ONLY scratch surface — no separate tmp/ tier; resume/restore scratch lives here, not in restore/)
    ├── staging/{...}/        ← typed-finding stagings (Wrap-up promotion source)
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── artifacts/{free-filename}.md   ← PASS-only
```

**Session-root files.** `session.json` (telemetry), `settings.json` (resolved config), `state.json` (the workflow state-machine file — see [§ State persistence](#state-persistence)), and `session.json.lock` (advisory write-lock the manager creates / releases around each `session.json` write; not memory content — safe to ignore on read).

**No `tmp/` scratch tier.** `{loop}/rawdata/` is the only scratch surface in the canonical tree. A `tmp/` dir or a `rawdata/restore/` sub-tier is non-canonical — resume / restore scratch lives directly in `rawdata/`. Wrap-up removes `tmp/` going-forward (see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)).

### Per-task Execution layout (the quartet)

The Execution loop is per-task. Each task lives under `execution/task-{NN}/` and carries the **full quartet** — `{rawdata, staging, evaluation, artifacts}`:

```
execution/
├── staging/{...}/            ← loop-level (cross-task) staging
└── task-{NN}/
    ├── rawdata/draft-iter{n}.md, transcript-iter{n}.jsonl
    ├── staging/{...}/
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── artifacts/{free-filename}.md
```

Every `task-{NN}/` gets the full quartet. A task with only `evaluation/` (missing rawdata / staging / artifacts) is an incomplete task layout — the quartet is required unless a task is documented eval-only.

### Per-perspective evaluation file naming

Evaluation outputs are named `evaluation/iter{n}/{system}/{perspective}.md` where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocabulary — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` — plus `overall.md`. **Bare names only**: no `pN-` positional prefix, and the **same 7-perspective vocabulary on both systems** so cross-system reconciliation pairs files 1:1. The 7-perspective vocabulary is owned by [`evaluation/SKILL.md`](../evaluation/SKILL.md); the manager's spawn / reconciliation orchestration is in [`workflow/evaluation.md`](workflow/evaluation.md).

---

## Workflow State Machine

In Auto Mode the state machine runs linearly across the six steps. In Chat Mode it dispatches a per-task slice meta-loop between Configuration and Wrap-up; see [`chat-mode.md §3 — Workflow`](chat-mode.md) for the Chat-specific per-slice procedure and [`chat-mode.md §8.2 — Per-task state-transition table`](chat-mode.md) for the state-transition table. The rest of this section describes the loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER/EXIT) shared by both modes.

> **Loop-entry Skipped resolution (two independent signals).** A workflow step resolves to
> `state: Skipped` at loop entry when **either** `skip: true` **OR** `maxIterations: 0` is set
> for that step — the two are independent signals, and either one alone is sufficient. A Skipped
> step runs no DISCUSSION / WORK / EVALUATION / MEMORIZATION rows, emits no `FAIL` or `Aborted`
> verdict, and stamps `{state: "Skipped", iterations: []}`. The `maxIterations: 0` path (the
> original "R1 lock") is retained and coexists with the explicit `skip` boolean; `skip: true` is
> the preferred explicit signal, `maxIterations: 0` remains valid for back-compatibility. This
> is distinct from `evaluate.mode: "skip"`, which skips only the EVALUATION phase (the loop still
> runs WORK → MEMORIZATION), not the whole step.

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
| Schema shape | `workflow` is keyed by step name — `configuration`, `ideation`, `preparation`, `planning`, `execution`, `wrap-up` — matching the `workflow.{step}` keys in `settings.json`. Each `state.json` entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`. (The `settings.json` per-step object additionally carries a `skip` boolean alongside `discuss` / `evaluate` / `maxIterations`; the state-machine entry derives `Skipped` from it at loop entry per the loop-entry resolution above. The `state.json` schema itself does NOT gain a `skip` key — only settings does.) The current active step is derived (the entry whose `state` is `Active` or `Revising`); there is no separate `active` key. The display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention; the manager renders the [Workflow Status Display](#workflow-status-display) in that order regardless of object iteration. **Chat sessions additionally carry `workflow.chat.tasks[]`** — see the schema below. |
| `workflow.chat.tasks[]` schema (additive — Chat sessions only) | Present in both `state.json` and `session.json` when `settings.mode == "chat"`. Auto sessions leave this array empty. Each entry: `taskNo` (zero-padded ordinal), `slug` (subject-descriptive kebab-case), `startedAt`, `finishedAt`, and per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as the top-level `workflow.{loop}` entries — same parser, different path), plus `taskRecord: { path, writtenAt }`. The `preparation` sub-record carries `state: "Skipped"` by default (R1). **Templates**: `templates/state.template.json` and `templates/session.template.json` both gain `workflow.chat: { tasks: [] }` — auto sessions ship the same templates and leave the array empty. The `state.json` variant is the live state-machine projection (R3); the `session.json` variant archives final iter + verdict per slice (R2). |

### Loop states

| State | Precondition | Owner | Action | Postcondition (artifact) |
|---|---|---|---|---|
| `DISCUSSION` | Loop entered with input from the prior step, OR re-entered from `ITER / EXIT` after `REVISE` / `FAIL` | manager | Construct the delegation prompt for the owning specialist; in Chat Mode, confirm with the user; spawn the specialist via the Agent tool (the full delegation prompt is captured in the parent transcript's tool_use entry — no separate file is written) | Specialist agent spawned; delegation prompt persisted in the parent's transcript |
| `WORK` | Specialist spawned in `DISCUSSION` | owning specialist (`leader` / `executor` / `assistant`) | Execute the loop's work per the delegation prompt received via the Agent tool | Loop's work artifact |
| `EVALUATION` | Work artifact exists; `workflow.{step}.evaluate.mode != 'skip'` | evaluator subagents (independent of the work owner) | Multi-perspective review per the evaluation policy | Aggregated verdict: `PASS` / `REVISE` / `FAIL` |
| `MEMORIZATION` | `EVALUATION` complete OR `EVALUATION` skipped per policy | `assistant` subagent | Write session staging for this iteration; project-memory promotion only in Wrap-up | Memory writes complete |
| `ITER / EXIT` | `MEMORIZATION` complete | manager | Decide based on verdict and budget — continue (transition to `DISCUSSION` with `iter += 1`) or exit (loop closed; surface output to next step) | Loop continues OR loop closed |

`iter` starts at `0` on loop entry. `maxIterations` is read from `workflow.{step}.maxIterations` (default `5`).

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

**Chat Mode** pauses at four points:

| Gate | Manager action |
|---|---|
| After `DISCUSSION` | AskUserQuestion to confirm the delegation prompt or revise scope |
| After `EVALUATION` | AskUserQuestion to discuss findings and choose remediation (proceed, revise scope, descope, abort) |
| At `ITER / EXIT` (when deciding to exit) | AskUserQuestion to confirm exiting the loop and starting the next step |
| **At task boundary** (per-task user review gate — Chat only) | After the task-record is written, AskUserQuestion: **Next task / Revise / Wrap up**. "Next task" starts a new per-task slice. "Revise" re-enters the current slice at DISCUSSION. "Wrap up" advances to Step 6 (Wrap-up Loop). |

`WORK` and `MEMORIZATION` auto-advance — the user has already approved the delegation prompt, and `MEMORIZATION` is mechanical capture.

**Chat Mode and `discuss.mode` settings.** In Chat Mode, the per-step `discuss.mode` setting is **shadowed** by the mode-level discuss-first contract: regardless of a step's `discuss.mode` value, every loop entry forces user-driven DISCUSSION (the manager presents the delegation prompt and awaits explicit user confirmation before spawning the specialist). This means a step configured with `discuss.mode: "agent"` still pauses at DISCUSSION in Chat Mode. The full per-loop discipline is specified in [`chat-mode.md § Per-loop discipline`](chat-mode.md).

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
| Git block (in serialization order) | `git.repo` (`owner/name` shorthand from `gh repo view`), `git.baseBranch` (base branch the work descends from), `git.branch` (the session-worktree branch), `git.worktreePath` (absolute path to the session worktree — always set in normal operation, never `null`), `git.issue` (GitHub issue number anchoring the work; `null` if none), `git.pr` (PR number once opened; `null` until then — including while a PR is deferred for missing `gh`). |
| Update points | session start (stamp identity + targeting + environment + `startedAt` + `git` resolved from settings); worktree creation (stamp `git.branch` + `git.worktreePath`); PR opened (stamp `git.pr`); session end (stamp top-level `finishedAt`) |

### Workflow runtime

Per-step runtime data + per-agent records — appended throughout execution. The two top-level keys for this section are `workflow` (per-step) and `agents` (per-spawn).

| Field | Value |
|---|---|
| `workflow` shape | Keyed by step name (same keys as `state.json` and `settings.json`). The Configuration entry carries only `startedAt` / `finishedAt` (single pass, no iteration or verdict). Steps 2-6 entries also carry `iter` (final loop iteration count, archived from state.json `iter` on step exit) and `verdict` (final outcome — `pass` \| `fail` \| `skipped`). |
| `workflow` update points | each step transition (set `workflow.{step}.startedAt` / `finishedAt`); each loop iteration close (increment `workflow.{step}.iter` for steps 2-6); each step exit (stamp `workflow.{step}.verdict` for steps 2-6 — `pass` \| `fail` \| `skipped`) |
| `workflow.chat.tasks[]` (additive — Chat sessions only) | Present when `settings.mode == "chat"`; Auto sessions leave this array empty. Each entry: `taskNo` (zero-padded ordinal within session), `slug` (subject-descriptive kebab-case), `startedAt`, `finishedAt`, per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as the top-level `workflow.{step}` entries — same parser, different path), plus `taskRecord: { path, writtenAt }`. The `preparation` sub-record carries `state: "Skipped"` by default (R1). Update points: on slice start (stamp `taskNo`, `slug`, `startedAt`); on each loop transition within the slice; on task-record write (stamp `taskRecord`); on slice exit (stamp `finishedAt`). |
| `agents` shape | Flat top-level array — one entry per spawn, manager included. The template ships with the manager entry pre-populated (`type: "manager"`, all other fields `null`) as the seed shape. Each entry self-identifies its step and phase. |
| Per-agent record | Fields: `id` (subagent session id), `name` (display name from spawn), `type` (`manager` \| `leader` \| `executor` \| `evaluator` \| `assistant`), `step` (which step the spawn belongs to: `configuration` \| `ideation` \| `preparation` \| `planning` \| `execution` \| `wrap-up`), `phase` (which phase spawned the agent — `DISCUSSION` is manager-only and has no specialist agents; `WORK` carries the loop's verb `IDEATION` / `PLAN_DRAFT` / `EXECUTION` / `WRAPUP`; `EVALUATION`; `MEMORIZATION`; `null` for the manager entry), `iter` (which loop iteration the spawn belongs to; `null` for Step 1 Configuration and the manager entry), `model`, `system` (`claude-code` \| `codex`), `transcriptPath`, `tokensUsed` (`{input, output, cacheRead, cacheCreation}`), `startedAt`, `finishedAt` |
| `agents` update points | session start (manager fills the manager template entry — set `id` / `name` / `model` / `system` / `transcriptPath` / `startedAt`, plus `step: "configuration"` and `phase: null`); each subagent spawn (PostToolUse hook `post-tool-use-agents.sh` upserts an entry by `tool_use_id`, reading `step` / `phase` / `iter` / `sub-step` from delegation structured headers — see [Step 1 row 6](#step-1--workflow-configuration)); each subagent completion (the same hook, firing on PostToolUseFailure as well, updates `finishedAt` / `tokensUsed` / `status`). The verify-and-fix reconstructor [`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh) reconciles the array against transcript ground truth if any hook event was missed. |
