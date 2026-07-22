# Web Feature Evaluation Entry

Companion for evaluating one web feature inside the active Gobbi evaluation. It adds web-feature case
selection and lenses; it does not create another evaluation phase or artifact. The evaluator still produces
the seven perspective files, `overall.md`, and the copied phase `checklist.md` defined by the generic
[`evaluation`](../evaluation/SKILL.md) skill. The executor may use the same frame for pre-handoff self-review,
but that does not replace independent evaluation.

Policy lives in [`SKILL.md`](SKILL.md). Cases live in [`scenarios.md`](scenarios.md), and binary operational
gates live in [`checklists.md`](checklists.md). When browser UI or UX applies, load the generic parent before
the web child and use that child's evaluation companion as another frame. Load [`vision`](../vision/SKILL.md)
and [`vision/ui.md`](../vision/ui.md) only when captured renderings are evaluated.

## Stage 0 — Frame the evidence before judging

Read the following in order:

1. the active phase objective, accepted ideation/specification, implementation diff, verification evidence,
   affected-surface map, release plan, and known limitations;
2. all five files in this `web` bundle;
3. `coding` and every applicable language/runtime/framework evaluation frame;
4. generic `ui` then `web/ui` when an observable browser interface is present;
5. generic `ux` then `web/ux` when flow, content, recovery, trust, research, or measurement is present;
6. `vision` plus `vision/ui.md` only for actual captured frames.

If an expected artifact is missing, record `NEEDS_CONTEXT` or a finding as the generic evaluation contract
requires; do not invent the evidence. Preserve producer/evaluator separation.

## Rule-to-coverage crosswalk

Use this table to resolve every finding to its parent policy and its operational teeth. The companions add no
new rule.

| Rules | Scenario families | Checks |
|---|---|---|
| WEB-R01, WEB-R15 | `WEB-FAMILY-01`, `-03` | `WEB-CHECK-01`, `WEB-CHECK-12` |
| WEB-R02 | `WEB-FAMILY-04`, `-09` | `WEB-CHECK-04`, `WEB-CHECK-05`, `WEB-CHECK-11` |
| WEB-R03, WEB-R04 | `WEB-FAMILY-02`, `-08`, `-09` | `WEB-CHECK-02`, `WEB-CHECK-03`, `WEB-CHECK-14` |
| WEB-R05 | `WEB-FAMILY-03`, `-04` | `WEB-CHECK-04`, `WEB-CHECK-05` |
| WEB-R06 | `WEB-FAMILY-07` | `WEB-CHECK-07` |
| WEB-R07 | `WEB-FAMILY-03`, `-10` | `WEB-CHECK-06` |
| WEB-R08 | `WEB-FAMILY-03`, `-04`, `-06` | `WEB-CHECK-08` |
| WEB-R09 | `WEB-FAMILY-05`–`-08`, `-10` | `WEB-CHECK-09` |
| WEB-R10 | `WEB-FAMILY-03`–`-05`, `-08`, `-10` | `WEB-CHECK-10` |
| WEB-R11 | `WEB-FAMILY-03`, `-09` | `WEB-CHECK-11` |
| WEB-R12 | `WEB-FAMILY-09`, `-10` | `WEB-CHECK-12` |
| WEB-R13 | `WEB-FAMILY-02`, `-05`, `-10` | `WEB-CHECK-13` |
| WEB-R14 | `WEB-FAMILY-04`, `-09` | `WEB-CHECK-14` |

## Selecting cases and checks

1. Map the feature to scope, actors, URL/browser state, server/data/provider effects, trust crossings,
   quality targets, UI/UX evidence, compatibility, operations, and claims.
2. Select every applicable `WEB-SCENARIO-*` and its explicit case-level `Obligation`. Include each family's
   Good case and every triggered minimum:
   external dependency, security/trust, irreversible effect, performance/resource, change/regression,
   accessibility/locale, and claim-integrity cases. Record a concrete reason for a plausible inapplicable case.
3. Select every operational source item named by the scenarios, plus any directly applicable item even when no
   selected scenario is a close fit. Confirm the selected item's claim preserves the full semantic union of
   every mapped case obligation in the source ledger. Keep its ID, criticality, claim, applicability, pass
   condition, evidence, on-fail route, and source wording unchanged.
4. Copy each selection into the active checklist's `## Stage 1 Additions` as an evaluator-owned coverage row.
   Set the evaluation-copy use-style to `do-confirm`; retain the operational pause-point ID only as trace
   metadata, because an evaluation copy has no operational pause point.
5. Resolve each evaluation copy with exactly `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`, each backed by
   named inspected evidence. Operational-only `recorded-open` and `waived/exception-authorized` terminals are
   invalid in the evaluation copy and never become `PASS`; an applicable unmet obligation opens a finding and
   resolves `FAIL:<finding-id>`. A missing design precondition is not `n/a`.
6. Walk all seven perspectives and Overall even when a lens produces zero findings. Findings point to the
   earliest owning WEB rule and include concrete evidence, impact, correction, and verification.

## Evidence classes and claim boundaries

| Evidence | May support | Does not alone support |
|---|---|---|
| Source/static analysis | structure, configured controls, dependency shape | runtime path, browser behavior, user success |
| Automated tests | exercised code behavior in the test environment | visual quality, representative-user acceptance, live operation |
| Live browser interaction | operated journey and visible state in that environment | hidden semantics, all devices, server truth by implication |
| DOM/accessibility-tree inspection | semantics, relationships, name/role/value, exposed state | pixel quality, all assistive-technology behavior, user acceptance |
| Captured rendering | captured pixels and visible state at one viewport/theme/moment | semantics, keyboard/focus, responsive behavior, DOM conformance |
| Representative-user evidence | observed design fit for recruited people and contexts | implementation correctness or populations not represented |
| Server/data/provider evidence | authoritative effects and invariants in that environment | user comprehension or visual state |
| Lab performance | repeatable synthetic behavior under declared conditions | production population distribution |
| Field telemetry | instrumented production behavior for the observed population | causality, uninstrumented harm, or design acceptance by itself |
| Migration/rollback rehearsal | rehearsed transition and recovery under declared state | external deployment authorization or unrehearsed production state |

Never merge evidence classes into a single “tested” status. Resolve a contradiction at the authoritative
owner—for example, client completion against server effect—and keep the favorable signal from masking it.

## Perspectives

### Project

Judge whether the bounded feature matches the accepted outcome, project rules, current application,
compatibility promises, owner map, and release authority. Activate `WEB-FAMILY-01`, `-02`, `-09`, and checks
`01`–`05`, `11`–`14`. Look for page-level completion posing as feature completion, design chronology skipped,
framework scope leakage, or deployment implied by release readiness.

### Structure

Judge whether routes, state transitions, messages, domain rules, data/provider effects, authority, errors,
instrumentation, and rollback form one coherent vertical contract with explicit seams. Activate
`WEB-FAMILY-03`, `-04`, `-07`, `-09` and checks `04`–`08`, `11`, `12`, `14`. Look for client-only guards,
duplicated invariants, implicit state, or a local React convention deciding a cross-layer contract.

### Performance

Judge the user-critical path, server/provider work, payload and rendering cost, concurrency, capacity, cost,
and instrumentation against sourced targets. Distinguish lab from field evidence. Activate
`WEB-FAMILY-05`, `-06` and checks `08`, `09`, `10`. Look for an invented universal budget, average-only
claims, retry amplification, or optimization that weakens correctness or recovery.

### Aesthetics

Judge whether the observable feature preserves the accepted UI specification, hierarchy, states, content,
responsive composition, and project visual language. Use the generic and web UI lenses; use vision only for
captured pixels. Activate `WEB-FAMILY-02`, `-08` and checks `02`, `03`, `09`, `10`. A polished screenshot is
neither design acceptance nor proof of semantics.

### Usage

Judge whether intended actors can enter, understand, complete, fail, recover, retry, resume, and obtain support
across applicable contexts without false success or lost work. Use the generic and web UX lenses. Activate
`WEB-FAMILY-01`, `-02`, `-03`, `-06`, `-08` and checks `01`, `03`, `08`–`10`, `13`. Look for happy-path-only
flows, dead ends, ambiguous completion, hidden repair, or evidence from non-representative contexts.

### Consistency

Judge whether code, routes, client state, API/errors, schemas, provider effects, configuration, migrations,
tests, docs, telemetry, support, and rollout/rollback moved together while existing conventions remain
deliberate. Activate `WEB-FAMILY-03`, `-04`, `-09`, `-10` and checks `04`–`06`, `11`–`14`. Look for stale
contracts, mixed versions, a mock on the production path, or claims that disagree across layers.

### Risk

Write this seventh perspective to `risk.md`. Judge security and non-security blast radius together: input
validation, authentication/session, actor-resource authorization, consent, privacy, retention, secrets, abuse,
third parties, data integrity, auditability, cost/resource runaway, provider failure, partial rollout or effect,
rollback/reversibility, and safe failure from the actual threat model and selected versioned requirements.
Activate `WEB-FAMILY-05`–`-07`, `-09` and checks `07`–`12`. Exercise direct server requests,
replay/duplicates, stale sessions, provider failure, retry amplification, partial effects and release states,
least authority, stop conditions, and rollback/forward-fix; UI hiding is not enforcement.

## Recommended verification

Choose the strongest safe project-native commands and environments; the following is an evidence menu, not a
universal command list:

- source/diff, dependency, secret, configuration, schema, migration, and contract inspection;
- format, lint, type/static checks, focused tests, full tests, build, and artifact verification;
- live browser journeys for direct/deep entry, refresh, history, duplicate action, interruption, recovery,
  auth expiry, and provider failure;
- DOM/accessibility-tree, keyboard, focus, zoom/reflow, theme, locale, browser/device, and assistive-technology
  checks selected by the UI owner;
- authorization bypass, untrusted-input, session, CSRF/cross-site, abuse, replay, and privacy checks selected
  from the feature threat model;
- authoritative server/data/provider effect, idempotency, concurrency, reconciliation, and audit checks;
- declared-condition lab performance plus available field evidence, with the two kept separate;
- telemetry event-semantic reconciliation, alert/diagnostic resolution, migration rehearsal, partial rollout,
  stop-condition exercise, and rollback/forward-fix rehearsal.

Record exact command or action, environment, version/configuration, fresh result, artifact pointer, and
limitation. A skipped high-risk verification becomes a finding or explicit blocker, not a silent omission.

## Overall anchors and claim ledger

Overall applies the generic verdict rules after all perspectives and copied checks. A feature cannot receive a
release-ready PASS while any applicable required check fails, UI/UX design reports `NEEDS_CONTEXT`, a security
or data-integrity blocker remains, rollback is unproved, or evidence is unresolvable. Coverage completeness is
not acceptance.

The Overall file must state each claim separately:

| Claim | Allowed state | Required owner evidence |
|---|---|---|
| Implementation correctness | pass / fail / incomplete | source, build, tests, browser, server/data as applicable |
| UI design acceptance | accepted / rejected / needs context / not applicable | generic UI contract and direct evidence |
| UX design acceptance | accepted / rejected / needs context / not applicable | generic UX contract and direct evidence |
| Release readiness | ready / not ready | all applicable gates, operations, migration, rollback |
| Deployment authority and state | authorized/not authorized; deployed/not deployed | explicit authority and external action record |
| Post-deployment outcome | validated / disproved / pending | reconciled live outcome and harm evidence |

Preserve strengths explicitly so a correction does not erase behavior already proved. Return every accepted
finding to its owning parent rule, then rerun the affected check and any dependent whole-feature proof.
