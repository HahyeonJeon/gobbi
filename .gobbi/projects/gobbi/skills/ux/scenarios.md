# UX Design — Scenario Source

Scenario source for testing whether one UX run produces a complete, evidence-led, cross-surface experience
specification and a directly tested disposable prototype. Load it for a pre-handoff self-check or through
`evaluation.md`. Every case exercises a parent clause and reserves checklist IDs from `checklists.md`; this file
adds no UX policy.

## Coverage register

| Category | Disposition | Coverage |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | One complete outcome, observable completion, and adjacent-outcome exclusion. |
| 2 Actors / stakeholders / use-context | selected | Primary/supporting actors, representative users, contexts, and stakeholder authority. |
| 3 Behavior / state / data | selected | Skeleton, bottom-up units, paths, states, content intent, and specification-first revision. |
| 4 Interfaces / dependencies / structure | selected | Channels, handoffs, supporting systems, UX/UI co-loading, and future child specialization. |
| 5 Quality attributes / resource economics | selected | Research/prototype effort sized to uncertainty and risk; measures bounded against gaming. |
| 6 Failure / recovery / operations | selected | Missing context, dependency failure, cross-channel loss, error recovery, retest, and handoff. |
| 7 Trust / harm / governance | selected | Consent, privacy, identity conflict, safety, agency, harm, and evidence authority. |
| 8 Inclusion / locale | selected | Representative inclusion, accommodations, accessibility, language/context, and non-waivable floor. |
| 9 Change / compatibility / reversibility | selected | Disposable prototypes, revision order, regression retest, and child-skill deviations. |
| 10 Evidence / traceability / clarity | selected | Direct evidence gates, decision traces, whole-spec approval, measures, and no-silent-change handoff. |

## Family UX-F1 — One complete outcome across surfaces

**Primary category:** 1 Purpose / outcomes / scope — the defining discrimination is whether the run owns a
whole observable outcome. **Secondary:** 2 Actors / stakeholders / use-context, 4 Interfaces / dependencies /
structure, 10 Evidence / traceability / clarity.

### UX-SCENARIO-01 — Returning user completes authentication

- **Primary type:** Positive.
- **Coverage role:** positive — exercises a complete valid outcome.
- **Given:** an eligible returning user needs to authenticate and reach the intended signed-in destination.
- **When:** the run binds entry, actors, normal/alternative paths, states, errors, recovery, support, and
  observable completion.
- **Then:** the outcome is specified end to end without absorbing registration, password reset, account
  administration, or onboarding.
- **Failure oracle:** the design stops at a login screen, omits a recovery state, or claims success before the
  intended destination is verified.
- **Evidence tuple:** observe the feature document with a scope/path/state trace; confirm every required path
  reaches the completion signal.
- **Obligation:** the design must own one complete authentication outcome and explicit adjacent non-goals.
- **Exercises:** UX-R1; P1, P3–P6; cross-surface boundary example.
- **Checklist IDs:** `UX-CHECK-01`, `UX-CHECK-02`, `UX-CHECK-07`, `UX-CHECK-09`.

### UX-SCENARIO-02 — Command-line authentication is an alternative-valid realization

- **Primary type:** Alternative-valid.
- **Coverage role:** alternative-valid — exercises another valid channel for the same outcome.
- **Given:** `tool auth login` opens an external authorization handoff and returns control to the terminal.
- **When:** the experience specifies feedback, cancellation, timeout, recovery, and verified authenticated state.
- **Then:** the command-line path satisfies the same outcome obligations without copying web mechanics.
- **Failure oracle:** a URL is printed with no state continuity, timeout/recovery, or terminal completion proof.
- **Evidence tuple:** inspect the channel/path trace and test the specified handoff outcomes against the skeleton.
- **Obligation:** cross-surface variants must preserve the outcome while allowing platform-specific mechanics.
- **Exercises:** UX-R1, UX-R14; P3, P5, P9.
- **Checklist IDs:** `UX-CHECK-01`, `UX-CHECK-09`, `UX-CHECK-17`.

### UX-SCENARIO-03 — Adjacent outcomes are pressured into the run

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests scope expansion disguised as completeness.
- **Given:** a stakeholder asks to add registration, password reset, and account settings “while designing
  login.”
- **When:** the outcome contract is reviewed.
- **Then:** necessary login recovery remains, independent outcomes stay out, and any scope change returns to the
  user.
- **Failure oracle:** adjacent features enter because they share screens, identity, or implementation code.
- **Evidence tuple:** compare the request with the outcome sentence, completion signal, and locked non-goals.
- **Obligation:** shared surface or code must not silently broaden the outcome contract.
- **Exercises:** UX-R1; P1; `ideation.md` D3.
- **Checklist IDs:** `UX-CHECK-01`.

### UX-SCENARIO-04 — The scope edge is stated exactly

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary — exercises the exact transition between required recovery and another outcome.
- **Given:** failed credentials need explanation and retry, while forgotten credentials require a separate reset
  outcome.
- **When:** scope is classified at the handoff boundary.
- **Then:** explanation, retry, and safe handoff are specified; the reset experience itself remains a named
  dependency/non-goal.
- **Failure oracle:** either required recovery is cut as “another feature,” or the entire reset outcome is
  absorbed.
- **Evidence tuple:** inspect the boundary clause and both sides of the handoff in the skeleton.
- **Obligation:** scope must include necessary continuity while excluding independent completion contracts.
- **Exercises:** UX-R1; P1, P3.
- **Checklist IDs:** `UX-CHECK-01`, `UX-CHECK-07`.

## Family UX-F2 — Direct research, representativeness, and ethics

**Primary category:** 2 Actors / stakeholders / use-context — evidence validity turns on whose behavior and
context support the claim. **Secondary:** 7 Trust / harm / governance, 8 Inclusion / locale, 10 Evidence /
traceability / clarity.

### UX-SCENARIO-05 — New generative research shapes the run

- **Primary type:** Positive.
- **Coverage role:** positive — exercises new direct evidence before convergence.
- **Given:** prior research and analytics exist for related authentication behavior.
- **When:** the team conducts a new, neutral generative inquiry with representative users for this bounded run.
- **Then:** current behavior, barriers, workarounds, language, trust, and context inform the foundation with
  explicit limits.
- **Failure oracle:** the design converges from existing reports alone or research questions pitch the intended
  solution.
- **Evidence tuple:** inspect research dates, questions, participant-context rationale, observations, synthesis,
  and decision effects.
- **Obligation:** every run must add new representative-user generative evidence before convergence.
- **Exercises:** UX-R2, UX-R4; P1–P2.
- **Checklist IDs:** `UX-CHECK-03`, `UX-CHECK-04`, `UX-CHECK-20`.

### UX-SCENARIO-06 — Prior evidence or the project owner is offered as a substitute

- **Primary type:** Counterfactual / assumption.
- **Coverage role:** counterfactual — inverts the premise that prior or owner evidence is sufficient.
- **Given:** a project owner says they know users and a prior study already covered login.
- **When:** representativeness and recency are examined.
- **Then:** prior evidence frames the inquiry; the owner counts only for claims their real context represents;
  new direct research remains required.
- **Failure oracle:** seniority, domain knowledge, or document presence is treated as representative evidence.
- **Evidence tuple:** compare claimed population/context with the owner's actual context and the new research
  question.
- **Obligation:** evidence authority must come from representativeness, not ownership or familiarity.
- **Exercises:** UX-R2; P1–P2.
- **Checklist IDs:** `UX-CHECK-03`, `UX-CHECK-20`.

### UX-SCENARIO-07 — Representative access or consent is unavailable

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery — exercises the required stop and recovery plan.
- **Given:** representative users cannot be reached, informed consent is absent, or needed accommodations are
  unavailable.
- **When:** the precondition gate runs.
- **Then:** the run returns `NEEDS_CONTEXT`, records assumptions and a research plan, and withholds accepted-final
  status.
- **Failure oracle:** stakeholder approval, a proxy participant, or a disclaimer is used to bypass the gate.
- **Evidence tuple:** inspect access/consent/accommodation records and final status language.
- **Obligation:** missing ethical or evidence preconditions must fail closed without pretending the design is
  accepted.
- **Exercises:** UX-R3, UX-R4; P1, P8.
- **Checklist IDs:** `UX-CHECK-03`, `UX-CHECK-04`, `UX-CHECK-14`.

### UX-SCENARIO-08 — Research is performed after the solution is locked

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests research used as validation theater.
- **Given:** one polished concept is already treated as final before participants are contacted.
- **When:** interviews are framed to confirm it and contrary observations cannot change the design.
- **Then:** the earliest affected decision reopens and neutral generative research precedes convergence.
- **Failure oracle:** the existence of interview sessions is accepted as evidence despite a non-falsifiable plan.
- **Evidence tuple:** inspect question neutrality, timing, decision status, disconfirming probes, and recorded
  changes from findings.
- **Obligation:** research must be able to change the direction rather than decorate a locked answer.
- **Exercises:** UX-R2, UX-R4; P2; Must-Not-Follow performative-research rule.
- **Checklist IDs:** `UX-CHECK-03`, `UX-CHECK-20`.

## Family UX-F3 — Identity and reference foundation

**Primary category:** 7 Trust / harm / governance — identity has authority limits where it conflicts with
evidence, access, or safety. **Secondary:** 1 Purpose / outcomes / scope, 8 Inclusion / locale, 10 Evidence /
traceability / clarity.

### UX-SCENARIO-09 — No governing DESIGN material exists

- **Primary type:** Positive.
- **Coverage role:** positive — exercises the documented identity fallback.
- **Given:** no adequate `DESIGN.md`, brand, product, or design-system document exists.
- **When:** the agent reads the live product and asks what those materials would define.
- **Then:** the user confirms a run-scoped identity brief in the feature design document; no project-wide file
  is invented.
- **Failure oracle:** identity is guessed, ignored until polish, or converted into an unauthorized global
  `DESIGN.md`.
- **Evidence tuple:** inspect the authority-chain search, live-product evidence, identity questions, and explicit
  confirmation.
- **Obligation:** missing identity material must trigger evidence gathering and a bounded confirmed brief.
- **Exercises:** UX-R5; P2; `ideation.md` D6.
- **Checklist IDs:** `UX-CHECK-05`, `UX-CHECK-06`.

### UX-SCENARIO-10 — Identity conflicts with accessibility or direct evidence

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests brand authority used to excuse exclusion.
- **Given:** an identity preference reduces comprehension, access, safety, or trust for representative users.
- **When:** the conflict reaches a decision gate.
- **Then:** evidence and trade-offs are shown to the user; the result stays above the accessibility and safety
  floor.
- **Failure oracle:** “on brand” overrides direct evidence or the conflict is silently decided by the agent.
- **Evidence tuple:** inspect the conflict record, accessibility/safety evidence, options, and explicit decision.
- **Obligation:** identity conflicts must be visible and cannot waive access or safety.
- **Exercises:** UX-R5, UX-R10; P2, P5–P6.
- **Checklist IDs:** `UX-CHECK-05`, `UX-CHECK-10`.

## Family UX-F4 — Top-down skeleton and bottom-up growth

**Primary category:** 3 Behavior / state / data — the defining discrimination is construction order and
whole-to-unit coherence. **Secondary:** 4 Interfaces / dependencies / structure, 6 Failure / recovery /
operations, 10 Evidence / traceability / clarity.

### UX-SCENARIO-11 — Skeleton first, specification grows one unit at a time

- **Primary type:** Positive.
- **Coverage role:** positive — exercises the required construction sequence.
- **Given:** the foundation is approved.
- **When:** the agent maps the top-down skeleton, then grows the smallest meaningful unit into the core path and
  every remaining path/state.
- **Then:** each increment traces to the skeleton and passes its user gate before the whole specification closes.
- **Failure oracle:** local detail precedes the skeleton, or the complete specification appears in one ungated
  pass.
- **Evidence tuple:** inspect artifact timestamps/order, unit-to-skeleton traces, and gate decisions.
- **Obligation:** the design must grow top-down then bottom-up in observable increments.
- **Exercises:** UX-R6, UX-R7; P3–P6.
- **Checklist IDs:** `UX-CHECK-06`, `UX-CHECK-07`, `UX-CHECK-08`, `UX-CHECK-09`.

### UX-SCENARIO-12 — A polished big-bang design is requested

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests polish used to skip evidence and construction gates.
- **Given:** a stakeholder requests a finished, polished design in one pass.
- **When:** the required sequence is compared with the request.
- **Then:** the run stays staged; polish cannot replace foundation, skeleton, unit growth, whole-spec, or test
  evidence.
- **Failure oracle:** a complete-looking artifact is accepted because review is easier after it exists.
- **Evidence tuple:** inspect decision/order records and attempt to locate every required gate before the final
  artifact.
- **Obligation:** cosmetic completeness must fail when the staged operating contract is absent.
- **Exercises:** UX-R6, UX-R7; Must-Not-Follow big-bang rule.
- **Checklist IDs:** `UX-CHECK-06`.

### UX-SCENARIO-13 — Prototype is requested before the whole specification

- **Primary type:** Negative / Bad.
- **Coverage role:** negative — exercises safe rejection of an invalid precondition.
- **Given:** the skeleton or core path is approved but the accumulated/whole specification is incomplete.
- **When:** someone asks for a prototype “to figure out the rest.”
- **Then:** prototype work does not start; the run returns to specification growth and final approval.
- **Failure oracle:** a milestone prototype exists before the timestamped whole-spec gate.
- **Evidence tuple:** compare prototype creation time and scope with the final approval record.
- **Obligation:** no prototype may precede whole-specification completion and approval.
- **Exercises:** UX-R6, UX-R9, UX-R11; P5–P7.
- **Checklist IDs:** `UX-CHECK-11`, `UX-CHECK-12`.

### UX-SCENARIO-14 — A strong local unit breaks the experience skeleton

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery — exercises detection and return to the owning layer.
- **Given:** one task or channel works well alone but creates a dead end, state loss, or conflicting handoff in
  the skeleton.
- **When:** the unit-to-skeleton trace is checked.
- **Then:** the unit or skeleton is revised, all affected paths are rechecked, and the user gate reruns.
- **Failure oracle:** local usability evidence is used to ignore whole-outcome failure.
- **Evidence tuple:** inspect the failed integration path, revision, regression sweep, and renewed decision.
- **Obligation:** local success cannot pass while the complete experience fails.
- **Exercises:** UX-R6, UX-R7; P3–P5.
- **Checklist IDs:** `UX-CHECK-07`, `UX-CHECK-08`, `UX-CHECK-09`.

## Family UX-F5 — Concepts and whole-specification approval

**Primary category:** 10 Evidence / traceability / clarity — concept selection and prototype eligibility depend
on an explicit evidence trail. **Secondary:** 1 Purpose / outcomes / scope, 3 Behavior / state / data, 5 Quality
attributes / resource economics.

### UX-SCENARIO-15 — Two materially different concepts are compared

- **Primary type:** Positive.
- **Coverage role:** positive — exercises valid divergence and user selection.
- **Given:** the accumulated specification admits different experience models.
- **When:** two concepts are compared across effort, control, access, trust, failure, recovery, and evidence.
- **Then:** a reference-backed recommendation and evidence-to-change precede the user's locked choice.
- **Failure oracle:** the first plausible pattern becomes the design without material comparison.
- **Evidence tuple:** inspect concept structures, trade-off matrix, references, recommendation, and decision.
- **Obligation:** design convergence must follow a material concept comparison by default.
- **Exercises:** UX-R8; P6.
- **Checklist IDs:** `UX-CHECK-10`.

### UX-SCENARIO-16 — One concept is duplicated cosmetically

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests false divergence.
- **Given:** two concepts differ only in naming, tone, layout polish, or minor sequence wording.
- **When:** their skeleton, control model, path/state behavior, and recovery are compared.
- **Then:** they count as one; a material alternative or the evidenced single-concept exception is required.
- **Failure oracle:** two labeled mockups satisfy the concept gate despite identical experience mechanics.
- **Evidence tuple:** remove cosmetic differences and compare the remaining experience models.
- **Obligation:** the concept gate must discriminate structure and behavior, not presentation labels.
- **Exercises:** UX-R8; P6.
- **Checklist IDs:** `UX-CHECK-10`.

### UX-SCENARIO-17 — A real constraint permits one concept

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary — exercises the exact exception threshold.
- **Given:** legal, safety, platform, or interoperability constraints plus direct evidence leave no truthful
  material alternative.
- **When:** the single-concept exception is proposed.
- **Then:** the constraint, evidence, rejected false divergence, and user decision are recorded.
- **Failure oracle:** convenience, deadline, or familiarity is accepted as proof that divergence is false.
- **Evidence tuple:** attempt to construct a materially different compliant concept and inspect why evidence
  rules it out.
- **Obligation:** the exception must be evidence-bearing and narrower than a preference for one option.
- **Exercises:** UX-R8; P6.
- **Checklist IDs:** `UX-CHECK-10`.

### UX-SCENARIO-18 — Whole document is complete before approval

- **Primary type:** Positive.
- **Coverage role:** positive — exercises whole-spec and document-schema closure.
- **Given:** one concept is selected.
- **When:** every schema section, actor, path, state, recovery, conflict, measure, limitation, and trace is
  reviewed.
- **Then:** explicit whole-spec approval is recorded before prototype creation.
- **Failure oracle:** section headings, “mostly complete,” or earlier milestone approvals are treated as the
  final gate.
- **Evidence tuple:** inspect schema content, orphan sweep, explicit approval, and artifact chronology.
- **Obligation:** the complete evidence-bearing specification must pass as a whole before prototyping.
- **Exercises:** UX-R7, UX-R9; P6.
- **Checklist IDs:** `UX-CHECK-06`, `UX-CHECK-11`, `UX-CHECK-12`.

## Family UX-F6 — Cross-channel state, failure, and recovery

**Primary category:** 4 Interfaces / dependencies / structure — the defining discrimination is continuity
across actor, channel, and system boundaries. **Secondary:** 3 Behavior / state / data, 6 Failure / recovery /
operations, 8 Inclusion / locale.

### UX-SCENARIO-19 — Cross-channel handoff preserves the outcome

- **Primary type:** Positive.
- **Coverage role:** positive — exercises a valid multi-channel path.
- **Given:** authentication moves from a terminal to a browser or from self-service to supported recovery.
- **When:** intent, state, security, feedback, accessibility, return path, and completion evidence are specified.
- **Then:** the person can continue and verify completion without reconstructing hidden state.
- **Failure oracle:** each channel works alone but the transition loses context or leaves ambiguous completion.
- **Evidence tuple:** walk the handoff in both directions against the skeleton and state inventory.
- **Obligation:** required channels must form one coherent outcome, not separate local successes.
- **Exercises:** UX-R1, UX-R10; P3–P5.
- **Checklist IDs:** `UX-CHECK-07`, `UX-CHECK-09`.

### UX-SCENARIO-20 — Handoff times out after partial progress

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery — exercises interruption, containment, and safe resumption.
- **Given:** the external authorization handoff times out after one channel shows progress.
- **When:** the person returns to the initiating channel.
- **Then:** the experience states what happened, preserves no unsafe partial success, and offers a clear retry,
  cancel, support, or safe exit path.
- **Failure oracle:** one channel claims success, the other waits indefinitely, or retry duplicates a harmful
  action.
- **Evidence tuple:** inject the specified timeout at each transition and inspect state, messaging intent,
  recovery, and completion evidence.
- **Obligation:** cross-channel failure must be detectable, contained, recoverable, and consistent.
- **Exercises:** UX-R1, UX-R10; P5.
- **Checklist IDs:** `UX-CHECK-09`.

### UX-SCENARIO-21 — Separate channel specs hide a broken whole

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests cosmetic per-channel compliance.
- **Given:** web and command-line sections each list polished screens/commands and success states.
- **When:** the shared state and handoff contract are removed.
- **Then:** the design fails because no evidence proves end-to-end continuity.
- **Failure oracle:** present channel sections are accepted without a cross-channel path test.
- **Evidence tuple:** attempt the complete outcome using only stated interface contracts and observe the orphan.
- **Obligation:** local surface completeness cannot substitute for cross-channel integration evidence.
- **Exercises:** UX-R1, UX-R14; P3–P5.
- **Checklist IDs:** `UX-CHECK-09`, `UX-CHECK-17`.

## Family UX-F7 — Disposable prototype and direct evaluation

**Primary category:** 9 Change / compatibility / reversibility — the prototype is disposable, and findings
change the specification before its representation. **Secondary:** 2 Actors / stakeholders / use-context,
6 Failure / recovery / operations, 8 Inclusion / locale, 10 Evidence / traceability / clarity.

### UX-SCENARIO-22 — Approved specification is tested with representative users

- **Primary type:** Positive.
- **Coverage role:** positive — exercises proportionate prototype and direct evaluation gates.
- **Given:** the whole specification is approved and named uncertainties remain.
- **When:** the lowest sufficient prototype is evaluated directly with representative users under consent and
  accommodation conditions.
- **Then:** observations and bounded claims address completion, errors, recovery, trust, access, and harm.
- **Failure oracle:** stakeholder walkthrough, expert review, prior testing, or prototype presence is called
  direct-user acceptance evidence.
- **Evidence tuple:** inspect chronology, participant rationale, consent, task method, observations, limits, and
  trace to test questions.
- **Obligation:** prototype acceptance must rest on new direct representative-user evaluation.
- **Exercises:** UX-R3, UX-R4, UX-R11; P7–P8.
- **Checklist IDs:** `UX-CHECK-12`, `UX-CHECK-13`, `UX-CHECK-14`.

### UX-SCENARIO-23 — Prototype excludes the access path being claimed

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests inaccessible evidence used to claim inclusion.
- **Given:** the specification claims an accessible path, but the prototype or study method prevents relevant
  participants from using it.
- **When:** the evidence claim is reviewed.
- **Then:** the claim fails, the prototype/method is corrected from the specification, and affected users test it.
- **Failure oracle:** a checklist note, expert opinion, or planned future implementation substitutes for usable
  prototype evidence.
- **Evidence tuple:** compare claimed access needs with participant accommodations, modality, and observed use.
- **Obligation:** the prototype and method must permit direct evidence for each acceptance claim.
- **Exercises:** UX-R3, UX-R4, UX-R10; P7–P8.
- **Checklist IDs:** `UX-CHECK-04`, `UX-CHECK-13`, `UX-CHECK-14`.

### UX-SCENARIO-24 — Finding changes only the mockup

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery — exercises specification-first repair and retest.
- **Given:** prototype evaluation exposes a confusing recovery state.
- **When:** the mockup is edited without changing its owning requirement or path.
- **Then:** acceptance blocks; the specification changes first, the prototype follows, and affected assumptions
  and regressions are retested.
- **Failure oracle:** visual improvement is accepted while the handed-off contract remains wrong.
- **Evidence tuple:** inspect finding timestamps and trace specification revision → prototype revision → retest.
- **Obligation:** every supported finding must repair the durable experience contract before its test artifact.
- **Exercises:** UX-R12; P8.
- **Checklist IDs:** `UX-CHECK-15`.

## Family UX-F8 — Measurement, co-loading, and handoff change control

**Primary category:** 10 Evidence / traceability / clarity — the defining discrimination is whether claims and
future changes stay tied to outcome evidence. **Secondary:** 4 Interfaces / dependencies / structure, 5 Quality
attributes / resource economics, 7 Trust / harm / governance, 9 Change / compatibility / reversibility.

### UX-SCENARIO-25 — Outcome measures include guardrails and reopen conditions

- **Primary type:** Positive.
- **Coverage role:** positive — exercises continued evidence after handoff.
- **Given:** the design reaches post-test approval.
- **When:** outcome, failure, recovery, access, trust, and harm measures are defined with owners and review
  cadence.
- **Then:** each measure states its interpretation limits, guardrails, and evidence that reopens the design.
- **Failure oracle:** success is a dashboard proxy with no relation to completed outcomes or user harm.
- **Evidence tuple:** trace each measure to an obligation and simulate an improving proxy with worsening user
  outcome.
- **Obligation:** measurement must support the outcome and expose harmful interpretations.
- **Exercises:** UX-R13, UX-R14; P6, P9.
- **Checklist IDs:** `UX-CHECK-16`, `UX-CHECK-17`.

### UX-SCENARIO-26 — Metric improves while the user outcome worsens

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial — tests metric gaming and proxy inversion.
- **Given:** authentication completion rate rises because recovery exits and difficult users are excluded.
- **When:** the metric is read without failure, abandonment, accessibility, or harm guardrails.
- **Then:** the metric set fails and the design/measurement decision reopens.
- **Failure oracle:** a higher headline number alone is accepted as success.
- **Evidence tuple:** construct the counterexample and inspect whether guardrails detect it.
- **Obligation:** no gameable proxy may stand alone as outcome evidence.
- **Exercises:** UX-R13; P9.
- **Checklist IDs:** `UX-CHECK-16`.

### UX-SCENARIO-27 — Co-loaded UI and UX guidance conflict

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery — exercises conflict detection and user resolution.
- **Given:** UX evidence requires one recovery model while UI guidance recommends a conflicting surface pattern.
- **When:** both skills are loaded.
- **Then:** the concrete conflict, evidence, and trade-offs are shown to the user; no precedence or load-order
  rule is invented, and the accessibility/safety floor remains.
- **Failure oracle:** one parent silently overrides the other or the implementation chooses by convenience.
- **Evidence tuple:** inspect both clauses, their evidence, the user decision, and preserved non-waivable floor.
- **Obligation:** co-loaded parent conflicts must be explicit, evidence-led user decisions.
- **Exercises:** UX-R10, UX-R14; Intro; Must-Not-Follow co-load rule.
- **Checklist IDs:** `UX-CHECK-18`.

### UX-SCENARIO-28 — Future child silently changes the experience contract

- **Primary type:** Change / regression / compat.
- **Coverage role:** change/regression — exercises specialization without parent regression.
- **Given:** a future web, command-line, or desktop child skill specializes exact mechanics.
- **When:** it drops a parent actor, state, recovery, access, safety, evidence, or measure obligation.
- **Then:** the deviation fails and returns to the user before handoff; mechanics may differ, parent invariants may
  not disappear silently.
- **Failure oracle:** platform specificity is treated as authority to narrow the outcome contract.
- **Evidence tuple:** diff child obligations against parent traces and run the complete outcome scenarios.
- **Obligation:** child specialization must preserve parent evidence and experience invariants.
- **Exercises:** UX-R14; P9.
- **Checklist IDs:** `UX-CHECK-17`, `UX-CHECK-18`.

## Triggered-minimum audit

| Family | Boundary | Failure / recovery | Adversarial | Change / regression | Counterfactual |
|---|---|---|---|---|---|
| UX-F1 | `UX-SCENARIO-04` | `n/a: no dependency failure is the defining concern of this scope family` | `UX-SCENARIO-03` | `n/a: no existing-contract change occurs` | `n/a: no additional load-bearing premise beyond the outcome boundary` |
| UX-F2 | `n/a: sample size is risk-based rather than a fixed numeric edge` | `UX-SCENARIO-07` | `UX-SCENARIO-08` | `n/a: the family tests current-run evidence, not a version transition` | `UX-SCENARIO-06` |
| UX-F3 | `n/a: the authority chain is ordinal, not a quantity transition` | `n/a: no operational dependency failure is introduced` | `UX-SCENARIO-10` | `n/a: identity is established for this run` | `n/a: missing identity follows an explicit positive fallback` |
| UX-F4 | `n/a: milestone order is categorical rather than numeric` | `UX-SCENARIO-14` | `UX-SCENARIO-12` | `n/a: construction is within one run` | `n/a: the order is a parent invariant, not an assumption` |
| UX-F5 | `UX-SCENARIO-17` | `n/a: no dependency or partial mutation is introduced` | `UX-SCENARIO-16` | `n/a: concept comparison precedes change-controlled handoff` | `n/a: concept viability is tested directly by the exception boundary` |
| UX-F6 | `n/a: timeout is exercised as failure/recovery, not a numeric product limit` | `UX-SCENARIO-20` | `UX-SCENARIO-21` | `n/a: no version transition occurs` | `n/a: cross-channel continuity is a required contract` |
| UX-F7 | `n/a: prototype fidelity has no universal numeric limit` | `UX-SCENARIO-24` | `UX-SCENARIO-23` | `n/a: revision order is exercised as recovery within the run` | `n/a: direct evaluation is a required evidence gate` |
| UX-F8 | `n/a: measure thresholds are outcome-specific` | `UX-SCENARIO-27` | `UX-SCENARIO-26` | `UX-SCENARIO-28` | `n/a: proxy inversion is covered adversarially` |

## Guaranteed coverage map

Every scenario names at least one `UX-CHECK-*` obligation. The authoritative check-to-scenario reverse map is
in `checklists.md`. Parent-clause coverage closes in both directions through each case's **Exercises** field and
the checklist's **Source** field.
