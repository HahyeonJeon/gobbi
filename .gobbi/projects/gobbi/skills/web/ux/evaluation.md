# Web UX Evaluation Entry

Browser-experience frame for the active Gobbi evaluation and executor pre-handoff self-review. Load
[`../evaluation.md`](../evaluation.md) and generic [`../../ux/evaluation.md`](../../ux/evaluation.md) first.
This child grades production realization of the accepted experience, browser continuity, web trust, and
measurement validity. Generic UX retains research and design acceptance. This frame adds no evaluation phase,
artifact, or policy beyond [`SKILL.md`](SKILL.md).

If the outcome has an observable interface, also load generic UI then web UI evaluation. Framework evaluation
remains with the applicable framework skill; router/state integration is judged here only by the resulting web
journey.

## Stage 0 — Read and bind the target

Read the active phase objective/diff/evidence, root feature contract, accepted generic UX specification and
research limits, all five files in this child, current routes/content/session/provider behavior, support and
analytics definitions, privacy/data rules, baseline sources, and applicable UI/language/framework frames. Build
an accepted-clause → journey/state → authoritative effect → measurement trace. Missing required generic UX
evidence remains `NEEDS_CONTEXT`.

## Rule-to-coverage crosswalk

| Rules | Scenario families | Checks |
|---|---|---|
| WEB-UX-R01 | `WEB-UX-FAMILY-01`, `-02`, `-09` | `WEB-UX-CHECK-01` |
| WEB-UX-R02 | `WEB-UX-FAMILY-01`, `-02`, `-06`, `-09` | `WEB-UX-CHECK-02` |
| WEB-UX-R03 | `WEB-UX-FAMILY-01`, `-02`, `-05` | `WEB-UX-CHECK-03` |
| WEB-UX-R04 | `WEB-UX-FAMILY-01`, `-03` | `WEB-UX-CHECK-04` |
| WEB-UX-R05 | `WEB-UX-FAMILY-01`, `-03`, `-04`, `-06`, `-09` | `WEB-UX-CHECK-05` |
| WEB-UX-R06 | `WEB-UX-FAMILY-03`–`-05` | `WEB-UX-CHECK-06` |
| WEB-UX-R07 | `WEB-UX-FAMILY-06` | `WEB-UX-CHECK-07` |
| WEB-UX-R08 | `WEB-UX-FAMILY-01`, `-03`, `-06` | `WEB-UX-CHECK-08` |
| WEB-UX-R09 | `WEB-UX-FAMILY-07` | `WEB-UX-CHECK-09` |
| WEB-UX-R10, WEB-UX-R11 | `WEB-UX-FAMILY-05`, `-06`, `-08`, `-09` | `WEB-UX-CHECK-10` |
| WEB-UX-R12 | `WEB-UX-FAMILY-05`, `-07`, `-09` | `WEB-UX-CHECK-11` |

## Selecting cases and checks

1. Map the changed feature to accepted clauses; entries/URL/history; orientation/content; identity/session/
   context transitions; latency/interruption/stale/duplicate states; failures/recovery/support; trust/privacy/
   consequential actions; representative contexts; event/outcome definitions; framework integration; and
   production handoff.
2. Select every applicable `WEB-UX-SCENARIO-*` and its explicit case-level `Obligation`, including each family
   Good case and distinct triggered
   external-dependency, identity, failure/recovery, irreversible, privacy, accessibility/locale, change, and
   counterfactual measurement cases. Record inspected reasons for plausible inapplicable triggers.
3. Select every named operational `WEB-UX-CHECK-*` plus any directly applicable source item. Confirm its claim
   preserves the full semantic union of every mapped case obligation in the reverse audit. Preserve its ID,
   criticality, claim, applicability, pass condition, evidence, on-fail route, and source wording. Keep generic
   UX and root web checks independently active.
4. Copy each selection into `## Stage 1 Additions` as an evaluator-owned coverage row. Set its use-style to
   `do-confirm`; retain the operational pause-point ID only as trace metadata because evaluation copies have no
   operational pause points.
5. Resolve every evaluation copy with exactly `PASS`, `FAIL:<finding-id>`, or `n/a:<property>` and named
   inspected evidence. Operational-only `recorded-open` and `waived/exception-authorized` terminals are invalid
   in the evaluation copy and never become `PASS`; an applicable unmet obligation opens a finding and resolves
   `FAIL:<finding-id>`. Use fresh live-journey, authoritative-effect, direct-user, and measurement evidence at
   their respective owners; one evidence class cannot close another.
6. Walk all seven perspectives and Overall. Findings name the child rule, scenario/check, exact entry/context/
   state, reproducible evidence, affected people/outcome, correction, and owner-correct verification.

## Perspectives

### Project

**Lens:** Does the production journey preserve the accepted outcome, project routes/content/support/privacy and
analytics conventions, current users and compatibility, feature boundary, decision authority, and framework-
owner split?

**Activate:** `WEB-UX-FAMILY-01`, `-02`, `-07`, `-09`; checks `01`–`03`, `09`, `11`.

**Watch for:** implementation rewriting accepted experience, whole-product expansion, router convention posed as
authority, internal demo posed as user evidence, or release/deployment/live outcome claims collapsed.

### Structure

**Lens:** Do entries, URLs/history, journey states, identity/context transitions, authoritative effects,
recovery/support, trust decisions, and event semantics form one coherent state model without lost or duplicated
intent?

**Activate:** `WEB-UX-FAMILY-01`–`-06`, `-08`, `-09`; checks `02`–`08`, `10`, `11`.

**Watch for:** linear screens without alternate entry, URL as hidden database, state owned inconsistently across
client/server/provider, retry disconnected from idempotency, or client completion detached from effect.

### Performance

**Lens:** Does perceived and actual time preserve control and truth across loading, progress, cancellation,
poor/offline network, stale/partial data, suspension, provider return, late result, and recovery, under sourced
performance targets and field/lab distinctions?

**Activate:** `WEB-UX-FAMILY-04`, `-05`, `-08`; checks `05`, `06`, `10`.

**Watch for:** waiting that looks done, progress without cancellation/recovery, speed metric detached from the
outcome, retry amplification, field claim from lab evidence, or slow contexts omitted from research.

### Aesthetics

**Lens:** Is content tone, hierarchy, status, consequence, trust language, feedback, and journey rhythm coherent
with the accepted experience and project language across all states? Route visual execution to UI frames.

**Activate:** `WEB-UX-FAMILY-02`, `-05`, `-06`; checks `03`, `06`–`08`.

**Watch for:** jargon, blame, deceptive urgency, ambiguous provider branding, generic errors, conversion copy
that hides consequence, or visual polish used to override comprehension evidence.

### Usage

**Lens:** Can representative people enter from realistic contexts, orient, make informed choices, preserve work,
complete, fail, resume, correct, reverse/dispute where applicable, and obtain support without repeating unsafe
actions?

**Activate:** `WEB-UX-FAMILY-01`–`-07`; checks `02`–`09`.

**Watch for:** contextless deep link, history repeating effect, session-expiry reset, dead-end retry, no receipt,
coerced consent, support asking for secrets, or evidence limited to ideal internal users/networks.

### Consistency

**Lens:** Do accepted clauses, route/history meaning, content/status, browser/client state, server/provider effect,
auth/session authority, support diagnostics, events/metrics, tests/docs, and post-deployment plan agree across
entries and contexts?

**Activate:** all families; checks `01`–`11`.

**Watch for:** UI says completed while provider says pending, account switch retains old data, support cannot
resolve correlation, event version changes metric meaning, or experiment/control journeys measure different
outcomes.

### Risk

Write this seventh perspective to `risk.md`.

**Lens:** Does the experience control security and non-security blast radius: actor/authority, session/context,
data purpose and integrity, consent/permission, external domain/provider failure, cost/irreversibility,
security-sensitive instruction, retry or telemetry resource runaway, partial rollout state, and reversible
recovery without leakage, replay, phishing-conditioning, coercion, or client-side authority assumptions?

**Activate:** `WEB-UX-FAMILY-01`, `-03`, `-04`, `-06`, `-08`, `-09`; checks `02`, `04`, `05`, `07`, `08`,
`10`, `11`.

**Watch for:** secrets or protected state in URL/analytics/support, open redirect or ambiguous provider, stale
session/account context, telemetry ignoring consent, repeated irreversible action, retry or event amplification,
provider failure without a safe route, old/new journeys that disagree during release, or rollback that loses
intent, receipts, disputes, data integrity, or support context.

## Evidence and verification matrix

| Claim | Minimum owner evidence |
|---|---|
| Accepted experience | generic UX direct representative-user evidence and explicit acceptance state |
| Browser continuity | operated direct/deep/nav/refresh/history/tab/restore/external-return cases |
| Identity continuity | live expiry/reauth/account-role-context transitions plus authoritative authorization |
| Time and recovery | injected latency/offline/stale/duplicate/late/failure cases with retained work and effect |
| Trust/consequence | accepted research evidence plus production decision/effect/receipt/recovery trace |
| Representative context | participant/task/context/consent/accommodation trace and explicit limits |
| Measurement definition | versioned metric/event dictionary, baseline/denominator/window/segment ownership |
| Measurement validity | sample client/server/provider reconciliation, join/deduplication/missingness/privacy checks |
| Production outcome | post-deployment reconciled live evidence only; before then `pending` |

Recommended verification may combine project-native tests/build, live browser operation, controlled session and
network/provider fault injection, multiple contexts/tabs, authoritative data/effect inspection, support
correlation, analytics schema/query checks, consent/blocking/missingness tests, and review of generic UX study
artifacts. Record exact environment/version, action/command, fresh result, artifact pointer, and limitation.

## Measurement validity rules for evaluation

Keep the following distinct in every finding and Overall claim:

- **eligible population** is not exposure; **exposure** is not entry; **entry** is not attempt;
- **client-visible completion** is not authoritative completion; either may disagree with downstream outcome;
- **failure** is not abandonment; missing/blocked/delayed/duplicated telemetry is not behavior;
- a favorable aggregate may hide an affected context, harm guardrail, support burden, or data-quality failure;
- correlation does not prove the feature caused a downstream change; record the inference and disproof method;
- pre-deployment implementation evidence validates event behavior, not live success, population, or causality.

Reconcile contradictory signals at their authoritative owner. Preserve the discrepancy; do not select the metric
that produces the preferred story.

## Overall and handoff

Apply the generic evaluation verdict rules. Browser-experience realization cannot pass while an applicable
child check fails, generic UX reports `NEEDS_CONTEXT` or rejection, safe URL/session/recovery behavior is
broken, a consequential trust gap remains, measurement semantics cannot reconcile, or production work is
incomplete. Coverage closure and technical green evidence do not prove experience acceptance.

Report strengths to preserve, findings by rule/scenario/check and context, representative-evidence limits,
measurement/data-quality limitations, framework/UI owner issues, child implementation status, generic UX
acceptance, and post-deployment outcome status separately. Return the result to root web evaluation; this child
never declares whole-feature release readiness or live success.
