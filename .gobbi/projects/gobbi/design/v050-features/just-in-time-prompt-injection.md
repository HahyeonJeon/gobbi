# Just-in-Time Prompt Injection

Feature description for gobbi's prompt timing model. Read this to understand when prompts are emitted, why skills are no longer always-loaded, and how hook-based injection keeps context bounded.

---

> **Prompts arrive at the moment of need. A step that hasn't started yet contributes no tokens to the current context.**

In v0.4.x, skills are always-loaded: every session starts with the full skill library in context, regardless of which workflow step is active. An execution step carries ideation guidance; an evaluation step carries planning guidance. Context grows toward the limit and agents are distracted by knowledge that is not relevant to the current task.

V0.5.0 replaces always-loading with just-in-time emission. A CLI command (name TBD — CLI is being redesigned) that compiles the prompt for the active step only — reading workflow state, selecting the step spec, loading the skill materials relevant to this specific step (drawn from the JSON source at `.gobbi/skills/` — the same source the render pipeline uses to produce `.claude/skills/`), and delivering a bounded prompt. The orchestrator sees what this step needs. It does not see workflow instructions for steps it has not reached.

Hook-based injection extends this precision to tool-call boundaries. A PreToolUse hook handler (CLI command name TBD) evaluates guard conditions and injects `additionalContext` at the moment a tool call is made — not in the ambient prompt, but exactly where the decision point occurs. The SubagentStop capture hook fires when a subagent finishes and writes its transcript and final output into the active step's `rawdata/` directory (see `gobbi-memory.md`), without the orchestrator needing to hold "remember to collect results" in its working context.

The compiled prompt for a step contains only what that step needs: the step-specific instructions, gotchas relevant to the step's concerns, any skill excerpts the step spec names as materials, the delegation topology if the step spawns subagents (which agents, which stances, which artifacts they write), and the current workflow state. Every other piece of the workflow — the instructions for other steps, materials those steps need, prior agents' working notes — stays out.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | The state machine whose step transitions trigger prompt emission |
| `prompts-as-data.md` | The step specs that get compiled into prompts |
| `token-budget-and-cache.md` | How the assembled prompt is ordered for cache stability |
