---
name: desktop-development
description: "MUST load when coordinating a scoped change to an installable Electron desktop application written in TypeScript across requirements, design collaboration, implementation, software testing and verification, packaging, installed-artifact verification, release readiness, authorized publication or deployment, post-release operations, and maintenance."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Desktop Development

Use this operation to coordinate one accepted scoped change across the complete lifecycle of an installable
Electron desktop application written in TypeScript. The desktop development coordinator joins current owner
results and keeps their actors, evidence, failures, recovery, and authority boundaries distinct.

The operation begins with an accepted request and a current product contract, or creates that contract in
Requirements. It loads only the specialist owners required by the change and never replaces their policy,
facts, implementation, test work, release judgment, or independent evaluation.

Every retained target claim reaches `Release-ready` or a proved blocker. A cold handoff is the complete
transfer record a new operator needs to resume at the first unproved action without private or session
context. Matching point-of-action authority may instead continue the run through publication or deployment,
bounded post-release operations, and a recorded Maintenance decision.

## Principles

### Coordinate results, not specialist policy

Each judgment, fact, mechanism, implementation, and evidence class stays with its named owner. Coordination
accepts current results, detects disagreement, and returns conflicts to the earliest owner.

### Stage results are evidence boundaries

The ten stages name observable results, not a rigid waterfall. Complete slices may advance independently only
while their requirements, authority, owner, write boundary, and evidence subject remain stable.

### Installed state and runtime state are independent

Packaging, installation, process lifetime, window lifetime, and recovery require different evidence. No
state on one axis proves a state on another.

### Authority applies to one external action

Release readiness never grants authority to sign, notarize, use credentials, publish, deploy, promote, or
roll out. Verify authority immediately before the exact action and preserve a cold handoff when it is absent.

## Rules

- **MUST complete every applicable stage with its exact named result or a proved blocker.** Every stage record
  MUST name subject and scope, actor and owner, inputs, action or method, exact result, evidence location,
  dependencies and routes, failures and limitations, applicable authority, return or reopen condition, and
  next branch.
- **MUST accept the complete product contract in Requirements before dependent work.** A missing product
  judgment returns to the user or product authority; a missing fact, mechanism, implementation, or evidence
  returns to its named specialist.
- **MUST assemble only current, agreeing owner results and preserve their exact routes.** NEVER copy
  Architecture, Interface, operating-system, Electron, renderer, release-mechanism, or Evaluation policy into
  this operation.
- **MUST return a contradiction to the earliest owning decision and mark every dependent result stale.**
  Independent work may continue only when its stable inputs and evidence subject are unaffected.
- **MUST keep development evidence, installed-application state, runtime state, and design evidence separate.**
  NEVER let an operating-system fact or Electron mechanism choose an activation product outcome.
- **MUST stop before any external action without matching point-of-action authority and return an exact cold
  handoff.** Post-release work MUST be bounded, and every continued unblocked run MUST end with `Maintenance
  decision recorded`.

## Procedure

The coordinator is the actor for the operation. Start when an accepted request needs two or more owners or
makes a complete installed, release-ready, published, deployed, or maintained application claim; route a
bounded single-owner request directly to that owner.

The ten phases are obligation and result boundaries. A complete slice may move between Implementation,
Software testing and verification, Packaging, and Installation and installed-artifact verification as new
evidence arrives. A later contradiction returns to the earliest owning phase, and dependent evidence remains
stale until repeated or proved unaffected for the same subject.

For every phase, keep one stage record with the fields required by the first Rule. A proved blocker names the
exact blocked result; current development, installed, runtime, and evidence states; artifact and target
bounds; missing owner, evidence, authority, or environment; retained work; safe stop; required actor and
action; and resume condition.

### Phase 1 — Requirements

#### 1.1 Bind the product contract

- Take the accepted request, current product and design material, affected people, supported application
  versions, target operating-system and architecture tuples, existing owner results, and known constraints as
  inputs.
- Record the product problem, actors, target people and contexts, accepted behavior, supported targets, entry
  modes, and the observable completion, authoritative system completion, and false-completion conditions.
- Record normal and alternate paths across application use, runtime behavior, installation, exact-version
  update, repair or recovery, uninstall, and every affected data lifecycle.
- Record failure and recovery, support, authority, constraints, explicit non-goals, requirement trace, and the
  condition that reopens each material requirement.
- Route view, navigation, window, application-state, restoration, and activation product judgments to
  [`desktop-architecture`](../desktop-architecture/SKILL.md). Route research evidence, interface requirements,
  product identity, interaction or motion intent, accessibility, adaptation, and success measures to
  [`desktop-interface`](../desktop-interface/SKILL.md).
- Route current target facts to the matching
  [`desktop-windows`](../desktop-windows/SKILL.md),
  [`desktop-macos`](../desktop-macos/SKILL.md), or
  [`desktop-linux`](../desktop-linux/SKILL.md) Manual. Route release judgments to
  [`desktop-release`](../desktop-release/SKILL.md), and route mechanisms, implementation, and evidence to their
  exact owners.

#### 1.2 Accept the Requirements result

- Reconcile every material requirement with its actor, authority, owner, evidence need, dependency, failure,
  recovery, non-goal, and reopen condition.
- Ask the user or product authority to accept product choices and scope. Do not infer acceptance from a
  specialist result or from progress in a later phase.
- Record exactly `Requirements accepted` when the complete current product contract is accepted for the
  scoped change. Otherwise, return the unresolved choice or a proved blocker with retained inputs and the
  exact resume condition.

### Phase 2 — Design collaboration

#### 2.1 Assemble the seven design-activity results

- Ask `desktop-interface` for a current result for each activity: `Discovery research`, `Problem framing and
  design requirements`, `Concept alternatives`, `Prototyping`, `Representative-user testing`,
  `Design–implementation collaboration`, and `Post-release measurement and improvement`.
- Record exactly one disposition for each activity: `Performed for the current subject`, `Reused current
  evidence`, or `Not applicable with exact reason`.
- Retain each result's owner, exact subject, evidence location, limitations, dependencies, trace, and reopen
  condition. Assemble the result without copying Interface policy or its return table.
- Keep design–implementation collaboration active while realization or installed evidence can change product
  intent. Keep post-release measurement and improvement open until Phase 9 unless its current disposition is
  `Not applicable with exact reason`.

#### 2.2 Reconcile architecture, activation, and implementation constraints

- Assemble current, agreeing results from `desktop-architecture`, `desktop-interface`, the applicable OS
  Manual, [`electron-runtime`](../../electron/electron-runtime/SKILL.md),
  [`electron-development`](../../electron/electron-development/SKILL.md), and
  [`electron-testing`](../../electron/electron-testing/SKILL.md) for every Activation request in scope.
- Bind the request class, trust, target tuple, current process, instance, window and application state, and
  exactly one authoritative instance and application-state owner. The accepted Architecture outcome must be
  exactly one of create, reveal, focus, navigate, handle, no-op, or reject.
- Classify duplicate, stale, untrusted, malformed, unsupported, unavailable, and target-mismatched requests
  before state changes. Preserve or restore a named safe authoritative state on rejection or failure, and
  require a newly validated request or accepted fallback before recovery.
- Keep `Launching` distinct from `Activation request`: launching establishes a new process, while activation
  asks the installed product to handle an entry and may address an existing instance or cause a launch.
- Reconcile Architecture and Interface judgments with current Electron, renderer, operating-system, release,
  accessibility, localization, security, data, support, and resource constraints at their owners.
- Route Electron security, process, IPC, window, and native-default judgments to
  [`electron-design`](../../electron/electron-design/SKILL.md). Keep those judgments distinct from runtime
  facts, implementation, and test evidence.
- Record exactly `Design decisions accepted for the current subject` when all applicable design dispositions
  and owner results are current and agree. Return a contradiction to its earliest owner and mark dependent
  evidence stale.

### Phase 3 — Implementation

#### 3.1 Implement complete affected slices

- Use `Requirements accepted` and `Design decisions accepted for the current subject` as preconditions. Bind
  every slice to its exact requirement, owner, write boundary, target, acceptance condition, and evidence
  subject.
- Route Electron process, preload, IPC, window, lifecycle, native, and exact immediate-termination mechanism
  implementation to `electron-development`. An available event or mechanism cannot change the accepted
  product outcome.
- Route renderer journey and behavior to [`web-frontend`](../../web/web-frontend/SKILL.md). Load the applicable
  HTML, CSS, React, TypeScript, interaction, motion, configuration, localization, observability, security, and
  Web Platform owners for their exact triggers.
- Implement one smallest complete slice at a time across source, configuration, types, data, resources,
  documentation, and instrumentation. Preserve the first failure and reopen contradicted Requirements or
  Design collaboration before continuing dependent work.
- Record exactly `Implemented` only when every retained implementation slice is current, locally integrated,
  traceable to accepted decisions, and handed to its evidence owners. Name every unimplemented claim and
  return it rather than narrowing scope silently.

### Phase 4 — Software testing and verification

#### 4.1 Produce tests and verify bounded claims

- Give `electron-testing` and every applicable renderer, language, security, accessibility, packaging, and
  operating-system evidence owner the exact requirement, subject, target tuple, artifact or build, expected
  result, invalid cases, failure modes, recovery, and cheapest truthful seam.
- Keep software testing and verification separate: testing produces observations under recorded conditions;
  verification judges whether the complete current evidence supports the exact requirement and bounded
  claim. Independent Evaluation remains a different owner.
- Cover normal, alternate, invalid, rejected, interrupted, duplicate, stale, recovery, cleanup, restart,
  compatibility, and target-specific cases that apply. Distinguish product defects from environment gaps and
  preserve every unrun case and limitation.
- After a correction, repeat the failed layer and every dependent layer, or prove why an existing result is
  unaffected for the same subject. A passing source, type, build, or development-run check cannot prove an
  installed-artifact claim.
- Record exactly `Software-tested and verified` when every retained claim has current supporting evidence and
  no unresolved contradiction. Otherwise, narrow only with user authority or return the exact blocker.

### Phase 5 — Packaging

#### 5.1 Build the exact target artifact

- Give [`electron-release`](../../electron/electron-release/SKILL.md) the frozen source identity, Electron
  version, target operating systems and architectures, package formats, resources, native modules, update
  inputs, and current `desktop-release` judgments.
- Build through the established mechanism owner and record artifact identity, application version, target,
  checksum, contents, frozen inputs, build environment, logs, signature or notarization state, and known
  limitations.
- Before signing, notarization, credential use, or another external action, verify the exact point-of-action
  authority required by Phase 8. Preserve the unsigned or partially prepared artifact and return a cold
  handoff when authority is absent.
- Record exactly `Packaged` for each exact artifact whose bytes and identity are proved. A package, archive,
  unpacked directory, source build, or development run is not installed-artifact evidence.

### Phase 6 — Installation and installed-artifact verification

#### 6.1 Prove installed-application state

- Install the exact packaged artifact only on an authorized target tuple, then record the transition through
  `Not installed`, `Installation in progress`, and `Installed at exact version` as applicable. Verify files,
  identity, launch entries, registrations, native integrations, trust, and usable application result.
- Treat `Optional first-use pending/completed` only as accepted onboarding, consent, setup, or import product
  behavior. It never substitutes for first-launch or normal-launch evidence.
- For an update, record `Update in progress from A to B` with exact predecessor and candidate versions plus
  data, settings, schema, native, protocol, and channel compatibility. For repair, record `Repair or recovery
  in progress` and the exact usable installed version, `Recovered installed state`, or proved blocker.
- For uninstall, record `Uninstall in progress`, then prove `Removed` or a `Recovered installed state` with
  every promised residual. Name the disposition of application files, registrations, launch entries,
  integrations, user documents, settings, application data, caches, logs, indexes, downloads, temporary
  state, credentials, secrets, and tokens.
- For each uninstall disposition, record actor, authority, result, residual state, evidence, failure, and
  recovery.
- A partial install, update, repair, or uninstall ends only in an exact usable installed version, `Removed`,
  an explicit repairable state, or a proved blocker. Evidence from another artifact or target tuple cannot
  substitute.

#### 6.2 Prove runtime state and complete the installed result

- Exercise the applicable exact runtime states and transitions: `Not running`, `Launching`, `Activation
  request`, `Running with windows`, `Running with no windows`, `Background/tray mode`, `Window close`, `Normal
  quit`, `Abnormal termination`, `Later relaunch`, and `Qualified restart`.
- Name each applicable OS power or session event only from the matching Manual result for the exact tuple.
  Never create a universal suspend or resume state from different platform facts.
- Keep product transitions distinct. Window close does not imply Normal quit; Later relaunch does not prove
  state restoration; Qualified restart proves both the named stop and later start with version, input, state,
  authority, and failure evidence.
- Treat Electron `app.exit(code)` as an exact immediate-termination mechanism fact. When it ends a process
  outside the Normal-quit contract, record the product transition as `Abnormal termination`; a command or test
  `exit status` remains only a tool or test result.
- Record exactly `Installed and verified` only for the exact installed artifact, target tuple, installed state,
  runtime claims, data effects, failure paths, recovery, and limitations proved by current evidence.

### Phase 7 — Release readiness

#### 7.1 Assemble the release-readiness judgment

- Ask `desktop-release` to judge the exact artifact and target using current package identity, installed
  evidence, transition and data compatibility, recovery, support, observation and stop plan, applicable
  Evaluation, rollback or Forward fix, and known limitations.
- Define Forward fix at first use as a later compatible release that corrects a faulty version already
  installed on user machines. Keep it separate from a compatible rollback and prove either path at its owner.
- Confirm every retained target claim has current, agreeing Architecture, Interface, OS Manual, Electron
  runtime, implementation, testing, release-mechanism, and desktop release results as applicable.
- Record exactly `Release-ready` only for the exact artifact, target, version, channel, environment, recovery
  boundary, and evidence set accepted by the Release owner. Readiness grants no signing, credential,
  publication, deployment, promotion, or rollout authority.
- When evidence or an owner is missing, record the exact readiness blocker and resume condition. When the
  artifact is release-ready but the next action lacks matching authority, continue to Step 7.2.

#### 7.2 Return the cold handoff

- Use this branch when authority is absent, declined, expired, or narrower than the exact next external
  action. Do not execute the first command or cross the named external-system boundary.
- Record artifact path and checksum, target OS and architecture, application version, channel and environment,
  signature and notarization state, current evidence, and the actor who can authorize or perform the next
  action.
- Record the exact next action, first command or external-system boundary, destination, credential or signing
  identity and allowed-use boundary, pre-action checks, rollout or distribution stop thresholds, and
  triggering evidence.
- Record proved compatible rollback or the exact Forward fix route and recovery limits, retained artifacts
  and logs, current state, first unproved action, and exact resume point. This exact handoff is the terminal
  Release-readiness result when no matching authority exists.

### Phase 8 — Authorized publication/deployment

#### 8.1 Verify point-of-action authority

- Immediately before action, bind the exact action, artifact, target, version, channel, environment,
  destination, identity or credential, authorized actor, current evidence, and recovery boundary. General
  approval or authority for another action does not transfer.
- Continue only when the authority matches every bound field and remains current. Otherwise, return the Phase
  7 cold handoff without using a credential or changing an external system.
- Give the exact action to its Electron release, store, feed, infrastructure, deployment, promotion, or
  rollout mechanism owner. The desktop development coordinator delegates the authorized action to that owner
  and records the returned result; the coordinator uses no credential and executes no release mechanism
  itself.

#### 8.2 Verify the external result

- Verify the intended external destination and the resulting artifact bytes, installed bytes, configuration,
  channel, environment, or target state that the authorized action promised. An upload response or
  control-plane label alone is not publication, deployment, or installation proof.
- On failure, preserve local and external states, stop later actions, and use only a separately authorized
  retry, withdrawal, pause, rollback, or Forward fix. Authority never transfers to another credential,
  destination, channel, target, or recovery action.
- Record exactly `Published/deployed for the authorized action` only when the destination and resulting bytes
  or state match the authorized action. Otherwise, return a proved blocker with the exact safe stop and
  recovery authority.

### Phase 9 — Post-release operations

#### 9.1 Run bounded observation and support

- Before observation, name each question, signal, emitter, owner, consumer, destination, allowed data,
  retention, observation window, expected range, threshold, support route, stop condition, and authorized
  recovery action. Drop a signal with no named question or consumer.
- Verify signal arrival separately from signal interpretation. Missing, stale, sampled-out, or misrouted
  signals cannot prove product health, user success, or absence of harm.
- Stop at the finite window or named threshold. Do not turn the run into indefinite monitoring or perform a
  rollback, Forward fix, channel pause, or other external action without its own point-of-action authority.
- Reconcile the current `Post-release measurement and improvement` design-activity result with the observed
  evidence and its Interface owner. Route product defects, support findings, target facts, mechanism failures,
  and design findings to their exact owners.
- Record exactly `Post-release operation observed` when the bounded plan completes, or record the exact
  observation blocker or stop result with retained signals, affected target, safe state, owner, and resume
  condition.

### Phase 10 — Maintenance

#### 10.1 Record exactly one Maintenance decision

- Reconcile the scoped change, current installed and runtime states, post-release result, support findings,
  owner results, limitations, and remaining risks.
- Record exactly one decision: `no change`; `new accepted scoped change returning Requirements`; or
  `retirement trigger produces separate Retirement handoff`.
- For a new change, accept its evidence, owner, urgency, target, authority, and scope before returning to
  Phase 1. Do not append unaccepted work to the completed change.
- Record exactly `Maintenance decision recorded` with the selected decision, actor, evidence, affected
  targets, next owner, and reopen condition. A continued authorized run cannot close without this result.

#### 10.2 Prepare a Retirement handoff when triggered

- Treat Retirement as an adjacent lifecycle, never an eleventh stage. Record subject, affected users and
  installed versions, target, channel, store or feed, usage and support evidence, and replacement, update, and
  uninstall effects.
- Record data export, retention, deletion, and migration; communication and support obligations; external
  systems; stop conditions; first irreversible action; authority; and resume point.
- Execute no deprecation, withdrawal, feed mutation, data disposition, support shutdown, communication, or
  uninstall action from this operation. Those actions require separately accepted scope and exact
  point-of-action authority.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
