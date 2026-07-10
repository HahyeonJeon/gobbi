# Workflow — State Machine (Orchestration)

**Doc kind:** reference-orchestration.

The loop-internal phase mechanics shared by every productive loop — the DISCUSSION → WORK → EVALUATION → RECORD → ITER/EXIT states, the `state.json` schema shape, verdict aggregation, the iteration rule, mode-specific gates, and the loop-to-agent mapping. Loaded by the manager, which is the sole writer of `state.json`.

---

## Workflow State Machine

In Auto Mode the state machine runs linearly across the six steps. In Chat Mode it dispatches a per-task slice meta-loop between Configuration and Wrap-up; see [`chat-mode.md §3 — Workflow`](../chat-mode.md) for the Chat per-slice procedure and [`chat-mode.md §8.2 — Per-task state-transition table`](../chat-mode.md) for the per-task state-transition table. This section specifies the loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION → RECORD → ITER/EXIT) shared by both modes for steps 2-6. The manager moves between states only when each state's postcondition is met.

> **Loop-entry Skipped resolution.** A step resolves to `state: Skipped` at loop entry when **either** `skip: true` **OR** `maxIterations: 0` is set — two independent signals, either alone sufficient. A Skipped step runs no phase rows, emits no `FAIL` / `Aborted` verdict, and stamps `{state: "Skipped", iterations: []}`. `skip: true` is the preferred explicit signal; `maxIterations: 0` (the original "R1 lock") stays valid for back-compatibility. This is distinct from `evaluate.mode: "skip"`, which skips only the EVALUATION phase — the loop still runs WORK → RECORD.

### State persistence

The manager maintains state in a per-session `state.json` file.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json` |
| Initial template | mode-specific: [`templates/state.auto.json`](../templates/state.auto.json) / [`templates/state.chat.json`](../templates/state.chat.json) (seeded by `init-record-map.sh` per the bootstrap mode) |
| Writer / Reader | manager — writer on every transition; reader during Configuration (the resume-only **row 4R**, [§ Step 1](../SKILL.md#step-1--workflow-configuration)) to recover position after `/clear` / `/compact` / resume — validating the row-4R resume invariants before continuing, and never re-stamping Ideation `Active` — and as the projection source for the [Workflow Status Display](status-display.md#workflow-status-display) |
| Update points | every state transition: `DISCUSSION`→`WORK`, `WORK`→`EVALUATION`, `EVALUATION`→`RECORD`, `RECORD`→`ITER/EXIT`, plus inter-step transitions at loop exits |
| Status semantics | <ul><li>`state` ∈ `Pending` / `Active` / `Revising` / `Done` / `Skipped` / `Aborted`.</li><li>When `Active`, `phase` names the current state (`DISCUSSION`, `WORK`'s loop verb, `EVALUATION`, `RECORD`, `ITER/EXIT`).</li></ul> |
| Schema shape | <ul><li>`workflow` is keyed by step name — `configuration` / `ideation` / `preparation` / `planning` / `execution` / `wrap-up` — matching the `workflow.{step}` keys in `settings.json`; each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`.</li><li>The active step is **derived** (the entry whose `state` is `Active` or `Revising`) — there is no `active` key.</li><li>Display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention regardless of object iteration, and is the order the row-4R resume validation uses for the earlier-`Done` / later-not-`Done` invariants.</li><li>`skip` is a `settings.json`-only key; the state-machine entry derives `Skipped` from it at loop entry per the resolution above — `state.json` itself gains **no** `skip` key.</li><li>Chat sessions additionally carry `workflow.chat.tasks[]` — see below.</li></ul> |
| `workflow.chat.tasks[]` | Chat-only additive array (empty for Auto), present in both `state.json` and `session.json`. Owned by [`chat-mode.md`](../chat-mode.md); full field reference in [§ Workflow Metadata → Field reference](metadata.md#workflow-metadata). The `state.json` variant is the live state-machine projection (R3). |

### Loop states

| State | Precondition | Owner | Action | Postcondition (artifact) |
|---|---|---|---|---|
| `DISCUSSION` | Loop entered with input from the prior step, OR re-entered from `ITER/EXIT` after `REVISE` / `FAIL` | manager | Construct the delegation prompt for the owning specialist; in Chat Mode, confirm with the user; spawn the specialist through the active runtime's subagent primitive (Claude Code captures the prompt in the parent transcript's tool_use entry; Codex custom agents use `.codex/agents/{role}.toml`) | Specialist spawned; prompt persisted in the available runtime audit trail |
| `WORK` | Specialist spawned in `DISCUSSION` | owning specialist (`leader` / `executor` / `assistant`) | Execute the loop's work per the delegation prompt. When `propose.mode == dual` (per-loop default), a **parallel Codex proposer** generates an independent proposal alongside the Claude producer (neither sees the other); the producer then **selectively integrates** the frozen proposal into the canonical draft after the pre-integration freeze, before the loop finalizes — orchestration in [`workflow/production.md`](production.md) | Loop's work artifact |
| `EVALUATION` | Work artifact exists; `workflow.{step}.evaluate.mode != 'skip'` | evaluator subagents (independent of the work owner) | Multi-perspective review per the evaluation policy | Aggregated verdict: `PASS` / `REVISE` / `FAIL` |
| `RECORD` | `EVALUATION` complete OR skipped per policy | `assistant` subagent | Write session staging for this iteration; memory promotion only in Wrap-up | Memory writes complete |
| `ITER / EXIT` | `RECORD` complete | manager | Decide on verdict + budget: continue (transition to `DISCUSSION`, `iter += 1`) or exit (loop closed; surface output to next step) | Loop continues OR loop closed |

`iter` starts at `0` on loop entry and counts WORK passes 0-based, so the WORK-pass number is `iter + 1` — the [Workflow Status Display](status-display.md#workflow-status-display) renders it 1-based as `current / max` (the first pass shows `1 / max`). **`maxIterations` is the maximum number of WORK passes** — not re-entries after the first pass — so `maxIterations: 1` means exactly one WORK pass. `maxIterations` is read from the resolved `settings.json` `workflow.{step}.maxIterations`; the default is **mode-specific** (Auto: `5` for every productive loop; Chat: ideation `5`, preparation `0`-skipped, planning `1`, execution `3`, wrap-up `3`). If `evaluate.mode == 'skip'`, the loop bypasses `EVALUATION` and runs `WORK` → `RECORD` → `ITER/EXIT` on the first pass; the absent verdict is treated as `Skipped` at `ITER/EXIT`.

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
- **`REVISE` / `FAIL` before the `maxIterations`-th WORK pass** (`iter + 1 < maxIterations`) → increment `iter`, attach the eval findings to the next delegation prompt, re-enter `DISCUSSION`. Re-entry is always at `DISCUSSION` — never directly at `WORK`. (At `maxIterations: 1` this branch never runs — one WORK pass is the whole budget.)
- **`REVISE` / `FAIL` on the `maxIterations`-th WORK pass** (`iter + 1 == maxIterations`) → the budget is exhausted; exit to the mode's cap-exhaustion path. The failure is captured in this iteration's `RECORD`; the next loop's input notes the exhaustion. (Auto records the abort and continues per [`auto-mode.md §6`](../auto-mode.md); Chat escalates to the user per [`chat-mode.md §5`](../chat-mode.md).)

### Mode-specific gates within a loop

The per-loop user-interaction gates are mode-specific and owned by the mode docs:

- **Chat Mode** — the three in-loop gates (after DISCUSSION, after EVALUATION, at ITER/EXIT) plus the fourth task-boundary review gate, and the `discuss.mode` shadowing rule: [`chat-mode.md §5 — Per-loop discipline`](../chat-mode.md) (gates + shadowing), [`chat-mode.md` Slice Boundary + §8](../chat-mode.md) (task-boundary gate).
- **Auto Mode** — silent auto-advance, the Always-Ask interrupts, and the no-interrupt-on-`maxIterations` rule: [`auto-mode.md §3 — Always-Ask codification`](../auto-mode.md) and [`auto-mode.md §6 — maxIterations exhaustion`](../auto-mode.md).

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

*RECORD detail (what files, scope of memory updates) lives in [`workflow/record.md`](record.md).*
