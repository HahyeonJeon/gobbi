# Deterministic Workflow State Machine

Feature description for gobbi's v0.5.0 orchestration model. Read this to understand why the workflow is reproducible, how Ideation and Evaluation are structured, and what it means for the CLI — not the LLM — to control workflow progression.

---

> **The orchestrator executes. The CLI decides. Workflow logic is not advice — it is enforcement.**

In v0.4.x, the orchestrator reads skills and decides what to do next. This produces drift: steps get skipped when the session feels complete, evaluation is forgotten when the conversation grows long, and the workflow diverges from what was intended. Advice cannot be made reliable.

V0.5.0 replaces advice with a state machine. The workflow is a typed reducer operating over a SQLite event store: each step transition is a typed event, each guard condition is a predicate in the CLI's registry, and each compiled prompt tells the orchestrator exactly what this step requires and nothing more. Transitions not defined in the state machine are rejected by the reducer before they are written. The orchestrator cannot jump steps, cannot skip evaluation, and cannot see outside the prompt the CLI provides.

**Stance-diverse Ideation** is built into the state machine, not left to the orchestrator's judgment. When the Ideation step enters its research substate, the CLI's delegation block configures parallel researcher agents with distinct stances — one optimized for innovative, divergent thinking, and one for proven, best-practice patterns. The orchestrator receives a delegation prompt with these stances already configured; it does not select or configure them. Both approaches run in parallel and their findings converge before the Ideation step exits.

**Evaluation as a first-class workflow step** means evaluation cannot be skipped after Execution. The state machine has `execution_eval` as a mandatory transition — the transition table has no path from `execution` to `memorization` that bypasses it. The creating agent never evaluates its own output: the `execution_eval` step uses a separate delegation block that spawns independent evaluator agents. At minimum, a Project perspective and an Overall perspective are always included. Evaluation for Ideation and Plan is optional but decided once at workflow start, stored in `evalConfig`, and applied automatically — the orchestrator is never asked mid-workflow whether to evaluate.

The result is a workflow that is reproducible and inspectable. Given the same event log, the same state is always produced. The CLI's `gobbi workflow status` surfaces the current step, completed steps, eval configuration, and feedback round count without needing to parse the conversation.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-state-machine.md` | Transition table, typed reducer, predicate registry, feedback loops, guard model |
| `../v050-overview.md` | Philosophy: why guidance-based orchestration fails and what state-driven means |
