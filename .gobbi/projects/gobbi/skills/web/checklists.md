# Web Feature Operational Checklist

**Mode:** operational. **Owner:** `web`. **Consumers:** the feature executor and release-readiness owner. This
versioned source stays unchecked. Each operational run works a fresh filled copy, records the source commit and
run identity, uses each copied box as its resolution slot, and declares the use-style shown for each pause point.

| Pause point | When work stops | Use-style | Continue only when |
|---|---|---|---|
| `WEB-PAUSE-1` — Contract lock | Before P5 starts production implementation | `read-do` | Items `01`–`05` close and every applicable gate/required item is accepted |
| `WEB-PAUSE-2` — Production completion | Before P7 treats the grown slices as production-complete | `do-confirm` | Items `06`–`08` close and every applicable gate/required item is accepted |
| `WEB-PAUSE-3` — Release-ready handoff | Before P10 publishes readiness or any external release is requested | `do-confirm` | Items `09`–`14` close and every applicable gate/required item is accepted |

An operational filled copy resolves each applicable item with `PASS`, `FAIL:<finding/action-id>`,
`n/a:<property>`, or `recorded-open:<owner+resolution-method>`. A filled copy may record
`waived/exception-authorized:<authority+rationale>` only for an item explicitly tagged `waiver-eligible` whose
parent rule expressly permits that exception; it is not a terminal for any other item. This source designates
no item `waiver-eligible`: the
root web contract grants no exception to its feature, trust, data-integrity, design-evidence, recovery, or
release-readiness gates. A waiver token on any current item is invalid and closes neither coverage nor
acceptance. Every terminal cites named inspected evidence; `n/a` requires evidence that the predicate is false.
`FAIL` takes the item's on-fail route and prevents crossing the pause point. `recorded-open` closes coverage but
never acceptance. Coverage closes when every gate/required item has a valid terminal; acceptance requires every
applicable gate/required item to be `PASS`. External deployment and live outcome validation remain separate
under WEB-R12 and WEB-R13.

### Gate resolution truth table

The result is evaluated per gate before the pause-point aggregate. An `n/a` can satisfy only a conditional
gate whose inspected predicate is false. No current gate is waiver-eligible.

| Gate | Applicability | `PASS` | `FAIL:<id>` | `recorded-open:<owner+method>` | `n/a:<property>` | waiver token |
|---|---|---|---|---|---|---|
| `WEB-CHECK-01` | unconditional | closes and satisfies | closes; blocks; take stop route | closes coverage; blocks acceptance | invalid | invalid; closes neither |
| `WEB-CHECK-03` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when the design trigger is proved absent | invalid; protected design chronology and direct evidence close neither |
| `WEB-CHECK-07` | unconditional | closes and satisfies | closes; blocks; take stop route | closes coverage; blocks acceptance | invalid | invalid; protected authority, privacy, security, and data integrity close neither |
| `WEB-CHECK-08` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when every listed trigger is proved absent | invalid; protected safety, recovery, and effect integrity close neither |
| `WEB-CHECK-12` | unconditional | closes and satisfies | closes; blocks; take stop route | closes coverage; blocks acceptance | invalid | invalid; protected release readiness closes neither |

The pause point is accepted only when every applicable gate and required item is satisfied under this table.
Coverage closure, ownership, or an invalid waiver never upgrades the aggregate to release-ready.

## Outcome, authority, and design gates

- [ ] `WEB-CHECK-01` — **[gate/killer · `WEB-PAUSE-1` · read-do · unconditional].** PASS if one complete observable feature outcome names the actors,
  trigger, entry, visible and system completion, false completion, ordinary and non-ordinary paths, states,
  effects, recovery, support, scope, and non-goals; FAIL if the unit is only a page, endpoint, component,
  schema, happy path, or expanding adjacent outcome. **Evidence:** locked D9 ledger and feature contract.
  **On FAIL:** wrong scope invalidates all downstream proof; stop implementation/release, open a blocking
  finding, and return to P1/D1–D2.
  **Source:** WEB-R01, WEB-R15. **Seeds:** `WEB-SCENARIO-01`, `-02`, `-07`.
- [ ] `WEB-CHECK-02` — **[required · `WEB-PAUSE-1` · read-do · unconditional].** PASS if an evidence-backed owner map loads `coding` and every
  applicable language/runtime/framework skill, generic `ui` then `web/ui` for an observable browser interface,
  and generic `ux` then `web/ux` for flow, content, recovery, trust, research, or measurement; FAIL if an owner
  is skipped by assertion or a child is loaded without its parent. **Evidence:** skill-load record plus
  inspected trigger/owner map. **On FAIL:** open a finding, return to P2, and load the owner.
  **Source:** WEB-R03. **Seeds:** `WEB-SCENARIO-03`, `-20`, `-24`.
- [ ] `WEB-CHECK-03` — **[gate/killer · `WEB-PAUSE-1` · read-do · conditional: a generic UI or UX trigger is present].** PASS if the applicable generic design
  specification is complete and accepted after its disposable prototype and required direct representative-user
  evidence, with consent and accommodations satisfied; FAIL if production work substitutes for design
  acceptance, or missing people/evidence is hidden instead of reported as `NEEDS_CONTEXT`. **Evidence:** accepted
  specification, disposable-prototype trace, representative-user study record, consent, and accommodations; an
  `n/a` cites the inspected owner map proving no design trigger. **On FAIL:** unaccepted design makes production
  realization unsafe; stop it, open a blocking finding, and return to P2 and the owning generic design skill.
  **Source:** WEB-R04.
  **Seeds:** `WEB-SCENARIO-03`, `-04`, `-20`, `-22`, `-29`.

## Contract and construction gates

- [ ] `WEB-CHECK-04` — **[required · `WEB-PAUSE-1` · read-do · unconditional].** PASS if the locked vertical contract marks URLs/entries, browser
  states, messages/errors, domain behavior, data/provider effects, authorization/privacy, recovery,
  instrumentation, configuration, migrations, rollout, and rollback applicable or proves their absence, while
  preserving inspected current contracts; FAIL if any needed layer or deliberate break is implicit. **Evidence:**
  vertical-contract and current-reality/affected-surface traces. **On FAIL:** open a finding and return to P1/P3.
  **Source:** WEB-R02, WEB-R05. **Seeds:** `WEB-SCENARIO-05`, `-08`, `-09`, `-23`.
- [ ] `WEB-CHECK-05` — **[required · `WEB-PAUSE-1` · read-do · unconditional].** PASS if routes, interfaces, schemas, stored state, active sessions,
  provider contracts, browser/runtime support, and framework integration remain compatible or have an explicitly
  authorized, sequenced change; FAIL if a local convention, React behavior, or new contract silently breaks an
  existing consumer. **Evidence:** compatibility matrix plus focused old/new contract tests or rehearsal.
  **On FAIL:** open a finding and return to P1/P3. **Source:** WEB-R02, WEB-R05,
  WEB-R14. **Seeds:** `WEB-SCENARIO-08`, `-10`, `-23`, `-24`, `-30`.
- [ ] `WEB-CHECK-06` — **[required · `WEB-PAUSE-2` · do-confirm · unconditional].** PASS if a smallest safe browser-to-authoritative-effect skeleton
  was verified before breadth, then normal, alternative, boundary, failure, recovery, adversarial,
  compatibility, and counterfactual slices were added with focused fresh evidence and synchronized code,
  contracts, data, config, docs, tests, and telemetry; FAIL if proof begins only after a whole-feature build or
  an affected surface lags. **Evidence:** ordered slice log with fresh commands/results and affected-surface
  updates. **On FAIL:** open a finding and return to P5/P6. **Source:** WEB-R07.
  **Seeds:** `WEB-SCENARIO-05`, `-06`, `-27`.
- [ ] `WEB-CHECK-07` — **[gate/killer · `WEB-PAUSE-2` · do-confirm · unconditional].** PASS if every trust crossing identifies untrusted input validation,
  actor/resource authorization, data CRUD/retention/export/observation, authentication/session, consent,
  privacy, abuse, secrets, third parties, and least authority, and server/domain enforcement is exercised
  independently of the intended UI; FAIL if client visibility or navigation is treated as protection.
  **Evidence:** trust/data CRUD and authorization matrices plus direct boundary tests. **On FAIL:** unauthorized
  access or data harm is possible; stop release, open a blocking security finding, and return to P3/P7.
  **Source:** WEB-R06. **Seeds:** `WEB-SCENARIO-16`–`-19`.
- [ ] `WEB-CHECK-08` — **[gate/killer · `WEB-PAUSE-2` · do-confirm · conditional: one listed failure or concurrency trigger applies].** PASS if invalid state, timeout, interruption, partial
  mutation, stale client, dependency failure, cancellation, retry, duplicate action, idempotency, concurrency,
  late result, and safe resumption have truthful terminal states and tested recovery when applicable; FAIL if
  any path reports false success, duplicates harm, strands state, or requires hidden repair. **Evidence:**
  selected failure-injection traces and authoritative terminal-state inspection; an `n/a` cites the trigger map.
  **On FAIL:** false or duplicate effects can harm users/data; stop release, open a blocking finding, and return
  to P3/P6. **Source:** WEB-R08. **Seeds:** `WEB-SCENARIO-06`, `-07`, `-09`, `-14`–`-16`, `-31`.

## Quality, evidence, and release gates

- [ ] `WEB-CHECK-09` — **[required · `WEB-PAUSE-3` · do-confirm · unconditional].** PASS if every applicable accessibility, localization, security,
  privacy, performance, resilience, cost, observability, support, browser/runtime compatibility, and data-
  integrity property has a project-owned or current evidence-based target, an owner-correct verification, and
  a recorded limitation; FAIL if a property is omitted, assigned an invented universal threshold, or inferred
  from unrelated proof. **Evidence:** sourced quality-target register plus owner-correct results/limitations.
  **On FAIL:** open a finding and return to P4/P8. **Source:** WEB-R09. **Seeds:** `WEB-SCENARIO-11`, `-12`,
  `-14`, `-17`, `-20`, `-21`, `-28`, `-31`.
- [ ] `WEB-CHECK-10` — **[required · `WEB-PAUSE-3` · do-confirm · unconditional].** PASS if every claim is supported only by its owning evidence—source,
  automated behavior, live browser, DOM/accessibility tree, captured rendering, representative-user study,
  server/data effect, performance, telemetry, or release operation—with artifact, environment, freshness, and
  limits recorded; FAIL if a screenshot, unit suite, DOM snapshot, dashboard, or opinion is generalized beyond
  what it observes. **Evidence:** resolvable claim-owner matrix with artifact/environment/freshness/limit.
  **On FAIL:** open a finding and return to P4/P8. **Source:** WEB-R10. **Seeds:** `WEB-SCENARIO-07`, `-10`,
  `-13`, `-20`, `-22`, `-26`, `-27`, `-30`.
- [ ] `WEB-CHECK-11` — **[required · `WEB-PAUSE-3` · do-confirm · unconditional].** PASS if all in-scope production code, configuration,
  migrations, provider setup, tests, documentation, instrumentation, support diagnostics, compatibility, and
  operational instructions are complete and simulated behavior is removed or explicitly isolated; FAIL if a
  mock, prototype, fixture, TODO, manual secret, or undocumented repair remains on the production path.
  **Evidence:** affected-surface inventory, production-path inspection, and fresh whole-feature verification.
  **On FAIL:** open a finding and return to P7. **Source:** WEB-R02, WEB-R11. **Seeds:**
  `WEB-SCENARIO-05`, `-23`, `-25`, `-32`.
- [ ] `WEB-CHECK-12` — **[gate/killer · `WEB-PAUSE-3` · do-confirm · unconditional].** PASS if every applicable technical, UI, UX, security,
  accessibility, performance, observability, migration, and rollback gate passes, and rollout sequencing,
  monitoring, stop conditions, partial-state handling, and tested rollback/forward-fix are resolvable by a cold
  operator; FAIL if final green tests, code rollback alone, or planned work stands in for readiness. **Evidence:**
  filled applicable checklists plus rollout/stop/partial-state and rollback rehearsal records. **On FAIL:** unsafe
  release or irrecoverable change is possible; stop release/deployment, open a blocking finding, and return to
  P7–P10. **Source:** WEB-R01, WEB-R12, WEB-R15. **Seeds:** `WEB-SCENARIO-02`, `-23`,
  `-25`, `-27`, `-32`.
- [ ] `WEB-CHECK-13` — **[required · `WEB-PAUSE-3` · do-confirm · unconditional].** PASS if implementation correctness, UI acceptance, UX
  acceptance, release readiness, deployment authority, deployment state, and post-deployment outcome validation
  are reported as distinct claims, with production outcome pending until reconciled live evidence exists; FAIL
  if any one status implies another or client telemetry alone proves an authoritative outcome. **Evidence:**
  resolvable claim ledger and reconciled sample telemetry/effect trace. **On FAIL:** open a finding and return to
  P8/P10. **Source:** WEB-R13. **Seeds:** `WEB-SCENARIO-04`, `-12`,
  `-26`, `-28`, `-29`.
- [ ] `WEB-CHECK-14` — **[required · `WEB-PAUSE-3` · do-confirm · conditional: a framework is present].** PASS if framework-specific APIs,
  lifecycle, rendering mode, routing/state library, and ecosystem idioms remain owned by the applicable
  framework skill while this feature proves only framework-independent URLs, semantics, state, recovery,
  trust, effects, evidence, and release outcomes; FAIL if the web skill invents framework policy or a framework
  convention waives a web obligation. **Evidence:** skill-owner map, source diff, and framework-independent
  outcome trace; an `n/a` cites inspected absence of a framework. **On FAIL:** open a finding and return to P2/P3.
  **Source:**
  WEB-R03, WEB-R04, WEB-R14. **Seeds:** `WEB-SCENARIO-03`, `-10`, `-24`, `-30`.

## Guaranteed coverage map

| Parent rule | Checks | Scenario coverage |
|---|---|---|
| WEB-R01, WEB-R15 | `01`, `12` | `01`, `02`, `07` |
| WEB-R02 | `04`, `05`, `11` | `08`, `23`, `32` |
| WEB-R03, WEB-R04 | `02`, `03`, `14` | `03`, `04`, `20`, `29` |
| WEB-R05 | `04`, `05` | `05`, `08`, `09` |
| WEB-R06 | `07` | `16`–`19` |
| WEB-R07 | `06` | `05`, `06`, `27` |
| WEB-R08 | `08` | `06`, `07`, `09`, `14`–`16`, `31` |
| WEB-R09 | `09` | `11`, `12`, `14`, `17`, `20`, `21`, `28`, `31` |
| WEB-R10 | `10` | `07`, `10`, `13`, `20`, `22`, `26`, `27`, `30` |
| WEB-R11 | `11` | `05`, `23`, `32` |
| WEB-R12 | `12` | `23`, `25`, `27`, `32` |
| WEB-R13 | `13` | `04`, `12`, `26`, `28`, `29` |
| WEB-R14 | `14` | `10`, `24`, `30` |

Coverage closure and acceptance are separate: this table proves every parent rule has a check and seed; it
does not prove an activated item passed. Preserve copied item wording and IDs so findings remain resolvable.
