# v0.5.0 Prompts — Compilation Model

Prompt generation reference for v0.5.0. Read this when implementing or reasoning about how the CLI assembles prompts, how cache ordering works, which skills survive as materials versus which become CLI-owned templates, and the open decision on template format.

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
  │  7. Render template with interpolated vars │
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

The order is not negotiable. Placing dynamic content before static content destroys cache prefix stability and causes every invocation to be a full-cost API call. The CLI enforces this ordering at the template rendering stage — no template can place a dynamic variable inside the static prefix section.

---

## Skills Boundary

> **The CLI owns all orchestration. Skills own domain knowledge.**

V0.4.x conflated two concerns: skills taught agents both how the workflow runs and what domain knowledge to apply. In v0.5.0 these are separated. Workflow knowledge moves into CLI-owned prompt templates. Domain knowledge stays in skills as materials the CLI injects.

### Skills That Become CLI Prompts

These skills encoded orchestration logic — what to do at each step, how to transition, what evaluation means. In v0.5.0, this content lives in the CLI's template library and is never read directly by the orchestrator.

`_orchestration`, `_discuss`, `_ideation`, `_plan`, `_research`, `_delegation`, `_execution`, `_collection`, `_memorization`, `_note`, `_evaluation`, `_innovation`, `_best-practice`

The content of these skills does not disappear — it is translated into prompt templates. The difference is ownership: in v0.4.x, the orchestrator discovers and follows these skills; in v0.5.0, the CLI encodes them and presents the result as step instructions.

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

For Ideation steps that include a research loop, the CLI generates separate agent prompts — one configured for the innovative stance (depth-first, divergent, challenges constraints), one for the best-practice stance (proven patterns, reliability, established conventions). The stance configuration is part of the template, not a runtime decision.

For Evaluation steps, each evaluator receives a prompt configured for its assigned perspective. The perspective assignment is part of the CLI's evaluation template. The orchestrator does not select evaluators — it receives a delegation block that lists them with their configured perspectives already set.

Domain-specific stances — project-specific evaluation perspectives, specialist agents for a particular tech stack — remain as skills. The CLI guides loading these during delegation: the delegation prompt template includes a slot for domain-specific stance materials, and the CLI fills that slot from the appropriate project skill if one exists.

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

The allocation proportions are configurable per step type. Evaluation steps allocate more budget to inlined execution artifacts. Delegation steps allocate more budget to the delegation block. The defaults are encoded in the template definition for each step.

---

## Template Format — Decision Space (Open)

> **The template format is an open architectural decision. The constraints are fixed; the implementation is not.**

The CLI needs a template format that can express 20-30 prompts for v0.5.0, potentially scaling to 100+ prompts across workflow steps, domain variants, and stance configurations. The format must satisfy four constraints:

**Constraint 1 — Conditional sections**: A template must be able to include or exclude blocks based on session state. Evaluation instructions appear only when `evalConfig` enables evaluation for this step. Gotcha loading appears only when the gotcha file is non-empty. These conditions are known at compile time from `state.json`.

**Constraint 2 — Variable interpolation**: Templates reference session variables — session ID, step name, active step count, inlined artifact content. Interpolation must handle multi-line content (artifact body) without breaking the surrounding structure.

**Constraint 3 — Shared blocks**: Some blocks appear across many templates — the scope boundary warning, the gotcha preamble, the "write artifacts to step directory" instruction. These must be defined once and referenced, not duplicated across templates.

**Constraint 4 — Maintainability at scale**: At 100+ templates, a format that requires reading TypeScript to understand a template's structure creates maintenance cost. Templates should be readable as documents, not as data structures that require a runtime to interpret.

### The Options

**Option A — PAL (Prompt Assembly Language)**: JSON block arrays where each block carries a `type`, optional `condition` expressed in JsonLogic, content with mustache-style `{{vars}}`, and optional `ref` for shared blocks. The CLI evaluates conditions against `state.json`, resolves refs from a shared library, and renders blocks in order. The template is fully declarative — all logic is expressed in data. The cost is that JsonLogic conditions are verbose and the block array structure obscures the narrative flow of the prompt.

**Option B — Simple JSON plus CLI logic**: Flat JSON objects with `{{vars}}` for interpolation. All conditional logic lives in TypeScript — the CLI decides which JSON objects to include based on state, assembles them into a string, and interpolates variables. The template is simple to read but the conditional behavior requires reading TypeScript to understand. At scale, the TypeScript accumulates complexity as each new conditional is added.

**Option C — Hybrid (JSON manifest plus content files)**: A JSON manifest defines the template structure — section order, which sections are conditional, variable names, shared block references. Long text blocks are stored in separate `.md` or `.txt` files referenced by the manifest. The manifest is readable; the prose is readable; the CLI wires them together. The cost is indirection — understanding a template requires reading both the manifest and its referenced files.

All three options satisfy constraints 1 and 2. Options A and C satisfy constraint 3 natively (refs and shared files); Option B requires TypeScript-managed shared blocks. Options B and C satisfy constraint 4 more readily than Option A at high template counts.

This decision is documented here as a design constraint, not a final choice. The implementation must select one option and apply it consistently across all prompt templates in the CLI. The selection should be made once and recorded in this document before implementation begins.

---

## Boundaries

This document covers the prompt compilation model, cache-aware section ordering, the skills boundary between CLI-owned templates and surviving domain skills, stances as CLI-managed configuration, fresh context isolation per subagent task, token budget allocation, and the open template format decision.

For how state transitions determine which step is active, see `v050-state-machine.md`. For how hooks write events that the CLI reads to derive state, see `v050-hooks.md`. For the session artifacts that prompts consume, see `v050-session.md`. For CLI command syntax and distribution, see `v050-cli.md`.
