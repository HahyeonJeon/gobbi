# UX Ideation — User Decision Tree

Decision procedure for discussing and deciding one UX run with the user. Load it from `SKILL.md` P1 before
asking the first design question. It deepens the parent procedure; it does not change the parent outcome,
evidence gates, construction order, or acceptance rules.

Here, **the user** means the project owner or stakeholder who has authority to lock product intent and scope.
**Representative users** are research participants whose behavior and context supply experience evidence. A
stakeholder decision cannot substitute for research evidence, and a participant observation does not itself
lock a product decision. Trace both without merging them.

## Interview conduct

Default to the full tree. Adapt only when the run remains complete:

1. Ask one decision axis per turn.
2. Smart-skip an elicitation question only when current evidence answers it and the user has already locked that
   answer for this run. Record the evidence and earlier decision that justified the skip.
3. Never smart-skip a parent user gate. Restate the accumulated decision and obtain explicit approval.
4. Before a design-bearing recommendation, research internal evidence and applicable external prior art.
5. When meaningful alternatives exist, present two evidence-backed options, recommend one, and state what
   evidence would change the recommendation. The user locks the choice.
6. Ask follow-up questions specific to the project, evidence, conflict, and answers. The generic tree is a
   coverage floor, not a script ceiling.
7. Treat silence, continuation, a polished artifact, or an earlier adjacent decision as no decision.
8. If an answer is vague, contradictory, or unsupported, show the conflict and ask a narrower follow-up. Do not
   convert it into an assumption without marking the evidence gap.

These conduct steps apply UX-R2, UX-R4, UX-R7, and UX-R8.

## Decision record

For each axis, keep a compact record:

- **Axis:** the single question being decided.
- **Evidence:** direct user research, internal evidence, external reference, or named constraint.
- **Options:** materially different choices when alternatives exist.
- **Recommendation:** chosen recommendation and evidence that would change it.
- **User decision:** explicit lock, rejection, or request to investigate further.
- **Representative-user evidence:** separate observations and limits; never relabel a stakeholder choice as
  participant evidence.
- **Effects:** parent rule, document section, skeleton/path/state/measure affected, and any branch reopened.

## Dependency-ordered tree

Walk D0–D14 in order. A later answer that invalidates an earlier one reopens the earliest affected node. Do not
repair an unresolved foundation by making a downstream artifact more detailed.

### D0 — Confirm the run can proceed

**Discuss with the user**

- What started this UX run now?
- Who owns product intent and scope decisions?
- Which representative users can be reached for new generative research and later prototype evaluation?
- What consent, privacy, data-handling, accessibility, language, scheduling, or compensation conditions apply?
- Which evidence is current, and which material is only prior context?

**Decision**

Lock the decision authority, research access, ethical conditions, and evidence inventory. If representative-user
access, consent, accommodations, or required evidence is unavailable, return `NEEDS_CONTEXT` under UX-R4. The
user may approve a research plan, but cannot approve the missing evidence into existence.

**Trace:** UX-R2, UX-R3, UX-R4; `SKILL.md` P1.

### D1 — Define the observable outcome

**Discuss with the user**

- Who experiences the outcome, in what triggering situation?
- What observable change tells that person and the system the outcome is complete?
- What would count as a false completion?
- Is the proposed object a whole outcome, or only a page, screen, command, component, artifact, or happy path?

**Decision**

Lock one sentence in the form: “When `<trigger/context>` occurs, `<primary actor>` can `<complete observable
outcome>`, evidenced by `<completion signal>`.” Split any independent outcome into another run.

**Trace:** UX-R1; `SKILL.md` P1.

### D2 — Identify actors and contexts

**Discuss with the user**

- Which primary actor is trying to finish the outcome?
- Which supporting actors operate, approve, receive, assist, or are affected?
- What device, channel, environment, time pressure, connectivity, language, ability, knowledge, and emotional
  context materially changes the experience?
- Which people are not represented by the evidence yet?

**Decision**

Lock the actor/context map and distinguish required supporting actors from stakeholders who merely need to be
informed. Mark evidence limits for each claimed context.

**Trace:** UX-R1, UX-R2, UX-R4; `SKILL.md` P1.

### D3 — Lock scope and adjacent outcomes

**Discuss with the user**

- Which entry conditions, paths, states, recovery, handoffs, support steps, and completion states are necessary
  for this outcome?
- Which tempting neighboring outcomes are separate?
- Which systems or teams are dependencies but not design scope?
- What must remain unchanged?

**Decision**

Lock scope and explicit non-goals. For a login/authentication outcome, registration, password reset, account
administration, and onboarding remain adjacent unless the user changes the contract. A necessary recovery path
inside login remains in scope even when another team owns part of it.

**Trace:** UX-R1; `SKILL.md` P1.

### D4 — Set the generative research question

**Discuss with the user**

- What must be learned before experience design can converge?
- Which assumptions would make the outcome, actor model, or context wrong if disproved?
- Who is representative of each claim, including people likely to face access or recovery barriers?
- Which method and sample can answer the question without claiming more than the evidence supports?
- What neutral prompts will uncover current behavior, workarounds, language, failures, and trust concerns without
  pitching the proposed solution?

**Decision**

Lock the research questions, recruitment logic, method, claim boundary, consent, accommodations, and stop
conditions. Do not lock the solution. New direct research must occur before G1 closes and D7 design begins.

**Trace:** UX-R2, UX-R4; `SKILL.md` P2.

### D5 — Understand the current experience

**Ask representative users during research**

- Tell me about the last time you tried to achieve this outcome.
- What started it, what did you do, what happened next, and how did you know you were done?
- Where did you pause, switch channel, seek help, make an error, recover, abandon, or create a workaround?
- What information, language, people, tools, and prior knowledge did you depend on?
- What made the experience feel safe, unsafe, trustworthy, coercive, accessible, or excluding?

**Discuss with the user after synthesis**

- Which observed patterns are load-bearing, which are minority but high-risk, and which remain uncertain?
- Where do analytics, support records, policy, or stakeholder accounts agree or conflict with direct evidence?

**Decision**

Lock the evidence interpretation and limitations, not a preferred solution. Record competing interpretations
when evidence does not distinguish them.

**Trace:** UX-R2, UX-R4; `SKILL.md` P2.

### D6 — Establish project identity and references

**Discuss with the user**

- Which `DESIGN.md`, brand, product, design-system, service, content, or policy documents govern this outcome?
- What does the live product or system already teach users through its language, sequence, feedback, trust
  signals, and recognizable patterns?
- What promise does the product make, to whom, in what voice, and with which values?
- Which identity traits must be felt in this experience? Which traits or patterns must never appear?
- Which existing conventions are deliberate, and which are inherited defects?
- Where does identity conflict with direct evidence, accessibility, safety, or platform convention?

**Decision**

Use UX-R5's authority chain. If no governing material is sufficient, lock a temporary run-scoped identity brief
covering promise, users, values, voice, recognizable patterns, constraints, and anti-patterns. Record conflicts
for explicit decision; do not waive the accessibility or safety floor.

**Trace:** UX-R5, UX-R10; `SKILL.md` P2.

### Gate G1 — Foundation and identity

Present D0–D6 as one foundation: outcome, actors, context, scope, direct research evidence and limits, references,
identity brief, risks, and open conflicts. Recommend the foundation and name the evidence that would reopen it.
The user explicitly approves or reopens an owning node.

**Trace:** UX-R7; `SKILL.md` P2.

### D7 — Design the top-down experience skeleton

**Discuss with the user**

- What are the major phases from trigger through observable completion?
- Where do actors, channels, systems, and teams exchange control or information?
- Which decisions, waits, failures, recovery routes, support paths, and completion signals must the skeleton show?
- Which ordering constraints are real, and which can concepts challenge?
- Where can a locally good unit cause the whole outcome to fail?

**Options and decision**

When the macro experience permits alternatives, show at least two skeletons or materially different sequencing
options. Recommend one from the foundation evidence. Lock the skeleton without selecting detailed surface
mechanics.

**Trace:** UX-R6, UX-R10; `SKILL.md` P3.

### Gate G2 — Skeleton

Show the whole actor/phase/channel/state map, scope boundary, failure zones, recovery, and unresolved questions.
The user explicitly approves it or reopens the foundation.

**Trace:** UX-R7; `SKILL.md` P3.

### D8 — Choose the smallest meaningful core unit

**Discuss with the user**

- What is the smallest task, information, content, or state unit that makes real progress toward completion?
- What must the person know, decide, provide, perceive, or control at this unit?
- What are its preconditions, input, output, feedback, error, recovery, accessibility, trust, and evidence needs?
- How does it connect to the next unit without breaking the skeleton?

**Decision**

Lock the core unit and grow the shortest complete path from it. Reject a unit that is elegant in isolation but
creates inconsistency, dead ends, hidden work, or cross-channel failure.

**Trace:** UX-R6, UX-R10; `SKILL.md` P4.

### Gate G3 — Core unit and path

Demonstrate the core path in the skeleton, including one applicable failure and recovery route. State its failure
oracle. The user explicitly approves it or reopens D7/D8.

**Trace:** UX-R7; `SKILL.md` P4.

### D9 — Grow every path, state, and obligation

**Discuss with the user as the specification grows**

- Which alternative-valid paths differ materially by actor, context, channel, input, or mode?
- What happens at empty, first, many, limit, timeout, interruption, dependency-failure, partial-completion, and
  resumption states where applicable?
- What content intent and information are needed at each unit? What must never be implied or hidden?
- How does each failure get detected, explained, contained, recovered, supported, and measured?
- Are trust, privacy, safety, agency, accessibility, language, or harm obligations missing from any path?
- Do cross-channel handoffs preserve state, intent, security, recovery, and completion evidence?

**Decision**

Lock each accumulated increment only after reconciling it with the skeleton and existing units. Keep unresolved
evidence and product decisions visible.

**Trace:** UX-R1, UX-R6, UX-R10, UX-R13; `SKILL.md` P5.

### Gate G4 — Accumulated specification

Present the complete actor/path/state/content/recovery/measure inventory and gap register. The user explicitly
approves the accumulated specification or reopens the earliest owning decision. An applicable open requirement
prevents the final gate.

**Trace:** UX-R7, UX-R9; `SKILL.md` P5.

### D10 — Compare materially different concepts

**Discuss with the user**

- Which experience models could satisfy the same approved obligations in genuinely different ways?
- How does each affect user control, effort, learning, confidence, accessibility, failure, recovery, trust,
  operations, and measurement?
- What evidence supports or rejects each concept?
- What would change the recommendation?

**Decision**

Present at least two materially different concepts and recommend one. If only one is viable, show the real
constraints and direct evidence proving that a second would be false, then ask the user to lock the UX-R8
exception. Do not count style or wording variations as different concepts.

**Trace:** UX-R8; `SKILL.md` P6.

### D11 — Complete the specification and success model

**Discuss with the user**

- Does the chosen concept satisfy every actor, path, state, content intent, recovery, support, inclusion, trust,
  safety, agency, harm, and non-goal obligation?
- What evidence proves each completion claim, and what remains uncertain?
- Which outcome, failure, recovery, accessibility, trust, and guardrail measures show whether the experience is
  working?
- How could each proxy be gamed or improve while the real outcome worsens?
- Which measure or evidence would reopen which decision?

**Decision**

Lock the concept, complete specification, measure set, instrumentation intent, limitations, rejected options,
and reopen conditions.

**Trace:** UX-R9, UX-R13; `SKILL.md` P6.

### Gate G5 — Final whole specification

Present the whole feature design document and its two-way trace from foundation to every obligation. The user
explicitly approves it. No prototype work starts before this gate passes.

**Trace:** UX-R6, UX-R7, UX-R9; `SKILL.md` P6.

### D12 — Decide the prototype question and fidelity

**Discuss with the user**

- Which remaining assumptions are most uncertain or costly if wrong?
- What must participants be able to perceive and do to answer those questions?
- Which approved paths, errors, recovery, accessibility, and cross-channel transitions must the prototype
  include?
- What is the lowest fidelity that can produce valid evidence without being mistaken for production?
- What behavior and data are simulated, and how will participants be told?

**Decision**

Lock the test questions, scope, fidelity, simulation boundaries, and disposal plan. Production implementation is
not an option in this decision.

**Trace:** UX-R11; `SKILL.md` P7.

### D13 — Plan direct prototype evaluation

**Discuss with the user**

- Which representative users and contexts are needed for each claim?
- What task framing avoids coaching toward the intended solution?
- What will be observed for comprehension, completion, alternatives, error, recovery, trust, accessibility,
  workaround, abandonment, and harm?
- What consent, accommodations, privacy, and data-retention conditions apply?
- What evidence is sufficient to revise, reject, or retain an assumption without a fixed participant-count rule?

**Decision**

Lock the evaluation plan and claim boundary. If the required conditions are missing, return `NEEDS_CONTEXT`.

**Trace:** UX-R3, UX-R4; `SKILL.md` P8.

### D14 — Interpret findings, revise, and hand off

**Discuss with the user after testing**

- Which observations are supported, disputed, limited, or contradicted?
- Which specification clauses, paths, states, content intents, or measures do the findings reopen?
- Has the specification been revised before the prototype?
- Which prototype changes and regression retests restore agreement?
- What limitations remain, who owns them, and do they block acceptance?
- Who owns surface realization, implementation questions, measurement, review cadence, and future deviations?

**Decision**

Lock the specification-first revision, prototype update, affected retest, evidence limitations, handoff owners,
and reopen conditions. If evidence conflicts with identity or stakeholder preference, show the conflict and let
the user decide above the non-waivable accessibility and safety floor.

**Trace:** UX-R10, UX-R12, UX-R14; `SKILL.md` P8–P9.

### Gate G6 — Post-test revision

Present direct-user evidence, limitations, specification changes, prototype changes, retest results, remaining
risks, success measures, and handoff. The user explicitly accepts, reopens, or stops the run. Acceptance is not
available when UX-R3 or UX-R4 is unmet.

**Trace:** UX-R3, UX-R4, UX-R7, UX-R12; `SKILL.md` P8.

## Completion sweep

Before leaving ideation, confirm that:

- every D-node has current evidence and a user decision, a recorded evidence gap, or a proved inapplicability;
- every required G-gate carries explicit approval or a reopen decision;
- stakeholder locks and representative-user evidence remain separate;
- every design recommendation names its references and evidence-to-change;
- at least two material concepts were compared or the UX-R8 exception is evidenced and locked;
- the whole specification gate predates every prototype artifact;
- post-test changes trace specification first, prototype second, and affected retest third; and
- project-specific follow-ups raised by the evidence are resolved or named as blockers.
