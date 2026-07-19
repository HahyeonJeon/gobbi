# Workflow — Status Display (Orchestration)

**Doc kind:** reference-orchestration.

The two read-only projections of `state.json` the **manager** renders for the user: the periodic Workflow Status Display snapshot and the always-on Harness Todo List widget. Loaded by the manager when it needs to surface session position; neither is state storage.

---

## Workflow Status Display

In both modes, the manager renders a workflow status snapshot so the user can see, at a glance, where the session is. The display is a projection of the session's `state.json` (see [Workflow State Machine § State persistence](state-machine.md#state-persistence) for where it lives and how it is updated). The snapshot is shown before every user-decision primitive call in Chat Mode, at every loop boundary in Auto Mode, and any time the user asks for status.

**Format.**

> **Workflow Status** — Mode: `chat` — Active: Step 2 of 5

| # | Step | State | Iter | Verdict |
|---|---|---|---|---|
| 1 | Configuration | `✓ Done` | — | — |
| 2 | Ideation Loop | `▸ DISCUSSION` | `1 / 5` | — |
| 3 | Planning Loop | `… Pending` | — | — |
| 4 | Execution Loop | `… Pending` | — | — |
| 5 | Wrap-up Loop | `… Pending` | — | — |

> Active: Constructing the leader delegation prompt — scope, inputs, constraints, success criteria, references.

**State values.**

| State | Meaning |
|---|---|
| `… Pending` | Step not yet started |
| `▸ DISCUSSION` / `▸ WORK` / `▸ EVALUATION` / `▸ RECORD` / `▸ ITER/EXIT` | Step active; current phase named (`WORK` is replaced by the loop's verb — `IDEATION`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP`) |
| `↪ Revising` | `EVALUATION` returned `REVISE` and the loop is re-entering `DISCUSSION` (`iter` increments) |
| `✓ Done` | Step completed via the `PASS` verdict path |
| `⊘ Skipped` | Step bypassed without running `EVALUATION`. Triggered at loop entry by `skip: true` OR `maxIterations: 0` (two independent signals — see [§ Workflow State Machine](state-machine.md#workflow-state-machine) loop-entry resolution), OR mid-loop when `evaluate.mode == 'skip'` (loop ran `WORK` → `RECORD`, no verdict). The `Verdict` column stays `—`. |
| `✗ Aborted` | `maxIterations` exhausted without `PASS` |

**Field rules.**

- **`#` and `Step`** — fixed (1–5; Configuration / Ideation Loop / Planning Loop / Execution Loop / Wrap-up Loop).
- **`Iter`** — `{current} / {max}` while inside a loop; `—` for Configuration and pending steps.
- **`Verdict`** — `—` until `EVALUATION` completes for the current iteration; then `PASS` / `REVISE` / `FAIL`. Cleared back to `—` on re-entry.
- **`Active` line** — one sentence describing what the manager is doing right now: what is being constructed, which subagent is about to be spawned, what was just received. Omit between loops.
- **Header line** — `Mode: chat | auto`; `Active: Step N of 5` (or `Active: — (between loops)` at boundaries).

**Render points.**

| Mode | Render before |
|---|---|
| Chat | Every user-decision primitive call (after `DISCUSSION`, after `EVALUATION`, at `ITER / EXIT`, at session end) |
| Auto | Every loop exit (transition out of `ITER / EXIT`); every user-authority interrupt; whenever the user asks for status |

The display is for the user — it is not state storage. The state machine itself is governed by the [Workflow State Machine](state-machine.md#workflow-state-machine) section; the display is a read-only projection.

**Chat-mode rendering.** In Chat Mode the display uses a two-tier structure (session-level + per-task tier) backed by `state.json.workflow.chat.tasks[currentIndex]` (R3 lock, §6.7). The full Chat rendering spec — header form, body form, and a worked example showing a completed prior task plus the active task — lives in [`chat-mode.md § Status Display`](../chat-mode.md). Auto-mode rendering is the 5-row table above.

---

## Harness Todo List

The manager keeps a harness-native **workflow todo list** — an always-on progress widget that mirrors the 5 workflow steps — using the runtime's task tracker (Claude Code `TaskCreate` / `TaskUpdate`; Codex plan updates; a runtime with no widget falls back to the [Workflow Status Display](#workflow-status-display) table). It is a SECOND read-only projection of `state.json`, beside the Status Display — a COMPLEMENT, never a replacement.

**Authoritative source.** `state.json` is the single source of truth (see [§ State persistence](state-machine.md#state-persistence)). The todo list is a **one-way projection that never writes back**. The manager writes `state.json` FIRST, then projects the widget. On any disagreement `state.json` wins — re-render the widget from it. On resume / `/clear` / `/compact` the widget is REBUILT from `state.json` at Configuration row 4R; a stale resumed widget is never treated as recovery state.

**Granularity.** Seed 5 items at Configuration (one per step). After Planning PASS, expand the Execution item into the locked per-task list; mark each task `in_progress` / `completed` as tasks land. (List grows 5 → 5 + N − 1 at Planning.)

**Update cadence.** Mark a step `in_progress` when its `state.json` entry → `Active`; `completed` when → `Done`; completed-as-skipped on `skip: true` — the step STAYS in the list marked skipped (mirrors `⊘ Skipped`), never dropped from the five-step spine. A `REVISE` keeps the step `in_progress` — the widget does not churn per iteration.

**Rendering.** Render in BOTH Auto and Chat. The widget is the always-on spine; the [Workflow Status Display](#workflow-status-display) table is KEPT as the periodic detailed snapshot. Widget item names/order mirror the table rows.

**Chat specifics.** Steps 2-4 are annotated with the current Task NN/slug; prior completed Chat tasks collapse to a summary item (per [`chat-mode.md` § Status Display](../chat-mode.md)).

**Ownership.** The workflow todo list is **manager-owned**; subagents never create or update it.
