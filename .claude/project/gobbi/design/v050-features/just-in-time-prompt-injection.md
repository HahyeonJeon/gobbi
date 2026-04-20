# Just-in-Time Prompt Injection

Feature description for gobbi's prompt timing model. Read this to understand when prompts are emitted, why skills are no longer always-loaded, and how hook-based injection keeps context bounded.

---

> **Prompts arrive at the moment of need. A step that hasn't started yet contributes no tokens to the current context.**

In v0.4.x, skills are always-loaded: every session starts with the full skill library in context, regardless of which workflow step is active. An execution step carries ideation guidance; an evaluation step carries planning guidance. Context grows toward the limit and agents are distracted by knowledge that is not relevant to the current task.

V0.5.0 replaces always-loading with just-in-time emission. `gobbi workflow next` compiles the prompt for the active step only — reading workflow state, selecting the step spec, loading the skill materials that are relevant to this specific step, and delivering a bounded prompt. The orchestrator sees what this step needs. It does not see workflow instructions for steps it has not reached.

Hook-based injection extends this precision to tool-call boundaries. `gobbi workflow guard` (PreToolUse) evaluates guard conditions and injects `additionalContext` at the moment a tool call is made — not in the ambient prompt, but exactly where the decision point occurs. The SubagentStop capture hook fires when a subagent finishes and records the result automatically, without the orchestrator needing to hold "remember to collect results" in its working context.

The contrast with v0.4.x is mechanical: in v0.4.x, a skill loaded for one step stays in context for all subsequent steps until the window is full or context is compacted. In v0.5.0, each step's prompt is independently compiled from state plus materials — prior steps' skill materials are not carried forward unless they are explicitly relevant to the current step. Skills survive as domain knowledge the CLI incorporates; they do not persist as ambient instructions the orchestrator holds.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | The state machine whose step transitions trigger prompt emission |
| `prompts-as-data.md` | The step specs that get compiled into prompts |
| `token-budget-and-cache.md` | How the assembled prompt is ordered for cache stability |
