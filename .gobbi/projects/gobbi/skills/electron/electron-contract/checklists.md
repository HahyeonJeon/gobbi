# Electron Contract Evaluation Checklist

This reusable unchecked source evaluates one installed Electron application contract under the local
preference. The source commit that contains this file identifies the checklist version. Its stable owner
prefix is `ELECCONT`.

This file defines reusable coverage only. Evaluation selects applicable rows, resolves cross-references, and
owns filled copies, observations, row results, findings, coverage closure, and verdicts. Preserve every row as
an unchecked binary condition.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that the scenario reuses, carries no checkbox, and does not create a second condition.

## Project

### ELECCONT-SC-PROJECT-01 — Normal case: one target-specific installed contract

An ordinary contract defines observable behavior for named actors and installed targets. It succeeds when
authority, targets, and identities are explicit; it fails when source behavior or a generic application name
stands in for an installed promise.

#### Checklist

- [ ] ELECCONT-CK-PROJECT-01-01 — The subject is one installed Electron application contract.
- [ ] ELECCONT-CK-PROJECT-01-02 — The contract names every affected actor and the decision authority.

### ELECCONT-SC-PROJECT-02 — Rule violation: the contract claims another owner's work

The contract reaches past installed observable promises into a mechanism, implementation, evidence, artifact,
release, or delivery decision. It succeeds by treating those decisions as external inputs; it fails when it
selects or judges their policy.

#### Checklist

- [ ] ELECCONT-CK-PROJECT-02-01 — No contract choice decides API or mechanism selection, technical architecture, source implementation, test design or execution, evidence creation or interpretation, environment classification, evidence acceptance, diagnostic emission, artifact construction, release, or delivery coordination.

## Structure

### ELECCONT-SC-STRUCTURE-01 — Normal case: installation, activity, and exit states are complete

The state map covers the ordinary installed lifetime from absence through use and removal. It succeeds when
each state change has its own observable meaning; it fails when installation, windows, quit, or uninstall are
treated as implied by another state.

#### Checklist

- [ ] ELECCONT-CK-STRUCTURE-01-01 — The state map keeps not installed, installing, and installed as distinct states.
- [ ] ELECCONT-CK-STRUCTURE-01-02 — The state map keeps first launch or cold start, initializing, and ready as distinct states.
- [ ] ELECCONT-CK-STRUCTURE-01-03 — The state map keeps active with windows, active without windows, and supported background or tray-only operation as distinct states.
- [ ] ELECCONT-CK-STRUCTURE-01-04 — The state map defines second-instance and other supported alternate-entry behavior.
- [ ] ELECCONT-CK-STRUCTURE-01-05 — The state map distinguishes last-window close, ordinary quit, stopped, and relaunch behavior.
- [ ] ELECCONT-CK-STRUCTURE-01-06 — The state map defines uninstalling and uninstalled behavior, including the fate of every local data category.

### ELECCONT-SC-STRUCTURE-02 — Edge case: interruption and process failures change the active state

Power changes, update restart, renderer loss, and service loss interrupt an active application through
different paths. It succeeds when each transition has an independent observable outcome and recovery; it
fails when a generic restart or crash case substitutes for one of them.

#### Checklist

- [ ] ELECCONT-CK-STRUCTURE-02-01 — Suspend and resume state the paused work, preserved state, resource revalidation, resulting mode, and recovery.
- [ ] ELECCONT-CK-STRUCTURE-02-02 — Operating-system shutdown states the target-supported exit behavior, bounded safe persistence, incomplete-state detection, and next-launch recovery.
- [ ] ELECCONT-CK-STRUCTURE-02-03 — Update restart states user authority, accepted-input treatment, data compatibility, migration, validation, restart result, and recovery.
- [ ] ELECCONT-CK-STRUCTURE-02-04 — Renderer unresponsiveness states that actions which could lose or overwrite data remain unavailable, the wait limit, responsive return, renderer replacement, application recovery, and visible stop choices.
- [ ] ELECCONT-CK-STRUCTURE-02-05 — Renderer crash states the affected window, how persisted data is handled, renderer replacement, safe-state restoration, relaunch, and visible stop choices.
- [ ] ELECCONT-CK-STRUCTURE-02-06 — Utility or child failure states the affected capability, containment, bounded restart, reduced mode, relaunch, and visible stop choices.

### ELECCONT-SC-STRUCTURE-03 — Expected failure: the main process exits

The application cannot perform in-process recovery after its main process has exited. It succeeds when the
contract requires an externally observable stop and a later recovery path; it fails when an in-process
callback is presented as post-exit recovery.

#### Checklist

- [ ] ELECCONT-CK-STRUCTURE-03-01 — Main-process exit states external crash capture, observable stop, relaunch, state validation, recovery, and support.

## Performance

### ELECCONT-SC-PERFORMANCE-01 — Edge case: waits and retries remain bounded and visible

Initialization, external delivery, update restart, and failure recovery can wait or retry. It succeeds when
the user can perceive a pending state and each limit ends predictably; it fails through an indefinite wait,
unbounded retry, or a repeated state change already accepted as final.

#### Checklist

- [ ] ELECCONT-CK-PERFORMANCE-01-01 — Every wait that can affect use has a visible pending state.
- [ ] ELECCONT-CK-PERFORMANCE-01-02 — Every wait has a finite timeout.
- [ ] ELECCONT-CK-PERFORMANCE-01-03 — Every expired timeout has a visible outcome.
- [ ] ELECCONT-CK-PERFORMANCE-01-04 — Every retryable transition has a finite retry limit.
- [ ] ELECCONT-CK-PERFORMANCE-01-05 — No retry repeats a state change the application or operating system has accepted as final.

## Aesthetics

### ELECCONT-SC-AESTHETICS-01 — Poor quality: polished prose hides state or target ambiguity

The contract may read smoothly while leaving refusal, recovery, or target meaning unclear. It succeeds when
observable states use literal, qualified language; it fails when presentation masks an incomplete promise.

#### Checklist

- [ ] ELECCONT-CK-AESTHETICS-01-01 — Success, pending, cancellation, refusal, failure, reduced mode, recovery, and support are visibly distinguishable wherever they apply.
- [ ] ELECCONT-CK-AESTHETICS-01-02 — Ordinary prose qualifies the operating system, operating-system integration, application identity, installed artifact identity, actor, action, and limit it means.

## Usage

### ELECCONT-SC-USAGE-01 — Normal case: every concrete external-entry record is complete

Deep links and file-open requests cross installation, readiness, instance, window, input, and data states. It
succeeds when each concrete path independently defines those states; it fails when an alternate-entry
umbrella supplies the only contract.

#### Checklist

- [ ] ELECCONT-CK-USAGE-01-01 — Each concrete external-entry path states target availability and starting application state.
- [ ] ELECCONT-CK-USAGE-01-02 — Each concrete external-entry path validates its input and authority before the application or operating system accepts a state change as final.
- [ ] ELECCONT-CK-USAGE-01-03 — Each concrete external-entry path delivers at most once to the correct instance and correct current or created window.
- [ ] ELECCONT-CK-USAGE-01-04 — Each concrete external-entry path gives both accepted delivery and rejected or failed delivery a visible outcome.
- [ ] ELECCONT-CK-USAGE-01-05 — Each concrete external-entry path states how accepted external input and current application data are preserved.
- [ ] ELECCONT-CK-USAGE-01-06 — Each concrete external-entry path provides a recovery or support path after cancellation, refusal, failure, or lost availability.

### ELECCONT-SC-USAGE-02 — Normal case: cold-start deep-link entry

An installed application is not running when a protocol URL arrives. It succeeds when the target can launch
and retain that input through readiness; it fails when late capture loses the URL or delivery happens before
the receiver can accept it.

#### Checklist

- [ ] ELECCONT-CK-USAGE-02-01 — The cold-start deep-link path states protocol registration and cold-launch availability for the exact target.
- [ ] ELECCONT-CK-USAGE-02-02 — The cold-start deep-link path captures the URL before readiness.
- [ ] ELECCONT-CK-USAGE-02-03 — The cold-start deep-link path delivers the URL only after the receiver is ready.
- Also applies: ELECCONT-CK-USAGE-01-01 (target availability and start state).
- Also applies: ELECCONT-CK-USAGE-01-02 (validation before a final state change).
- Also applies: ELECCONT-CK-USAGE-01-03 (correct instance and window).
- Also applies: ELECCONT-CK-USAGE-01-04 (visible success and failure).
- Also applies: ELECCONT-CK-USAGE-01-05 (accepted input and current data preservation).
- Also applies: ELECCONT-CK-USAGE-01-06 (recovery or support).

### ELECCONT-SC-USAGE-03 — Normal case: running-application deep-link entry

The application is already active when a protocol URL arrives. It succeeds when the URL reaches the current
accepted destination once without corrupting current work; it fails when a secondary or stale window owns
the effect.

#### Checklist

- [ ] ELECCONT-CK-USAGE-03-01 — The running-application deep-link path states running delivery support and current application state for the exact target.
- [ ] ELECCONT-CK-USAGE-03-02 — Each running-application deep-link or file-open path rejects routing to a superseded, destroyed, or unintended window.
- Also applies: ELECCONT-CK-USAGE-01-01 (target availability and start state).
- Also applies: ELECCONT-CK-USAGE-01-02 (validation before a final state change).
- Also applies: ELECCONT-CK-USAGE-01-03 (correct instance and window).
- Also applies: ELECCONT-CK-USAGE-01-04 (visible success and failure).
- Also applies: ELECCONT-CK-USAGE-01-05 (accepted input and current data preservation).
- Also applies: ELECCONT-CK-USAGE-01-06 (recovery or support).

### ELECCONT-SC-USAGE-04 — Normal case: cold-start file-open entry

An installed application is not running when an associated file arrives. It succeeds when the target retains
and validates the file request through readiness; it fails when launch, access, type, or contract validation
is skipped or late.

#### Checklist

- [ ] ELECCONT-CK-USAGE-04-01 — The cold-start file-open path states file association and cold open-event availability for the exact target.
- [ ] ELECCONT-CK-USAGE-04-02 — The cold-start file-open path captures the file reference before readiness.
- [ ] ELECCONT-CK-USAGE-04-03 — The cold-start file-open path validates the file type, access, and accepted file contract before delivery.
- Also applies: ELECCONT-CK-USAGE-01-01 (target availability and start state).
- Also applies: ELECCONT-CK-USAGE-01-02 (validation before a final state change).
- Also applies: ELECCONT-CK-USAGE-01-03 (correct instance and window).
- Also applies: ELECCONT-CK-USAGE-01-04 (visible success and failure).
- Also applies: ELECCONT-CK-USAGE-01-05 (accepted input and current data preservation).
- Also applies: ELECCONT-CK-USAGE-01-06 (recovery or support).

### ELECCONT-SC-USAGE-05 — Normal case: running-application file-open entry

The application is already active when a file-open request arrives. It succeeds when the accepted file opens
once in the correct instance and window without losing current work; it fails through duplicate delivery,
stale routing, or destructive replacement.

#### Checklist

- [ ] ELECCONT-CK-USAGE-05-01 — The running-application file-open path states running file-open support and current application state for the exact target.
- Also applies: ELECCONT-CK-USAGE-03-02 (running external input rejects a stale or unintended window).
- Also applies: ELECCONT-CK-USAGE-01-01 (target availability and start state).
- Also applies: ELECCONT-CK-USAGE-01-02 (validation before a final state change).
- Also applies: ELECCONT-CK-USAGE-01-03 (correct instance and window).
- Also applies: ELECCONT-CK-USAGE-01-04 (visible success and failure).
- Also applies: ELECCONT-CK-USAGE-01-05 (accepted input and current data preservation).
- Also applies: ELECCONT-CK-USAGE-01-06 (recovery or support).

## Consistency

### ELECCONT-SC-CONSISTENCY-01 — Rule violation: a Preference overrides a target or authority limit

A recovery or target default conflicts with a stronger limit. It succeeds when the stronger limit controls
and the contract remains target-specific; it fails when preference, convenience, or another target's
behavior silently expands the promise.

#### Checklist

- [ ] ELECCONT-CK-CONSISTENCY-01-01 — Every Rule and accepted product, accessibility, security, and user-authority limit overrides each conflicting Preference.
- [ ] ELECCONT-CK-CONSISTENCY-01-02 — No target claim is inferred from source behavior, development behavior, or success on another operating system or architecture.
- [ ] ELECCONT-CK-CONSISTENCY-01-03 — Every unsupported installed state or transition is stated explicitly for the affected target.

## Risk

### ELECCONT-SC-RISK-01 — Normal case: the safe-recovery default applies

A recoverable interruption leaves accepted user input or a usable state that can be preserved safely. It
succeeds by maintaining continuity; it fails when ordinary recovery silently discards the accepted work.

#### Checklist

- [ ] ELECCONT-CK-RISK-01-01 — The safe-recovery default applies only to a recoverable lifecycle interruption when accepted input or usable state can be preserved safely.
- [ ] ELECCONT-CK-RISK-01-02 — An applicable safe-recovery default preserves accepted user input.
- [ ] ELECCONT-CK-RISK-01-03 — An applicable safe-recovery default restores a usable state.

### ELECCONT-SC-RISK-02 — Expected failure: safe recovery is unsafe or impossible

Restoration cannot satisfy a stronger condition. It succeeds only through one named departure condition and
a visible safe outcome; it fails through silent refusal, unsafe restoration, lost safe data, or absent help.

#### Checklist

- [ ] ELECCONT-CK-RISK-02-01 — Every safe-recovery departure names security, incompatible data, or unsupported target behavior as the condition that makes restoration unsafe or impossible.
- [ ] ELECCONT-CK-RISK-02-02 — Every safe-recovery departure refuses or stops visibly.
- [ ] ELECCONT-CK-RISK-02-03 — Every safe-recovery departure preserves data when safe.
- [ ] ELECCONT-CK-RISK-02-04 — Every safe-recovery departure provides a recovery or support path.

### ELECCONT-SC-RISK-03 — Adversarial: a cosmetic or convenience reason imitates a departure

A proposal avoids the safe-recovery default for a reason unrelated to safety or possibility. It succeeds by
rejecting that departure; it fails when an easier implementation or polished fallback is treated as proof.

#### Checklist

- [ ] ELECCONT-CK-RISK-03-01 — A departure supported only by convenience, implementation cost, visual novelty, personal taste, or untested preference is rejected.

## Overall

### ELECCONT-SC-OVERALL-01 — Normal case: every retained transition is independently decidable

A complete state map lets a cold reader decide the installed promise without inferring a field from another
transition. It succeeds when every retained transition carries the same complete record; it fails when a
generic success, failure, or recovery statement hides a missing field.

#### Checklist

- [ ] ELECCONT-CK-OVERALL-01-01 — Every retained transition states its target operating system and architecture, application identity, and installed artifact identity.
- [ ] ELECCONT-CK-OVERALL-01-02 — Every retained transition states its affected actor, starting state, trigger, availability, observable result, state change the application or operating system accepts as final, and resulting state.
- [ ] ELECCONT-CK-OVERALL-01-03 — Every retained transition states its accepted-input treatment, current-data treatment, and cancellation behavior.
- [ ] ELECCONT-CK-OVERALL-01-04 — Every retained transition states its timeout and retry limit, including when either field is not applicable.
- [ ] ELECCONT-CK-OVERALL-01-05 — Every retained transition states how its failure is shown and its diagnostics requirement.
- [ ] ELECCONT-CK-OVERALL-01-06 — Every retained transition states its recovery, support path, and evidence required to establish the observable result.
