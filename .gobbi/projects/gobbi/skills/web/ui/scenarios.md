# Web UI Scenario Set

Scenario source for [`SKILL.md`](SKILL.md). Consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises browser-realization policy without adding policy. Lifecycle:
design obligations plus implementation/evaluation coverage for one feature's accepted web interface. Generic
UI research/prototype cases remain with [`../../ui`](../../ui/scenarios.md).

Scale: nine families and 34 cases. Sensitive evidence is referenced, not copied.

The category and coverage-role labels below are local to this source. New evaluation checklist sources use the
scenario classes owned by [`checklist`](../../evaluation/checklist/SKILL.md). `Secondary/domain tags` add
subject routing only; they never discharge a case-type minimum.

## Coverage register

| # | Scenario category | Disposition | Carrier |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `WEB-UI-FAMILY-02`, `-09` |
| 2 | Actors / stakeholders / use-context | selected | `WEB-UI-FAMILY-03`, `-05`, `-08` |
| 3 | Behavior / state / data | selected | `WEB-UI-FAMILY-01`–`-04`, `-06` |
| 4 | Interfaces / dependencies / structure | selected | `WEB-UI-FAMILY-01`, `-04`, `-07`, `-09` |
| 5 | Quality attributes / resource economics | selected | `WEB-UI-FAMILY-03`, `-05`–`-07` |
| 6 | Failure / recovery / operations | selected | `WEB-UI-FAMILY-02`–`-04`, `-06`, `-07`, `-09` |
| 7 | Trust / harm / governance | selected | `WEB-UI-FAMILY-02`, `-04`, `-06` |
| 8 | Inclusion / locale | selected | `WEB-UI-FAMILY-01`, `-03`–`-06`, `-08` |
| 9 | Change / compatibility / reversibility | selected | `WEB-UI-FAMILY-07`, `-09` |
| 10 | Evidence / traceability / clarity | selected | `WEB-UI-FAMILY-01`, `-02`, `-05`, `-08`, `-09` |

Every family has a Good case and an adversarial face. Triggered boundary, failure/recovery, accessibility,
change, and framework cases are distinct rather than implied by a happy case.

## Category × case-type matrix

`n/a` cells name where the property is carried instead of silently omitting it.

| Family | Good | Alternative | Negative | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| `01` | `01` | n/a: native-first is the floor | n/a: invalid input lives in `04` | n/a: no finite edge | n/a: no dependency, persistence, or interruption trigger | `02` | n/a: lifecycle lives in `07` | n/a: semantics are inspected |
| `02` | `03` | n/a: alternate valid paths come from parent | n/a: form invalidity lives in `04` | `25` | `05` | `04` | n/a: render change lives in `07` | `24` |
| `03` | `06` | `08` | n/a: invalid input lives in `04` | `27` | `26` | `07` | n/a: modality is not a version event | n/a: modalities are operated |
| `04` | `09` | n/a: accepted form owns valid alternatives | `28` | `29` | `10` | `11` | n/a: schema change is parent-owned | n/a: server truth is inspected |
| `05` | `12` | n/a: matrix cells are selected, not alternate journeys | n/a: no invalid input | `13` | n/a: adaptive break is a boundary | `14` | n/a: browser change lives in `07` | n/a: live variation is operated |
| `06` | `15` | n/a: each overlay type uses one ownership contract | n/a: invalid input lives in `04` | n/a: finite edge is state-owned | `30` | `16` | n/a: lifecycle lives in `07` | n/a: expiry is injected |
| `07` | `17` | n/a: project promise selects lifecycle paths | n/a: malformed input is not the lifecycle | n/a: exact restore edge is carried by the lifecycle case | `19` | `18` | `31` | n/a: before/after state is observed |
| `08` | `20` | n/a: evidence classes are complementary, not substitutes | n/a: no invalid input | n/a: claim limits are explicit | n/a: missing proof blocks | `21` | n/a: evidence freshness is metadata | `32` |
| `09` | `22` | n/a: framework owner selects idiom | n/a: invalid input is parent-owned | n/a: no finite edge | `34` | `23` | `33` | n/a: rendered output is inspected |

## Source register and stable IDs

- `SRC-WEB-UI-PARENT` — [`SKILL.md`](SKILL.md), WEB-UI-R01–WEB-UI-R12 and P1–P8; sole child-policy owner.
- `SRC-WEB-UI-GENERIC` — generic [`ui`](../../ui/SKILL.md) accepted specification and evidence; design owner.
- `SRC-WEB-UI-ROOT` — root [`web`](../SKILL.md) vertical contract and feature states.
- `SRC-WEB-UI-STANDARDS` — applicable versioned standards listed in the parent.
- `SRC-WEB-UI-VISION` — vision outputs for named captured frames only; no hidden-behavior authority.

Case IDs are permanent `WEB-UI-SCENARIO-NN`; checklist reservations are permanent `WEB-UI-CHECK-NN`. A changed
discrimination receives a new ID.

### Authoritative case-to-check relation

Each case-level `Trace` field is the authoritative case-to-check relation. Checklist `Seeds`, the source and
guaranteed-coverage ledgers, and the check-to-obligation reverse audit must be exact projections of that set:
no forward-only, reverse-only, grouped, or inferred edge is valid. Every retained edge also means the check's
actual PASS condition and named evidence independently preserve the full case-level `Obligation`; a ledger or
audit summary is not proof of that semantic union.

## WEB-UI-FAMILY-01 — Semantic document and exposed structure

- **Primary category:** 4 Interfaces / dependencies / structure — document and control contracts are the
  defining discrimination.
- **Secondary-category tags:** 3 Behavior / state / data; 8 Inclusion / locale; 10 Evidence / traceability /
  clarity.
- **Source:** WEB-UI-R01, WEB-UI-R02, WEB-UI-R11; P2/P5.
- **Actor/outcome:** browser and assistive-technology users receive one meaningful document and operable control
  structure matching the accepted hierarchy.
- **Applicability:** every observable browser interface.
- **Cases:** `WEB-UI-SCENARIO-01`, `WEB-UI-SCENARIO-02`.

### WEB-UI-SCENARIO-01 — Native semantic skeleton expresses the interface

- **Primary type / coverage-role:** Positive / {Positive}; ordinary semantic operation defines this case.
- **Secondary/domain tags:** semantics, accessibility tree, native controls.
- **Given/When/Then:** Given the accepted hierarchy and interaction, when the page is read in source order and
  through the accessibility tree before visual polish, then landmarks, headings, regions, lists/tables/forms,
  labels, controls, relationships, name/role/value/state, and status convey the same outcome.
- **Failure oracle:** a required relationship or action exists only visually or depends on styling order.
- **Evidence tuple:** inspect source/DOM/tree; operate native controls; compare accepted-clause trace.
- **Obligation:** the production document must expose the accepted hierarchy, relationships, controls, and
  status through native semantics and a coherent accessibility tree.
- **Trace:** WEB-UI-R01, WEB-UI-R02, WEB-UI-R11; `WEB-UI-CHECK-01`, `-02`, `-11`.

### WEB-UI-SCENARIO-02 — Styled generic elements imitate controls

- **Primary type / coverage-role:** Adversarial / {Adversarial}; visual parity intentionally attempts to hide
  semantic loss.
- **Secondary/domain tags:** accessibility, semantics, native controls.
- **Given/When/Then:** Given a custom clickable or selectable element looks correct, when keyboard, name/role/
  value/state, disabled behavior, activation, and form submission are exercised, then any missing native-equivalent
  behavior fails the realization.
- **Failure oracle:** pointer success or matching pixels are accepted while another modality cannot identify or
  operate the control.
- **Evidence tuple:** inspect DOM/tree/events; operate keyboard and pointer; confirm native-first justification.
- **Obligation:** any custom control must prove native-equivalent identity, state, activation, disabling, and
  form behavior across applicable modalities.
- **Trace:** WEB-UI-R02, WEB-UI-R05, WEB-UI-R11; `WEB-UI-CHECK-02`, `-05`, `-11`.

## WEB-UI-FAMILY-02 — Complete and truthful interface states

- **Primary category:** 3 Behavior / state / data — truthful state transitions define the family.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 6 Failure / recovery / operations; 7 Trust / harm /
  governance; 10 Evidence / traceability / clarity.
- **Source:** WEB-UI-R01, WEB-UI-R03; P2/P6.
- **Actor/outcome:** every parent feature state is distinguishable and exposes the next truthful action.
- **Applicability:** every interface; state classes are evidence-selected.
- **Cases:** `WEB-UI-SCENARIO-03`–`WEB-UI-SCENARIO-05`, `WEB-UI-SCENARIO-24`,
  `WEB-UI-SCENARIO-25`.

### WEB-UI-SCENARIO-03 — State table maps visible state to domain truth

- **Primary type / coverage-role:** Positive / {Positive}; ordinary full-state realization defines this case.
- **Secondary/domain tags:** state truth, accessibility status.
- **Given/When/Then:** Given applicable initial, empty, loading, partial, stale, invalid, disabled, pending,
  success, error, recovery, unavailable, denied, and duplicate states, when each is entered, then visible and
  programmatic signals, enabled actions, and announcements agree with authoritative state.
- **Failure oracle:** two materially different states are indistinguishable or a state has no safe next action.
- **Evidence tuple:** inject each state; inspect UI/DOM/status; reconcile server/domain trace.
- **Obligation:** every activated interface state must remain distinguishable, truthful, announced where
  needed, and connected to one safe next action.
- **Trace:** WEB-UI-R01, WEB-UI-R03; `WEB-UI-CHECK-01`, `-03`.

### WEB-UI-SCENARIO-04 — Optimistic completion outlives server failure

- **Primary type / coverage-role:** Adversarial / {Adversarial}; optimistic presentation intentionally attempts
  to pass despite authoritative truth; the counterfactual discharge is isolated in scenario 24.
- **Secondary/domain tags:** asynchronous state, authoritative effect, false success.
- **Given/When/Then:** Given the interface optimistically advances, when the authoritative effect fails or is
  reversed, then success is withdrawn, the failure is announced, user work is preserved, and a safe recovery
  path remains.
- **Failure oracle:** completion styling, navigation, or toast persists without the required effect.
- **Evidence tuple:** inject rejection/reversal; observe state/focus/message; confirm authoritative reconciliation.
- **Obligation:** optimistic presentation must retract false completion and preserve work, explanation, focus,
  and recovery when authoritative truth disagrees.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-07`.

### WEB-UI-SCENARIO-05 — Partial or stale content remains actionable

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; refresh failure in mixed stale/partial
  state defines this recovery discharge; an independent finite-state boundary is isolated in scenario 25.
- **Secondary/domain tags:** stale data, partial state, retained work.
- **Given/When/Then:** Given cached/partial content is visible while refresh fails or newer state exists, when
  the user acts, then staleness and unavailable portions are clear, destructive actions use current authority,
  and refresh/retry does not erase recoverable work.
- **Failure oracle:** stale content silently poses as current or a refresh clears the only recoverable state.
- **Evidence tuple:** force stale/partial data; operate action and retry; inspect displayed and server state.
- **Obligation:** stale or partial content must identify its limits, protect current authority, retain safe
  work, and expose a recoverable refresh path.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-07`.

### WEB-UI-SCENARIO-24 — Authoritative truth is inverted behind the same interface

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the load-bearing premise that visible
  completion follows authoritative completion is inverted without an actor attempting to game acceptance.
- **Secondary/domain tags:** state truth, authoritative effect, false completion.
- **Given/When/Then:** Given two otherwise identical interface runs, when the authoritative effect exists in
  one and is absent or reversed in the other, then the second run must not retain the first run's completion
  state and must expose pending, failure, or recovery according to the parent contract.
- **Failure oracle:** both runs render and announce the same completed state despite different authoritative
  effects.
- **Evidence tuple:** execute paired effect-present/effect-absent runs; compare visible/programmatic state,
  enabled actions, focus, and recovery; confirm the states diverge correctly.
- **Obligation:** interface completion must change when authoritative completion is experimentally inverted.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-07`.

### WEB-UI-SCENARIO-25 — Empty, one, and many results cross the state boundary

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact empty/one/many transition defines this
  case without requiring a refresh failure.
- **Secondary/domain tags:** state table, collection boundary, status.
- **Given/When/Then:** Given a result-bearing region can contain zero, one, or many current items, when it
  crosses each exact transition, then the document, status, available actions, and focus expose empty, populated,
  and updated states without flashing loading, stale, or false completion.
- **Failure oracle:** zero and one are indistinguishable, the first item is skipped or duplicated, or the final
  removal leaves an inoperable stale state.
- **Evidence tuple:** inject zero, one, and many authoritative results; inspect DOM/tree/status/focus/actions at
  each transition; confirm one matching state per cardinality.
- **Obligation:** every finite collection-state edge must map exactly to a truthful operable interface state.
- **Trace:** WEB-UI-R03; `WEB-UI-CHECK-03`.

## WEB-UI-FAMILY-03 — Input modalities and focus

- **Primary category:** 8 Inclusion / locale — equivalent access and operation across modalities define the
  family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 5 Quality
  attributes / resource economics; 6 Failure / recovery / operations.
- **Source:** WEB-UI-R05, WEB-UI-R06; P3/P7.
- **Actor/outcome:** people can reach, understand, operate, and leave the feature through applicable modalities.
- **Applicability:** every interactive interface.
- **Cases:** `WEB-UI-SCENARIO-06`–`WEB-UI-SCENARIO-08`, `WEB-UI-SCENARIO-26`,
  `WEB-UI-SCENARIO-27`.

### WEB-UI-SCENARIO-06 — Equivalent outcomes across input modes

- **Primary type / coverage-role:** Positive / {Positive}; ordinary equivalent operation across selected modes
  defines this case.
- **Secondary/domain tags:** accessibility, input modality, focus.
- **Given/When/Then:** Given keyboard, pointer, touch, sequential navigation, and applicable assistive technology,
  when the complete feature is operated, then controls are reachable in logical order, targets are usable,
  focus is visible, and no outcome depends only on hover, gesture, or drag.
- **Failure oracle:** one modality cannot discover or complete an action available to another.
- **Evidence tuple:** operate each selected mode; record order/targets/alternatives; confirm same outcome.
- **Obligation:** every selected input and assistive modality must reach the same actions and outcome with
  logical order, visible focus, usable targets, and non-gesture alternatives.
- **Trace:** WEB-UI-R05, WEB-UI-R06; `WEB-UI-CHECK-04`, `-05`.

### WEB-UI-SCENARIO-07 — Modal transition loses or leaks focus

- **Primary type / coverage-role:** Adversarial / {Adversarial}; modal misuse intentionally stresses focus
  containment; an independently injected focus-removal recovery is isolated in scenario 26.
- **Secondary/domain tags:** accessibility, focus, modal interaction.
- **Given/When/Then:** Given a dialog opens and its trigger may move or disappear, when the user enters,
  operates, cancels, submits, errors, and closes, then focus enters usefully, stays only when modality requires,
  inactive content is unavailable, and focus restores to a logical surviving target.
- **Failure oracle:** focus falls to the document start/body, remains behind the modal, or reaches inert content.
- **Evidence tuple:** operate keyboard/tree through every exit; inspect active element and inactive subtree.
- **Obligation:** modal interaction must contain focus only while active and restore it to a logical surviving
  target across cancel, submit, error, dismissal, and trigger removal.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

### WEB-UI-SCENARIO-08 — Pointer-friendly gesture has no alternative

- **Primary type / coverage-role:** Alternative-valid / {Alternative-valid}; a materially different valid input
  route defines this case; the exact target boundary is isolated in scenario 27.
- **Secondary/domain tags:** accessibility, input modality, target size.
- **Given/When/Then:** Given the accepted interaction uses dragging, swiping, or a compact target, when a person
  uses keyboard, coarse pointer, magnification, or sequential input, then an equivalent action and adequate
  target/spacing remain available.
- **Failure oracle:** only precise pointer manipulation can complete the accepted outcome.
- **Evidence tuple:** operate alternative inputs at selected zoom/viewport; measure target where required.
- **Obligation:** gesture, drag, compact-target, and precision interactions must provide an equivalent operable
  route for keyboard, coarse pointer, magnification, and sequential input.
- **Trace:** WEB-UI-R04, WEB-UI-R05; `WEB-UI-CHECK-04`, `-05`, `-09`.

### WEB-UI-SCENARIO-26 — Asynchronous removal loses the active focus target

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; an asynchronous update removes the
  active control and requires a recoverable focus result without an adversarial modal.
- **Secondary/domain tags:** focus recovery, asynchronous state, accessibility.
- **Given/When/Then:** Given focus is on a control or result that an asynchronous update removes, when the update
  succeeds or fails, then focus moves to the nearest logical surviving target or explanatory status, the new
  state is announced, and the intended next action remains operable.
- **Failure oracle:** focus falls to body/document start, becomes invisible, or remains on a removed/inert node.
- **Evidence tuple:** focus each removable target; trigger success and failure removal; inspect active element,
  accessibility tree, announcement, and next action.
- **Obligation:** async removal must recover focus and orientation to a logical live target in every result.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

### WEB-UI-SCENARIO-27 — Target and spacing sit below, at, and above the project limit

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact project-owned target or spacing threshold
  defines this case without using an alternative input route as the discharge.
- **Secondary/domain tags:** target size, spacing, coarse pointer, magnification.
- **Given/When/Then:** Given the project supplies an applicable target-size or spacing limit, when the control is
  exercised just below, at, and just above it with the affected input context, then the at/above cases remain
  operable and the below case is rejected or redesigned before release.
- **Failure oracle:** the below-limit control passes, the at-limit control is unreachable, or the measurement is
  inferred from a screenshot rather than inspected operation and geometry.
- **Evidence tuple:** inspect the sourced limit; measure and operate below/at/above fixtures with coarse pointer
  or magnification; confirm the correct pass/fail transition.
- **Obligation:** applicable target and spacing limits must be proved at their exact transition with live use.
- **Trace:** WEB-UI-R04, WEB-UI-R05, WEB-UI-R10; `WEB-UI-CHECK-04`, `-09`, `-10`.

## WEB-UI-FAMILY-04 — Browser-native forms and submission

- **Primary category:** 3 Behavior / state / data — input, validation, submission, and recovery state define the
  family.
- **Secondary-category tags:** 4 Interfaces / dependencies / structure; 6 Failure / recovery / operations; 7
  Trust / harm / governance; 8 Inclusion / locale.
- **Source:** WEB-UI-R03, WEB-UI-R07; P3/P6.
- **Actor/outcome:** a person can enter, correct, submit, and recover data without lost work or duplicate harm.
- **Applicability:** any feature collecting or confirming input.
- **Cases:** `WEB-UI-SCENARIO-09`–`WEB-UI-SCENARIO-11`, `WEB-UI-SCENARIO-28`,
  `WEB-UI-SCENARIO-29`.

### WEB-UI-SCENARIO-09 — Native form transaction succeeds and can be corrected

- **Primary type / coverage-role:** Positive / {Positive}; the ordinary valid form transaction defines this
  case.
- **Secondary/domain tags:** forms, validation, accessibility.
- **Given/When/Then:** Given persistent labels, applicable autocomplete/input types, instructions, and constraints,
  when values are entered, reviewed where needed, submitted, and corrected, then browser behavior, validation,
  focus, messages, and authoritative completion agree.
- **Failure oracle:** a field is unlabeled, required format is hidden, or the person cannot locate/correct an error.
- **Evidence tuple:** inspect DOM/autocomplete; submit valid/invalid values; follow focus/error links.
- **Obligation:** the native form transaction must provide persistent labels and constraints, valid review and
  correction, error navigation, retained safe input, and authoritative completion.
- **Trace:** WEB-UI-R02, WEB-UI-R07; `WEB-UI-CHECK-02`, `-06`.

### WEB-UI-SCENARIO-10 — Server rejection preserves safe user work

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; server rejection after a client-valid
  input defines this recovery case; browser-invalid input is isolated in scenario 28.
- **Secondary/domain tags:** forms, validation, retained work.
- **Given/When/Then:** Given client checks pass but the server rejects one or more values, when the response
  returns, then errors are persistently associated and summarized, focus/navigation finds them, non-sensitive
  valid input remains, and correction/resubmission is safe.
- **Failure oracle:** values disappear, error meaning is detached, or only a transient message reports failure.
- **Evidence tuple:** inject field/global rejection; inspect DOM/messages/focus/value retention; resubmit.
- **Obligation:** server rejection must preserve safe input, persistently associate and summarize errors, move
  focus usefully, and support safe correction and resubmission.
- **Trace:** WEB-UI-R03, WEB-UI-R07, WEB-UI-R08; `WEB-UI-CHECK-03`, `-06`, `-07`.

### WEB-UI-SCENARIO-11 — Duplicate submit races the pending state

- **Primary type / coverage-role:** Adversarial / {Adversarial}; repeated activation intentionally attempts to
  defeat pending-state protection; the exact transition boundary is isolated in scenario 29.
- **Secondary/domain tags:** forms, duplicate action, idempotency.
- **Given/When/Then:** Given slow submission and repeated click/key activation or history restoration, when
  multiple attempts occur, then the interface exposes one truthful pending/retry model and the authoritative
  contract prevents duplicate harm without stranding the user.
- **Failure oracle:** repeated activation creates duplicate effects or a disabled control leaves no recovery.
- **Evidence tuple:** delay response and repeat activation; inspect client/server attempts, focus, and terminal state.
- **Obligation:** repeated activation must preserve one truthful pending model, prevent duplicate authoritative
  harm, keep a recovery route, and reach one terminal state.
- **Trace:** WEB-UI-R03, WEB-UI-R07, WEB-UI-R08; `WEB-UI-CHECK-03`, `-06`, `-07`.

### WEB-UI-SCENARIO-28 — Browser-invalid input is rejected before submission

- **Primary type / coverage-role:** Negative / {Negative}; invalid or missing browser input is safely rejected
  before the server-rejection recovery path is relevant.
- **Secondary/domain tags:** forms, constraints, error association, retained input.
- **Given/When/Then:** Given a required field is empty or violates an applicable type, range, or format
  constraint, when submission is attempted, then no authoritative effect begins, each error is persistently
  identified and associated, summary/navigation reaches it, focus is useful, and safe input remains.
- **Failure oracle:** invalid input starts the effect, disappears, or produces only styling/transient feedback
  without a programmatic error relationship.
- **Evidence tuple:** submit each selected invalid class; inspect requests/effects, DOM relationships, summary,
  focus, values, and correction; confirm safe rejection.
- **Obligation:** client-visible invalid input must fail safely before effect and remain correctable without lost work.
- **Trace:** WEB-UI-R03, WEB-UI-R07; `WEB-UI-CHECK-03`, `-06`.

### WEB-UI-SCENARIO-29 — Activation crosses the pending transition exactly once

- **Primary type / coverage-role:** Boundary / {Boundary}; activation immediately before, at, and after the
  pending-state transition defines this case without an intentional repeat attacker.
- **Secondary/domain tags:** forms, pending state, duplicate boundary.
- **Given/When/Then:** Given one valid submission changes from ready to pending, when a second activation lands
  immediately before, at, and immediately after that transition, then the interface and authoritative contract
  create at most one permitted effect, retain one focus/status model, and expose the correct cancel/retry route.
- **Failure oracle:** the boundary creates two requests/effects, drops the permitted first request, or leaves a
  disabled control with no status or recovery.
- **Evidence tuple:** schedule activations on all three sides of the transition; inspect request/effect count,
  DOM state, focus, announcement, and terminal recovery.
- **Obligation:** the ready-to-pending transition must enforce one coherent submission at the exact edge.
- **Trace:** WEB-UI-R03, WEB-UI-R07, WEB-UI-R08; `WEB-UI-CHECK-03`, `-06`, `-07`.

## WEB-UI-FAMILY-05 — Responsive composition and preferences

- **Primary category:** 8 Inclusion / locale — equivalent meaning and operation under user and locale variation
  define the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 5 Quality attributes / resource economics;
  10 Evidence / traceability / clarity.
- **Source:** WEB-UI-R04, WEB-UI-R10, WEB-UI-R11; P4/P7.
- **Actor/outcome:** the accepted hierarchy and actions survive the selected variation matrix.
- **Applicability:** every visible interface.
- **Cases:** `WEB-UI-SCENARIO-12`–`WEB-UI-SCENARIO-14`.

### WEB-UI-SCENARIO-12 — Risk-based variation matrix preserves the outcome

- **Primary type / coverage-role:** Positive / {Positive}; ordinary operation across the selected variation
  matrix defines this case.
- **Secondary/domain tags:** responsive layout, accessibility, locale, preferences.
- **Given/When/Then:** Given selected viewports/devices, zoom/text, content/locale, orientation, theme, contrast/
  motion preferences, and data states, when each cell is exercised live, then content order, readability,
  actions, status, and focus remain available without harmful clipping, overlap, or unexpected scrolling.
- **Failure oracle:** a required fact/action is hidden, reordered misleadingly, or cannot be operated in a cell.
- **Evidence tuple:** exercise and capture declared cells; operate actions; record browser/preferences/content.
- **Obligation:** every selected variation cell must preserve content order, readability, actions, status,
  focus, and the complete outcome without harmful clipping or overlap.
- **Trace:** WEB-UI-R04, WEB-UI-R10; `WEB-UI-CHECK-04`, `-09`, `-10`.

### WEB-UI-SCENARIO-13 — Long locale at zoom breaks the action path

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact combined narrow-viewport, locale-content,
  and enlargement limit defines this case.
- **Secondary/domain tags:** accessibility, locale, content stress, responsive layout.
- **Given/When/Then:** Given the longest expected content/locale and supported zoom/text enlargement at a narrow
  viewport, when the feature is completed, then labels remain understandable, controls and errors reflow, and
  horizontal scrolling or truncation does not hide required action or meaning except where structurally needed.
- **Failure oracle:** clipping, overlap, ellipsis, or offscreen positioning removes the completion/recovery path.
- **Evidence tuple:** inject content/locale; enlarge/resize; inspect/operate full path.
- **Obligation:** the longest expected content and locale at the supported enlargement and narrow-viewport edge
  must retain understandable content, errors, and all required actions.
- **Trace:** WEB-UI-R04, WEB-UI-R10; `WEB-UI-CHECK-04`, `-09`, `-10`.

### WEB-UI-SCENARIO-14 — One polished viewport games responsive approval

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a single polished capture intentionally games
  broader responsive acceptance.
- **Secondary/domain tags:** visual evidence, responsive layout, accessibility.
- **Given/When/Then:** Given a screenshot matches the accepted design at one viewport, when unshown variation,
  focus, semantics, and interaction are requested, then the screenshot supports only captured pixels and all
  other claims remain open until owner-correct evidence exists.
- **Failure oracle:** visual similarity closes responsive, keyboard, semantic, or conformance checks.
- **Evidence tuple:** inspect capture metadata; run omitted live cells/DOM/interaction; compare claim ledger.
- **Obligation:** captured rendering evidence must remain bounded to its pixels and state; responsive,
  semantic, focus, interaction, and conformance claims require their own evidence.
- **Trace:** WEB-UI-R04, WEB-UI-R10, WEB-UI-R11; `WEB-UI-CHECK-09`, `-10`, `-11`.

## WEB-UI-FAMILY-06 — Overlays and asynchronous feedback

- **Primary category:** 6 Failure / recovery / operations — controlled temporary state, late results, and
  recovery define the family.
- **Secondary-category tags:** 3 Behavior / state / data; 5 Quality attributes / resource economics; 7 Trust /
  harm / governance; 8 Inclusion / locale.
- **Source:** WEB-UI-R06, WEB-UI-R08; P3/P6.
- **Actor/outcome:** temporary surfaces and background changes remain understandable, controllable, and recoverable.
- **Applicability:** when an overlay, live update, or long-running action exists.
- **Cases:** `WEB-UI-SCENARIO-15`, `WEB-UI-SCENARIO-16`, `WEB-UI-SCENARIO-30`.

### WEB-UI-SCENARIO-15 — Overlay and async state have complete ownership

- **Primary type / coverage-role:** Positive / {Positive}; ordinary controlled overlay and asynchronous
  transitions define this case.
- **Secondary/domain tags:** overlays, asynchronous status, focus, accessibility.
- **Given/When/Then:** Given a dialog, popover, menu, toast/banner, or async action, when it opens/starts,
  updates, errors, cancels, succeeds, and closes, then trigger, label, dismissal, focus, background interaction,
  scroll, stacking, status announcement, late result, and persistent recovery follow the locked contract.
- **Failure oracle:** the person cannot find, control, exit, or recover from the temporary state.
- **Evidence tuple:** exercise all transitions and modalities; inspect DOM/tree/focus/status/scroll.
- **Obligation:** every overlay and asynchronous transition must define ownership, status, focus, background,
  dismissal, progress, cancellation, late-result handling, and persistent recovery.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

### WEB-UI-SCENARIO-16 — Critical result exists only in a disappearing toast

- **Primary type / coverage-role:** Adversarial / {Adversarial}; an expiring transient channel intentionally
  hides critical recovery state; an independently injected overlay failure is isolated in scenario 30.
- **Secondary/domain tags:** toast, accessibility status, persistent recovery.
- **Given/When/Then:** Given a critical success, failure, permission, or recovery instruction appears in a toast,
  when it times out, is obscured, or is not announced, then the persistent interface still exposes the state and
  next safe action.
- **Failure oracle:** missing the transient message makes status or recovery unknowable.
- **Evidence tuple:** suppress/delay announcement and let message expire; inspect persistent state and action.
- **Obligation:** critical success, failure, permission, and recovery information must remain persistently
  discoverable and operable after any transient message disappears.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-07`.

### WEB-UI-SCENARIO-30 — Overlay owner fails after its trigger disappears

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; owner failure and trigger removal
  require persistent state and focus recovery without using a disappearing-message attack.
- **Secondary/domain tags:** overlays, owner failure, focus restoration, persistent recovery.
- **Given/When/Then:** Given an overlay or long-running surface is open and its trigger is removed during an
  error, cancellation, or navigation change, when the temporary surface closes, then focus reaches a logical
  survivor, the terminal state remains discoverable, background interaction is coherent, and retry/support is
  available where allowed.
- **Failure oracle:** focus targets a missing node, the error disappears with the overlay, background state is
  left inert, or recovery requires hidden repair.
- **Evidence tuple:** remove the trigger during each selected terminal result; inspect focus, DOM/tree, status,
  background, scroll, and recovery; confirm a safe terminal state.
- **Obligation:** overlay-owner failure must restore focus, background operation, persistent status, and recovery.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

## WEB-UI-FAMILY-07 — Browser and rendering lifecycles

- **Primary category:** 9 Change / compatibility / reversibility — continuity across browser and rendering
  lifecycle transitions defines the family.
- **Secondary-category tags:** 4 Interfaces / dependencies / structure; 5 Quality attributes / resource
  economics; 6 Failure / recovery / operations.
- **Source:** WEB-UI-R09, WEB-UI-R10, WEB-UI-R12; P4/P6.
- **Actor/outcome:** entry and rendering lifecycles preserve semantic, visual, and state continuity.
- **Applicability:** select each lifecycle promised or activated by the application.
- **Cases:** `WEB-UI-SCENARIO-17`–`WEB-UI-SCENARIO-19`, `WEB-UI-SCENARIO-31`.

### WEB-UI-SCENARIO-17 — Direct entry through hydration remains coherent

- **Primary type / coverage-role:** Positive / {Positive}; ordinary direct-entry and hydration operation defines
  this case; the before/after change discharge is isolated in scenario 31.
- **Secondary/domain tags:** hydration, rendering lifecycle, state continuity.
- **Given/When/Then:** Given direct entry, pre/server-rendered markup, delayed client boot, and hydration where
  applicable, when the feature becomes interactive, then structure, names, content, focus, form values, route,
  and authoritative state do not reset, duplicate, or contradict.
- **Failure oracle:** the interface changes meaning, loses work/focus, flashes false state, or becomes unusable.
- **Evidence tuple:** throttle/disable client boot; inspect before/after DOM/tree/pixels/state; operate the path.
- **Obligation:** direct entry and hydration must preserve semantic meaning, content, focus, form values, route,
  authoritative state, and one operable path before and after client boot.
- **Trace:** WEB-UI-R09, WEB-UI-R10; `WEB-UI-CHECK-08`, `-10`.

### WEB-UI-SCENARIO-18 — Hydration mismatch silently resets local state

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a mismatch intentionally hides lost state behind
  a cosmetically correct final DOM; lifecycle recovery is independently discharged by scenario 19.
- **Secondary/domain tags:** hydration, framework integration, focus, duplicate handlers.
- **Given/When/Then:** Given server markup and client state differ, when hydration or route transition runs,
  then mismatches are detected and resolved without losing user input, duplicating handlers, moving focus, or
  presenting stale authority.
- **Failure oracle:** final pixels look right while the transition discarded state or attached behavior twice.
- **Evidence tuple:** inject mismatch; capture warnings/events/input/focus before and after; repeat action once.
- **Obligation:** rendering mismatches must be detected and resolved without hidden input loss, duplicate
  handlers, focus movement, stale authority, or cosmetically masked failure.
- **Trace:** WEB-UI-R03, WEB-UI-R09, WEB-UI-R11; `WEB-UI-CHECK-03`, `-08`, `-11`.

### WEB-UI-SCENARIO-19 — History restore and duplicate initialization diverge

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; failed restoration defines this case;
  the lifecycle change comparison is isolated in scenario 31.
- **Secondary/domain tags:** history restore, stale assets, duplicate initialization.
- **Given/When/Then:** Given refresh, back/forward cache or session restore, stale assets, or duplicate boot, when
  the interface resumes, then route, content, listeners, pending state, focus, and actions reconcile once with
  the parent contract and expose recovery if compatibility fails.
- **Failure oracle:** duplicate effects/listeners, stale action authority, blank UI, or unrecoverable state.
- **Evidence tuple:** exercise selected restore/asset/boot cases; inspect events/state/focus and server effects.
- **Obligation:** restore, stale-asset, and duplicate-boot failures must reconcile route, state, listeners,
  focus, actions, and authoritative effects once or expose a safe recovery.
- **Trace:** WEB-UI-R09, WEB-UI-R10, WEB-UI-R12; `WEB-UI-CHECK-08`, `-10`, `-12`.

### WEB-UI-SCENARIO-31 — Mixed rendering versions preserve the browser contract

- **Primary type / coverage-role:** Change/regression / {Change/regression}; explicit old/new and mixed-version
  rendering comparison defines this case without using a successful direct entry or injected restore failure.
- **Secondary/domain tags:** lifecycle compatibility, stale assets, hydration, rollout.
- **Given/When/Then:** Given old server markup, new client assets, new server markup, and supported mixed states,
  when the feature is entered and operated across the rollout matrix, then semantics, content, form values,
  focus, route, events, state truth, and recovery remain compatible or a stop condition blocks the mix.
- **Failure oracle:** a supported old/new pair changes meaning, duplicates behavior, loses work, or cannot recover.
- **Evidence tuple:** operate before/after and each supported mixed pair; inspect DOM/tree/state/focus/events and
  authoritative effect; confirm compatibility or stop behavior.
- **Obligation:** rendering lifecycle changes must preserve browser meaning and operation across supported versions.
- **Trace:** WEB-UI-R09, WEB-UI-R10, WEB-UI-R12; `WEB-UI-CHECK-08`, `-10`, `-12`.

## WEB-UI-FAMILY-08 — Evidence integrity

- **Primary category:** 10 Evidence / traceability / clarity — owner-correct, resolvable proof defines the
  family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 8 Inclusion / locale.
- **Source:** WEB-UI-R10, WEB-UI-R11; P7/P8.
- **Actor/outcome:** a cold reviewer can resolve each interface claim to the evidence that observes it.
- **Applicability:** every run; gate.
- **Cases:** `WEB-UI-SCENARIO-20`, `WEB-UI-SCENARIO-21`, `WEB-UI-SCENARIO-32`.

### WEB-UI-SCENARIO-20 — Interface evidence matrix keeps claims separate

- **Primary type / coverage-role:** Positive / {Positive}; ordinary owner-correct evidence resolution defines
  this case.
- **Secondary/domain tags:** evidence integrity, accessibility, visual inspection.
- **Given/When/Then:** Given source, DOM/tree, operated input/focus, live adaptation, captured rendering, and
  inherited user evidence, when interface status is reported, then each claim identifies artifact,
  environment, state, freshness, owner, and limitation without crossing evidence boundaries.
- **Failure oracle:** an artifact is missing/unresolvable or generalized to a property it cannot observe.
- **Evidence tuple:** resolve every pointer; compare claim to evidence class; rerun a sample.
- **Obligation:** each interface claim must resolve to fresh owner-correct evidence with environment, state,
  artifact, and explicit limitation.
- **Trace:** WEB-UI-R10, WEB-UI-R11; `WEB-UI-CHECK-10`, `-11`.

### WEB-UI-SCENARIO-21 — Automated accessibility and screenshots claim conformance

- **Primary type / coverage-role:** Adversarial / {Adversarial}; green automation and captures intentionally
  stand in for unobserved properties; the counterfactual evidence comparison is isolated in scenario 32.
- **Secondary/domain tags:** accessibility, visual evidence, representative-user evidence.
- **Given/When/Then:** Given an automated accessibility scan is green and screenshots match, when manual
  semantics, keyboard/focus, adaptive behavior, assistive-technology operation, and representative-user status
  are inspected, then every unobserved claim remains open and any discovered failure blocks it.
- **Failure oracle:** absence of detected violations or visual mismatch is called full accessibility/design proof.
- **Evidence tuple:** inspect tool scope; run omitted owner checks; compare generic UI acceptance record.
- **Obligation:** automation and captured pixels must not close manual semantics, operated interaction,
  adaptation, assistive-technology, or representative-user acceptance claims.
- **Trace:** WEB-UI-R11; `WEB-UI-CHECK-11`.

### WEB-UI-SCENARIO-32 — Green pixels remain while operated behavior is inverted

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the premise that unchanged pixels and
  automated results imply unchanged operation is inverted without an actor gaming the report.
- **Secondary/domain tags:** evidence integrity, operated behavior, accessibility.
- **Given/When/Then:** Given two builds have the same captured pixels and scan result, when keyboard order,
  accessible state, live announcement, or focus restoration is deliberately inverted in one build, then the
  owner-correct operated/DOM evidence must distinguish it and the interface claim must fail.
- **Failure oracle:** both builds receive the same interface verdict despite a materially broken hidden behavior.
- **Evidence tuple:** compare paired control/broken builds; inspect captures/scans and then DOM/tree/operation;
  confirm only owner-correct evidence detects and fails the inversion.
- **Obligation:** interface evidence must change when a hidden but required operated property is inverted.
- **Trace:** WEB-UI-R11; `WEB-UI-CHECK-11`.

## WEB-UI-FAMILY-09 — Production and framework-owner boundary

- **Primary category:** 9 Change / compatibility / reversibility — framework integration and production change
  must preserve the browser contract.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 4 Interfaces / dependencies / structure; 6 Failure
  / recovery / operations; 10 Evidence / traceability / clarity.
- **Source:** WEB-UI-R01, WEB-UI-R09, WEB-UI-R12; P1/P6/P8.
- **Actor/outcome:** framework integration and production completion preserve the accepted browser contract.
- **Applicability:** every implementation; framework cases when a framework is present.
- **Cases:** `WEB-UI-SCENARIO-22`, `WEB-UI-SCENARIO-23`, `WEB-UI-SCENARIO-33`,
  `WEB-UI-SCENARIO-34`.

### WEB-UI-SCENARIO-22 — Framework integration preserves browser outcomes

- **Primary type / coverage-role:** Positive / {Positive}; ordinary framework integration and production
  completion define this case; the framework change comparison is isolated in scenario 33.
- **Secondary/domain tags:** framework integration, production completeness, compatibility.
- **Given/When/Then:** Given the applicable framework owns APIs and lifecycle idioms, when its components,
  routing, rendering, and state integrate the feature, then accepted semantics, states, focus, responsive
  behavior, lifecycle entries, error recovery, tests, and diagnostics are complete without child-owned API policy.
- **Failure oracle:** the production output loses a clause or the child prescribes an unowned framework idiom.
- **Evidence tuple:** trace accepted clauses to output/tests; inspect owner boundary; run lifecycle matrix.
- **Obligation:** production framework integration must complete every accepted browser clause while leaving
  framework APIs with their owner and preserving the child browser outcomes.
- **Trace:** WEB-UI-R01, WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-01`, `-08`, `-12`.

### WEB-UI-SCENARIO-23 — Framework convention waives semantic behavior

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a framework convention intentionally attempts
  to waive browser outcomes; change and failure/recovery are isolated in scenarios 33 and 34.
- **Secondary/domain tags:** framework ownership, semantics, focus, hydration.
- **Given/When/Then:** Given a framework convention, component library, router, or state tool is considered
  standard, when it produces generic controls, focus resets, inaccessible pending state, hydration loss, or an
  incomplete production path, then the browser contract still fails and the framework owner must correct it.
- **Failure oracle:** library usage or framework popularity stands in for verified browser behavior.
- **Evidence tuple:** inspect rendered output and operated behavior; trace parent/child ownership; reproduce gap.
- **Obligation:** a framework or library convention must never waive semantic, focus, state, lifecycle, or
  production-completeness behavior that operated browser evidence disproves.
- **Trace:** WEB-UI-R02, WEB-UI-R06, WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-02`, `-05`, `-08`, `-12`.

### WEB-UI-SCENARIO-33 — Framework upgrade preserves browser behavior before and after

- **Primary type / coverage-role:** Change/regression / {Change/regression}; the explicit framework-version
  comparison defines this case without treating ordinary integration or a convention attack as the discharge.
- **Secondary/domain tags:** framework upgrade, compatibility, browser outcomes.
- **Given/When/Then:** Given the applicable framework owner changes rendering, routing, state, or component
  versions, when the same accepted feature is operated before and after, then semantic output, complete states,
  focus, responsive behavior, lifecycle entries, recovery, tests, and diagnostics retain the browser contract.
- **Failure oracle:** the upgrade changes an accepted browser outcome while framework-local checks remain green.
- **Evidence tuple:** compare pre/post production output and selected matrix; inspect owner change record;
  operate semantics, focus, state, lifecycle, and recovery.
- **Obligation:** framework changes must preserve every browser outcome owned by this child.
- **Trace:** WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-08`, `-12`.

### WEB-UI-SCENARIO-34 — Partial framework rollout leaves no operable recovery

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; a failed partial production rollout
  defines this case without relying on framework-ownership gaming.
- **Secondary/domain tags:** partial rollout, browser recovery, framework integration.
- **Given/When/Then:** Given old and new framework-produced interface assets are partly active, when one
  supported path fails or the stop condition fires, then the interface remains semantic enough to explain the
  state, preserves safe work and focus, prevents duplicate action, and provides a tested rollback/forward-fix
  or support route.
- **Failure oracle:** partial rollout produces a blank, misleading, duplicated, or unrecoverable interface.
- **Evidence tuple:** inject the supported partial-failure states; inspect DOM/tree/state/focus/effects; execute
  the recovery and confirm one safe terminal result.
- **Obligation:** failed partial framework rollout must preserve a truthful operable browser recovery path.
- **Trace:** WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-08`, `-12`.

## Multi-role construction audit

Each original multi-role case was challenged with a dedicated single-type construction. Every secondary
discrimination was independently constructible or already had a distinct case, so no n-ary record remains.

| Original case | Attempted secondary construction | Disposition |
|---|---|---|
| `04` | invert authoritative truth without an acceptance-gaming actor | keep Adversarial on `04`; append Counterfactual `24` |
| `05` | cross an empty/one/many state edge without a refresh failure | keep Failure/recovery on `05`; append Boundary `25` |
| `07` | remove a focused target during async change without modal misuse | keep Adversarial on `07`; append Failure/recovery `26` |
| `08` | exercise a sourced target/spacing limit without changing input route | keep Alternative-valid on `08`; append Boundary `27` |
| `10` | reject browser-invalid input before any server response | keep Failure/recovery on `10`; append Negative `28` |
| `11` | schedule ordinary activations on each side of pending transition | keep Adversarial on `11`; append Boundary `29` |
| `16` | fail an overlay owner after trigger removal without hiding a toast | keep Adversarial on `16`; append Failure/recovery `30` |
| `17` | compare old/new and mixed rendering versions separately from a successful entry | keep Positive on `17`; append Change/regression `31` |
| `18` | restoration failure is already independently exercised by `19` | keep Adversarial on `18`; use existing Failure/recovery `19` |
| `19` | explicit lifecycle version comparison is constructible without failed restoration | keep Failure/recovery on `19`; append Change/regression `31` |
| `21` | invert hidden operated behavior while pixels and scan remain constant | keep Adversarial on `21`; append Counterfactual `32` |
| `22` | compare framework versions without using ordinary completion as change evidence | keep Positive on `22`; append Change/regression `33` |
| `23` | framework version comparison is independent of convention gaming | keep Adversarial on `23`; append Change/regression `33`; append missing triggered Failure/recovery `34` |

The gaming probe rejected relabeled clones. Each appended case changes the trigger, manipulated variable, and
failure oracle. The audit also corrected two matrix-only false discharges: family 01 has no failure trigger,
and family 09 now has the dedicated failure case `34`.

## Source → scenario → obligation → check ledger

The obligation column exposes the semantic union of the explicit case-level `Obligation` fields. This
check-level layout is an exact projection of `Trace`. `Check policy sources` identifies the rule(s) that own
the check predicate; it does not assert a cross-product between every listed case and every rule.

| Check policy sources | Scenarios | Exposed obligation union | Reserved check |
|---|---|---|---|
| WEB-UI-R01 | `01`, `03`, `22` | accepted hierarchy and clauses remain traceable through semantic structure, truthful states, and complete framework output | `01` |
| WEB-UI-R02 | `01`, `02`, `09`, `23` | native semantics, custom-control equivalence, correct form structure, and framework-produced semantic output | `02` |
| WEB-UI-R03 | `03`–`05`, `10`, `11`, `16`, `18`, `24`, `25`, `28`, `29` | every state, authority inversion, cardinality edge, validation/rejection, pending transition, persistent result, and mismatch remains truthful and recoverable | `03` |
| WEB-UI-R04, WEB-UI-R05 | `06`, `08`, `12`, `13`, `27` | equivalent modality operation, alternatives, full variation cells, exact locale/content/zoom/reflow edges, and target limits preserve the complete outcome | `04` |
| WEB-UI-R05, WEB-UI-R06 | `02`, `06`–`08`, `15`, `23`, `26`, `30` | logical visible focus and restoration across controls, modalities, modal/async removal, overlays, and framework states remain operable | `05` |
| WEB-UI-R07 | `09`–`11`, `28`, `29` | valid, invalid, rejected, repeated, and exact pending-edge form transactions retain labels, errors, work, focus, and one effect | `06` |
| WEB-UI-R06, WEB-UI-R08 | `04`, `05`, `07`, `10`, `11`, `15`, `16`, `24`, `26`, `29`, `30` | async and temporary states stay authoritative, announced, controlled, persistent where critical, and recoverable across every terminal result | `07` |
| WEB-UI-R09 | `17`–`19`, `22`, `23`, `31`, `33`, `34` | direct/render/restore/framework lifecycle behavior remains compatible, complete, and recoverable across versions and partial failure | `08` |
| WEB-UI-R04, WEB-UI-R10 | `08`, `12`–`14`, `27` | the sourced matrix covers modality, locale/content/zoom/reflow, visible-evidence limits, and exact target boundaries while preserving the outcome | `09` |
| WEB-UI-R10 | `12`–`14`, `17`, `19`, `20`, `27`, `31` | the full variation matrix, exact limits, lifecycle versions, and evidence ledger are freshly operated with bounded claims | `10` |
| WEB-UI-R11 | `01`, `02`, `14`, `18`, `20`, `21`, `32` | each semantic, operated, adaptive, captured, automated, and counterfactual claim stays at its observable evidence owner | `11` |
| WEB-UI-R12 | `19`, `22`, `23`, `31`, `33`, `34` | production and framework integration are complete and preserve browser outcomes through change, recovery, and handoff | `12` |

## Failability and omission audit

Every child rule maps to a case and reserved check. All 34 cases have one explicit observable obligation and
map back to live policy and at least one reserved check. Every check preserves the union named above, and no
coverage-role set contains more than one type. Native-looking generic
controls, false optimistic success, stale content, focus leaks, duplicate submit, long-locale reflow, transient
critical messages, hydration resets, one-viewport approval, automated-tool overclaim, and framework exemptions
all fail observable oracles. No screenshot or framework convention closes an unobserved property.
