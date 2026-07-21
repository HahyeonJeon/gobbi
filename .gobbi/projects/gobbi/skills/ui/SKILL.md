---
name: ui
description: Use when designing one complete observable interface outcome across web, command-line, desktop, mobile, voice, or future surfaces, from an evidence-bound interface specification through direct-user testing of a disposable prototype.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# User Interface Design

Operation skill for designing one complete observable interface outcome across web, command-line, desktop,
mobile, voice, and future surfaces. A run binds the outcome and evidence, establishes the project and platform
foundation, creates a surface-neutral interface skeleton, grows a complete specification one meaningful unit
at a time, and only then tests a disposable prototype with representative users. Load it when hierarchy,
composition, controls or commands, interaction, feedback, state representation, adaptive behavior, modality
equivalence, or detailed aesthetic decisions must be designed.

This skill is independently loadable. It does not require or outrank a `ux` skill. When both are loaded, UI
owns surface realization and preserves the co-loaded outcome, content, state, recovery, evidence, and risk
contract. Neither skill wins by load order.

---

## Principles

> **Design one complete interface outcome, not an isolated artifact.**

A screen, page, command, component, prompt, or happy path is only one possible part of an interface outcome.
Design from entry through observable completion. Include every required actor, state, alternative, failure,
feedback, recovery, handoff, support step, and adaptation. Keep adjacent outcomes outside the run.

> **Set the whole skeleton from the top, then grow the interface from the bottom.**

Start with a surface-neutral hierarchy and state model so every local choice has a place. Then begin with the
smallest meaningful interface unit and connect one complete interaction at a time. A control or command that
works alone but breaks the hierarchy, path, state model, or another required surface is wrong.

> **Project identity constrains from the foundation; detailed aesthetics come last.**

Identity shapes the product's promise, character, voice, recognizable patterns, and allowed expression from
the start. Detailed typography, color, density, spacing, shape, imagery, motion, tone, and expressive finish
wait until structure, behavior, content, feedback, failure, recovery, adaptation, and accessibility are
complete. Polish can strengthen a sound contract; it cannot repair a missing one.

> **Finish and approve the whole specification before prototyping.**

Early prototypes anchor attention on the first visible solution and hide unsolved states. Complete the entire
interface specification and obtain explicit user approval first. The prototype then tests named uncertainties
in that approved contract. It never substitutes for the contract.

> **Direct use is the acceptance evidence.**

Standards, expert review, prior UX research, analytics, and stakeholder approval help shape an interface.
None proves that representative users can perceive, understand, operate, complete, and recover through this
run's design. Acceptance needs direct prototype testing with people representative of the claims.

> **Surface-neutral obligations and surface-specific mechanics are different layers.**

Every interface needs understandable structure, perceivable status, operable actions, coherent states,
feedback, recovery, and completion evidence. A graphical form, command-line command, voice prompt, and future
surface realize those obligations differently. This parent owns the shared outcome discipline. Future child
skills own exact platform mechanics, technical standards, and platform examples without weakening parent
invariants.

---

## Rules

### Must-Follow

- **UI-R1 — MUST bind one complete observable interface outcome per run.** Name the primary actor, necessary
  supporting actors, trigger, entry, completion evidence, normal and alternative paths, applicable states,
  errors, feedback, recovery, handoffs, support, adaptation, scope, and non-goals. A screen, page, command,
  component, artifact, isolated state, or happy path is not the outcome. An adjacent outcome enters only after
  the user changes the scope contract.
- **UI-R2 — MUST decide surface scope from the outcome and evidence.** One run may include multiple surfaces
  only when they realize the same outcome and share one interface skeleton. Each surface must still have
  separately specifiable and testable mechanics, accessibility or modality equivalence, prototype coverage,
  and evidence. Split the run when the outcome or skeleton differs, or when a surface cannot be specified and
  tested separately.
- **UI-R3 — MUST obtain direct representative-user prototype testing before the interface design is locked.**
  Prior UX research, earlier UI tests, analytics, expert review, and standards may frame the work but never
  replace this run's test. A project owner counts only when evidence shows that person is genuinely
  representative of the relevant user context. Choose method, sample, and claim boundaries from the question,
  diversity, uncertainty, impact, and risk; this skill sets no fixed participant count.
- **UI-R4 — MUST protect participants and evidence and fail closed on missing conditions.** Obtain informed
  consent, provide needed accommodations, minimize and protect collected data, separate observations from
  interpretations, and state evidence limits. Missing access to representative users, consent,
  accommodations, or required evidence yields `NEEDS_CONTEXT`. The run may record assumptions and a test plan,
  but no final UI design may be accepted.
- **UI-R5 — MUST establish project identity through one authority chain.** Use, in order: explicit
  `DESIGN.md`, brand, product, or design-system documents; the live product, system, and tokens; then a
  user-confirmed temporary identity brief. If governing material is missing, ask the kinds of questions such a
  document would answer and capture the run-scoped brief in the feature design document. Do not create or
  prescribe a universal project-wide `DESIGN.md`.
- **UI-R6 — MUST follow the construction order without skipping or rearranging it.** Bind outcome, surfaces,
  users, context, and evidence; establish the reference, platform-system, and identity foundation; create the
  top-down surface-neutral interface skeleton; grow the specification bottom-up; compare concepts; complete
  and obtain approval for the whole specification; then prototype; test; revise the specification first and
  prototype second; retest; and hand off. A prototype before whole-specification approval fails the run.
- **UI-R7 — MUST stop at each user gate.** Obtain an explicit decision after the foundation and identity, the
  skeleton, the core unit and path, the accumulated specification, the final whole specification including
  final aesthetics, and the post-test revision. Silence, continued work, an earlier decision, or stakeholder
  enthusiasm is not approval.
- **UI-R8 — MUST make user discussion adaptively complete.** Read [`ideation.md`](ideation.md) and default to
  its full decision tree. Ask one decision axis per turn. Smart-skip only when current evidence answers the axis
  and the user has already locked that answer for this run. Research before recommending. When meaningful
  alternatives exist, present two evidence-backed options, recommend one, state what evidence would change the
  recommendation, and let the user lock the choice. Ask project-specific follow-ups beyond the tree, and keep
  stakeholder decisions separate from representative-user test evidence.
- **UI-R9 — MUST compare at least two materially different interface concepts by default.** Concepts must
  differ in structure, action model, information flow, interaction strategy, state communication, or another
  consequential property. Cosmetic variants are one concept. A single-concept exception requires real
  constraints plus direct evidence, and its constraints, evidence, and rationale must be recorded.
- **UI-R10 — MUST complete one evidence-bearing feature design document before prototyping.** The active
  project or workflow owns its path. The document uses the schema in Procedure and records evidence,
  alternatives, decisions, rejected options, deviations, limitations, the whole specification, and remaining
  uncertainty. Headings without resolved content do not satisfy this rule.
- **UI-R11 — MUST finish structure and behavior before detailed aesthetics.** Complete hierarchy,
  composition, controls or commands, interaction, content, feedback, failure, recovery, adaptation,
  accessibility, and modality equivalence first. Then specify typography or character rendering, color where
  present, density, spacing, rhythm, shape, imagery, iconography or symbols, motion or transitions, tone, and
  expressive detail as applicable. Aesthetics must improve hierarchy, state recognition, affordance, trust,
  and identity fit; they cannot hide inaccessible behavior or missing structure.
- **UI-R12 — MUST make every required action, state, and meaning accessible across applicable modalities.**
  Specify perception, operation, focus or cursor flow, reading or announcement order, input alternatives,
  status, error identification, recovery, timing, motion, contrast or non-color cues, language, locale, and
  adaptation as the surfaces require. When identity conflicts with accessibility, safety, direct user
  evidence, or platform convention, present the evidence and ask the user. The accessibility and safety floor
  cannot be waived.
- **UI-R13 — MUST make prototypes disposable, post-specification test artifacts.** Size fidelity to the named
  uncertainty. Trace the artifact to the approved whole specification and mark simulated behavior and data.
  For a multi-surface run, provide separately testable variants and evidence for every surface. Production
  implementation and production-ready code are out of scope.
- **UI-R14 — MUST revise the specification before revising the prototype.** Every supported test finding first
  changes the owning hierarchy, component, command, interaction, content, state, feedback, recovery,
  accessibility, aesthetic rule, or decision. Bring the prototype back into agreement second, then retest
  every affected assumption and regression before the post-test gate.
- **UI-R15 — MUST preserve the parent contract across handoff and specialization.** The handoff states the
  outcome, surfaces, evidence and limits, skeleton, interface units, complete paths and states, content,
  feedback, recovery, adaptation, accessibility, aesthetic system, prototype status, decisions, deviations,
  and reopen conditions. Future web, command-line, desktop, mobile, voice, or other child skills may own exact
  mechanics, standards, and examples. A child convention cannot waive a parent obligation; any material
  deviation returns to the user.
- **UI-R16 — MUST resolve co-loaded UI and UX conflicts with evidence and user authority.** UI owns hierarchy,
  composition, controls or commands, interaction, feedback, state representation, adaptive behavior, modality
  equivalence, and detailed aesthetic decisions. Preserve any co-loaded UX outcome, content, state, recovery,
  accessibility, evidence, and risk contract. If clauses conflict, identify the concrete conflict, show the
  evidence and trade-offs, and ask the user. Never invent precedence or use load order.

### Must-Not-Follow

- **NEVER produce a polished interface in one big pass.** Fix: establish the foundation and skeleton, then grow
  one meaningful unit and path at a time through the required gates.
- **NEVER treat a screen, page, command, component, prompt, or output as a complete outcome by itself.** Fix:
  bind observable completion and include every required state, failure, recovery, support step, and actor.
- **NEVER combine surfaces because they look related.** Fix: prove one outcome and skeleton, then keep each
  surface's mechanics, accessibility, prototype, and evidence separate; otherwise split the run.
- **NEVER use prior UX or UI evidence, standards compliance, expert judgment, or an unrepresentative owner as
  a replacement for this run's direct prototype testing.** Fix: meet UI-R3 and UI-R4 or return
  `NEEDS_CONTEXT` without accepting the design.
- **NEVER create a prototype before the whole specification is complete and explicitly approved.** Fix: finish
  every specification section and pass the final whole-specification gate first.
- **NEVER start detailed aesthetics while structure, behavior, content, feedback, recovery, adaptation, or
  accessibility remains unresolved.** Fix: return to the earliest incomplete layer, then perform UI-R11 last.
- **NEVER accept a component or command that works alone but breaks the skeleton or another required surface.**
  Fix: repair the unit or the approved skeleton and recheck the complete outcome.
- **NEVER use visual polish, matching labels, a familiar design-system component, or a present artifact as
  proof of operable, accessible, safe behavior.** Fix: inspect behavior and direct-user evidence against the
  failure oracle.
- **NEVER apply a prototype finding only to the mockup.** Fix: revise the specification first, update the
  prototype second, and retest affected evidence.
- **NEVER let a child convention waive this parent or resolve co-loaded UI and UX by precedence.** Fix: preserve
  the invariant, or surface the concrete conflict for an evidence-led user decision.

---

## Procedure

Run nine phases in order. Read [`ideation.md`](ideation.md) before the first user discussion. Use the active
project's own feature-document and workflow locations. The skill defines the design contract, not where a
project stores it.

### P1 — Bind the outcome, surfaces, authority, and evidence conditions

Write one sentence naming the actor's observable interface outcome. Expand it into the primary actor,
supporting actors, trigger, context, entry, completion and false-completion evidence, normal and alternative
paths, applicable states, failures, feedback, recovery, support, handoffs, adaptation, scope, and explicit
non-goals. Decide which surfaces the run needs under UI-R2. Identify who can lock product intent and who is
representative enough to supply test evidence. Inventory user access, consent, accommodations, prior evidence,
platform dependencies, and constraints. Return `NEEDS_CONTEXT` on a UI-R4 gate failure.

**Evidence:** user-locked outcome and surface contract, actor/context map, evidence conditions, and adjacent-
outcome list.

### P2 — Establish references, governing systems, and project identity

Read the identity authority chain in UI-R5. Inspect the live interface, governing product and design-system
material, platform conventions, tokens, content, support evidence, and applicable standards. Research external
prior art for the outcome and each selected surface. Distinguish transferable abstract obligations from
surface-specific mechanics. If identity is incomplete, elicit and confirm a temporary brief covering product
promise, users, values, voice, character, recognizable patterns, constraints, anti-patterns, and permissible
expression. Record known conflicts and evidence limits.

At the **foundation and identity gate**, present the sources, governing systems, brief, surface assumptions,
risks, conflicts, and recommended foundation. The user explicitly approves or reopens it.

**Evidence:** approved reference and identity register, platform-system map, temporary brief when needed,
conflict register, and explicit user decision.

### P3 — Create the top-down surface-neutral interface skeleton

Map the outcome before designing local detail. Define hierarchy, regions or stages, navigation or command
structure, action priority, information flow, system status, state relationships, decision points, failure
zones, recovery routes, handoffs, adaptation, and completion evidence without assuming a graphical layout.
Then map how each selected surface realizes the skeleton without choosing detailed mechanics too early. Prove
that all surfaces still serve one outcome and share the same skeleton.

At the **skeleton gate**, show the whole hierarchy and state map, surface mappings, scope boundary, and open
questions. The user explicitly approves it or reopens the foundation.

**Evidence:** approved interface skeleton with state, path, surface, and uncertainty annotations.

### P4 — Grow the core unit and shortest complete path bottom-up

Choose the smallest meaningful interface unit that advances the outcome: a component, control, command,
prompt, output, feedback message, or state. Specify its purpose, preconditions, input, output, affordance,
content, feedback, states, errors, recovery, accessibility, modality equivalence, adaptation, and evidence.
Connect it to the next unit. Grow the shortest complete core path and continuously reconcile it with the
skeleton and every selected surface.

At the **core unit and path gate**, demonstrate the unit and complete path in the skeleton, including one
applicable failure and recovery route and each surface's distinct realization. State the failure oracle.

**Evidence:** approved unit records, surface mappings, and one complete core path.

### P5 — Grow the accumulated complete interface specification

Extend the core path one meaningful unit at a time until every applicable normal, alternative, empty, loading,
progress, success, boundary, failure, interruption, timeout, partial, recovery, support, adaptation, and
completion state is specified. Add complete content, feedback, focus or cursor movement, announcement or
reading order, commands and shortcuts, destructive-action handling, permissions, responsive or environmental
adaptation, locale, and modality equivalence as applicable. Reconcile each increment with the skeleton, earlier
units, and every selected surface. Do not begin the detailed aesthetics pass.

At the **accumulated-specification gate**, present the complete unit, path, state, content, feedback, recovery,
adaptation, and accessibility inventory plus the gap register. An applicable unresolved requirement prevents
the final gate.

**Evidence:** accumulated specification, bidirectional trace, cross-surface matrix, and resolved-or-open gap
register.

### P6 — Compare concepts, finish aesthetics, and approve the whole specification

Create at least two materially different interface concepts that satisfy the accumulated obligations. Compare
their hierarchy, action model, information flow, interaction strategy, state communication, accessibility,
adaptation, recovery, trust, identity fit, implementation implications, and evidence. Recommend one and state
what evidence would change the recommendation. If UI-R9's exception applies, record it instead of presenting a
cosmetic second concept.

Integrate the user-locked concept. Only now perform the detailed aesthetics pass in UI-R11 for each selected
surface. Resolve contradictions and recheck the outcome, skeleton, units, paths, states, content, feedback,
failure, recovery, adaptation, accessibility, modality equivalence, aesthetics, decisions, deviations, and
non-goals. At the **final whole-specification gate**, show the complete feature design document and obtain
explicit approval. No prototype may exist before this gate passes.

**Evidence:** material concept comparison or valid exception, aesthetic system, rejected options, decision
trace, complete whole specification, and explicit approval.

### P7 — Create a disposable prototype after whole-specification approval

Name the remaining uncertainties and test questions. Select the lowest fidelity that can answer them. Trace
the prototype to the approved specification, represent every path and state the questions need, and mark
simulated data or behavior. For a multi-surface run, create separately testable surface variants while keeping
their shared skeleton explicit. Do not turn the artifact into production implementation.

**Evidence:** post-approval prototype plan, fidelity rationale, specification trace, simulated-behavior marks,
and separately testable artifacts per surface.

### P8 — Test directly, revise the specification first, and retest

Test the prototype with representative users under UI-R3 and UI-R4. Observe perception, comprehension,
operation, completion, alternatives, errors, recovery, feedback, status recognition, trust, accessibility,
adaptation, workarounds, and unintended harm as applicable. Test each surface separately enough to support its
claims. Separate observation from interpretation and bound claims to the evidence.

For every supported finding, revise the owning specification clause first. Revise the prototype second. Retest
affected assumptions and regressions. At the **post-test revision gate**, present the evidence, ordered changes,
remaining limits, and recommendation. Acceptance requires this gate and every applicable evidence obligation
to pass.

**Evidence:** direct-test record, findings, specification-first revision trace, updated prototype, per-surface
and regression evidence, and explicit user decision.

### P9 — Hand off the interface contract

Publish the approved feature design document, prototype status, evidence limits, decision and deviation log,
implementation questions, child-skill boundaries, no-silent-change contract, and reopen conditions. Map each
surface-specific mechanic to its future owner without treating one platform's convention as universal. If UX
is co-loaded, show that the UI handoff preserves its outcome, content, state, recovery, accessibility, evidence,
and risk contract.

Every applicable gate and required item must be `PASS` for acceptance, with one bounded exception: exactly one
valid authorized waiver may substitute for `PASS` on at most one non-protected operational gate. The waiver is
an acceptance exception, not `PASS`. The named authority's mandate must cover that item's stated consequence
and stop action, and the authorization evidence and rationale must be recorded.

Accessibility and safety in every applicable item are protected and non-waivable. Current direct
representative-user prototype testing through `UI-CHECK-13` is protected and non-waivable. Complete
whole-specification approval before every prototype, including document closure and chronology through
`UI-CHECK-11`, is protected and non-waivable. A waiver token on a protected item is invalid and closes neither
coverage nor acceptance. `FAIL` or `recorded-open` on any applicable item closes coverage only, never
acceptance. A child convention, platform authority, co-loaded contract, precedence rule, or load order cannot
authorize or widen the bounded exception.

A run is complete only when the whole specification is coherent, direct prototype evidence supports its
claims, every required user gate is explicit, a cold reader can realize the interface without hidden session
context, and every applicable item satisfies this acceptance rule.

**Evidence:** handed-off document, trace and owner maps, cold-reader result, prototype/test status, any bounded
waiver's authority/evidence/rationale record, and reopen conditions.

### Feature design document schema

The skill defines the schema, not a universal filesystem path. The active project or workflow owns the actual
document location.

1. **Project Identity and References**
2. **Outcome, Users, Context, Surface Scope, Non-Goals**
3. **Evidence and Governing Design/Platform Systems**
4. **Top-Down Interface Skeleton**
5. **Bottom-Up Components, Commands, Interactions, States**
6. **Content, Feedback, Failure, Recovery, Adaptation**
7. **Accessibility and Modality Equivalence**
8. **Aesthetic System and Identity Fit**
9. **Concepts, Decisions, Complete Specification, Deviations**
10. **Prototype, Direct-User Test Evidence, Revisions, Handoff**

### Cross-surface boundary example

For a login/authentication run, the outcome is “an eligible returning user securely reaches the intended
authenticated destination and can understand and recover from any failure on that attempt.” A graphical
surface may realize the skeleton through a form, labeled controls, focus order, inline and summary errors,
progress, and a signed-in destination. A command-line realization may use `tool auth login`, flags or prompts,
clear stdout/stderr and exit-status behavior, an external authorization handoff, cancellation, timeout,
recovery guidance, and a verified authenticated terminal state. They share abstract obligations for action,
status, error, recovery, accessibility, and completion, but their exact mechanics belong to different future
surface children and need separate prototypes and evidence. Registration, password reset, account
administration, and onboarding are adjacent outcomes and remain out of scope unless the user changes the
contract.

---

## References

- [ISO 9241-210: Human-centred design for interactive systems](https://www.iso.org/standard/77520.html)
  validates iterative human-centred work grounded in users, tasks, and environments.
- [ISO 9241-11: Usability definitions and concepts](https://www.iso.org/standard/63500.html) validates the
  outcome-and-context framing for effectiveness, efficiency, and satisfaction.
- [GOV.UK Government Design Principles](https://www.gov.uk/guidance/government-design-principles) validates
  starting with user needs, iterating, and making services understandable and inclusive.
- [U.S. Web Design System Design Principles](https://designsystem.digital.gov/design-principles/) validates
  accessible, user-centred, consistent interface decisions within a governing system.
- [W3C Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) validates testable web
  accessibility outcomes. It is web-specific and is not a universal substitute for a future surface child.
- [WAI-ARIA Authoring Practices: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
  validates keyboard interaction and focus design for applicable web widgets. It is surface-specific.
- [W3C WAI: Involving Users in Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/involving-users/)
  validates direct involvement of people with disabilities alongside standards and expert evaluation.
- [Apple Human Interface Guidelines: Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles),
  [Microsoft Windows design guidance](https://learn.microsoft.com/en-us/windows/apps/design/guidelines-overview),
  and [Android accessibility design guidance](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility)
  validate platform-aware interface design. Each is a platform reference, not a universal parent policy or a
  substitute for future child skills.
- [GNU Coding Standards: Command-Line Interfaces](https://www.gnu.org/prep/standards/standards.html) and
  [POSIX Utility Syntax Guidelines](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
  validate conventions for applicable command-line realizations. They do not define all CLI experience or
  future surface mechanics.
- [`ideation.md`](ideation.md) owns the complete user-decision procedure used by P1–P9.
- [`scenarios.md`](scenarios.md) exercises this parent contract without adding policy.
- [`checklists.md`](checklists.md) provides the unchecked operational evidence gates for this parent contract.
- [`evaluation.md`](evaluation.md) extends active Gobbi evaluation with UI-specific selection and lenses.
