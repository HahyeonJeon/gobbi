# Ideation Scenarios

This source exercises the obligations in [SKILL.md](SKILL.md) for the three-document Ideation result. It adds no Ideation policy. Evaluators select applicable cases and may add target-specific cases without weakening these seeds.

## Coverage Register

| Category | Disposition | Seed families |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | IDEA-SC-01, IDEA-SC-13, IDEA-SC-14, IDEA-SC-16 |
| 2 Actors / stakeholders / use-context | selected | IDEA-SC-02, IDEA-SC-08, IDEA-SC-16 |
| 3 Behavior / state / data | selected | IDEA-SC-03, IDEA-SC-05, IDEA-SC-06, IDEA-SC-09 |
| 4 Interfaces / dependencies / structure | selected | IDEA-SC-04, IDEA-SC-06, IDEA-SC-07, IDEA-SC-09, IDEA-SC-11, IDEA-SC-14 |
| 5 Quality attributes / resource economics | selected | IDEA-SC-05 |
| 6 Failure / recovery / operations | selected | IDEA-SC-02, IDEA-SC-04, IDEA-SC-06, IDEA-SC-09 |
| 7 Trust / harm / governance | selected | IDEA-SC-01, IDEA-SC-02, IDEA-SC-07 |
| 8 Inclusion / locale | selected | IDEA-SC-08 |
| 9 Change / compatibility / reversibility | selected | IDEA-SC-09, IDEA-SC-13, IDEA-SC-15, IDEA-SC-16 |
| 10 Evidence / traceability / clarity | selected | IDEA-SC-01, IDEA-SC-10, IDEA-SC-11, IDEA-SC-12, IDEA-SC-13, IDEA-SC-14, IDEA-SC-15, IDEA-SC-16 |

## Category-by-Type Frame

| Family | Primary type | Additional exercised types | Adversarial face |
|---|---|---|---|
| IDEA-SC-01 | Positive | Counterfactual | undeclared adjacent outcome |
| IDEA-SC-02 | Alternative-valid | Adversarial | hidden failure-time actor |
| IDEA-SC-03 | Boundary | Negative | invariant-breaking valid-looking state |
| IDEA-SC-04 | Positive | Failure/recovery | shared ownership and dependency cycle |
| IDEA-SC-05 | Boundary | Counterfactual through dedicated case IDEA-SC-05-B | unsupported scale claim |
| IDEA-SC-06 | Failure/recovery | Boundary through dedicated case IDEA-SC-06-B | recovery that hides partial mutation |
| IDEA-SC-07 | Adversarial | Negative | authority or retention bypass |
| IDEA-SC-08 | Alternative-valid | Boundary | unjustified generic not-applicable claim |
| IDEA-SC-09 | Change/regression | Failure/recovery through dedicated case IDEA-SC-09-B | irreversible migration presented as reversible |
| IDEA-SC-10 | Adversarial | Positive | complete-looking orphaned content |
| IDEA-SC-11 | Alternative-valid | Adversarial | polished non-authoritative source |
| IDEA-SC-12 | Counterfactual | Adversarial through dedicated case IDEA-SC-12-B | planned output presented as current proof |
| IDEA-SC-13 | Negative | Change/regression | mechanism disguised as a requirement |
| IDEA-SC-14 | Negative | Adversarial | provisional topics survive token study and gap review unchanged |
| IDEA-SC-15 | Change/regression | Adversarial through dedicated case IDEA-SC-15-B | post-freeze byte edit |
| IDEA-SC-16 | Adversarial | Positive | transcript or cross-file pointer presented as final synthesis |

Every selected category has a positive handled discrimination in at least one family. One case discharges one triggered minimum; the five named dedicated cases keep independently constructible minima separate. Exact-boundary, failure/recovery, adversarial, change, and counterfactual minima are exercised where their triggers apply; target-specific triggers discovered during evaluation require additional cases.

Scale threshold: split this source under an index above 16 families or 48 selected category-by-type cells.

## IDEA-SC-01 — The result solves the root problem inside an approved boundary

- **Primary category:** 1 — the defining discrimination is whether the intended outcome and scope solve the actual problem.
- **Secondary categories:** 7 Trust / harm / governance for material user authority; 10 Evidence / traceability / clarity for approval and problem-to-design proof.
- **Primary type:** Positive — the ordinary result must align cause, outcome, success, and scope.
- **Coverage role:** Positive; counterfactual by testing the do-nothing case and premise.
- **Source:** Principle “Question the user without hesitation until the idea is complete”; Principle “Find the best idea by comparing reference-backed alternatives”; Rule “MUST preserve material user authority”; Rule “NEVER change the accepted contract silently”; Phase 1 and Phase 3.
- **Given:** a user trigger, current reality, active scope, strongest credible do-nothing outcome, and a proposed final design.
- **When:** the root cause, desired outcome, success and falsification signals, final scope, and selected design are compared.
- **Then:** removing the stated cause would remove the need, the design addresses that cause, the signals are observable, and every included, excluded, deferred, or rejected outcome has user-approved boundaries.
- **Failure oracle:** the design solves an adjacent symptom, relies on an untested premise without a reopen condition, or admits undeclared work.
- **Evidence tuple:** inspect the final problem definition, scope tables, decision rationale, and supporting-draft changes; alignment and approval evidence confirm the outcome.
- **Adversarial face:** add a useful adjacent cleanup under a broad phrase such as “related work”; the case fails unless it is explicitly approved in scope.
- **Obligation:** the result states one root-cause-aligned outcome and a refusable, user-approved scope contract.
- **Checklist family:** IDEA-CK-01; atomic items IDEA-CK-01A through IDEA-CK-01D.

## IDEA-SC-02 — Every affected actor has a usable outcome or approved exclusion

- **Primary category:** 2 — actors and use context define the discrimination.
- **Secondary categories:** 6 Failure / recovery / operations for the failure-time actor; 7 Trust / harm / governance for actor authority.
- **Primary type:** Alternative-valid — materially different actors must each have a valid path.
- **Coverage role:** Alternative-valid; adversarial through a hidden stakeholder.
- **Source:** Principle “Question the user without hesitation until the idea is complete”; Rule “MUST preserve material user authority”; Phase 1 and Phase 3.
- **Given:** primary users, operators, maintainers, approvers, affected consumers, and their environments and authority.
- **When:** each actor is traced from the problem through requirements, topic decisions, resulting design, and failure handling.
- **Then:** every material actor has a named responsibility and usable outcome or an explicit exclusion approved by the user.
- **Failure oracle:** an intended reader, caller, operator, or maintainer needs private context or lacks a required path or authority.
- **Evidence tuple:** inspect actor tables and actor-to-design traces; a cold-consumer read confirms each path.
- **Adversarial face:** surface an operator affected only during failure; the case fails if the actor appears nowhere in the design.
- **Obligation:** the result names all affected actors, their authority, and their usable outcomes.
- **Checklist family:** IDEA-CK-02; atomic items IDEA-CK-02A through IDEA-CK-02B.

## IDEA-SC-03 — State and data behavior is explicit at exact boundaries

- **Primary category:** 3 — state transitions and data lifecycle define the case.
- **Secondary categories:** none.
- **Primary type:** Boundary — the discrimination sits at exact input and lifecycle edges.
- **Coverage role:** Boundary; negative through invalid-state rejection.
- **Source:** Principle “Discuss the design through a hierarchy of topics”; Phase 2 completeness audit; Phase 3 integrated design.
- **Given:** the material input classes, preconditions, lifecycle states, invariants, and finite limits.
- **When:** empty, one, many, below, at, and above each applicable limit and every valid or invalid transition are inspected.
- **Then:** accepted transitions, prohibited side effects, ownership, retention, deletion, and invalid-state handling are explicit.
- **Failure oracle:** a boundary is described only as “near” a limit, invalid input mutates state, or data ownership or deletion is unspecified.
- **Evidence tuple:** inspect state diagrams or tables and exact-boundary decisions; case-to-design traces confirm every edge.
- **Adversarial face:** present a cosmetically valid record that violates an invariant after its first transition; the case must reject it.
- **Obligation:** the design defines state and data invariants with exact edge behavior.
- **Checklist family:** IDEA-CK-03; atomic items IDEA-CK-03A through IDEA-CK-03C.

## IDEA-SC-04 — Components have one owner and consumer-readable acyclic contracts

- **Primary category:** 4 — ownership, interfaces, and dependency structure define the case.
- **Secondary categories:** 6 Failure / recovery / operations for dependency-failure containment.
- **Primary type:** Positive — the ordinary structure must be understandable and coherent.
- **Coverage role:** Positive; failure/recovery through dependency failure.
- **Source:** Principles “Study trustworthy prior art before designing” and “Discuss the design through a hierarchy of topics”; Rule “MUST complete Ideation from this operation and its owned companions”; Phase 2 and Phase 3.
- **Given:** proposed components, responsibilities, interfaces, dependencies, flows, and established project patterns.
- **When:** ownership, call direction, consumer understanding, failure propagation, and test seams are traced.
- **Then:** each concern has one owner, each interface is understandable without reading internals, dependencies are acyclic, dependency failure remains contained, and every contract exposes a usable verification seam.
- **Failure oracle:** a concern has zero or multiple owners, an interface depends on private implementation context, the dependency graph contains a cycle, dependency failure escapes its boundary, or a contract has no usable verification seam.
- **Evidence tuple:** inspect ownership, interface, dependency, failure-propagation, and verification maps against authoritative project patterns; a consumer read, injected dependency-failure analysis, and direct verification-seam inspection confirm the contracts.
- **Adversarial face:** introduce a shared helper that silently becomes the owner of several concerns; the case fails on ambiguous ownership or coupling.
- **Obligation:** the design defines one owner per concern, consumer-readable and acyclic interfaces, contained dependency failure, and usable verification seams.
- **Checklist family:** IDEA-CK-04; atomic items IDEA-CK-04A through IDEA-CK-04E.

## IDEA-SC-05 — Resource behavior is bounded where scale varies

- **Primary category:** 5 — capacity, cost, and resource bounds are the defining discrimination.
- **Secondary categories:** 3 Behavior / state / data for exact input and capacity classes.
- **Primary type:** Boundary — the case tests exact scale and budget edges.
- **Coverage role:** Boundary.
- **Source:** Phase 2 completeness audit; Phase 3 integrated design and quality coverage.
- **Given:** variable work, external calls, recurring cost, or another scale-sensitive resource.
- **When:** zero, one, expected, maximum, and just-over-maximum loads are evaluated with dominant costs and measurement plans.
- **Then:** limits, refusal or degradation behavior, batching, timeouts, retries when applicable, and evidence needed to verify estimates are explicit.
- **Failure oracle:** the result says “fast,” “scalable,” or “cheap” without an estimate, exact bound, behavior beyond the bound, or measurement commitment.
- **Evidence tuple:** inspect resource estimates, call counts, limits, and validation commitments; boundary calculations confirm the claims.
- **Adversarial face:** assert a favorable scale assumption with no source and make it load-bearing; the counterfactual must reopen the design.
- **Obligation:** the design bounds material resource behavior and defines how claims will be measured.
- **Checklist family:** IDEA-CK-05; atomic items IDEA-CK-05A through IDEA-CK-05D.

### IDEA-SC-05-B — A false scale premise reopens the resource design

- **Primary type:** Counterfactual — the discrimination inverts a load-bearing scale assumption independently of an exact capacity boundary.
- **Coverage role:** Counterfactual.
- **Given:** a design whose resource direction depends on an evidenced expected-load assumption.
- **When:** credible contrary evidence shows that expected load is materially higher or more expensive than assumed while the exact configured limit remains unchanged.
- **Then:** the resource recommendation, beyond-limit behavior, and measurement plan reopen instead of preserving the invalid direction.
- **Failure oracle:** the design keeps its resource conclusion after the premise that justified it is false.
- **Evidence tuple:** compare the original assumption, contrary source, and reopened decision; changed reasoning confirms the counterfactual response.
- **Obligation trace:** this case supports the IDEA-SC-05 obligation and IDEA-CK-05 without discharging the primary boundary case.

## IDEA-SC-06 — Material failures are detectable, contained, recoverable, owned, and diagnosable

- **Primary category:** 6 — failure handling and recovery define the case.
- **Secondary categories:** 3 Behavior / state / data for partial-state transitions; 4 Interfaces / dependencies / structure for dependency failure.
- **Primary type:** Failure/recovery — the case injects interruption, dependency failure, or partial mutation.
- **Coverage role:** Failure/recovery.
- **Source:** Phase 2 completeness audit; Phase 3 integrated design and quality coverage.
- **Given:** each dependency, persistence boundary, asynchronous action, interruption point, and partial-mutation risk.
- **When:** failure is injected before work, at the first partial state, and after the last reversible state.
- **Then:** detection, containment, retry or rollback, terminal state, owner, operator signal, and diagnosis are explicit.
- **Failure oracle:** failure leaves ambiguous or corrupt state, retries without a bound, loses the original cause, or has no recovery owner.
- **Evidence tuple:** inspect the failure matrix and flows; injected-failure walkthroughs confirm state and operator outcomes.
- **Adversarial face:** present a recovery that returns success while leaving partial mutation; the case must fail.
- **Obligation:** every material failure has a bounded, observable recovery and named owner.
- **Checklist family:** IDEA-CK-06; atomic items IDEA-CK-06A through IDEA-CK-06E.

### IDEA-SC-06-B — Recovery behavior is explicit at exact state boundaries

- **Primary type:** Boundary — the discrimination sits exactly at the first partial state and last reversible state.
- **Coverage role:** Boundary.
- **Given:** one operation with a first partial state and a last reversible state.
- **When:** failure occurs immediately before, exactly at, and immediately after each boundary.
- **Then:** the resulting state, allowed recovery, terminal outcome, and prohibited side effects are distinct and explicit.
- **Failure oracle:** two adjacent boundary cases collapse into the same unspecified state or permit different side effects without explanation.
- **Evidence tuple:** inspect the state and failure matrix at each exact transition; distinct recorded outcomes confirm the boundary.
- **Obligation trace:** this case supports the IDEA-SC-06 obligation and IDEA-CK-06 without discharging the primary failure/recovery case.

## IDEA-SC-07 — Trust, authority, privacy, governance, and licensing remain controlled

- **Primary category:** 7 — abuse, harm, and authority surfaces define the case.
- **Secondary categories:** 4 Interfaces / dependencies / structure for external-service and trust-boundary contracts.
- **Primary type:** Adversarial — the case attempts to cross a trust or authority boundary.
- **Coverage role:** Adversarial; negative through safe rejection.
- **Source:** Principle “Study trustworthy prior art before designing”; Rule “MUST preserve material user authority”; Phase 2 source assessment and completeness audit; Phase 3 quality coverage.
- **Given:** untrusted input, sensitive or retained data, privileged or destructive action, external service, governing obligation, and reusable prior art when applicable.
- **When:** an unauthorized actor, malformed source, retention conflict, destructive request, or incompatible license is introduced.
- **Then:** validation precedes privileged use, user authority remains explicit, retention and privacy are bounded, and incompatible use is rejected.
- **Failure oracle:** the design grants authority by implication, retains sensitive data without policy, performs a destructive action without approval, or adopts incompatible material.
- **Evidence tuple:** inspect trust and data flows, authority decisions, source assessments, and license evidence; rejection paths confirm control.
- **Adversarial face:** route a privileged action through a nominally trusted component to bypass the user decision; the case must still reject it.
- **Obligation:** the design controls every applicable trust, authority, privacy, governance, and licensing surface.
- **Checklist family:** IDEA-CK-07; atomic items IDEA-CK-07A through IDEA-CK-07I.

## IDEA-SC-08 — Inclusion and locale concerns receive evidence-backed dispositions

- **Primary category:** 8 — access and locale needs define the discrimination.
- **Secondary categories:** 2 Actors / stakeholders / use-context for affected users and access environments.
- **Primary type:** Alternative-valid — a different access method, language, format, or locale remains a valid use class.
- **Coverage role:** Alternative-valid; boundary at locale or format transitions.
- **Source:** Phase 2 completeness audit; Phase 3 quality coverage.
- **Given:** user-facing or locale-sensitive behavior and the affected actors.
- **When:** applicable keyboard, assistive, language, format, culture, timezone, and locale variants are inspected.
- **Then:** every applicable need has a design obligation and testable outcome; every not-applicable disposition names the inspected property that excludes it.
- **Failure oracle:** the result uses a generic “not applicable,” assumes one locale or input method, or leaves an affected actor without access.
- **Evidence tuple:** inspect the access and locale ledger and actor paths; representative variants confirm the disposition.
- **Adversarial face:** hide an access need behind “technical users”; the case fails unless evidence proves non-applicability.
- **Obligation:** the design covers applicable inclusion and locale needs with testable outcomes.
- **Checklist family:** IDEA-CK-08; atomic items IDEA-CK-08A through IDEA-CK-08G.

## IDEA-SC-09 — Existing consumers and data have an explicit compatibility and reversal path

- **Primary category:** 9 — lifecycle change, migration, and planned reversal define the case.
- **Secondary categories:** 3 Behavior / state / data for migrated state; 4 Interfaces / dependencies / structure for consumer contracts; 6 Failure / recovery / operations for failed migration.
- **Primary type:** Change/regression — the case compares before, during, and after a change.
- **Coverage role:** Change/regression.
- **Source:** Rule “NEVER change the accepted contract silently”; Phase 1 constraints; Phase 2 completeness audit; Phase 3 integrated design.
- **Given:** existing users, data, files, interfaces, APIs, or behavior that the design may change.
- **When:** pre-change, mixed, migrated, failed-migration, rollback, and post-change states are compared.
- **Then:** compatibility promises, migration ownership, one-way gates, rollback limits, and reopen conditions are explicit and user-approved when material.
- **Failure oracle:** an existing consumer breaks silently, a migration has no failure state, or an irreversible action is presented as reversible.
- **Evidence tuple:** inspect compatibility matrices and migration flows against existing consumers; transition walkthroughs confirm each state.
- **Adversarial face:** label a destructive migration “rollback” even though original information is lost; the case must fail.
- **Obligation:** the design states how existing consumers and data move safely through change and reversal.
- **Checklist family:** IDEA-CK-09; atomic items IDEA-CK-09A through IDEA-CK-09I.

### IDEA-SC-09-B — A failed migration reaches a controlled recovery state

- **Primary type:** Failure/recovery — the discrimination is the injected migration failure and its containment.
- **Coverage role:** Failure/recovery.
- **Given:** a compatible pre-change state and a migration that can fail after partial progress.
- **When:** failure is injected after the first mutation but before the migration commits.
- **Then:** the failure is detected, partial effects are contained, the supported recovery or rollback runs, and existing consumers receive a diagnosable terminal state.
- **Failure oracle:** the design leaves mixed data, silently breaks an existing consumer, or calls an information-losing action a rollback.
- **Evidence tuple:** inspect the migration failure path, before/after data, and consumer-visible signals; restored invariants confirm recovery.
- **Obligation trace:** this case supports the IDEA-SC-09 obligation and IDEA-CK-09 without discharging the primary change/regression case.

## IDEA-SC-10 — The result is cold-readable and fully traceable without artificial IDs

- **Primary category:** 10 — evidence, traceability, and clarity define the case.
- **Secondary categories:** none.
- **Primary type:** Adversarial — a cosmetically complete bundle attempts to hide orphans and placeholders.
- **Coverage role:** Adversarial; positive through a successful cold read.
- **Source:** Principle “Question the user without hesitation until the idea is complete”; Rule “NEVER change the accepted contract silently”; all three phases and templates.
- **Given:** the returned `requirements.md`, `topics.md`, and `ideation.md` without private discussion context.
- **When:** a cold reader resolves every term, source, descriptive heading path, requirement, topic, decision, design consequence, risk, validation commitment, and supporting-draft change.
- **Then:** links resolve, names remain stable, traces close in both directions, and no placeholder, unsupported conclusion, or artificial trace ID remains.
- **Failure oracle:** a source does not support its claim, a decision has no requirement or resulting design, a heading path is stale, or present-looking content is empty.
- **Evidence tuple:** run link, placeholder, retired-ID, and orphan sweeps plus a cold read; complete resolution confirms the case.
- **Adversarial face:** add a full-looking table whose rows do not trace to decisions; the case must fail.
- **Obligation:** all three documents are readable alone and the final synthesis has closed descriptive-heading traceability.
- **Checklist family:** IDEA-CK-10; atomic items IDEA-CK-10A through IDEA-CK-10E.

## IDEA-SC-11 — Authoritative domain evidence supports one self-contained Ideation method

- **Primary category:** 4 — the ownership boundary between the Ideation method and domain evidence defines the case.
- **Secondary categories:** 10 Evidence / traceability / clarity for source authority and cold-load proof.
- **Primary type:** Alternative-valid — project-only, software, interface, experience, and mixed-domain ideas are all valid inputs.
- **Coverage role:** Alternative-valid; adversarial through a polished non-authoritative source.
- **Source:** Principle “Study trustworthy prior art before designing”; Rule “MUST complete Ideation from this operation and its owned companions”; Phase 2.
- **Given:** a request spanning one or more domains and several candidate internal and external sources.
- **When:** source authority, relevance, currency, applicability, and licensing are assessed and the method is followed.
- **Then:** the three phases cover every applicable concern directly, use specialized sources as evidence, reject irrelevant or non-authoritative guidance, and require no outside procedure.
- **Failure oracle:** completion depends on another skill, a polished file governs without authority, or an applicable domain concern disappears.
- **Evidence tuple:** inspect the source assessments, topic derivation, and cold-load path; authoritative evidence and complete in-skill actions confirm the case.
- **Adversarial face:** supply an attractive but obsolete or non-governing design document; the case fails if its existence alone makes it authoritative.
- **Obligation:** Ideation remains self-contained while grounding domain choices in assessed authoritative evidence.
- **Checklist family:** IDEA-CK-11; atomic items IDEA-CK-11A through IDEA-CK-11C.

## IDEA-SC-12 — Future validation is never represented as current evidence

- **Primary category:** 10 — truthful evidence status defines the case.
- **Secondary categories:** none.
- **Primary type:** Counterfactual — the case inverts a load-bearing assumption and checks the planned response.
- **Coverage role:** Counterfactual.
- **Source:** Phase 3 current-versus-future evidence boundary and completion checks.
- **Given:** a material assumption best tested later by a walkthrough, prototype, experiment, code spike, benchmark, user study, or another realization.
- **When:** current evidence, remaining uncertainty, validation question, proposed method or artifact, participants or environment, pass and fail signals, owner, execution condition, and reopen condition are inspected.
- **Then:** the final document describes the work only as future validation and records the question, method or artifact, participants or environment, pass and fail signals, owner, execution condition, reopen condition, and response when the premise is false.
- **Failure oracle:** a planned output is cited as completed proof, the Ideation result contains a produced realization, any required validation field is absent, or the validation contract cannot be followed.
- **Evidence tuple:** inspect evidence classifications, artifact inventory, and every validation-table field; absence of produced-output claims and presence of the complete eight-field future contract confirm the case.
- **Adversarial face:** add a polished “prototype” heading without an actual tested artifact; the case must reject it as evidence.
- **Obligation:** every planned validation stays distinct from current evidence and records its question, method or artifact, participants or environment, pass and fail signals, owner, execution condition, and reopen condition.
- **Checklist family:** IDEA-CK-12; atomic items IDEA-CK-12A through IDEA-CK-12I.

### IDEA-SC-12-B — Artifact theater cannot satisfy the evidence boundary

- **Primary type:** Adversarial — a cosmetically complete validation claim attempts to pass without produced evidence.
- **Coverage role:** Adversarial.
- **Given:** a polished prototype, experiment, benchmark, spike, or study heading with no inspected artifact or result.
- **When:** the claim is used to support a material design decision.
- **Then:** the evaluator classifies it as future validation or missing evidence and refuses the current-evidence claim.
- **Failure oracle:** presentation quality, a placeholder result, or creator assertion is accepted as proof.
- **Evidence tuple:** inspect the artifact inventory and cited result; absence of a produced, inspected output confirms the adversarial attempt.
- **Obligation trace:** this case supports the IDEA-SC-12 obligation and IDEA-CK-12 without discharging the primary counterfactual case.

## IDEA-SC-13 — Requirements are solution-neutral, approved, and frozen before topic preparation

- **Primary category:** 1 — the problem and requirement boundary defines the case.
- **Secondary categories:** 9 Change / compatibility / reversibility for the approval-to-freeze transition; 10 Evidence / traceability / clarity for approval chronology and digest proof.
- **Primary type:** Negative — a premature solution mechanism must be rejected as a requirement.
- **Coverage role:** Negative; change/regression through the freeze transition.
- **Source:** Phase 1; [requirements template](templates/requirements.md).
- **Given:** a user trigger that proposes a mechanism before the root problem, outcomes, and constraints are complete.
- **When:** `requirements.md` is reviewed immediately before Phase 2 begins.
- **Then:** every material statement is visibly classified as a fact, user report, assumption, contradiction, decision, or open question; each material requirement states an outcome or evidenced hard constraint; every contradiction is resolved or visible; user approval exists; the lifecycle notice is present; and the file freezes before any topic is prepared.
- **Failure oracle:** a material statement lacks one of the six classifications, a preferred implementation is disguised as a requirement, topics exist before approval, or the supporting file remains editable after the transition.
- **Evidence tuple:** inspect the complete material-statement register, requirements wording, approval evidence, topic chronology, and file digest at freeze; six-way classification, solution neutrality, and stable timing confirm the case.
- **Adversarial face:** rename a proposed mechanism as a “constraint” without evidence; the case must reject it.
- **Obligation:** Ideation visibly classifies every material statement into one of the six parent types and freezes a complete solution-neutral requirements contract before preparing topics.
- **Checklist family:** IDEA-CK-13; atomic items IDEA-CK-13A through IDEA-CK-13L.

## IDEA-SC-14 — Progressive topic preparation closes study and coverage gaps

- **Primary category:** 10 — source-grounded derivation and chronology define the case.
- **Secondary categories:** 1 Purpose / outcomes / scope for requirement coverage; 4 Interfaces / dependencies / structure for the topic hierarchy and its dependencies.
- **Primary type:** Negative — a topic agenda that skips a study or revision pass must be rejected.
- **Coverage role:** Negative; adversarial through a fixed inherited taxonomy.
- **Source:** Principle “Study trustworthy prior art before designing”; Phase 2; [topics template](templates/topics.md).
- **Given:** frozen requirements, provisional top-level topics, available project materials, external prior art, and a tempting pre-existing topic taxonomy.
- **When:** topic origin, refinement chronology, source assessment, and final coverage are inspected.
- **Then:** provisional topics derive from the frozen requirements; internal study refines them; external study refines them again; a revision and supplementation pass identifies missing or weak topics, performs targeted additional study, and closes every material gap; each material source records authority, relevance, currency, applicability, disposition, and licensing when reuse may be affected; the resulting tree is visibly derived from the current requirements and findings; and every topic records its purpose, parent, dependencies, exact connected requirements, source basis, discussion questions, genuine alternatives, and completion condition.
- **Failure oracle:** the requirements are not frozen before provisional topics are drafted, either study pass is absent or token, the revision and supplementation pass is absent, a material missing or weak topic survives, the tree merely copies a fixed taxonomy, or any topic omits one of its eight required fields.
- **Evidence tuple:** inspect the freeze record, topic-preparation chronology, both source registers, requirement-and-source-to-topic derivation, coverage audit, and every field in each topic block; the ordered refinement passes, closed material gaps, source-backed differences from generic taxonomies, and complete topic tuples confirm the case.
- **Adversarial face:** populate the required headings with token sources and a cosmetic gap review after generating a fixed tree; the case must fail on semantic refinement and material coverage.
- **Obligation:** topic preparation progresses from frozen requirements through provisional topics, internal refinement, external refinement, and gap-driven revision before producing the complete eight-field topic hierarchy.
- **Checklist family:** IDEA-CK-14; atomic items IDEA-CK-14A through IDEA-CK-14G.

## IDEA-SC-15 — Frozen supporting drafts remain byte-stable while later learning changes only the final document

- **Primary category:** 9 — the lifecycle change from editable draft to frozen support defines the case.
- **Secondary categories:** 10 Evidence / traceability / clarity for digest stability and disclosed propagation.
- **Primary type:** Change/regression — the case compares file bytes before and after late learning.
- **Coverage role:** Change/regression.
- **Source:** Principle “Discuss the design through a hierarchy of topics”; Rule “NEVER change the accepted contract silently”; all three phases and all three templates.
- **Given:** approved digests for `requirements.md` and `topics.md`, followed by a late source, corrected requirement, child-to-parent contradiction, or emergent topic.
- **When:** the change is incorporated and final approval is requested.
- **Then:** both supporting digests remain identical; `ideation.md` records the change, evidence, material approval, affected branches, consequence, updated tree, and reopen decisions.
- **Failure oracle:** either supporting file changes by even one byte, the change is hidden, or a descendant changes without reopening and reconciling its ancestor.
- **Evidence tuple:** compare frozen and final digests and inspect “Changes from the Supporting Drafts” plus the final hierarchy; byte identity and explicit propagation confirm the case.
- **Adversarial face:** add a harmless approval stamp or typo fix to a frozen file; the case must still fail.
- **Obligation:** late learning changes only the final authority and never mutates a frozen supporting draft.
- **Checklist family:** IDEA-CK-15; atomic items IDEA-CK-15A through IDEA-CK-15D.

### IDEA-SC-15-B — A harmless-looking post-freeze edit is still rejected

- **Primary type:** Adversarial — the case attempts to bypass immutability with a cosmetically harmless change.
- **Coverage role:** Adversarial.
- **Given:** approved supporting-draft digests and a proposed approval stamp, status update, typo correction, or formatting cleanup.
- **When:** the proposed byte change is compared with the whole-file freeze contract.
- **Then:** the supporting edit is rejected and any material correction is recorded only in `ideation.md`.
- **Failure oracle:** intent, harmlessness, or formatting is accepted as permission to change a frozen byte.
- **Evidence tuple:** compare the proposed and frozen bytes and inspect the final change disclosure; digest stability confirms rejection.
- **Obligation trace:** this case supports the IDEA-SC-15 obligation and IDEA-CK-15 without discharging the primary change/regression case.

## IDEA-SC-16 — The returned bundle is independently readable and the final document is decision synthesis

- **Primary category:** 10 — artifact authority, completeness, and communication define the case.
- **Secondary categories:** 1 Purpose / outcomes / scope for complete returned outcome; 2 Actors / stakeholders / use-context for cold readers; 9 Change / compatibility / reversibility for supersession lifecycle.
- **Primary type:** Adversarial — pointers or transcript volume attempt to substitute for synthesis.
- **Coverage role:** Adversarial; positive through a complete three-document return.
- **Source:** Intro; Rule “MUST complete Ideation from this operation and its owned companions”; Phase 3; all three templates.
- **Given:** the complete pre-approval candidate containing frozen `requirements.md`, frozen `topics.md`, and evolving `ideation.md`.
- **When:** each file is read alone and the final document is compared with the full discussion.
- **Then:** each supporting draft includes its conditional supersession notice and enough context to stand alone; `ideation.md` remains evolving and states that only later final user approval grants authority and supersedes the drafts; the final document fully restates the contract and study foundation; every topic follows question, discussion, needed additional study, follow-up question, and decision until it is resolved or explicitly deferred; every material decision records its question, connected requirements, context and evidence, genuine alternatives with pros, cons, fit, risks, and consequences, recommendation, evidence that would change it, required user decision, selection, rationale, rejected alternatives, trade-offs, resulting design, and reopen condition; changes are disclosed; and no ordered implementation tasks or implementation diff appears.
- **Failure oracle:** the final document says “see requirements,” a topic jumps from its initial question to a decision despite an unresolved evidence gap, the hierarchy advances past an unresolved ancestor, any material decision field is missing, a transcript substitutes for synthesis, an ordered implementation task list or implementation diff appears, one file is absent, the contingent-authority statement is missing, or final approval or authority is claimed before evaluation passes.
- **Evidence tuple:** perform three isolated cold reads, inspect each topic-resolution sequence and hierarchy transition, compare every material discussion with the complete decision tuple, inspect the supporting-draft change disclosure and contingent-authority blocks, confirm no final approval is claimed, and sweep for ordered implementation tasks and implementation diffs; complete standalone meaning, iterative decision coverage, parent-first traversal, approval readiness, and a clean output boundary confirm the case.
- **Adversarial face:** provide every conversation turn and link to the drafts but omit a selected design or rationale; the case must fail.
- **Obligation:** Ideation resolves the evolving hierarchy through repeated question, discussion, needed study, follow-up, and decision cycles, then presents three independently readable documents whose pre-approval candidate contains the complete material-decision tuple, keeps final authority contingent on later approval, and contains no ordered implementation tasks or implementation diff.
- **Checklist family:** IDEA-CK-16; atomic items IDEA-CK-16A through IDEA-CK-16K.

## Omission Sweep

Every Principle, Rule, phase boundary, document lifecycle, and template contract maps to at least one seed. Every seed maps to one observable obligation and one checklist family whose atomic lettered items cover the obligation. Target-specific obligations discovered during a run must be added to the filled evaluation frame before review; they do not change this source.
