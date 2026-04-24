# Deterministic Workflow State Machine

Feature description for gobbi's v0.5.0 orchestration model. Read this to understand how the six-step workflow is structured, why the orchestrator's view is bounded by design, and how the CLI enforces progression without relying on the orchestrator's judgment.

---

> **The workflow is six steps. The orchestrator sees one prompt at a time. That bounded visibility is the enforcement.**

In v0.4.x, the orchestrator reads skills and decides what to do next. This produces drift: steps get skipped when the conversation feels complete, evaluation is forgotten as context grows, and the workflow diverges from intent. Advice cannot be made reliable.

V0.5.0 replaces advice with Just-in-Time Prompt Compilation. The CLI compiles a prompt for the current workflow step and hands it to the orchestrator. The orchestrator cannot skip steps or bypass evaluation because it never receives instructions for any other step. The single enforcement mechanism is the bounded prompt — nothing else.

---

## The six-step workflow

1. **Workflow Configuration** — Infrastructure setup and user decision capture. Before entering the loop, the session agent checks whether `gobbi-cli` is installed and current, installing or updating automatically if not. The step then: detects any prior incomplete session and offers resume or new; ensures the `.gobbi/` directory tree exists under `project/{project_name}/sessions/{session_id}/`; ensures the single SQLite event store is present at `.gobbi/gobbi.db` — one database serves every project and every session in the workspace; ensures `settings.json` exists at all three levels (workspace / project / session) via `ensureSettingsCascade`; and captures user decisions — per-step `evaluate.mode` and discussion preferences, git workflow mode (and base branch if worktree-PR), and notification channels. If git mode is worktree-PR, a tracking issue is created and a worktree and branch are cut. If notifications are enabled, credentials are verified. The final input from the user in this step is the task statement — free text capturing what the session is for. The step closes by emitting `workflow.start` and handing off to the Ideation Loop. See `gobbi-config/README.md` for the settings cascade and CLI surface.

2. **Ideation Loop** — `User Prompt → [Discuss → Research → Evaluate] → Idea`. Two PI agents run in parallel, one with an innovative stance and one with a best-practice stance. PI is a single merged role: each PI agent carries out research as part of the loop — no separate agent type exists for research. The loop continues until an idea is concrete enough to plan against. Discussion with the user — via `AskUserQuestion` at every decision point — is the loop's driving mechanism. PI agents investigate in parallel, but the user's clarifications shape what they investigate and when the loop exits.

3. **Planning Loop** — `Idea → [Discuss (optional) → Plan Draft → Evaluate] → Plan`. The orchestrator receives a delegation prompt with the idea as input. Discussion is optional; evaluation runs only when the loop's `eval_enabled` is true and the iteration cap has not been reached.

4. **Execution Loop** — `Plan → [Discuss (optional) → Execute → Evaluate] → Results`. Each iteration of the loop handles one planned task. The orchestrator delegates the task to a subagent with bounded scope, verifies the result, and advances to the next task only after the result passes. When evaluation finds revisable issues, the task re-enters the loop up to `max_iterations` times (default 3) before the workflow escalates.

5. **Memorization Loop** — `Session events + rawdata → Updated project memory`. The loop reads the full record of the session — every event in `.gobbi/gobbi.db`, every `rawdata/` artifact captured by the JIT hooks during Ideation, Planning, and Execution, and every intermediate step `README.md` — and extracts structured memory into the project tier: decisions into `decisions/`, corrections into `gotchas/`, design changes into `design/`, and deferred items into `backlogs/`. Exactly which classes of session artifact graduate into which project memory directory is a design area still under discussion — the feature guarantees preservation of the raw material and a mechanism for distilling it, without locking to a final extraction policy.

6. **Hand-off** — Triggered by `/compact`, `/clear`, or any session transition. Preserves workflow state in `.gobbi/gobbi.db` so the next session can resume cleanly from the last completed step.

---

## Loop configuration

Workflow Configuration captures per-step evaluation and discussion settings and writes them to `settings.json` at the session level (via `gobbi config set --level session`). The settings do not change mid-workflow; if the user wants different values for a future workflow, they set them at the next Workflow Configuration.

Evaluation is governed by `workflow.{step}.evaluate.mode` — one of `'always' | 'ask' | 'skip' | 'auto'`. All three steps default to `'always'` (conservative, maximum quality-checking). Discussion is governed by `workflow.{step}.discuss.mode`. The `max_iterations` iteration cap is tracked in workflow state (not in the settings file).

See `gobbi-config/README.md` for the full settings shape and cascade resolution. The translation from `evaluate.mode` enum to EVAL_DECIDE event booleans is handled by `resolveEvalDecision` in `lib/settings-io.ts`.

---

## Evaluation as a first-class activity

The creator never evaluates its own output. When evaluation runs, the CLI's compiled prompt configures independent perspective agents — at minimum a Project perspective and an Overall perspective. Evaluation findings are surfaced to the user and discussed before anything is applied. The orchestrator never auto-applies evaluation findings.

---

## Reproducibility

All workflow state is derived from events written to `.gobbi/gobbi.db`. Replaying the event log produces the same state. A status-read command (name TBD) exposes current step, completed steps, and loop iteration counts directly from the event store — no conversation history parsing needed.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `just-in-time-prompt-injection.md` | How JIT prompt compilation enforces the bounded-prompt model |
| `gobbi-config/README.md` | Unified `settings.json` cascade (workspace / project / session) that Workflow Configuration populates |
| `gobbi-memory.md` | The single `.gobbi/gobbi.db` event store, three-tier memory layout, and how resume replays events |
| `worktree-based-operation.md` | The git side of Workflow Configuration — issue and worktree creation |
