---
name: _ideation
description: Structured idea refinement through discussion. MUST load at the start of the Ideation step.
allowed-tools: AskUserQuestion, Read, Grep, Glob, Bash
---

# Gobbi Ideation Skill

Improve and make the user's idea or prompt more detailed through structured discussion. This skill provides discussion points that help the agent challenge vague thinking, uncover hidden requirements, and refine a rough idea into a concrete, fully specified proposal ready for evaluation.

The output of ideation is a detailed, improved idea — not a final decision. A separate evaluator assesses the result.

Ideation is performed by two parallel PI agents, each operating with a different stance — innovative and best. The orchestrator discusses with the user first, then spawns both PI agents. Each PI agent writes its perspective independently, and the orchestrator synthesizes their outputs.



---

## PI Stances

The orchestrator spawns two PI agents in parallel during Ideation, each with a different stance. Discussion with the user happens before the PI agents are spawned — the orchestrator explores the approach, alternatives, and trade-offs first, then delegates to both stances with the refined context.

### Innovative Stance

Deep thinking, creative ideas, cross-domain inspiration. Challenges established patterns and asks "What if we did it completely differently?" Explores unconventional solutions, draws from adjacent domains, and questions whether the standard approach is actually the best one. Pushes boundaries while staying grounded in feasibility.

Writes output to `innovative.md` in the `ideation/` subdirectory.

### Best Stance

Best-practice focused, proven patterns, industry standards. Asks "What has worked well for others?" Researches established solutions, references industry standards, and identifies proven patterns that apply. Anchors to what works reliably and explains why.

Writes output to `best.md` in the `ideation/` subdirectory.

### Synthesis

After both PI agents complete, the orchestrator synthesizes their outputs into `ideation.md` — merging the strongest elements from both stances, resolving conflicts, and producing a single refined idea. The synthesis is the primary ideation output that proceeds to evaluation and planning.

---

## Core Principles

> **Discuss first. Use AskUserQuestion to understand and refine the user's idea.**

The user has an idea. Your job is to make it better through discussion. Ask questions that expose what's vague, what's missing, and what could be stronger. Every question should either clarify the idea or push it toward more detail.

> **Challenge assumptions, not the user.**

Every idea embeds assumptions — about the problem, the constraints, the approach, the technology. Surface these assumptions explicitly and question each one respectfully. Use inversion: "What would make this fail?" Use reframing: "What if the real problem is actually X?" The user's framing may not be the best framing, but the user's intent is always the anchor.

> **Push from vague to concrete. Abstract ideas can't be evaluated or planned.**

"Make it faster" is a wish. "Reduce P95 latency on the /search endpoint from 800ms to 200ms by adding a Redis cache layer in front of the Postgres full-text search" is an idea. Every round of discussion should move the idea closer to this level of specificity — mechanisms, interfaces, data flows, measurable criteria.

> **Explore alternatives to strengthen, not to replace.**

Generating alternative approaches isn't about picking a winner — it's about stress-testing the idea. If the user's idea survives comparison against alternatives, it's stronger. If an alternative reveals a weakness, that weakness gets addressed. Alternatives serve the idea.

> **Make trade-offs visible. Every choice has costs.**

When the idea involves a choice between approaches, don't present one as "clearly best." State what each option optimizes, what it sacrifices, and what it assumes. The user decides which trade-offs are acceptable — your job is to make the trade-offs visible.

---

## Discussion Points

Use these as a menu of discussion topics to raise with the user via AskUserQuestion. Not every idea needs every point — pick the ones that address what's vague or missing in this specific idea.

### Understanding the Problem

- **Root cause** — Is the stated problem the real problem, or a symptom? Ask "why" repeatedly until you reach the root. "We need caching" → why? → DB is slow → why? → queries unoptimized. The idea might need to shift.
- **Impact** — Who is affected? How severely? What happens if we do nothing? This calibrates how much effort and complexity the idea justifies.
- **Prior attempts** — What's been tried before? What worked, what didn't, and why? Avoids repeating past failures.
- **Success criteria** — How will we know the idea worked? Define measurable criteria before refining the approach, so discussion stays grounded.

### Mapping Constraints

- **Hard constraints** — Non-negotiable boundaries (tech stack, compatibility, regulatory, performance thresholds). These shape the idea's boundaries.
- **Soft constraints** — Preferences that could be traded away if the gain is worth it (timeline, team familiarity, consistency with patterns).
- **Assumed constraints** — Constraints taken for granted that may not be real. Challenge each: "Where did this come from? Is it still valid? What opens up if we remove it?"
- **Dependencies** — What does this depend on? What depends on this? External systems, team bandwidth, parallel work.

### Deepening the Idea

- **First principles** — Strip away the current approach. What are the fundamental requirements? If you built from scratch, what would you do? This reveals whether the idea is optimizing the right thing.
- **Inversion / pre-mortem** — Imagine the idea has been implemented and failed. What went wrong? Turn each failure mode into a requirement the idea must address.
- **Analogy** — Has a similar problem been solved in a different domain? Adapt proven patterns. Cross-domain solutions often reveal approaches that domain insiders overlook.
- **SCAMPER** — Systematically probe the idea: Could we substitute a component? Combine two steps? Eliminate a layer? Reverse a flow? Each probe either strengthens the current idea or reveals an improvement.
- **Constraint removal** — Temporarily remove each hard constraint. What becomes possible? Then selectively reintroduce. Sometimes a "hard" constraint is actually negotiable, and removing it dramatically simplifies the idea.

### Making It Concrete

- **Mechanism** — How does it actually work? What's the data flow? What are the key interfaces?
- **Scope boundary** — What's included and what's explicitly not? Where does this idea end?
- **Edge cases** — What happens with empty inputs, maximum load, concurrent access, failures? Which edge cases must the idea handle vs. which are out of scope?
- **Risks** — What could go wrong? What are the unknowns? What would require a spike or prototype to validate?
- **Trade-offs** — What does this approach optimize for? What does it sacrifice? What alternatives were considered and why were they not chosen?

---

## Contribution Points

After refining an idea, consider whether any remaining decisions are contribution points — judgment calls where the user's domain knowledge would produce a better outcome than agent discretion.

This is distinct from specification gaps (which _discuss resolves). Contribution points arise even after the idea is fully specified, where multiple valid approaches exist and the right choice depends on knowledge the user holds but has not transferred through Q&A.

Indicators that a decision is a contribution point:

- Business logic with multiple valid approaches where the user's domain shapes the right choice
- Architectural trade-offs between competing values the user has not ranked (performance vs. simplicity, flexibility vs. consistency)
- Error handling and resilience strategies where the user's user base, SLA, or failure tolerance matters

For each identified contribution point, use AskUserQuestion before the plan is written. The user's answer becomes a constraint the plan encodes — not a suggestion for the planner to interpret.

Not every task has contribution points. Context-resolvable decisions — where the codebase, constraints, or prior discussion already determines the right approach — do not need this treatment. Apply judgment.

---

## Output

Ideation produces three files in the `ideation/` subdirectory:

- `innovative.md` — Written by the innovative PI agent. Ideas explored through the creative and novel lens.
- `best.md` — Written by the best-practice PI agent. Ideas explored through the established patterns lens.
- `ideation.md` — Written by the orchestrator. Synthesis combining both stances and the discussion with the user.

Each stance file should cover:

- The problem being solved (root cause, not symptom)
- The proposed approach with concrete mechanism
- Constraints and scope boundaries
- Known risks and trade-offs
- Success criteria

The synthesis (`ideation.md`) merges the strongest elements from both stances into a single refined idea — concrete enough that a planner can decompose it into tasks and an evaluator can assess its quality.

When evaluation is performed, evaluator agents write their results to `ideation/evaluation/{perspective}.md` — one file per perspective. Evaluation is optional at ideation; the orchestrator asks the user whether to skip.

---

## Constraints

- Never skip discussion — always use AskUserQuestion to refine the idea with the user
- Never accept a vague idea as ready — push toward concrete mechanisms, interfaces, and criteria
- Never ignore the user's intent — challenge assumptions, but anchor to what the user wants
- Never present alternatives as replacements — use them to stress-test and strengthen the idea
- Always read relevant codebase before discussing approaches — existing patterns inform the discussion
