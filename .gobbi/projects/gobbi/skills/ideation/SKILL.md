---
name: ideation
description: "MUST load when discussing a problem and exploring how to address it with the user. Ideation is an operation skill for understanding the problem, defining its boundaries, and developing an evidence-backed design through discussion."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Ideation

Use this skill when Ideation starts or repeats to turn a user trigger into a concrete What, Why, and How. Ideation uses successive discussions that progress hierarchically from the problem, rationale, and scope boundaries to increasingly detailed, reference-backed design choices and material user decisions. It ends with one self-contained, user-approved artifact that records the chosen design, decision rationale, supporting evidence, constraints, risks, validation commitments, and traceability without relying on private context or another skill.

## Principles

### Ground the design in direct evidence, representative users, and trustworthy prior art

Study the project's current behavior, prior decisions, patterns, and constraints. Seek direct evidence from representative users or people affected by the design, because project conventions and external examples cannot prove what users need. Use prior art to support a design choice only when its authority, relevance, currency, and applicability can be verified. Prefer direct project evidence, primary sources, official documentation, maintained standards, and established implementations. Treat secondary or unverified claims as leads, separate facts from assumptions, and justify any deviation from the best-supported pattern.

### Develop the design from high-level structure to detail

A coherent design grows through successive discussions from the whole to its parts. Settle the intended outcome, overall direction, and major boundaries before refining components, ownership, interfaces, data flow, user-visible behavior, failure and recovery, edge cases, and applicable constraints. Each lower-level choice must follow the decisions above it, while an unresolved higher-level choice keeps dependent details open. The hierarchy remains revisable: if detailed evidence invalidates a parent decision, return to that decision instead of forcing the details to fit it.

### Compare alternatives before making material decisions with the user

At each material design level, first develop genuinely different alternatives, including doing nothing when it is credible. Define the decision criteria from the user outcome, scope, constraints, risks, cost, and success signals before comparing the alternatives. Present their concrete trade-offs with one recommendation, then obtain the user's decision for material scope or design choices. Record the selected option, rejected alternatives, decision rationale, and the evidence that would justify reopening the decision.

### Keep the artifact current and prove completion

User discussion produces decisions, but a current artifact preserves and exposes them. At each defined checkpoint, update the artifact with the current problem, scope, evidence, decision criteria, alternatives, selected design, rationale, consequences, assumptions, constraints, unresolved questions, and known risks. Use each checkpoint to identify disagreement or missing evidence. Complete Ideation only when material decisions are resolved, high-risk assumptions have sufficient evidence or an explicit validation commitment, and a cold reader can understand the approved result without private context.

## Rules

Ideation begins with problem framing and ends with one completed, user-approved What, Why, and How artifact. It owns the problem, rationale, scope, evidence, material design decisions, directional design, validation commitments, and traceable result.

### Must-Follow

- **MUST define and approve the problem and boundaries before choosing a design.** State the user's outcome, current situation, trigger, affected people, root cause, success and falsification signals, in-scope work, out-of-scope work, deferred work, hard and soft constraints, and active-work overlaps. Obtain the user's approval of material boundaries.
- **MUST ground material claims and load-bearing assumptions in sufficient evidence.** Study current behavior, history, prior decisions, representative users or affected people, trustworthy prior art, and useful negative results. Assess each source's authority, relevance, currency, and applicability. Distinguish facts from assumptions, cite adopted claims, and record for each load-bearing assumption what fails, its disconfirming signal, and the evidence needed to resolve it.
- **MUST develop one complete observable design from parent decisions to dependent details.** Resolve the intended outcome, overall direction, and major boundaries before refining actors, components, ownership, interfaces, data flow, behavior, failure and recovery, exact edges, and applicable quality concerns. Keep dependent details open while a parent decision is unresolved, and return to the parent when later evidence invalidates it.
- **MUST compare genuine alternatives and preserve material user authority.** Define criteria from the outcome, scope, constraints, risks, cost, and success signals. Include doing nothing when credible. Present concrete trade-offs, one recommendation, and reopen evidence. The user decides material scope, success criteria, design direction, destructive implications, external dependencies or services, and whether a material assumption may constrain the design.
- **MUST complete Ideation from this operation and its owned companions.** Use project evidence and authoritative domain sources directly. Do not require another skill or outside procedure to supply a missing step, decision method, evidence method, completion rule, or evaluation method.
- **MUST keep the canonical artifact current and traceable.** At each checkpoint record the current problem, scope, evidence, criteria, alternatives, selected and rejected options, rationale, consequences, assumptions, constraints, unresolved questions, risks, components, ownership, interfaces, flows, dependencies, obligations, checks, and sources. Preserve approved decisions and constraints across revisions; record every authorized replacement and its consequences.
- **MUST complete Ideation only with a resolved, cold-readable result.** Resolve every material decision and collect sufficient evidence or an explicit validation commitment for each high-risk assumption. A cold reader must be able to trace the problem, scope, sources, decisions, design, obligations, checks, and deferred work without private context. The completed artifact contains no ordered implementation tasks, implementation diff, or produced prototype, code spike, screen, or other realization output.

### Must-Not-Follow

- **NEVER settle an unsupported framing, claim, choice, or detail.** A requested solution, visible symptom, weak source, unsupported assumption, cosmetic alternative, or dependent detail with an unresolved parent cannot settle the design.
- **NEVER change the accepted contract silently.** Do not absorb adjacent work, leave scope open-ended, drop an accepted decision or constraint, or defer an in-scope design obligation. Give every deferred item a named destination or an explicit drop decision authorized by the user.

## Procedure

### 1. Establish the context and applicable domains

Read the user trigger, current project state, prior decisions, governing documents, relevant history, and any earlier valid design. Identify the intended consumer and the decisions the final artifact must enable. Classify material inputs as verified fact, user report, assumption, contradiction, decision, or open question.

Identify the applicable domain concerns, such as project structure, user experience, interfaces, software, language behavior, platform constraints, operations, or policy. Inspect the project evidence and authoritative domain sources that govern those concerns. When the baseline is absent, sparse, contradictory, or explicitly being reset, record the exact gap and obtain the missing project facts before using the baseline as evidence.

**Evidence:** an input and domain register with the trigger, baseline, artifact consumer, applicable concerns, authoritative inputs, contradictions, and open questions.

**Next:** if the baseline is unsafe or insufficient, obtain the exact missing project facts before step 2. If an applicable concern or governing source changes later, update the register before making the affected decision.

### 2. Define the problem, outcome, and reason to act

Describe the affected people or actors, triggering event, current behavior, workarounds, consequences, desired outcome, root cause, prior attempts, and why the work matters now. Test the requested solution against the underlying problem, the strongest credible case for doing nothing, and plausible alternative framings.

Define observable success and falsification signals. Obtain the user's approval of the problem and desired outcome before choosing a design.

**Evidence:** an approved problem frame with the cause chain, actors, current reality, desired outcome, prior attempts, do-nothing case, reframe result, success signals, and falsification signals.

**Next:** if removing the stated cause would not remove the need for the work, or the premise lacks evidence, reframe the problem or stop. Otherwise continue to step 3.

### 3. Lock scope, constraints, and decision criteria

Enumerate in-scope, out-of-scope, and deferred work. Record hard constraints, soft preferences, active-work overlap, compatibility promises, authority boundaries, and decisions reserved for the user. Give every deferred item a named destination or an explicit drop decision.

Derive the criteria for later choices from the approved outcome, constraints, risk, cost, reversibility, maintainability, usability, and success signals. Obtain the user's approval of material boundaries.

**Evidence:** an approved scope contract and an ordered set of design-decision criteria.

**Next:** if the scope remains open-ended, overlaps unresolved work, or hides an adjacent outcome, continue clarification until the boundary is explicit. Otherwise continue to step 4.

### 4. Build the evidence and governing foundation

Study current project behavior, implementation patterns, prior decisions, existing design or architecture material, relevant configuration, direct evidence from representative users or affected people when applicable, and trustworthy external prior art. When a material question needs bounded internal or external research, define the exact question, source boundary, evidence standard, and stopping condition before collecting evidence.

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

Name the parent decisions and the design areas that depend on them. Resolve ownership, direction, and major boundaries before discussing dependent details. Use verified project conventions and authoritative domain evidence to decide what counts as a component, interaction, journey, module, contract, process, document, or other specialized unit.

**Evidence:** an approved whole-design map with stable names, major boundaries, ownership, flow, and explicit parent-to-dependent decision relationships.

**Next:** keep a dependent detail open while its parent decision is unresolved. If the map disproves the selected direction, return to step 5. Otherwise continue to step 7.

### 7. Develop the design bottom-up through successive decisions

Start with the smallest meaningful unit in each applicable domain and connect it toward the complete outcome. Discuss its purpose, inputs, outputs, state or information transitions, names, ownership, interfaces, dependencies, user-visible behavior, failure and recovery, and verification seams. Reconcile every new detail with the whole-design map and all earlier decisions.

At each material level, define the decision and criteria, develop genuine alternatives, present concrete trade-offs and one recommendation, obtain the required user decision, and record the selection, rationale, consequences, rejected options, and reopen evidence. Derive specialized shapes and mechanics from verified project conventions and authoritative domain sources. Reconcile them through this one method.

**Evidence:** an accumulated directional design whose details trace to approved parent decisions, evidence, and user choices.

**Next:** if a detail disproves a parent decision, return to the earliest affected level instead of forcing it to fit. Do not create ordered implementation tasks. When the design is coherent, continue to step 8.

### 8. Complete design coverage and decide the validation approach

Inspect the design across every applicable actor, normal and alternative path, exact boundary, invalid state, failure, recovery, abuse, compatibility event, and counterfactual. Disposition performance, resource cost, privacy, security, trust, accessibility, locale, observability, operation, maintenance, migration, and rollback from inspected evidence. Use a precise not-applicable reason only after testing applicability.

For each load-bearing assumption or material risk, record what fails if it is wrong, the evidence already available, and the evidence still needed. Discuss the best future validation method or artifact, such as a walkthrough, prototype, experiment, code spike, benchmark, or representative-user study. Record the question it would answer, suitable participants or environment, pass and fail signals, reopen condition, owner, and execution condition.

Ideation records the validation commitment but does not create or test prototypes, code spikes, screens, implementation, or other realization outputs. A project-specific requirement may require additional evidence, but it becomes part of this operation only when an authoritative source makes it applicable to the current scope.

**Evidence:** complete design-coverage dispositions and a risk-ordered validation plan that distinguishes current evidence from proposed future evidence.

**Next:** unresolved material behavior returns to step 6 or 7. An under-evidenced high-risk assumption blocks completion unless the user changes the design or scope. Otherwise continue to step 9.

### 9. Consolidate the checkpoint artifact, scenarios, and checks

Update the canonical Ideation artifact with the approved problem, scope, evidence, criteria, alternatives, decisions, directional design, consequences, assumptions, risks, validation plan, unresolved questions, and deferred work. Preserve earlier approved constraints and decisions unless an explicit, authorized, evidence-backed replacement exists.

Use [scenarios.md](scenarios.md) as the Ideation scenario source. Convert every approved non-exploratory scenario into a design obligation. Use [checklists.md](checklists.md) to give each load-bearing obligation an atomic, unchecked, evidence-bearing check. Close both traces: source to decision or scenario to obligation, and obligation to check.

**Evidence:** one current, cold-readable What, Why, and How artifact with no orphaned claim, decision, scenario, obligation, or check.

**Next:** if a trace is missing, a decision disappeared, or a scenario exposes a material gap, return to its earliest owning step. Otherwise continue to step 10.

### 10. Complete and return the Ideation artifact

Read the artifact as a cold reader. Confirm that it states the problem, reason, actors, scope, constraints, sources, assumptions, selected and rejected alternatives, directional design, ownership, interfaces, flows, states, failures, recovery, quality obligations, validation commitments, checks, and deferred work. Confirm that all material decisions are resolved, owned links and paths resolve, terminology is stable, and the approved What, Why, and How requires no private discussion context.

Confirm that the artifact contains no ordered implementation task list, implementation diff, produced prototype, code spike, screen, or hidden design decision. Evaluate the artifact through [evaluation.md](evaluation.md) with the owned scenarios and checks. Return the completed, user-approved artifact and its evaluation result to the caller.

**Completion evidence:** a user-approved What, Why, and How artifact, resolved decision record, closed obligation and check trace, explicit future validation commitments, complete evaluation result, and no hidden implementation-task decision.

**Failure:** return to the earliest affected step. Do not return a cosmetically complete artifact with an unresolved material decision, unsupported completion claim, broken trace, or external method dependency.

## References
