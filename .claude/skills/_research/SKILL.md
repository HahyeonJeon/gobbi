---
name: _research
description: Research step of the workflow — researcher agents investigate how to implement the approved plan. MUST load during Step 3 (Research) to guide researcher agents and orchestrator synthesis.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write
---

# Research

After the plan is approved, researcher agents investigate how to implement each task. This skill guides the two researcher stances (innovative and best-practice), what they produce, and how the orchestrator synthesizes their findings into actionable guidance for executor agents.

Research answers "how to do" — ideation answers "what to do" and planning answers "in what order." The output of research is concrete implementation guidance organized by plan task, stored in note files that executors read before starting work.

---

## Core Principles

> **Research answers "How to do" — ideation answers "What to do."**

Research takes the approved plan's tasks and investigates implementation approaches, codebase patterns, external best practices, and technical details. A researcher does not question what to build or whether to build it — those decisions are settled. A researcher finds the best way to build it and documents that guidance for executor agents.

> **Two stances, always both in parallel.**

The orchestrator spawns an innovative researcher and a best-practice researcher for each research task. Both run independently and write separate findings. Neither reads the other's output. The orchestrator synthesizes after both complete. Parallel independent investigation prevents groupthink — each stance explores without being anchored by the other's framing.

> **Research notes are the executor's primary reference.**

Executors read research materials before searching externally. Research should be concrete enough that executors rarely need to re-investigate. Vague research — "consider using a cache" — forces the executor to redo the investigation. Concrete research — "the codebase uses Redis via the CacheManager class in `src/cache/`, with TTL configured per-route in `config/cache.yaml`" — lets the executor act immediately.

> **Results directory for detailed artifacts.**

Beyond the summary notes, researchers save detailed findings — code samples found in the codebase, API documentation excerpts, pattern analysis, comparison tables — in the `research/results/` directory. These artifacts are reference material that the synthesis note and executors can point to without inlining everything.

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

- Read the relevant codebase first — understand what exists before recommending what to add
- Organize findings by plan task — each task in the approved plan gets a section
- Include specific file paths, function names, and patterns — not abstract guidance
- Save detailed artifacts (comparison tables, API excerpts, pattern analysis) to `research/results/`
- Be explicit about confidence level — distinguish "this is proven in the codebase" from "this is my recommendation based on external reading"

---

## What Research Produces

Research writes to the note directory for the current task. The orchestrator initializes the `research/` subdirectory and the `research/results/` directory before spawning researchers.

| File | Author | Contains |
|---|---|---|
| `research/innovative.md` | Innovative researcher | Creative approaches, cross-domain patterns, novel solutions — organized by plan task |
| `research/best.md` | Best-practice researcher | Proven patterns, community standards, official approaches — organized by plan task |
| `research/research.md` | Orchestrator | Synthesis combining both stances into recommended implementation guidance per plan task |
| `research/results/` | Both researchers | Detailed artifacts: code samples found, API documentation excerpts, pattern analysis, comparison tables |
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
- Never produce abstract guidance — "consider caching" is not research; specific patterns, file paths, and implementation details are research
- Never question the plan's scope during research — research investigates how to implement the plan, not whether the plan is correct
- Always organize findings by plan task — unstructured research forces the orchestrator and executors to hunt for relevant information
