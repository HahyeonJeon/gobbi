---
name: _research
description: Research step of the workflow — researcher agents investigate how to implement the approved plan. MUST load during Step 3 (Research) to guide researcher agents and orchestrator synthesis.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write
---

# Research

After the plan is approved, researcher agents investigate the best approach for each task. This skill guides the two researcher stances (innovative and best-practice), what they produce, and how the orchestrator synthesizes their findings into directional guidance for executor agents.

Research answers "what approach to take and why" — ideation answers "what to do" and planning answers "in what order." Think of researchers as architects sketching a blueprint: they design the direction and gather the best references, but executors own the implementation details. The output of research is directional guidance with strong references, organized by plan task, stored in note files that executors read before starting work.

---

## Core Principles

> **Research provides direction and references — not implementation recipes.**

Research takes the approved plan's tasks and investigates the best approach: which patterns to follow, which references matter, what the architectural direction should be. A researcher does not question what to build or whether to build it — those decisions are settled. A researcher designs the strategic direction and gathers the strongest references so executors know which approach to take. Executors own the implementation details — how to write the code, structure the files, and handle edge cases.

> **Two stances, always both in parallel.**

The orchestrator spawns an innovative researcher and a best-practice researcher for each research task. Both run independently and write separate findings. Neither reads the other's output. The orchestrator synthesizes after both complete. Parallel independent investigation prevents groupthink — each stance explores without being anchored by the other's framing.

> **Best references are the researcher's primary deliverable.**

Find and document the most relevant codebase patterns, external documentation, API references, proven examples, and community standards. Research should be reference-rich — specific file paths, function names, documentation links, code snippets from the codebase. Vague research — "consider using a cache" — forces the executor to redo the investigation. Strong research — "the codebase uses Redis via the CacheManager class in `src/cache/`, with TTL configured per-route in `config/cache.yaml`; see Redis docs on eviction policies" — gives the executor both direction and references to work from.

> **Strategic guidance, not tactical recipes.**

Think big picture: what approach to take, which architectural decisions to make, what trade-offs exist. Do not produce step-by-step implementation instructions like "write this code at line 42." Executors are skilled engineers — they need to know the direction and the why, then they figure out the best way to implement it. Research that micromanages implementation suppresses the executor's engineering judgment.

> **Results directory for detailed reference materials.**

Beyond the summary notes, researchers save detailed findings — relevant code snippets found in the codebase, API documentation excerpts, comparison tables, pattern analysis — in the `research/results/` directory. These are reference materials that the synthesis note and executors can draw on.

---

## Stance Mechanics

### Innovative Stance

Looks beyond established patterns. Cross-domain inspiration, novel architectures, creative combinations. May propose approaches that have not been tried in this codebase. The innovative researcher's value is in surfacing options the team would not have considered — not in being contrarian for its own sake.

- Search for analogous problems in other domains and how they were solved
- Explore emerging patterns, libraries, or techniques that fit the problem
- Challenge whether the obvious implementation path is actually the best one
- Document trade-offs honestly — innovation that sacrifices reliability needs to say so

### Best-Practice Stance

Follows established patterns. Official documentation, community best practices, proven solutions. The best-practice researcher's value is in finding the safest, most maintainable path — the approach that will still make sense to the team six months from now.

- Search the codebase for existing patterns that solve similar problems
- Consult official documentation and community-standard approaches
- Identify conventions the codebase already follows and ensure recommendations align
- Prioritize reliability and maintainability over novelty — proven patterns reduce risk

### Both Stances

Both stances share a common investigation discipline regardless of their perspective:

- Read the relevant codebase first — understand what exists before recommending an approach
- Organize findings by plan task — each task in the approved plan gets a section
- Include specific file paths, function names, documentation links, and patterns — references are your primary deliverable
- Focus on approach direction and trade-offs, not step-by-step implementation — executors own the implementation details
- Save detailed reference materials (comparison tables, API excerpts, code snippets found, pattern analysis) to `research/results/`
- Be explicit about confidence level — distinguish "this is proven in the codebase" from "this is my recommendation based on external reading"

---

## What Research Produces

Research writes to the note directory for the current task. The orchestrator initializes the `research/` subdirectory and the `research/results/` directory before spawning researchers.

| File | Author | Contains |
|---|---|---|
| `research/innovative.md` | Innovative researcher | Approach direction, architectural ideas, cross-domain patterns, trade-off analysis — organized by plan task |
| `research/best.md` | Best-practice researcher | Approach direction, proven patterns, community standards, key references — organized by plan task |
| `research/research.md` | Orchestrator | Recommended direction per plan task with cited references — which approach to take and why, not how to code it |
| `research/results/` | Both researchers | Reference materials: relevant code snippets from the codebase, API documentation excerpts, comparison tables, pattern analysis |
| `research/subtasks/01-{slug}.json` | Post-hook | Subtask records extracted from researcher transcripts |

---

## When to Research

Research is Step 3 — after Plan approval (Step 2 complete), before Execution (Step 4).

- **Always research** for non-trivial tasks — any task that involves design decisions, unfamiliar code areas, or multiple possible implementation approaches
- **Skip research** for structured routines where the execution pattern is fully known — applying a well-documented migration, running a standard release process, or following a step-by-step procedure that has been done before
- **Partial research** when some plan tasks need investigation and others do not — the orchestrator selects which tasks to research rather than running blanket investigation

---

## Orchestrator Synthesis

After both researcher agents complete, the orchestrator reads `innovative.md` and `best.md` and writes `research.md`. The synthesis is not a merge — it is a judgment call that draws from both stances to produce the best implementation guidance.

- Organize by plan task — each task in the approved plan gets a section in `research.md` with the relevant findings
- For each task, state the recommended approach and which stance it draws from
- When stances conflict, explain the trade-off and choose — do not present both as equal options for the executor to decide
- Include key codebase patterns to follow, with specific file paths and function names
- Include external references where they add value — documentation links, relevant articles
- Flag any research gaps — areas where neither stance produced confident guidance and the executor may need to investigate further

> **The synthesis resolves conflicts — it does not defer them to executors.**

When the innovative and best-practice stances disagree, the orchestrator must choose a direction and explain why. Passing unresolved conflicts to executors defeats the purpose of research — executors should receive clear guidance, not a menu of competing options to evaluate on top of their implementation work.

---

## Constraints

- Never skip codebase investigation — reading external sources without understanding existing patterns produces guidance that conflicts with the project
- Never let one stance read the other's output before completing — independence is what makes the dual-stance valuable
- Never produce abstract guidance — "consider caching" is not research; specific references, file paths, and directional analysis are research
- Never produce step-by-step implementation recipes — research provides direction and references, not code-level instructions for executors to follow mechanically
- Never question the plan's scope during research — research investigates which approach to take for the plan, not whether the plan is correct
- Always organize findings by plan task — unstructured research forces the orchestrator and executors to hunt for relevant information
- Always verify that output contains direction and references, not a detailed implementation recipe — if an executor could implement by copying your instructions line by line, you've gone too far
