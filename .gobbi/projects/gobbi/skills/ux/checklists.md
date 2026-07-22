# UX Design — Operational Checklist

Unchecked reusable source for running and evaluating one UX design outcome. Never mark this source. Each run
works a fresh filled copy that records three distinct provenance fields: this source's identity/path, its
immutable source version or revision (for example a commit SHA, release tag, or content hash), and the run
identity (for example session plus task/evaluation ID). Stable item IDs identify checks, not source bytes; the
run identity identifies the execution, not the source revision. Mode: **operational**. Default use style is
**read-do** at pause points A–D and **do-confirm** at pause point E; a filled copy declares the actual style at
each pause point.

Coverage closure means every applicable gate and required item has a valid terminal resolution. Acceptance is a
separate result: every applicable gate and required item must be `PASS`, except that the checklist owner's
bounded operational waiver may substitute on at most one **non-protected gate** when named authority covers that
item's consequence and stop action and the authorization evidence and rationale are recorded. A waiver never
counts as `PASS`.

Five protected mandatory classes are explicitly non-waivable: (1) current-run direct generative research before
convergence (`UX-CHECK-03`); (2) complete whole-specification approval before every prototype, including both
document closure and chronology (`UX-CHECK-11`, `UX-CHECK-12`); (3) current direct representative-user prototype
evaluation (`UX-CHECK-14`); (4) accessibility in any applicable item's claim or pass condition; and (5) safety
in any applicable item's claim or pass condition. A waiver token on a protected item is invalid: it closes
neither coverage nor acceptance. Resolve that item with a permitted terminal; `FAIL` or `recorded-open` can close
coverage but cannot accept the run. A recorded-open or failed non-protected item likewise closes coverage
without acceptance.

## Resolution legend

- `PASS` — the pass condition was verified from the named inspected evidence.
- `FAIL:<finding-id>` — the pass condition was verified false and the finding/action is cited.
- `n/a:<property>` — inspected evidence proves the applicability predicate false.
- `recorded-open:<owner+resolution-method>` — operational coverage is closed but acceptance is not granted.
- `waived/exception-authorized:<authority+rationale>` — permitted only for an operational gate when the named
  authority covers its stated consequence; it does not count as `PASS`. It is invalid for direct generative
  research, whole-specification-before-prototype document closure or chronology, direct representative-user
  prototype evaluation, accessibility, or safety.

## Protected-waiver acceptance truth table

Each adversarial row holds every other applicable gate and required item at `PASS`. Coverage closure and
acceptance are evaluated separately.

| Protected class | Attempted protected-item resolution | All other applicable items | Coverage closed? | Accepted? |
|---|---|---|---|---|
| Direct generative research (`UX-CHECK-03`) | `waived/exception-authorized:<authority+rationale>` | `PASS` | No — invalid token | No |
| Whole-specification-before-prototype (`UX-CHECK-11` or `UX-CHECK-12`) | `waived/exception-authorized:<authority+rationale>` | `PASS` | No — invalid token | No |
| Direct representative-user prototype evaluation (`UX-CHECK-14`) | `waived/exception-authorized:<authority+rationale>` | `PASS` | No — invalid token | No |
| Accessibility in any applicable item | `waived/exception-authorized:<authority+rationale>` | `PASS` | No — invalid token | No |
| Safety in any applicable item | `waived/exception-authorized:<authority+rationale>` | `PASS` | No — invalid token | No |
| Coverage/acceptance separation control | protected item is `FAIL:<finding-id>` or `recorded-open:<owner+resolution-method>` | `PASS` | Yes | No |
| Bounded-waiver control | every protected item is `PASS`; one non-protected gate has a valid authorized waiver | `PASS` | Yes | Yes, only under the bounded exception |

## Pause point A — Before the skeleton: outcome, people, evidence, identity

- [ ] **UX-CHECK-01 [GATE, read-do] — One complete observable outcome is bound.**
  - Applicability: unconditional.
  - Pass: one outcome sentence names trigger/context, primary actor, observable completion, false completion,
    scope, and non-goals; entry, alternatives, states, errors, recovery, handoffs, support, and supporting actors
    required to complete it are in scope; independent adjacent outcomes are out.
  - Evidence: user-locked outcome contract and outcome-to-path inventory.
  - On fail: stop construction and return to P1; otherwise an incomplete or expanded outcome will govern every
    later artifact.
  - Source: `SKILL.md` UX-R1, P1; `UX-SCENARIO-01`–`04`.
- [ ] **UX-CHECK-02 [REQUIRED, read-do] — Actors and contexts match the claims.**
  - Applicability: unconditional.
  - Pass: primary/supporting actors, decision authority, channels, environments, constraints, access needs, and
    evidence gaps are named; the design does not collapse stakeholder, operator, approver, and affected person
    into one generic user.
  - Evidence: actor/context map plus evidence-limit annotations.
  - On fail: return to P1–P2 and narrow unsupported claims.
  - Source: `SKILL.md` UX-R1, UX-R2, P1–P2; `UX-SCENARIO-01`, `05`, `06`.
- [ ] **UX-CHECK-03 [GATE, read-do] — New direct generative research precedes convergence.**
  - Applicability: unconditional.
  - Pass: current-run direct research with representative users addresses a named generative question before
    concept convergence; prior evidence and stakeholder input are context only; neutral questions and
    disconfirming observations can change the direction.
  - Evidence: dated research plan/record, participant-context rationale, neutral prompts, synthesis, limitations,
    and decision effects.
  - On fail: halt design convergence and return to P1–P2; otherwise the run rests on untested assumptions or
    performative evidence.
  - Source: `SKILL.md` UX-R2, P1–P2; `UX-SCENARIO-05`–`08`.
- [ ] **UX-CHECK-04 [GATE, read-do] — Research conditions and claims are ethical and supportable.**
  - Applicability: every generative or evaluative research activity.
  - Pass: representative access, informed consent, accommodations, privacy/data handling, method, and
    claim-to-sample boundary are evidenced; no fixed count replaces risk/question reasoning; missing conditions
    produce `NEEDS_CONTEXT` and no accepted-final claim.
  - Evidence: recruitment rationale, consent/accommodation record, data plan, evidence limits, and current status.
  - On fail: stop research/design acceptance and return `NEEDS_CONTEXT`; otherwise participants or unsupported
    populations may be harmed or misrepresented.
  - Source: `SKILL.md` UX-R3, UX-R4, P1–P2, P8; `UX-SCENARIO-05`, `07`, `22`, `23`.
- [ ] **UX-CHECK-05 [GATE, read-do] — Project identity follows the evidence authority chain.**
  - Applicability: unconditional.
  - Pass: governing design/brand/product/system material, live product/system/tokens, and any user-confirmed
    temporary brief are applied in that order; missing material triggers DESIGN-like questions and a run-scoped
    brief; conflicts are explicit; no project-wide `DESIGN.md` is invented; accessibility/safety remain the floor.
  - Evidence: identity/reference register, live evidence, temporary brief if needed, conflict record, and user
    decision.
  - On fail: stop at the foundation gate and return to P2; otherwise an invented, stale, or harmful identity will
    constrain every later decision.
  - Source: `SKILL.md` UX-R5, UX-R10, P2; `UX-SCENARIO-09`, `10`.
- [ ] **UX-CHECK-20 [REQUIRED, read-do] — Stakeholder decisions and representative-user evidence remain distinct.**
  - Applicability: unconditional.
  - Pass: each product lock names its authority; each experience claim names representative-user evidence and
    limits; a project owner counts as evidence only for contexts they genuinely represent.
  - Evidence: decision/evidence ledger and representativeness rationale.
  - On fail: return to the affected discussion or research step and correct the claim source.
  - Source: `SKILL.md` UX-R2, UX-R7, P1–P2; `UX-SCENARIO-05`, `06`, `08`.

## Pause point B — During specification growth: order and whole coherence

- [ ] **UX-CHECK-06 [GATE, read-do] — Construction and user-gate order is intact.**
  - Applicability: unconditional.
  - Pass: evidence shows outcome/context → foundation/identity/research → skeleton → core unit/path → accumulated
    specification → concepts → whole-spec approval → prototype → direct test → specification-first revision →
    prototype revision → affected retest → handoff, with explicit foundation, skeleton, core, accumulated,
    whole-spec, and post-test gates.
  - Evidence: artifact chronology and explicit user-decision records; silence or continued work is not a record.
  - On fail: stop at the earliest reordered or unapproved stage and reopen it; otherwise later evidence is built
    on an unauthorized or incomplete design.
  - Source: `SKILL.md` UX-R6, UX-R7, P1–P9; `UX-SCENARIO-09`, `11`, `12`, `18`.
- [ ] **UX-CHECK-07 [GATE, read-do] — The top-down skeleton covers the whole outcome.**
  - Applicability: unconditional after pause point A passes.
  - Pass: actor lanes, major phases, channels, dependencies, handoffs, decisions, state transitions, failure
    zones, recovery, support, completion evidence, scope, and uncertainty are mapped before local detail.
  - Evidence: approved skeleton and source/outcome trace.
  - On fail: stop bottom-up growth and return to P3; otherwise local units have no whole-experience contract.
  - Source: `SKILL.md` UX-R6, UX-R7, P3; `UX-SCENARIO-01`, `04`, `11`, `14`, `19`.
- [ ] **UX-CHECK-08 [REQUIRED, read-do] — The smallest meaningful unit grows into a coherent core path.**
  - Applicability: unconditional after the skeleton gate.
  - Pass: the unit states intent, information/content, preconditions, input/output, state, feedback, errors,
    recovery, access, trust, and evidence; the shortest complete path connects units without breaking the
    skeleton.
  - Evidence: unit records, core-path walk, failure oracle, and core user decision.
  - On fail: return to P4 and revise the unit or skeleton before growing more detail.
  - Source: `SKILL.md` UX-R6, UX-R7, P4; `UX-SCENARIO-11`, `14`.
- [ ] **UX-CHECK-09 [GATE, read-do] — Accumulated paths, states, recovery, and channels form one complete specification.**
  - Applicability: unconditional before concept convergence.
  - Pass: every applicable normal, alternative, boundary, error, interruption, failure, recovery, support,
    handoff, cross-channel, and supporting-actor path is specified; content intent, access, trust, privacy, safety,
    agency, harm, and measures trace to the skeleton; no local success breaks another required path.
  - Evidence: path/state/obligation inventory, cross-channel walk, orphan sweep, gap register, and accumulated
    user decision.
  - On fail: stop finalization and return to P4–P5; otherwise a polished local fragment can mask a broken whole.
  - Source: `SKILL.md` UX-R1, UX-R6, UX-R10, P4–P5; `UX-SCENARIO-01`, `02`, `11`, `14`, `19`–`21`.

## Pause point C — Before any prototype: concepts and whole specification

- [ ] **UX-CHECK-10 [GATE, read-do] — Concept divergence is material or the exception is proved.**
  - Applicability: unconditional before selecting a concept.
  - Pass: at least two concepts differ in experience structure/behavior and are compared across control, effort,
    access, trust, failure, recovery, feasibility, and evidence; a recommendation and evidence-to-change precede
    the user lock; or real constraints plus direct evidence and a user decision prove the single-concept exception.
  - Evidence: concept models, trade-off matrix, sources, recommendation, exception proof if used, and decision.
  - On fail: return to P6; otherwise cosmetic variation or the first idea can pass as genuine exploration.
  - Source: `SKILL.md` UX-R8, P6; `UX-SCENARIO-10`, `15`–`17`.
- [ ] **UX-CHECK-11 [GATE, do-confirm] — The complete feature design document passes as a whole.**
  - Applicability: unconditional before prototype creation.
  - Pass: all ten parent schema sections contain evidence-bearing content; every actor, path, state, recovery,
    conflict, concept decision, accessibility/trust/safety obligation, measure, limitation, non-goal, and trace is
    resolved or blocks approval; the active project owns the path; explicit whole-spec approval is recorded.
  - Evidence: full document, schema/content inspection, two-way trace, gap register, and approval record.
  - On fail: stop prototype creation and return to the earliest owning step; otherwise an incomplete contract will
    be hidden by a tangible artifact.
  - Source: `SKILL.md` UX-R7, UX-R9, P6 and Feature design document schema; `UX-SCENARIO-13`, `18`.
- [ ] **UX-CHECK-12 [GATE, do-confirm] — No prototype predates whole-specification approval.**
  - Applicability: unconditional.
  - Pass: every prototype artifact was created after the explicit final whole-specification gate and traces to
    that approved version; no milestone prototype was used to fill an incomplete specification.
  - Evidence: immutable document approval and prototype creation/version chronology.
  - On fail: block prototype/test acceptance, discard it as design evidence, and return to specification work;
    otherwise premature visualization can lock a partial solution.
  - Source: `SKILL.md` UX-R6, UX-R9, UX-R11, P6–P7; `UX-SCENARIO-13`, `18`, `22`.

## Pause point D — After prototype evaluation: evidence and revision

- [ ] **UX-CHECK-13 [REQUIRED, read-do] — The prototype is disposable, proportionate, and specification-traced.**
  - Applicability: after `UX-CHECK-11` and `UX-CHECK-12` pass.
  - Pass: named uncertainties determine the lowest sufficient fidelity; required paths, errors, recovery,
    accessibility, and cross-channel transitions needed for those questions are usable; simulated behavior/data
    are disclosed; the artifact is not production implementation.
  - Evidence: prototype plan, fidelity rationale, spec trace, simulation disclosure, access-path inspection, and
    disposal status.
  - On fail: return to P7 before participant testing.
  - Source: `SKILL.md` UX-R11, P7; `UX-SCENARIO-22`, `23`.
- [ ] **UX-CHECK-14 [GATE, do-confirm] — Direct representative-user prototype evaluation supports acceptance claims.**
  - Applicability: unconditional for final acceptance.
  - Pass: new direct evaluation under `UX-CHECK-04` observes comprehension, completion, alternatives, errors,
    recovery, trust, accessibility, workarounds, cross-channel continuity, and harm as applicable; claims are
    bounded to evidence; prior tests, stakeholders, experts, and checklist presence do not substitute.
  - Evidence: dated evaluation plan/record, participant-context rationale, consent/accommodations, observations,
    interpretations, limits, and claim trace.
  - On fail: block acceptance and return `NEEDS_CONTEXT` or rerun P8; otherwise the design claims human outcomes
    without direct human evidence.
  - Source: `SKILL.md` UX-R3, UX-R4, P8; `UX-SCENARIO-07`, `22`, `23`.
- [ ] **UX-CHECK-15 [GATE, do-confirm] — Findings revise specification first, prototype second, then retest.**
  - Applicability: every supported prototype finding.
  - Pass: the finding first changes its owning requirement/path/state/content intent/measure/decision; the
    prototype is brought back into agreement; affected assumptions and regressions are directly retested; the
    post-test user decision is explicit.
  - Evidence: ordered finding → specification revision → prototype revision → retest → user-decision trace.
  - On fail: block acceptance and return to P8; otherwise the durable handoff remains wrong despite a better
    mockup.
  - Source: `SKILL.md` UX-R7, UX-R12, P8; `UX-SCENARIO-24`.

## Pause point E — Before handoff: measurement and change control

- [ ] **UX-CHECK-16 [GATE, do-confirm] — Success measures resist proxy gaming.**
  - Applicability: unconditional at handoff.
  - Pass: each outcome, failure, recovery, accessibility, trust, and harm measure traces to an obligation; names
    intended and harmful interpretations, guardrails, owner/review cadence, and evidence that reopens design; a
    constructed proxy-inversion case is detected.
  - Evidence: measure-to-obligation map and metric-gaming probe.
  - On fail: stop handoff and return to P6/P9; otherwise reported improvement can hide worse user outcomes.
  - Source: `SKILL.md` UX-R13, P6, P9; `UX-SCENARIO-25`, `26`.
- [ ] **UX-CHECK-17 [REQUIRED, do-confirm] — Handoff preserves the experience contract without choosing surface mechanics.**
  - Applicability: unconditional at handoff.
  - Pass: outcome, actors, evidence/limits, path/state/recovery/access/trust/safety/measure obligations, prototype
    status, owners, implementation questions, and reopen conditions are explicit; future children may specialize
    mechanics but cannot silently drop parent invariants.
  - Evidence: cold-reader handoff trace, owner map, child-contract diff probe, and measurement plan.
  - On fail: return to P9 and repair the no-silent-change contract.
  - Source: `SKILL.md` UX-R14, P9; `UX-SCENARIO-02`, `21`, `25`, `28`.
- [ ] **UX-CHECK-18 [GATE, do-confirm] — UX/UI or parent/child conflicts are evidence-led user decisions.**
  - Applicability: another loaded skill or downstream specialization conflicts with this experience contract.
  - Pass: exact conflicting clauses, evidence, trade-offs, and effects are presented to the user; no precedence or
    load-order rule is invented; the accessibility/safety floor is preserved; the decision and affected traces
    are updated.
  - Evidence: conflict record, cited clauses/evidence, explicit user decision, and regression trace.
  - On fail: stop the conflicting handoff/change and return to the owning user gate; otherwise guidance or child
    mechanics can silently override the approved experience.
  - Source: `SKILL.md` UX-R10, UX-R14 and co-load rule; `UX-SCENARIO-27`, `28`.

## Guaranteed coverage map

| Check | Scenario source |
|---|---|
| `UX-CHECK-01` | `UX-SCENARIO-01`, `UX-SCENARIO-02`, `UX-SCENARIO-03`, `UX-SCENARIO-04` |
| `UX-CHECK-02` | `UX-SCENARIO-01`, `UX-SCENARIO-05`, `UX-SCENARIO-06` |
| `UX-CHECK-03` | `UX-SCENARIO-05`, `UX-SCENARIO-06`, `UX-SCENARIO-08` |
| `UX-CHECK-04` | `UX-SCENARIO-05`, `UX-SCENARIO-07`, `UX-SCENARIO-22`, `UX-SCENARIO-23` |
| `UX-CHECK-05` | `UX-SCENARIO-09`, `UX-SCENARIO-10` |
| `UX-CHECK-06` | `UX-SCENARIO-09`, `UX-SCENARIO-11`, `UX-SCENARIO-12`, `UX-SCENARIO-18` |
| `UX-CHECK-07` | `UX-SCENARIO-01`, `UX-SCENARIO-04`, `UX-SCENARIO-11`, `UX-SCENARIO-14`, `UX-SCENARIO-19` |
| `UX-CHECK-08` | `UX-SCENARIO-11`, `UX-SCENARIO-14` |
| `UX-CHECK-09` | `UX-SCENARIO-01`, `UX-SCENARIO-02`, `UX-SCENARIO-11`, `UX-SCENARIO-14`, `UX-SCENARIO-19`, `UX-SCENARIO-20`, `UX-SCENARIO-21` |
| `UX-CHECK-10` | `UX-SCENARIO-10`, `UX-SCENARIO-15`, `UX-SCENARIO-16`, `UX-SCENARIO-17` |
| `UX-CHECK-11` | `UX-SCENARIO-13`, `UX-SCENARIO-18` |
| `UX-CHECK-12` | `UX-SCENARIO-13`, `UX-SCENARIO-18`, `UX-SCENARIO-22` |
| `UX-CHECK-13` | `UX-SCENARIO-22`, `UX-SCENARIO-23` |
| `UX-CHECK-14` | `UX-SCENARIO-07`, `UX-SCENARIO-22`, `UX-SCENARIO-23` |
| `UX-CHECK-15` | `UX-SCENARIO-24` |
| `UX-CHECK-16` | `UX-SCENARIO-25`, `UX-SCENARIO-26` |
| `UX-CHECK-17` | `UX-SCENARIO-02`, `UX-SCENARIO-21`, `UX-SCENARIO-25`, `UX-SCENARIO-28` |
| `UX-CHECK-18` | `UX-SCENARIO-27`, `UX-SCENARIO-28` |
| `UX-CHECK-20` | `UX-SCENARIO-05`, `UX-SCENARIO-06`, `UX-SCENARIO-08` |

## Filled-copy close

Before resolving any item in a run-specific copy, record the reusable checklist source identity/path, the exact
immutable source version/revision, and the distinct run identity. At close, repeat those three values with the
result so another reader can reconstruct both the rules used and the execution that applied them. Inspect the
named evidence before resolving each row, record coverage closure and acceptance separately, and replay every
protected-waiver truth-table row. A protected waiver is an invalid resolution even when every other applicable
item is `PASS`; a label, authority, rationale, owner, future plan, or present-but-empty artifact must never earn
`PASS`.
