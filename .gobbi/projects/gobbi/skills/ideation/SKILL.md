---
name: ideation
description: MUST load for Ideation. Turns a user trigger into a reference-backed, scope-locked, plan-ready What, Why, and How.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Ideation

Use this skill when Ideation starts or repeats to turn a user trigger into a concrete What, Why, and How. Ideation uses successive discussions that progress hierarchically from the problem, rationale, and scope boundaries to increasingly detailed, reference-backed design choices and material user decisions. It ends with one user-approved, plan-ready artifact that records the chosen design, decision rationale, supporting evidence, and constraints so Planning can decompose it without reconstructing missing context.

## Principles

### Define the user's problem and boundaries before choosing a design

Start with the outcome the user needs, their current situation, the reason the outcome matters, and the root cause preventing it. Challenge any predefined solution and test whether the request points to a different problem. State the in-scope, out-of-scope, and deferred boundaries, including the hard and soft constraints that shape the possible design. Reopen the framing when later evidence shows that the problem or boundary is wrong.

### Ground the design in direct evidence, representative users, and trustworthy prior art

Study the project's current behavior, prior decisions, patterns, and constraints. Seek direct evidence from representative users or people affected by the design, because project conventions and external examples cannot prove what users need. Use prior art to support a design choice only when its authority, relevance, currency, and applicability can be verified. Prefer direct project evidence, primary sources, official documentation, maintained standards, and established implementations. Treat secondary or unverified claims as leads, separate facts from assumptions, and justify any deviation from the best-supported pattern.

### Develop the design from high-level structure to detail

A coherent design grows through successive discussions from the whole to its parts. Settle the intended outcome, overall direction, and major boundaries before refining components, ownership, interfaces, data flow, user-visible behavior, failure and recovery, edge cases, and applicable constraints. Each lower-level choice must follow the decisions above it, while an unresolved higher-level choice keeps dependent details open. The hierarchy remains revisable: if detailed evidence invalidates a parent decision, return to that decision instead of forcing the details to fit it.

### Compare alternatives before making material decisions with the user

At each material design level, first develop genuinely different alternatives, including doing nothing when it is credible. Define the decision criteria from the user outcome, scope, constraints, risks, cost, and success signals before comparing the alternatives. Present their concrete trade-offs with one recommendation, then obtain the user's decision for material scope or design choices. Record the selected option, rejected alternatives, decision rationale, and the evidence that would justify reopening the decision.

### Write artifacts and prove readiness at checkpoints and phase transitions

Discussion produces decisions, but written artifacts preserve and expose them. At each defined checkpoint and before each phase transition, update the canonical artifacts with the current problem, scope, evidence, decision criteria, alternatives, selected design, rationale, consequences, assumptions, constraints, unresolved questions, and known risks. Use the checkpoint to identify disagreement or missing evidence. Advance only when material decisions are resolved and the highest-risk assumptions have enough evidence for the next phase; otherwise remain in Ideation and return to the affected problem or design level.

## Rules

Ideation applies from the first problem framing through user approval of a plan-ready design. It uses [Discussion](../discussion/SKILL.md) for user-facing questions and decisions. Its base method owns the design discussion, material decisions, and plan-ready written artifacts. Applicable domain skills independently own their specialized procedures and outputs. Ideation owns What, Why, scope, evidence, material design decisions, and the directional How. Planning owns Who, When, Where, and ordered implementation tasks.

### Must-Follow

- **MUST define the problem and boundaries before choosing a design.** State the user's outcome, current situation, trigger, affected people, root cause, success and falsification signals, in-scope work, out-of-scope work, deferred work, and hard and soft constraints. Record overlaps with active work and obtain the user's approval of material boundaries.
- **MUST ground material claims and choices in sufficient evidence.** Study the project's current behavior, history, prior decisions, and patterns. Seek direct evidence from representative users or affected people, and study relevant prior art. Assess each source's authority, relevance, currency, and applicability. Distinguish facts, assumptions, and useful negative results. Cite adopted claims and prefer an established pattern unless evidence justifies a deviation.
- **MUST develop the design from parent decisions to dependent details.** Resolve the intended outcome, overall direction, and major boundaries before refining components, interfaces, data flow, behavior, failure handling, and edge cases. Keep a dependent detail open while its parent decision is unresolved. Return to the parent decision when later evidence invalidates it.
- **MUST compare genuine alternatives before seeking a material decision.** Define criteria from the user outcome, scope, constraints, risks, cost, and success signals. Include doing nothing when it is credible. Present concrete trade-offs with one recommendation and the evidence that would change it. The user decides material scope, success criteria, design direction, destructive implications, adoption of an external dependency or service, and whether a material assumption may constrain the design.
- **MUST make every load-bearing assumption and risk falsifiable.** Record its evidence, what fails if it is wrong, the signal that would disconfirm it, and the evidence needed to resolve it.
- **MUST design the complete observable outcome.** Cover each affected actor's normal use, alternative paths, exact boundaries, failure and recovery, abuse, compatibility change, and counterfactuals. Address performance, cost, privacy, security, accessibility, locale, observability, and rollback when applicable.
- **MUST keep Ideation directional and traceable.** Name components, ownership, interfaces, data flow, dependencies, and verification seams. For each approved scenario, write a design obligation, a verification check, and its source. Stop before ordered implementation tasks; Planning owns their decomposition.
- **MUST update the canonical artifacts at each checkpoint.** Record the current problem, scope, evidence, decision criteria, alternatives, selected design, rejected options, rationale, consequences, assumptions, constraints, unresolved questions, risks, obligations, and checks. Later work uses the latest written state instead of reconstructing discussion context.
- **MUST prove readiness before a phase transition.** Resolve every material decision and collect enough evidence for the highest-risk assumptions. A fresh planner must be able to trace the problem, scope, sources, decisions, design, obligations, checks, and deferred work without private context. Otherwise, remain in Ideation and return to the affected level.
- **MUST preserve approved decisions and constraints across revisions.** Replace a prior decision only with new evidence and the required user authority. Record what changed, why it changed, and its consequences. Never silently drop an accepted constraint.

### Must-Not-Follow

- **NEVER treat a requested solution or visible symptom as the settled problem.** Test the framing against the root cause, the strongest case for doing nothing, and plausible reframes.
- **NEVER leave scope open-ended or silently absorb adjacent work.** Replace words such as “etc.” and “related work” with explicit boundaries, a named destination for each deferred item, or an explicit drop decision.
- **NEVER treat an assumption or weak source as authoritative evidence.** Secondary or unverified claims may guide further research, but they cannot settle a material design choice.
- **NEVER lock a dependent detail while its parent decision is unresolved or disproven.** Return to the higher-level decision instead of forcing the detail to fit it.
- **NEVER invent cosmetic alternatives or make a user-owned material choice.** Present meaningfully different options and preserve the user's authority over the decision.
- **NEVER advance with an unresolved material decision, an under-evidenced high-risk assumption, or an in-scope design obligation deferred to a later phase.** Keep the work in Ideation until the gap is resolved or the user changes the scope.
- **NEVER turn Ideation into an ordered task plan or implementation diff.** Planning owns implementation sequence and task decomposition.
- **NEVER silently remove an accepted decision, constraint, or obligation during revision.** Make every replacement explicit and traceable.

## Procedure

### 1. Establish the context and applicable domains

Read the user trigger, current project state, prior decisions, governing documents, relevant history, and any earlier valid design. Identify the intended consumer and the decisions the final artifact must enable. Classify material inputs as verified fact, user report, assumption, contradiction, decision, or open question.

Select only the domain skills the work needs. Use [Startup](../startup/SKILL.md) when the project baseline is absent, sparse, contradictory, or explicitly being reset. Use [UI](../ui/SKILL.md) for observable interface design, [UX](../ux/SKILL.md) for user-outcome and experience design, and [Coding](../coding/SKILL.md) for software design. Use [HTML](../html/SKILL.md) and [CSS](../css/SKILL.md) independently for their respective language-specific contracts, [Python](../python/SKILL.md) or [TypeScript](../typescript/SKILL.md) for their language-specific contracts, [React](../react/SKILL.md) for React's library-specific contract, and [Electron](../electron/SKILL.md) for the desktop-platform contract. A project or process design may need only this base method. Domain skills supplement this procedure; do not copy their detailed mechanics into it.

**Evidence:** an input and routing register with the trigger, baseline, artifact consumer, applicable domains, authoritative inputs, contradictions, and open questions.

**Next:** if the baseline is unsafe or insufficient, obtain the Startup classifier or input packet before step 2. If the routing changes later, update the register and load the newly applicable owner before its decision.

### 2. Define the problem, outcome, and reason to act

Describe the affected people or actors, triggering event, current behavior, workarounds, consequences, desired outcome, root cause, prior attempts, and why the work matters now. Test the requested solution against the underlying problem, the strongest credible case for doing nothing, and plausible alternative framings.

Define observable success and falsification signals. Obtain the user's approval of the problem and desired outcome before choosing a design.

**Evidence:** an approved problem frame with the cause chain, actors, current reality, desired outcome, prior attempts, do-nothing case, reframe result, success signals, and falsification signals.

**Next:** if removing the stated cause would not remove the need for the work, or the premise lacks evidence, reframe the problem or stop. Otherwise continue to step 3.

### 3. Lock scope, constraints, and decision criteria

Enumerate in-scope, out-of-scope, and deferred work. Record hard constraints, soft preferences, active-work overlap, compatibility promises, authority boundaries, and decisions reserved for the user. Give every deferred item a named destination or an explicit drop decision.

Derive the criteria for later choices from the approved outcome, constraints, risk, cost, reversibility, maintainability, usability, and success signals. Obtain the user's approval of material boundaries.

**Evidence:** an approved scope contract and an ordered set of design-decision criteria.

**Next:** if the scope remains open-ended, overlaps unresolved work, or hides an adjacent outcome, remain in Discussion. Otherwise continue to step 4.

### 4. Build the evidence and governing foundation

Study current project behavior, implementation patterns, prior decisions, existing design or architecture material, relevant configuration, direct evidence from representative users or affected people when applicable, and trustworthy external prior art. Use [Study](../study/SKILL.md) when a material question needs a bounded internal or external evidence operation.

Assess every material source for authority, relevance, currency, applicability, and licensing. Treat a `DESIGN.md`, brand guide, design system, architecture record, runtime configuration, compiler configuration, API specification, or maintained standard as governing only when it exists and has authority over the current scope. Never require one universal filename, design tool, framework, or programming language. Record useful negative results and keep facts separate from assumptions and secondary leads.

**Evidence:** a claim-to-source register, the governing foundation for each applicable domain, and the unresolved evidence gaps.

**Next:** if the evidence cannot support a material direction, research the exact gap or ask the exact unresolved question. Do not guess. Otherwise continue to step 5.

### 5. Explore and choose the high-level direction

Develop at least two materially different directions when a genuine choice exists, including doing nothing when credible. Describe each at the whole-outcome level: actors, major responsibilities, principal flow, system or experience boundary, dependencies, consequences, risks, and fit with the governing foundation.

Compare the directions with the approved criteria. Recommend one, explain why it is best supported, and state what evidence would change the recommendation. Obtain the user's decision and record why the other directions lost. When constraints leave only one viable direction, record the evidence that eliminates the alternatives instead of inventing cosmetic choices.

**Evidence:** an approved high-level direction and a decision record with criteria, alternatives, trade-offs, recommendation, selection, rejected options, and reopen conditions.

**Next:** if no direction satisfies the problem and scope, return to step 2 or 3. Otherwise continue to step 6.

### 6. Map the selected design from the whole to its parts

Describe the complete outcome before refining local details. Establish the major actors, stages, responsibilities, components, journeys, information or data movement, dependencies, trust boundaries, lifecycle states, and completion evidence that apply to the domain.

Name the parent decisions and the design areas that depend on them. Resolve ownership, direction, and major boundaries before discussing dependent details. Use the applicable domain skills to decide what counts as a component, interaction, journey, module, contract, process, document, or other specialized unit.

**Evidence:** an approved whole-design map with stable names, major boundaries, ownership, flow, and explicit parent-to-dependent decision relationships.

**Next:** keep a dependent detail open while its parent decision is unresolved. If the map disproves the selected direction, return to step 5. Otherwise continue to step 7.

### 7. Develop the design bottom-up through successive decisions

Start with the smallest meaningful unit in each applicable domain and connect it toward the complete outcome. Discuss its purpose, inputs, outputs, state or information transitions, names, ownership, interfaces, dependencies, user-visible behavior, failure and recovery, and verification seams. Reconcile every new detail with the whole-design map and all earlier decisions.

At each material level, define the decision and criteria, develop genuine alternatives, present concrete trade-offs and one recommendation, obtain the required user decision, and record the selection, rationale, consequences, rejected options, and reopen evidence. Domain skills own the specialized shapes and mechanics. This base method owns the consistency of their combined decisions.

**Evidence:** an accumulated directional design whose details trace to approved parent decisions, evidence, and user choices.

**Next:** if a detail disproves a parent decision, return to the earliest affected level instead of forcing it to fit. Do not create ordered implementation tasks. When the design is coherent, continue to step 8.

### 8. Complete design coverage and decide the validation approach

Inspect the design across every applicable actor, normal and alternative path, exact boundary, invalid state, failure, recovery, abuse, compatibility event, and counterfactual. Disposition performance, resource cost, privacy, security, trust, accessibility, locale, observability, operation, maintenance, migration, and rollback from inspected evidence. Use a precise not-applicable reason only after testing applicability.

For each load-bearing assumption or material risk, record what fails if it is wrong, the evidence already available, and the evidence still needed. Discuss the best later validation method or artifact, such as a walkthrough, prototype, experiment, code spike, benchmark, or representative-user study. Record the question it would answer, suitable participants or environment, pass and fail signals, reopen condition, owner, and later phase.

The base Ideation procedure does not create or test prototypes, code spikes, screens, implementation, or other realization outputs. An applicable domain skill may independently require additional artifacts or evidence under its own procedure; that requirement does not become universal Ideation policy.

**Evidence:** complete design-coverage dispositions and a risk-ordered validation plan that distinguishes current evidence from proposed future evidence.

**Next:** unresolved material behavior returns to step 6 or 7. An under-evidenced high-risk assumption blocks handoff unless the user changes the design or scope. Otherwise continue to step 9.

### 9. Consolidate the checkpoint artifact, scenarios, and checks

Update the canonical Ideation artifact with the approved problem, scope, evidence, criteria, alternatives, decisions, directional design, consequences, assumptions, risks, validation plan, unresolved questions, and deferred work. Preserve earlier approved constraints and decisions unless an explicit, authorized, evidence-backed replacement exists.

Use [scenarios.md](scenarios.md) as the Ideation scenario source. Convert every approved non-exploratory scenario into a design obligation. Use [checklists.md](checklists.md) to give each load-bearing obligation an atomic, unchecked, evidence-bearing check. Close both traces: source to decision or scenario to obligation, and obligation to check.

**Evidence:** one current, cold-readable What, Why, and How artifact with no orphaned claim, decision, scenario, obligation, or check.

**Next:** if a trace is missing, a decision disappeared, or a scenario exposes a material gap, return to its earliest owning step. Otherwise continue to step 10.

### 10. Prove Planning readiness and hand off

Read the artifact as a fresh planner. Confirm that it states the problem, reason, actors, scope, constraints, sources, assumptions, selected and rejected alternatives, directional design, ownership, interfaces, flows, states, failures, recovery, quality obligations, validation decisions, checks, and deferred work. Confirm that all material decisions are resolved, references and paths resolve, terminology is stable, and Planning can decompose the design without private discussion context.

Confirm that the artifact contains no ordered implementation task list, implementation diff, produced prototype, or hidden design decision delegated to Planning. Run the Ideation operation bundle. Hand the plan-ready content to the caller. The applicable orchestration or workflow layer independently owns drafts, review, evaluation, record storage, and transitions.

**Completion evidence:** a plan-ready What, Why, and How artifact, resolved decision record, closed obligation and check trace, explicit later validation work, and no hidden implementation-task decision.

**Failure:** return to the earliest affected step. Do not hand off a cosmetically complete artifact with an unresolved material decision or unsupported readiness claim.

## References

- [Discussion](../discussion/SKILL.md) owns the structure and quality of user-facing questions and decisions.
- [Startup](../startup/SKILL.md) owns read-only baseline classification and the optional sparse-baseline input packet.
- [Study](../study/SKILL.md) owns the detailed internal and external evidence operation.
- [UI](../ui/SKILL.md) owns specialized interface design, prototype, direct-user testing, and interface handoff.
- [UX](../ux/SKILL.md) owns specialized user-outcome research, experience design, prototype evaluation, and measurement handoff.
- [Coding](../coding/SKILL.md) owns language-agnostic software design and construction principles.
- [HTML](../html/SKILL.md) and [CSS](../css/SKILL.md) each own their language-specific design contract and are independently selectable.
- [Python](../python/SKILL.md) and [TypeScript](../typescript/SKILL.md) own their language-specific design contracts and idioms.
- [React](../react/SKILL.md) owns React's library-specific design contract and idioms.
- [Electron](../electron/SKILL.md) owns the desktop-platform design contract an Electron application adds on top of those.
- [Planning](../planning/SKILL.md) owns ordered implementation decomposition after Ideation readiness.
- [Workflow Ideation adapter](../workflow/steps/ideation.md) owns manager entry, user gates, and transitions.
- [Dual-system WORK](../workflow/steps/dual-system-work.md) owns independent drafts, reciprocal review, synthesis mechanics, and package validation.
- [Evaluation](../evaluation/SKILL.md) owns the seven perspectives, Overall, findings, checklist completion, verdicts, and repeat review.
- [Record](../record/SKILL.md) owns typed staging, PASS-only canonical artifacts, and session-record validation.
- [Scenario](../evaluation/scenario/SKILL.md) owns the ten-category coverage frame and scenario construction rules.
- [Checklist](../evaluation/checklist/SKILL.md) owns unchecked source checks, evidence semantics, and acceptance.
