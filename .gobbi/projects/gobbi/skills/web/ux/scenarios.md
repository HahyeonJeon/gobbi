# Web UX Scenario Set

Scenario source for [`SKILL.md`](SKILL.md). Consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises browser-experience policy without adding policy. Lifecycle:
design obligations plus implementation/evaluation coverage for one accepted feature outcome. Generic UX direct
research/prototype cases remain with [`../../ux`](../../ux/scenarios.md).

Scale: nine families and 37 cases. Sensitive research and telemetry evidence is referenced, not copied.

Family primary and secondary-category values, and case primary and coverage-role values, use the canonical
taxonomies owned by [`scenario`](../../scenario/SKILL.md). `Secondary/domain tags` add subject routing only;
they never discharge a case-type minimum.

## Coverage register

| # | Scenario category | Disposition | Carrier |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `WEB-UX-FAMILY-02`, `-08`, `-09` |
| 2 | Actors / stakeholders / use-context | selected | `WEB-UX-FAMILY-02`, `-03`, `-05`, `-07` |
| 3 | Behavior / state / data | selected | `WEB-UX-FAMILY-01`–`-06`, `-08` |
| 4 | Interfaces / dependencies / structure | selected | `WEB-UX-FAMILY-01`, `-06`, `-09` |
| 5 | Quality attributes / resource economics | selected | `WEB-UX-FAMILY-04`, `-07`, `-08` |
| 6 | Failure / recovery / operations | selected | `WEB-UX-FAMILY-01`, `-03`–`-06`, `-09` |
| 7 | Trust / harm / governance | selected | `WEB-UX-FAMILY-01`, `-03`, `-04`, `-06`, `-08` |
| 8 | Inclusion / locale | selected | `WEB-UX-FAMILY-02`, `-07` |
| 9 | Change / compatibility / reversibility | selected | `WEB-UX-FAMILY-01`, `-03`, `-06`, `-09` |
| 10 | Evidence / traceability / clarity | selected | `WEB-UX-FAMILY-02`, `-05`, `-07`–`-09` |

Every family includes a Good case and an adversarial face. External handoff, identity/session, interruption,
irreversible effect, privacy, representative-context, change, and counterfactual measurement triggers have
their own cases.

## Category × case-type matrix

`n/a` cells identify the owning family or explain why the property is absent.

| Family | Good | Alternative | Negative | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| `01` | `01` | n/a: selected entries share one browser contract | n/a: invalid input lives in `05` | `26` | `03` | `02` | `25` | n/a: URL/state is inspected |
| `02` | `04` | n/a: parent owns valid journey alternatives | n/a: invalid input lives in `05` | n/a: no finite edge | n/a: failure/recovery is owned by families `01`, `03`–`06`, and `09` | `05` | n/a: content change is parent-owned | n/a: direct entry is operated |
| `03` | `06` | n/a: identity path follows authority | n/a: unauthorized state is trust-owned | `28` | `07` | `08` | `29` | `27` |
| `04` | `09` | n/a: recovery routes share one time contract | n/a: failure classes live in `05` | `30` | `10` | `11` | n/a: lifecycle version lives in `09` | n/a: late state is injected |
| `05` | `12` | n/a: failure class selects recovery | n/a: invalid state is one selected class | n/a: capacity edge is selected in `12` | `37` | `13` | n/a: support version is evidence metadata | n/a: support resolution is exercised |
| `06` | `14` | n/a: optional choice is carried by `16` | `16` | `32` | `17` | `15` | `31` | n/a: effect is reconciled |
| `07` | `18` | n/a: contexts bound claims rather than compete | n/a: missing precondition blocks | n/a: exact participant count is study-owned | n/a: absent study conditions block design rather than trigger runtime recovery | `19` | n/a: study version is evidence metadata | `33` |
| `08` | `20` | n/a: metrics are distinct links in one chain | n/a: malformed event is data quality | `34` | n/a: pipeline recovery is operations-owned | `22` | n/a: event versions live in the dictionary | `21` |
| `09` | `23` | n/a: framework owner selects idiom | n/a: invalid input is parent-owned | n/a: finite edges live in journey families | `36` | `24` | `35` | n/a: browser outcome is operated |

## Source register and stable IDs

- `SRC-WEB-UX-PARENT` — [`SKILL.md`](SKILL.md), WEB-UX-R01–WEB-UX-R12 and P1–P8; sole child-policy owner.
- `SRC-WEB-UX-GENERIC` — generic [`ux`](../../ux/SKILL.md) accepted specification and evidence; design owner.
- `SRC-WEB-UX-ROOT` — root [`web`](../SKILL.md) outcome, effects, and release contract.
- `SRC-WEB-UX-CURRENT` — inspected routes, content, support, baseline, analytics, privacy, and data definitions.
- `SRC-WEB-UX-STANDARDS` — applicable versioned standards listed in the parent.

Case IDs are permanent `WEB-UX-SCENARIO-NN`; checklist reservations are permanent `WEB-UX-CHECK-NN`. A changed
discrimination receives a new ID.

## WEB-UX-FAMILY-01 — Entry, URL, history, and return

- **Primary category:** 4 Interfaces / dependencies / structure — URL, history, and browser-return contracts
  are the defining discrimination.
- **Secondary-category tags:** 3 Behavior / state / data; 6 Failure / recovery / operations; 7 Trust / harm /
  governance; 9 Change / compatibility / reversibility.
- **Source:** WEB-UX-R01, WEB-UX-R02; P2/P6.
- **Actor/outcome:** a person can enter and return through browser-native paths without stale, lost, or leaked
  context.
- **Applicability:** every routable feature; select promised bookmark/share and external return cases.
- **Cases:** `WEB-UX-SCENARIO-01`–`WEB-UX-SCENARIO-03`, `WEB-UX-SCENARIO-25`,
  `WEB-UX-SCENARIO-26`.

### WEB-UX-SCENARIO-01 — Browser navigation preserves journey meaning

- **Primary type / coverage-role:** Positive / {Positive}; ordinary browser navigation defines this case.
- **Secondary/domain tags:** URL, history, orientation, authoritative effect.
- **Given/When/Then:** Given direct/deep/internal entry, refresh, back/forward, and applicable bookmark/share,
  when the journey is operated, then URL/history meaning, orientation, safe state, and the next action remain
  consistent with the accepted experience and authoritative effect.
- **Failure oracle:** a browser-native action loses intent, repeats an effect, exposes sensitive state, or lands
  on a contextless/dead page.
- **Evidence tuple:** operate selected entries/history; inspect URL/state/effect; compare accepted-clause trace.
- **Obligation:** every supported entry and browser navigation action must preserve safe URL/history meaning,
  orientation, intent, authoritative effect, and a valid next action.
- **Trace:** WEB-UX-R01, WEB-UX-R02, WEB-UX-R03; `WEB-UX-CHECK-01`, `-02`, `-03`.

### WEB-UX-SCENARIO-02 — Stale or shared link poses as current authority

- **Primary type / coverage-role:** Adversarial / {Adversarial}; stale URL state intentionally attempts to
  outlive current authority; route/version change is independently discharged by scenario 25.
- **Secondary/domain tags:** trust, authorization, sensitive URLs, recovery.
- **Given/When/Then:** Given a bookmarked/shared link is expired, revoked, account-bound, or points to changed
  state, when opened directly or in another account, then protected context is not exposed, false validity is
  not shown, and an explanatory recovery/reauthentication route preserves only safe intent.
- **Failure oracle:** stale URL data grants, leaks, or visually implies current access/effect.
- **Evidence tuple:** open under expired/wrong context; inspect visible/server state and recovery.
- **Obligation:** stale, shared, expired, or wrong-context URLs must expose no protected state or false authority
  and must preserve only safe intent into recovery.
- **Trace:** WEB-UX-R02, WEB-UX-R04, WEB-UX-R08; `WEB-UX-CHECK-02`, `-04`, `-08`.

### WEB-UX-SCENARIO-03 — Multiple tabs and external return race history

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; interleaved tab/provider return
  defines recovery; the exact validity boundary is independently discharged by scenario 26.
- **Secondary/domain tags:** browser history, external provider, duplicate effect.
- **Given/When/Then:** Given the journey is open in two tabs or leaves for an external provider, when one
  context changes state and another returns late, then the feature reconciles authoritative state, avoids
  duplicate effect, explains mismatch, and offers the smallest safe continuation.
- **Failure oracle:** old tab/provider return overwrites, repeats, or falsely completes the newer outcome.
- **Evidence tuple:** interleave tab/provider actions; inspect history/session/effect; follow recovery.
- **Obligation:** interleaved tabs and provider returns must reconcile one authoritative effect, explain stale
  context, prevent duplication, and retain the smallest safe continuation.
- **Trace:** WEB-UX-R02, WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-02`, `-04`, `-05`.

### WEB-UX-SCENARIO-25 — Old and new URL contracts preserve safe entry

- **Primary type / coverage-role:** Change/regression / {Change/regression}; the explicit before/after route and
  return-contract comparison defines this case without a stale-link attacker.
- **Secondary/domain tags:** URL migration, history compatibility, external return.
- **Given/When/Then:** Given existing bookmarks, shared links, sessions, history entries, and provider return
  URLs, when the feature's route or state contract changes, then each supported old/new entry reaches the right
  current state or an explanatory safe recovery without leakage, repeated effect, or lost permissible intent.
- **Failure oracle:** a previously supported entry silently changes meaning, exposes stale context, repeats an
  effect, or becomes a dead end after the change.
- **Evidence tuple:** operate the pre-change and post-change route/return matrix; inspect URL, history, visible
  and authoritative state, and recovery; confirm compatibility or declared stop behavior.
- **Obligation:** route and return-contract changes must preserve safe meaning and recovery for supported entries.
- **Trace:** WEB-UX-R02; `WEB-UX-CHECK-02`.

### WEB-UX-SCENARIO-26 — Return state expires below, at, and above its validity edge

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact project-owned return-state validity edge
  defines this case without requiring a multi-tab or provider failure.
- **Secondary/domain tags:** return state, session history, expiry.
- **Given/When/Then:** Given a return token or browser state has a sourced validity period, when return occurs
  just before, exactly at, and just after expiry, then the valid cases resume only the permitted context and
  the first invalid case rejects stale state, explains expiry, and offers re-entry without repeating effect.
- **Failure oracle:** the first expired return is accepted, the last valid return is rejected, or either path
  leaks context or repeats work.
- **Evidence tuple:** inspect the sourced validity rule; execute below/at/above returns; inspect URL/session,
  actor/resource state, effect, explanation, and recovery.
- **Obligation:** return-state validity must be enforced exactly and fail into safe explanatory recovery.
- **Trace:** WEB-UX-R02, WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-02`, `-04`, `-05`.

## WEB-UX-FAMILY-02 — Orientation, content, and decisions

- **Primary category:** 1 Purpose / outcomes / scope — each state serving the right informed next outcome
  defines the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 8 Inclusion /
  locale; 10 Evidence / traceability / clarity.
- **Source:** WEB-UX-R01, WEB-UX-R03; P2/P6.
- **Actor/outcome:** each state is understandable without remembered hidden context.
- **Applicability:** every journey state.
- **Cases:** `WEB-UX-SCENARIO-04`, `WEB-UX-SCENARIO-05`.

### WEB-UX-SCENARIO-04 — Each state supports the next informed decision

- **Primary type / coverage-role:** Positive / {Positive}; ordinary self-sufficient orientation defines this
  case.
- **Secondary/domain tags:** content, plain language, informed decision.
- **Given/When/Then:** Given any selected entry or state, when the person encounters it without prior-screen
  memory, then location, reason, current status, relevant consequence, primary/alternative action, and support
  are clear in plain project language.
- **Failure oracle:** correct action depends on memory, jargon, hidden status, or an unexplained disabled path.
- **Evidence tuple:** content/state walkthrough; direct task evidence from accepted study; trace decisions.
- **Obligation:** each journey state must independently explain location, reason, status, consequence, primary
  and alternative actions, and recovery/support in accepted plain language.
- **Trace:** WEB-UX-R01, WEB-UX-R03; `WEB-UX-CHECK-01`, `-03`.

### WEB-UX-SCENARIO-05 — Linear happy path hides contextless recovery

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a linear presentation intentionally supplies
  context that the direct-entry journey lacks.
- **Secondary/domain tags:** content, orientation, direct entry, recovery.
- **Given/When/Then:** Given a prototype or test always starts at step one, when a later step is entered directly,
  refreshed, resumed, or reached after failure, then it must still orient the person and expose a valid next
  action without relying on the earlier narration.
- **Failure oracle:** the journey works only when viewed in the designed linear presentation order.
- **Evidence tuple:** enter each restorable step independently; inspect content/state/action; compare study task.
- **Obligation:** every direct, restored, refreshed, and failed entry must orient the person without prior-screen
  memory and provide one valid next action.
- **Trace:** WEB-UX-R02, WEB-UX-R03; `WEB-UX-CHECK-02`, `-03`.

## WEB-UX-FAMILY-03 — Identity, session, and context continuity

- **Primary category:** 6 Failure / recovery / operations — safe continuity and recovery across identity and
  session transitions define the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 7 Trust / harm /
  governance; 9 Change / compatibility / reversibility.
- **Source:** WEB-UX-R04, WEB-UX-R06; P3/P6.
- **Actor/outcome:** safe intent survives identity changes while protected context does not.
- **Applicability:** when authentication, authorization, account/tenant/role, or session exists.
- **Cases:** `WEB-UX-SCENARIO-06`–`WEB-UX-SCENARIO-08`, `WEB-UX-SCENARIO-27`–`WEB-UX-SCENARIO-29`.

### WEB-UX-SCENARIO-06 — Reauthentication resumes permissible intent

- **Primary type / coverage-role:** Positive / {Positive}; ordinary same-context reauthentication and resumption
  define this case.
- **Secondary/domain tags:** identity, session, retained intent, privacy.
- **Given/When/Then:** Given a session expires during a non-terminal journey, when reauthentication succeeds
  under the same authorized context, then safe inputs/intent and orientation resume at the smallest valid step,
  while sensitive credentials and stale authority do not persist.
- **Failure oracle:** the person repeats avoidable work or protected context survives without revalidation.
- **Evidence tuple:** expire session at each material step; reauthenticate; inspect retained/discarded state.
- **Obligation:** same-context reauthentication must preserve permissible work and orientation while removing
  credentials and stale authority, then resume at the smallest valid step.
- **Trace:** WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-04`, `-05`.

### WEB-UX-SCENARIO-07 — Expiry after action leaves ambiguous outcome

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; authentication expiry and ambiguous
  effect define recovery; counterfactual effect inversion is independently discharged by scenario 27.
- **Secondary/domain tags:** identity, session, authoritative effect, duplicate action.
- **Given/When/Then:** Given the session expires near submission, when the response is lost or reauth occurs,
  then the journey determines authoritative effect before inviting retry and explains whether completion,
  resumption, or safe repetition applies.
- **Failure oracle:** the user repeats a completed irreversible effect or is told success without proof.
- **Evidence tuple:** inject expiry before/during/after effect; reconcile state; operate recovery.
- **Obligation:** expiry near submission must determine authoritative effect before retry and explain whether
  completion, safe resumption, or repetition applies.
- **Trace:** WEB-UX-R04, WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-04`–`-06`.

### WEB-UX-SCENARIO-08 — Account or role switch reuses stale context

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a context switch intentionally attempts to reuse
  stale actor/resource authority.
- **Secondary/domain tags:** trust, authorization, account, tenant, role.
- **Given/When/Then:** Given another tab, account/tenant switch, or permission change alters authority, when the
  original journey resumes, then it validates the new actor/resource relationship, discards unsafe state,
  explains the change, and routes to a permitted outcome or support.
- **Failure oracle:** data, recipient, price, permission, or action from the prior context silently carries over.
- **Evidence tuple:** switch context mid-journey; inspect visible/server data and actor authorization; recover.
- **Obligation:** account, tenant, role, and tab context changes must revalidate actor-resource authority,
  discard unsafe state, explain the change, and route to a permitted outcome.
- **Trace:** WEB-UX-R04, WEB-UX-R08; `WEB-UX-CHECK-04`, `-08`.

### WEB-UX-SCENARIO-27 — The authoritative effect premise is inverted after reauthentication

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the premise that the effect is known
  after reauthentication is inverted without treating expiry itself as the recovery discharge.
- **Secondary/domain tags:** session, authoritative effect, retry intent.
- **Given/When/Then:** Given two otherwise identical reauthentication returns, when the authoritative effect is
  present in one and absent or unknown in the other, then the first may resume after completion while the
  second must reconcile, explain uncertainty, and withhold retry until duplication risk is resolved.
- **Failure oracle:** both returns offer the same success or retry action despite different effect truth.
- **Evidence tuple:** execute paired effect-present/effect-absent returns; inspect content, actions, effect,
  retained intent, and recovery; confirm the journeys diverge correctly.
- **Obligation:** post-reauthentication action and status must change when authoritative effect truth is inverted.
- **Trace:** WEB-UX-R04, WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-04`–`-06`.

### WEB-UX-SCENARIO-28 — Session expires before, at, and after effect commitment

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact expiry/effect-commit transition defines
  this case independently from the ambiguous-result recovery.
- **Secondary/domain tags:** session boundary, effect commit, retained intent.
- **Given/When/Then:** Given a session can expire around one authoritative commit, when expiry occurs just
  before, exactly at, and just after commitment, then authorization and effect count are correct, status is
  truthful, safe intent is retained, and the next action cannot duplicate or impersonate the effect.
- **Failure oracle:** an unauthorized edge effect occurs, a committed effect is invited again, or a valid
  pre-expiry attempt is silently lost without explanation.
- **Evidence tuple:** schedule expiry on all three sides of commit; inspect actor authorization, effect count,
  journey status, retained/discarded context, and recovery.
- **Obligation:** session/effect ordering must have one authorized, truthful, non-duplicating outcome at each edge.
- **Trace:** WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-04`, `-05`.

### WEB-UX-SCENARIO-29 — Role and account change preserve only compatible journey state

- **Primary type / coverage-role:** Change/regression / {Change/regression}; explicit before/after authority
  comparison defines this case without using a stale-context attack.
- **Secondary/domain tags:** authority change, account/tenant, compatibility.
- **Given/When/Then:** Given a journey exists before an authorized role, account, or tenant change, when it is
  resumed after the change, then state still permitted under the new actor/resource relationship is preserved,
  unsafe state is removed, content explains the difference, and recovery/support reaches a valid outcome.
- **Failure oracle:** the changed context leaks prior data/authority, loses compatible safe intent, or leaves an
  unexplained blocked state.
- **Evidence tuple:** operate the same journey before and after selected authority changes; inspect visible and
  authoritative actor/resource state, retained/discarded work, and recovery.
- **Obligation:** identity-context changes must preserve only compatible safe intent and explain every removed capability.
- **Trace:** WEB-UX-R04, WEB-UX-R08; `WEB-UX-CHECK-04`, `-08`.

## WEB-UX-FAMILY-04 — Time, interruption, stale state, and retry

- **Primary category:** 6 Failure / recovery / operations — interruption, containment, and safe resumption
  define the family.
- **Secondary-category tags:** 3 Behavior / state / data; 5 Quality attributes / resource economics; 7 Trust /
  harm / governance.
- **Source:** WEB-UX-R05, WEB-UX-R06; P3/P6.
- **Actor/outcome:** waiting and interruption retain truthful status and safe control.
- **Applicability:** select each triggered latency/network/suspension/duplicate state.
- **Cases:** `WEB-UX-SCENARIO-09`–`WEB-UX-SCENARIO-11`, `WEB-UX-SCENARIO-30`.

### WEB-UX-SCENARIO-09 — Interrupted journey resumes without repeated work

- **Primary type / coverage-role:** Positive / {Positive}; ordinary interruption and safe return define this
  case.
- **Secondary/domain tags:** latency, offline, retained work, authoritative effect.
- **Given/When/Then:** Given slow work, navigation away, refresh, tab suspension, poor network, or offline state,
  when the person returns, then status distinguishes waiting/failed/completed, safe work and intent persist,
  cancellation/retry/resume are available as applicable, and authoritative state is reconciled first.
- **Failure oracle:** progress is lost, waiting looks complete, or the next action can repeat harm.
- **Evidence tuple:** inject selected interruptions; return; inspect retained state/status/effect and recover.
- **Obligation:** latency and interruption must preserve truthful status, safe work and intent, cancellation or
  retry/resume controls, and authoritative reconciliation before another effect.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

### WEB-UX-SCENARIO-10 — Offline retry receives a late original result

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; out-of-order original and retry
  results define recovery; the sourced wait-threshold boundary is independently discharged by scenario 30.
- **Secondary/domain tags:** offline, retry, duplicate effect, late result.
- **Given/When/Then:** Given a request appears lost and the person retries after reconnecting, when the original
  and retry resolve out of order, then one authoritative outcome is shown, duplicates are prevented or
  reconciled, and the person can inspect/recover without hidden repair.
- **Failure oracle:** conflicting visible results, duplicate effect, or permanent pending state.
- **Evidence tuple:** reorder responses; inspect events/effect/status; follow receipt or correction path.
- **Obligation:** out-of-order original and retry results must converge on one authoritative outcome, prevent or
  reconcile duplicates, and retain an inspectable recovery path.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

### WEB-UX-SCENARIO-11 — “Try again” loops without diagnosis or exit

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a generic retry loop intentionally hides a
  non-retryable condition; ordinary and injected recovery are independently discharged by scenarios 09–10.
- **Secondary/domain tags:** recovery, support, failure taxonomy.
- **Given/When/Then:** Given permission, conflict, dependency, capacity, or unknown failure, when the interface
  emits one generic retry action, then each non-retryable or repeated condition must instead explain the safe
  next action, wait/alternate path, support/escalation, or ownership.
- **Failure oracle:** repeated retry cannot change the condition and no support or safe exit exists.
- **Evidence tuple:** inject distinct failures and repeat; inspect message/action/escalation and retained work.
- **Obligation:** each retryable and non-retryable failure class must expose the right next action, safe exit or
  escalation, ownership, and retained work instead of a generic loop.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

### WEB-UX-SCENARIO-30 — Waiting crosses the sourced status threshold

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact project-owned waiting/status threshold
  defines this case without injecting an offline or out-of-order failure.
- **Secondary/domain tags:** latency, progress, cancellation, support.
- **Given/When/Then:** Given a sourced wait threshold changes required status or control, when work completes
  just before, exactly at, and just after it, then visible status stays truthful, required progress/cancel/
  alternate/support controls appear at the right transition, and no path reports completion early.
- **Failure oracle:** the threshold changes state one step early/late, waiting looks complete, or the long-wait
  case has no control or recovery.
- **Evidence tuple:** inspect the sourced threshold; execute below/at/above durations; inspect content, controls,
  authoritative effect, telemetry, and next action.
- **Obligation:** sourced wait thresholds must change status and controls exactly without false completion.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

## WEB-UX-FAMILY-05 — Failure, recovery, and support ownership

- **Primary category:** 6 Failure / recovery / operations — actionable recovery and diagnosable support
  ownership define the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 10 Evidence /
  traceability / clarity.
- **Source:** WEB-UX-R03, WEB-UX-R06; P3/P7.
- **Actor/outcome:** failures are distinguishable enough to enable safe correction or escalation.
- **Applicability:** every feature; exact failure classes are evidence-selected.
- **Cases:** `WEB-UX-SCENARIO-12`, `WEB-UX-SCENARIO-13`, `WEB-UX-SCENARIO-37`.

### WEB-UX-SCENARIO-12 — Failure class produces an actionable recovery

- **Primary type / coverage-role:** Positive / {Positive}; ordinary handled failure and recovery define this
  case.
- **Secondary/domain tags:** failure taxonomy, retained work, support.
- **Given/When/Then:** Given input, permission, session, conflict, dependency, capacity, unavailable, and unknown
  failures that apply, when each occurs, then the experience preserves safe work, communicates enough without
  harmful detail, offers the correct next action, and makes support ownership/resolvable diagnostics available.
- **Failure oracle:** a failure is indistinguishable, blames the person, leaks details, or reaches a dead end.
- **Evidence tuple:** inject each class; inspect content/action/work/support; complete recovery where possible.
- **Obligation:** each applicable failure class must preserve safe work, explain enough without harm, provide a
  proportional recovery action, and expose resolvable support ownership.
- **Trace:** WEB-UX-R03, WEB-UX-R06; `WEB-UX-CHECK-03`, `-06`.

### WEB-UX-SCENARIO-13 — Support receives no resolvable context

- **Primary type / coverage-role:** Adversarial / {Adversarial}; an unresolvable support handoff intentionally
  defeats recovery.
- **Secondary/domain tags:** operations, support, observability, privacy.
- **Given/When/Then:** Given self-recovery cannot finish, when the person uses support/escalation, then a safe
  correlation reference, state, timing, and ownership route let support diagnose without asking for secrets or
  forcing the person to reconstruct hidden technical context.
- **Failure oracle:** support cannot correlate the incident or requests sensitive data/screenshots as a workaround.
- **Evidence tuple:** follow support route; resolve reference in diagnostics; inspect data minimization.
- **Obligation:** support escalation must carry a safe resolvable correlation, state, time, and owner without
  asking for secrets or hidden technical reconstruction.
- **Trace:** WEB-UX-R06, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-06`, `-10`, `-11`.

### WEB-UX-SCENARIO-37 — The selected recovery route also fails

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; a second fault in the selected
  recovery route defines this case without treating ordinary handled failure or a hostile support handoff as
  recovery evidence.
- **Secondary/domain tags:** nested dependency failure, retained work, fallback ownership.
- **Given/When/Then:** Given an applicable primary failure has selected a safe correction, retry, alternate, or
  escalation route, when that route becomes unavailable, times out, or rejects the preserved state, then the
  journey keeps truthful status and safe work, prevents repeated effect, explains the changed condition, and
  offers the next bounded fallback or resolvable support owner.
- **Failure oracle:** failure of the recovery route discards work, repeats an effect, loops the same unavailable
  action, reports completion, or leaves no owned fallback.
- **Evidence tuple:** inject a primary failure and then a distinct recovery-route fault; inspect content,
  retained state, effect count, retry/alternate/escalation controls, correlation, and terminal outcome.
- **Obligation:** a failed recovery route must preserve safe work and truthful effect state while progressing
  to a bounded fallback or resolvable support owner without looping or repeated harm.
- **Trace:** WEB-UX-R03, WEB-UX-R06; `WEB-UX-CHECK-03`, `-06`.

## WEB-UX-FAMILY-06 — Trust, privacy, and consequential action

- **Primary category:** 7 Trust / harm / governance — informed authority, privacy, and consequential-action
  safeguards define the family.
- **Secondary-category tags:** 3 Behavior / state / data; 4 Interfaces / dependencies / structure; 6 Failure /
  recovery / operations; 9 Change / compatibility / reversibility.
- **Source:** WEB-UX-R07, WEB-UX-R08; P4/P6.
- **Actor/outcome:** a person understands and controls meaningful consequence before commitment and after effect.
- **Applicability:** trust boundary always; permission/consent/provider/irreversible cases when triggered.
- **Cases:** `WEB-UX-SCENARIO-14`–`WEB-UX-SCENARIO-17`, `WEB-UX-SCENARIO-31`,
  `WEB-UX-SCENARIO-32`.

### WEB-UX-SCENARIO-14 — Informed transaction supports correction and aftermath

- **Primary type / coverage-role:** Positive / {Positive}; ordinary informed consequential action and aftermath
  define this case.
- **Secondary/domain tags:** trust, privacy, cost, irreversible action.
- **Given/When/Then:** Given a legal, financial, destructive, permission, or data-sharing decision, when the
  person reviews and commits, then necessary data, identity/authority, cost/terms/purpose, consequence, optional
  choice, confirmation proportional to risk, receipt, and reversal/dispute/support are understandable and
  consistent with the authoritative effect.
- **Failure oracle:** commitment occurs before consequence is legible or aftermath has no proof/recovery route.
- **Evidence tuple:** walkthrough accepted study contexts; inspect transaction/effect/receipt/recovery trace.
- **Obligation:** consequential action must expose necessary data, authority, cost/terms/purpose, optionality,
  review, proportional confirmation, authoritative receipt, and aftermath before and after commitment.
- **Trace:** WEB-UX-R07, WEB-UX-R08; `WEB-UX-CHECK-07`, `-08`.

### WEB-UX-SCENARIO-15 — External handoff trains unsafe trust

- **Primary type / coverage-role:** Adversarial / {Adversarial}; an external-domain handoff intentionally
  creates unsafe trust confusion; provider-contract change is independently discharged by scenario 31.
- **Secondary/domain tags:** trust, phishing resistance, external provider, URL.
- **Given/When/Then:** Given the journey redirects to or embeds an identity/payment/provider domain, when the
  transition and return occur, then who acts, why, requested data/permission, expected domain, return status,
  cancellation, and suspicious mismatch are clear without asking the person to ignore browser security signals.
- **Failure oracle:** ambiguous branding/domain, secret-copy instructions, or return success without provider
  reconciliation conditions phishing or false completion.
- **Evidence tuple:** operate normal/cancel/mismatch/late return; inspect content/URL/effect and safe exit.
- **Obligation:** external handoff must make actor, purpose, domain, request, return status, cancellation, and
  suspicious mismatch understandable without training unsafe trust.
- **Trace:** WEB-UX-R02, WEB-UX-R05, WEB-UX-R08; `WEB-UX-CHECK-02`, `-05`, `-08`.

### WEB-UX-SCENARIO-16 — Consent is coerced or analytics ignores refusal

- **Primary type / coverage-role:** Negative / {Negative}; refusal and withdrawal exercise safe rejection of
  non-essential collection.
- **Secondary/domain tags:** trust, privacy, consent, analytics.
- **Given/When/Then:** Given non-essential collection or sharing requires choice, when the person refuses,
  withdraws, or uses privacy controls, then the core experience follows governing requirements, non-essential
  events stop, the choice persists appropriately, and no deceptive friction or repeated pressure appears.
- **Failure oracle:** refusal blocks unrelated outcome, darkens/obscures the alternative, or tracking continues.
- **Evidence tuple:** exercise refuse/withdraw/privacy-control paths; inspect event/network/state and content.
- **Obligation:** optional consent refusal and withdrawal must work without coercive friction, persist as
  required, and stop non-essential collection while preserving the governed core experience.
- **Trace:** WEB-UX-R08, WEB-UX-R11; `WEB-UX-CHECK-08`, `-10`.

### WEB-UX-SCENARIO-17 — Duplicate irreversible action lacks receipt or dispute

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; ambiguous irreversible effect defines
  recovery; the exact confirmation boundary is independently discharged by scenario 32.
- **Secondary/domain tags:** trust, financial/legal harm, receipt, dispute.
- **Given/When/Then:** Given repeated activation or ambiguous network result around an irreversible effect, when
  authoritative state is reconciled, then one effect, clear receipt/status, correction/reversal/dispute route,
  and support reference exist.
- **Failure oracle:** duplicated harm, ambiguous ownership, or no aftermath route.
- **Evidence tuple:** repeat/reorder action; inspect effect/receipt/history/support; exercise dispute/recovery.
- **Obligation:** ambiguous or repeated irreversible action must reconcile one effect and provide clear status,
  receipt, correction/reversal/dispute, and support context.
- **Trace:** WEB-UX-R05, WEB-UX-R07; `WEB-UX-CHECK-05`, `-07`.

### WEB-UX-SCENARIO-31 — Provider trust contract changes without confusing identity or return

- **Primary type / coverage-role:** Change/regression / {Change/regression}; explicit before/after provider
  domain, terms, permission, and return comparison defines this case without a phishing-style attacker.
- **Secondary/domain tags:** provider change, trust content, return compatibility.
- **Given/When/Then:** Given a supported identity, payment, or permission provider changes domain, branding,
  requested data, terms, or return semantics, when the journey moves from old to new, then identity, purpose,
  request, consequence, cancellation, return status, receipts, and safe mismatch handling remain understandable
  and compatible with the authoritative effect.
- **Failure oracle:** the changed handoff looks like another actor, expands permission silently, loses return
  intent, or reports completion without provider reconciliation.
- **Evidence tuple:** operate old/new normal, cancel, mismatch, and late return; inspect URL/content/request,
  effect, receipt, and recovery; compare accepted trust clauses.
- **Obligation:** provider contract changes must preserve informed trust, safe return, and effect reconciliation.
- **Trace:** WEB-UX-R02, WEB-UX-R08; `WEB-UX-CHECK-02`, `-08`.

### WEB-UX-SCENARIO-32 — Confirmation validity crosses the irreversible-effect edge

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact project-owned confirmation or
  reauthentication validity edge defines this case without an ambiguous network result.
- **Secondary/domain tags:** consequential action, confirmation, receipt.
- **Given/When/Then:** Given a consequential commitment requires current confirmation or reauthentication, when
  commitment occurs just before, exactly at, and just after validity expires, then only authorized valid cases
  can create one effect, the first invalid case returns to proportional confirmation with work preserved, and
  no receipt or success is shown for a rejected effect.
- **Failure oracle:** an expired confirmation creates an effect, a valid edge is rejected without recovery, or
  repeating confirmation duplicates the commitment.
- **Evidence tuple:** inspect the sourced validity rule; execute below/at/above commits; inspect authority,
  effect count, retained work, content, and receipt/recovery.
- **Obligation:** consequential confirmation must enforce its exact validity edge before one authoritative effect.
- **Trace:** WEB-UX-R05, WEB-UX-R07; `WEB-UX-CHECK-05`, `-07`.

## WEB-UX-FAMILY-07 — Representative web contexts

- **Primary category:** 2 Actors / stakeholders / use-context — represented people and material web contexts
  define the family.
- **Secondary-category tags:** 5 Quality attributes / resource economics; 8 Inclusion / locale; 10 Evidence /
  traceability / clarity.
- **Source:** WEB-UX-R09; P1/P5/P7.
- **Actor/outcome:** design claims remain bounded to direct evidence from materially relevant contexts.
- **Applicability:** every design acceptance; gate.
- **Cases:** `WEB-UX-SCENARIO-18`, `WEB-UX-SCENARIO-19`, `WEB-UX-SCENARIO-33`.

### WEB-UX-SCENARIO-18 — Accepted evidence covers material web contexts

- **Primary type / coverage-role:** Positive / {Positive}; ordinary direct evidence across material contexts
  defines this case.
- **Secondary/domain tags:** accessibility, locale, representative users, consent, accommodations.
- **Given/When/Then:** Given the feature risk and population, when design acceptance is inspected, then direct
  representative-user evidence covers or explicitly limits material device/browser, input/assistive, locale,
  network, auth, interruption, privacy, and consequential contexts under valid consent/accommodation conditions.
- **Failure oracle:** a material claim has no representative context or an absent context is generalized over.
- **Evidence tuple:** resolve study/prototype records; map participants/tasks/contexts; inspect limitations.
- **Obligation:** experience claims must be bounded to valid direct evidence from every material represented
  web context, with consent, accommodations, and explicit limits.
- **Trace:** WEB-UX-R09; `WEB-UX-CHECK-09`.

### WEB-UX-SCENARIO-19 — Green lab journey masks missing people and conditions

- **Primary type / coverage-role:** Adversarial / {Adversarial}; technical success intentionally stands in for
  absent representative evidence; a context-claim inversion is independently discharged by scenario 33.
- **Secondary/domain tags:** representative users, consent, accommodations, context limits.
- **Given/When/Then:** Given automated journeys and internal demos succeed, when representative-user evidence,
  consent, accommodations, or material web contexts are absent, then design acceptance remains
  `NEEDS_CONTEXT` and root release readiness stays blocked.
- **Failure oracle:** internal/automated success is used as a proxy for direct representative evidence.
- **Evidence tuple:** compare technical artifacts to generic UX gate; identify absent people/contexts/conditions.
- **Obligation:** missing representative people, contexts, consent, or accommodations must keep design at
  `NEEDS_CONTEXT` regardless of technical or internal success.
- **Trace:** WEB-UX-R09, WEB-UX-R12; `WEB-UX-CHECK-09`, `-11`.

### WEB-UX-SCENARIO-33 — A material context is removed from an otherwise identical claim

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the premise that represented contexts
  bound the claim is inverted without using technical success to game acceptance.
- **Secondary/domain tags:** representative context, claim boundary, evidence limits.
- **Given/When/Then:** Given two acceptance claims use the same task and prototype evidence, when one removes a
  material device, assistive, locale, network, auth, interruption, privacy, or consequential context from its
  direct evidence, then that claim must narrow or remain `NEEDS_CONTEXT` while the fully evidenced claim may
  retain its supported scope.
- **Failure oracle:** both claims keep the same population/context scope after material evidence is removed.
- **Evidence tuple:** compare paired context/study maps; remove one material context; inspect claim limits,
  acceptance state, and root readiness consequence.
- **Obligation:** experience claim scope must change when a material representative context is removed.
- **Trace:** WEB-UX-R09; `WEB-UX-CHECK-09`.

## WEB-UX-FAMILY-08 — Measurement validity and privacy

- **Primary category:** 10 Evidence / traceability / clarity — falsifiable, reconcilable outcome proof defines
  the family.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 3 Behavior / state / data; 5 Quality attributes /
  resource economics; 7 Trust / harm / governance.
- **Source:** WEB-UX-R10, WEB-UX-R11; P5/P7.
- **Actor/outcome:** outcome claims are defined, privacy-conscious, reconcilable, and falsifiable.
- **Applicability:** every feature; production outcome remains pending before live data.
- **Cases:** `WEB-UX-SCENARIO-20`–`WEB-UX-SCENARIO-22`, `WEB-UX-SCENARIO-34`.

### WEB-UX-SCENARIO-20 — Measurement model distinguishes the outcome chain

- **Primary type / coverage-role:** Positive / {Positive}; ordinary resolvable outcome measurement defines this
  case.
- **Secondary/domain tags:** measurement, privacy, data quality, authoritative outcome.
- **Given/When/Then:** Given population/exposure/attempt/progress/visible and authoritative completion/failure/
  recovery/abandonment/escalation/harm/downstream outcomes, when the plan is inspected, then definitions,
  denominator, window, segments, exclusions, baseline, owners, versions, privacy, joins, deduplication, data-
  quality checks, guardrails, and disproof conditions are resolvable.
- **Failure oracle:** a metric changes meaning across surfaces or cannot distinguish opportunity from attempt/effect.
- **Evidence tuple:** resolve dictionary/schemas/queries; replay sample journey; reconcile expected events/effect.
- **Obligation:** the measurement model must define and reconcile the complete outcome chain, owners,
  denominator/window/segments, privacy, data quality, guardrails, and disproof conditions.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

### WEB-UX-SCENARIO-21 — Client completion disagrees with authoritative effect

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the premise that favorable client
  telemetry equals authoritative effect is inverted; deliberate denominator gaming remains scenario 22.
- **Secondary/domain tags:** measurement, authoritative effect, data quality.
- **Given/When/Then:** Given the browser emits completion but the server/data/provider effect is absent, reversed,
  duplicated, or belongs to another context, when metrics reconcile, then authoritative completion fails,
  instrumentation is corrected, and the user-facing discrepancy is investigated.
- **Failure oracle:** a click, route, toast, or client event is accepted as the completed outcome.
- **Evidence tuple:** join client/server/effect by bounded identity/version; inspect mismatch and correction.
- **Obligation:** authoritative outcome metrics must fail and instrumentation must be corrected when client
  completion disagrees with the server/data/provider effect.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

### WEB-UX-SCENARIO-22 — Missing or blocked analytics is labeled abandonment

- **Primary type / coverage-role:** Adversarial / {Adversarial}; missingness intentionally games the denominator;
  the exact measurement-window edge is independently discharged by scenario 34.
- **Secondary/domain tags:** analytics, privacy, data quality, observability.
- **Given/When/Then:** Given consent refusal, blocking, offline state, event delay/duplication, version skew, or
  join failure, when the metric is computed, then missingness/data quality is separated from user abandonment,
  privacy choice is honored, and uncertainty limits the claim.
- **Failure oracle:** unobserved people are classified as failure/success or silently removed from denominator.
- **Evidence tuple:** suppress/delay/duplicate/version events; inspect pipeline, denominator, and reported limit.
- **Obligation:** consent refusal, blocking, delay, duplication, skew, and join failure must remain data quality
  or missingness and never be silently classified as user behavior.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

### WEB-UX-SCENARIO-34 — Event time sits before, at, and after the measurement window

- **Primary type / coverage-role:** Boundary / {Boundary}; the exact denominator/window cutoff defines this
  case without intentionally hiding events or gaming missingness.
- **Secondary/domain tags:** measurement window, late event, denominator, data quality.
- **Given/When/Then:** Given the metric dictionary owns a time window and late-event rule, when the same valid
  event arrives just before, exactly at, and just after the cutoff, then inclusion, lateness, denominator,
  authoritative reconciliation, and reported uncertainty follow one explicit rule without double counting.
- **Failure oracle:** the edge event is counted twice or inconsistently, the first late event is labeled user
  abandonment, or the last in-window event disappears.
- **Evidence tuple:** inspect the versioned window rule; inject below/at/above event times; inspect pipeline,
  denominator, joins, outcome classification, and reported limits.
- **Obligation:** measurement windows must classify edge and late events exactly without converting data quality into behavior.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

## WEB-UX-FAMILY-09 — Production and framework-owner boundary

- **Primary category:** 9 Change / compatibility / reversibility — production and framework integration must
  preserve the accepted journey across change.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 4 Interfaces / dependencies / structure; 6 Failure
  / recovery / operations; 10 Evidence / traceability / clarity.
- **Source:** WEB-UX-R01, WEB-UX-R12; P6/P8.
- **Actor/outcome:** production routes, content, state, support, and measurement preserve accepted experience.
- **Applicability:** every implementation; framework case when present.
- **Cases:** `WEB-UX-SCENARIO-23`, `WEB-UX-SCENARIO-24`, `WEB-UX-SCENARIO-35`,
  `WEB-UX-SCENARIO-36`.

### WEB-UX-SCENARIO-23 — Production journey and handoff are complete

- **Primary type / coverage-role:** Positive / {Positive}; ordinary production journey completion defines this
  case; the framework change comparison is independently discharged by scenario 35.
- **Secondary/domain tags:** production completeness, framework ownership, measurement handoff.
- **Given/When/Then:** Given accepted experience clauses and applicable framework owners, when the feature is
  handed to root web evaluation, then all affected routes, entries, content, identity/session, recovery/support,
  instrumentation, tests/docs/diagnostics, context limits, and post-deployment validation plan are complete,
  while claim states remain separate.
- **Failure oracle:** prototype/mocks/TODOs or a planned event/support route remain on the production journey.
- **Evidence tuple:** trace clauses to production/evidence; operate selected journey; resolve cold handoff.
- **Obligation:** the production journey must complete every accepted route, content, identity, recovery,
  support, measurement, test, document, diagnostic, and claim-separation handoff obligation.
- **Trace:** WEB-UX-R01, WEB-UX-R12; `WEB-UX-CHECK-01`, `-11`.

### WEB-UX-SCENARIO-24 — Router convention breaks history or intent

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a router convention intentionally attempts to
  waive browser journey outcomes; change and failure/recovery are isolated in scenarios 35 and 36.
- **Secondary/domain tags:** framework ownership, URL, history, sensitive state, measurement.
- **Given/When/Then:** Given a framework router/state convention is standard, when it loses deep-link intent,
  makes back repeat an effect, stores sensitive state in a URL, resets recovery, or distorts measurement, then
  the experience fails and the framework owner must correct integration without narrowing this contract.
- **Failure oracle:** convention/library usage substitutes for operated browser journey and authoritative effect.
- **Evidence tuple:** exercise direct/history/restore cases; inspect state/effect/events; trace owner boundary.
- **Obligation:** framework routing/state conventions must preserve deep-link intent, safe history, sensitive
  state, recovery, authoritative effect, and measurement instead of waiving them.
- **Trace:** WEB-UX-R02, WEB-UX-R05, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-02`, `-05`, `-10`, `-11`.

### WEB-UX-SCENARIO-35 — Framework routing change preserves the accepted journey

- **Primary type / coverage-role:** Change/regression / {Change/regression}; explicit pre/post framework-router
  comparison defines this case without using ordinary completion or convention gaming as the discharge.
- **Secondary/domain tags:** framework change, URL/history, measurement compatibility.
- **Given/When/Then:** Given the framework owner changes router or state integration, when the same accepted
  journey is operated before and after, then direct/deep entry, history, retained intent, identity transition,
  recovery, authoritative effect, support, and metric semantics remain compatible.
- **Failure oracle:** the change loses or duplicates an outcome while framework-local checks remain green.
- **Evidence tuple:** compare pre/post journey and event/effect traces across selected entries and failures;
  inspect framework owner record; confirm every child outcome.
- **Obligation:** framework routing/state changes must preserve every browser journey and measurement outcome.
- **Trace:** WEB-UX-R02, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-02`, `-10`, `-11`.

### WEB-UX-SCENARIO-36 — Partial framework rollout leaves the journey stranded

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; partial integration failure defines
  this case without a framework-authority attack.
- **Secondary/domain tags:** partial rollout, journey recovery, framework integration.
- **Given/When/Then:** Given old and new framework routes or state handlers are partly active, when a selected
  path fails or a stop condition fires, then the journey explains current status, preserves safe intent,
  prevents repeated effects, and provides a tested rollback/forward-fix or support route with coherent events.
- **Failure oracle:** partial rollout causes a dead end, false completion, lost work, repeated effect, or
  measurement that cannot distinguish the failure.
- **Evidence tuple:** inject supported partial states; operate entry, failure, and recovery; inspect URL/history,
  content, intent, effect, support, events, and terminal state.
- **Obligation:** failed partial framework rollout must retain a truthful safe journey recovery and measurement path.
- **Trace:** WEB-UX-R02, WEB-UX-R05, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-02`, `-05`, `-10`, `-11`.

## Multi-role construction audit

Each original multi-role case was challenged with a dedicated single-type construction. Every secondary
discrimination was independently constructible or already had a distinct case, so no n-ary record remains.

| Original case | Attempted secondary construction | Disposition |
|---|---|---|
| `02` | compare supported URL contracts before/after without a stale-link attacker | keep Adversarial on `02`; append Change/regression `25` |
| `03` | cross an exact return-state validity edge without tab/provider failure | keep Failure/recovery on `03`; append Boundary `26` |
| `07` | invert effect truth after reauthentication without using expiry as recovery | keep Failure/recovery on `07`; append Counterfactual `27`; append missing triggered Boundary `28` and Change/regression `29` |
| `10` | cross a sourced wait threshold without out-of-order response failure | keep Failure/recovery on `10`; append Boundary `30` |
| `11` | ordinary late-result recovery is already independently exercised by `10` | keep Adversarial on `11`; use existing Failure/recovery `10` |
| `15` | compare old/new provider trust contracts without phishing-style confusion | keep Adversarial on `15`; append Change/regression `31` |
| `17` | cross confirmation validity without an ambiguous network result | keep Failure/recovery on `17`; append Boundary `32` |
| `19` | remove one material represented context without a technical-success proxy | keep Adversarial on `19`; append Counterfactual `33` |
| `21` | deliberate denominator gaming is already independently exercised by `22` | keep Counterfactual on `21`; use existing Adversarial `22` |
| `22` | exercise an exact measurement-window cutoff without hiding events | keep Adversarial on `22`; append Boundary `34` |
| `23` | compare framework journeys before/after without using ordinary completion as change evidence | keep Positive on `23`; append Change/regression `35` |
| `24` | framework version comparison and partial-rollout failure are independent of convention gaming | keep Adversarial on `24`; append Change/regression `35` and Failure/recovery `36` |

The gaming probe rejected relabeled clones. Each appended case changes the trigger, manipulated variable, and
failure oracle. The audit also corrected four matrix-only false discharges: family 02 has no local
failure/recovery trigger, family 05 now has the dedicated failure case `37`, family 07 has no runtime-recovery
trigger, and family 09 now has the dedicated failure case `36`.

## Source → scenario → obligation → check ledger

The obligation column exposes the semantic union of the explicit case-level `Obligation` fields. The reserved
check must preserve that whole union; a scenario reference alone is not the bridge.

| Rules | Scenarios | Exposed obligation union | Reserved checks |
|---|---|---|---|
| WEB-UX-R01 | `01`, `04`, `23` | accepted journey clauses remain traceable through every entry/state and the production handoff | `01` |
| WEB-UX-R02 | `01`–`03`, `05`, `15`, `24`–`26`, `31`, `35`, `36` | safe URL/history meaning, direct orientation, external return, route/provider/framework change, and partial-failure recovery preserve intent without repeated effect | `02` |
| WEB-UX-R03 | `01`, `04`, `05`, `12`, `37` | every entry and failure state, including a failed recovery route, independently explains location, status, consequence, next action, and support | `03` |
| WEB-UX-R04 | `02`, `03`, `06`–`08`, `26`–`29` | stale, expiry, reauthentication, exact ordering, and authority change preserve only permissible context and truthful recovery | `04` |
| WEB-UX-R05 | `03`, `06`, `07`, `09`–`11`, `15`, `17`, `24`, `26`–`28`, `30`, `32`, `36` | latency, interruption, duplicate/late result, exact time/confirmation edges, external/framework failure, and return preserve work and one effect | `05` |
| WEB-UX-R06 | `07`, `09`–`13`, `27`, `30`, `37` | every failure class, uncertainty inversion, wait threshold, retry route, nested recovery failure, and support handoff remains actionable and diagnosable without harm | `06` |
| WEB-UX-R07 | `14`, `17`, `32` | consequential commitments retain informed review, exact confirmation, one effect, receipt, reversal/dispute, and support | `07` |
| WEB-UX-R08 | `02`, `08`, `14`–`16`, `29`, `31` | identity, authority, consent, external provider, account change, consequence, and refusal remain legible and non-coercive | `08` |
| WEB-UX-R09 | `18`, `19`, `33` | claims remain bounded to valid direct evidence and change when a material context or ethical condition is absent | `09` |
| WEB-UX-R10 | `20`–`22`, `34` | the full outcome chain, authority reconciliation, missingness, and exact window edge remain defined, private, and falsifiable | `10` |
| WEB-UX-R11 | `13`, `16`, `20`–`22`, `24`, `34`–`36` | support and instrumentation remain minimal, versioned, deduplicated, reconcilable, consent-aware, change-compatible, and recovery-aware | `10` |
| WEB-UX-R12 | `13`, `19`, `23`, `24`, `35`, `36` | production routes, content, identity, recovery, support, measurement, framework change/failure, and claim separation are complete | `11` |

## Failability and omission audit

Every child rule maps to cases and reserved checks. All 37 cases have one explicit observable obligation and
map back to live policy and at least one reserved check. Every check preserves the union named above, and no
coverage-role set contains more than one type. Stale links, multi-tab/provider races, contextless direct
entry, expiry/effect ambiguity, unsafe account switches, late results, retry dead ends, support without
diagnostics, phishing-like handoffs, coerced consent, duplicate irreversible effects, missing representative
contexts, client-event false completion, analytics missingness, and router exemptions all have observable
failure oracles. No technical green signal closes design acceptance or a live outcome claim.
