# Web UI Scenario Set

Scenario source for [`SKILL.md`](SKILL.md). Consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises browser-realization policy without adding policy. Lifecycle:
design obligations plus implementation/evaluation coverage for one feature's accepted web interface. Generic
UI research/prototype cases remain with [`../../ui`](../../ui/scenarios.md).

Scale: nine families and 23 cases. Sensitive evidence is referenced, not copied.

## Coverage register

| # | Scenario category | Disposition | Carrier |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `WEB-UI-FAMILY-02`, `-09` |
| 2 | Actors / stakeholders / use-context | selected | `WEB-UI-FAMILY-03`, `-05` |
| 3 | Behavior / state / data | selected | `WEB-UI-FAMILY-02`, `-04`, `-06` |
| 4 | Interfaces / dependencies / structure | selected | `WEB-UI-FAMILY-01`, `-07`, `-09` |
| 5 | Quality attributes / resource economics | selected | `WEB-UI-FAMILY-03`, `-05`–`-07` |
| 6 | Failure / recovery / operations | selected | `WEB-UI-FAMILY-02`, `-04`, `-06`, `-07` |
| 7 | Trust / harm / governance | selected | `WEB-UI-FAMILY-04`, `-06` |
| 8 | Inclusion / locale | selected | `WEB-UI-FAMILY-01`, `-03`, `-05`, `-08` |
| 9 | Change / compatibility / reversibility | selected | `WEB-UI-FAMILY-07`, `-09` |
| 10 | Evidence / traceability / clarity | selected | `WEB-UI-FAMILY-08` |

Every family has a Good case and an adversarial face. Triggered boundary, failure/recovery, accessibility,
change, and framework cases are distinct rather than implied by a happy case.

## Category × case-type matrix

`n/a` cells name where the property is carried instead of silently omitting it.

| Family | Good | Alternative | Negative | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| `01` | `01` | n/a: native-first is the floor | n/a: invalid input lives in `04` | n/a: no finite edge | `02` | `02` | n/a: lifecycle lives in `07` | n/a: semantics are inspected |
| `02` | `03` | n/a: alternate valid paths come from parent | n/a: form invalidity lives in `04` | `05` | `04`, `05` | `04` | n/a: render change lives in `07` | `04` |
| `03` | `06` | `08` | n/a: invalid input lives in `04` | `08` | `07` | `07` | n/a: modality is not a version event | n/a: modalities are operated |
| `04` | `09` | n/a: accepted form owns valid alternatives | `10` | `11` | `10`, `11` | `11` | n/a: schema change is parent-owned | n/a: server truth is inspected |
| `05` | `12` | n/a: matrix cells are selected, not alternate journeys | n/a: no invalid input | `13` | n/a: adaptive break is a boundary | `14` | n/a: browser change lives in `07` | n/a: live variation is operated |
| `06` | `15` | n/a: each overlay type uses one ownership contract | n/a: invalid input lives in `04` | n/a: finite edge is state-owned | `16` | `16` | n/a: lifecycle lives in `07` | n/a: expiry is injected |
| `07` | `17` | n/a: project promise selects lifecycle paths | n/a: malformed input is not the lifecycle | n/a: exact restore edge is `19` | `18`, `19` | `18` | `17`, `19` | n/a: before/after state is observed |
| `08` | `20` | n/a: evidence classes are complementary, not substitutes | n/a: no invalid input | n/a: claim limits are explicit | n/a: missing proof blocks | `21` | n/a: evidence freshness is metadata | `21` |
| `09` | `22` | n/a: framework owner selects idiom | n/a: invalid input is parent-owned | n/a: no finite edge | `23` | `23` | `22`, `23` | n/a: rendered output is inspected |

## Source register and stable IDs

- `SRC-WEB-UI-PARENT` — [`SKILL.md`](SKILL.md), WEB-UI-R01–WEB-UI-R12 and P1–P8; sole child-policy owner.
- `SRC-WEB-UI-GENERIC` — generic [`ui`](../../ui/SKILL.md) accepted specification and evidence; design owner.
- `SRC-WEB-UI-ROOT` — root [`web`](../SKILL.md) vertical contract and feature states.
- `SRC-WEB-UI-STANDARDS` — applicable versioned standards listed in the parent.
- `SRC-WEB-UI-VISION` — vision outputs for named captured frames only; no hidden-behavior authority.

Case IDs are permanent `WEB-UI-SCENARIO-NN`; checklist reservations are permanent `WEB-UI-CHECK-NN`. A changed
discrimination receives a new ID.

## WEB-UI-FAMILY-01 — Semantic document and exposed structure

- **Source:** WEB-UI-R01, WEB-UI-R02, WEB-UI-R11; P2/P5.
- **Actor/outcome:** browser and assistive-technology users receive one meaningful document and operable control
  structure matching the accepted hierarchy.
- **Applicability:** every observable browser interface.

### WEB-UI-SCENARIO-01 — Native semantic skeleton expresses the interface

- **Primary type / role:** Good / {Good}; semantic floor.
- **Given/When/Then:** Given the accepted hierarchy and interaction, when the page is read in source order and
  through the accessibility tree before visual polish, then landmarks, headings, regions, lists/tables/forms,
  labels, controls, relationships, name/role/value/state, and status convey the same outcome.
- **Failure oracle:** a required relationship or action exists only visually or depends on styling order.
- **Evidence tuple:** inspect source/DOM/tree; operate native controls; compare accepted-clause trace.
- **Trace:** WEB-UI-R01, WEB-UI-R02; `WEB-UI-CHECK-01`, `-02`.

### WEB-UI-SCENARIO-02 — Styled generic elements imitate controls

- **Primary type / role:** Adversarial / {Adversarial, Accessibility}; visual parity hides semantic loss.
- **Given/When/Then:** Given a custom clickable or selectable element looks correct, when keyboard, name/role/
  value/state, disabled behavior, activation, and form submission are exercised, then any missing native-equivalent
  behavior fails the realization.
- **Failure oracle:** pointer success or matching pixels are accepted while another modality cannot identify or
  operate the control.
- **Evidence tuple:** inspect DOM/tree/events; operate keyboard and pointer; confirm native-first justification.
- **Trace:** WEB-UI-R02, WEB-UI-R05, WEB-UI-R11; `WEB-UI-CHECK-02`, `-05`, `-11`.

## WEB-UI-FAMILY-02 — Complete and truthful interface states

- **Source:** WEB-UI-R01, WEB-UI-R03; P2/P6.
- **Actor/outcome:** every parent feature state is distinguishable and exposes the next truthful action.
- **Applicability:** every interface; state classes are evidence-selected.

### WEB-UI-SCENARIO-03 — State table maps visible state to domain truth

- **Primary type / role:** Good / {Good}; full-state realization.
- **Given/When/Then:** Given applicable initial, empty, loading, partial, stale, invalid, disabled, pending,
  success, error, recovery, unavailable, denied, and duplicate states, when each is entered, then visible and
  programmatic signals, enabled actions, and announcements agree with authoritative state.
- **Failure oracle:** two materially different states are indistinguishable or a state has no safe next action.
- **Evidence tuple:** inject each state; inspect UI/DOM/status; reconcile server/domain trace.
- **Trace:** WEB-UI-R01, WEB-UI-R03; `WEB-UI-CHECK-01`, `-03`.

### WEB-UI-SCENARIO-04 — Optimistic completion outlives server failure

- **Primary type / role:** Adversarial / {Adversarial, Counterfactual}; visible success is false.
- **Given/When/Then:** Given the interface optimistically advances, when the authoritative effect fails or is
  reversed, then success is withdrawn, the failure is announced, user work is preserved, and a safe recovery
  path remains.
- **Failure oracle:** completion styling, navigation, or toast persists without the required effect.
- **Evidence tuple:** inject rejection/reversal; observe state/focus/message; confirm authoritative reconciliation.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-08`.

### WEB-UI-SCENARIO-05 — Partial or stale content remains actionable

- **Primary type / role:** Failure/recovery / {Boundary, Failure/recovery}; mixed data state.
- **Given/When/Then:** Given cached/partial content is visible while refresh fails or newer state exists, when
  the user acts, then staleness and unavailable portions are clear, destructive actions use current authority,
  and refresh/retry does not erase recoverable work.
- **Failure oracle:** stale content silently poses as current or a refresh clears the only recoverable state.
- **Evidence tuple:** force stale/partial data; operate action and retry; inspect displayed and server state.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-08`.

## WEB-UI-FAMILY-03 — Input modalities and focus

- **Source:** WEB-UI-R05, WEB-UI-R06; P3/P7.
- **Actor/outcome:** people can reach, understand, operate, and leave the feature through applicable modalities.
- **Applicability:** every interactive interface.

### WEB-UI-SCENARIO-06 — Equivalent outcomes across input modes

- **Primary type / role:** Good / {Good, Accessibility}; modality floor.
- **Given/When/Then:** Given keyboard, pointer, touch, sequential navigation, and applicable assistive technology,
  when the complete feature is operated, then controls are reachable in logical order, targets are usable,
  focus is visible, and no outcome depends only on hover, gesture, or drag.
- **Failure oracle:** one modality cannot discover or complete an action available to another.
- **Evidence tuple:** operate each selected mode; record order/targets/alternatives; confirm same outcome.
- **Trace:** WEB-UI-R05, WEB-UI-R06; `WEB-UI-CHECK-04`, `-05`.

### WEB-UI-SCENARIO-07 — Modal transition loses or leaks focus

- **Primary type / role:** Adversarial / {Adversarial, Failure/recovery}; focus containment and restoration fail.
- **Given/When/Then:** Given a dialog opens and its trigger may move or disappear, when the user enters,
  operates, cancels, submits, errors, and closes, then focus enters usefully, stays only when modality requires,
  inactive content is unavailable, and focus restores to a logical surviving target.
- **Failure oracle:** focus falls to the document start/body, remains behind the modal, or reaches inert content.
- **Evidence tuple:** operate keyboard/tree through every exit; inspect active element and inactive subtree.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

### WEB-UI-SCENARIO-08 — Pointer-friendly gesture has no alternative

- **Primary type / role:** Alternative / {Alternative, Boundary, Accessibility}; drag/swipe/precision boundary.
- **Given/When/Then:** Given the accepted interaction uses dragging, swiping, or a compact target, when a person
  uses keyboard, coarse pointer, magnification, or sequential input, then an equivalent action and adequate
  target/spacing remain available.
- **Failure oracle:** only precise pointer manipulation can complete the accepted outcome.
- **Evidence tuple:** operate alternative inputs at selected zoom/viewport; measure target where required.
- **Trace:** WEB-UI-R04, WEB-UI-R05; `WEB-UI-CHECK-04`, `-05`, `-09`.

## WEB-UI-FAMILY-04 — Browser-native forms and submission

- **Source:** WEB-UI-R03, WEB-UI-R07; P3/P6.
- **Actor/outcome:** a person can enter, correct, submit, and recover data without lost work or duplicate harm.
- **Applicability:** any feature collecting or confirming input.

### WEB-UI-SCENARIO-09 — Native form transaction succeeds and can be corrected

- **Primary type / role:** Good / {Good}; form floor.
- **Given/When/Then:** Given persistent labels, applicable autocomplete/input types, instructions, and constraints,
  when values are entered, reviewed where needed, submitted, and corrected, then browser behavior, validation,
  focus, messages, and authoritative completion agree.
- **Failure oracle:** a field is unlabeled, required format is hidden, or the person cannot locate/correct an error.
- **Evidence tuple:** inspect DOM/autocomplete; submit valid/invalid values; follow focus/error links.
- **Trace:** WEB-UI-R02, WEB-UI-R07; `WEB-UI-CHECK-02`, `-06`.

### WEB-UI-SCENARIO-10 — Server rejection preserves safe user work

- **Primary type / role:** Failure/recovery / {Negative, Failure/recovery}; boundary validation disagrees.
- **Given/When/Then:** Given client checks pass but the server rejects one or more values, when the response
  returns, then errors are persistently associated and summarized, focus/navigation finds them, non-sensitive
  valid input remains, and correction/resubmission is safe.
- **Failure oracle:** values disappear, error meaning is detached, or only a transient message reports failure.
- **Evidence tuple:** inject field/global rejection; inspect DOM/messages/focus/value retention; resubmit.
- **Trace:** WEB-UI-R03, WEB-UI-R07, WEB-UI-R08; `WEB-UI-CHECK-03`, `-06`, `-07`.

### WEB-UI-SCENARIO-11 — Duplicate submit races the pending state

- **Primary type / role:** Adversarial / {Adversarial, Boundary}; repeated activation.
- **Given/When/Then:** Given slow submission and repeated click/key activation or history restoration, when
  multiple attempts occur, then the interface exposes one truthful pending/retry model and the authoritative
  contract prevents duplicate harm without stranding the user.
- **Failure oracle:** repeated activation creates duplicate effects or a disabled control leaves no recovery.
- **Evidence tuple:** delay response and repeat activation; inspect client/server attempts, focus, and terminal state.
- **Trace:** WEB-UI-R03, WEB-UI-R07, WEB-UI-R08; `WEB-UI-CHECK-03`, `-06`, `-07`.

## WEB-UI-FAMILY-05 — Responsive composition and preferences

- **Source:** WEB-UI-R04, WEB-UI-R10, WEB-UI-R11; P4/P7.
- **Actor/outcome:** the accepted hierarchy and actions survive the selected variation matrix.
- **Applicability:** every visible interface.

### WEB-UI-SCENARIO-12 — Risk-based variation matrix preserves the outcome

- **Primary type / role:** Good / {Good}; adaptive floor.
- **Given/When/Then:** Given selected viewports/devices, zoom/text, content/locale, orientation, theme, contrast/
  motion preferences, and data states, when each cell is exercised live, then content order, readability,
  actions, status, and focus remain available without harmful clipping, overlap, or unexpected scrolling.
- **Failure oracle:** a required fact/action is hidden, reordered misleadingly, or cannot be operated in a cell.
- **Evidence tuple:** exercise and capture declared cells; operate actions; record browser/preferences/content.
- **Trace:** WEB-UI-R04, WEB-UI-R10; `WEB-UI-CHECK-09`, `-10`.

### WEB-UI-SCENARIO-13 — Long locale at zoom breaks the action path

- **Primary type / role:** Boundary / {Boundary, Accessibility, Locale}; compounded variation.
- **Given/When/Then:** Given the longest expected content/locale and supported zoom/text enlargement at a narrow
  viewport, when the feature is completed, then labels remain understandable, controls and errors reflow, and
  horizontal scrolling or truncation does not hide required action or meaning except where structurally needed.
- **Failure oracle:** clipping, overlap, ellipsis, or offscreen positioning removes the completion/recovery path.
- **Evidence tuple:** inject content/locale; enlarge/resize; inspect/operate full path.
- **Trace:** WEB-UI-R04, WEB-UI-R10; `WEB-UI-CHECK-09`, `-10`.

### WEB-UI-SCENARIO-14 — One polished viewport games responsive approval

- **Primary type / role:** Adversarial / {Adversarial}; capture overclaim.
- **Given/When/Then:** Given a screenshot matches the accepted design at one viewport, when unshown variation,
  focus, semantics, and interaction are requested, then the screenshot supports only captured pixels and all
  other claims remain open until owner-correct evidence exists.
- **Failure oracle:** visual similarity closes responsive, keyboard, semantic, or conformance checks.
- **Evidence tuple:** inspect capture metadata; run omitted live cells/DOM/interaction; compare claim ledger.
- **Trace:** WEB-UI-R10, WEB-UI-R11; `WEB-UI-CHECK-10`, `-11`.

## WEB-UI-FAMILY-06 — Overlays and asynchronous feedback

- **Source:** WEB-UI-R06, WEB-UI-R08; P3/P6.
- **Actor/outcome:** temporary surfaces and background changes remain understandable, controllable, and recoverable.
- **Applicability:** when an overlay, live update, or long-running action exists.

### WEB-UI-SCENARIO-15 — Overlay and async state have complete ownership

- **Primary type / role:** Good / {Good}; overlay/status floor.
- **Given/When/Then:** Given a dialog, popover, menu, toast/banner, or async action, when it opens/starts,
  updates, errors, cancels, succeeds, and closes, then trigger, label, dismissal, focus, background interaction,
  scroll, stacking, status announcement, late result, and persistent recovery follow the locked contract.
- **Failure oracle:** the person cannot find, control, exit, or recover from the temporary state.
- **Evidence tuple:** exercise all transitions and modalities; inspect DOM/tree/focus/status/scroll.
- **Trace:** WEB-UI-R06, WEB-UI-R08; `WEB-UI-CHECK-05`, `-07`.

### WEB-UI-SCENARIO-16 — Critical result exists only in a disappearing toast

- **Primary type / role:** Adversarial / {Adversarial, Failure/recovery}; transient-channel harm.
- **Given/When/Then:** Given a critical success, failure, permission, or recovery instruction appears in a toast,
  when it times out, is obscured, or is not announced, then the persistent interface still exposes the state and
  next safe action.
- **Failure oracle:** missing the transient message makes status or recovery unknowable.
- **Evidence tuple:** suppress/delay announcement and let message expire; inspect persistent state and action.
- **Trace:** WEB-UI-R03, WEB-UI-R08; `WEB-UI-CHECK-03`, `-07`.

## WEB-UI-FAMILY-07 — Browser and rendering lifecycles

- **Source:** WEB-UI-R09, WEB-UI-R10, WEB-UI-R12; P4/P6.
- **Actor/outcome:** entry and rendering lifecycles preserve semantic, visual, and state continuity.
- **Applicability:** select each lifecycle promised or activated by the application.

### WEB-UI-SCENARIO-17 — Direct entry through hydration remains coherent

- **Primary type / role:** Good / {Good, Change}; render-lifecycle floor.
- **Given/When/Then:** Given direct entry, pre/server-rendered markup, delayed client boot, and hydration where
  applicable, when the feature becomes interactive, then structure, names, content, focus, form values, route,
  and authoritative state do not reset, duplicate, or contradict.
- **Failure oracle:** the interface changes meaning, loses work/focus, flashes false state, or becomes unusable.
- **Evidence tuple:** throttle/disable client boot; inspect before/after DOM/tree/pixels/state; operate the path.
- **Trace:** WEB-UI-R09, WEB-UI-R10; `WEB-UI-CHECK-08`, `-10`.

### WEB-UI-SCENARIO-18 — Hydration mismatch silently resets local state

- **Primary type / role:** Adversarial / {Adversarial, Failure/recovery}; mismatch concealed by final DOM.
- **Given/When/Then:** Given server markup and client state differ, when hydration or route transition runs,
  then mismatches are detected and resolved without losing user input, duplicating handlers, moving focus, or
  presenting stale authority.
- **Failure oracle:** final pixels look right while the transition discarded state or attached behavior twice.
- **Evidence tuple:** inject mismatch; capture warnings/events/input/focus before and after; repeat action once.
- **Trace:** WEB-UI-R03, WEB-UI-R09, WEB-UI-R11; `WEB-UI-CHECK-03`, `-08`, `-11`.

### WEB-UI-SCENARIO-19 — History restore and duplicate initialization diverge

- **Primary type / role:** Failure/recovery / {Change, Failure/recovery}; restore boundary.
- **Given/When/Then:** Given refresh, back/forward cache or session restore, stale assets, or duplicate boot, when
  the interface resumes, then route, content, listeners, pending state, focus, and actions reconcile once with
  the parent contract and expose recovery if compatibility fails.
- **Failure oracle:** duplicate effects/listeners, stale action authority, blank UI, or unrecoverable state.
- **Evidence tuple:** exercise selected restore/asset/boot cases; inspect events/state/focus and server effects.
- **Trace:** WEB-UI-R09, WEB-UI-R10, WEB-UI-R12; `WEB-UI-CHECK-08`, `-10`, `-12`.

## WEB-UI-FAMILY-08 — Evidence integrity

- **Source:** WEB-UI-R10, WEB-UI-R11; P7/P8.
- **Actor/outcome:** a cold reviewer can resolve each interface claim to the evidence that observes it.
- **Applicability:** every run; gate.

### WEB-UI-SCENARIO-20 — Interface evidence matrix keeps claims separate

- **Primary type / role:** Good / {Good}; evidence floor.
- **Given/When/Then:** Given source, DOM/tree, operated input/focus, live adaptation, captured rendering, and
  inherited user evidence, when interface status is reported, then each claim identifies artifact,
  environment, state, freshness, owner, and limitation without crossing evidence boundaries.
- **Failure oracle:** an artifact is missing/unresolvable or generalized to a property it cannot observe.
- **Evidence tuple:** resolve every pointer; compare claim to evidence class; rerun a sample.
- **Trace:** WEB-UI-R10, WEB-UI-R11; `WEB-UI-CHECK-10`, `-11`.

### WEB-UI-SCENARIO-21 — Automated accessibility and screenshots claim conformance

- **Primary type / role:** Adversarial / {Adversarial, Counterfactual}; tool/capture overclaim.
- **Given/When/Then:** Given an automated accessibility scan is green and screenshots match, when manual
  semantics, keyboard/focus, adaptive behavior, assistive-technology operation, and representative-user status
  are inspected, then every unobserved claim remains open and any discovered failure blocks it.
- **Failure oracle:** absence of detected violations or visual mismatch is called full accessibility/design proof.
- **Evidence tuple:** inspect tool scope; run omitted owner checks; compare generic UI acceptance record.
- **Trace:** WEB-UI-R11; `WEB-UI-CHECK-11`.

## WEB-UI-FAMILY-09 — Production and framework-owner boundary

- **Source:** WEB-UI-R01, WEB-UI-R09, WEB-UI-R12; P1/P6/P8.
- **Actor/outcome:** framework integration and production completion preserve the accepted browser contract.
- **Applicability:** every implementation; framework cases when a framework is present.

### WEB-UI-SCENARIO-22 — Framework integration preserves browser outcomes

- **Primary type / role:** Good / {Good, Change}; integration floor.
- **Given/When/Then:** Given the applicable framework owns APIs and lifecycle idioms, when its components,
  routing, rendering, and state integrate the feature, then accepted semantics, states, focus, responsive
  behavior, lifecycle entries, error recovery, tests, and diagnostics are complete without child-owned API policy.
- **Failure oracle:** the production output loses a clause or the child prescribes an unowned framework idiom.
- **Evidence tuple:** trace accepted clauses to output/tests; inspect owner boundary; run lifecycle matrix.
- **Trace:** WEB-UI-R01, WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-01`, `-08`, `-12`.

### WEB-UI-SCENARIO-23 — Framework convention waives semantic behavior

- **Primary type / role:** Adversarial / {Adversarial, Change}; specialization games ownership.
- **Given/When/Then:** Given a framework convention, component library, router, or state tool is considered
  standard, when it produces generic controls, focus resets, inaccessible pending state, hydration loss, or an
  incomplete production path, then the browser contract still fails and the framework owner must correct it.
- **Failure oracle:** library usage or framework popularity stands in for verified browser behavior.
- **Evidence tuple:** inspect rendered output and operated behavior; trace parent/child ownership; reproduce gap.
- **Trace:** WEB-UI-R02, WEB-UI-R06, WEB-UI-R09, WEB-UI-R12; `WEB-UI-CHECK-02`, `-05`, `-08`, `-12`.

## Source-to-obligation ledger

| Rules | Scenarios | Reserved checks |
|---|---|---|
| WEB-UI-R01 | `01`, `03`, `22` | `01` |
| WEB-UI-R02 | `01`, `02`, `09`, `23` | `02` |
| WEB-UI-R03 | `03`–`05`, `10`, `11`, `16`, `18` | `03` |
| WEB-UI-R04 | `08`, `12`–`14` | `04`, `09` |
| WEB-UI-R05 | `02`, `06`, `08` | `04` |
| WEB-UI-R06 | `06`, `07`, `15`, `23` | `05` |
| WEB-UI-R07 | `09`–`11` | `06` |
| WEB-UI-R08 | `04`, `05`, `07`, `10`, `11`, `15`, `16` | `07` |
| WEB-UI-R09 | `17`–`19`, `22`, `23` | `08` |
| WEB-UI-R10 | `12`–`14`, `17`, `19`, `20` | `09`, `10` |
| WEB-UI-R11 | `01`, `02`, `14`, `18`, `20`, `21` | `11` |
| WEB-UI-R12 | `19`, `22`, `23` | `12` |

## Failability and omission audit

Every child rule maps to a case and reserved check; every case maps back to live policy. Native-looking generic
controls, false optimistic success, stale content, focus leaks, duplicate submit, long-locale reflow, transient
critical messages, hydration resets, one-viewport approval, automated-tool overclaim, and framework exemptions
all fail observable oracles. No screenshot or framework convention closes an unobserved property.
