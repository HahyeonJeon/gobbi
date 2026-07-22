# Web UX Scenario Set

Scenario source for [`SKILL.md`](SKILL.md). Consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises browser-experience policy without adding policy. Lifecycle:
design obligations plus implementation/evaluation coverage for one accepted feature outcome. Generic UX direct
research/prototype cases remain with [`../../ux`](../../ux/scenarios.md).

Scale: nine families and 24 cases. Sensitive research and telemetry evidence is referenced, not copied.

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
| `01` | `01` | n/a: selected entries share one browser contract | n/a: invalid input lives in `05` | `03` | `02`, `03` | `02` | `02`, `03` | n/a: URL/state is inspected |
| `02` | `04` | n/a: parent owns valid journey alternatives | n/a: invalid input lives in `05` | n/a: no finite edge | `05` | `05` | n/a: content change is parent-owned | n/a: direct entry is operated |
| `03` | `06` | n/a: identity path follows authority | n/a: unauthorized state is trust-owned | `07` | `06`, `07` | `08` | `08` | `07` |
| `04` | `09` | n/a: recovery routes share one time contract | n/a: failure classes live in `05` | `10` | `09`–`11` | `11` | n/a: lifecycle version lives in `09` | n/a: late state is injected |
| `05` | `12` | n/a: failure class selects recovery | n/a: invalid state is one selected class | n/a: capacity edge is selected in `12` | `12`, `13` | `13` | n/a: support version is evidence metadata | n/a: support resolution is exercised |
| `06` | `14` | n/a: optional choice is carried by `16` | `16` | `17` | `17` | `15`, `16` | `15` | n/a: effect is reconciled |
| `07` | `18` | n/a: contexts bound claims rather than compete | n/a: missing precondition blocks | n/a: exact participant count is study-owned | `19` | `19` | n/a: study version is evidence metadata | `19` |
| `08` | `20` | n/a: metrics are distinct links in one chain | n/a: malformed event is data quality | `22` | n/a: pipeline recovery is operations-owned | `21`, `22` | n/a: event versions live in the dictionary | `21` |
| `09` | `23` | n/a: framework owner selects idiom | n/a: invalid input is parent-owned | n/a: finite edges live in journey families | `24` | `24` | `23`, `24` | n/a: browser outcome is operated |

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

### WEB-UX-SCENARIO-01 — Browser navigation preserves journey meaning

- **Primary type / coverage-role:** Positive / {Positive}; ordinary browser navigation defines this case.
- **Secondary/domain tags:** URL, history, orientation, authoritative effect.
- **Given/When/Then:** Given direct/deep/internal entry, refresh, back/forward, and applicable bookmark/share,
  when the journey is operated, then URL/history meaning, orientation, safe state, and the next action remain
  consistent with the accepted experience and authoritative effect.
- **Failure oracle:** a browser-native action loses intent, repeats an effect, exposes sensitive state, or lands
  on a contextless/dead page.
- **Evidence tuple:** operate selected entries/history; inspect URL/state/effect; compare accepted-clause trace.
- **Trace:** WEB-UX-R01, WEB-UX-R02, WEB-UX-R03; `WEB-UX-CHECK-01`, `-02`, `-03`.

### WEB-UX-SCENARIO-02 — Stale or shared link poses as current authority

- **Primary type / coverage-role:** Adversarial / {Adversarial, Change/regression}; stale URL state intentionally
  attempts to outlive changed permission or data.
- **Secondary/domain tags:** trust, authorization, sensitive URLs, recovery.
- **Given/When/Then:** Given a bookmarked/shared link is expired, revoked, account-bound, or points to changed
  state, when opened directly or in another account, then protected context is not exposed, false validity is
  not shown, and an explanatory recovery/reauthentication route preserves only safe intent.
- **Failure oracle:** stale URL data grants, leaks, or visually implies current access/effect.
- **Evidence tuple:** open under expired/wrong context; inspect visible/server state and recovery.
- **Trace:** WEB-UX-R02, WEB-UX-R04, WEB-UX-R08; `WEB-UX-CHECK-02`, `-04`, `-08`.

### WEB-UX-SCENARIO-03 — Multiple tabs and external return race history

- **Primary type / coverage-role:** Failure/recovery / {Boundary, Failure/recovery}; an interleaved tab/provider
  return at the state transition defines this case.
- **Secondary/domain tags:** browser history, external provider, duplicate effect.
- **Given/When/Then:** Given the journey is open in two tabs or leaves for an external provider, when one
  context changes state and another returns late, then the feature reconciles authoritative state, avoids
  duplicate effect, explains mismatch, and offers the smallest safe continuation.
- **Failure oracle:** old tab/provider return overwrites, repeats, or falsely completes the newer outcome.
- **Evidence tuple:** interleave tab/provider actions; inspect history/session/effect; follow recovery.
- **Trace:** WEB-UX-R02, WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-02`, `-04`, `-05`.

## WEB-UX-FAMILY-02 — Orientation, content, and decisions

- **Primary category:** 1 Purpose / outcomes / scope — each state serving the right informed next outcome
  defines the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 8 Inclusion /
  locale; 10 Evidence / traceability / clarity.
- **Source:** WEB-UX-R01, WEB-UX-R03; P2/P6.
- **Actor/outcome:** each state is understandable without remembered hidden context.
- **Applicability:** every journey state.

### WEB-UX-SCENARIO-04 — Each state supports the next informed decision

- **Primary type / coverage-role:** Positive / {Positive}; ordinary self-sufficient orientation defines this
  case.
- **Secondary/domain tags:** content, plain language, informed decision.
- **Given/When/Then:** Given any selected entry or state, when the person encounters it without prior-screen
  memory, then location, reason, current status, relevant consequence, primary/alternative action, and support
  are clear in plain project language.
- **Failure oracle:** correct action depends on memory, jargon, hidden status, or an unexplained disabled path.
- **Evidence tuple:** content/state walkthrough; direct task evidence from accepted study; trace decisions.
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
- **Trace:** WEB-UX-R02, WEB-UX-R03; `WEB-UX-CHECK-02`, `-03`.

## WEB-UX-FAMILY-03 — Identity, session, and context continuity

- **Primary category:** 6 Failure / recovery / operations — safe continuity and recovery across identity and
  session transitions define the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 7 Trust / harm /
  governance; 9 Change / compatibility / reversibility.
- **Source:** WEB-UX-R04, WEB-UX-R06; P3/P6.
- **Actor/outcome:** safe intent survives identity changes while protected context does not.
- **Applicability:** when authentication, authorization, account/tenant/role, or session exists.

### WEB-UX-SCENARIO-06 — Reauthentication resumes permissible intent

- **Primary type / coverage-role:** Positive / {Positive}; ordinary same-context reauthentication and resumption
  define this case.
- **Secondary/domain tags:** identity, session, retained intent, privacy.
- **Given/When/Then:** Given a session expires during a non-terminal journey, when reauthentication succeeds
  under the same authorized context, then safe inputs/intent and orientation resume at the smallest valid step,
  while sensitive credentials and stale authority do not persist.
- **Failure oracle:** the person repeats avoidable work or protected context survives without revalidation.
- **Evidence tuple:** expire session at each material step; reauthenticate; inspect retained/discarded state.
- **Trace:** WEB-UX-R04, WEB-UX-R05; `WEB-UX-CHECK-04`, `-05`.

### WEB-UX-SCENARIO-07 — Expiry after action leaves ambiguous outcome

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery, Counterfactual}; authentication expiry
  races the premise that the effect is known.
- **Secondary/domain tags:** identity, session, authoritative effect, duplicate action.
- **Given/When/Then:** Given the session expires near submission, when the response is lost or reauth occurs,
  then the journey determines authoritative effect before inviting retry and explains whether completion,
  resumption, or safe repetition applies.
- **Failure oracle:** the user repeats a completed irreversible effect or is told success without proof.
- **Evidence tuple:** inject expiry before/during/after effect; reconcile state; operate recovery.
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
- **Trace:** WEB-UX-R04, WEB-UX-R08; `WEB-UX-CHECK-04`, `-08`.

## WEB-UX-FAMILY-04 — Time, interruption, stale state, and retry

- **Primary category:** 6 Failure / recovery / operations — interruption, containment, and safe resumption
  define the family.
- **Secondary-category tags:** 3 Behavior / state / data; 5 Quality attributes / resource economics; 7 Trust /
  harm / governance.
- **Source:** WEB-UX-R05, WEB-UX-R06; P3/P6.
- **Actor/outcome:** waiting and interruption retain truthful status and safe control.
- **Applicability:** select each triggered latency/network/suspension/duplicate state.

### WEB-UX-SCENARIO-09 — Interrupted journey resumes without repeated work

- **Primary type / coverage-role:** Positive / {Positive}; ordinary interruption and safe return define this
  case.
- **Secondary/domain tags:** latency, offline, retained work, authoritative effect.
- **Given/When/Then:** Given slow work, navigation away, refresh, tab suspension, poor network, or offline state,
  when the person returns, then status distinguishes waiting/failed/completed, safe work and intent persist,
  cancellation/retry/resume are available as applicable, and authoritative state is reconciled first.
- **Failure oracle:** progress is lost, waiting looks complete, or the next action can repeat harm.
- **Evidence tuple:** inject selected interruptions; return; inspect retained state/status/effect and recover.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

### WEB-UX-SCENARIO-10 — Offline retry receives a late original result

- **Primary type / coverage-role:** Failure/recovery / {Boundary, Failure/recovery}; out-of-order original and
  retry results define the recovery boundary.
- **Secondary/domain tags:** offline, retry, duplicate effect, late result.
- **Given/When/Then:** Given a request appears lost and the person retries after reconnecting, when the original
  and retry resolve out of order, then one authoritative outcome is shown, duplicates are prevented or
  reconciled, and the person can inspect/recover without hidden repair.
- **Failure oracle:** conflicting visible results, duplicate effect, or permanent pending state.
- **Evidence tuple:** reorder responses; inspect events/effect/status; follow receipt or correction path.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

### WEB-UX-SCENARIO-11 — “Try again” loops without diagnosis or exit

- **Primary type / coverage-role:** Adversarial / {Adversarial, Failure/recovery}; a generic retry loop
  intentionally hides a non-retryable condition.
- **Secondary/domain tags:** recovery, support, failure taxonomy.
- **Given/When/Then:** Given permission, conflict, dependency, capacity, or unknown failure, when the interface
  emits one generic retry action, then each non-retryable or repeated condition must instead explain the safe
  next action, wait/alternate path, support/escalation, or ownership.
- **Failure oracle:** repeated retry cannot change the condition and no support or safe exit exists.
- **Evidence tuple:** inject distinct failures and repeat; inspect message/action/escalation and retained work.
- **Trace:** WEB-UX-R05, WEB-UX-R06; `WEB-UX-CHECK-05`, `-06`.

## WEB-UX-FAMILY-05 — Failure, recovery, and support ownership

- **Primary category:** 6 Failure / recovery / operations — actionable recovery and diagnosable support
  ownership define the family.
- **Secondary-category tags:** 2 Actors / stakeholders / use-context; 3 Behavior / state / data; 10 Evidence /
  traceability / clarity.
- **Source:** WEB-UX-R03, WEB-UX-R06; P3/P7.
- **Actor/outcome:** failures are distinguishable enough to enable safe correction or escalation.
- **Applicability:** every feature; exact failure classes are evidence-selected.

### WEB-UX-SCENARIO-12 — Failure class produces an actionable recovery

- **Primary type / coverage-role:** Positive / {Positive}; ordinary handled failure and recovery define this
  case.
- **Secondary/domain tags:** failure taxonomy, retained work, support.
- **Given/When/Then:** Given input, permission, session, conflict, dependency, capacity, unavailable, and unknown
  failures that apply, when each occurs, then the experience preserves safe work, communicates enough without
  harmful detail, offers the correct next action, and makes support ownership/resolvable diagnostics available.
- **Failure oracle:** a failure is indistinguishable, blames the person, leaks details, or reaches a dead end.
- **Evidence tuple:** inject each class; inspect content/action/work/support; complete recovery where possible.
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
- **Trace:** WEB-UX-R06, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-06`, `-10`, `-11`.

## WEB-UX-FAMILY-06 — Trust, privacy, and consequential action

- **Primary category:** 7 Trust / harm / governance — informed authority, privacy, and consequential-action
  safeguards define the family.
- **Secondary-category tags:** 3 Behavior / state / data; 4 Interfaces / dependencies / structure; 6 Failure /
  recovery / operations; 9 Change / compatibility / reversibility.
- **Source:** WEB-UX-R07, WEB-UX-R08; P4/P6.
- **Actor/outcome:** a person understands and controls meaningful consequence before commitment and after effect.
- **Applicability:** trust boundary always; permission/consent/provider/irreversible cases when triggered.

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
- **Trace:** WEB-UX-R07, WEB-UX-R08; `WEB-UX-CHECK-07`, `-08`.

### WEB-UX-SCENARIO-15 — External handoff trains unsafe trust

- **Primary type / coverage-role:** Adversarial / {Adversarial, Change/regression}; a changed external-domain
  context intentionally creates unsafe trust confusion.
- **Secondary/domain tags:** trust, phishing resistance, external provider, URL.
- **Given/When/Then:** Given the journey redirects to or embeds an identity/payment/provider domain, when the
  transition and return occur, then who acts, why, requested data/permission, expected domain, return status,
  cancellation, and suspicious mismatch are clear without asking the person to ignore browser security signals.
- **Failure oracle:** ambiguous branding/domain, secret-copy instructions, or return success without provider
  reconciliation conditions phishing or false completion.
- **Evidence tuple:** operate normal/cancel/mismatch/late return; inspect content/URL/effect and safe exit.
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
- **Trace:** WEB-UX-R08, WEB-UX-R11; `WEB-UX-CHECK-08`, `-10`.

### WEB-UX-SCENARIO-17 — Duplicate irreversible action lacks receipt or dispute

- **Primary type / coverage-role:** Failure/recovery / {Boundary, Failure/recovery}; repeated activation at the
  irreversible-effect boundary defines this case.
- **Secondary/domain tags:** trust, financial/legal harm, receipt, dispute.
- **Given/When/Then:** Given repeated activation or ambiguous network result around an irreversible effect, when
  authoritative state is reconciled, then one effect, clear receipt/status, correction/reversal/dispute route,
  and support reference exist.
- **Failure oracle:** duplicated harm, ambiguous ownership, or no aftermath route.
- **Evidence tuple:** repeat/reorder action; inspect effect/receipt/history/support; exercise dispute/recovery.
- **Trace:** WEB-UX-R05, WEB-UX-R07; `WEB-UX-CHECK-05`, `-07`.

## WEB-UX-FAMILY-07 — Representative web contexts

- **Primary category:** 2 Actors / stakeholders / use-context — represented people and material web contexts
  define the family.
- **Secondary-category tags:** 5 Quality attributes / resource economics; 8 Inclusion / locale; 10 Evidence /
  traceability / clarity.
- **Source:** WEB-UX-R09; P1/P5/P7.
- **Actor/outcome:** design claims remain bounded to direct evidence from materially relevant contexts.
- **Applicability:** every design acceptance; gate.

### WEB-UX-SCENARIO-18 — Accepted evidence covers material web contexts

- **Primary type / coverage-role:** Positive / {Positive}; ordinary direct evidence across material contexts
  defines this case.
- **Secondary/domain tags:** accessibility, locale, representative users, consent, accommodations.
- **Given/When/Then:** Given the feature risk and population, when design acceptance is inspected, then direct
  representative-user evidence covers or explicitly limits material device/browser, input/assistive, locale,
  network, auth, interruption, privacy, and consequential contexts under valid consent/accommodation conditions.
- **Failure oracle:** a material claim has no representative context or an absent context is generalized over.
- **Evidence tuple:** resolve study/prototype records; map participants/tasks/contexts; inspect limitations.
- **Trace:** WEB-UX-R09; `WEB-UX-CHECK-09`.

### WEB-UX-SCENARIO-19 — Green lab journey masks missing people and conditions

- **Primary type / coverage-role:** Adversarial / {Adversarial, Counterfactual}; technical success intentionally
  stands in for absent representative evidence.
- **Secondary/domain tags:** representative users, consent, accommodations, context limits.
- **Given/When/Then:** Given automated journeys and internal demos succeed, when representative-user evidence,
  consent, accommodations, or material web contexts are absent, then design acceptance remains
  `NEEDS_CONTEXT` and root release readiness stays blocked.
- **Failure oracle:** internal/automated success is used as a proxy for direct representative evidence.
- **Evidence tuple:** compare technical artifacts to generic UX gate; identify absent people/contexts/conditions.
- **Trace:** WEB-UX-R09, WEB-UX-R12; `WEB-UX-CHECK-09`, `-11`.

## WEB-UX-FAMILY-08 — Measurement validity and privacy

- **Primary category:** 10 Evidence / traceability / clarity — falsifiable, reconcilable outcome proof defines
  the family.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 3 Behavior / state / data; 5 Quality attributes /
  resource economics; 7 Trust / harm / governance.
- **Source:** WEB-UX-R10, WEB-UX-R11; P5/P7.
- **Actor/outcome:** outcome claims are defined, privacy-conscious, reconcilable, and falsifiable.
- **Applicability:** every feature; production outcome remains pending before live data.

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
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

### WEB-UX-SCENARIO-21 — Client completion disagrees with authoritative effect

- **Primary type / coverage-role:** Counterfactual / {Counterfactual, Adversarial}; the premise that favorable
  client telemetry equals authoritative effect is inverted.
- **Secondary/domain tags:** measurement, authoritative effect, data quality.
- **Given/When/Then:** Given the browser emits completion but the server/data/provider effect is absent, reversed,
  duplicated, or belongs to another context, when metrics reconcile, then authoritative completion fails,
  instrumentation is corrected, and the user-facing discrepancy is investigated.
- **Failure oracle:** a click, route, toast, or client event is accepted as the completed outcome.
- **Evidence tuple:** join client/server/effect by bounded identity/version; inspect mismatch and correction.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

### WEB-UX-SCENARIO-22 — Missing or blocked analytics is labeled abandonment

- **Primary type / coverage-role:** Adversarial / {Adversarial, Boundary}; missingness at the observation boundary
  intentionally games the denominator.
- **Secondary/domain tags:** analytics, privacy, data quality, observability.
- **Given/When/Then:** Given consent refusal, blocking, offline state, event delay/duplication, version skew, or
  join failure, when the metric is computed, then missingness/data quality is separated from user abandonment,
  privacy choice is honored, and uncertainty limits the claim.
- **Failure oracle:** unobserved people are classified as failure/success or silently removed from denominator.
- **Evidence tuple:** suppress/delay/duplicate/version events; inspect pipeline, denominator, and reported limit.
- **Trace:** WEB-UX-R10, WEB-UX-R11; `WEB-UX-CHECK-10`.

## WEB-UX-FAMILY-09 — Production and framework-owner boundary

- **Primary category:** 9 Change / compatibility / reversibility — production and framework integration must
  preserve the accepted journey across change.
- **Secondary-category tags:** 1 Purpose / outcomes / scope; 4 Interfaces / dependencies / structure; 6 Failure
  / recovery / operations; 10 Evidence / traceability / clarity.
- **Source:** WEB-UX-R01, WEB-UX-R12; P6/P8.
- **Actor/outcome:** production routes, content, state, support, and measurement preserve accepted experience.
- **Applicability:** every implementation; framework case when present.

### WEB-UX-SCENARIO-23 — Production journey and handoff are complete

- **Primary type / coverage-role:** Positive / {Positive, Change/regression}; ordinary production integration
  across change defines this case.
- **Secondary/domain tags:** production completeness, framework ownership, measurement handoff.
- **Given/When/Then:** Given accepted experience clauses and applicable framework owners, when the feature is
  handed to root web evaluation, then all affected routes, entries, content, identity/session, recovery/support,
  instrumentation, tests/docs/diagnostics, context limits, and post-deployment validation plan are complete,
  while claim states remain separate.
- **Failure oracle:** prototype/mocks/TODOs or a planned event/support route remain on the production journey.
- **Evidence tuple:** trace clauses to production/evidence; operate selected journey; resolve cold handoff.
- **Trace:** WEB-UX-R01, WEB-UX-R12; `WEB-UX-CHECK-01`, `-11`.

### WEB-UX-SCENARIO-24 — Router convention breaks history or intent

- **Primary type / coverage-role:** Adversarial / {Adversarial, Change/regression}; a router convention
  intentionally attempts to waive browser journey outcomes during change.
- **Secondary/domain tags:** framework ownership, URL, history, sensitive state, measurement.
- **Given/When/Then:** Given a framework router/state convention is standard, when it loses deep-link intent,
  makes back repeat an effect, stores sensitive state in a URL, resets recovery, or distorts measurement, then
  the experience fails and the framework owner must correct integration without narrowing this contract.
- **Failure oracle:** convention/library usage substitutes for operated browser journey and authoritative effect.
- **Evidence tuple:** exercise direct/history/restore cases; inspect state/effect/events; trace owner boundary.
- **Trace:** WEB-UX-R02, WEB-UX-R05, WEB-UX-R11, WEB-UX-R12; `WEB-UX-CHECK-02`, `-05`, `-10`, `-11`.

## Source-to-obligation ledger

| Rules | Scenarios | Reserved checks |
|---|---|---|
| WEB-UX-R01 | `01`, `04`, `23` | `01` |
| WEB-UX-R02 | `01`–`03`, `05`, `15`, `24` | `02` |
| WEB-UX-R03 | `01`, `04`, `05`, `12` | `03` |
| WEB-UX-R04 | `02`, `03`, `06`–`08` | `04` |
| WEB-UX-R05 | `03`, `06`, `07`, `09`–`11`, `15`, `17`, `24` | `05` |
| WEB-UX-R06 | `07`, `09`–`13` | `06` |
| WEB-UX-R07 | `14`, `17` | `07` |
| WEB-UX-R08 | `02`, `08`, `14`–`16` | `08` |
| WEB-UX-R09 | `18`, `19` | `09` |
| WEB-UX-R10 | `20`–`22` | `10` |
| WEB-UX-R11 | `13`, `16`, `20`–`22`, `24` | `10` |
| WEB-UX-R12 | `13`, `19`, `23`, `24` | `11` |

## Failability and omission audit

Every child rule maps to cases and reserved checks. Stale links, multi-tab/provider races, contextless direct
entry, expiry/effect ambiguity, unsafe account switches, late results, retry dead ends, support without
diagnostics, phishing-like handoffs, coerced consent, duplicate irreversible effects, missing representative
contexts, client-event false completion, analytics missingness, and router exemptions all have observable
failure oracles. No technical green signal closes design acceptance or a live outcome claim.
