# UI Design — Operational Checklist

Unchecked reusable source for running and evaluating one complete UI outcome. Never mark this source. Each run
works a fresh filled copy that records three distinct provenance fields: this source's identity/path, its
immutable source version or revision (for example a commit SHA, release tag, or content hash), and the run
identity (for example session plus task/evaluation ID). Stable item IDs identify checks, not source bytes; the
run identity identifies the execution, not the source revision. The filled copy also declares the actual use
style at each pause point. Mode: **operational**. Default use style is **read-do** at pause points A–D and
**do-confirm** at pause point E.

Coverage closure means every applicable gate and required item has a terminal resolution. Acceptance is a
separate result: every applicable gate and required item must be `PASS`. The one operational waiver permitted
by the checklist state machine may substitute for `PASS` on one item only when named authority covers that
item's consequence and stop action and the authorization evidence and rationale are recorded. It never counts
as `PASS`. Accessibility, safety, direct representative-user testing, and the whole-specification-before-
prototype order cannot be waived. A failed, recorded-open, or waived item can close coverage without accepting
the UI design.

## Resolution legend

- `PASS` — the pass condition was verified from the named, inspected evidence.
- `FAIL:<finding-id>` — the pass condition was verified false and the finding or action is cited.
- `n/a:<property>` — inspected evidence proves the applicability predicate false.
- `recorded-open:<owner+resolution-method>` — operational coverage is closed but acceptance is not granted.
- `waived/exception-authorized:<authority+rationale>` — allowed only within the bounded operational rule above;
  it never counts as `PASS`.

## Pause point A — Before the skeleton: outcome, surfaces, evidence, identity

- [ ] **UI-CHECK-01 [GATE, read-do] — One complete observable interface outcome is bound.**
  - Applicability: unconditional.
  - Pass: one user-locked contract names the trigger/context, primary actor, supporting actors, observable and
    false completion, entry, normal and alternative paths, applicable states, errors, feedback, recovery,
    handoffs, support, adaptation, scope, and explicit non-goals; independent adjacent outcomes are excluded.
  - Evidence: outcome contract, path/state inventory, and adjacent-outcome list.
  - On fail: halt before the skeleton and return to P1; otherwise every later artifact may solve an incomplete
    or expanded outcome.
  - Source: `SKILL.md` UI-R1, P1; `UI-SCENARIO-01`–`03`.
- [ ] **UI-CHECK-02 [GATE, read-do] — Surface scope satisfies the shared-and-separate rule.**
  - Applicability: every run; a single-surface run proves one surface and records the others out.
  - Pass: every included surface realizes the same outcome and shared interface skeleton, while mechanics,
    accessibility or modality equivalence, prototype coverage, and evidence are separately specifiable and
    testable; any surface that fails either half is split into another run.
  - Evidence: user-locked surface contract, shared skeleton map, per-surface matrix, and split decisions.
  - On fail: stop the combined run and return to P1/P3; otherwise one surface's design or evidence can conceal
    another's incompatible outcome or missing proof.
  - Source: `SKILL.md` UI-R2, P1/P3; `UI-SCENARIO-02`, `14`, `15`.
- [ ] **UI-CHECK-03 [GATE, read-do] — Representative-user access and ethical test conditions are supportable.**
  - Applicability: unconditional for a final UI claim.
  - Pass: representative access, informed consent, required accommodations, data minimization and protection,
    method, sample logic, and claim boundary are evidenced from the question, diversity, uncertainty, impact,
    and risk; no stakeholder status or fixed participant count substitutes; missing conditions produce
    `NEEDS_CONTEXT` and no accepted design.
  - Evidence: actor/context map, recruitment rationale, consent/accommodation record, data plan, and evidence-
    conditions register.
  - On fail: halt acceptance and return to P1/P8 or `NEEDS_CONTEXT`; otherwise unsupported or unethically
    collected evidence can be treated as user proof.
  - Source: `SKILL.md` UI-R3, UI-R4, P1/P8; `UI-SCENARIO-04`–`06`, `21`.
- [ ] **UI-CHECK-04 [REQUIRED, read-do] — Project identity follows the evidence authority chain.**
  - Applicability: unconditional.
  - Pass: identity traces in order to explicit `DESIGN.md`/brand/product/design-system material, then live
    product/system/tokens, then a user-confirmed temporary run brief; missing material triggered identity
    questions and feature-document capture rather than an invented or universal project-wide `DESIGN.md`.
  - Evidence: identity/reference register, inspected live sources, decision record, and run-scoped brief where
    needed.
  - On fail: return to P2 before skeleton approval and repair the authority chain.
  - Source: `SKILL.md` UI-R5, P2; `UI-SCENARIO-19`, `20`, `28`.

## Pause point B — Before accumulated growth: skeleton and core unit/path

- [ ] **UI-CHECK-05 [GATE, read-do] — The top-down surface-neutral skeleton is complete and approved.**
  - Applicability: unconditional.
  - Pass: an explicit pre-unit artifact defines hierarchy, regions or stages, navigation or command structure,
    action priority, information flow, system status, state relationships, failures, recovery, handoffs,
    adaptation, completion, and surface mappings without assuming a GUI; G2 approval is recorded.
  - Evidence: versioned skeleton, state/path map, surface mapping, open-question register, and explicit G2
    decision.
  - On fail: halt bottom-up growth and return to P3; otherwise local units have no approved whole to preserve.
  - Source: `SKILL.md` UI-R6, UI-R7, P3; `UI-SCENARIO-07`, `09`.
- [ ] **UI-CHECK-06 [GATE, read-do] — The smallest meaningful unit grows one complete core path without breaking the skeleton.**
  - Applicability: unconditional.
  - Pass: the core component/control/command/prompt/output/feedback/state names purpose, preconditions, input,
    output, affordance, content, feedback, states, error, recovery, access, adaptation, and surface realization;
    its shortest complete path, failure oracle, and G3 approval are evidenced and fit the skeleton.
  - Evidence: unit record, unit-to-skeleton trace, core path, per-surface realization, failure injection, and G3
    decision.
  - On fail: stop accumulated growth and return to P3/P4; otherwise an isolated success can create whole-path
    or cross-surface failure.
  - Source: `SKILL.md` UI-R6, UI-R7, P4; `UI-SCENARIO-02`, `07`, `09`.

## Pause point C — Before final whole-specification approval: complete behavior, concepts, access, aesthetics

- [ ] **UI-CHECK-07 [GATE, read-do] — The accumulated specification covers all applicable interactions and states in order.**
  - Applicability: unconditional.
  - Pass: dated/versioned evidence shows foundation then skeleton then core then bottom-up growth; every
    applicable normal, alternative, empty, loading, progress, boundary, failure, interruption, partial,
    recovery, support, adaptation, success, and completion state has content, feedback, allowed actions,
    transition, and surface trace; G4 approval is explicit.
  - Evidence: artifact chronology, complete unit/path/state matrix, cross-surface trace, gap register, and G4
    decision.
  - On fail: halt finalization and return to the earliest incomplete P2–P5 layer; otherwise hidden states or
    reordered construction can survive into polish.
  - Source: `SKILL.md` UI-R1, UI-R6, UI-R7, P2–P5; `UI-SCENARIO-03`, `07`, `08`, `10`, `17`.
- [ ] **UI-CHECK-08 [REQUIRED, read-do] — Concepts are materially different or the one-concept exception is proved.**
  - Applicability: unconditional before selecting the final direction.
  - Pass: at least two concepts differ in hierarchy, action model, information flow, interaction strategy, state
    communication, or another consequential property and are compared against the same obligations; otherwise
    real constraints plus direct evidence prove and record the one-concept exception. Cosmetic variants do not
    count.
  - Evidence: concept diff, obligation comparison, recommendation with evidence-to-change, user decision, or
    recorded exception with constraints and direct evidence.
  - On fail: return to P6 and create material alternatives or prove the exception.
  - Source: `SKILL.md` UI-R8, UI-R9, P6; `UI-SCENARIO-31`.
- [ ] **UI-CHECK-09 [REQUIRED, read-do] — Detailed aesthetics occur last and improve the completed contract.**
  - Applicability: every applicable aesthetic dimension; a non-visual surface still addresses character
    rendering, density, rhythm, symbols, tone, and feedback expression where relevant.
  - Pass: artifact chronology places the detailed typography/character, color, density, spacing, rhythm, shape,
    imagery/iconography/symbol, motion/transition, tone, and expressive pass after complete structure,
    behavior, content, feedback, recovery, adaptation, and accessibility; each choice improves hierarchy, state
    recognition, affordance, trust, or identity fit without hiding a defect.
  - Evidence: chronology, aesthetics-to-obligation map, identity trace, and before/after behavioral review.
  - On fail: remove premature polish from approval and return to the earliest incomplete structural or
    behavioral layer, then redo the aesthetics pass.
  - Source: `SKILL.md` UI-R5, UI-R11, P5–P6; `UI-SCENARIO-18`–`20`, `23`, `24`.
- [ ] **UI-CHECK-10 [GATE, read-do] — Required actions, states, and meaning are accessible across applicable modalities.**
  - Applicability: unconditional; exact modality set is surface/context-specific.
  - Pass: direct behavior and the specification prove applicable perception, operation, focus/cursor flow,
    reading/announcement order, alternative input, status, error identification, recovery, timing, motion,
    contrast or non-color meaning, language/locale, and adaptation; identity or child convention does not waive
    accessibility or safety.
  - Evidence: modality matrix, behavioral task results, state comparison, direct-user evidence plan/results,
    and conflict decisions.
  - On fail: halt final approval or acceptance and return to P4–P6/P8; otherwise people can be excluded or
    misled despite cosmetic compliance.
  - Source: `SKILL.md` UI-R11, UI-R12, P4–P8; `UI-SCENARIO-16`, `18`–`24`, `26`.
- [ ] **UI-CHECK-19 [GATE, read-do] — The user-decision tree is adaptively complete and every gate is explicit.**
  - Applicability: unconditional; a D-node may smart-skip only under its evidence predicate.
  - Pass: each D0–D16 axis has one explicit user decision or a recorded smart-skip with both current evidence
    and a prior user lock; design-bearing axes show research, two meaningful options when applicable, one
    recommendation, evidence-to-change, and the user's lock; project-specific follow-ups are recorded; G1–G6
    each has an explicit decision and none is inferred from silence or continued work.
  - Evidence: question/decision history, D-node coverage audit, smart-skip evidence/lock pairs, recommendation
    records, follow-ups, and explicit G1–G6 decisions.
  - On fail: halt at the earliest undecided axis or gate and return to `ideation.md`; otherwise construction,
    prototyping, acceptance, or handoff can proceed without user authority.
  - Source: `SKILL.md` UI-R7, UI-R8, P1–P9; `UI-SCENARIO-30`, `32`.

## Pause point D — Before any prototype and before direct testing

- [ ] **UI-CHECK-11 [GATE, read-do] — The whole UI specification is complete and explicitly approved before every prototype.**
  - Applicability: unconditional before prototype creation.
  - Pass: all ten feature-document sections contain resolved, traceable content; outcome, skeleton, units,
    paths, states, content, feedback, recovery, adaptation, access, concept decision, aesthetics, deviations,
    evidence limits, and non-goals agree; G5 approval is explicit; repository/artifact history proves no mockup,
    wireframe, coded demo, command stub, or other prototype predates it.
  - Evidence: complete feature design document, gap/contradiction audit, explicit G5 decision, and dated/versioned
    artifact history.
  - On fail: stop and remove prototype status from the run, return to the earliest incomplete specification
    layer, and re-establish chronology; otherwise premature artifacts anchor and conceal missing obligations.
  - Source: `SKILL.md` UI-R6, UI-R7, UI-R10, UI-R13, P6; `UI-SCENARIO-10`, `11`.
- [ ] **UI-CHECK-12 [REQUIRED, read-do] — The post-approval prototype is disposable, uncertainty-sized, and separately testable by surface.**
  - Applicability: every prototype; per-surface clauses apply to multi-surface runs.
  - Pass: the artifact follows G5, traces to the approved specification, represents only paths/states needed by
    named questions, marks simulated behavior/data, uses the lowest sufficient fidelity, remains outside
    production, and supplies separately testable variants for each included surface.
  - Evidence: prototype plan, creation history, fidelity/question rationale, spec trace, simulation marks,
    per-surface artifacts, and production-boundary statement.
  - On fail: return to P7 and resize, separate, or clearly mark the artifact before direct testing.
  - Source: `SKILL.md` UI-R2, UI-R13, P7; `UI-SCENARIO-10`, `11`, `13`–`15`.

## Pause point E — Before acceptance and handoff: direct evidence, revision, recovery, compatibility, trace

- [ ] **UI-CHECK-13 [GATE, do-confirm] — This run has direct representative-user prototype evidence for every claimed surface.**
  - Applicability: unconditional for final acceptance.
  - Pass: under UI-CHECK-03 conditions, representative users directly used each claimed surface's post-G5
    prototype; observations cover perception, comprehension, operation, completion, alternatives, errors,
    recovery, status, trust, accessibility, adaptation, workarounds, and harm as applicable; claims remain
    bounded; prior UX/UI evidence, standards, experts, and stakeholders are context only.
  - Evidence: dated prototype/test record, participant-context rationale, consent/accommodations, per-surface
    tasks and observations, interpretations, limits, and claim trace.
  - On fail: block acceptance and return `NEEDS_CONTEXT` or rerun P8; otherwise human-outcome claims have no
    current direct evidence.
  - Source: `SKILL.md` UI-R3, UI-R4, P8; `UI-SCENARIO-04`–`06`, `14`, `21`, `22`, `24`, `29`.
- [ ] **UI-CHECK-14 [GATE, do-confirm] — Supported findings revise specification first, prototype second, then affected evidence.**
  - Applicability: every supported direct-test finding.
  - Pass: each finding first changes its owning specification clause, then the prototype is brought into
    agreement, then every affected assumption, surface, path, and regression is directly retested; G6 records
    an explicit decision.
  - Evidence: ordered finding → specification revision → prototype revision → retest → G6 decision trace.
  - On fail: block acceptance and return to P8; otherwise the durable handoff remains wrong even when the
    mockup appears fixed.
  - Source: `SKILL.md` UI-R7, UI-R14, P8; `UI-SCENARIO-12`, `30`.
- [ ] **UI-CHECK-15 [REQUIRED, do-confirm] — Handoff preserves parent obligations while assigning exact mechanics to children.**
  - Applicability: unconditional at handoff; child diff applies when a future specialization exists.
  - Pass: the handoff carries the full UI-R15 contract, assigns exact platform mechanics/standards/examples to
    future children, and a parent/child clause diff shows no waived outcome, order, recovery, access, evidence,
    aesthetics, testing, or revision obligation.
  - Evidence: cold-reader handoff, owner map, parent/child crosswalk or future-owner placeholders, deviation
    log, and reopen conditions.
  - On fail: return to P9 and repair the handoff or route a material deviation to the user.
  - Source: `SKILL.md` UI-R15, P9; `UI-SCENARIO-25`, `26`.
- [ ] **UI-CHECK-16 [GATE, do-confirm] — Co-loaded UI/UX conflict is an evidence-led user decision, never precedence.**
  - Applicability: a co-loaded UX clause or another parent contract materially conflicts with the UI direction.
  - Pass: exact clauses, evidence, trade-offs, and affected traces are presented to the user; the explicit
    resolution propagates through the specification/prototype/handoff; no precedence or load-order rule is
    invented; accessibility and safety remain intact.
  - Evidence: conflict record, cited clauses and evidence, user decision, updated traces, and regression check.
  - On fail: stop the conflicting change and reopen its owning gate; otherwise one independently valid parent
    can silently erase the other.
  - Source: `SKILL.md` UI-R16, P9; `UI-SCENARIO-27`.
- [ ] **UI-CHECK-17 [GATE, do-confirm] — Failure, feedback, recovery, and completion are behaviorally truthful.**
  - Applicability: every applicable failure, pending, timeout, interruption, partial, or completion state.
  - Pass: injected cases on each surface expose one truthful state, surface-appropriate feedback, safe allowed
    actions, containment, retry/cancel/support/recovery, late-result handling where needed, and no false success;
    visual labels or component presence alone cannot pass.
  - Evidence: state table, injected before/at/after transitions, direct modality behavior, system-state
    comparison, and recovery-to-completion trace.
  - On fail: block acceptance and return to P3–P5/P8; otherwise users may be stranded, misled, or cause duplicate
    effects.
  - Source: `SKILL.md` UI-R1, UI-R6, UI-R11, UI-R12; `UI-SCENARIO-01`, `08`, `16`–`18`, `24`.
- [ ] **UI-CHECK-18 [REQUIRED, do-confirm] — The complete evidence and decision trace is bidirectional and cold-readable.**
  - Applicability: unconditional at handoff.
  - Pass: every load-bearing parent rule resolves to scenarios, checks, feature-document clauses, evidence, and
    decisions; each delivered clause resolves back to its source and owner; identity fallback, concept
    decision, G1–G6 approvals, prototype chronology, test evidence, revisions, deviations, and reopen conditions
    require no hidden session context.
  - Evidence: two-way orphan sweep, cold-reader result, chronology, decision/evidence register, and complete
    feature-document schema audit.
  - On fail: return to the owning P-step and repair the missing parent policy, artifact, or trace before handoff.
  - Source: `SKILL.md` UI-R1–UI-R16, P1–P9; `UI-SCENARIO-10`, `12`, `25`, `28`–`30`.

## Guaranteed coverage map

| Check | Scenario source |
|---|---|
| `UI-CHECK-01` | `UI-SCENARIO-01`–`03` |
| `UI-CHECK-02` | `UI-SCENARIO-02`, `14`, `15` |
| `UI-CHECK-03` | `UI-SCENARIO-04`–`06`, `21` |
| `UI-CHECK-04` | `UI-SCENARIO-19`, `20`, `28` |
| `UI-CHECK-05` | `UI-SCENARIO-07`, `09` |
| `UI-CHECK-06` | `UI-SCENARIO-02`, `07`, `09` |
| `UI-CHECK-07` | `UI-SCENARIO-03`, `07`, `08`, `10`, `17` |
| `UI-CHECK-08` | `UI-SCENARIO-31` |
| `UI-CHECK-09` | `UI-SCENARIO-18`–`20`, `23`, `24` |
| `UI-CHECK-10` | `UI-SCENARIO-16`, `18`–`24`, `26` |
| `UI-CHECK-11` | `UI-SCENARIO-10`, `11` |
| `UI-CHECK-12` | `UI-SCENARIO-10`, `11`, `13`–`15` |
| `UI-CHECK-13` | `UI-SCENARIO-04`–`06`, `14`, `21`, `22`, `24`, `29` |
| `UI-CHECK-14` | `UI-SCENARIO-12`, `30` |
| `UI-CHECK-15` | `UI-SCENARIO-25`, `26` |
| `UI-CHECK-16` | `UI-SCENARIO-27` |
| `UI-CHECK-17` | `UI-SCENARIO-01`, `08`, `16`–`18`, `24` |
| `UI-CHECK-18` | `UI-SCENARIO-10`, `12`, `25`, `28`–`32` |
| `UI-CHECK-19` | `UI-SCENARIO-30`, `32` |

## Filled-copy close

In a run-specific copy, first record the reusable checklist source identity/path, the exact immutable source
version/revision, and the distinct run identity. At close, repeat those three values with the result so another
reader can reconstruct both the rules used and the execution that applied them. Inspect the named evidence
before resolving each row. Record coverage closure and acceptance separately. Acceptance requires `PASS` on
every applicable gate and required item. Pilot the source against a passing complete run, a single-surface
`n/a` disposition, the timeout/recovery boundary, the big-bang/premature-prototype/cosmetic-access adversarial
cases, and a failed direct-evidence gate. A label, heading, component name, visual match, or present-but-empty
artifact must never earn `PASS`.
