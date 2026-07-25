---
name: ideation
description: MUST load for Ideation. Turns a user trigger into a reference-backed, scope-locked, plan-ready What, Why, and How.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Ideation

Use this skill when Ideation starts or repeats. The leader turns the user's trigger into one plan-ready canonical artifact: the right problem, the reason to solve it, the locked boundary, and a concrete reference-backed direction.

This skill owns the Ideation specialist method. Workflow owns the shared DISCUSSION, dual-system WORK, EVALUATION, RECORD, dispatch, and state-transition mechanics.

## Principles

### Find the cause before choosing the change

A visible symptom is evidence, not automatically the problem. Trace the cause until removing it would remove the need for the work. Test the framing against prior attempts, the strongest do-nothing case, and a plausible reframe.

### Scope must be enumerable and refusable

The artifact must let a later specialist say yes or no to a candidate change. Project, feature, and task boundaries are explicit. Adjacent improvements are deferred with a destination, not absorbed.

### Design follows evidence and user choice

Study project patterns and external prior art before selecting a direction. Show concrete options and trade-offs. The user decides material scope and design direction.

### The artifact must survive its author

Planning must be able to decompose the artifact without recovering private discussion context. Names, evidence, obligations, failure behavior, and success criteria must be stable and followable.

## Rules

### Must follow

- **I-1 — Frame What, Why, and How.** State the outcome, trigger, root cause, affected actors, success and falsification signals, and directional approach.
- **I-2 — Lock one scope contract.** Enumerate in-scope, out-of-scope, and deferred work at project, feature, and task altitude. Record any overlap with existing active work.
- **I-3 — Obtain user authority for material direction.** Scope, success criteria, design direction, destructive implications, external adoption, and material assumptions require the user's decision.
- **I-4 — Research before design.** Search project memory, code, history, adjacent work, and relevant external prior art. Record useful negative results and cite every adopted claim.
- **I-5 — Prefer existing patterns.** Reuse the project's established structure, naming, interfaces, and libraries unless evidence justifies a deviation.
- **I-6 — Make assumptions falsifiable.** Label each load-bearing premise, its evidence, what fails if it is wrong, and the signal that would disconfirm it.
- **I-7 — Design the whole user-visible behavior.** Cover normal use, alternatives, exact boundaries, failure and recovery, abuse, compatibility change, and counterfactuals. Include performance, cost, privacy, security, accessibility, locale, observability, and rollback when applicable.
- **I-8 — Produce traceable obligations.** Every approved scenario yields a design obligation. Every obligation has an unchecked verification check and a source trace.
- **I-9 — Stay at directional design altitude.** Name components, interfaces, data flow, ownership, dependencies, and verification seams. Do not decompose ordered implementation tasks; Planning owns Who, When, and Where.
- **I-10 — Preserve the semantic union on revision.** A later iteration may replace a decision only with explicit evidence and authority. It must not silently drop a prior accepted constraint.

### Must not follow

- Do not accept a symptom as the cause because it is easy to describe.
- Do not use open-ended scope words such as “etc.” or “related work.”
- Do not invent a direction before studying references.
- Do not treat an unverified premise as a settled fact.
- Do not defer an in-scope design obligation to a future specialist.
- Do not turn Ideation into an ordered task plan or implementation diff.

## Procedure

### 1. Read the durable inputs

Read the user trigger, applicable project memory, rules, mistakes, code, history, and any earlier valid iteration evidence. Identify the first consumer and the exact decision the artifact must enable. On a repeated iteration, list changed inputs and approved finding dispositions; do not treat the previous synthesis as unquestionable authority.

Evidence: an input register with exact paths, references, and unresolved gaps.

### 2. Frame the problem

Write the What, Why, and How in plain language. Name the affected actors, current behavior, desired outcome, trigger, and why now. Ask why until the cause would make the work unnecessary if removed. Record prior attempts or a verified absence.

Steel-man doing nothing. State the strongest reason not to act, why it was rejected, and what evidence would reverse the choice. Run a reframe check: ask whether the trigger points to a different problem than first stated.

Evidence: a framed-problem section with cause chain, counterfactual, prior attempts, reframe result, success signals, and falsification signals.

### 3. Lock the scope contract

Enumerate project, feature, and task boundaries. List in-scope, out-of-scope, and deferred items. Compare the candidate against active feature scopes and current repository work. Route every non-selected adjacent item to a named backlog or explicit drop decision.

Pause for the user's approval. If the boundary remains ambiguous or overlapping, remain in DISCUSSION.

Evidence: one approved scope contract that a later agent can mechanically compare with a candidate change.

### 4. Research internal and external references

Study project memory, implementation patterns, version history, open work, and applicable mistakes. Then study relevant primary external sources and established implementations. Keep internal and external evidence distinguishable. Record search targets, adopted insights, rejected alternatives, licensing constraints, and useful negative results.

If the available evidence cannot support a material design choice, return the exact missing question instead of guessing.

Evidence: followable research notes with claim-to-source links.

### 5. Present reference-backed directions

Create concrete options that show structure, interfaces, state or data flow, and user experience. State trade-offs, the recommended direction, and what evidence would change the recommendation. Prefer the boring project pattern when it satisfies the obligation.

Obtain the user's decision for every material direction. Record rejected options and why they lost.

Evidence: an approved direction and decision record.

### 6. Complete the directional design

Name each component's concern and owner. Trace dependencies and data flow; reject cycles and shared-state hubs without a clear synchronization decision. Define interfaces so a consumer can use them without reading internals. Name test seams and how major behavior will be observed.

Disposition performance bounds, external-call behavior, error and recovery behavior, destructive or one-way actions, security and data boundaries, accessibility, locale, operational signals, recurring cost, and rollback. Use explicit not-applicable reasons only after inspecting applicability.

Evidence: a coherent design that maps every choice to research and the scope contract.

### 7. Derive scenarios and checks

Use [scenarios.md](scenarios.md) as the Ideation scenario source. Convert every non-exploratory case into a design obligation. Use [checklists.md](checklists.md) to give each load-bearing obligation an atomic, unchecked, evidence-bearing check. Close both traces: source to scenario to obligation, and obligation to check.

If a scenario exposes a missing material choice, return to step 5. Do not patch only the companion documents.

Evidence: no orphaned source clause, scenario, obligation, or check.

### 8. Prepare the neutral WORK contract

Freeze the approved scope, research set, decisions, assumptions, design obligations, expected canonical sections, and acceptance criteria. Phrase the contract so Claude and Codex receive the same task without steering either toward the other's answer.

Hand this contract to the workflow-owned dual-system WORK procedure. The specialist's content obligation is a complete plan-ready What, Why, and How.

Evidence: one stable contract digest and no unresolved material input.

### 9. Synthesize without losing useful disagreement

When workflow returns both drafts and both cross-reviews, create the canonical candidate from their evidence. Preserve stronger details and explicit disagreements. Do not introduce new scope. Put every unresolved material conflict into the open-decisions artifact and pause for the user.

Update the candidate only from recorded decisions. EVALUATION cannot begin while a material decision remains open.

Evidence: a synthesis whose claims trace to the frozen inputs and resolved decisions.

### 10. Prove Planning readiness

Read the canonical candidate cold as a planner. Confirm that it states the problem, scope, actors, success criteria, assumptions, references, chosen direction, interfaces, obligations, checks, failure behavior, and deferred work. Confirm names and paths are stable and every cited source resolves.

Run the operation bundle and the shared dual-work validator. Hand the canonical candidate and complete creation evidence to the manager. The manager routes EVALUATION and RECORD.

Completion evidence: a validated dual-system package, resolved decisions, an artifact a fresh planner can decompose, and no hidden implementation-task decision.

## References

- [Workflow Ideation adapter](../workflow/steps/ideation.md) owns manager entry, user gates, and transitions.
- [Dual-system WORK](../workflow/steps/dual-system-work.md) owns independent drafts, reciprocal review, synthesis mechanics, and package validation.
- [Evaluation](../evaluation/SKILL.md) owns the seven perspectives, Overall, findings, checklist completion, verdicts, and repeat review.
- [Record](../record/SKILL.md) owns typed staging, PASS-only canonical artifacts, and session-record validation.
- [Scenario](../scenario/SKILL.md) owns the ten-category coverage frame and scenario construction rules.
- [Checklist](../checklist/SKILL.md) owns unchecked source checks, evidence semantics, and acceptance.
- [Research](../research/SKILL.md) owns the detailed internal and external research procedure.
