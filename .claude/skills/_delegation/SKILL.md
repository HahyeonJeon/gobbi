---
name: _delegation
description: Hand off work to subagents with the right context so they succeed on the first attempt. Use during Step 4 (Execution) to spawn specialists with clear briefings, context layers, and scope boundaries.
allowed-tools: Agent, Read, Grep, Glob, Bash, Write
---

# Delegation Skill

Hand off work to subagents so they succeed on the first attempt. Load this skill when entering Step 4 (Execution) of orchestration.

---

## Core Principle

> **Tell specialists what to do, not how to do it.**

Detailed "how" instructions suppress a specialist agent's ability and potential. Define the goal, the constraints, and what to avoid — then trust the specialist to find the best approach. Guardrails about "not to do" protect quality; prescriptive "how to do" limits it.

> **Promote the specialist's potential.**

Frame the delegation to bring out the specialist's strengths. Provide context that enables good judgment — project rules, gotchas, conventions, relevant domain knowledge. The orchestrator's job is to set the specialist up for success, not to micromanage the execution.

> **Load `_claude`, the project skill, and domain skills before every task.**

Agents that read project context produce work that integrates cleanly. Agents that skip context produce work that needs rework.

> **Require an internal plan before coding.**

Tell subagents to study context, outline their approach, then execute. Agents that plan before coding produce better-structured, more focused work.

> **Subtask records are collected from transcripts, not written by subagents.**

The orchestrator runs `gobbi note collect` after each subagent returns to extract the delegation prompt and final result from the JSONL transcript. Subagents do not need subtask doc instructions in their briefing — their final response is the record.

---

## What Every Delegation Prompt Needs

### The task

What to build, fix, or change. Be specific about the deliverable, not the method. Include acceptance criteria when the task is ambiguous.

### The context to load

Every subagent needs three layers of context:

**Always load (non-negotiable):**

- `_claude` skill — docs structure, anti-patterns, navigation standard
- The project skill — project architecture, conventions, constraints
- Gotchas — MUST check `_gotcha` and the project skill's `gotchas/` before starting work

**Load per stance (PI and Researcher agents):**

- `_innovation` — load when spawning the innovative stance. Defines how the agent thinks creatively, challenges conventions, and explores cross-domain patterns.
- `_best-practice` — load when spawning the best-practice stance. Defines how the agent follows proven patterns, cites documentation, and applies community standards.
- Project-specific stance skills — if the project has its own `_innovation` or `_best-practice` skill, load it alongside gobbi's version. Project skills supplement, not replace.

**Load per domain:**

- Domain skills relevant to the task — the plan specifies which skills each task needs
- Project rules relevant to the domain

**Load when available:**

- Project docs in the project skill directory — architecture, reference, review docs
- Existing code in the area they'll modify — the codebase is the source of truth for patterns
- Research materials from the `research/` subdirectory — when delegating execution tasks after Step 3 (Research), include the path to the `research/` directory so executors can read it during their Study phase. Research materials are guidance, not prescriptions — executors use them to make better-informed decisions but are not bound by the researchers' conclusions

**Load when _git is active:**

- Current branch and worktree path — so the subagent knows where it's working and can verify branch state before committing
- Recent commit history relevant to the task area — files the task will modify, so the subagent understands what has already changed in this session
- Exploration findings from multi-perspective exploration — when exploration was performed before planning, include the synthesized findings for orientation

### The scope boundary

What the agent should NOT touch. Agents expand scope when they see adjacent improvements. Explicit boundaries prevent drift.

### Dependencies

If this agent's work depends on another agent's output, or if another agent will consume this output, state the interface expectation.

---

## The Agent Lifecycle in Delegation

Every agent follows: **Study → Plan → Execute → Verify**. Your delegation prompt sets each phase up for success.

**Study** — List what to read: `_claude` skill, project skill, domain skills, gotchas, relevant code. The more unfamiliar the area, the more explicit the reading list.

**Plan** — Tell the agent to outline their approach before implementing. Mandatory for non-trivial tasks.

**Execute** — The task itself. Be specific about the deliverable. When a subagent makes a non-obvious choice — where multiple valid approaches existed — their final response should include a brief decision annotation: what was chosen, what was rejected, and why. This externalizes reasoning at decision time, when the context is fresh. The transcript captures the final response automatically.

**Verify** — Remind agents to check their work didn't break other things and that any `.claude/` docs referencing changed code are updated.

---

## Model Selection

> **Innovative stance always gets opus. Evaluators and reviewers get sonnet. All agents run at max effort.**

Creative and implementation work demands deep reasoning — opus handles ambiguity, novelty, and quality. Assessment work (evaluation and review) follows structured criteria — sonnet handles this reliably. The orchestrator uses the Agent tool's `model` parameter to set the model at spawn time.

| Agent | Stance | Model | Rationale |
|---|---|---|---|
| `__pi` | innovative | opus | Deep creative thinking, unconventional approaches |
| `__pi` | best | opus | Deep reasoning about established patterns |
| `__researcher` | innovative | opus | Creative research across domains |
| `__researcher` | best | opus | Thorough best-practice investigation |
| `_agent-evaluator` | — | sonnet | Structured assessment against criteria |
| `_skills-evaluator` | — | sonnet | Structured assessment against criteria |
| `_project-evaluator` | — | sonnet | Structured assessment against criteria |
| `__executor` | — | opus | Implementation quality requires strong reasoning |
| `gobbi-agent` | — | opus | Documentation quality requires strong reasoning |

> **All review tasks use sonnet — override via the Agent tool's `model` parameter.**

Review is assessment, not creation. When the orchestrator spawns any subagent for a review task — Step 7 Review, code review, PR review, or any other assessment delegation — set `model: "sonnet"` in the Agent tool call. This applies even to agents that default to opus (like `__pi`). The Agent tool's `model` parameter overrides the agent definition's default for that specific invocation. Review at sonnet with max effort provides rigorous assessment without opus cost.

> **Model tiers and capabilities evolve — these are current guidelines, not permanent assignments.**

---

## Judgment Calls

**Specificity vs autonomy** — Over-specified prompts produce rigid work. Under-specified prompts miss requirements. Calibrate based on how well-defined the task is.

**When to include code references** — If the agent needs to follow an existing pattern, point to the reference files. The codebase is the source of truth.

**When to split vs combine** — If two subtasks need the same agent, same context, and same files, combine them.

**When to emphasize lifecycle phases** — Spell out Study for unfamiliar areas. Spell out Plan for non-trivial tasks. Spell out Verify for shared interfaces.

**When to include exploration context** — If the plan was preceded by multi-perspective exploration, include the synthesized findings in every delegation prompt. Exploration findings are context, not constraints — the subagent uses them to make better-informed decisions but is not bound by the explorers' conclusions. If no exploration was performed, the subagent discovers context during Study as usual.

**When to include pre-resolved decisions** — When contribution points were resolved during ideation (via _ideation's contribution-point mechanism), encode those resolutions as explicit constraints in the delegation prompt. This differs from scope boundaries: scope says what not to touch; pre-resolved decisions say which implementation choices the user has already made and the subagent must honor. A subagent that re-opens a settled decision wastes context and risks contradicting the user's intent.

---

## Agent Roster

The orchestrator delegates to these agent types. Each has a distinct role in the workflow — understanding their boundaries prevents misrouting.

| Agent | Role | When to use | Model |
|---|---|---|---|
| `__pi` | "What to do" — ideation, review, creative assessment | Step 1 (Ideation) and Step 7 (Review). Spawned in parallel with innovative + best stances. | Opus |
| `__researcher` | "What approach to take" — directional research, best references, architectural guidance | Step 3 (Research). Spawned in parallel with innovative + best stances. Writes findings to `research/` subdirectory. | Opus |
| `_agent-evaluator` | Structured assessment — evaluates agent output against criteria | After creative or execution steps when evaluation is requested. | Sonnet |
| `_skills-evaluator` | Structured assessment — evaluates skill documentation quality | After skill authoring when evaluation is requested. | Sonnet |
| `_project-evaluator` | Structured assessment — evaluates project alignment and conventions | After any step when project-perspective evaluation is requested. | Sonnet |
| `__executor` | "Do it" — code implementation, file changes, concrete deliverables | Step 4 (Execution). Reads research for direction, then implements with engineering judgment. Commits verified work. | Opus |
| `gobbi-agent` | Claude Code specialist — `.claude/` documentation, skills, agents, rules, hooks | Step 4 (Execution) for any subtask involving `.claude/` configuration. Loaded with _claude, _skills, _agents, _rules as needed. | Opus |

Creative agents (PI, researcher) and implementation agents (executor, gobbi-agent) run at opus. Evaluators run at sonnet — they follow structured criteria, not creative reasoning. See Model Selection for the full assignment table.

---

## Research Step Delegation

Step 3 (Research) delegates to `__researcher` agents. Research happens after the plan is approved and before execution begins. The goal is to investigate "how to do" so executors can implement with confidence.

> **Spawn two researchers in parallel — innovative and best stances.**

Each researcher receives the same research brief but with a different stance directive. The innovative researcher explores creative approaches, cross-domain patterns, and unconventional solutions. The best researcher investigates proven patterns, official documentation, and community consensus. Both write their findings independently.

> **The delegation prompt specifies the stance.**

Include a clear stance directive in each researcher's prompt: "Your stance is **innovative**" or "Your stance is **best**." The stance shapes which sources they prioritize, what patterns they surface, and what they recommend. Do not mix stances in a single prompt.

> **Research prompts need the approved plan, not the raw idea.**

Researchers need the decomposed plan from Step 2 — specific tasks, files affected, constraints, and acceptance criteria. The plan is their research scope. Include the path to `plan/` so they can read the full plan, not just a summary in the delegation prompt.

**What a researcher delegation prompt needs:**

- The approved plan — path to the `plan/` subdirectory or the plan content itself
- The stance skill — `_innovation` for innovative stance, `_best-practice` for best stance
- The stance directive — innovative or best
- The research scope — which parts of the plan need investigation (may be the full plan or specific tasks)
- The output location — path to the `research/` subdirectory where findings should be written
- Context to load — project skill, `_gotcha`, `_research`, domain skills relevant to the investigation
- What executors need to know — frame the research around executor readiness: "what does the executor need to know to implement this correctly?"

**After both researchers complete:**

- Run `subtask-collect.sh` with the `research` phase argument to extract each researcher's output from their transcript
- Read both researcher outputs — `research/innovative.md` and `research/best.md`
- Synthesize into `research/research.md` — merge the strongest findings from both stances, resolve contradictions, and produce a unified set of implementation guidance
- Optionally evaluate the research quality before proceeding to execution

---

## Subtask Collection Phases

The orchestrator runs `subtask-collect.sh` after each subagent completes to extract the delegation prompt and final result from the JSONL transcript. The phase argument determines which `subtasks/` subdirectory receives the output.

| Phase argument | Used after | Writes to |
|---|---|---|
| `research` | Step 3 — after each researcher completes | `research/subtasks/{NN}-{slug}.json` |
| `execution` | Step 4 — after each executor completes | `execution/subtasks/{NN}-{slug}.json` |

Always run `subtask-collect.sh` immediately after each subagent wave completes — before launching synthesis, evaluation, or any downstream agent that depends on the output. Subtask JSON files on disk are the handoff mechanism between agents. An agent that reads from disk gets the full output; an agent that receives a summary in its prompt gets a lossy approximation.
