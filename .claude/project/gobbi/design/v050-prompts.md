# v0.5.0 Prompts — Compilation Model

Prompt generation reference for v0.5.0. Read this when implementing or reasoning about how the CLI assembles prompts, how cache ordering works, which skills survive as materials versus which become CLI-owned step specs, and how the spec model encodes each workflow step.

---

## The Prompt Compilation Model

> **A prompt is a pure function of workflow state plus materials. The orchestrator cannot see outside what the CLI gives it.**

In v0.4.x, the orchestrator discovers what to do by reading skills. In v0.5.0, the CLI determines what to do by reading workflow state and generates a bounded prompt that tells the orchestrator exactly what this step requires. The orchestrator executes that prompt — it does not deviate, does not skip ahead, and cannot access workflow information outside what the CLI included.

The compilation function has five inputs:

```
prompt = compile(state, artifacts, skills, gotchas, context)
```

| Input | Source | What it contributes |
|-------|--------|---------------------|
| `state` | `state.json` from the active session | Current step, completed steps, eval config, active subagents |
| `artifacts` | Step directories under `.gobbi/sessions/{id}/` | Prior step outputs inlined as context for the current step |
| `skills` | `.claude/skills/` — the surviving domain skills | Domain knowledge injected as materials, not instructions |
| `gotchas` | `.claude/skills/_gotcha/` and `.gobbi/project/gotchas/` | Known failure patterns prepended as guards |
| `context` | `metadata.json` plus project root scan | Project path, config snapshot, tech stack context |

The CLI reads `state.json` first to determine which step is active. It then selects which artifacts are relevant to the current step — an Execution prompt needs Plan artifacts; an Evaluation prompt needs Execution artifacts. It loads the surviving skills that are appropriate for this step and inlines their content as materials. Gotchas are always included. The resulting prompt is the only thing the orchestrator sees.

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Prompt Compilation Pipeline                        │
└─────────────────────────────────────────────────────────────────────┘

  state.json          skills/            gotchas/
      │                   │                  │
      ▼                   ▼                  ▼
  ┌────────────────────────────────────────────┐
  │              CLI Compiler                  │
  │                                            │
  │  1. Determine active step from state       │
  │  2. Select relevant artifacts for step     │
  │  3. Load surviving skills as materials     │
  │  4. Load gotchas as guards                 │
  │  5. Apply cache-aware section ordering     │
  │  6. Apply token budget allocation          │
  │  7. Assemble prompt from spec blocks        │
  └───────────────────────┬────────────────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │   Bounded Prompt     │
               │                      │
               │  Static prefix ──▶  cache hit
               │  Session section     │
               │  Dynamic section     │
               └──────────────────────┘
                          │
                          ▼
                    Orchestrator
                  (sees this step only)
```

---

## Cache-Aware Prompt Ordering

> **Static content first. The cache prefix must be identical across task executions.**

Anthropic prompt caching works on prefix stability: the longer the identical prefix across API calls, the more tokens are served from cache rather than recomputed. The CLI orders prompt sections to maximize prefix stability.

Three sections, ordered by how often they change:

**Static prefix** — Content that is identical across every invocation of this step type, regardless of session or task. This includes the system prompt, project-level rules, CLAUDE.md content, and skill materials that do not vary by session state. The static prefix is the same whether the workflow is on its first run or its tenth feedback loop. Cache hits are the norm here.

**Session section** — Content specific to the active session but stable within it. Workflow state, the evaluation configuration decided at workflow start, the list of completed steps, and session ID. This section changes when the session advances to a new step, but does not change between invocations within the same step. Partial cache hits are possible.

**Dynamic section** — Content that changes on every invocation. Step-specific instructions for the current action, the inlined output of the previous step, delegation target configuration, and any per-invocation variables like timestamps or active subagent counts. No cache benefit expected here; this section is always recomputed.

The order is not negotiable. Placing dynamic content before static content destroys cache prefix stability and causes every invocation to be a full-cost API call. The CLI enforces this ordering when assembling the prompt from spec blocks — no spec can place a conditional or dynamic block before the static blocks.

---

## Skills Boundary

> **The CLI owns all orchestration. Skills own domain knowledge.**

V0.4.x conflated two concerns: skills taught agents both how the workflow runs and what domain knowledge to apply. In v0.5.0 these are separated. Workflow knowledge moves into CLI-owned step specs. Domain knowledge stays in skills as materials the CLI injects.

### Skills That Become Step Specs

These skills encoded orchestration logic — what to do at each step, how to transition, what evaluation means. In v0.5.0, this content lives in the CLI's spec library and is never read directly by the orchestrator.

`_orchestration`, `_discuss`, `_ideation`, `_plan`, `_research`, `_delegation`, `_execution`, `_collection`, `_memorization`, `_note`, `_evaluation`, `_innovation`, `_best-practice`

The content of these skills does not disappear — it is translated into step specs. The difference is ownership: in v0.4.x, the orchestrator discovers and follows these skills; in v0.5.0, the CLI encodes them and presents the result as step instructions.

### Skills That Survive

These skills contain domain knowledge that is not orchestration-specific. They remain as `.claude/skills/` files and the CLI incorporates their content as materials in generated prompts.

| Skill | Domain |
|-------|--------|
| `_gotcha` | Known failure patterns — always injected as guards |
| `_claude` | Documentation standard — injected for doc-authoring steps |
| `_skills` | Skill authoring conventions — injected when writing skill docs |
| `_agents` | Agent authoring conventions — injected when writing agent docs |
| `_rules` | Rule authoring conventions — injected when writing rule files |
| `_project` | Project documentation structure — injected for project doc steps |
| `_git` | Git conventions — injected for steps that involve commits or branching |

The criterion for survival is simple: if the content teaches the agent how to think about a specific domain — not how the workflow operates — it belongs in a skill. If the content teaches the workflow itself, it belongs in the CLI.

### How Skills Become Materials

The CLI does not instruct the orchestrator to "load the `_git` skill." It reads the `_git` skill content itself and inlines the relevant portions directly into the generated prompt. The orchestrator receives the knowledge without needing to know where it came from. This eliminates the discovery problem: the orchestrator cannot forget to load a skill because the CLI already loaded it.

---

## Stances as CLI-Managed Configuration

> **Stances are not discovered by the orchestrator — they are configured by the CLI into the delegation prompt.**

In v0.4.x, the orchestrator reads stance guidance and decides how to apply it. In v0.5.0, the CLI encodes stance configuration directly into the delegation prompt for steps that require parallel agents.

For Ideation steps that include a research loop, the CLI generates separate agent prompts — one configured for the innovative stance (depth-first, divergent, challenges constraints), one for the best-practice stance (proven patterns, reliability, established conventions). The stance configuration is encoded in the spec's delegation blocks, not decided at runtime.

For Evaluation steps, each evaluator receives a prompt configured for its assigned perspective. The perspective assignment is part of the CLI's evaluation step spec. The orchestrator does not select evaluators — it receives a delegation block that lists them with their configured perspectives already set.

Domain-specific stances — project-specific evaluation perspectives, specialist agents for a particular tech stack — remain as skills. The CLI guides loading these during delegation: the delegation blocks in the spec include a slot for domain-specific stance materials, and the CLI fills that slot from the appropriate project skill if one exists.

---

## Fresh Context Per Task

> **Each subagent receives exactly the context its task requires. No more.**

Prior steps' accumulated conversation context is never passed directly to a subagent. The CLI assembles a delegation prompt with specifically selected artifacts — the subset of prior step output that is actually needed for this task. A subagent working on an execution subtask receives the plan artifact for its subtask, the relevant gotchas, and its step instructions. It does not receive the Ideation conversation, prior execution attempts, or evaluation transcripts from earlier in the session.

This boundary has two benefits. First, it prevents context contamination: a subagent executing subtask 3 cannot be distracted by the details of subtasks 1 and 2. Second, it keeps delegation prompts small and their static prefix stable, which preserves cache efficiency even across multiple delegations in the same step.

Artifacts written by subagents to their step directories are available to the CLI for the next compilation cycle. The CLI decides which of those artifacts to include in subsequent prompts — the subagent does not decide what gets forwarded.

---

## Token Budget Awareness

> **The CLI allocates token budget across sections before rendering. Truncation is at section boundaries, never mid-content.**

Each model variant has a fixed context window. The CLI knows the model configured for the session (from `metadata.json`) and computes the available budget before assembling the prompt. Budget is allocated across sections in priority order: static prefix first (it must be complete to preserve cache stability), then gotchas (safety guards must never be truncated), then step instructions, then inlined artifacts, then supplementary materials.

When the available budget is smaller than the sum of all sections, the CLI truncates artifact content at section boundaries. An artifact is included in full or excluded entirely — it is never truncated mid-document. This produces a prompt that is complete and coherent rather than one that ends mid-sentence because the window ran out.

The allocation proportions are configurable per step type. Evaluation steps allocate more budget to inlined execution artifacts. Delegation steps allocate more budget to the delegation block. The defaults are encoded in the `tokenBudget` section of each step's spec.

---

## Step Specs

> **Each workflow step is defined by a spec file. The spec is the step — not a template the CLI fills in.**

The CLI encodes each workflow step as a `spec.json` file under `packages/cli/src/specs/`. There is one spec per step. Specs contain only static instructional content — no variables, no template engine, no mustache syntax. All dynamic data (session context, inlined artifacts, skill content) is added programmatically by the CLI in TypeScript. The spec describes what the step does; the CLI decides what data to supply.

### Spec Schema

Each `spec.json` contains five top-level sections:

**`meta`** — Step-level metadata: a short description, the list of valid substates (if any), allowed agent types, maximum parallel agent count, required and optional skills to inject, expected artifacts from this step, and the completion signal the CLI watches for.

**`transitions`** — The valid exit transitions from this step. For steps where the exit depends on runtime conditions (such as whether evaluation is enabled), transition entries may carry JsonLogic conditions. The CLI evaluates these conditions in TypeScript against `state.json`; the spec only declares what the possible transitions are and under what conditions each is taken.

**`delegation`** — The agent topology for this step: each agent's role, stance, model tier, effort level, which skills to inject, the artifact target it should write to, and a reference to the block in `blocks.delegation` that contains its prompt content.

**`tokenBudget`** — Allocation proportions across the five prompt sections: static prefix, session, instructions, artifacts, and materials. Evaluation steps allocate more to inlined artifacts; delegation steps allocate more to the delegation block. These proportions are the defaults the CLI uses unless session config overrides them.

**`blocks`** — The static instructional content for this step, organized into five subsections:

| Subsection | Purpose |
|------------|---------|
| `static` | Always-included blocks — role description, core principles, shared references |
| `conditional` | Blocks the CLI includes or excludes based on state — loop-back context, eval reminders. The conditions are evaluated in TypeScript; each block carries only an ID the TypeScript code matches on |
| `delegation` | Per-agent delegation prompt content, keyed by the agent reference in `delegation` |
| `synthesis` | Post-delegation synthesis instructions for the orchestrator |
| `completion` | The completion instruction and a human-readable criteria list |

### Workflow Graph

`index.json` at the root of `packages/cli/src/specs/` encodes the full workflow graph: all steps, their transitions, and guard conditions. This file enables `gobbi workflow validate` to perform static analysis — dead step detection, cycle validation, and reference resolution checks — without running the workflow.

### Shared Blocks

Reusable content blocks (scope boundary warning, gotcha preamble, system prompt) live in `_shared/` under the specs directory. Spec files reference shared blocks by ID. The CLI resolves these references at compile time before assembling the prompt. Each shared block is defined once; changes propagate to all specs that reference it.

### Substate Overlays

Steps with substates — Ideation has `discussing` and `researching` — use overlay files rather than separate full specs. An overlay patches a base spec with substate-specific modifications using a Kustomize-style pattern: base plus targeted patches, not full duplication. The CLI loads the base spec and applies the overlay for the active substate before assembling the prompt.

### Schema Versioning

Every spec file carries `$schema` and `version` fields. When the CLI loads a spec whose version is behind the current schema, it applies the migration chain before using the spec. This allows the spec format to evolve without requiring all files to be updated simultaneously.

### Why This Model

> **Adding a workflow step means adding a spec file — no TypeScript modification required for content changes.**

The spec model provides four concrete benefits. Guards (`gobbi workflow validate`) can validate structured delegation data without parsing prose. The `SubagentStop` hook knows expected artifacts from the spec's `delegation` config without introspecting the conversation. Static analysis at build time catches structural errors — missing transitions, broken refs, unreachable steps — before they reach runtime. Cache-aware ordering is enforced by the spec schema: `static` blocks always come before `conditional` blocks, which always come before `delegation` blocks, which preserves the static prefix guarantee described in the Cache-Aware Prompt Ordering section above.

---

## Boundaries

This document covers the prompt compilation model, cache-aware section ordering, the skills boundary between CLI-owned step specs and surviving domain skills, stances as CLI-managed configuration, fresh context isolation per subagent task, token budget allocation, and the step spec model including the spec schema, workflow graph, shared blocks, substate overlays, and schema versioning.

For how state transitions determine which step is active, see `v050-state-machine.md`. For how hooks write events that the CLI reads to derive state, see `v050-hooks.md`. For the session artifacts that prompts consume, see `v050-session.md`. For CLI command syntax and distribution, see `v050-cli.md`.
