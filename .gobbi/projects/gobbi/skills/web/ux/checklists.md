# Web UX Operational Checklist

**Mode:** operational. **Owner:** `web/ux`. **Consumers:** the browser-experience executor and parent web
handoff owner. Keep this versioned source unchecked. Each operational run works a fresh filled copy, identifies
the source commit and run, uses each copied box as its resolution slot, and declares the use-style shown for
each pause point.

| Pause point | When work stops | Use-style | Continue only when |
|---|---|---|---|
| `WEB-UX-PAUSE-1` — Journey lock | Before P6 builds the production journey skeleton | `read-do` | Items `01`–`04` close and every applicable gate/required item is accepted |
| `WEB-UX-PAUSE-2` — Experience proof | Before P7 runs whole-journey and measurement verification | `do-confirm` | Items `05`–`08` close and every applicable gate/required item is accepted |
| `WEB-UX-PAUSE-3` — Parent handoff | Before P8 hands experience realization to root web | `do-confirm` | Items `09`–`11` close and every applicable gate/required item is accepted |

An operational filled copy resolves each applicable item with `PASS`, `FAIL:<finding/action-id>`,
`n/a:<property>`, or `recorded-open:<owner+resolution-method>`. A filled copy may record
`waived/exception-authorized:<authority+rationale>` only for an item explicitly tagged `waiver-eligible` whose
parent rule expressly permits that exception; it is not a terminal for any other item. This source designates
no item `waiver-eligible`.
Generic UX and this child make representative-user evidence, consent/accommodations, accessibility, safety,
trust, privacy, authority, and consequential-action protection acceptance-bearing, and no child rule grants an
exception for another current gate. A waiver token on any current item is invalid and closes neither coverage
nor acceptance. Every terminal cites named inspected evidence; `n/a` requires evidence that the predicate is
false. `FAIL` takes the item's on-fail route and blocks the pause point. `recorded-open` closes coverage but
never acceptance. Coverage closes when every gate/required item has a valid terminal; acceptance requires every
applicable gate/required item to be `PASS`. Generic UX acceptance and root web gates remain independent.

### Gate resolution truth table

The result is evaluated per gate before the pause-point aggregate. An `n/a` can satisfy only a conditional
gate whose inspected predicate is false. No current gate is waiver-eligible.

| Gate | Applicability | `PASS` | `FAIL:<id>` | `recorded-open:<owner+method>` | `n/a:<property>` | waiver token |
|---|---|---|---|---|---|---|
| `WEB-UX-CHECK-04` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when identity/context is proved absent | invalid; protected authority and data integrity close neither |
| `WEB-UX-CHECK-05` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when every listed trigger is proved absent | invalid; protected safety, recovery, and effect integrity close neither |
| `WEB-UX-CHECK-07` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when consequential action is proved absent | invalid; protected informed choice and irreversible-effect safety close neither |
| `WEB-UX-CHECK-08` | unconditional | closes and satisfies | closes; blocks; take stop route | closes coverage; blocks acceptance | invalid | invalid; protected trust and privacy close neither |
| `WEB-UX-CHECK-09` | conditional | closes and satisfies when applicable | closes; blocks; take stop route | closes coverage; blocks acceptance | closes and satisfies only when generic UX is proved inapplicable | invalid; protected direct representative-user evidence closes neither |

The pause point is accepted only when every applicable gate and required item is satisfied under this table.
No waiver can satisfy a current child pause point or the downstream root release-ready aggregate.

## Outcome, navigation, and continuity gates

- [ ] `WEB-UX-CHECK-01` — **[required · `WEB-UX-PAUSE-1` · read-do · unconditional].** PASS if every production entry, step, message, decision, recovery,
  trust cue, support path, and measurement traces to an accepted generic UX clause and parent outcome, with
  browser conflicts reopened at the owner; FAIL if implementation, copy, analytics, or a framework silently
  redesigns or narrows the accepted experience. **Evidence:** accepted-clause-to-journey trace and inspected
  conflict log. **On FAIL:** open a finding and return to P1 and the earliest owner. **Source:**
  WEB-UX-R01. **Seeds:** `WEB-UX-SCENARIO-01`, `-04`, `-23`.
  **Mapped-obligation condition:** PASS additionally requires every accepted entry, state, message, decision,
  recovery, trust cue, support, measurement, and production-handoff clause to remain traceable. Evidence must
  join each accepted clause to the realized journey/effect and its owner-correct passing proof.
- [ ] `WEB-UX-CHECK-02` — **[required · `WEB-UX-PAUSE-1` · read-do · unconditional].** PASS if live journeys give direct/deep/internal entry, canonical
  URL, allowed bookmark/share, refresh, back/forward, history, multiple tabs, external return, and restore the
  intentional safe meaning selected by the project, with stale/sensitive state rejected and recoverable; FAIL
  if browser-native navigation leaks context, loses intent, repeats effect, or dead-ends. **Evidence:** operated
  URL/history/tab/return matrix reconciled to authoritative state. **On FAIL:** open a finding and return to
  P2/P6. **Source:** WEB-UX-R02. **Seeds:** `WEB-UX-SCENARIO-01`–`-03`, `-05`, `-15`, `-24`–`-26`, `-31`,
  `-35`, `-36`.
  **Mapped-obligation condition:** PASS additionally requires direct/history/tab/provider-return meaning,
  stale/wrong-context safety, route/provider/framework changes, and partial-failure recovery to preserve
  orientation and intent without leakage or repeated effect. Evidence must operate normal, stale, exact-expiry,
  old/new, mixed, failed, and recovery entries while reconciling URL/history, actor state, and effect.
- [ ] `WEB-UX-CHECK-03` — **[required · `WEB-UX-PAUSE-1` · read-do · unconditional].** PASS if every selected entry/state independently communicates
  location, reason, current status, relevant consequence, primary and alternative actions, and recovery/support
  in plain project language without relying on prior-screen memory; FAIL if a contextless, jargon-heavy,
  ambiguous, or unexplained state prevents an informed next action. **On FAIL:** return to P2/P3/P6.
  **Evidence:** content/state walkthrough plus accepted representative-task trace. **Source:** WEB-UX-R03.
  **Seeds:** `WEB-UX-SCENARIO-01`, `-04`, `-05`, `-12`, `-37`.
  **Mapped-obligation condition:** PASS additionally requires every entry and failure state, including a failed
  recovery route, to explain location, reason, status, consequence, primary/alternative action, and bounded
  recovery/support in accepted plain language. Evidence must walk each state independently without
  prior-screen memory and resolve the support owner.
- [ ] `WEB-UX-CHECK-04` — **[gate/killer · `WEB-UX-PAUSE-1` · read-do · conditional: identity, session, account, tenant, or role context exists].** PASS if sign-in/out,
  reauthentication, session expiry, authorization/role change, account/tenant switch, another tab, and external
  return retain only permissible intent/work, discard protected or stale context, explain the transition, and
  resume at the smallest safe step; FAIL if authority or data crosses contexts, or avoidable work is lost without
  explanation/recovery. **Evidence:** injected transition traces plus visible and authoritative actor/resource
  state; an `n/a` cites the inspected absence of identity/context. **On FAIL:** protected data or authority can
  cross contexts; stop release, open a blocking finding, and return to P3/P6. **Source:** WEB-UX-R04. **Seeds:**
  `WEB-UX-SCENARIO-02`, `-03`, `-06`–`-08`, `-26`–`-29`.
  **Mapped-obligation condition:** PASS additionally requires stale and exact return/session/effect boundaries,
  reauthentication, account/tenant/role/tab changes, and authority changes to preserve only permissible
  context with truthful recovery. Evidence must inject every selected transition and exact edge while
  inspecting retained/discarded work, actor/resource authority, effect count, explanation, and next step.

## Time, recovery, and consequential-action gates

- [ ] `WEB-UX-CHECK-05` — **[gate/killer · `WEB-UX-PAUSE-2` · do-confirm · conditional: one listed time, interruption, or duplicate trigger applies].** PASS if latency, progress, cancel, navigation away,
  offline/poor network, stale/partial state, suspension, retry, duplicate action, late result, multi-context
  return, and promised resumption keep truthful status, safe work/intent, and one reconciled authoritative effect;
  FAIL if waiting looks complete, work vanishes, retries repeat harm, or conflicting results strand the person.
  **Evidence:** selected fault/interruption traces reconciled to one authoritative effect; an `n/a` cites the
  trigger map. **On FAIL:** lost work or duplicate/false effect can harm users; stop release, open a blocking
  finding, and return to P3/P6. **Source:** WEB-UX-R05. **Seeds:** `WEB-UX-SCENARIO-03`, `-06`, `-07`,
  `-09`–`-11`, `-17`, `-24`, `-26`–`-28`, `-30`, `-32`, `-36`.
  **Mapped-obligation condition:** PASS additionally requires time/interruption, duplicate and late results,
  exact wait/session/confirmation edges, framework/partial-rollout failure, and multi-context return to retain
  safe work and one authoritative effect. Evidence must inject below/at/above, reordered, duplicated, suspended,
  failed, and returned states and inspect status, controls, work, effect count, and recovery. External-handoff
  trust primitives belong to CHECK-08 and are not inferred from this time/recovery gate.
- [ ] `WEB-UX-CHECK-06` — **[required · `WEB-UX-PAUSE-2` · do-confirm · unconditional].** PASS if every applicable input, permission, session, conflict,
  dependency, rate/capacity, unavailable, and unknown failure preserves safe work, explains enough without
  harmful detail or blame, offers the correct correction/retry/wait/alternate/escalation path, and gives support
  resolvable safe context; FAIL if failures collapse into a generic loop, dead end, secret request, or hidden
  repair. **Evidence:** per-class failure/recovery/support operation and resolvable diagnostic reference.
  **On FAIL:** open a finding and return to P3/P6. **Source:** WEB-UX-R06. **Seeds:**
  `WEB-UX-SCENARIO-07`, `-09`–`-13`, `-27`, `-30`, `-37`.
  **Mapped-obligation condition:** PASS additionally requires each failure class, inverted uncertainty,
  sourced wait threshold, retry route, nested recovery failure, retained-work rule, and support handoff to be
  proportional, actionable, diagnosable, and bounded. Evidence must inject each primitive, exercise its next
  action/fallback, preserve safe work/effect truth, and resolve correlation/time/owner without secrets.
- [ ] `WEB-UX-CHECK-07` — **[gate/killer · `WEB-UX-PAUSE-2` · do-confirm · conditional: the feature has a legal, financial, destructive, permission, data-sharing, or other irreversible consequence].** PASS if the journey requests only
  necessary data at the right time, supports safe defaults/autofill and review/correction, exposes cost/terms/
  consequence, applies confirmation/reauthentication proportional to risk, and provides authoritative receipt,
  reversal/dispute/support where applicable; FAIL if reduced clicks or conversion obscures informed choice,
  creates duplicate harm, or removes aftermath. **Evidence:** accepted consequential-task evidence plus
  production decision/effect/receipt/recovery trace; an `n/a` cites the consequence map. **On FAIL:** uninformed
  or unrecoverable commitment can cause material harm; stop release, open a blocking finding, and return to
  P4/P6. **Source:** WEB-UX-R07.
  **Seeds:** `WEB-UX-SCENARIO-14`, `-17`, `-32`.
  **Mapped-obligation condition:** PASS additionally requires consequential review, necessary data and
  authority, cost/terms/purpose/optionality, exact confirmation validity, one effect, receipt,
  correction/reversal/dispute, and support. Evidence must operate normal, duplicate/ambiguous, and
  below/at/above confirmation cases and reconcile authority, retained work, effect, receipt, and aftermath.
- [ ] `WEB-UX-CHECK-08` — **[gate/killer · `WEB-UX-PAUSE-2` · do-confirm · unconditional].** PASS if identity/authority, data purpose/retention/sharing,
  optional consent, permission, external domain/provider, return state, security instruction, and irreversible
  consequence are understandable at decision time, refusal/withdrawal works where required, and no deceptive
  urgency/coercion/phishing-conditioning exists; FAIL if trust relies on hidden terms, ambiguous branding,
  coerced choice, or UI-only authority. **Evidence:** trust-boundary content/choice trace plus server/network/
  privacy-control operation. **On FAIL:** deception, privacy loss, or unsafe trust is possible; stop release,
  open a blocking finding, and return to P4/P6 and the security/privacy owner.
  **Source:** WEB-UX-R08. **Seeds:** `WEB-UX-SCENARIO-02`, `-08`, `-14`–`-16`, `-29`, `-31`.
  **Mapped-obligation condition:** PASS additionally requires authority/context change, consent/refusal,
  consequential action, and old/new external-provider handoffs to keep actor, purpose, domain, request, return
  status, cancellation, suspicious mismatch, optionality, and consequence understandable and non-coercive.
  Evidence must operate normal/refuse/withdraw/cancel/mismatch/late and change paths while inspecting content,
  URL/network/privacy control, actor/resource state, effect, and recovery.

## Evidence, measurement, and production gates

- [ ] `WEB-UX-CHECK-09` — **[gate/killer · `WEB-UX-PAUSE-3` · do-confirm · conditional: generic UX is applicable].** PASS if generic UX reports acceptance
  from valid direct representative-user evidence covering or explicitly limiting material devices/browsers,
  input/assistive modes, locales, networks, auth states, interruptions, privacy, and consequential contexts,
  with consent and accommodations satisfied; FAIL if technical/internal evidence substitutes, or missing people
  and conditions are hidden instead of `NEEDS_CONTEXT`. **Evidence:** generic UX acceptance record,
  study/context matrix, consent, accommodations, and explicit limits; an `n/a` cites the inspected owner map.
  **On FAIL:** unsupported experience claims can exclude or harm users; stop production acceptance and release,
  open a blocking finding, and return to generic UX/P5. **Source:** WEB-UX-R09.
  **Seeds:** `WEB-UX-SCENARIO-18`, `-19`, `-33`.
  **Mapped-obligation condition:** PASS additionally requires direct representative evidence,
  consent/accommodations, material context limits, and narrowed acceptance when a context or ethical condition
  is removed. Evidence must compare complete and context-removed study maps and preserve `NEEDS_CONTEXT` under
  technical/internal-success probes.
- [ ] `WEB-UX-CHECK-10` — **[required · `WEB-UX-PAUSE-3` · do-confirm · unconditional].** PASS if a versioned, privacy-conscious model defines
  eligibility, exposure, entry, attempt, progress, visible and authoritative completion, failure, recovery,
  abandonment, escalation, harm, and downstream outcome with baseline, denominator, window, segments,
  exclusions, owners, client/server/provider sources, identity joins, deduplication, consent, missingness/data-
  quality checks, guardrails, and disproof conditions, and sample journeys reconcile; FAIL if a click/client
  event equals outcome or missing telemetry equals behavior. **On FAIL:** return to P5/P7. **Source:**
  WEB-UX-R10, WEB-UX-R11. **Evidence:** metric/event dictionary plus sample client/server/provider reconciliation,
  consent, deduplication, and missingness tests. **Seeds:** `WEB-UX-SCENARIO-13`, `-16`, `-20`–`-22`, `-24`,
  `-34`–`-36`.
  **Mapped-obligation condition:** PASS additionally requires support and the full outcome chain to remain
  private, versioned, joined, deduplicated, missingness-aware, exactly windowed, reconcilable under
  client/effect disagreement, and compatible through framework change/failure. Evidence must resolve safe
  support context, consent/refusal, sample joins, duplicate/missing/skew events, below/at/above windows,
  before/after framework events, and partial-failure measurement.
- [ ] `WEB-UX-CHECK-11` — **[required · `WEB-UX-PAUSE-3` · do-confirm · unconditional].** PASS if all affected production routes, entries,
  content, states, auth/session behavior, recovery/support, instrumentation, authorized experiment surfaces,
  tests, docs, and diagnostics are complete; framework idioms remain with their owner; and accepted UX,
  implementation, release, deployment, and live outcome claims remain separate with post-deployment validation
  pending until evidence exists; FAIL if prototype/mock/planned work remains or one claim implies another.
  **Evidence:** affected-surface trace, selected live-journey results, instrumentation/support resolution, and
  claim ledger. **On FAIL:** open a finding and return to P6–P8 and root web. **Source:** WEB-UX-R12.
  **Seeds:** `WEB-UX-SCENARIO-13`, `-19`, `-23`,
  `-24`, `-35`, `-36`.
  **Mapped-obligation condition:** PASS additionally requires production journey/support completeness,
  framework integration/change/recovery, generic UX acceptance status, claim separation, and live-validation
  handoff. Evidence must inspect every affected production surface, operate supported pre/post/partial journeys,
  resolve support and instrumentation, and keep deployment/live outcomes pending until their own evidence.

## Guaranteed coverage map

This check-level map is an exact projection of the authoritative case `Trace` relation.

| Check | Check policy sources | Scenario coverage |
|---|---|---|
| `01` | WEB-UX-R01 | `01`, `04`, `23` |
| `02` | WEB-UX-R02 | `01`–`03`, `05`, `15`, `24`–`26`, `31`, `35`, `36` |
| `03` | WEB-UX-R03 | `01`, `04`, `05`, `12`, `37` |
| `04` | WEB-UX-R04 | `02`, `03`, `06`–`08`, `26`–`29` |
| `05` | WEB-UX-R05 | `03`, `06`, `07`, `09`–`11`, `17`, `24`, `26`–`28`, `30`, `32`, `36` |
| `06` | WEB-UX-R06 | `07`, `09`–`13`, `27`, `30`, `37` |
| `07` | WEB-UX-R07 | `14`, `17`, `32` |
| `08` | WEB-UX-R08 | `02`, `08`, `14`–`16`, `29`, `31` |
| `09` | WEB-UX-R09 | `18`, `19`, `33` |
| `10` | WEB-UX-R10, WEB-UX-R11 | `13`, `16`, `20`–`22`, `24`, `34`–`36` |
| `11` | WEB-UX-R12 | `13`, `19`, `23`, `24`, `35`, `36` |

## Check-to-obligation union audit

This table is the reverse sweep from each reserved check to every mapped case-level obligation in
[`scenarios.md`](scenarios.md). It is an exact projection of `Trace`. The third column summarizes, but does not
replace, the actual `Mapped-obligation condition` and evidence wording inside each check item.

| Check | Scenario obligations consumed | Union preserved by the check |
|---|---|---|
| `01` | `01`, `04`, `23` | every accepted entry, state, message, decision, recovery, support, measurement, and production handoff clause remains traceable |
| `02` | `01`–`03`, `05`, `15`, `24`–`26`, `31`, `35`, `36` | direct/history/tab/return meaning, safe stale handling, route/provider/framework change, and partial failure preserve intent without leak or repeated effect |
| `03` | `01`, `04`, `05`, `12`, `37` | every entry and failure state, including a failed recovery route, independently communicates location, status, consequence, actions, and support in accepted plain language |
| `04` | `02`, `03`, `06`–`08`, `26`–`29` | stale and exact expiry/effect/return boundaries plus reauth, account, role, and authority change preserve only permissible context |
| `05` | `03`, `06`, `07`, `09`–`11`, `17`, `24`, `26`–`28`, `30`, `32`, `36` | time, interruption, duplicate/late result, exact wait/session/confirmation edges, framework failure, and return keep safe work and one effect |
| `06` | `07`, `09`–`13`, `27`, `30`, `37` | each failure, uncertainty inversion, wait threshold, retry route, nested recovery failure, retained-work rule, and support handoff is proportional and actionable |
| `07` | `14`, `17`, `32` | consequential review, exact confirmation, one effect, receipt, reversal/dispute, and support are complete |
| `08` | `02`, `08`, `14`–`16`, `29`, `31` | authority, consent, external-provider actor/purpose/domain/request/mismatch, account change, optionality, consequence, refusal, and provider change remain understandable and non-coercive |
| `09` | `18`, `19`, `33` | direct representative evidence, consent/accommodations, context limits, and claim narrowing when evidence is removed remain acceptance-bearing |
| `10` | `13`, `16`, `20`–`22`, `24`, `34`–`36` | complete versioned outcome model, privacy, joins, deduplication, missingness, exact windows, framework change/failure, support, and reconciliation |
| `11` | `13`, `19`, `23`, `24`, `35`, `36` | production journey, support, framework integration/change/recovery, accepted UX, claim separation, and live-validation handoff are complete |

Coverage closure does not prove acceptance. Every applicable copied item must pass, generic UX must report its
own accepted state, and root web release checks remain open until independently closed.
