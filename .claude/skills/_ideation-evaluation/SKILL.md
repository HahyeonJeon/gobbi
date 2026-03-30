---
name: _ideation-evaluation
description: MUST load when evaluating ideation output. Provides stage-specific criteria for assessing whether an idea is concrete, well-researched, and ready for planning. Used by all 5 evaluator perspectives (Project, Architecture, Performance, Aesthetics, Overall).
allowed-tools: Read, Grep, Glob, Bash
---

# Gobbi Ideation Evaluation

Stage-specific evaluation criteria for ideation output. Load this skill alongside _evaluation when evaluating the result of an ideation step.

The ideation output should be a refined, detailed idea — not a vague direction. If you can't plan from it, it's not ready.

---

## What You're Evaluating

The ideation step produces an idea document that should cover: root problem, proposed approach with concrete mechanism, constraints and scope, research findings, risks and trade-offs, and success criteria. Evaluate against the criteria below.

---

## Evaluation Criteria

### Problem Understanding

- **Root cause identified?** — Is the idea solving the actual problem, or just a symptom? If the user said "we need caching" but the real issue is unoptimized queries, the idea should address queries, not caching.
- **Impact justified?** — Is the scope of the proposed solution proportional to the severity of the problem? A minor UX annoyance doesn't warrant an architectural overhaul.
- **Success criteria measurable?** — Can you objectively determine whether the idea worked? "Better performance" fails. "P95 latency under 200ms on /search" passes.

### Concreteness

- **Mechanism described?** — Can you trace the data flow from input to output? If the idea says "use an event-driven approach" but doesn't specify what events, what consumers, what happens on failure — it's too abstract.
- **Key interfaces defined?** — Are the boundaries between components clear? What goes in, what comes out, what format?
- **Plannable?** — Could a planner decompose this into specific tasks right now? If the idea needs more detail before planning, it's not done.

### Trade-offs and Risks

- **Trade-offs explicit?** — Does the idea state what it optimizes AND what it sacrifices? Every approach has costs. If none are stated, they're hidden, not absent.
- **Risks identified?** — What could go wrong? Are failure modes named with severity? Is there a fallback?
- **Assumptions surfaced?** — What must be true for this idea to work? Are those assumptions validated or just hoped for?

### Constraints and Scope

- **Hard constraints respected?** — Does the idea violate any non-negotiable requirements (tech stack, compliance, performance thresholds)?
- **Scope bounded?** — Is it clear what's included and what's explicitly NOT included? Unbounded scope means unbounded work.
- **Assumed constraints challenged?** — Were constraints questioned during ideation, or just accepted? False constraints narrow the solution space unnecessarily.

### Completeness

- **Research done?** — Were relevant prior art, patterns, and libraries investigated? Or is this the first idea that came to mind?
- **Alternatives considered?** — Was the idea stress-tested against alternatives? An idea that survived comparison is stronger than one that was never challenged.
- **Edge cases addressed?** — Are boundary conditions and unusual inputs considered? At minimum, the idea should acknowledge which edge cases it handles vs. defers.

---

## Perspective-Specific Focus

| Perspective | Primary Focus |
|-------------|--------------|
| Project | Does the idea solve the right problem? Scope and requirements alignment. |
| Architecture | Is the proposed mechanism structurally sound? Coupling, abstraction level. |
| Performance | Are efficiency implications considered? Scalability risks identified. |
| Aesthetics | Is the idea clearly articulated? Would a fresh reader understand it? |
| Overall | What cross-cutting gaps exist? What must be preserved? |

---

## Scoring Guidance

Ideation findings naturally trend toward lower confidence than plan or execution findings. Ideas are abstract — mechanism descriptions, trade-off assessments, and risk predictions are harder to verify concretely. An evaluator cannot grep for whether a trade-off analysis is complete the way they can grep for whether a function exists.

Expect confidence scores in the 60-70 range for many legitimate ideation concerns. A finding like "this approach may not scale under load X" is a real concern worth surfacing even at confidence 65, because ideation is the cheapest place to catch architectural problems. Suppressing ideation findings at the same threshold as execution findings would silence valuable early warnings.

When scoring ideation findings, severity matters more than confidence for decision-making. A high-severity, moderate-confidence finding ("this architecture may have a fundamental scaling flaw") deserves discussion even if confidence is below the default threshold. Evaluators should flag such findings for the orchestrator rather than letting them be silently filtered.
