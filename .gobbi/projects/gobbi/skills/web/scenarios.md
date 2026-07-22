# Web Feature Scenario Set

Scenario source for [`SKILL.md`](SKILL.md). Its consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises the parent contract and adds no web policy. Lifecycle mode:
design obligations plus implementation/evaluation coverage. Scope is one release-ready web feature; adjacent
outcomes and framework-specific idioms are non-goals. Sensitive evidence is referenced, not copied.

Scale: ten families and 32 cases. Split the set if it grows beyond about 12 families or 40 distinct
category/type cells.

## Coverage register

| # | Category | Disposition | Carrier |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `WEB-FAMILY-01` |
| 2 | Actors / stakeholders / use-context | selected | `WEB-FAMILY-02` |
| 3 | Behavior / state / data | selected | `WEB-FAMILY-03` |
| 4 | Interfaces / dependencies / structure | selected | `WEB-FAMILY-04` |
| 5 | Quality attributes / resource economics | selected | `WEB-FAMILY-05` |
| 6 | Failure / recovery / operations | selected | `WEB-FAMILY-06` |
| 7 | Trust / harm / governance | selected | `WEB-FAMILY-07` |
| 8 | Inclusion / locale | selected | `WEB-FAMILY-08` |
| 9 | Change / compatibility / reversibility | selected | `WEB-FAMILY-09` |
| 10 | Evidence / traceability / clarity | selected | `WEB-FAMILY-10` |

## Category × case-type matrix

Every family has a positive floor and an adversarial face. Triggered minima have distinct cases.

| Family | Good | Alternative | Negative | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| `01` | `01` | n/a: one locked outcome | n/a: no invalid input | n/a: no finite edge | n/a: owned by `06` | `02` | n/a: no version event | n/a: outcome is user-locked |
| `02` | `03` | n/a: claims select their own representative contexts | n/a: missing precondition is recovery | n/a: no fixed participant count | `04` | `29` | n/a: no version event | n/a: context is inspected |
| `03` | `05` | n/a: alternate entry is in `04` | n/a: invalid input is trust-owned | `06` | n/a: owned by `06` | `07` | n/a: change owned by `09` | n/a: state is observable |
| `04` | `08` | `10` | n/a: malformed input is trust-owned | n/a: no finite edge | `09` | `30` | n/a: lifecycle change owned by `09` | n/a: contracts are inspected |
| `05` | `11` | n/a: target varies by project context | n/a: no invalid input | `12` | n/a: reliability failure owned by `06` | `13` | n/a: target versions recorded, not changed here | n/a: target source is inspected |
| `06` | `14` | n/a: recovery routes share one contract | n/a: invalid input is trust-owned | `31` | `15` | `16` | n/a: planned rollback owned by `09` | n/a: failure is injected |
| `07` | `17` | n/a: one least-authority floor | `18` | n/a: rate/capacity edges select `05` | n/a: operational recovery owned by `06` | `19` | n/a: requirement version is evidence metadata | n/a: trust boundaries are traced |
| `08` | `20` | `21` | n/a: exclusion is adversarial | n/a: exact reflow/focus edges live in `web/ui` | n/a: access recovery lives in child cases | `22` | n/a: compatibility owned by `09` | n/a: modalities are operated |
| `09` | `32` | n/a: one compatible rollout contract | n/a: invalid input is not the change | n/a: version edge is the change case | `25` | `24` | `23` | n/a: change is exercised |
| `10` | `26` | n/a: evidence classes are combined, not interchangeable | n/a: missing evidence is a failed claim | n/a: no finite edge | n/a: proof failure appears as adversarial | `27` | n/a: evidence revisions retain IDs | `28` |

## Sources and IDs

- `SRC-WEB-PARENT` — [`SKILL.md`](SKILL.md), WEB-R01–WEB-R15 and P1–P10; sole policy owner.
- `SRC-WEB-IDEATION` — [`ideation.md`](ideation.md); discussion and feature-contract trace.
- `SRC-WEB-UI` / `SRC-WEB-UX` — child bundles selected by WEB-R03.
- `SRC-WEB-STANDARDS` — the versioned official standards listed by the parent, selected only when applicable.

Case IDs are permanent `WEB-SCENARIO-NN`. Checklist reservations are permanent `WEB-CHECK-NN`. A changed
discrimination receives a new ID.

## WEB-FAMILY-01 — One bounded feature outcome

- **Primary category:** 1. Scope and outcome are the defining discrimination.
- **Secondary:** 3, 4, 10.
- **Source:** WEB-R01, WEB-R15; P1.
- **Actor/outcome:** the intended user completes one feature without absorbing neighboring outcomes.
- **Applicability:** every run; gate.
- **Cases:** `WEB-SCENARIO-01`, `WEB-SCENARIO-02`.

### WEB-SCENARIO-01 — Complete login outcome

- **Primary type / coverage-role:** Good / {Good}; ordinary bounded completion.
- **Given/When/Then:** Given login scope includes entry, attempt, truthful status, recovery, and authenticated
  destination, when an eligible user signs in, then visible completion and server session state agree while
  registration, reset completion, administration, and onboarding stay out.
- **Failure oracle:** a polished form or redirect with no verified session or recovery fails.
- **Evidence tuple:** observe browser plus session state; run the complete path; confirm both completion signals.
- **Obligation:** bind the entire outcome and its adjacent non-goals.
- **Trace:** WEB-R01, WEB-R15; `WEB-CHECK-01`, `WEB-CHECK-12`.

### WEB-SCENARIO-02 — Shared code expands scope

- **Primary type / coverage-role:** Adversarial / {Adversarial}; code proximity games the boundary.
- **Given/When/Then:** Given adjacent account features share components and models, when they are proposed “for
  completeness,” then the run rejects them unless the user changes the outcome contract.
- **Failure oracle:** shared UI, route prefix, provider, or schema is accepted as product-scope authority.
- **Evidence tuple:** observe request and contract; compare completion signals; confirm independent outcomes.
- **Obligation:** implementation proximity must not broaden feature scope.
- **Trace:** WEB-R01, WEB-R15; `WEB-CHECK-01`.

## WEB-FAMILY-02 — Actors, contexts, and design evidence

- **Primary category:** 2. Represented people and use contexts define the discrimination.
- **Secondary:** 7, 8, 10.
- **Source:** WEB-R03, WEB-R04; P2.
- **Actor/outcome:** product owners and representative users supply distinct decisions and evidence.
- **Applicability:** every user-facing feature; gate.
- **Cases:** `WEB-SCENARIO-03`, `WEB-SCENARIO-04`, `WEB-SCENARIO-29`.

### WEB-SCENARIO-03 — Applicable UI and UX chains are completed

- **Primary type / coverage-role:** Good / {Good}; owner routing and design evidence succeed.
- **Given/When/Then:** Given the feature exposes browser UI and changes flow/recovery, when owner routing runs,
  then generic UI→web/UI and generic UX→web/UX complete their applicable acceptance gates before production
  realization is called release-ready.
- **Failure oracle:** loading only the child, or treating stakeholder approval as direct-user evidence, fails.
- **Evidence tuple:** observe load and acceptance records; inspect owner traces; confirm both applicable chains.
- **Obligation:** design owners and evidence status must be explicit.
- **Trace:** WEB-R03, WEB-R04; `WEB-CHECK-02`, `WEB-CHECK-03`.

### WEB-SCENARIO-04 — Missing representative evidence is hidden by technical completion

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; recovery from a missing design
  precondition is the discharge; its adversarial match is exercised independently by scenario 29.
- **Given/When/Then:** Given required representative users, consent, or accommodations are unavailable, when
  all automated tests pass, then design acceptance remains `NEEDS_CONTEXT` and release readiness is blocked
  while a recovery plan is recorded.
- **Failure oracle:** a green build, expert audit, or user waiver changes the design claim to accepted.
- **Evidence tuple:** observe evidence-condition and claim ledgers; inspect missing condition; confirm blocked
  readiness and planned recovery.
- **Obligation:** technical proof cannot replace design acceptance evidence.
- **Trace:** WEB-R04, WEB-R13; `WEB-CHECK-03`, `WEB-CHECK-13`.

### WEB-SCENARIO-29 — Technical green status is used to overwrite design status

- **Primary type / coverage-role:** Adversarial / {Adversarial}; a release claimant intentionally attempts to
  promote technical completion into design acceptance.
- **Given/When/Then:** Given the design ledger records missing or non-representative evidence, when a green
  build, audit, or implementation demo is used to rewrite that ledger as accepted, then the claim is rejected,
  the original design state remains, and release readiness stays blocked.
- **Failure oracle:** changing the technical status changes the design-acceptance status without new direct
  representative-user evidence.
- **Evidence tuple:** compare the frozen design and release claim ledgers; apply the technical-green claim;
  confirm design status and release blocking remain unchanged.
- **Obligation:** claim aggregation must reject technical evidence used as a design-acceptance override.
- **Trace:** WEB-R04, WEB-R13; `WEB-CHECK-03`, `WEB-CHECK-13`.

## WEB-FAMILY-03 — Vertical state and data behavior

- **Primary category:** 3. Correct state/effect transitions define the family.
- **Secondary:** 1, 4, 6.
- **Source:** WEB-R05, WEB-R07, WEB-R11; P3/P5–P7.
- **Actor/outcome:** browser, server, and data/provider state agree through completion.
- **Applicability:** every run; gate.
- **Cases:** `WEB-SCENARIO-05`–`WEB-SCENARIO-07`.

### WEB-SCENARIO-05 — Thin vertical skeleton proves one real path

- **Primary type / coverage-role:** Good / {Good}; the first end-to-end slice works.
- **Given/When/Then:** Given contracts, seams, errors, tests, and instrumentation points exist, when the
  smallest safe request traverses browser, server, and data/provider layers, then truthful completion is
  observed before breadth is added.
- **Failure oracle:** disconnected stubs or a client-only demo is called a vertical skeleton.
- **Evidence tuple:** observe trace and effects; execute the skeleton; confirm each layer and completion.
- **Obligation:** establish one real end-to-end path before filling the feature.
- **Trace:** WEB-R05, WEB-R07; `WEB-CHECK-04`, `WEB-CHECK-06`.

### WEB-SCENARIO-06 — Duplicate submission at the exact transition

- **Primary type / coverage-role:** Boundary / {Boundary}; before/at/after submit is exercised.
- **Given/When/Then:** Given one action may be submitted twice or retried at the response boundary, when two
  requests interleave, then client, server, and stored/provider state produce one permitted effect and one
  truthful outcome.
- **Failure oracle:** duplicate charge, account mutation, success message, or divergent state appears.
- **Evidence tuple:** observe states/effects; interleave exact requests; confirm idempotency and one outcome.
- **Obligation:** exact action boundaries need coherent duplicate and concurrency behavior.
- **Trace:** WEB-R07, WEB-R08; `WEB-CHECK-06`, `WEB-CHECK-08`.

### WEB-SCENARIO-07 — Client success hides missing server effect

- **Primary type / coverage-role:** Adversarial / {Adversarial}; optimistic UI games completion.
- **Given/When/Then:** Given the browser renders success, when the server transaction or provider effect
  fails, then the feature retracts false success, exposes recovery, and records the failure.
- **Failure oracle:** UI state or a client event alone closes the feature outcome.
- **Evidence tuple:** observe browser/server/data/telemetry; inject effect failure; confirm no false completion.
- **Obligation:** completion must join user-visible and authoritative system evidence.
- **Trace:** WEB-R01, WEB-R08, WEB-R10; `WEB-CHECK-08`, `WEB-CHECK-10`.

## WEB-FAMILY-04 — Interfaces, dependencies, and framework integration

- **Primary category:** 4. Consumer/producer contracts and dependency seams define the family.
- **Secondary:** 3, 6, 9.
- **Source:** WEB-R02, WEB-R05, WEB-R14; P3/P5.
- **Actor/outcome:** current consumers and providers keep a clear, compatible contract.
- **Applicability:** every cross-layer feature; gate.
- **Cases:** `WEB-SCENARIO-08`–`WEB-SCENARIO-10`, `WEB-SCENARIO-30`.

### WEB-SCENARIO-08 — Existing contracts are preserved deliberately

- **Primary type / coverage-role:** Good / {Good}; application fit succeeds.
- **Given/When/Then:** Given live routes, API/data contracts, auth controls, tests, and callers are mapped, when
  the feature changes them, then compatibility is preserved or a deliberate break and migration are recorded.
- **Failure oracle:** an “internal” change leaves a stale caller, schema, test, or document.
- **Evidence tuple:** observe affected map and diff; inspect consumers; confirm compatible or declared change.
- **Obligation:** every changed contract needs an owner-aware compatibility decision.
- **Trace:** WEB-R02, WEB-R05; `WEB-CHECK-04`, `WEB-CHECK-05`.

### WEB-SCENARIO-09 — Provider timeout after request acceptance

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; dependency fails after partial work.
- **Given/When/Then:** Given a provider accepts or ambiguously times out, when the server cannot know the final
  result, then state is marked pending/unknown, reconciliation is safe, retry is bounded, and the user is not
  told a false result.
- **Failure oracle:** blind retry duplicates the effect or generic error loses reconciliation state.
- **Evidence tuple:** observe state/provider keys; inject timeout; confirm containment and reconciliation.
- **Obligation:** dependency ambiguity needs explicit state, recovery, and observability.
- **Trace:** WEB-R05, WEB-R08; `WEB-CHECK-08`, `WEB-CHECK-09`.

### WEB-SCENARIO-10 — React integration violates the web contract

- **Primary type / coverage-role:** Alternative-valid / {Alternative-valid}; React is a materially different
  valid realization; framework-ownership gaming is exercised independently by scenario 30.
- **Given/When/Then:** Given a React realization uses server rendering, client routing, and component state,
  when hydration differs, a tree/key change resets user work, or routing breaks refresh/history, then the web
  feature fails without prescribing a React API fix.
- **Failure oracle:** “framework behavior” excuses semantic, continuity, or URL-contract regression.
- **Evidence tuple:** observe server/client render, state, and history; exercise mismatch/reorder/refresh;
  confirm web-contract violation.
- **Obligation:** frameworks must preserve hydration consistency, state intent, semantic output, and browser
  navigation outcomes.
- **Trace:** WEB-R10, WEB-R14; `WEB-CHECK-05`, `WEB-CHECK-10`.

### WEB-SCENARIO-30 — Framework ownership is used as an acceptance shortcut

- **Primary type / coverage-role:** Adversarial / {Adversarial}; framework authority intentionally attempts to
  replace operated web evidence.
- **Given/When/Then:** Given a framework or router is project-standard and its unit tests pass, when that status
  is offered instead of direct URL, history, semantic, recovery, and state-continuity proof, then every
  unobserved web claim remains open and any browser-contract failure blocks the feature.
- **Failure oracle:** library adoption, framework popularity, or framework-local tests satisfy a web outcome
  without operating the affected browser contract.
- **Evidence tuple:** inspect the framework claim and owner map; operate the omitted web paths; confirm the
  shortcut is rejected and any violation remains visible.
- **Obligation:** framework ownership cannot substitute for owner-correct web outcome evidence.
- **Trace:** WEB-R10, WEB-R14; `WEB-CHECK-05`, `WEB-CHECK-10`, `WEB-CHECK-14`.

## WEB-FAMILY-05 — Quality targets and resource evidence

- **Primary category:** 5. Context-owned quality targets define the discrimination.
- **Secondary:** 6, 8, 10.
- **Source:** WEB-R09, WEB-R10; P4/P8.
- **Actor/outcome:** users and operators receive evidenced feature quality without universal thresholds.
- **Applicability:** every run; target selection varies.
- **Cases:** `WEB-SCENARIO-11`–`WEB-SCENARIO-13`.

### WEB-SCENARIO-11 — Applicable quality targets have owners and sources

- **Primary type / coverage-role:** Good / {Good}; quality planning succeeds.
- **Given/When/Then:** Given the feature can affect access, locale, security, privacy, performance, resilience,
  cost, support, and compatibility, when targets are set, then each applicable property has a project target
  or a current source/method, evidence owner, and verification mode.
- **Failure oracle:** “fast,” “secure,” “accessible,” or one borrowed threshold appears without context.
- **Evidence tuple:** observe quality matrix; inspect sources and methods; confirm every applicable property.
- **Obligation:** quality claims need contextual targets and proof owners.
- **Trace:** WEB-R09; `WEB-CHECK-09`.

### WEB-SCENARIO-12 — Performance sits below, at, and above the target

- **Primary type / coverage-role:** Boundary / {Boundary}; exact target transition is measured.
- **Given/When/Then:** Given a sourced feature budget and representative context, when the path is measured
  below, at, and above it, then lab evidence is labelled, field evidence is not invented, and degradation/stop
  behavior follows the contract.
- **Failure oracle:** one local run or a global web threshold proves all users meet the target.
- **Evidence tuple:** observe method/environment/results; run exact boundary cases; confirm labelled claim.
- **Obligation:** performance needs exact, contextual, lab/field-separated evidence.
- **Trace:** WEB-R09, WEB-R13; `WEB-CHECK-09`, `WEB-CHECK-13`.

### WEB-SCENARIO-13 — Attractive screenshot substitutes for quality proof

- **Primary type / coverage-role:** Adversarial / {Adversarial}; visible polish games hidden quality gates.
- **Given/When/Then:** Given a polished capture at one viewport/state, when it is offered as proof of access,
  responsiveness, semantics, performance, or behavior, then only visible captured claims pass and the hidden
  claims remain unproved.
- **Failure oracle:** screenshot presence closes DOM, interaction, breakpoint, or timing evidence.
- **Evidence tuple:** observe capture metadata and missing sources; compare claim owners; confirm bounded result.
- **Obligation:** rendered evidence must remain limited to captured pixels/state.
- **Trace:** WEB-R10; `WEB-CHECK-10`.

## WEB-FAMILY-06 — Failure, recovery, and operations

- **Primary category:** 6. Detection, containment, recovery, and operator diagnosis define the family.
- **Secondary:** 3, 4, 5, 7.
- **Source:** WEB-R08, WEB-R12; P4/P7–P10.
- **Actor/outcome:** users and operators safely recover or stop.
- **Applicability:** every feature with state/effects; gate.
- **Cases:** `WEB-SCENARIO-14`–`WEB-SCENARIO-16`, `WEB-SCENARIO-31`.

### WEB-SCENARIO-14 — Known failure is truthful and recoverable

- **Primary type / coverage-role:** Good / {Good}; handled failure succeeds.
- **Given/When/Then:** Given a dependency or validation failure is known, when it occurs, then the user sees
  truthful status and an allowed retry/cancel/support path while operators receive diagnostic evidence.
- **Failure oracle:** generic error, dead end, secret-bearing log, or false success appears.
- **Evidence tuple:** observe UI/server/log state; inject failure; confirm recovery and safe diagnostics.
- **Obligation:** every known failure needs user recovery and operator diagnosis.
- **Trace:** WEB-R08, WEB-R09; `WEB-CHECK-08`, `WEB-CHECK-09`.

### WEB-SCENARIO-15 — Timeout and late result cross the exact boundary

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; late-result reconciliation defines
  the recovery discharge; an independent configured-limit boundary is exercised by scenario 31.
- **Given/When/Then:** Given an operation can finish just before, at, or after timeout, when the boundary is
  crossed, then one terminal interpretation, safe retry/cancel, late-result reconciliation, and telemetry
  remain coherent.
- **Failure oracle:** spinner hangs, two results appear, state is lost, or late success contradicts the UI.
- **Evidence tuple:** observe states/events; inject below/at/above timing; confirm one reconciled outcome.
- **Obligation:** exact timeout transitions need late-result and recovery behavior.
- **Trace:** WEB-R08; `WEB-CHECK-08`, `WEB-CHECK-09`.

### WEB-SCENARIO-31 — Retry stops at the configured limit

- **Primary type / coverage-role:** Boundary / {Boundary}; the below/at/above transition at the project-owned
  retry limit defines this case without requiring an injected dependency failure.
- **Given/When/Then:** Given a sourced bounded retry policy, when attempts occur below, at, and one beyond its
  exact limit, then permitted attempts retain one truthful outcome while the first disallowed attempt is
  refused before work, explains the next safe action, and does not amplify effects or cost.
- **Failure oracle:** an extra attempt starts work, the last permitted attempt is refused, or the interface
  silently loops past the configured bound.
- **Evidence tuple:** inspect the sourced limit; exercise below/at/above counts; confirm request, effect, status,
  telemetry, and next action at each point.
- **Obligation:** every configured retry limit needs exact enforcement before another effect begins.
- **Trace:** WEB-R08, WEB-R09; `WEB-CHECK-08`, `WEB-CHECK-09`.

### WEB-SCENARIO-16 — Retry converts recovery into duplicate harm

- **Primary type / coverage-role:** Adversarial / {Adversarial}; recovery control is exploited.
- **Given/When/Then:** Given the first result is ambiguous, when repeated manual, automatic, or replayed
  requests arrive, then authorization, idempotency, and reconciliation prevent duplicate money/data effects.
- **Failure oracle:** retry changes the outcome more than once or hides the first result.
- **Evidence tuple:** observe idempotency/auth/effects; replay requests; confirm one bounded effect.
- **Obligation:** retry paths must be safe under duplication and replay.
- **Trace:** WEB-R06, WEB-R08; `WEB-CHECK-07`, `WEB-CHECK-08`.

## WEB-FAMILY-07 — Security, privacy, consent, and abuse

- **Primary category:** 7. Harm and authority boundaries define the family.
- **Secondary:** 3, 4, 6, 10.
- **Source:** WEB-R06, WEB-R09; P3/P7/P8.
- **Actor/outcome:** only authorized actors cause permitted effects with minimized data exposure.
- **Applicability:** every run; gate.
- **Cases:** `WEB-SCENARIO-17`–`WEB-SCENARIO-19`.

### WEB-SCENARIO-17 — Trust and data boundaries are explicit

- **Primary type / coverage-role:** Good / {Good}; least-authority handling succeeds.
- **Given/When/Then:** Given untrusted browser/provider data and sensitive state cross boundaries, when the
  feature runs, then validation precedes privileged use, server authorization owns effects, secrets stay
  protected, consent/retention apply, and selected versioned security checks pass.
- **Failure oracle:** client validation, hidden controls, or TLS alone is called authorization/security.
- **Evidence tuple:** observe data/authority traces; test boundary inputs and access; confirm server enforcement.
- **Obligation:** validate, authorize, minimize, and version security evidence at each boundary.
- **Trace:** WEB-R06, WEB-R09; `WEB-CHECK-07`.

### WEB-SCENARIO-18 — Unauthorized actor calls the server directly

- **Primary type / coverage-role:** Negative / {Negative}; invalid authorization is safely rejected.
- **Given/When/Then:** Given an authenticated but unauthorized actor bypasses the UI, when the API/server action
  is called, then it rejects without effect or sensitive disclosure and records bounded security evidence.
- **Failure oracle:** hidden button, client role, or guessed identifier permits the effect.
- **Evidence tuple:** observe response/effects/log; call the boundary directly; confirm rejection and no leak.
- **Obligation:** authorization must be server-owned and object/action specific.
- **Trace:** WEB-R06; `WEB-CHECK-07`.

### WEB-SCENARIO-19 — Client-only guard is presented as security

- **Primary type / coverage-role:** Adversarial / {Adversarial}; visual/route protection games authority.
- **Given/When/Then:** Given the client hides an action and stores role/session state, when requests are forged,
  replayed, cross-site, or automated, then server controls, origin/session defenses, validation, and abuse
  limits still contain the attempt.
- **Failure oracle:** any prohibited effect or sensitive signal occurs because the browser was trusted.
- **Evidence tuple:** observe trust controls/effects; bypass the client; confirm containment.
- **Obligation:** browser state never replaces server trust enforcement.
- **Trace:** WEB-R06, WEB-R09; `WEB-CHECK-07`.

## WEB-FAMILY-08 — Accessibility and locale

- **Primary category:** 8. Equivalent operation and meaning define the family.
- **Secondary:** 2, 3, 7.
- **Source:** WEB-R03, WEB-R04, WEB-R09; `SRC-WEB-UI`, `SRC-WEB-UX`.
- **Actor/outcome:** people in applicable ability, input, language, and context variants complete and recover.
- **Applicability:** every user-facing feature; gate.
- **Cases:** `WEB-SCENARIO-20`–`WEB-SCENARIO-22`.

### WEB-SCENARIO-20 — Required paths work across applicable modalities

- **Primary type / coverage-role:** Good / {Good}; inclusion floor succeeds.
- **Given/When/Then:** Given applicable keyboard, assistive-technology, zoom/reflow, motion, pointer/touch, and
  language contexts, when the complete feature is used, then action, status, error, recovery, and completion
  remain equivalent.
- **Failure oracle:** the default visual/pointer path passes while another required path cannot complete.
- **Evidence tuple:** observe live behavior/DOM/user evidence; perform each claimed path; confirm outcome.
- **Obligation:** every required web path needs equivalent access and meaning.
- **Trace:** WEB-R04, WEB-R09, WEB-R10; `WEB-CHECK-03`, `WEB-CHECK-09`, `WEB-CHECK-10`.

### WEB-SCENARIO-21 — Locale and device context are alternative-valid

- **Primary type / coverage-role:** Alternative-valid / {Alternative-valid}; another valid locale/device runs.
- **Given/When/Then:** Given text expands, direction/formats change, viewport narrows, or network degrades,
  when the feature runs, then meaning, input, state, recovery, and completion remain coherent.
- **Failure oracle:** truncation, wrong format, reordered action, or lost work changes the outcome.
- **Evidence tuple:** observe matrix and behavior; run representative variants; confirm preserved meaning/state.
- **Obligation:** locale and context adaptation may not change the contract.
- **Trace:** WEB-R09; `WEB-CHECK-09`.

### WEB-SCENARIO-22 — Visual compliance hides inaccessible behavior

- **Primary type / coverage-role:** Adversarial / {Adversarial}; appearance games access.
- **Given/When/Then:** Given labels and contrast look correct, when keyboard order, focus restoration, accessible
  names/status, zoom/reflow, or error recovery are exercised, then any broken behavior fails the feature.
- **Failure oracle:** screenshot, token, or component-name inspection alone passes accessibility.
- **Evidence tuple:** observe DOM/tree/live interaction; operate affected paths; confirm failure or equivalence.
- **Obligation:** accessibility claims require hidden semantic and behavioral evidence.
- **Trace:** WEB-R10; `WEB-CHECK-10`.

## WEB-FAMILY-09 — Migration, compatibility, rollout, and rollback

- **Primary category:** 9. Change safety and reversibility define the family.
- **Secondary:** 4, 6, 7, 10.
- **Source:** WEB-R02, WEB-R11, WEB-R12, WEB-R14; P7/P10.
- **Actor/outcome:** existing users/data and operators survive change and reversal.
- **Applicability:** every feature changing contracts, state, configuration, or runtime behavior.
- **Cases:** `WEB-SCENARIO-23`–`WEB-SCENARIO-25`, `WEB-SCENARIO-32`.

### WEB-SCENARIO-23 — Compatible rollout preserves old and new paths

- **Primary type / coverage-role:** Change/regression / {Change/regression}; the before/during/after lifecycle
  comparison is the discharge; ordinary rollout readiness is exercised independently by scenario 32.
- **Given/When/Then:** Given existing clients, sessions, data, or provider state, when migration/rollout begins,
  then compatibility, sequencing, observability, stop conditions, and rollback keep data and outcomes valid.
- **Failure oracle:** mixed versions corrupt, strand, misread, or falsely complete the feature.
- **Evidence tuple:** observe before/during/after state; rehearse rollout matrix; confirm compatibility.
- **Obligation:** lifecycle change needs mixed-state and reversal proof.
- **Trace:** WEB-R02, WEB-R11, WEB-R12; `WEB-CHECK-11`, `WEB-CHECK-12`.

### WEB-SCENARIO-32 — Release change is prepared before deployment authority

- **Primary type / coverage-role:** Good / {Good}; ordinary release preparation defines this case while the
  change comparison remains scenario 23's discrimination.
- **Given/When/Then:** Given a production-complete feature changes routes, state, configuration, data, or a
  provider, when its release-ready handoff is prepared before any deployment, then sequencing, monitoring,
  stop conditions, partial-state handling, rollback/forward-fix, support, and the separate authority state are
  complete and resolvable by a cold operator.
- **Failure oracle:** planned work, a code-only rollback, or implied deployment authority is called a complete
  release-ready handoff.
- **Evidence tuple:** resolve the production and release bundle as a cold operator; rehearse the instructions;
  confirm every applicable control and the separate authority state.
- **Obligation:** ordinary release preparation must close the full operational handoff without deploying.
- **Trace:** WEB-R02, WEB-R11, WEB-R12; `WEB-CHECK-11`, `WEB-CHECK-12`.

### WEB-SCENARIO-24 — Framework child waives the web contract

- **Primary type / coverage-role:** Adversarial / {Adversarial}; specialization games ownership.
- **Given/When/Then:** Given React or another future child owns framework idioms, when it cites its convention
  to drop URLs, semantics, recovery, security, evidence, or release gates, then the specialization fails.
- **Failure oracle:** framework authority silently narrows a parent obligation.
- **Evidence tuple:** observe parent/child crosswalk; diff obligations; confirm omitted web behavior.
- **Obligation:** framework specialization must preserve the web feature contract.
- **Trace:** WEB-R03, WEB-R14; `WEB-CHECK-05`, `WEB-CHECK-14`.

### WEB-SCENARIO-25 — Rollback is attempted after an incompatible effect

- **Primary type / coverage-role:** Failure/recovery / {Failure/recovery}; recovery after a partial rollout is
  the discharge; lifecycle change is independently discharged by scenario 23.
- **Given/When/Then:** Given code, config, schema, or provider changes are partly active, when a stop condition
  fires, then rollback/forward-fix preserves data, reconciles effects, and restores an operable path.
- **Failure oracle:** code rollback leaves unreadable data, orphan effects, or no user recovery.
- **Evidence tuple:** observe state and instructions; rehearse partial rollback; confirm safe terminal state.
- **Obligation:** rollback must include data/provider and user-state consequences.
- **Trace:** WEB-R12; `WEB-CHECK-11`, `WEB-CHECK-12`.

## WEB-FAMILY-10 — Evidence and claim integrity

- **Primary category:** 10. Resolvable, owner-correct proof defines the family.
- **Secondary:** 1, 3, 5, 7.
- **Source:** WEB-R10, WEB-R13; P8–P10.
- **Actor/outcome:** a cold reviewer can verify every readiness claim without hidden context.
- **Applicability:** every run; gate.
- **Cases:** `WEB-SCENARIO-26`–`WEB-SCENARIO-28`.

### WEB-SCENARIO-26 — Claim-owner matrix supports a bounded handoff

- **Primary type / coverage-role:** Good / {Good}; evidence remains correctly separated.
- **Given/When/Then:** Given source, tests, browser/DOM, visual, direct-user, server/data, performance, telemetry,
  and release evidence exist, when readiness is reported, then each claim cites only its owner and limitations.
- **Failure oracle:** one evidence class is generalized to properties it cannot observe.
- **Evidence tuple:** observe matrix and artifacts; resolve each pointer; confirm bounded claim.
- **Obligation:** every claim needs owner-matched evidence and limits.
- **Trace:** WEB-R10, WEB-R13; `WEB-CHECK-10`, `WEB-CHECK-13`.

### WEB-SCENARIO-27 — Green tests conceal a broken released feature

- **Primary type / coverage-role:** Adversarial / {Adversarial}; final-green evidence games acceptance.
- **Given/When/Then:** Given unit/integration tests pass, when live browser flow, authorization, data effects,
  accessibility, telemetry, migration, or rollback is inspected, then any missing/broken applicable layer
  blocks release readiness.
- **Failure oracle:** one green suite or final build closes all feature checks.
- **Evidence tuple:** observe full matrix; exercise omitted layers; confirm readiness remains blocked.
- **Obligation:** technical green evidence cannot collapse multi-owner acceptance.
- **Trace:** WEB-R07, WEB-R10, WEB-R12; `WEB-CHECK-06`, `WEB-CHECK-10`, `WEB-CHECK-12`.

### WEB-SCENARIO-28 — Client completion event disagrees with server truth

- **Primary type / coverage-role:** Counterfactual / {Counterfactual}; the premise that client telemetry equals
  outcome truth is inverted.
- **Given/When/Then:** Given the client records completion but the authoritative effect is absent or reversed,
  when measurement is reconciled, then the outcome claim fails, instrumentation is corrected, and post-release
  validation remains pending.
- **Failure oracle:** a favorable client dashboard is accepted without server/effect reconciliation.
- **Evidence tuple:** observe client/server/effect events; join by bounded identity; confirm discrepancy route.
- **Obligation:** measurement must distinguish attempted, visible, and authoritative completion.
- **Trace:** WEB-R09, WEB-R13; `WEB-CHECK-09`, `WEB-CHECK-13`.

## Multi-role construction audit

Each original multi-role case was challenged with a dedicated single-type construction. Every secondary
discrimination was independently constructible or already had a distinct case, so no n-ary record remains.

| Original case | Attempted secondary construction | Disposition |
|---|---|---|
| `04` | intentional claim promotion can be exercised without making the evidence condition itself fail | keep Failure/recovery on `04`; append Adversarial `29` |
| `10` | framework-evidence gaming can be exercised without changing the alternative-valid React realization | keep Alternative-valid on `10`; append Adversarial `30` |
| `15` | a configured retry-count edge can be exercised without injecting a timeout or late result | keep Failure/recovery on `15`; append Boundary `31` |
| `23` | ordinary release preparation can be exercised without using the before/after change comparison as its discharge | keep Change/regression on `23`; append Good `32` |
| `25` | the existing `23` change case independently discriminates lifecycle compatibility | keep Failure/recovery on `25`; use existing Change/regression `23` |

The gaming probe rejected relabeled clones: `29` changes the claim-aggregation actor and oracle; `30` changes
the evidence shortcut; `31` changes the exact finite edge; and `32` changes the ordinary release-preparation
outcome. Each produces an observable result that its source case does not.

## Source-to-obligation ledger

| Parent rules | Scenarios | Reserved checks |
|---|---|---|
| WEB-R01, WEB-R15 | `01`, `02`, `07` | `01`, `12` |
| WEB-R02 | `08`, `23`, `32` | `04`, `05`, `11` |
| WEB-R03, WEB-R04 | `03`, `04`, `20`, `29` | `02`, `03`, `14` |
| WEB-R05 | `05`, `08`, `09` | `04`, `05` |
| WEB-R06 | `16`–`19` | `07` |
| WEB-R07 | `05`, `06`, `27` | `06` |
| WEB-R08 | `06`, `07`, `09`, `14`–`16` | `08` |
| WEB-R09 | `11`, `12`, `14`, `17`, `20`, `21`, `28`, `31` | `09` |
| WEB-R10 | `07`, `10`, `13`, `20`, `22`, `26`, `27`, `30` | `10` |
| WEB-R11 | `05`, `23`, `32` | `11` |
| WEB-R12 | `23`, `25`, `27`, `32` | `12` |
| WEB-R13 | `04`, `12`, `26`, `28`, `29` | `13` |
| WEB-R14 | `10`, `24`, `30` | `14` |

## Failability and omission audit

Every parent rule maps to a case and reserved check. All 32 cases map to a live parent rule, explicit
obligation, and check. Each family has a Good case and an adversarial face; every matrix omission names its
property. No coverage-role set contains more than one type. Polished screenshots,
client-only security, final-green tests, false client completion, framework authority, missing design evidence,
duplicate effects, and unsafe rollback all fail concrete cases. No exploratory or sensitive-evidence exemption
is used.
