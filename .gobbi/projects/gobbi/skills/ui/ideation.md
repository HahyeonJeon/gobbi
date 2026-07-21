# UI Ideation — User Decision Tree

Decision procedure for discussing and deciding one UI run with the user. Load it from `SKILL.md` P1 before
asking the first design question. It deepens the parent procedure. It does not change the parent outcome,
surface rule, evidence gates, construction order, aesthetics-last rule, or acceptance standard.

Here, **the user** means the project owner or stakeholder with authority to lock product intent, scope, and
design decisions. **Representative users** are test participants whose behavior supplies interface evidence.
Stakeholder approval cannot substitute for direct prototype-test evidence. A participant observation does not
itself make a product decision. Record each on its own trace.

## Interview conduct

Default to the full tree. Adapt only when the run remains complete.

1. Ask one decision axis per turn.
2. Smart-skip an elicitation question only when current evidence answers it and the user has already locked
   that answer for this run. Record both the evidence and the earlier decision.
3. Never smart-skip a parent user gate. Restate the accumulated decision and obtain explicit approval.
4. Research internal evidence and applicable external prior art before a design-bearing recommendation.
5. When meaningful alternatives exist, present two evidence-backed options. Recommend one and state what
   evidence would change the recommendation. The user locks the choice.
6. Ask project-specific follow-ups about evidence, constraints, conflicts, and earlier answers. This tree is a
   coverage floor, not a script ceiling.
7. Treat silence, continuation, a polished artifact, or an earlier adjacent decision as no decision.
8. When an answer is vague, contradicted, or unsupported, show the conflict and ask a narrower follow-up.
   Never turn an evidence gap into an unmarked assumption.
9. Keep concepts materially different. Changes limited to color, type, spacing, icon style, wording, or other
   surface polish are not two concepts.
10. Do not create, request, or accept any prototype artifact before Gate G5 approves the complete whole
    specification, including final aesthetics.

These conduct steps apply UI-R3, UI-R4, UI-R7, UI-R8, UI-R9, and UI-R13.

## Decision record

For each axis, keep a compact record:

- **Axis:** the single question being decided.
- **Evidence:** representative-user evidence, internal evidence, external reference, or named constraint.
- **Options:** materially different choices when alternatives exist.
- **Recommendation:** one position and the evidence that would change it.
- **User decision:** explicit lock, rejection, or request to investigate further.
- **Representative-user evidence:** separate observations, participant context, and limits.
- **Effects:** parent rule, document section, skeleton, unit, path, state, surface, or earlier branch affected.

## Dependency-ordered tree

Walk D0–D16 in order. A later answer that invalidates an earlier one reopens the earliest affected node. Do not
repair an unresolved foundation with more visual detail. Do not repair a wrong specification only in the
prototype.

### D0 — Confirm the run can proceed

**Discuss with the user**

- What triggered this UI design run now?
- Who owns product intent, scope, identity, and design decisions?
- Which representative users can be reached after whole-specification approval for direct prototype testing?
- What consent, privacy, accessibility, language, scheduling, compensation, data-handling, and accommodation
  conditions apply?
- Which prior UX research, UI evidence, analytics, support data, standards, and platform guidance are current?
  Which are context only?

**Decision**

Lock authority, representative-user access, ethical conditions, accommodations, and the evidence inventory.
If representative-user access, consent, accommodations, or required evidence is unavailable, return
`NEEDS_CONTEXT` under UI-R4. The user may approve an assumptions register and test plan, but cannot approve the
missing evidence into existence or accept a final design.

**Trace:** UI-R3, UI-R4, UI-R8; `SKILL.md` P1.

### D1 — Define the observable interface outcome

**Discuss with the user**

- Who is trying to achieve what observable result, in which triggering situation?
- What will that person perceive, and what system evidence confirms completion?
- What would look complete while leaving the outcome unfinished or unsafe?
- Is the requested object a complete outcome or only a screen, page, command, component, prompt, state,
  artifact, or happy path?

**Decision**

Lock one sentence in the form: “When `<trigger/context>` occurs, `<primary actor>` can `<complete observable
outcome>`, evidenced by `<user-visible and system completion signals>`.” Split independent outcomes into other
runs.

**Trace:** UI-R1; `SKILL.md` P1.

### D2 — Identify actors and use contexts

**Discuss with the user**

- Which primary actor operates the interface?
- Which supporting actors approve, assist, operate, receive, monitor, or are affected?
- Which device, terminal, channel, environment, connectivity, time pressure, language, locale, ability,
  knowledge, privacy, safety, or emotional conditions change interface needs?
- Which claimed user contexts are not represented by current evidence?

**Decision**

Lock the actor/context map. Distinguish supporting actors needed for completion from stakeholders who only need
information. Mark evidence limits for each claimed context.

**Trace:** UI-R1, UI-R3, UI-R4; `SKILL.md` P1.

### D3 — Decide the surface contract

**Discuss with the user**

- Which surfaces must realize this outcome: web, command-line, desktop, mobile, voice, or another mode?
- Do those surfaces share one outcome and one abstract hierarchy, action flow, state model, and completion
  contract?
- Can each surface's mechanics, accessibility or modality equivalence, prototype, and evidence be specified and
  tested separately?
- Is a surface a necessary realization, a supporting handoff, an existing dependency, or an adjacent outcome?

**Decision**

Lock one or more surfaces only under UI-R2. Split surfaces into different runs if their outcome or skeleton
differs or separate evidence cannot be obtained. Record shared obligations and separate test/evidence columns.

**Trace:** UI-R2; `SKILL.md` P1.

### D4 — Lock scope and adjacent outcomes

**Discuss with the user**

- Which entry conditions, paths, states, errors, feedback, recovery, handoffs, support steps, adaptations, and
  completion states are necessary for this one outcome?
- Which tempting neighboring outcomes are independent?
- Which systems, teams, platforms, and design systems constrain the work but remain outside design scope?
- What existing behavior must remain unchanged?

**Decision**

Lock scope and explicit non-goals. For login/authentication, registration, password reset, account
administration, and onboarding remain adjacent. Recovery needed for the bounded login attempt remains in scope
even when another system supplies part of it.

**Trace:** UI-R1, UI-R2; `SKILL.md` P1.

### D5 — Bound evidence and the future prototype test

**Discuss with the user**

- Which interface assumptions must direct prototype testing answer before the design can be locked?
- Who is representative of each claim, including people likely to face perception, input, language, recovery,
  trust, or environmental barriers?
- Which test method and sample match the question, diversity, uncertainty, impact, and risk without claiming
  more than the evidence supports?
- What consent, accommodations, data minimization, retention, and stop conditions apply?
- How will observations be kept separate from interpretations and stakeholder decisions?

**Decision**

Lock a test-evidence contract, not a prototype solution: questions, recruitment logic, method, claim boundary,
ethical conditions, accommodations, and evidence limits. Reconfirm that prior evidence cannot replace the
future direct test and that no fixed participant count applies.

**Trace:** UI-R3, UI-R4; `SKILL.md` P1 and P8.

### D6 — Select governing references and platform systems

**Discuss with the user**

- Which product, design-system, content, platform, accessibility, safety, or regulatory sources govern this
  outcome and each surface?
- Which live patterns and tokens are intentional, and which are inherited defects?
- Which obligations transfer across surfaces, and which mechanics belong only to a web, graphical,
  command-line, voice, or other child?
- Where do governing sources disagree or fail to cover the target context?

**Options and decision**

For a disputed pattern, research current internal evidence and applicable official guidance. Present two real
directions when alternatives exist, recommend one, and state the evidence that would change it. Lock the
reference set, applicability limits, and open conflicts. Do not turn WCAG, ARIA APG, a platform HIG, GNU, or
POSIX guidance into a universal cross-surface mechanic.

**Trace:** UI-R5, UI-R8, UI-R12, UI-R15; `SKILL.md` P2.

### D7 — Establish project identity

**Discuss with the user**

- Which `DESIGN.md`, brand, product, or design-system material expresses the product's identity?
- What do the live product, interface language, tokens, symbols, motion, density, and recognizable patterns
  already teach users?
- What promise does the product make, to whom, in what voice and character, with which values?
- Which traits must this interface express, and which tones, symbols, interactions, or aesthetic patterns must
  never appear?
- Where does identity conflict with accessibility, safety, direct evidence, or platform convention?

**Decision**

Apply UI-R5's authority chain. When sources are insufficient, lock a temporary run-scoped brief covering
promise, users, values, voice, character, recognizable patterns, constraints, anti-patterns, and allowed
expression. Record conflicts for explicit decision. Do not waive the accessibility or safety floor, and do not
create a project-wide `DESIGN.md`.

**Trace:** UI-R5, UI-R12; `SKILL.md` P2.

### Gate G1 — Foundation and identity

Present D0–D7 as one foundation: outcome, actors, contexts, surfaces, scope, evidence/test conditions,
references, platform systems, identity brief, conflicts, risks, and open questions. Recommend the foundation
and name evidence that would reopen it. The user explicitly approves or reopens the earliest owning node.

**Trace:** UI-R7; `SKILL.md` P2.

### D8 — Design the top-down surface-neutral skeleton

**Discuss with the user**

- What hierarchy, regions or stages, navigation or command structure, and action priority lead from entry to
  completion?
- How do information, control, focus or attention, system status, and state move through the outcome?
- Where are decisions, waits, failures, recovery, support, handoffs, adaptations, and completion signals?
- Which parts are shared abstract obligations, and how does each surface map them without copying another
  surface's mechanics?
- Where could a locally useful component or command break the whole skeleton?

**Options and decision**

When the macro structure permits alternatives, show two materially different surface-neutral skeletons.
Recommend one from the foundation evidence. Lock the skeleton and surface mappings without detailed controls,
commands, or aesthetics.

**Trace:** UI-R2, UI-R6, UI-R8; `SKILL.md` P3.

### Gate G2 — Skeleton

Show the whole hierarchy, action/information flow, state relationships, failure/recovery zones, surface
mappings, scope boundary, and unresolved questions. The user explicitly approves it or reopens the foundation.

**Trace:** UI-R7; `SKILL.md` P3.

### D9 — Choose the smallest meaningful interface unit

**Discuss with the user**

- What is the smallest component, control, command, prompt, output, feedback, or state that makes real progress?
- What must the user perceive, understand, decide, provide, control, or receive at this unit?
- What are its preconditions, inputs, outputs, content, affordance, feedback, states, errors, recovery,
  accessibility, modality equivalence, adaptation, and evidence?
- How does each surface realize the obligation without breaking the skeleton?
- What observable result distinguishes a working unit from cosmetic compliance?

**Decision**

Lock the core unit and grow the shortest complete path from it. Reject a unit that works alone but introduces
inconsistent priority, hidden state, inaccessible operation, a dead end, or cross-surface breakage.

**Trace:** UI-R6, UI-R11, UI-R12; `SKILL.md` P4.

### Gate G3 — Core unit and path

Demonstrate the unit and shortest complete path within the skeleton. Include one applicable failure and
recovery route, each surface's realization, and a failure oracle that visual or textual resemblance alone
cannot pass. The user explicitly approves or reopens D8/D9.

**Trace:** UI-R7; `SKILL.md` P4.

### D10 — Grow all interactions, states, feedback, and recovery

**Discuss with the user as the specification grows**

- Which materially different valid paths arise from actor, context, input, permission, mode, or surface?
- What occurs at empty, one, many, first, last, limit, loading, progress, timeout, interruption, dependency
  failure, partial completion, cancellation, resumption, success, and stale states where applicable?
- What content, feedback, status, confirmation, error identification, prevention, recovery, and support is
  needed at each unit?
- How do focus, cursor, reading, announcement, shortcut, command, voice, gesture, and alternative-input flows
  work where applicable?
- How does the interface adapt to size, device, terminal, connection, locale, environment, user preference, and
  assistive technology without changing meaning or completion?
- Does each increment still fit the skeleton and all selected surfaces?

**Decision**

Lock each increment only after reconciling it with the skeleton and prior units. Keep detailed aesthetics out.
Keep unresolved requirements and evidence visible; do not hide them behind a component library or platform
convention.

**Trace:** UI-R1, UI-R2, UI-R6, UI-R10, UI-R11, UI-R12; `SKILL.md` P5.

### Gate G4 — Accumulated specification

Present the complete unit, interaction, path, state, content, feedback, failure, recovery, adaptation,
accessibility, and cross-surface inventory plus the trace and gap registers. The user explicitly approves or
reopens the earliest owning node. An applicable unresolved requirement blocks final approval.

**Trace:** UI-R7, UI-R10; `SKILL.md` P5.

### D11 — Compare material interface concepts

**Discuss with the user**

- Which two approaches differ in hierarchy, action model, information flow, interaction strategy, state
  communication, or another consequential property?
- How does each concept satisfy the same accumulated obligations, skeleton, accessibility floor, and surface
  contract?
- What changes in effort, clarity, recovery, adaptation, trust, identity fit, implementation implications, and
  test uncertainty?
- Which evidence would disconfirm the recommendation?

**Decision**

Present at least two material concepts, recommend one, and let the user lock it. If only one is possible,
record the real constraints plus direct evidence that make divergence false. Do not count cosmetic variants.

**Trace:** UI-R8, UI-R9; `SKILL.md` P6.

### D12 — Specify the aesthetic system last

**Discuss with the user**

- After selecting the concept, how should typography or character rendering, color where present, density,
  spacing, rhythm, shape, imagery, iconography or symbols, motion or transitions, tone, and expressive detail
  apply on each surface?
- How does each choice improve hierarchy, state recognition, affordance, trust, and identity fit?
- Does meaning remain available without color, animation, imagery, symbol familiarity, sound, pointer input, or
  a particular terminal capability where applicable?
- Which identity traits are expressed through behavior and content as well as appearance?
- Does any aesthetic choice hide feedback, reduce access, mislead priority, imply a false state, or conflict
  with direct evidence or platform convention?

**Options and decision**

Show evidence-backed aesthetic directions only after D10 and D11. Recommend one and state what evidence would
change it. Lock each surface's coherent aesthetic system and record intentional deviations. Reopen the owning
structural or behavioral node if aesthetics expose a missing obligation; do not style around it.

**Trace:** UI-R5, UI-R8, UI-R11, UI-R12; `SKILL.md` P6.

### D13 — Reconcile the complete whole specification

**Discuss with the user**

- Does every document section contain resolved, traceable content rather than headings or placeholders?
- Does the chosen concept agree with the skeleton, units, paths, states, content, feedback, recovery,
  adaptation, accessibility, modalities, and aesthetics on every surface?
- Are decisions, rejected options, deviations, evidence limits, non-goals, and implementation questions clear?
- Can a cold reader tell what must be built and tested without hidden session context?
- Does any artifact that could be called a prototype already exist? If yes, the sequence failed and must be
  corrected before approval.

**Decision**

Resolve contradictions and close every applicable requirement. Record real unknowns only when they do not
prevent a complete, testable specification. Confirm that no prototype has been created.

**Trace:** UI-R6, UI-R10, UI-R11, UI-R15, UI-R16; `SKILL.md` P6.

### Gate G5 — Final whole specification, including aesthetics

Present the complete feature design document, material concept decision, detailed aesthetic system, evidence
limits, deviations, and all surface specifications. The user explicitly approves or reopens the earliest
owning node. Only this approval permits prototype creation.

**Trace:** UI-R6, UI-R7, UI-R10, UI-R11, UI-R13; `SKILL.md` P6.

### D14 — Choose the disposable prototype and test design

**Discuss with the user after G5 passes**

- Which remaining uncertainties and failure risks must the prototype answer?
- What is the lowest fidelity that can answer each question without resembling production unnecessarily?
- Which approved paths, states, errors, recovery, adaptations, and accessibility behaviors must be represented?
- For multiple surfaces, how will each variant remain separately operable, testable, and evidenced while
  preserving the shared skeleton?
- Which behavior or data is simulated, and how will participants be told?

**Decision**

Lock a disposable prototype plan, specification trace, per-surface variants, test tasks, observation plan,
claim boundary, and stop conditions. Production implementation remains outside scope.

**Trace:** UI-R2, UI-R3, UI-R4, UI-R13; `SKILL.md` P7–P8.

### D15 — Interpret findings and revise in the required order

**Discuss with the user after direct testing**

- What was directly observed, and what is interpretation?
- Which finding is supported strongly enough to change a specification clause?
- Which hierarchy, unit, interaction, content, state, feedback, recovery, accessibility, aesthetic rule, or
  decision owns the finding?
- What prototype change follows that specification revision?
- Which assumptions, surfaces, paths, and regressions require direct retest?
- What evidence remains limited, conflicting, or missing?

**Decision**

For each supported finding, lock the specification revision first, prototype revision second, and retest plan
third. Do not accept mockup-only fixes. Keep participant evidence separate from the stakeholder's product
decision.

**Trace:** UI-R3, UI-R4, UI-R14; `SKILL.md` P8.

### Gate G6 — Post-test revision

Present direct observations, bounded interpretations, ordered specification/prototype changes, per-surface and
regression retest evidence, unresolved limits, and the acceptance recommendation. The user explicitly accepts,
reopens an owning node, or records `NEEDS_CONTEXT`. Acceptance is unavailable while UI-R3 or UI-R4 is unmet.

**Trace:** UI-R7, UI-R14; `SKILL.md` P8.

### D16 — Lock the handoff and change contract

**Discuss with the user**

- Which team or future child skill owns each exact surface mechanic and technical standard?
- Which parent outcome, skeleton, state, recovery, accessibility, safety, evidence, and aesthetic obligations
  must remain unchanged?
- If UX is co-loaded, where is its outcome, content, state, recovery, evidence, and risk contract preserved?
- What implementation question needs evidence rather than an invented answer?
- Which later evidence or deviation reopens which decision?

**Decision**

Lock the owner map, no-silent-change rule, cold-reader handoff, open implementation questions, and reopen
conditions. A child convention or load order cannot approve a deviation. Route a concrete conflict back to the
user with evidence.

**Trace:** UI-R15, UI-R16; `SKILL.md` P9.

## Completion audit

Before leaving ideation, confirm that every D-node is either explicitly decided or smart-skipped with current
evidence plus a user-locked answer. Confirm that G1–G6 each has an explicit user decision. Confirm that the
decision record separates stakeholder locks from representative-user observations. Confirm that prototype
creation occurred only after G5, and that any supported finding changed the specification before the prototype.

The feature design document uses the schema in `SKILL.md`. This decision tree never assigns a universal file
path and never creates a project-wide `DESIGN.md`.
