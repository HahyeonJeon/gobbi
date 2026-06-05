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
| **assistant** | Exploration, Memorization, Wrap-up, other trivial tasks | Codebase searches, session note collection, doc summaries, mechanical edits |

**Manager ownership.** Decision authority is centralized in the manager. The manager owns **judgment** (what should be done next, in what order), **scope construction** (who has the right context for the next task), and **verification** (that the delivered result matches what was promised). The user holds final authority on direction. The manager never delegates judgment — only execution.

---

## Orchestration Mode

The manager runs every session in one of two modes. Both modes follow the same underlying workflow; what differs is who drives it and which state-machine shape runs between Configuration and Wrap-up. The mode is picked at session start and surfaced to the user — never inferred from context.

> **CORRECTION — 2026-05-28.** The original Workflow-control lock ("Mode controls user gates; it does not relax the workflow.") — previously the second sentence of the pre-redesign `### Inter-loop transition` paragraph, struck through in PR #273 commit `6c72793` — has been superseded by the mode-dispatched state-machine design ratified in session `2026-05-28-8eed14fb`. Mode now controls **which state machine runs**, not just gate density. Auto dispatches the linear 6-step sequence. Chat dispatches a per-task slice loop (Step 2 → Step 4 → Step 5 → task-record) per user-typed task, with Step 3 resolving to `Skipped` at loop entry (R1), repeating until the user signals end-of-session, then triggering Step 6. Both shapes preserve `evaluate.mode: always`. Per-loop MEMORIZATION is retained as a hard invariant: Auto runs the full base procedure; Chat's narrowed PASS path is declared locally in [`chat-mode.md §4 — Chat MEMORIZATION`](chat-mode.md). The Workflow-section per-step procedure for Steps 2-6 (formerly in this file) was relocated to the mode docs in PR #273 follow-up: see [`auto-mode.md §2 — Workflow`](auto-mode.md) and [`chat-mode.md §3 — Workflow`](chat-mode.md). See also: `sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md §6.1 + §6.6`.

### Chat Mode

The user drives the workflow one task at a time. The manager runs a per-task slice (Ideation → mini-Planning → mini-Execution) and returns control to the user after each slice. Session ends on explicit user signal. Full spec: [`chat-mode.md`](chat-mode.md).

### Auto Mode

The manager runs the linear 6-step state machine end-to-end with minimal user intervention, pausing only for Always-Ask decisions (design, scope, destructive). Full spec: [`auto-mode.md`](auto-mode.md).

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

**Output.** A populated `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json` covering all session policies.

**Procedure.**

| # | Action | Refs | Agent |
|---|---|---|---|
| 1 | Read the per-mode default settings template `settings.{mode}.json` matching the mode the user selected during session bootstrap (Chat → [`settings.chat.json`](templates/settings.chat.json); Auto → [`settings.auto.json`](templates/settings.auto.json)). In Chat Mode, present it to the user and AskUserQuestion: use defaults as-is, or customize? In Auto Mode, default to "use defaults" without asking. | [settings.chat.json](templates/settings.chat.json) / [settings.auto.json](templates/settings.auto.json) | manager |
| 2 | If "customize" was chosen, walk through each section via AskUserQuestion to collect overrides — per-step evaluation policy, per-step discussion policy, per-step `maxIterations`, per-agent-type `models`, git workflow. (The `mode` key itself is already fixed by the file the bootstrap loaded.) | [settings.chat.json](templates/settings.chat.json) / [settings.auto.json](templates/settings.auto.json) | manager |
| 3 | Write the resulting `settings.json` (defaults overlaid with any overrides) to `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/settings.json`. | — | manager |
| 4 | Read the cascaded resolution back to confirm the write took effect. | — | manager |
| 5 | **Create worktree (P2 wrapper) — produces the worktree path held in-turn for use by rows 5.5 and 6; row 6 stamps it as `git.worktreePath` in `session.json`.** Read resolved `settings.git.workflow.mode` from settings. If `direct`: skip — no worktree is created, `git.branch` will be stamped from the current HEAD in row 6 (preserves direct-mode escape hatch; see Task 06 / LOCK #5 footnote, which lands in this same Step 1 section). If `worktree-pr`: invoke [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree) to create the worktree at branch `chore/session-{date}-{ssid-short}`, where `{date}` is the session-start date in `YYYY-MM-DD` format and `{ssid-short}` is the first 8 characters of `$CLAUDE_CODE_SESSION_ID`. Branch name must satisfy the [`git/conventions.md` line 22 shape regex](../git/conventions.md#branch-naming) and the [line 64 description-slug length constraint (3–50 chars)](../git/conventions.md#branch-naming) — the slug `session-YYYY-MM-DD-{8chars}` (27 chars) satisfies this. **Idempotency guard — 3-state machine (SessionStart fires on `startup\|resume\|clear\|compact`):** (1) `worktreePath` is `null` — fresh session; proceed to create the worktree via P2 above. (2) `worktreePath` is set AND the path exists on disk — healthy resume/clear/compact; `cd` into the existing worktree and skip P2 entirely. (3) `worktreePath` is set AND the path is missing — orphaned worktree (directory deleted but `session.json` still references it); log a warning and surface AskUserQuestion: "Worktree at `<path>` is missing — recreate it (re-run P2) or abort to investigate?". Recreate follows the same P2 invocation as state 1; abort exits Step 1 without advancing. Recovery guidance: [`git/SKILL.md` § P6](../git/SKILL.md#p6----recover-orphaned-worktree). **Path rule (rows 5.5 and 6)**: P2's output is an in-turn worktree path the manager holds in memory — rows 5.5 and 6 use this in-turn value as the absolute write root (`worktree-pr` mode); fall back to the main-tree root when `direct` mode. `session.json.git.worktreePath` is the durable field that row 6 stamps from this in-turn value; from row 6 onward `session.json.git.worktreePath` is the canonical reference — per `git/SKILL.md` § [Memory Access Matrix](../git/SKILL.md#memory-access-matrix) (Critical rule — write paths) and `qualified-git-write-path-rule.md`. | [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree), [`git/SKILL.md` § P6](../git/SKILL.md#p6----recover-orphaned-worktree), [`git/conventions.md` :22 (shape regex)](../git/conventions.md#branch-naming), [`git/conventions.md` :64 (length)](../git/conventions.md#branch-naming) | manager |
| 5.5 | Initialize `state.json` for the session by copying the state template into `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json`. **Write root**: use the worktree path produced by P2 in row 5 (in-turn value — `session.json` has not been written yet) as the absolute root in `worktree-pr` mode; fall back to the main-tree root in `direct` mode — per `git/SKILL.md` § [Memory Access Matrix](../git/SKILL.md#memory-access-matrix) (Critical rule — write paths) and `qualified-git-write-path-rule.md`. Set `mode` from the resolved settings, then mark `workflow.configuration.state = "Done"` and `workflow.ideation.state = "Active"` since Step 1 has just completed. | [state.template.json](templates/state.template.json) | manager |
| 6 | Initialize `session.json` for the session by copying the session template into `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/session.json`. **Write root**: use the worktree path produced by P2 in row 5 (in-turn value) as the absolute root in `worktree-pr` mode; fall back to the main-tree root in `direct` mode — per `git/SKILL.md` § [Memory Access Matrix](../git/SKILL.md#memory-access-matrix) (Critical rule — write paths) and `qualified-git-write-path-rule.md`. This row stamps `git.worktreePath` into `session.json`, making it the durable reference; from this row onward, `session.json.git.worktreePath` is the canonical write-root for all subsequent session-memory writes. Stamp top-level fields in serialization order: `sessionId`; `previousSessionId` (prior session's `sessionId` if this session is a continuation — resume / post-`/clear` / post-`/compact`; otherwise `null`); `project`; `feature` (the broader feature this session targets — leave `null` if not yet clear and stamp later, typically during Ideation); `task`; `system` (`claude-code` or `codex`); `startedAt`; leave `finishedAt` as `null`; stamp `transcriptPath` from `$CLAUDE_TRANSCRIPT_PATH` (env var set by the hook) — substitute `$HOME` prefix with `~/` (tilde form) before storing so the value is portable across machines; leave `null` if the env var is absent. Resolve `git` from settings + environment: stamp `git.repo` and `git.baseBranch` from the cascaded settings; if `git.repo` is `null` in settings (uninitialized project), derive it from `gh repo view --json nameWithOwner -q .nameWithOwner` and write back to project-level settings before stamping the session; if the resolved git workflow mode is `direct`, stamp `git.branch` (current HEAD) and leave `git.worktreePath`/`pr` as `null`; if it is `worktree-pr`, stamp `git.branch` and `git.worktreePath` from the worktree just created in row 5. Stamp `git.issue` if known at session start. Fill the manager entry already present in `agents[]` (`type: "manager"`) with the manager's `id`, `name`, `model`, `system`, `transcriptPath`, and `startedAt`; set `step: "configuration"` and `phase: null`. **Specialist entries are appended automatically by the PostToolUse hook**: every Agent/Task tool call fires [`.claude/hooks/post-tool-use-agents.sh`](../../../../.claude/hooks/post-tool-use-agents.sh) (registered for matcher `Task|Agent` on both `PostToolUse` and `PostToolUseFailure`; see Task 09), which upserts an `agents[]` entry by `tool_use_id` — the manager seeds only its own entry at this row and never hand-appends specialist entries thereafter. Idempotency and recovery from missed hook events are provided by [`.claude/scripts/reconstruct-agents.sh`](../../../../.claude/scripts/reconstruct-agents.sh), a verify-and-fix reconstructor that scans the transcript for Agent/Task tool_use + tool_result pairs and reconciles `agents[]` against ground truth. The hook reads structured headers (`Your phase:` / `Your iteration:` / `Your sub-step:` / `Your step:`) from the delegation `tool_input.prompt` to populate per-entry metadata — see [`delegation/SKILL.md` § Hook Integration](../delegation/SKILL.md#hook-integration). **Stamping mechanism (FIX A):** the manager agent reads the updated session docs and stamps the top-level `transcriptPath` field this session; CLI automation of this stamping is deferred to a future session. | [session.template.json](templates/session.template.json) | manager |
| 7 | **Interview check (bootstrap gate)**: inspect `.gobbi/projects/{project-name}/`. Apply the 3-tier detection below, then act accordingly. The user can always explicitly invoke Interview via `/gobbi interview` regardless of project tier. | [interview/SKILL.md](../interview/SKILL.md) | manager |

**Row 5 — Direct-mode opt-out (LOCK #5)**

When `settings.git.workflow.mode == "direct"`, row 5 is skipped entirely — no worktree is created, no P2 is invoked, and `session.json.git.worktreePath` stays `null`. `git.branch` is stamped from the current HEAD in row 6. This is the documented escape hatch; it is not a fallback-on-error path.

Direct mode is the correct choice in two situations:

- **Emergency hotfix** — the manager needs to push a single targeted fix to a branch immediately, without the overhead of worktree setup or a PR lifecycle. Example: a production-breaking bug where the round-trip latency of worktree creation + CI wait is unacceptable.
- **Pure-read session** — the session's entire purpose is investigation, mistake-promotion, doc lookup, or other read-only work that produces no shippable artifact. A worktree and a PR would add ceremony with no benefit.

Outside these two situations the default is `worktree-pr`. The opt-out is a user-level setting (`settings.git.workflow.mode`) resolved at Configuration Step 1, not a per-step override.

The two modes differ along three behavioral axes:

- **Worktree creation.** `worktree-pr` invokes [`git/SKILL.md` § P2](../git/SKILL.md#p2----create-worktree) at row 5 to create a per-session worktree under `.gobbi/projects/<name>/worktrees/`. `direct` skips P2 entirely — the session works in the main tree at its current checkout.
- **Branch stamping.** `worktree-pr` stamps `session.json.git.branch` to the freshly created `chore/session-<date>-<ssid-short>` branch and `session.json.git.worktreePath` to the new worktree's absolute path. `direct` stamps `git.branch` from the current HEAD (no new branch) and leaves `git.worktreePath` as `null`.
- **PR cadence.** `worktree-pr` is the default integration path: the manager pushes the session branch and opens a PR at Wrap-up. `direct` commits straight to the current branch with no PR lifecycle — appropriate only for emergency hotfix or pure-read sessions as described above.

**Smoke-test gate (T1.h — verification for post-merge sessions)**

After this feature merges to `develop`, every new session running `worktree-pr` must produce a `session.json.git.branch` value that matches the regex below. Run this check at the first post-merge session's Memorization phase:

```
jq -r '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json
```

Expected match: `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`

Also verify `jq -r '.git.worktreePath'` returns a non-null value for `worktree-pr` sessions. A `null` `worktreePath` on a `worktree-pr` session indicates row 5 was skipped or P2 failed without surfacing an error.

**3-tier bootstrap detection**

| Tier | Condition | Manager action |
|---|---|---|
| **Empty** | No `README.md`, no `design/`, no `features/` directory with content | Surface AskUserQuestion: "Project memory is empty — run a project interview before starting work? Interview runs 5 waves to populate project context." If accepted, load `interview/SKILL.md` and run to completion before Ideation. If declined, proceed to Step 2 directly. |
| **Sparse** | Has `README.md` OR a skeleton `design/` directory, but no `features/` directory with content | Surface AskUserQuestion: "Your project memory looks sparse. Run `/gobbi interview` to flesh out the basics, or continue to Ideation?" User decides; skip Interview if declined. |
| **Mature** | Has `features/` directory with content | Skip Interview auto-recommendation. Proceed to Step 2 directly. Interview is only invoked when the user explicitly requests it via `/gobbi interview`. |

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

In Auto Mode the state machine runs linearly across the six steps. In Chat Mode it dispatches a per-task slice meta-loop between Configuration and Wrap-up; see [`chat-mode.md §3 — Workflow`](chat-mode.md) for the Chat-specific per-slice procedure and [`chat-mode.md §8.2 — Per-task state-transition table`](chat-mode.md) for the state-transition table. The rest of this section describes the loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER/EXIT) shared by both modes. Note: `maxIterations: 0` resolves to `state: Skipped` at loop entry — never `Aborted` after running with cap 0 (R1 lock).

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
| Schema shape | `workflow` is keyed by step name — `configuration`, `ideation`, `preparation`, `planning`, `execution`, `wrap-up` — matching the `workflow.{step}` keys in `settings.json`. Each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`. The current active step is derived (the entry whose `state` is `Active` or `Revising`); there is no separate `active` key. The display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention; the manager renders the [Workflow Status Display](#workflow-status-display) in that order regardless of object iteration. **Chat sessions additionally carry `workflow.chat.tasks[]`** — see the schema below. |
| `workflow.chat.tasks[]` schema (additive — Chat sessions only) | Present in both `state.json` and `session.json` when `settings.mode == "chat"`. Auto sessions leave this array empty. Each entry: `taskNo` (zero-padded ordinal), `slug` (subject-descriptive kebab-case), `startedAt`, `finishedAt`, and per-loop sub-records `ideation` / `preparation` / `planning` / `execution` (same `{state, verdict, iter, maxIterations, phase, iterations[]}` shape as the top-level `workflow.{loop}` entries — same parser, different path), plus `taskRecord: { path, writtenAt }`. The `preparation` sub-record carries `state: "Skipped"` by default (R1). **Templates**: `templates/state.template.json` and `templates/session.template.json` both gain `workflow.chat: { tasks: [] }` — auto sessions ship the same templates and leave the array empty. The `state.json` variant is the live state-machine projection (R3); the `session.json` variant archives final iter + verdict per slice (R2). |

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
| Git block (in serialization order) | `git.repo` (`owner/name` shorthand from `gh repo view`), `git.baseBranch` (base branch the work descends from), `git.branch` (working branch — current HEAD in `direct`, feature branch in `worktree-pr`), `git.worktreePath` (absolute path to worktree in `worktree-pr` mode; `null` in `direct`), `git.issue` (GitHub issue number anchoring the work; `null` if none), `git.pr` (PR number once opened; `null` until then). The git workflow mode itself lives in `settings.json` and is not duplicated here. |
| Update points | session start (stamp identity + targeting + environment + `startedAt` + `git` resolved from settings); worktree creation (stamp `git.branch` + `git.worktreePath` in `worktree-pr` mode); PR opened (stamp `git.pr`); session end (stamp top-level `finishedAt`) |

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
