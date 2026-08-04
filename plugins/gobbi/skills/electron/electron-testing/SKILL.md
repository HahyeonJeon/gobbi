---
name: electron-testing
description: "MUST load when designing, implementing, running, or interpreting Electron-specific tests across process, bridge, security, application lifecycle, operating-system integration, diagnostics, packaged, installed, or update boundaries."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Testing

Use this operation to design, implement, run, and interpret Electron-specific tests. It covers process,
bridge, security, application lifecycle, operating-system integration, diagnostics, packaged, installed, and
update claims.

The outcome is one request-specific, subject-specific, target-specific, and environment-classified Electron
evidence record, or an explicit stopped result that names the last accepted state and missing evidence.

Testing is the sole owner of Electron-specific test design, test implementation, execution, interpretation,
environment classification, rerun decisions, and evidence records. It may change authorized test code and
fixtures. It never changes product code to make a test pass, sets product policy, constructs or mutates an
artifact, accepts or rejects a candidate, decides release readiness, publishes, rolls out, or completes a
multi-owner delivery.

## Principles

### Claims select the observable test layer

Start with the claim and the observation that could disprove it. Use the lowest-cost layer that can make that
observation, and move upward only when the lower layer cannot observe the required Electron behavior.

### Identity and environment limit every result

A result applies only to the recorded request, subject, target operating system and architecture, Electron
major, test inputs, and execution environment. Missing required environment evidence cannot become a pass.

### Lifecycle paths remain separate

Installation, launch, background operation, external entry, suspend, quit, shutdown, update, process failure,
uninstall, and recovery have different triggers and observations. Cold-start and running-application
deep-link and file-open entry are four independent paths.

### Failures remain attributable

Preserve the first failing observation. Classify the result from evidence, route the defect to the earliest
responsible owner, and rerun every affected and dependent case after an authorized correction.

## Rules

- **MUST keep Testing the sole Electron-specific test authority.** Testing alone designs and implements test
  code and fixtures, chooses test layers and environments, runs and interprets tests, classifies each
  environment, decides affected reruns, and creates the evidence record.

- **MUST identify every request before test work starts.** Record a unique request identity, requesting owner
  and exchange type, lower-tier claim and record identity, subject identity, target operating system and
  architecture, Electron major, requested scenarios, required environment, risks, failure modes, predecessor
  evidence, and observable pass conditions.

- **MUST map every claim to the lowest-cost observable test layer.** Keep source, type, and build checks
  separate from behavior evidence. Preserve an existing test framework when it can observe the claim, and
  state the missing observation before selecting a higher-cost layer.

- **MUST cover every applicable success, invalid, failure, recovery, adversarial, target-specific, security,
  diagnostics, application-lifecycle, packaged, installed, and update path.** Record an evidence-backed
  `unsupported target or claim` or `not run` result when a path cannot execute.

- **MUST return one complete evidence record or an explicit stopped result.** Classify each case as exactly
  `passed`, `product defect`, `test defect`, `environment gap`, `unsupported target or claim`, or `not run`.
  Invalidate and rerun affected and dependent cases after any subject, test, configuration, environment,
  candidate, release-metadata, target, predecessor, or policy change.

- **NEVER leave Testing's authority to make a suite green.** Testing may correct authorized test code or
  fixtures after proving a `test defect`. It never changes product code, suppresses a failure, weakens a
  security setting, skips an in-scope target, changes requested claims after results exist, mutates an
  artifact, or makes a Packaging, Release, or Delivery decision.

## Procedure

### Phase 1 — Accept and Identify the Evidence Request

#### 1.1 Classify the request source and authority

- Accept a direct lower-tier request from Runtime, Interface, Design, Contract, Development, or Observability
  when it supplies a claim that needs Electron-specific evidence. Treat those skills as static claim
  authorities, not as test authorities.
- Accept a Packaging request only through a labeled `Packaging ↔ Testing` work record. Accept a Release
  request only through a labeled `Release ↔ Testing` work record. These are dynamic request and return
  exchanges, not static skill references and not transfers of test ownership.
- Record the requesting owner, request identity, requested claims and scenarios, evidence consumer, and
  decision that the consumer owns. Testing records results. The requesting owner retains its product
  judgment.

#### 1.2 Establish the evidence identity

- Create the identity tuple from the request identity, lower-tier claim and record identity, subject identity,
  target identity, and environment identity. Do not reuse an evidence identity across a changed tuple.
- For source work, record the source commit or digest and relevant configuration identity. For candidate work,
  record the build-input identity, immutable candidate checksum, artifact path, and construction provenance.
  For release work, also record the release-metadata identity, channel, update mechanism, supported
  predecessor, and compatibility-policy identity.
- Record the target operating system, architecture, Electron major, test implementation and fixture
  identities, runner and configuration identity, required services and permissions, display requirements,
  credentials or signing prerequisites when applicable, and any installed-state prerequisite.

#### 1.3 Validate the request or stop

- Require each requested scenario to state its claim, starting state, trigger, expected observation, pass
  condition, required environment, material risks, and failure conditions. Ask the requesting owner to
  complete policy or product meaning; Testing does not invent it.
- Reject a request with conflicting subject identities, a mutable or missing candidate checksum, mismatched
  release metadata, an unspecified target, or an untraceable lower-tier claim.
- When a required environment is already known to be unavailable, create an `environment gap` result. Return
  the affected claim, blocker, available diagnostic facts, last accepted state, and narrowest way to resume.
  Do not execute a proxy case and call the requested claim passed.

### Phase 2 — Map Claims to Test Layers and Cases

#### 2.1 Build the claim, layer, and pass-condition map

- Map pure parsers, validation, allowlists, state transitions, path containment, and result mapping to pure
  logic tests.
- Keep source inspection, type checks, and build checks as construction evidence. They do not establish
  loader behavior, process placement, semantic authorization, installed behavior, or update behavior.
- Map domain services and privileged handlers to service or handler tests. Map exposed preload methods,
  channel translation, data-only callbacks, subscription disposal, and unavailable capabilities to bridge
  contract tests.
- Map Electron loader, process, IPC transport, context-isolation, sandbox, window, session, application
  lifecycle, and operating-system behavior to real Electron integration tests.
- Map activated trust surfaces to adversarial security tests. Map emitted paths and resources to packaged
  application tests, operating-system registration and launch to installed application tests, and version
  transition and recovery to update tests.
- Name the observation missing from each lower layer before using a higher layer. A document reading or source
  search cannot replace an executed semantic test.

#### 2.2 Use the existing framework and declare execution environments

- Read the test framework, helpers, fixtures, process launchers, test commands, CI targets, artifact inputs,
  and evidence storage before implementing a test. Preserve them when they can observe the requested claim.
- Electron does not require one test framework. Its current [automated-testing
  guidance](https://www.electronjs.org/docs/latest/tutorial/automated-testing) documents WebDriver,
  Playwright, and custom driver approaches. Select from the project's installed approach unless the claim
  requires a capability it lacks.
- Declare each required execution environment before the run. Electron's [headless CI
  guidance](https://www.electronjs.org/docs/latest/tutorial/testing-on-headless-ci) states that Chromium needs
  a display driver; without one, Electron does not launch and tests do not execute. Classify that condition as
  an environment gap for any affected claim.

#### 2.3 Build the case matrix

- Give each claim success, invalid input, expected failure, recovery, and target-specific cases where they
  apply. Add cancellation, timeout, duplicate delivery, teardown, restart, and missing-capability cases when
  the lower-tier contract contains them.
- Give every reachable trust boundary its own adversarial case. Vary sender frame, sender origin, payload,
  requesting and embedding origins, session or partition, navigation type, requested child window, and guest
  attachment independently.
- Give each case one stable test identity, exact starting state, fixture identity, action, expected
  observation, cleanup, dependency list, and rerun condition.
- State an explicit evidence-backed `unsupported target or claim` when the lower-tier authority excludes a
  target or claim. Use `not run` only when a planned case did not execute and the record names why.

#### 2.4 Expand the complete installed lifecycle

- Create independent cases for installation and partial-install recovery; first launch or cold start,
  initialization, ready, and first-run recovery; active windows, no-window state, supported background or
  tray-only operation, window recreation, last-window close, and close-versus-quit behavior.
- Create independent cases for second-instance handling and duplicate-effect prevention; suspend and resume;
  ordinary quit, complete stop, relaunch, and state restoration; operating-system shutdown and next-launch
  recovery; update restart, migration, validation, version reporting, refusal, and recovery.
- Create independent cases for renderer unresponsive and responsive transitions, renderer crash and
  replacement or recovery, utility or child process failure and containment, main-process exit with external
  crash capture, uninstall completion or failure, retained or removed local data, and recovery or support.
- Keep target availability and evidence explicit. The [app
  events](https://www.electronjs.org/docs/latest/api/app), [webContents
  events](https://www.electronjs.org/docs/latest/api/web-contents), [powerMonitor
  events](https://www.electronjs.org/docs/latest/api/power-monitor), and [utilityProcess
  events](https://www.electronjs.org/docs/latest/api/utility-process) have different process, timing, and
  operating-system conditions.
- Create four independent external-entry cases:
  - **Cold-start deep-link entry:** prove registration and cold launch, capture before readiness, URL and
    authority validation, delivery after the receiver is ready, correct instance and window, destination or
    visible refusal, preserved input, duplicate handling, recovery, diagnostics, and installed observation.
  - **Running-application deep-link entry:** prove running delivery, validation before side effects, one
    delivery to the correct existing instance and current or created window, preservation of current work,
    destination or visible failure, duplicate handling, recovery, diagnostics, and installed observation.
  - **Cold-start file-open entry:** prove file association and cold launch, capture before readiness, file
    reference, type, access, and contract validation, delivery after readiness, correct instance and window,
    open or visible refusal, preserved input, recovery, diagnostics, and installed observation.
  - **Running-application file-open entry:** prove running delivery, validation before side effects, one
    delivery to the correct existing instance and current or created window, preservation of current work,
    open or visible failure, duplicate handling, recovery, diagnostics, and installed observation.

### Phase 3 — Implement Focused Electron Tests

#### 3.1 Implement the lowest applicable layers first

- Add or change only authorized test code and fixtures. Keep fixtures smaller than the product contract they
  expose, and do not recreate Electron internals in a test double.
- Give every sender fixture an exact URL, frame state, origin, session, and trust classification. Give every
  payload fixture a valid or invalid reason. Control time, cancellation, process exit, and operating-system
  results at a narrow layer when that layer can observe the claim.
- Assert success, validation, error mapping, cleanup, repeat registration, restart, and resource ownership at
  service and handler layers. Assert exact exposed methods, data-only callbacks, serialization, unavailable
  capabilities, and disposer behavior at the bridge layer.

#### 3.2 Implement process, bridge, and security cases

- Use the actual emitted main and preload entries for loader, process, module-format, bridge, IPC, sandbox,
  context-isolation, window, or session claims. Test the privileged process's rejection of a missing or
  detached `event.senderFrame`, wrong sender origin, and malformed payload before any side effect.
- Test absent and weak `Content-Security-Policy` values separately on every renderer delivery path. Observe
  the response header or document policy and prove that a disallowed script or resource is blocked.
- Test the accepted explicit values and unauthorized security-reducing values independently for
  `nodeIntegration`, `contextIsolation`, `sandbox`, `webSecurity`, `allowRunningInsecureContent`,
  `experimentalFeatures`, and `enableBlinkFeatures`. Observe the actual created renderer; one generic window
  assertion cannot establish each key.
- Exercise `setPermissionCheckHandler` and `setPermissionRequestHandler` separately on the default session and
  every secondary session or partition. Vary requesting origin, embedding origin, frame facts, and permission,
  and test the lower-tier default-denial claim.
- Exercise allowed and denied main-frame, subframe, and redirect navigation through `will-navigate`,
  `will-frame-navigate`, and `will-redirect`, including later-created `webContents`.
- Attempt later-created and secondary-session window requests. Prove `setWindowOpenHandler` decides before a
  child is created. Attempt disallowed URL, preload, preferences, and requested partition values at
  `will-attach-webview`; prove each denied guest is never created.
- Attempt denied external URL, custom-protocol traversal, wrong-origin IPC, and malformed-payload paths that
  the feature can reach. Pair every authorized security-reducing exception with its authority record and a
  limited real-Electron test. Electron's current [security
  guidance](https://www.electronjs.org/docs/latest/tutorial/security) remains a current upstream fact source;
  the pinned lower-tier claim remains the requirement under test.

#### 3.3 Implement lifecycle, process-failure, and diagnostics cases

- Register and observe lifecycle events at the timing required by the lower-tier claim. Current Electron
  documents early `open-file` and `open-url` listener requirements and guarantees `second-instance` after
  `ready` in the [app API](https://www.electronjs.org/docs/latest/api/app); reconcile those current facts with
  the pinned Electron major before using them.
- Keep `unresponsive` and `responsive` observations separate from `render-process-gone`. Keep renderer
  disappearance separate from `child-process-gone`, utility-process `exit`, and main-process exit.
- Prove the requested visible outcome, accepted input and local-data preservation, duplicate handling,
  cleanup, bounded retry or restart, recovery, diagnostics, and support result for each applicable lifecycle
  and failure case.
- Capture renderer console, main-process output, correlation fields, crash or hang evidence, and
  operating-system observations through the accepted Observability mechanism. Test diagnostic arrival and
  redaction when requested. Never weaken a security control, change production emission, or treat diagnostic
  presence as proof of the behavior claim.

#### 3.4 Implement packaged, installed, and update cases

- Run packaged cases only against the immutable candidate checksum named by the request. Observe emitted
  entries, resources, archive placement, compiled modules, fuses, signatures when required, launch paths, and
  packaged behavior without changing artifact bytes.
- Run installed cases from the supplied installation instructions. Observe install, first launch, registered
  external entry, windows, application lifecycle, operating-system integration, local-data behavior,
  uninstall, recovery, and diagnostics on the requested operating system and architecture.
- Run update cases against the exact candidate, predecessor, channel, update mechanism, release metadata, and
  compatibility policy named by the request. Cover download, metadata, install, restart, migration,
  version-reporting, refusal, recovery, and every requested tamper or interruption path.
- Reconcile current `autoUpdater` support and event facts from the [official
  API](https://www.electronjs.org/docs/latest/api/auto-updater) with the pinned Electron major and accepted
  release policy. Do not generalize an updater result to an unsupported target or a different mechanism.

### Phase 4 — Execute, Record, and Classify

#### 4.1 Run from lower-cost to higher-cost layers

- Confirm the subject and environment identities immediately before execution. Stop on drift rather than
  attaching a result to stale identities.
- Run focused pure logic, construction, service, and bridge checks before real Electron integration,
  adversarial security, lifecycle, packaged, installed, and update cases. A higher layer does not erase a
  lower-layer failure.
- Record the exact command, working directory, start and end time, exit status, relevant output, and evidence
  location for every case. Sanitize secrets and user data without removing facts required for diagnosis.

#### 4.2 Classify every case

- Use `passed` only when the requested subject produced every expected observation in the required
  environment.
- Use `product defect` when the product violates the lower-tier claim. Use `test defect` when the test,
  fixture, runner, or test configuration cannot validly observe the claim.
- Use `environment gap` when a required environment is absent or incompatible. Use
  `unsupported target or claim` only from evidence supplied by the responsible lower-tier authority.
- Use `not run` when a planned case did not execute. Record its blocker, affected claims, dependencies, last
  accepted state, and resume condition. Never report `environment gap`, `unsupported target or claim`, or
  `not run` as `passed`.

#### 4.3 Diagnose and route without changing product ownership

- Preserve the first failing command, output, subject identity, environment identity, and evidence location.
  Find the earliest observation that differs from the claim before choosing a responsible owner.
- Route product behavior defects to the earliest lower-tier claim owner. Route diagnostic emission, arrival,
  or redaction defects to Observability; source construction defects to Development; candidate byte or
  package-configuration defects to Packaging; release-policy or metadata defects to Release; and current
  Electron mechanism contradictions to Runtime.
- Return identity conflicts to the requesting owner. Do not reinterpret the claim, accept or reject a
  candidate, decide readiness, modify product code, modify artifact bytes, or perform an external action.

### Phase 5 — Invalidate, Correct Tests, and Rerun

#### 5.1 Invalidate evidence after a relevant change

- Invalidate every affected case when the subject, source commit or digest, test implementation, fixture,
  test configuration, execution environment, Electron major, candidate checksum, release-metadata identity,
  target operating system or architecture, predecessor, channel, update mechanism, policy, required
  environment, or predecessor evidence changes.
- Follow declared case dependencies. Mark each direct and dependent result stale, preserve its evidence, and
  link it to the replacement request or run. Do not overwrite or silently reuse an earlier pass.

#### 5.2 Correct only a proved test defect

- Reproduce a `test defect` before editing. Correct only authorized test code, fixtures, runner settings, or
  test configuration, and record the reason the correction makes the observation valid.
- Never change product code, product configuration, packaged bytes, release metadata, a target claim, or a
  required environment to make a test pass. Return those needs to their owners.
- Preserve the failed test record beside the corrected test identity and result. A flaky or timing-sensitive
  failure remains a failure until its cause is established.

#### 5.3 Rerun the affected dependency set

- Rerun the focused failing case, every case that depends on its subject or observation, and every security,
  lifecycle, packaged, installed, or update case whose premise changed.
- Recheck subject and environment identities before each rerun. Create a new run identity and link it to the
  invalidated result.
- Stop with the retained evidence when an authorized correction is unavailable, the same required environment
  remains unavailable, or the responsible owner has not supplied a replacement subject.

### Phase 6 — Return the Evidence Record or Explicit Stop

#### 6.1 Complete the dynamic Packaging exchange

- Receive the `Packaging ↔ Testing` request identity, recorded build-input identity, candidate artifact
  checksum, artifact path, target operating system and architecture, installation instructions, artifact
  claims, requested packaged and installed cases, required environments, and pass conditions.
- Return the same request, build-input, candidate, target, and case identities. Add each environment
  classification, commands, observations, classifications, evidence locations, failures, limitations,
  unrun blockers, rerun links, and the narrowest reproduction.
- Packaging alone checks completeness and identity, then accepts or rejects the candidate. Testing neither
  changes the artifact nor makes that decision. A failed case or unavailable required environment returns an
  explicit stop for the affected installed claim.

#### 6.2 Complete the dynamic Release exchange

- Receive the `Release ↔ Testing` request identity, immutable candidate record and checksum, target operating
  system and architecture, supported predecessor set, update mechanism, release-metadata identity, channel,
  compatibility policy, rollout and withdrawal claims, recovery claims, requested update scenarios, required
  environments, and pass conditions.
- Return matching request, candidate, target, predecessor, mechanism, metadata, channel, policy, scenario, and
  environment identities. Add predecessor, update, install, restart, migration, version-reporting, recovery,
  rejection, interruption, and tamper evidence or an explicit classification for every requested scenario.
- Release alone interprets its policy, checks the identity-matched returned record, and accepts readiness or
  stops. Testing neither changes release metadata nor makes that decision. A failed case or unavailable
  required environment stops the affected target at its last accepted state.

#### 6.3 Return the terminal Testing record

- Record: evidence identity; request identity, owner, and exchange type; lower-tier claim and record identity;
  subject, source, configuration, candidate, and release identities where applicable; target operating
  system, architecture, and Electron major; test, fixture, runner, and environment identities; required and
  observed prerequisites; scenario and case identities; commands, times, exit status, expected and observed
  results; exact classification; sanitized relevant output and evidence locations; first failing evidence;
  corrections, invalidations, dependencies, and rerun links; unrun blockers; limitations; residual risks;
  routed owner; narrowest reproduction; predecessor evidence; and replacement evidence identity.
- Return the record to every affected lower-tier owner. Keep construction, real-Electron runtime, security,
  application-lifecycle, diagnostics, packaged, installed, and update evidence labeled as distinct classes.
- Complete only when every requested case has one exact classification and every field has a value or explicit
  not-applicable status. Otherwise return an explicit stopped result with the failed request and case, last
  accepted state, retained evidence, responsible owner, required next input, and narrowest resume point.
- When this test work is evaluated, the [evaluation checklist](checklists.md) and every checklist owned by an
  active `electron` sibling supply the applicable conditions. The general Evaluation operation resolves them
  and issues any verdict.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
- [Electron Release](../electron-release/SKILL.md) owns release policy, readiness decisions, and external
  actions.
- [Electron Packaging](../electron-packaging/SKILL.md) owns artifact construction, immutable candidate
  records, and candidate acceptance.
- [Electron Observability](../electron-observability/SKILL.md) owns diagnostic emission, correlation,
  redaction, arrival, and retention.
- [Electron Development](../electron-development/SKILL.md) owns product source implementation and
  construction evidence.
- [Electron Contract](../electron-contract/SKILL.md) owns installed application lifecycle and
  operating-system behavior claims.
- [Electron Design](../electron-design/SKILL.md) owns process, bridge, security, window, session, and resource
  policy.
- [Electron Interface](../electron-interface/SKILL.md) owns application identity, interaction intent,
  accessibility, and operating-system convention preferences.
- [Electron Runtime](../electron-runtime/SKILL.md) owns current Electron mechanism facts and version
  reconciliation.

These are static claim sources. The `Packaging ↔ Testing` and `Release ↔ Testing` exchanges above are dynamic
work records, not static reference edges.
