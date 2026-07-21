# UI Design — Scenario Set

Scenario source for one `ui` operation run. Its target is the parent contract in [`SKILL.md`](SKILL.md). Its
consumer is the operational checklist and active Gobbi evaluation. The set exercises parent obligations; it
does not add UI policy. Lifecycle mode: design obligations plus evaluation coverage.

Scope is one complete observable interface outcome across one or more valid surfaces. It excludes adjacent
outcomes, production implementation, and exact child-owned platform mechanics. Sensitive participant evidence
is referenced through the active project's governed evidence records, never copied here.

Scale limit: this source uses ten families and 32 cases, below the default split thresholds of about 12
families and 40 distinct category/type cells. Split a future larger set under a parent index rather than
growing this source without bound.

## Coverage register

All ten categories are selected because each can affect a cross-surface UI run. The named families are the
category carriers; no concern is delegated through `covered-elsewhere`.

| # | Category | Disposition | Family carriers |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `UI-FAMILY-01` |
| 2 | Actors / stakeholders / use-context | selected | `UI-FAMILY-02` |
| 3 | Behavior / state / data | selected | `UI-FAMILY-03` |
| 4 | Interfaces / dependencies / structure | selected | `UI-FAMILY-04` |
| 5 | Quality attributes / resource economics | selected | `UI-FAMILY-05` |
| 6 | Failure / recovery / operations | selected | `UI-FAMILY-06` |
| 7 | Trust / harm / governance | selected | `UI-FAMILY-07` |
| 8 | Inclusion / locale | selected | `UI-FAMILY-08` |
| 9 | Change / compatibility / reversibility | selected | `UI-FAMILY-09` |
| 10 | Evidence / traceability / clarity | selected | `UI-FAMILY-10` |

## Category × case-type matrix

Each selected category has a positive case and each family has an adversarial face. Other minima appear when
the family's properties trigger them. An `n/a` cell names the property that makes that minimum inapplicable.

| Family | Good | Alternative-valid | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|
| `UI-FAMILY-01` | `01` | `02` | n/a: no numeric or finite limit | n/a: failure owned by family 06 | `03` | n/a: no version event | n/a: outcome premise is directly locked |
| `UI-FAMILY-02` | `04` | n/a: one actor-evidence class per claim | n/a: sample is risk-based, not a numeric threshold | `06` | `05` | n/a: no version event | n/a: representativeness is inspected, not assumed |
| `UI-FAMILY-03` | `07` | n/a: alternative surface is exercised in `02` | `08` | n/a: injected failure owned by family 06 | `09` | n/a: no version event | n/a: state inventory is inspected directly |
| `UI-FAMILY-04` | `10` | n/a: parent order has one valid chronology | n/a: stage transition is audited chronologically | `12` | `11` | n/a: no version event | n/a: chronology is evidenced, not premised |
| `UI-FAMILY-05` | `13` | `14` | n/a: no universal participant or fidelity threshold | n/a: operational failure owned by family 06 | `15` | n/a: no version event | n/a: proportionality claim has named questions |
| `UI-FAMILY-06` | `16` | n/a: alternative recovery paths are enumerated in the same contract | `17` | `17` | `18` | n/a: planned reversibility owned by family 09 | n/a: dependency failure is injected directly |
| `UI-FAMILY-07` | `19` | n/a: one non-waivable safety floor | n/a: no numeric or finite limit | `21` | `20` | n/a: no version event | n/a: conflict evidence is inspected directly |
| `UI-FAMILY-08` | `22` | `23` | n/a: platform limits are surface-owned inputs | n/a: failed access behavior appears as adversarial exclusion | `24` | n/a: no version event | n/a: modality equivalence is directly inspected |
| `UI-FAMILY-09` | `25` | n/a: UI/UX conflict and child change are distinct cases | n/a: no finite limit | n/a: runtime recovery owned by family 06 | `26` | `25` | `27` |
| `UI-FAMILY-10` | `28` | n/a: one bidirectional evidence model | n/a: no numeric or finite limit | n/a: missing evidence closes as `NEEDS_CONTEXT` in family 02 | `29`, `31`, `32` | n/a: artifact revision chronology is family 04 | `30` |

`UI-SCENARIO-17` genuinely exercises both an exact timeout transition and failure/recovery. Its primary and
coverage role are failure/recovery only; boundary coverage is supporting context and is not claimed as a
second minimum discharge.

## Source register and stable IDs

- `SRC-UI-PARENT` — [`SKILL.md`](SKILL.md), UI-R1–UI-R16 and P1–P9; sole policy owner.
- `SRC-UI-DECISIONS` — [`ideation.md`](ideation.md); gate and decision-procedure trace.
- `SRC-UI-ISO` — ISO 9241-210 and ISO 9241-11 references named by the parent.
- `SRC-UI-ACCESS` — WCAG, WAI evaluation, and platform accessibility references named by the parent; applicable
  only to their stated surfaces.
- `SRC-UI-PLATFORM` — Apple, Windows, Android, GNU, and POSIX references named by the parent; these do not
  override parent invariants.

Case IDs are permanent `UI-SCENARIO-NN` values. Checklist reservations use permanent `UI-CHECK-NN` values.
Renaming a title does not change an ID. A changed discrimination gets a new case ID.

## UI-FAMILY-01 — One bounded outcome across valid surfaces

- **Declared primary category:** 1 — Purpose / outcomes / scope. The defining discrimination is whether the
  design completes the right bounded outcome rather than polishing an artifact or absorbing adjacent work.
- **Secondary categories:** 2, 3, 4.
- **Source / rationale:** `SRC-UI-PARENT` UI-R1, UI-R2, P1; `SRC-UI-DECISIONS` D1–D4.
- **Actor + outcome:** a returning user completes one bounded login/authentication outcome.
- **Situation / invariant:** GUI and CLI realizations may differ mechanically but must serve the same outcome
  and keep registration, reset, administration, and onboarding out.
- **Applicability / priority:** every run; gate-bearing.

### UI-SCENARIO-01 — A graphical login completes the bounded outcome

- **Primary type + justification:** Good — ordinary valid graphical realization reaches observable completion.
- **Coverage-role:** Good; proves the positive outcome floor.
- **Actor:** eligible returning user.
- **Given:** an approved outcome contract includes entry, form interaction, progress, success, applicable
  errors, and recovery, while adjacent outcomes are explicit non-goals.
- **When:** the user authenticates through the graphical surface.
- **Then:** the intended signed-in destination and system state agree on completion; failures remain
  understandable and recoverable within the bounded attempt.
- **Failure oracle:** a polished login screen that stops at credential submission, omits recovery, or redirects
  without authenticated state fails.
- **Evidence tuple:** observe end-to-end state; walk the approved path and inspect completion evidence; confirm
  user-visible destination plus authenticated system state.
- **Design obligation:** the specification must define the whole bounded outcome and false-completion signal.
- **Trace:** UI-R1, P1; `UI-CHECK-01`, `UI-CHECK-17`.

### UI-SCENARIO-02 — A CLI login realizes the same obligations differently

- **Primary type + justification:** Alternative-valid — a materially different surface realizes the same
  outcome through command, prompt/output, exit status, and an optional external handoff.
- **Coverage-role:** Alternative-valid; proves that GUI mechanics are not universal.
- **Actor:** eligible returning terminal user.
- **Given:** `tool auth login` has a separately specified command flow, status, cancellation, timeout, recovery,
  and verified authenticated terminal state mapped to the shared skeleton.
- **When:** the user completes the command-line authentication path.
- **Then:** the command's output and exit behavior expose the same abstract action, status, recovery, and
  completion obligations without copying GUI mechanics.
- **Failure oracle:** a CLI example that merely renames a graphical button, omits exit/error behavior, or lacks
  separate evidence fails.
- **Evidence tuple:** observe command/output/state; run a prototype task and inspect the surface matrix; confirm
  separately testable mechanics and shared completion.
- **Design obligation:** each surface must map shared obligations to distinct, testable mechanics.
- **Trace:** UI-R2, P3–P4; `UI-CHECK-02`, `UI-CHECK-06`.

### UI-SCENARIO-03 — Polished big-bang design hides scope failure

- **Primary type + justification:** Adversarial — a cosmetically strong artifact attempts to pass without the
  ordered outcome contract.
- **Coverage-role:** Adversarial; proves cosmetic compliance cannot satisfy scope.
- **Actor:** design reviewer.
- **Given:** a finished-looking set of screens combines login, registration, password reset, administration,
  and onboarding but has no locked outcome, skeleton chronology, complete states, or evidence.
- **When:** it is presented as a completed UI run.
- **Then:** the run is rejected and returned to P1; polish and breadth do not close missing obligations.
- **Failure oracle:** acceptance because it “looks complete” fails the parent contract.
- **Evidence tuple:** observe artifact history and scope; diff against the outcome contract; confirm missing
  gates and adjacent outcomes.
- **Design obligation:** big-bang polish must fail before construction continues.
- **Trace:** UI-R1, UI-R6; `UI-CHECK-01`, `UI-CHECK-07`.

## UI-FAMILY-02 — Representative people and ethical evidence conditions

- **Declared primary category:** 2 — Actors / stakeholders / use-context. The defining discrimination is whether
  participant context supports the UI claims.
- **Secondary categories:** 7, 8, 10.
- **Source / rationale:** `SRC-UI-PARENT` UI-R3, UI-R4, P1/P8; `SRC-UI-DECISIONS` D0, D2, D5.
- **Actor + outcome:** representative participants supply bounded direct-use evidence under ethical conditions.
- **Situation / invariant:** stakeholder authority and participant evidence are different roles.
- **Applicability / priority:** every run; acceptance gate.

### UI-SCENARIO-04 — Representative direct testing supports bounded claims

- **Primary type + justification:** Good — the ordinary evidence path uses representative participants and
  claim-sized methods.
- **Coverage-role:** Good; proves the positive actor/evidence floor.
- **Actor:** UI test participant and researcher.
- **Given:** recruitment, consent, accommodations, method, data handling, and claim bounds match the target
  contexts and risks.
- **When:** participants use the post-approval prototype.
- **Then:** observations support only the named interface claims and remain distinct from stakeholder decisions.
- **Failure oracle:** “users liked it” without participant context, tasks, observations, or limits fails.
- **Evidence tuple:** observe governed test record; inspect recruitment-to-claim trace; confirm direct behavior,
  accommodations, consent, and bounded conclusions.
- **Design obligation:** acceptance must rest on representative direct-use evidence.
- **Trace:** UI-R3, UI-R4, P8; `UI-CHECK-03`, `UI-CHECK-13`.

### UI-SCENARIO-05 — Project owner is claimed representative without evidence

- **Primary type + justification:** Adversarial — authority is relabeled as representativeness to bypass direct
  testing.
- **Coverage-role:** Adversarial; proves stakeholder approval cannot game the evidence gate.
- **Actor:** project owner and reviewer.
- **Given:** only the owner has tried the prototype and no evidence connects their context to the target users.
- **When:** owner approval is offered as representative-user evidence.
- **Then:** the evidence is rejected; the run remains `NEEDS_CONTEXT` or schedules representative testing.
- **Failure oracle:** accepting job title or product knowledge as proof of representativeness fails.
- **Evidence tuple:** observe participant rationale; compare owner context with actor/context map; confirm whether
  the relevant use conditions are genuinely shared.
- **Design obligation:** owner evidence counts only when representativeness is demonstrated.
- **Trace:** UI-R3, P1/P8; `UI-CHECK-03`, `UI-CHECK-13`.

### UI-SCENARIO-06 — Missing users, consent, accommodations, or evidence fails closed

- **Primary type + justification:** Failure/recovery — required research conditions are unavailable and the
  correct recovery is a non-accepting status plus a plan.
- **Coverage-role:** Failure/recovery; proves fail-closed handling.
- **Actor:** UI designer and decision owner.
- **Given:** representative access, consent, a needed accommodation, or required evidence cannot be obtained.
- **When:** the final interface is proposed for acceptance.
- **Then:** status is `NEEDS_CONTEXT`; assumptions and a recovery/test plan may be recorded, but acceptance is
  blocked.
- **Failure oracle:** a user decision, waiver, fixed participant count, or standards checklist changing the
  status to accepted fails.
- **Evidence tuple:** observe conditions register; inspect each prerequisite; confirm missing condition and
  non-accepting status.
- **Design obligation:** evidence-condition failure must stop acceptance without erasing planned recovery.
- **Trace:** UI-R4, P1/P8; `UI-CHECK-03`, `UI-CHECK-13`.

## UI-FAMILY-03 — Coherent units, interactions, states, and data

- **Declared primary category:** 3 — Behavior / state / data. The defining discrimination is correct state and
  interaction behavior across the skeleton.
- **Secondary categories:** 1, 4, 6, 8.
- **Source / rationale:** `SRC-UI-PARENT` UI-R1, UI-R6, UI-R11, P3–P5.
- **Actor + outcome:** a user can understand and operate every state through completion.
- **Situation / invariant:** each local interface unit must preserve whole-path state and feedback.
- **Applicability / priority:** every run; required.

### UI-SCENARIO-07 — Bottom-up units grow a complete coherent path

- **Primary type + justification:** Good — the ordinary construction grows one unit while preserving the
  approved skeleton.
- **Coverage-role:** Good; proves the positive behavior/state floor.
- **Actor:** UI designer and user.
- **Given:** the skeleton is approved and the core unit names preconditions, inputs, outputs, content, feedback,
  states, error, recovery, access, and surface mappings.
- **When:** units are connected one at a time into the shortest complete path.
- **Then:** each transition is observable and the whole path still matches the skeleton on every surface.
- **Failure oracle:** a unit with a good isolated demo but an undefined incoming/outgoing state fails.
- **Evidence tuple:** observe unit and transition records; walk both trace directions; confirm complete state
  continuity.
- **Design obligation:** every local unit must own its states and reconcile with the whole.
- **Trace:** UI-R6, P4–P5; `UI-CHECK-06`, `UI-CHECK-07`.

### UI-SCENARIO-08 — Exact transition states are specified

- **Primary type + justification:** Boundary — the case sits on the transition from submitted to pending to
  authenticated or failed.
- **Coverage-role:** Boundary; proves both sides and the transition itself are defined.
- **Actor:** returning user.
- **Given:** login submission can be immediate, delayed, duplicated, interrupted, or resolved.
- **When:** the interface crosses the exact submission/state transition.
- **Then:** duplicate action is controlled, status is exposed, and success/failure cannot both appear or leave
  stale controls active.
- **Failure oracle:** specifying “loading” near the transition without entry, exit, duplicate, and stale-state
  behavior fails.
- **Evidence tuple:** observe state table; simulate before/at/after transition; confirm one valid state and
  action set at each point.
- **Design obligation:** every exact state transition needs entry, status, allowed action, exit, and recovery.
- **Trace:** UI-R1, UI-R6, P5; `UI-CHECK-07`, `UI-CHECK-17`.

### UI-SCENARIO-09 — A component works alone but breaks the skeleton

- **Primary type + justification:** Adversarial — a successful local demo attempts to hide whole-interface
  inconsistency.
- **Coverage-role:** Adversarial; proves local quality is not whole-system quality.
- **Actor:** component designer and reviewer.
- **Given:** an authentication control is usable in isolation but changes action priority, hides system status,
  creates an unreachable error, or conflicts with the CLI state model.
- **When:** it is proposed for inclusion unchanged.
- **Then:** it fails and returns to P3/P4 for unit or skeleton repair and whole-path regression review.
- **Failure oracle:** accepting because the component library example passes fails.
- **Evidence tuple:** observe local and whole traces; inject the unit into the skeleton; confirm broken hierarchy,
  state, or surface mapping.
- **Design obligation:** local units must be tested in the full skeleton and cross-surface contract.
- **Trace:** UI-R6, P4–P5; `UI-CHECK-05`, `UI-CHECK-06`.

## UI-FAMILY-04 — Construction order and artifact dependency

- **Declared primary category:** 4 — Interfaces / dependencies / structure. The defining discrimination is the
  dependency order among foundation, skeleton, specification, prototype, and revisions.
- **Secondary categories:** 3, 10.
- **Source / rationale:** `SRC-UI-PARENT` UI-R6, UI-R7, UI-R10, UI-R13, UI-R14.
- **Actor + outcome:** the team builds and changes one authoritative interface contract in the required order.
- **Situation / invariant:** the whole specification, including aesthetics, precedes every prototype.
- **Applicability / priority:** every run; gate-bearing.

### UI-SCENARIO-10 — Whole specification approval precedes prototype creation

- **Primary type + justification:** Good — the valid chronology reaches the prototype only after all prior
  gates pass.
- **Coverage-role:** Good; proves the positive structural floor.
- **Actor:** UI designer and decision owner.
- **Given:** dated evidence shows foundation, skeleton, core, accumulated specification, concepts, aesthetics,
  and complete whole-spec approval.
- **When:** remaining uncertainty is translated into a prototype plan.
- **Then:** the first prototype artifact is created after approval and traces to the approved specification.
- **Failure oracle:** a clickable wireframe, coded demo, command stub, or mockup dated before approval fails.
- **Evidence tuple:** observe artifact history; inspect timestamps/version lineage; confirm strict chronology.
- **Design obligation:** prototype work must have an evidenced whole-spec predecessor.
- **Trace:** UI-R6, UI-R7, UI-R10, UI-R13; `UI-CHECK-07`, `UI-CHECK-11`, `UI-CHECK-12`.

### UI-SCENARIO-11 — Prototype is requested before the whole specification

- **Primary type + justification:** Adversarial — schedule pressure attempts to reverse a load-bearing
  dependency.
- **Coverage-role:** Adversarial; proves a visible artifact cannot bypass the final gate.
- **Actor:** stakeholder and UI designer.
- **Given:** the skeleton or core path is approved, but alternative paths, accessibility, recovery, aesthetics,
  or another whole-spec section remains incomplete.
- **When:** a prototype is requested “to make progress” or “test the direction.”
- **Then:** creation stops; the team completes and approves the whole specification first.
- **Failure oracle:** treating a milestone gate as prototype permission fails.
- **Evidence tuple:** observe gap register and artifact tree; compare with G5 criteria; confirm unresolved whole-
  spec content and no prototype creation.
- **Design obligation:** no milestone before G5 authorizes prototyping.
- **Trace:** UI-R6, UI-R7, UI-R10, UI-R13; `UI-CHECK-11`, `UI-CHECK-12`.

### UI-SCENARIO-12 — Prototype finding changes only the mockup

- **Primary type + justification:** Failure/recovery — a test exposes a defect and the recovery sequence is
  specification first, prototype second, retest third.
- **Coverage-role:** Failure/recovery; proves durable contract recovery.
- **Actor:** UI designer, test participant, and decision owner.
- **Given:** direct testing shows that users miss an authentication error or cannot recover.
- **When:** the mockup is updated without changing the owning specification clause.
- **Then:** acceptance remains blocked; the specification is revised first, the prototype second, and affected
  behavior is retested.
- **Failure oracle:** a better-looking or better-working mockup with a stale handoff document fails.
- **Evidence tuple:** observe ordered revision history; trace finding to spec, prototype, and retest; confirm the
  exact sequence.
- **Design obligation:** supported findings must update the durable contract before its test rendering.
- **Trace:** UI-R14, P8; `UI-CHECK-14`, `UI-CHECK-18`.

## UI-FAMILY-05 — Proportionate effort and separately evidenced surfaces

- **Declared primary category:** 5 — Quality attributes / resource economics. The defining discrimination is
  whether design and evidence effort is proportionate and separable enough to support the claims.
- **Secondary categories:** 2, 4, 8, 10.
- **Source / rationale:** `SRC-UI-PARENT` UI-R2, UI-R3, UI-R13, P1/P7/P8.
- **Actor + outcome:** the team obtains the strongest needed evidence without fixed-count or production-fidelity
  shortcuts.
- **Situation / invariant:** uncertainty, diversity, impact, and risk set evidence and prototype effort.
- **Applicability / priority:** every run; required.

### UI-SCENARIO-13 — Prototype fidelity and sample match the questions

- **Primary type + justification:** Good — ordinary planning uses risk and uncertainty rather than a universal
  count or fidelity.
- **Coverage-role:** Good; proves the positive proportionality floor.
- **Actor:** UI researcher and designer.
- **Given:** each test question names the behavior, participant context, uncertainty, risk, needed fidelity,
  sample logic, and claim limit.
- **When:** the prototype and direct-test plan are selected.
- **Then:** effort is sufficient to answer the questions without production-like work or unsupported breadth.
- **Failure oracle:** “five users” or “high fidelity” used without question-specific reasoning fails.
- **Evidence tuple:** observe question-to-method matrix; inspect rationale; confirm each cost reduces named
  uncertainty.
- **Design obligation:** method, sample, fidelity, and claims must be risk- and question-bound.
- **Trace:** UI-R3, UI-R13; `UI-CHECK-12`, `UI-CHECK-13`.

### UI-SCENARIO-14 — One outcome legitimately spans GUI and CLI

- **Primary type + justification:** Alternative-valid — two surfaces share a skeleton while carrying separate
  mechanics and evidence.
- **Coverage-role:** Alternative-valid; proves valid multi-surface scope.
- **Actor:** returning user in graphical and terminal contexts.
- **Given:** both login realizations share outcome, hierarchy/action/state relationships, and completion, while
  each has its own mechanics, access model, prototype, test tasks, and evidence.
- **When:** the run is reviewed as one multi-surface contract.
- **Then:** shared and separate columns are traceable and independently testable.
- **Failure oracle:** one prototype tested on one surface and generalized to the other fails.
- **Evidence tuple:** observe surface matrix and prototypes; execute each test path; confirm shared skeleton plus
  separate mechanics/access/evidence.
- **Design obligation:** valid multi-surface runs must retain surface-specific testability.
- **Trace:** UI-R2, UI-R13; `UI-CHECK-02`, `UI-CHECK-12`, `UI-CHECK-13`.

### UI-SCENARIO-15 — Related surfaces are merged without shared skeleton or evidence

- **Primary type + justification:** Adversarial — grouping by product label attempts to hide incompatible scope
  and weak evidence.
- **Coverage-role:** Adversarial; proves the multi-surface gate cannot be passed by naming.
- **Actor:** design owner and reviewer.
- **Given:** web login, desktop account administration, and CLI token management are placed in one run; they do
  not share one outcome/skeleton and only the web artifact has mechanics, access, prototype, and evidence.
- **When:** the bundle is called a cross-surface UI.
- **Then:** the run is split; no evidence is generalized across surfaces.
- **Failure oracle:** accepting because all surfaces concern “accounts” fails.
- **Evidence tuple:** observe outcome/skeleton/surface matrix; compare completion and evidence; confirm mismatch
  and missing separate proof.
- **Design obligation:** surface grouping requires substantive shared structure and separate verification.
- **Trace:** UI-R2, P1/P3/P7/P8; `UI-CHECK-02`, `UI-CHECK-12`.

## UI-FAMILY-06 — Visible failure, recovery, and operational continuity

- **Declared primary category:** 6 — Failure / recovery / operations. The defining discrimination is whether
  failures are detected, explained, contained, and recoverable.
- **Secondary categories:** 3, 4, 7, 8.
- **Source / rationale:** `SRC-UI-PARENT` UI-R1, UI-R6, UI-R12, P3–P5/P8.
- **Actor + outcome:** a user retains status, agency, and a safe route after interface or dependency failure.
- **Situation / invariant:** failure behavior is part of the outcome, not an afterthought.
- **Applicability / priority:** every run with applicable failure paths; gate-bearing.

### UI-SCENARIO-16 — A failure is explained and recoverable on each surface

- **Primary type + justification:** Good — the defining handled behavior succeeds.
- **Coverage-role:** Good; proves the positive recovery floor.
- **Actor:** returning user.
- **Given:** an authentication attempt fails for a known recoverable reason.
- **When:** the failure occurs in graphical and command-line prototypes.
- **Then:** each surface exposes status and cause at an appropriate level, preserves safe input/state, offers a
  valid retry/cancel/support route, and prevents false completion.
- **Failure oracle:** generic “something went wrong,” hidden stderr, dead-end dialog, or silent nonzero exit
  fails.
- **Evidence tuple:** observe failure state; inject the cause on each surface; confirm detection, explanation,
  containment, recovery, and no false success.
- **Design obligation:** all applicable failure paths need surface-appropriate feedback and recovery.
- **Trace:** UI-R1, UI-R12, P5; `UI-CHECK-10`, `UI-CHECK-17`.

### UI-SCENARIO-17 — Timeout transition preserves agency and state

- **Primary type + justification:** Failure/recovery — the defining concern is recovery from a timeout at the
  exact pending-to-timeout transition.
- **Coverage-role:** Failure/recovery; boundary is supporting context, not a second discharge.
- **Actor:** authenticating user.
- **Given:** an external authorization handoff has a defined timeout and may return just before, exactly at, or
  just after it.
- **When:** the timeout threshold is crossed.
- **Then:** the interface chooses one coherent result, explains status, avoids duplicate completion, supports
  safe retry/cancel, and reconciles a late response.
- **Failure oracle:** indefinite spinner, hanging command, double success, or lost authenticated state fails.
- **Evidence tuple:** observe transition state; simulate below/at/above timeout; confirm one terminal result and
  recoverable late-response behavior.
- **Design obligation:** exact timeout transitions need containment, late-result handling, and recovery.
- **Trace:** UI-R1, UI-R6, P5; `UI-CHECK-07`, `UI-CHECK-17`.

### UI-SCENARIO-18 — Visual error compliance hides unusable recovery

- **Primary type + justification:** Adversarial — familiar error styling attempts to substitute for useful
  behavior.
- **Coverage-role:** Adversarial; proves cosmetic error presence cannot pass.
- **Actor:** user with keyboard, screen reader, or terminal workflow.
- **Given:** an error is red and matches a component library, but is not associated with the failed input,
  announced, focusable, actionable, or exposed with correct CLI stream/exit behavior.
- **When:** the user tries to identify and recover from the failure.
- **Then:** the design fails despite visual compliance.
- **Failure oracle:** a screenshot or component-name check passing while direct operation fails is the target
  failure.
- **Evidence tuple:** observe behavior by each applicable modality; perform error and recovery task; confirm
  association, status, navigation, action, and completion.
- **Design obligation:** error design must be behaviorally accessible and recoverable.
- **Trace:** UI-R11, UI-R12; `UI-CHECK-10`, `UI-CHECK-17`.

## UI-FAMILY-07 — Identity, trust, safety, and governance

- **Declared primary category:** 7 — Trust / harm / governance. The defining discrimination is whether identity
  and authority remain within the non-waivable accessibility and safety floor.
- **Secondary categories:** 2, 6, 8, 10.
- **Source / rationale:** `SRC-UI-PARENT` UI-R4, UI-R5, UI-R12, P2/P8.
- **Actor + outcome:** users can trust interface meaning and action without exclusion or coercion.
- **Situation / invariant:** identity conflict is surfaced for user decision but cannot waive safety/access.
- **Applicability / priority:** every run; gate-bearing.

### UI-SCENARIO-19 — Identity conflict is resolved with evidence and a protected floor

- **Primary type + justification:** Good — the defining safe handling succeeds.
- **Coverage-role:** Good; proves the positive trust/governance floor.
- **Actor:** design owner, affected user, and UI designer.
- **Given:** brand typography, color, motion, tone, or command brevity conflicts with access evidence, safety,
  or a platform convention.
- **When:** the foundation or aesthetics are decided.
- **Then:** concrete clauses and evidence are presented; the user chooses among compliant directions; the
  accessibility/safety floor remains intact and the decision propagates.
- **Failure oracle:** silent override, load-order choice, or waiver of the floor fails.
- **Evidence tuple:** observe conflict record and decision trace; compare all affected clauses; confirm floor
  preservation and consistent propagation.
- **Design obligation:** identity conflicts need explicit evidence-led resolution without waiving the floor.
- **Trace:** UI-R5, UI-R12; `UI-CHECK-04`, `UI-CHECK-09`, `UI-CHECK-10`.

### UI-SCENARIO-20 — Identity language is used to justify inaccessible behavior

- **Primary type + justification:** Adversarial — brand authority attempts to bypass access and safety.
- **Coverage-role:** Adversarial; proves identity cannot game acceptance.
- **Actor:** design owner and affected user.
- **Given:** “minimal,” “calm,” “premium,” or “developer-first” identity is cited to hide status, reduce
  contrast, remove labels, suppress recovery detail, or require one modality.
- **When:** the choice is proposed as intentional expression.
- **Then:** it fails and returns to the owning structural/behavior/access decision; compliant alternatives are
  discussed with the user.
- **Failure oracle:** a documented brand rationale making the inaccessible behavior pass is the target failure.
- **Evidence tuple:** observe identity and access clauses; operate the task in affected modalities; confirm lost
  meaning, status, action, or recovery.
- **Design obligation:** identity expression may not erase required interface meaning or operation.
- **Trace:** UI-R11, UI-R12; `UI-CHECK-09`, `UI-CHECK-10`.

### UI-SCENARIO-21 — Missing consent or unsafe evidence handling blocks acceptance

- **Primary type + justification:** Failure/recovery — the governed test process fails and must recover through
  `NEEDS_CONTEXT`, remediation, or a new ethical test.
- **Coverage-role:** Failure/recovery; proves governance failure cannot be normalized.
- **Actor:** participant and researcher.
- **Given:** prototype testing lacks informed consent, needed accommodations, data minimization, or protected
  evidence handling.
- **When:** findings are offered as acceptance proof.
- **Then:** the evidence is not used to accept the design; the run repairs conditions and retests or remains
  `NEEDS_CONTEXT`.
- **Failure oracle:** retroactive stakeholder approval or redaction alone converting invalid collection into
  valid direct evidence fails.
- **Evidence tuple:** observe governed records and retention controls; inspect provenance; confirm whether each
  required condition existed during collection.
- **Design obligation:** invalid evidence conditions must block acceptance and trigger safe recovery.
- **Trace:** UI-R4, P8; `UI-CHECK-03`, `UI-CHECK-13`.

## UI-FAMILY-08 — Accessibility, modality equivalence, and locale

- **Declared primary category:** 8 — Inclusion / locale. The defining discrimination is equal access to action,
  meaning, status, and recovery across applicable users and modalities.
- **Secondary categories:** 2, 3, 6, 7.
- **Source / rationale:** `SRC-UI-PARENT` UI-R11, UI-R12; `SRC-UI-ACCESS` and `SRC-UI-PLATFORM` within their
  applicable surfaces.
- **Actor + outcome:** users in varied ability, input, language, locale, device, and environment contexts can
  complete and recover.
- **Situation / invariant:** visual compliance is not behavioral equivalence.
- **Applicability / priority:** every run; non-waivable gate.

### UI-SCENARIO-22 — Required meaning and action survive applicable modalities

- **Primary type + justification:** Good — ordinary access behavior supplies equivalent action, state, and
  completion evidence.
- **Coverage-role:** Good; proves the positive inclusion floor.
- **Actor:** user employing keyboard, assistive technology, terminal, voice, reduced motion, zoom, or another
  applicable mode.
- **Given:** the specification maps every required action, status, error, recovery, and completion meaning to
  applicable modalities.
- **When:** the user performs the complete path without a prohibited modality dependency.
- **Then:** sequence, meaning, control, feedback, and outcome remain coherent.
- **Failure oracle:** same labels or content with unreachable controls, wrong order, hidden status, or changed
  meaning fails.
- **Evidence tuple:** observe modality matrix; perform the complete task in each claimed mode; confirm equal
  obligation and completion.
- **Design obligation:** every required interface obligation needs applicable modality realization.
- **Trace:** UI-R12, P4–P8; `UI-CHECK-10`, `UI-CHECK-13`.

### UI-SCENARIO-23 — Locale and terminal differences preserve meaning

- **Primary type + justification:** Alternative-valid — a different language, format, direction, terminal
  width, or color capability is a valid context.
- **Coverage-role:** Alternative-valid; proves adaptation without changed outcome.
- **Actor:** localized user or terminal user under constrained display capability.
- **Given:** content can expand, direction or formats can differ, terminal width can shrink, and color may be
  unavailable.
- **When:** the same path is rendered and operated in the alternate valid context.
- **Then:** hierarchy, labels, status, errors, commands, non-color meaning, recovery, and completion remain
  understandable without clipping or ambiguity.
- **Failure oracle:** truncated action labels, color-only status, reordered commands, or locale-incorrect data
  causing a different action fails.
- **Evidence tuple:** observe adapted rendering/output; test representative strings and terminal constraints;
  confirm preserved meaning and operation.
- **Design obligation:** adaptation must preserve action, state, and outcome meaning.
- **Trace:** UI-R11, UI-R12; `UI-CHECK-09`, `UI-CHECK-10`.

### UI-SCENARIO-24 — Visually compliant interface is behaviorally inaccessible or misleading

- **Primary type + justification:** Adversarial — screenshots and component tokens attempt to pass while direct
  operation or state interpretation fails.
- **Coverage-role:** Adversarial; proves access and meaning cannot be cosmetic.
- **Actor:** user with an applicable access need.
- **Given:** contrast and visible labels appear compliant, but focus order, announcement, timing, status,
  keyboard/command operation, or recovery is wrong; or output implies success while the state failed.
- **When:** the complete outcome is attempted.
- **Then:** the design fails even though a visual audit passes.
- **Failure oracle:** acceptance from token/component/screenshot inspection without behavioral evidence is the
  target failure.
- **Evidence tuple:** observe end-to-end behavior; use applicable modalities and compare system state; confirm
  inaccessible action or misleading result.
- **Design obligation:** accessibility and truthfulness require behavioral, state-linked proof.
- **Trace:** UI-R11, UI-R12; `UI-CHECK-10`, `UI-CHECK-17`.

## UI-FAMILY-09 — Change, child specialization, and co-loaded compatibility

- **Declared primary category:** 9 — Change / compatibility / reversibility. The defining discrimination is
  whether downstream or co-loaded changes preserve the approved parent contract.
- **Secondary categories:** 1, 4, 7, 10.
- **Source / rationale:** `SRC-UI-PARENT` UI-R15, UI-R16, P9.
- **Actor + outcome:** downstream surface owners change mechanics without silently changing the outcome or
  parent invariants.
- **Situation / invariant:** future children specialize; evidence-led user decisions resolve true conflicts.
- **Applicability / priority:** handoff and any co-loaded/specialized run; gate-bearing when triggered.

### UI-SCENARIO-25 — A future surface child specializes without weakening the parent

- **Primary type + justification:** Change/regression — a downstream version introduces exact platform
  mechanics while preserving the existing contract.
- **Coverage-role:** Change/regression; proves safe specialization across a lifecycle change.
- **Actor:** child-skill author and UI reviewer.
- **Given:** a future web, CLI, desktop, mobile, or voice child adds exact standards, patterns, and examples.
- **When:** its output is compared with the approved parent handoff.
- **Then:** outcome, skeleton, state, recovery, access, evidence, aesthetics-last chronology, and test gates remain
  present; only surface mechanics are specialized.
- **Failure oracle:** a child document that narrows or omits a parent obligation fails regression.
- **Evidence tuple:** observe parent/child clause map; diff obligations before/after; confirm preserved invariants
  and explicit mechanic ownership.
- **Design obligation:** child specialization needs a no-loss parent trace.
- **Trace:** UI-R15, P9; `UI-CHECK-15`, `UI-CHECK-18`.

### UI-SCENARIO-26 — A child convention is used to waive parent obligations

- **Primary type + justification:** Adversarial — platform authority attempts to override the parent contract.
- **Coverage-role:** Adversarial; proves child references cannot game inheritance.
- **Actor:** surface designer and reviewer.
- **Given:** a platform HIG, web pattern, design-system component, GNU/POSIX convention, or CLI practice is cited
  to skip whole-spec approval, direct testing, recovery, modality equivalence, or specification-first revision.
- **When:** the child design is offered for acceptance.
- **Then:** the waiver fails; the parent invariant is restored or a concrete evidence conflict is presented to
  the user without waiving access/safety.
- **Failure oracle:** “the platform says so” ending the trace without user/evidence review fails.
- **Evidence tuple:** observe cited child rule and parent map; compare effects; confirm omitted parent obligation.
- **Design obligation:** child mechanics cannot waive parent outcome and evidence gates.
- **Trace:** UI-R12, UI-R15; `UI-CHECK-10`, `UI-CHECK-15`.

### UI-SCENARIO-27 — Co-loaded UI and UX clauses conflict

- **Primary type + justification:** Counterfactual — it inverts the premise that the two independently valid
  contracts agree in this context.
- **Coverage-role:** Counterfactual; proves the disconfirmation response is an explicit user decision.
- **Actor:** UI/UX designer and product decision owner.
- **Given:** a UI hierarchy, interaction, aesthetic, or platform direction materially conflicts with a
  co-loaded UX outcome, content, state, recovery, accessibility, evidence, or risk clause.
- **When:** the conflict is discovered.
- **Then:** exact clauses, evidence, trade-offs, and affected traces are shown to the user; no precedence or load
  order is invented; the safety/access floor stays intact.
- **Failure oracle:** silently choosing UI, UX, or the last-loaded guidance fails.
- **Evidence tuple:** observe conflict record; compare clauses and user decision; confirm propagated resolution
  without invented precedence.
- **Design obligation:** co-loaded conflict must reopen user authority with evidence.
- **Trace:** UI-R16, P9; `UI-CHECK-16`, `UI-CHECK-18`.

## UI-FAMILY-10 — Evidence, traceability, concepts, and identity fallback

- **Declared primary category:** 10 — Evidence / traceability / clarity. The defining discrimination is whether
  a cold reader can resolve each claim to evidence, decision, specification, prototype, and retest.
- **Secondary categories:** 1, 2, 4, 7.
- **Source / rationale:** `SRC-UI-PARENT` UI-R3, UI-R5, UI-R8–UI-R10, UI-R14, P2/P6/P8/P9.
- **Actor + outcome:** a cold reader can verify the design without hidden session context or evidence theater.
- **Situation / invariant:** missing identity triggers a bounded brief; prior evidence informs but does not
  replace the run's direct test; concepts differ materially.
- **Applicability / priority:** every run; required.

### UI-SCENARIO-28 — Missing DESIGN material yields a confirmed run-scoped brief

- **Primary type + justification:** Good — the correct evidence fallback produces a bounded identity foundation
  without inventing a project-wide document.
- **Coverage-role:** Good; proves the positive traceability and identity-fallback floor.
- **Actor:** project decision owner and UI designer.
- **Given:** no adequate `DESIGN.md`, brand, product, or design-system document exists.
- **When:** P2 establishes identity.
- **Then:** live product/system/tokens are inspected; the user answers promise, users, values, voice, character,
  patterns, constraints, anti-patterns, and expression questions; a temporary brief is confirmed in the feature
  design document.
- **Failure oracle:** silently inventing identity, skipping it, or creating a universal project-wide
  `DESIGN.md` fails.
- **Evidence tuple:** observe authority-chain register and decision trace; inspect feature document; confirm
  live evidence, explicit questions, user lock, and bounded location.
- **Design obligation:** identity fallback must be evidence-led, user-confirmed, and run-scoped.
- **Trace:** UI-R5, P2; `UI-CHECK-04`, `UI-CHECK-18`.

### UI-SCENARIO-29 — Prior evidence is offered in place of this run's direct test

- **Primary type + justification:** Adversarial — relevant prior evidence attempts to bypass the current-run
  direct prototype-test gate.
- **Coverage-role:** Adversarial; proves relevance and recency cannot substitute for required direct use.
- **Actor:** design owner and reviewer.
- **Given:** prior UX research or earlier UI testing is offered instead of this run's direct prototype test.
- **When:** the design is proposed for final lock.
- **Then:** the replacement fails; representative users must directly use this run's post-G5 prototype under
  UI-R3/UI-R4 before the design can lock.
- **Failure oracle:** a strong prior-research section making an untested current prototype pass is the target
  failure.
- **Evidence tuple:** observe evidence dates/provenance; inspect current-run test record; confirm that no direct
  use of this run's prototype supports the acceptance claim.
- **Design obligation:** current-run direct prototype testing must remain independently evidenced.
- **Trace:** UI-R3; `UI-CHECK-13`, `UI-CHECK-18`.

### UI-SCENARIO-30 — A load-bearing premise is wrong and reopens the earliest branch

- **Primary type + justification:** Counterfactual — the approved premise that two surfaces share a skeleton or
  that the identity source governs is inverted by new evidence.
- **Coverage-role:** Counterfactual; proves evidence reopens rather than being patched downstream.
- **Actor:** UI designer and product decision owner.
- **Given:** direct testing or authoritative project evidence disproves a surface, identity, hierarchy, or state
  premise after later work exists.
- **When:** the contradiction is confirmed.
- **Then:** the earliest owning D-node and user gate reopen; the specification is reconciled before prototype
  changes and affected paths are retested.
- **Failure oracle:** preserving the old premise and editing only labels, aesthetics, or prototype behavior
  fails.
- **Evidence tuple:** observe premise and disconfirming source; walk decision/revision lineage; confirm earliest-
  owner reopening and downstream propagation.
- **Design obligation:** new evidence must reopen the earliest affected decision and update the durable contract.
- **Trace:** UI-R7, UI-R8, UI-R14; `UI-CHECK-14`, `UI-CHECK-18`.

### UI-SCENARIO-31 — Cosmetic variants are presented as two material concepts

- **Primary type + justification:** Adversarial — superficial option count attempts to satisfy concept
  divergence without a consequential design difference.
- **Coverage-role:** Adversarial; proves material-concept comparison cannot be passed by relabeling.
- **Actor:** design owner and reviewer.
- **Given:** two interface “concepts” share the same hierarchy, action model, information flow, interaction,
  and state communication and differ only by color, type, spacing, icon style, or wording.
- **When:** they are offered as the UI-R9 comparison.
- **Then:** they count as one concept; the run creates a materially different option or records the bounded
  single-concept exception with real constraints plus direct evidence.
- **Failure oracle:** two polished boards or variant names making the concept check pass is the target failure.
- **Evidence tuple:** observe concept artifacts; compare consequential structure and behavior; confirm only
  cosmetic variance and absence/presence of a valid exception.
- **Design obligation:** concept comparison must change a consequential interface property or prove the
  exception.
- **Trace:** UI-R9; `UI-CHECK-08`, `UI-CHECK-18`.

### UI-SCENARIO-32 — Smart-skip and silence are treated as user approval

- **Primary type + justification:** Adversarial — process compression attempts to turn existing evidence or
  continued work into authority the user did not give.
- **Coverage-role:** Adversarial; proves adaptive interviewing cannot erase a decision axis or user gate.
- **Actor:** UI designer and product decision owner.
- **Given:** a design-bearing axis is skipped without both current evidence and a prior user lock, several axes
  are bundled into one question, or G1–G6 is inferred from silence or continued work.
- **When:** the decision record is used to justify construction, prototyping, acceptance, or handoff.
- **Then:** the trace fails; the earliest undecided axis reopens, research/options/recommendation are supplied as
  applicable, and the user gives one explicit decision per axis and gate.
- **Failure oracle:** an apparently complete document with no resolvable user lock for an applicable axis or
  gate is the target failure.
- **Evidence tuple:** observe question and decision history; audit each D-node and G1–G6; confirm one-axis turns,
  valid smart-skip pairs, researched recommendations, and explicit locks.
- **Design obligation:** adaptive completion must preserve every applicable decision and explicit user gate.
- **Trace:** UI-R7, UI-R8; `UI-CHECK-18`, `UI-CHECK-19`.

## Obligation-to-check reservation

| Obligation cluster | Scenario IDs | Reserved checks |
|---|---|---|
| One bounded outcome and adjacent-outcome control | `01`–`03` | `UI-CHECK-01` |
| Shared skeleton plus separate multi-surface mechanics/evidence | `02`, `14`, `15` | `UI-CHECK-02`, `UI-CHECK-12` |
| Representative people, consent, accommodations, bounded claims | `04`–`06`, `21`, `29` | `UI-CHECK-03`, `UI-CHECK-13` |
| Identity authority chain, fallback, and conflict handling | `19`, `20`, `28` | `UI-CHECK-04`, `UI-CHECK-09` |
| Top-down skeleton and bottom-up coherent units | `07`–`09` | `UI-CHECK-05`, `UI-CHECK-06` |
| Complete behavior/state/recovery and exact order | `08`, `10`–`12`, `16`–`18` | `UI-CHECK-07`, `UI-CHECK-11`, `UI-CHECK-14`, `UI-CHECK-17` |
| Material concepts | `31` | `UI-CHECK-08` |
| Aesthetics-last and behavioral accessibility | `18`–`20`, `22`–`24` | `UI-CHECK-09`, `UI-CHECK-10` |
| Parent-preserving handoff and co-load conflict | `25`–`27` | `UI-CHECK-15`, `UI-CHECK-16` |
| Bidirectional evidence and cold-reader clarity | `10`, `12`, `25`, `28`–`32` | `UI-CHECK-18`, `UI-CHECK-19` |

## Failability and omission audit

- A polished big-bang artifact fails `UI-SCENARIO-03`.
- Any prototype before whole-specification approval fails `UI-SCENARIO-11`.
- A locally working unit that breaks the skeleton fails `UI-SCENARIO-09`.
- Aesthetics or visual error polish before sound behavior/access fails `UI-SCENARIO-18`, `20`, or `24`.
- Missing design material exercises `UI-SCENARIO-28`; identity/access conflict exercises `19`–`20`.
- Missing users, consent, accommodations, or evidence fails closed through `05`, `06`, and `21`.
- Prior evidence replacing direct testing fails `UI-SCENARIO-29`; cosmetic concepts fail `31`.
- Invalid surface merging fails `UI-SCENARIO-15`; valid GUI/CLI scope is distinguished by `02` and `14`.
- Child waiver and co-load precedence fail `UI-SCENARIO-26` and `27`.
- Prototype-only correction fails `UI-SCENARIO-12`; evidence-driven earliest-branch reopening is `30`.
- Invalid smart-skip, bundled axes, and silent approval fail `UI-SCENARIO-32`.

Every load-bearing UI-R1–UI-R16 clause maps to at least one case and reserved check. Every case maps back to a
live parent clause and forward to a reserved check. No exploratory or sensitive-evidence exemption is used.
