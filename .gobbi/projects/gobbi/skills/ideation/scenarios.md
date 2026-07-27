# Ideation Scenarios

This source exercises the obligations in [SKILL.md](SKILL.md). It adds no Ideation policy. Evaluators select applicable cases and may add target-specific cases without weakening these seeds.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | IDEA-SC-01 |
| 2 Actors / stakeholders / use-context | selected | IDEA-SC-02 |
| 3 Behavior / state / data | selected | IDEA-SC-03 |
| 4 Interfaces / dependencies / structure | selected | IDEA-SC-04, IDEA-SC-11 |
| 5 Quality attributes / resource economics | selected | IDEA-SC-05 |
| 6 Failure / recovery / operations | selected | IDEA-SC-06 |
| 7 Trust / harm / governance | selected | IDEA-SC-07 |
| 8 Inclusion / locale | selected | IDEA-SC-08 |
| 9 Change / compatibility / reversibility | selected | IDEA-SC-09 |
| 10 Evidence / traceability / clarity | selected | IDEA-SC-10, IDEA-SC-12 |

Scale threshold: split this source under an index above 12 families or 40 selected category-by-type cells.

## IDEA-SC-01 — The artifact solves the root problem inside a locked boundary

- Primary category: 1 — the defining discrimination is outcome and scope.
- Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: positive purpose; counterfactual premise; adversarial scope-gaming.
- Source: Rules “problem and boundaries,” “genuine alternatives and preserve material user authority,” “unsupported framing, claim, choice, or detail,” and “accepted contract silently”; Procedure 2–3.
- Given: a user trigger, active project scopes, and a proposed design.
- When: the framing, cause chain, strongest do-nothing case, scope contract, and design are compared.
- Then: removing the stated cause would remove the need; design solves that cause; boundaries enumerate in, out, and deferred work; the user approved them.
- Failure oracle: the design solves an adjacent symptom, a success signal is unobservable, or open-ended wording admits undeclared work.
- Evidence: clause-to-design comparison and active-scope diff.
- Adversarial face: add a useful adjacent cleanup that fits under “related work”; the scope gate must reject it.
- Obligation: the canonical artifact must state one root-cause-aligned outcome and a refusable scope contract.
- Checklist: IDEA-CK-01.

## IDEA-SC-02 — Every affected actor can use the proposed outcome

- Primary category: 2 — actors and use context define the discrimination.
- Primary type: Alternative-valid. Secondary: Adversarial.
- Coverage role: positive alternative actor; adversarial hidden-stakeholder case.
- Source: Rules “problem and boundaries” and “complete observable design”; Procedure 2 and 6–8.
- Given: primary users, operators, maintainers, approvers, and affected consumers.
- When: each actor's goal, environment, constraint, and authority are traced through the design.
- Then: every material actor has a supported path or explicit exclusion with user authority.
- Failure oracle: an intended reader, caller, operator, or maintainer needs private context or lacks a required decision path.
- Evidence: actor-to-outcome ledger and cold-consumer read.
- Adversarial face: surface a non-primary operator affected only during failure; the artifact must not omit that actor.
- Obligation: the design must name affected actors and their usable outcomes.
- Checklist: IDEA-CK-02.

## IDEA-SC-03 — State and data behavior is explicit at exact boundaries

- Primary category: 3 — state transition and data lifecycle are defining.
- Primary type: Boundary. Secondary: Negative.
- Coverage role: positive handled transition; exact boundary; invalid-state rejection.
- Source: Rules “complete observable design” and “canonical artifact current and traceable”; Procedure 6–9.
- Given: the main input classes and pre/post states.
- When: empty, one, many, below, at, and above each finite boundary are considered.
- Then: valid transitions, invariants, rejected states, and prohibited side effects are explicit.
- Failure oracle: a boundary is “near” the limit, invalid input mutates state, or retention and deletion are unspecified.
- Evidence: state diagram or table plus case-to-obligation traces.
- Adversarial face: a cosmetically valid record violates an invariant after the first transition.
- Obligation: the design must define state and data invariants with exact edge behavior.
- Checklist: IDEA-CK-03.

## IDEA-SC-04 — Components have one owner and acyclic contracts

- Primary category: 4 — interface and dependency structure define the case.
- Primary type: Positive. Secondary: Failure/recovery, adversarial.
- Coverage role: positive contract; dependency failure; adversarial coupling.
- Source: Rules “material claims and load-bearing assumptions,” “complete observable design,” “this operation and its owned companions,” “canonical artifact current and traceable,” and “unsupported framing, claim, choice, or detail”; Procedure 4–7.
- Given: proposed components, interfaces, dependencies, and data flow.
- When: ownership, call direction, failure propagation, and test seams are traced.
- Then: each concern has one owner, interfaces are consumer-readable, dependencies are acyclic, and failure is contained.
- Failure oracle: two owners share a concern, a coordinator touches everything, or an external failure has no boundary.
- Evidence: component and dependency map compared with project patterns.
- Adversarial face: insert a “helper” that creates a hidden reverse dependency; the structure check must fail.
- Obligation: the design must name owned components, acyclic interfaces, and verification seams.
- Checklist: IDEA-CK-04.

## IDEA-SC-05 — Scale, resources, and recurring cost have bounds

- Primary category: 5 — resource economics define the discrimination.
- Primary type: Boundary. Secondary: Failure/recovery.
- Coverage role: positive budget; exact capacity boundary; slow-call recovery.
- Source: Rules “material claims and load-bearing assumptions” and “complete observable design”; Procedure 8.
- Given: variable volume, external calls, memory, storage, or paid resources.
- When: ordinary load, expected growth, the exact capacity edge, and slow or failed dependencies are modeled.
- Then: dominant cost, call pattern, measurement, budget, and refusal or degradation behavior are explicit.
- Failure oracle: “should be fine” replaces measurement, an N+1 path is possible, or recurring spend has no ceiling.
- Evidence: order-of-magnitude estimate and planned measurement.
- Adversarial face: realistic-scale input multiplies one paid call per item.
- Obligation: the design must state scale assumptions, resource bounds, and measurement commitments.
- Checklist: IDEA-CK-05.

## IDEA-SC-06 — Failure is detected, contained, recoverable, and diagnosable

- Primary category: 6 — handled failure and recovery are defining.
- Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: positive containment; injected failure; timeout boundary.
- Source: Rule “complete observable design”; Procedure 8.
- Given: dependency outage, timeout, interruption, partial mutation, and invalid recovery input.
- When: each failure is injected before, during, and after the mutation boundary.
- Then: detection, containment, rollback or safe continuation, ownership, logging, and alerting are named.
- Failure oracle: retry is unbounded, rollback requires perfect coordination, or a 3am operator cannot identify the failing component.
- Evidence: failure matrix and recovery/observability obligations.
- Adversarial face: a partial write reports success while one dependent update failed.
- Obligation: every material failure must have detection, containment, recovery, and diagnosis.
- Checklist: IDEA-CK-06.

## IDEA-SC-07 — Trust, privacy, authority, and licensing remain controlled

- Primary category: 7 — harm and governance define the case.
- Primary type: Adversarial. Secondary: Negative.
- Coverage role: positive safe rejection; adversarial abuse; invalid-authority rejection.
- Source: Rules “material claims and load-bearing assumptions,” “genuine alternatives and preserve material user authority,” “complete observable design,” and “unsupported framing, claim, choice, or detail”; Procedure 4–8.
- Given: untrusted input, privileged action, sensitive data, destructive action, and borrowed external material.
- When: an unauthorized actor attempts the path and retention, egress, license, and approval are inspected.
- Then: validation precedes privileged sinks, authority is explicit, data purpose and retention are bounded, and licenses are compatible.
- Failure oracle: an untrusted path reaches a sink, sensitive data persists without policy, or a material action lacks user authority.
- Evidence: trust-boundary and data-flow review plus license source.
- Adversarial face: a confident “no security change” hides a new command-construction path.
- Obligation: the design must bound trust, harm, authority, retention, and license surfaces.
- Checklist: IDEA-CK-07.

## IDEA-SC-08 — Inclusion and locale are dispositioned from inspected evidence

- Primary category: 8 — access and locale define the discrimination.
- Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: positive alternative input method; locale boundary.
- Source: Rule “complete observable design”; Procedure 8.
- Given: a user-facing surface, text, sorting, dates, numbers, input methods, or assistive technology.
- When: keyboard, screen reader, contrast, non-default locale, and alternate formats are considered.
- Then: applicable behavior is designed and testable, or inspected evidence supports a precise not-applicable reason.
- Failure oracle: pointer-only operation, hard-coded user text, or locale-sensitive behavior assumes one region.
- Evidence: accessibility and locale obligation ledger.
- Adversarial face: the happy path passes in English but changes ordering in another locale.
- Obligation: inclusion and locale behavior must be designed or explicitly disproven as applicable.
- Checklist: IDEA-CK-08.

## IDEA-SC-09 — Compatibility changes and reversal are explicit

- Primary category: 9 — lifecycle change and reversibility define the case.
- Primary type: Change/regression/compat. Secondary: Failure/recovery.
- Coverage role: positive compatible path; version change; failed rollback.
- Source: Rules “problem and boundaries,” “complete observable design,” “canonical artifact current and traceable,” and “accepted contract silently”; Procedure 3 and 8–9.
- Given: existing users, files, data, APIs, behavior, or mixed versions.
- When: before, during, after, rollback, and partial-upgrade states are compared.
- Then: compatibility promise, migration, go/no-go, rollback, and deliberate breaks are explicit.
- Failure oracle: existing consumers silently break, rollback is fictional, or a one-way action is not gated.
- Evidence: compatibility matrix and reversal plan.
- Adversarial face: a change labeled internal still has live callers outside the proposed scope.
- Obligation: every compatibility event must name affected consumers, migration, and reversal.
- Checklist: IDEA-CK-09.

## IDEA-SC-10 — A cold reader can trace every claim and obligation

- Primary category: 10 — evidence and clarity define the discrimination.
- Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: positive traceability; counterfactual unsupported premise; adversarial cosmetic completeness.
- Source: Rules “material claims and load-bearing assumptions,” “canonical artifact current and traceable,” “resolved, cold-readable result,” “unsupported framing, claim, choice, or detail,” and “accepted contract silently”; Procedure 1, 4, 9–10.
- Given: the canonical artifact without private discussion context.
- When: a cold reader resolves every term, source, decision, assumption, scenario, obligation, and check.
- Then: every reference resolves, traces close both ways, names stay stable, and no placeholder or uncited conclusion remains.
- Failure oracle: a claim cites no source, a scenario has no obligation, or a full-looking section contains no usable decision.
- Evidence: orphan sweep, link check, term search, and cold-read result.
- Adversarial face: a present but empty checklist makes the artifact look complete.
- Obligation: the artifact must be cold-readable and fully traceable.
- Checklist: IDEA-CK-10.

## IDEA-SC-11 — Domain evidence preserves one self-contained method

- Primary category: 4 — the defining discrimination is ownership and dependency structure between the base method and authoritative domain evidence.
- Primary type: Alternative-valid. Secondary: Adversarial.
- Coverage role: positive mixed-domain coverage; alternative project-only coverage; adversarial external-method dependency.
- Source: Rules “material claims and load-bearing assumptions,” “complete observable design,” “this operation and its owned companions,” and “unsupported framing, claim, choice, or detail”; Procedure 1, 4, and 6–8.
- Given: a request that may span project, interface, experience, software, and language-specific design, plus several candidate governing sources.
- When: the request, baseline, applicable concerns, and authority of each candidate source are classified.
- Then: this operation covers every applicable concern directly, uses only authoritative domain evidence, ignores irrelevant or unverified guidance, and completes without requiring another skill or procedure.
- Failure oracle: the operation cannot continue without another skill, imports an outside procedure as a missing step, omits an applicable concern, or lets a non-authoritative `DESIGN.md` or configuration file dictate the design.
- Evidence: input and domain register, authority assessment, source-to-decision trace, and cold-load result.
- Adversarial face: present a polished but non-authoritative design document and an unrelated external method; neither may become governing merely because it exists.
- Obligation: the design must preserve one complete Ideation method while grounding specialized decisions in authoritative evidence.
- Checklist: IDEA-CK-11.

## IDEA-SC-12 — A validation plan is not represented as produced evidence

- Primary category: 10 — the defining discrimination is whether evidence status is represented truthfully.
- Primary type: Counterfactual. Secondary: Adversarial.
- Coverage role: positive evidence distinction; counterfactual load-bearing assumption; adversarial artifact theater.
- Source: Rules “material claims and load-bearing assumptions,” “canonical artifact current and traceable,” and “resolved, cold-readable result”; Procedure 4, 8, and 10.
- Given: a material assumption whose best later validation may use a walkthrough, prototype, experiment, code spike, benchmark, or representative-user study.
- When: current evidence, remaining uncertainty, and the proposed validation approach are recorded.
- Then: the artifact distinguishes existing evidence from future evidence and names the question, method or artifact, participants or environment, pass and fail signals, reopen condition, owner, and execution condition without claiming the output was created.
- Failure oracle: a proposed prototype or spike is cited as completed evidence, the base procedure creates a realization output, or the artifact omits how the assumption will be tested and reopened.
- Evidence: evidence ledger, validation plan, artifact inventory, and cold-reader classification of every evidence claim.
- Adversarial face: add a polished prototype heading with no artifact or test record; the completion check must treat it as future work, not proof.
- Obligation: every planned validation must remain clearly separate from produced evidence and must carry a followable execution contract.
- Checklist: IDEA-CK-12.

## Omission sweep

Every load-bearing rule and Procedure boundary maps to at least one seed. Every seed maps to one obligation and one checklist item. Target-specific obligations discovered during a run must be added to the filled frame before review; they do not change this source.
