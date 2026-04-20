# Deterministic Workflow State Machine

Feature description for gobbi's v0.5.0 orchestration model. Read this to understand how the six-step workflow is structured, why the orchestrator's view is bounded by design, and how the CLI enforces progression without relying on the orchestrator's judgment.

---

> **The workflow is six steps. The orchestrator sees one prompt at a time. That bounded visibility is the enforcement.**

In v0.4.x, the orchestrator reads skills and decides what to do next. This produces drift: steps get skipped when the conversation feels complete, evaluation is forgotten as context grows, and the workflow diverges from intent. Advice cannot be made reliable.

V0.5.0 replaces advice with Just-in-Time Prompt Compilation. The CLI compiles a prompt for the current workflow step and hands it to the orchestrator. The orchestrator cannot skip steps or bypass evaluation because it never receives instructions for any other step. The single enforcement mechanism is the bounded prompt — nothing else.

---

## The six-step workflow

1. **Workflow Configuration** — Infrastructure setup and user decision capture. Before entering the loop, the session agent checks whether `gobbi-cli` is installed and current, installing or updating automatically if not. The step then: detects any prior incomplete session and offers resume or new; ensures the `.gobbi/` directory tree exists under `project/sessions/{session-id}/`; ensures three SQLite databases are present — `gobbi.db` (user tier), `gobbi.project.db` (project tier), `gobbi-session.db` (session tier); ensures `settings.json` exists at all three tiers with user → project → session inheritance; and captures user decisions — per-loop `eval_enabled` and `max_iterations`, trivial range, git mode (and base branch if worktree-PR), and notification channels. If git mode is worktree-PR, a tracking issue is created and a worktree and branch are cut. If notifications are enabled, credentials are verified. The final input from the user in this step is the task statement — free text capturing what the session is for. The step closes by emitting `workflow.start` and handing off to the Ideation Loop.

2. **Ideation Loop** — `User Prompt → [Discuss → Research → Evaluate] → Idea`. Two PI agents run in parallel, one with an innovative stance and one with a best-practice stance. PI is a single merged role: each PI agent carries out research as part of the loop — no separate agent type exists for research. The loop continues until an idea is concrete enough to plan against.

3. **Planning Loop** — `Idea → [Discuss (optional) → Plan Draft → Evaluate] → Plan`. The orchestrator receives a delegation prompt with the idea as input. Discussion is optional; evaluation is gated by workflow mode.

4. **Execution Loop** — `Plan → [Discuss (optional) → Execute → Evaluate] → Results`. Tasks are executed one at a time.

5. **Memorization Loop** — `Session events → Updated docs, rules, gotchas`. The session event log is the source of record. Decisions, open questions, and corrections are written to design docs, rules, and gotcha files so the next session can resume with full context.

6. **Hand-off** — Triggered by `/compact`, `/clear`, or any session transition. Preserves workflow state in `gobbi-session.db` so the next session can resume cleanly from the last completed step.

---

## Loop configuration

Workflow Configuration captures two settings per loop and writes them to `settings.json` at the session tier. The settings do not change mid-workflow; if the user wants different values for a future workflow, they set them at the next Workflow Configuration.

The two settings are `eval_enabled` (whether evaluation runs inside that loop) and `max_iterations` (how many times the loop body can run before the workflow advances). Defaults:

| Loop      | `eval_enabled` | `max_iterations` |
|-----------|---------------|-----------------|
| Ideation  | true          | 1               |
| Planning  | true          | 1               |
| Execution | true          | 3               |

Execution's higher default reflects that implementation tasks typically need revise-and-retry cycles that Ideation and Planning do not. Setting `eval_enabled` to false for any loop suppresses evaluation for that loop only — the others are unaffected.

---

## Evaluation as a first-class activity

The creator never evaluates its own output. When evaluation runs, the CLI's compiled prompt configures independent perspective agents — at minimum a Project perspective and an Overall perspective. Evaluation findings are surfaced to the user and discussed before anything is applied. The orchestrator never auto-applies evaluation findings.

---

## Reproducibility

All workflow state is derived from events written to `gobbi-session.db`. Replaying the event log produces the same state. `gobbi workflow status` reads current step, completed steps, and feedback round count directly from the event store — no conversation history parsing needed.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `just-in-time-prompt-injection.md` | How JIT prompt compilation enforces the bounded-prompt model |
| `gobbi-config.md` | Three-tier `settings.json` that Workflow Configuration populates |
| `gobbi-memory.md` | The three SQLite databases and how resume reads the event store |
| `worktree-based-operation.md` | The git side of Workflow Configuration — issue and worktree creation |
