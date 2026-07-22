# Web UI Operational Checklist

**Mode:** evaluation coverage register. **Owner:** `web/ui`. **Consumers:** executor self-review and active
evaluation. **Run use-style:** `do-confirm`. Keep this versioned source unchecked; a filled copy identifies the
source commit and run and resolves each box only as `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`, citing
named inspected evidence. Coverage closes when every copied item is terminal; acceptance requires every
applicable gate and required item to be `PASS`. Generic UI acceptance and root web checks remain independent.

## Contract and semantic gates

- [ ] `WEB-UI-CHECK-01` — **[required · do-confirm · unconditional].** PASS if every implemented region, state, interaction, and
  responsive behavior traces to an accepted generic UI clause and parent feature state, with conflicts reopened
  at the owner; FAIL if code or a component library silently redesigns, omits, or narrows a clause. **On FAIL:**
  return to P1 and the owning specification. **Evidence:** accepted-clause-to-production trace and inspected
  conflict log. **Source:** WEB-UI-R01. **Seeds:** `WEB-UI-SCENARIO-01`, `-03`,
  `-22`.
- [ ] `WEB-UI-CHECK-02` — **[gate/killer · do-confirm · unconditional].** PASS if the rendered document uses meaningful native structure
  and controls, with logical source order and correct headings, landmarks, lists/tables/forms, labels,
  descriptions, relationships, status, and accessible name/role/value/state confirmed in the DOM/accessibility
  tree; FAIL if meaning or operation exists only visually, or ARIA/generic elements imitate a native control
  incompletely. **Evidence:** source/DOM and accessibility-tree inspection plus native-control operation.
  **On FAIL:** inaccessible meaning/action can exclude users; stop release, open a blocking finding, and return
  to P2/P5. **Source:** WEB-UI-R02. **Seeds:** `WEB-UI-SCENARIO-01`, `-02`,
  `-09`, `-23`.
- [ ] `WEB-UI-CHECK-03` — **[required · do-confirm · unconditional].** PASS if every activated initial, empty, loading, partial, stale,
  invalid, disabled, pending, optimistic, success, error, recovery, unavailable, denied, and duplicate state
  has truthful visible/programmatic status and a safe next action reconciled to authoritative state; FAIL if
  states collapse, report false success, erase recoverable work, or strand the user. **On FAIL:** return to
  P2/P6. **Evidence:** injected state table reconciled to visible/programmatic and authoritative state.
  **Source:** WEB-UI-R03. **Seeds:** `WEB-UI-SCENARIO-03`–`-05`, `-10`, `-11`, `-16`, `-18`.

## Interaction and adaptation gates

- [ ] `WEB-UI-CHECK-04` — **[gate/killer · do-confirm · unconditional].** PASS if keyboard, pointer, touch, sequential/switch-like input,
  and applicable assistive technology can discover and complete equivalent outcomes, with usable targets and
  alternatives to hover, gesture, drag, or precision; FAIL if an activated modality lacks information or an
  action. **Evidence:** operated selected-modality matrix plus target/alternative inspection. **On FAIL:** an
  input-mode exclusion blocks the outcome; stop release, open a blocking finding, and return to P3/P6.
  **Source:** WEB-UI-R04, WEB-UI-R05. **Seeds:**
  `WEB-UI-SCENARIO-06`, `-08`, `-12`, `-13`.
- [ ] `WEB-UI-CHECK-05` — **[gate/killer · do-confirm · unconditional].** PASS if live operation confirms logical focus order and visible
  focus plus correct entry, validation/async result, containment, exit, and restoration, with inactive content
  neither operable nor exposed as active; FAIL if focus is lost, obscured, visually reordered, trapped
  incorrectly, or leaked behind modality. **Evidence:** live keyboard/active-element and accessibility-tree
  traces across entry/error/exit. **On FAIL:** lost or leaked focus can trap/exclude users; stop release, open a
  blocking finding, and return to P3/P6. **Source:** WEB-UI-R05,
  WEB-UI-R06. **Seeds:** `WEB-UI-SCENARIO-02`, `-06`–`-08`, `-15`, `-23`.
- [ ] `WEB-UI-CHECK-06` — **[required · do-confirm · conditional: the feature contains a form].** PASS if native form ownership, persistent
  labels, input types/autocomplete, instructions, constraints, invalid association/summary, error focus,
  retained safe input, review/correction, pending/duplicate behavior, server rejection, and recovery are
  complete and operable; FAIL if submission or correction depends on hidden format, disappearing feedback,
  lost input, or client-only truth. **Evidence:** DOM plus valid/invalid/server-rejected/duplicate operated form
  traces; an `n/a` cites the inspected absence of a form. **On FAIL:** open a finding and return to P3/P6.
  **Source:** WEB-UI-R07. **Seeds:**
  `WEB-UI-SCENARIO-09`–`-11`.
- [ ] `WEB-UI-CHECK-07` — **[required · do-confirm · conditional: an overlay or asynchronous change exists].** PASS if trigger,
  ownership, label, dismissal, escape/outside behavior, focus, inactive background, scroll, stacking, progress,
  status announcement, cancellation, late result, terminal state, and persistent recovery all match the locked
  contract; FAIL if a transient or uncontrolled surface makes state/action unknowable. **Evidence:** operated
  transition/focus/status/background traces; an `n/a` cites the inspected absence of both triggers. **On FAIL:**
  open a finding and return to P3/P6. **Source:** WEB-UI-R06, WEB-UI-R08. **Seeds:**
  `WEB-UI-SCENARIO-07`, `-10`, `-11`, `-15`, `-16`.
- [ ] `WEB-UI-CHECK-08` — **[required · do-confirm · conditional: one listed rendering lifecycle is promised or activated].** PASS if direct entry, navigation,
  refresh, back/forward, restore, pre/server-rendering, hydration, delayed/unavailable JavaScript as promised,
  stale assets, and duplicate initialization preserve semantics, state, form values, focus, events, and recovery
  in selected cases; FAIL if a lifecycle flashes false state, resets work, duplicates behavior, or strands the
  interface. **Evidence:** before/after DOM/tree/state/focus/event traces for selected lifecycle cells; an `n/a`
  cites the project lifecycle map. **On FAIL:** open a finding and return to P4/P6 and the framework owner.
  **Source:** WEB-UI-R09.
  **Seeds:** `WEB-UI-SCENARIO-17`–`-19`, `-22`, `-23`.

## Matrix, evidence, and production gates

- [ ] `WEB-UI-CHECK-09` — **[required · do-confirm · unconditional].** PASS if a sourced risk-based matrix selects browsers,
  devices/viewports, zoom/text, input/assistive modes, themes/preferences, locale/content stress, auth/data
  states, networks, and lifecycle entries and every selected cell preserves content order, readability,
  reachability, focus, status, and actions; FAIL if a plausible activated cell is silently omitted or breaks.
  **Evidence:** sourced matrix and live per-cell operation results. **On FAIL:** open a finding and return to
  P4/P7. **Source:** WEB-UI-R04, WEB-UI-R10. **Seeds:**
  `WEB-UI-SCENARIO-08`, `-12`–`-14`.
- [ ] `WEB-UI-CHECK-10` — **[required · do-confirm · unconditional].** PASS if the selected matrix was freshly exercised with live
  resizing/zoom/preferences/content plus operated actions, and every result records environment, state,
  artifact, freshness, and limitation; FAIL if one static viewport or unexecuted matrix is reported as
  coverage. **Evidence:** fresh result ledger with environment/state/artifact/freshness/limit. **On FAIL:** open
  a finding and return to P4/P7. **Source:** WEB-UI-R10.
  **Seeds:** `WEB-UI-SCENARIO-12`–`-14`, `-17`, `-19`, `-20`.
- [ ] `WEB-UI-CHECK-11` — **[required · do-confirm · unconditional].** PASS if source/static, DOM/accessibility-tree, operated
  keyboard/pointer/touch, live adaptation, captured rendering, and inherited representative-user evidence each
  support only their observable claim; FAIL if a screenshot, DOM snapshot, automated scan, framework/library,
  or direct-user observation is generalized to hidden or unobserved properties. **On FAIL:** return to P7 and
  collect owner-correct evidence. **Evidence:** resolvable interface claim-owner matrix. **Source:** WEB-UI-R11.
  **Seeds:** `WEB-UI-SCENARIO-01`, `-02`, `-14`,
  `-18`, `-20`, `-21`.
- [ ] `WEB-UI-CHECK-12` — **[gate/killer · do-confirm · unconditional].** PASS if all affected production markup/styles/
  behavior, routes, state/error bindings, tests, docs, diagnostics, and compatibility surfaces are complete,
  every framework-specific decision is owned by its framework skill, and browser outcomes pass without mocks
  or prototype behavior on the production path; FAIL if implementation is partial or framework convention
  waives the browser contract. **Evidence:** affected-surface trace, whole-interface verification, and framework
  owner record. **On FAIL:** partial or unowned production behavior can break the released interface; stop
  release, open a blocking finding, and return to P6/P8 and the owning framework skill. **Source:**
  WEB-UI-R12. **Seeds:** `WEB-UI-SCENARIO-19`, `-22`, `-23`.

## Guaranteed coverage map

| Child rule | Checks | Scenario coverage |
|---|---|---|
| WEB-UI-R01 | `01` | `01`, `03`, `22` |
| WEB-UI-R02 | `02` | `01`, `02`, `09`, `23` |
| WEB-UI-R03 | `03` | `03`–`05`, `10`, `11`, `16`, `18` |
| WEB-UI-R04 | `04`, `09` | `08`, `12`–`14` |
| WEB-UI-R05 | `04`, `05` | `02`, `06`, `08` |
| WEB-UI-R06 | `05`, `07` | `06`, `07`, `15`, `23` |
| WEB-UI-R07 | `06` | `09`–`11` |
| WEB-UI-R08 | `07` | `04`, `05`, `07`, `10`, `11`, `15`, `16` |
| WEB-UI-R09 | `08` | `17`–`19`, `22`, `23` |
| WEB-UI-R10 | `09`, `10` | `12`–`14`, `17`, `19`, `20` |
| WEB-UI-R11 | `11` | `01`, `02`, `14`, `18`, `20`, `21` |
| WEB-UI-R12 | `12` | `19`, `22`, `23` |

Coverage closure does not imply acceptance. Every applicable copied item must pass, generic UI must retain its
own accepted status, and the root web checklist must still close.
