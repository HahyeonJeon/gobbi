---
name: ux
description: Use when designing one complete observable user outcome across surfaces, from direct user research and an evidence-based experience specification through a tested disposable prototype and measurement handoff.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# User Experience Design

Operation skill for designing one complete observable user outcome across web, command-line, desktop,
mobile, voice, and future surfaces. A run starts with current evidence and direct generative research, grows
one experience specification in controlled stages, then tests a disposable prototype with representative
users. Load it when the outcome, flow, tasks, information, content intent, states, recovery, trust, or success
evidence must be designed.

This skill is independently loadable. It does not require or outrank a `ui` skill. When both are loaded, UX
owns the outcome and experience contract; UI may own its surface realization. Neither wins by load order.

---

## Principles

> **Design one complete user outcome, not an isolated artifact.**

A screen, command, component, or happy path has value only as part of an outcome a person can finish. Design
from entry through completion, including every actor, state, failure, recovery, handoff, and support step the
outcome needs. Keep adjacent outcomes outside the run so depth is not traded for breadth.

> **Direct evidence has priority over confident assumptions.**

People's observed behavior, context, needs, barriers, and prototype use are stronger evidence than stakeholder
preference or design convention. Research must be ethical, representative of the claim, and explicit about its
limits. Missing evidence stays visible; it is never converted into certainty by polished prose.

> **Set the whole frame from the top, then grow every detail from the bottom.**

First establish the experience skeleton so each local choice has a place and purpose. Then start with the
smallest meaningful task, information, content, and state unit, and grow complete paths one verified step at a
time. A locally elegant unit that breaks the whole experience is wrong.

> **Finish the specification before using a prototype to answer questions.**

A partial design tested too early locks attention onto the first visible solution and hides missing paths. The
whole experience specification must be complete and user-approved before a prototype is made. The prototype
then tests the specification's riskiest assumptions; it does not substitute for them.

> **Project identity guides the design from the foundation.**

Identity is the product's promise, character, voice, values, existing language, and recognizable system. Use
it to constrain the experience from the start, while resolving conflicts with user evidence, accessibility,
safety, and platform conventions openly. Identity never excuses avoidable exclusion or harm.

> **Acceptance requires evidence from the people affected.**

Stakeholder approval can lock product intent, but it cannot prove that representative users understand, can
complete, or can recover through the experience. A design is accepted only after direct prototype evaluation
supports the claims being made and affected findings have been resolved and retested.

---

## Rules

### Must-Follow

- **UX-R1 — MUST bind one complete observable outcome per run.** Name the primary actor, necessary supporting
  actors, trigger, entry, completion evidence, normal and alternative paths, applicable states, errors,
  recovery, handoffs, support, scope, and non-goals. A screen, page, command, component, artifact, or happy path
  is not an outcome. An adjacent outcome enters only after the user changes the scope contract.
- **UX-R2 — MUST obtain new direct generative research from representative users before design convergence.**
  Prior research, analytics, support records, domain expertise, and stakeholder input may frame the inquiry but
  never replace new contact for the run. A project owner counts only when evidence shows that person is
  genuinely representative of the relevant user context.
- **UX-R3 — MUST obtain direct representative-user prototype evaluation before acceptance.** The evaluator
  plans method, sample, accommodations, and claims from the research question, diversity, uncertainty, and
  risk; this skill sets no fixed participant count. Prior usability results do not replace a new run's test.
- **UX-R4 — MUST protect research participants and evidence.** Obtain informed consent, provide needed
  accommodations, minimize and protect collected data, state limits, and avoid coercive or performative
  research. If access to representative users, consent, accommodations, or required evidence is missing, return
  `NEEDS_CONTEXT`; assumptions and a research plan may be recorded, but no final design may be called accepted.
- **UX-R5 — MUST establish project identity through one evidence chain.** Use, in order: explicit `DESIGN.md`,
  brand, product, or design-system documents; the live product, system, and tokens; then a user-confirmed
  temporary identity brief. When material is missing, ask the kinds of questions those documents would answer
  and capture a run-scoped brief in the feature design document. Do not create or prescribe a universal
  project-wide `DESIGN.md`.
- **UX-R6 — MUST follow the construction order without skipping or rearranging it.** Bind outcome and context;
  establish reference, identity, and direct-research foundation; create the top-down experience skeleton; grow
  the specification bottom-up; compare concepts; complete and obtain approval for the whole specification;
  then prototype; test; revise the specification first and prototype second; retest; and hand off with
  measurement. A prototype before whole-specification approval fails the run.
- **UX-R7 — MUST stop at each user gate.** Obtain an explicit decision after the foundation and identity, the
  skeleton, the core unit and path, the accumulated specification, the final whole specification, and the
  post-test revision. Silence, continued work, or a stakeholder's earlier preference is not approval.
- **UX-R8 — MUST compare at least two materially different concepts by default.** Cosmetic variations of one
  pattern are one concept. A single-concept exception is valid only when real constraints plus direct evidence
  show that divergence would be false; record the constraints, evidence, and exception.
- **UX-R9 — MUST complete one evidence-bearing feature design document before prototyping.** The active project
  or workflow controls its path. The document carries the full schema in Procedure and records evidence,
  alternatives, decisions, rejections, limitations, success measures, and remaining uncertainty.
- **UX-R10 — MUST design inclusion, trust, privacy, safety, harm prevention, agency, and recovery into the
  experience.** When identity or stakeholder preference conflicts with accessibility, safety, direct user
  evidence, or a platform convention, show the evidence and ask the user to decide. The accessibility and
  safety floor cannot be waived.
- **UX-R11 — MUST make the prototype disposable and proportionate to uncertainty.** It represents enough of the
  approved specification to answer named questions and no more. It is a test artifact, never production
  implementation or evidence that the feature is ready to ship.
- **UX-R12 — MUST revise the specification before revising the prototype.** Every supported test finding first
  changes the owning requirement, path, state, content intent, measure, or recorded decision; the prototype is
  then brought back into agreement. Retest affected assumptions and regressions before the post-test gate.
- **UX-R13 — MUST define success measures that resist gaming.** Each measure traces to the observable outcome,
  names intended and harmful interpretations, includes failure and recovery signals, and states how evidence
  will change the design. A proxy that can improve while the user outcome worsens cannot stand alone.
- **UX-R14 — MUST preserve the experience contract across handoff.** Surface-specific designers and future
  web, command-line, desktop, mobile, or voice child skills may specialize mechanics and standards, but must
  preserve the parent outcome, evidence, state, recovery, accessibility, safety, and measurement obligations.
  Any material deviation returns to the user; it is never made silently.

### Must-Not-Follow

- **NEVER design a polished whole solution in one pass.** Fix: establish the foundation and skeleton, then grow
  the specification through the required gates.
- **NEVER treat stakeholder preference, prior research, analytics, or an unrepresentative project owner as the
  run's direct user evidence.** Fix: obtain new generative research and direct prototype evaluation from people
  representative of the claims.
- **NEVER run research after the solution is already locked merely to validate it.** Fix: reopen the earliest
  affected decision, ask neutral generative questions, and let evidence change the direction.
- **NEVER prototype before the whole specification is complete and explicitly approved.** Fix: finish and gate
  the document first, then size a disposable prototype to the remaining uncertainty.
- **NEVER apply a prototype finding only to the mockup.** Fix: revise the specification first, then the
  prototype, then retest the affected evidence.
- **NEVER let a locally strong task, state, or channel break the top-down skeleton or another required channel.**
  Fix: repair the unit or skeleton and recheck the whole outcome, including cross-channel handoffs.
- **NEVER use visual polish, familiar labels, or a present artifact as proof that an obligation is met.** Fix:
  inspect behavior and direct-user evidence against the stated outcome and failure oracle.
- **NEVER resolve co-loaded UX and UI guidance by precedence or load order.** Fix: identify the concrete
  conflict, present evidence and trade-offs, and ask the user; keep the accessibility and safety floor.

---

## Procedure

Run nine phases in order. Read [`ideation.md`](ideation.md) before the first user discussion. Work one decision
axis per turn, keep stakeholder decisions separate from representative-user evidence, and use the active
project's own feature-document and workflow locations.

### P1 — Bind the outcome, authority, and research conditions

Write one sentence naming the actor's observable outcome. Expand it into the primary actor, supporting actors,
trigger, context, entry, completion evidence, required paths and channels, scope, and explicit non-goals.
Identify who can lock product intent and who is representative enough to supply user evidence. Inventory user
access, consent, accommodations, evidence, dependencies, and production constraints. Return `NEEDS_CONTEXT` on
any UX-R4 gate failure.

**Evidence:** a user-locked outcome contract, actor/context map, research conditions, and adjacent-outcome list.

### P2 — Establish the reference, identity, and direct-research foundation

Read the identity authority chain in UX-R5 and relevant internal experience, support, analytics, policy, and
platform evidence. Research applicable external prior art. When identity is incomplete, elicit and confirm a
temporary brief covering product promise, users, values, voice, recognizable patterns, constraints, and
anti-patterns. Plan and conduct new direct generative research with representative users before any design
converges. Record method, participants in non-identifying terms, consent, accommodations, evidence, competing
interpretations, limits, and claims the sample can support.

At the **foundation and identity gate**, present the sources, user evidence, brief, risks, conflicts, and
recommended foundation. The user locks the foundation; research participants do not make product decisions.

**Evidence:** identity/reference register, user-research record, limitations, and explicit user decision.

### P3 — Create the top-down experience skeleton

Map the outcome from trigger to completion before designing local detail. Show actor lanes, major phases,
channels, dependencies, handoffs, decision points, state transitions, failure zones, recovery routes, support,
and completion evidence. Keep the skeleton abstract enough that concepts can still differ. Check that every
supporting actor and cross-channel transition serves the same bounded outcome.

At the **skeleton gate**, show the whole map and its unresolved questions. The user approves or reopens the
foundation.

**Evidence:** approved experience skeleton with scope and uncertainty annotations.

### P4 — Grow the core unit and path bottom-up

Choose the smallest meaningful task, information, content, or state unit that advances the outcome. Specify its
user intent, required information, preconditions, inputs, state, feedback, errors, recovery, accessibility,
trust, and evidence. Connect it to the next unit, then grow the shortest complete core path while continuously
checking it against the skeleton.

At the **core unit and path gate**, demonstrate the core path, its failure oracle, and its fit in the skeleton.

**Evidence:** approved unit records and one complete core path.

### P5 — Grow the accumulated complete specification

Extend the core path one unit at a time until every applicable normal, alternative, boundary, failure,
recovery, support, handoff, and supporting-actor path is specified. Add content intent, information needs,
states, timing, dependencies, cross-channel continuity, accessibility, trust, privacy, safety, agency, harm
controls, and measurement points. Reconcile each new unit with the skeleton and prior units.

At the **accumulated-specification gate**, review the complete path/state inventory and every known gap. A gap
may remain recorded, but an applicable unresolved requirement prevents final approval.

**Evidence:** accumulated specification, trace map, and resolved-or-open gap register.

### P6 — Compare concepts and approve the whole specification

Create at least two materially different concepts that both satisfy the accumulated obligations. Compare how
each changes the experience skeleton, user control, cognitive and physical effort, failure/recovery, trust,
accessibility, operational feasibility, and measurement. Recommend one and state the evidence that would change
the recommendation. If UX-R8's exception applies, record it instead of drawing a cosmetic second concept.

Integrate the user-locked concept into the whole specification. Resolve contradictions and recheck every actor,
path, state, channel, recovery route, obligation, measure, and non-goal. At the **final whole-specification
gate**, obtain explicit approval. Do not create a prototype until this gate passes.

**Evidence:** concept comparison, rejected options, decision trace, complete specification, and approval.

### P7 — Make a disposable prototype after approval

Name the remaining uncertainties and test questions. Select the lowest prototype fidelity that can answer them
without pretending to be production. Represent all approved paths and states needed by those questions,
including applicable errors, recovery, accessibility, and cross-channel transitions. Mark simulated behavior
and data clearly.

**Evidence:** prototype plan, fidelity rationale, trace to the approved specification, and disposable artifact.

### P8 — Test directly, revise the specification first, and retest

Conduct direct prototype evaluation with representative users under UX-R3 and UX-R4. Observe comprehension,
completion, alternatives, errors, recovery, trust, accessibility, workarounds, cross-channel continuity, and
unintended harm. Separate observations from interpretations. Bound each claim to the evidence.

For every supported finding, revise the owning part of the specification first. Then revise the prototype.
Retest every affected assumption and regression. At the **post-test revision gate**, show the evidence, changes,
remaining limits, and recommendation. Acceptance requires this gate and every applicable evidence obligation to
pass.

**Evidence:** test record, findings, specification-first revision trace, updated prototype, retest evidence, and
explicit decision.

### P9 — Hand off the contract and continue measurement

Publish the approved feature design document, prototype status, evidence limits, no-silent-change contract,
implementation questions, and measure plan. Map each obligation to its future owner without choosing exact
surface mechanics. Define how outcome, failure, recovery, accessibility, trust, and guardrail measures will be
read after release, who reviews them, and what evidence reopens the design.

A run is complete only when the whole document is coherent, the prototype evidence supports its claims, all
required user gates are explicit, and the handoff can be followed without hidden session context.

**Evidence:** handed-off document, ownership/trace map, measurement plan, and reopen conditions.

### Feature design document schema

The skill defines the schema, not a universal path. The active project or workflow owns the actual document
location.

1. **Project Identity and References**
2. **Outcome, Actors, Context, Scope, Non-Goals**
3. **Direct User Research, Ethics, Evidence, Limitations**
4. **Current Experience and Dependencies**
5. **Top-Down Experience Skeleton**
6. **Bottom-Up Tasks, Information, Content, States, Recovery**
7. **Concepts, Alternatives, Decisions, Rejected Options**
8. **Accessibility, Trust, Privacy, Harm, Agency**
9. **Complete Specification, Success Measures, Instrumentation**
10. **Prototype, Direct-User Test Evidence, Revisions, Handoff**

### Cross-surface boundary example

For a login/authentication run, the outcome is “an eligible returning user securely reaches the intended
signed-in destination and can understand and recover from any failure encountered on that attempt.” The web
experience may use a form and browser redirect. A command-line equivalent may use `tool auth login`, an
external authorization handoff, status feedback, cancellation, timeout, and a verified authenticated terminal
state. Both are the same outcome only when their evidence, security, recovery, and handoff obligations remain
coherent. Registration, password reset, account administration, and post-login onboarding are adjacent outcomes
and stay out of scope unless the user changes the contract.

---

## References

- [ISO 9241-210: Human-centred design for interactive systems](https://www.iso.org/standard/77520.html)
  validates iterative human-centred activity grounded in users, tasks, and environments.
- [ISO 9241-11: Usability definitions and concepts](https://www.iso.org/standard/63500.html) validates the
  outcome-and-context framing for effectiveness, efficiency, and satisfaction.
- [Digital.gov Human-Centered Design Guide](https://digital.gov/guides/hcd/introduction) validates research,
  synthesis, ideation, prototyping, and testing as connected design work.
- [GOV.UK: Understand users and their needs](https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs)
  validates evidence-led decisions based on real users and context.
- [GOV.UK: Solve a whole problem for users](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem)
  validates complete-outcome scope across necessary organizations and channels.
- [Design Council Framework for Innovation](https://www.designcouncil.org.uk/resources/framework-for-innovation/)
  validates divergence and convergence rather than premature commitment to one solution.
- [GOV.UK: Making prototypes](https://www.gov.uk/service-manual/design/making-prototypes) validates prototypes
  as proportionate learning artifacts rather than production output.
- [GOV.UK: Plan user research for your service](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service)
  validates method and participation choices driven by learning goals rather than a universal count.
- [GOV.UK: Getting users' consent for research](https://www.gov.uk/service-manual/user-research/getting-users-consent-for-research)
  validates informed consent and participant agency.
- [W3C WAI: Involving Users in Web Accessibility](https://www.w3.org/WAI/planning/involving-users/) validates
  involving people with disabilities while keeping standards and expert review as separate evidence.
- [GOV.UK: Define success and publish performance data](https://www.gov.uk/service-manual/service-standard/point-10-define-success-publish-performance-data)
  validates outcome measures and continued performance review.
- [`ideation.md`](ideation.md) owns the complete user-decision tree used by P1–P9.
- [`scenarios.md`](scenarios.md) exercises this parent contract without adding policy.
- [`checklists.md`](checklists.md) provides the unchecked operational evidence gates for this parent contract.
- [`evaluation.md`](evaluation.md) extends active Gobbi evaluation with UX-specific selection and lenses.
